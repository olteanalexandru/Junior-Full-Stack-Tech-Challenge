"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, X } from 'lucide-react';
import { Recipe, FavoriteRecipe } from './../types';
import Link from 'next/link';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FavouriteRecipeComponent } from '../Components/Favorites';


export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("something healthy for dinner");
  const [favorites, setFavorites] = useLocalStorage<FavoriteRecipe[]>(
    'favorites',
    []
  ) as [FavoriteRecipe[], React.Dispatch<React.SetStateAction<FavoriteRecipe[]>>];
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

  const fetchOtherRecipes = async () => {
    if (query) {
      setLoading(true);
      try {
        const response = await fetch('/api/suggestOtherRecipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, avoid: recipes }),
        });
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
      setLoading(false);
    }
  };


  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="mb-4 position-relative">
        <input
          type="text"
          placeholder={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
        if (e.key === 'Enter') {
          fetchRecipes(searchQuery);
        }
          }}
          className="form-control pr-5"
        />
        <button 
          className="position-absolute top-50 end-0 translate-middle-y btn btn-link text-decoration-none"
          onClick={() => setSearchQuery('')}
        >
          <X size={18} />
        </button>
      </div>

      <h1 className="mb-4">Suggested Recipes</h1>




      <div className="row">
      {recipes.map((recipe) => (
  <div key={recipe.id} className="d-flex align-items-center bg-light p-3 rounded mb-3">
    <img src={recipe.imageUrl} alt={recipe.title} className="me-3" style={{ width: '64px', height: '64px', borderRadius: '8px' }} />
    <div className="flex-grow-1">
      <h2 className="h5 mb-1">
        <Link href={`/recipe/${recipe.title}/${recipe.cookingTime}`} className="text-decoration-none" style={{ color: 'black' }}>
          {recipe.title}
        </Link>
      </h2>
      <p className="mb-0">{recipe.cookingTime} min.</p>
    </div>
    <FavouriteRecipeComponent recipe={recipe} favorites={favorites} setFavorites={setFavorites} />
  </div>
))}





      </div>

      <div className="d-flex justify-content-center">
        <button 
          onClick={() => query && fetchOtherRecipes()}
          className="btn btn-primary w-50 mt-4"
        >
          I don't like these
        </button>
      </div>
    </div>
  );
}


