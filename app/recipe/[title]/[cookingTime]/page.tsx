'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from '../../../types';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Heart } from 'lucide-react';

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { title, cookingTime } = useParams() as { title: string; cookingTime: string };
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

  useEffect(() => {
    if (title && cookingTime) {
      const decodedTitle = decodeURIComponent(title);
      const normalizedCookingTime = normalizeCookingTime(cookingTime);

      const fav = favorites.find(
        (fav) =>
          fav.title === decodedTitle &&
          fav.cookingTime && normalizeCookingTime(fav.cookingTime) === normalizedCookingTime && fav.instructions.length > 0 && fav.ingredients.length > 0
      );

      if (fav !== undefined) {
        setRecipe(fav);
        setLoading(false);
        console.log('Recipe found in favorites:', fav);
      } else {
        console.log('Recipe not found in favorites, fetching details...');
        console.log(
          'Searching in favorites process:',
          JSON.stringify(favorites),
          'title:',
          decodedTitle,
          'cookingTime:',
          normalizedCookingTime
        );
        fetchRecipeDetails(title, cookingTime);
      }
    }
  }, [title, cookingTime, favorites]);

  const normalizeCookingTime = (time: string) => time?.replace(/\D/g, '');

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

  const isFavorite = recipe && favorites.find((fav) => fav.title === recipe.title && fav.cookingTime === recipe.cookingTime) ? true : false;

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!recipe) return <div className="container mt-5">Recipe not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={recipe.imageUrl} alt="Recipe" className="img-fluid mb-4" style={{ width: '20rem', height: 'auto' }} />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0">{recipe.title}</h1>
            <Heart 
              onClick={addToFavorites} 
              size={24} 
              className={`cursor-pointer ${isFavorite ? 'text-danger' : 'text-muted'}`}
            />
          </div>
          <p className="text-muted">{recipe.cookingTime} mins</p>
        </div>
        <div className="col-md-6">
        
          <h2 className="mt-4">Ingredients:</h2>
          <ul className="list-unstyled">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 className="mt-4">Instructions:</h2>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index} className="mb-2">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}




