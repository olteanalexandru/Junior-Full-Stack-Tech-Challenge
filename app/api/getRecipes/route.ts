import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { Recipe } from './../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an API that only returns raw JSON data. You never respond with additional text, explanations, or descriptions." },
        { role: "user", content: `Suggest 5 recipes for: ${query}. Only return a JSON array of objects, each with 'id', 'title', and 'cookingTime' properties. 'cookingTime' should be in exact minutes. Do not include any other text or explanations, only the JSON.` }
      ],
    });

    console.log('Completion response:', completion.choices[0].message?.content);

    let recipes: Recipe[] = [];

    try {
      recipes = JSON.parse(completion.choices[0].message?.content || '[]');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON format from OpenAI');
    }

    // Ensure the response is a valid array of recipes
    if (!Array.isArray(recipes) || recipes.some(recipe => typeof recipe.id !== 'number' || typeof recipe.title !== 'string' || typeof recipe.cookingTime !== 'number' || !recipe.title.trim())) {
      throw new Error('Invalid recipe format' + JSON.stringify(recipes));
    }

    // Fetch images for each recipe
    const recipesWithImages = await Promise.all(recipes.map(async (recipe) => {
      try {
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
          params: {
            query: recipe.title,
            per_page: 1,
          },
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        });

        const imageUrl = response.data.photos[0]?.src?.small || '';
        return { ...recipe, imageUrl };
      } catch (error) {
        console.error(`Error fetching image for ${recipe.title}:`, error);
        return { ...recipe, imageUrl: '' };
      }
    }));

    return NextResponse.json({ recipes: recipesWithImages });
  } catch (error) {
    console.error('Error in getRecipes:', error);
    return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 });
  }
}



