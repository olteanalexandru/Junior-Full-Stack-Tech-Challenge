"use client";
import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';



const RecipeCard = ({ title, duration }: { title: string, duration: string }) => (
  <div className="card mb-3">
    <div className="card-body d-flex justify-content-between align-items-center">
      <div>
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">{duration}</p>
      </div>
      <Heart className="text-muted" size={24} />
    </div>
  </div>
);

const SuggestedRecipesPage = () => {
  const [searchQuery, setSearchQuery] = useState('something healthy for dinner');

  const recipes = [
    { title: 'Mashed potatoes', duration: '20 min.' },
    { title: 'Mashed potatoes', duration: '20 min.' },
    { title: 'Mashed potatoes', duration: '20 min.' },
    { title: 'Mashed potatoes', duration: '20 min.' },
    { title: 'Mashed potatoes', duration: '20 min.' },
  ];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <X size={18} />
            </button>
          </div>

          <h2 className="mb-4">Suggested recipes</h2>

          {recipes.map((recipe, index) => (
            <RecipeCard key={index} title={recipe.title} duration={recipe.duration} />
          ))}

          <button className="btn btn-secondary w-100 mt-3">I don't like these</button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedRecipesPage;