"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeCard } from '../Components/RecipeCard';
import { RecipeSkeleton } from './RecipeSkeleton';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("something healthy for dinner");
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

  if (loading) return <RecipeSkeleton />;

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
          <RecipeCard key={recipe.id} recipe={recipe} />
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

