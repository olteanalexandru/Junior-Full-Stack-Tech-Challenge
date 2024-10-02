'use client';
// app/recipes/page.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from './../types';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams(); 
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      fetchRecipes(query);
    }
  }, [query]);

  const fetchRecipes = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/getRecipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };


  const fetchOtherRecipes = async (searchQuery: string, ) => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggestOtherRecipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery , avoid: recipes }),
      });
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Suggested Recipes</h1>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.title} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">Cooking Time: {recipe.cookingTime} minutes</p>

                
                <Link href={`/recipe/${recipe.title}/${recipe.cookingTime}`} className="btn btn-primary">
                  View Details
                </Link>


              </div>
            </div>
          </div>
        ))}

      <p> i don't like these recipes</p>
      <button onClick={() => query && fetchOtherRecipes(query)} className="btn btn-primary">
        Get more recipes
      </button>
      </div>
    </div>
  );
}
