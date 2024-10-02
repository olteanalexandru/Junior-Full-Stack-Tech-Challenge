'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from '../../../types';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { title, cookingTime } = useParams() as { title: string; cookingTime: string };
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

  useEffect(() => {
    if (title && cookingTime) {
      const fav = favorites.find((fav) => fav.title === title && fav.cookingTime === cookingTime) 
      if (fav !== undefined) {
        setRecipe(fav);
        setLoading(false);
        console.log('Recipe found in favorites:', fav);
      } else {
        console.log('Recipe not found in favorites, fetching details...');
        fetchRecipeDetails(title, cookingTime);
      }

    }
  }, [title, cookingTime]);

  const fetchRecipeDetails = async (title: string, cookingTime: string) => {
    setLoading(true);
  

    try {
      // Fetch recipe details if not in favorites
      const response = await fetch('/api/getRecipeDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, cookingTime }),
      });
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = () => {
    if (!recipe) return;
    setFavorites([...favorites, recipe]);
    alert('Recipe added to favorites!');
  };

  const isFavorite = recipe && favorites.find((fav) => fav.title === recipe.title && fav.cookingTime === recipe.cookingTime)  ? 'true' : 'false';

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!recipe) return <div className="container mt-5">Recipe not found</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{recipe.title}</h1>   
      {isFavorite && <span className="badge bg-danger">Favorite</span>}
      <p>Cooking Time: {recipe.cookingTime} minutes</p>
      <hr />
  
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

      <p>Cached data if it exists : {JSON.stringify(favorites.find((fav) => fav.title === recipe.title && fav.cookingTime === recipe.cookingTime))}

      </p>
    </div>
  );
}




