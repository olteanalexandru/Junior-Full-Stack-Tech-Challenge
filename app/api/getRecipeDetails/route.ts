import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Recipe } from './../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides recipe details." },
        { role: "user", content: `Provide details for the recipe with id ${id}. Include title, ingredients, and instructions. Return the response as a JSON object.` }
      ],
    });

    const recipe: Recipe = JSON.parse(completion.choices[0].message?.content || '{}');
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error in getRecipeDetails:', error);
    return NextResponse.json({ error: 'Error fetching recipe details' }, { status: 500 });
  }
}
