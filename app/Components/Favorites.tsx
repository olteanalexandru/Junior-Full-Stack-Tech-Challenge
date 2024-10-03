import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Recipe } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

  const removeFavorite = (fav: Recipe) => {
    setFavorites(favorites.filter(item => item.id !== fav.id));
  };

  if (favorites.length < 1) {
    return null;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 h2">Favorites</h2>
      <div className="row">
        {favorites.map((fav) => (
          <div key={fav.id} className="d-flex align-items-center bg-light p-3 rounded mb-3">
            <img
              src={fav.imageUrl}
              alt={fav.title}
              className="me-3"
              style={{ width: '64px', height: '64px', borderRadius: '8px' }}
            />
            <div className="flex-grow-1">
              <h2 className="h5 mb-1">
                <Link href={`/recipe/${fav.title}/${fav.cookingTime}`} className="text-decoration-none">
                  {fav.title}
                </Link>
              </h2>
              <p className="text-muted mb-0">{fav.cookingTime} min.</p>
            </div>
            <button 
              className="btn btn-link text-muted" 
              onClick={() => removeFavorite(fav)}
            >
              <Heart size={24} color="gray" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

