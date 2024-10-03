import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const removeFavorite = (fav: Recipe) => {
    console.log('Removing favorite:', fav);
    setFavorites(favorites.filter(item => item.id !== fav.id));
  };

  useEffect(() => {
    console.log("Favorites: ", favorites);
  }, [favorites]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  if (favorites.length < 1) {
    return null;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 h2" style={{ fontWeight: 'bold' }}>Favorites</h2>
      <div className="row">
        {favorites.map((fav) => (
          <div key={fav.id} className="d-flex align-items-center bg-light rounded mb-3" style={{ boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', paddingLeft: 0 }}>
            <div style={{ flexShrink: 0 }}>
              <img
                src={fav.imageUrl}
                alt={fav.title}
                className="me-3"
                style={{ height: '100%', borderRadius: '8px' }} />
            </div>
            <div className="flex-grow-1">
              <h2 className="h5 mb-1">
                <Link href={`/recipe/${fav.title}/${fav.cookingTime}`} className="text-decoration-none" style={{ color: 'black' }}>
                  {fav.title}
                </Link>
              </h2>
              <p className="mb-0">{fav.cookingTime} min.</p>
            </div>
            <button 
              className="btn btn-link text-muted" 
              onClick={() => removeFavorite(fav)}
            >
              <Heart size={24} color="#65558F" fill='#65558F' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
interface FavoriteRecipe extends Recipe {
  uniqueId: string;
}

interface FavouriteRecipeComponentProps {
  recipe: Recipe;
  favorites: FavoriteRecipe[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteRecipe[]>>;
}

export const FavouriteRecipeComponent: React.FC<FavouriteRecipeComponentProps> = ({ recipe, favorites, setFavorites }) => {
  const generateUniqueId = (recipe: Recipe): string => {
    return `${recipe.id}-${recipe.title.replace(/\s+/g, '-').toLowerCase()}`;
  };

  const toggleFavorite = (recipe: Recipe): void => {
    const uniqueId = generateUniqueId(recipe);
    const exists = favorites.some((fav) => fav.uniqueId === uniqueId);
    
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.uniqueId !== uniqueId));
    } else {
      const newFavorite: FavoriteRecipe = { ...recipe, uniqueId };
      setFavorites([...favorites, newFavorite]);
    }
  };

  useEffect(() => {
    console.log("New Favorites: ", favorites);
  }, [favorites]);

  const isFavorite = favorites.some((fav) => fav.uniqueId === generateUniqueId(recipe));

  return (
    <Heart
      size={24}
      color='#65558F'
      onClick={() => toggleFavorite(recipe)}
      fill={isFavorite ? '#65558F' : 'none'}
    />
  );
};