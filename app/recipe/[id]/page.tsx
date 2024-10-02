'use client';
// app/recipe/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from './../../types';
import { useLocalStorage } from './../../hooks/useLocalStorage';

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams(); // Use this hook to access route params
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

  useEffect(() => {
    if (id) {
      fetchRecipeDetails(id);
    }
  }, [id]);

  const fetchRecipeDetails = async (recipeId: string | string[]) => {
    setLoading(true);
    try {
      const response = await fetch('/api/getRecipeDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Array.isArray(recipeId) ? recipeId[0] : recipeId }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
    setLoading(false);
  };

  const addToFavorites = () => {
    if (!recipe) return;
    setFavorites([...favorites, recipe]);
    alert('Recipe added to favorites!');
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!recipe) return <div className="container mt-5">Recipe not found</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{recipe.title}</h1>
      <button onClick={addToFavorites} className="btn btn-primary mb-4">
        Add to Favorites
      </button>
      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

