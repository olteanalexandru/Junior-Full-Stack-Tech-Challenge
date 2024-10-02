import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Recipe } from './../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that suggests recipes based on user descriptions." },
        { role: "user", content: `Suggest 5 recipes for: ${query}. Return the response as a JSON array of objects, each with 'id' and 'title' properties.` }
      ],
    });

    const recipes: Recipe[] = JSON.parse(completion.choices[0].message?.content || '[]');
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error in getRecipes:', error);
    return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 });
  }
}
