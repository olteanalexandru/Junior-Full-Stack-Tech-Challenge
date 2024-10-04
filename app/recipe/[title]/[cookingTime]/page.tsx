'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from '../../../types';
import { useLocalStorage } from '../../../hooks/useLocalStorage'; 
import  {FavouriteRecipeComponent}  from '../../../Components/Favorites';
import { RecipeSkeleton } from './RecipeSkeleton';


export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {title, cookingTime } = useParams() as { title: string; cookingTime: string };
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>(
    'favorites',
    []
  ) as [Recipe[], React.Dispatch<React.SetStateAction<Recipe[]>>];
  useEffect(() => {
    if (title && cookingTime) {
      const decodedTitle = decodeURIComponent(title);
      const normalizedCookingTime = normalizeCookingTime(cookingTime);

      const fav = favorites.find(
        (fav) =>
          fav.title === decodedTitle &&
          fav.cookingTime && fav.cookingTime == normalizedCookingTime && fav.instructions?.length > 0 && fav.ingredients?.length > 0
      );

      if (fav !== undefined) {
        setRecipe(fav);
        setLoading(false);
        console.log('Recipe found in favorites:', fav);
      } else {
        console.log('Recipe not found in favorites or not fully cached, fetching details...');
        
        fetchRecipeDetails(title, cookingTime);
        
      }
    }
  }, [title, cookingTime, favorites]);

  const normalizeCookingTime = (time: string) => time?.replace(/\D/g, '');

  const cacheRestOfRecipe = (recipe : Recipe) => {
    console.log("Checking if recipe is already in favorites" )



    if(!favorites.some((fav) =>  fav.instructions )  && favorites.some((fav) => fav.title == decodeURIComponent(title) && fav.cookingTime == cookingTime  ) ){
    if (recipe) {
        console.log("Caching rest of recipe")
     //add rest of elements to cache instead of appending new recipe
    setFavorites([...favorites.filter((fav) => fav.title !== decodeURIComponent(title) && fav.cookingTime !== cookingTime), { ...recipe }]);
    } 
} 
}

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
      cacheRestOfRecipe(data.recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
      
    }
  };




  

if (loading) return <RecipeSkeleton />;


  if (!recipe) return <div className="container mt-5">Recipe not found</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={recipe.imageUrlLarge} alt="Recipe" className="img-fluid mb-4" style={{ width: '20rem', height: 'auto' }} />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="mb-0">{recipe.title}</h1>
            <FavouriteRecipeComponent recipe={recipe} favorites={favorites} setFavorites={setFavorites} />
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



