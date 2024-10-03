"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, X } from 'lucide-react';
import { Recipe } from './../types';
import Link from 'next/link';

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

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="mb-4 position-relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        {recipes.map((recipe, index) => (
          <div key={index} className="d-flex align-items-center bg-light p-3 rounded mb-3">
            <div className="me-3" style={{ width: '64px', height: '64px', backgroundColor: '#e0e0e0', borderRadius: '8px' }}></div>
            <div className="flex-grow-1">
              <h2 className="h5 mb-1">{recipe.title}</h2>
              <p className="text-muted mb-0">{recipe.cookingTime} min.</p>
            </div>
            <button className="btn btn-link text-muted">
              <Heart size={24} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => query && fetchOtherRecipes()}
        className="btn btn-primary w-100 mt-4"
      >
        I don't like these
      </button>
    </div>
  );
}