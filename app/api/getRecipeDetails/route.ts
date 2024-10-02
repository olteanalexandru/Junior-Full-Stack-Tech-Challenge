import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Recipe } from './../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title, cookingTime } = await req.json();

    if (!title || !cookingTime) {
      throw new Error('Missing title or cookingTime in request body');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides recipe details." },
        { role: "user", content: `Provide detailed information for the recipe with title "${title}" and cooking time "${cookingTime}". Include the title, ingredients, and instructions. Return the response as a valid JSON object with the keys: id, title, ingredients, instructions, and cookingTime.` }
      ],
    });

    console.log('Completion response for recipe details:', completion.choices[0].message?.content);

    let recipe: Recipe = {
      id: '',
      title: '',
      ingredients: [],
      instructions: [],
      cookingTime: ''
    };

    try {
      const responseContent = completion.choices[0].message?.content || '{}';
      if (!isValidJSON(responseContent)) {
        throw new Error('Invalid JSON format from OpenAI');
      }
      recipe = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON format from OpenAI');
    }

    // Ensure the response has valid properties for a recipe
    if (!recipe.title || !recipe.cookingTime || !recipe.ingredients.length || !recipe.instructions.length) {
      throw new Error('Incomplete recipe details: ' + JSON.stringify(recipe));
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error in getRecipeDetails:', error);
    return NextResponse.json({ error: 'Error fetching recipe details' }, { status: 500 });
  }
}

// Helper function to validate JSON
function isValidJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}



