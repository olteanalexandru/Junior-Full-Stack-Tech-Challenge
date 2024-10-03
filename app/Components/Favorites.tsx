import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Recipe } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

  const removeFavorite = (fav: Recipe) => {
    setFavorites(favorites.filter(item => item !== fav));
  };

  if (favorites.length < 1) {
    return null;
  }
console.log(favorites)
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





export const FavouriteRecipeComponent = ({ recipe }: { recipe: Recipe }) => {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);
  console.log("recived the recipe: ", recipe)
  const toggleFavorite = (recipe: Recipe) => {

  
   
    if (favorites.find((fav) => fav.title === recipe.title && fav.cookingTime === recipe.cookingTime)) {
      setFavorites(favorites.filter((fav) => fav.title !== recipe.title || fav.cookingTime !== recipe.cookingTime));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <Heart
      size={24}
      color='#65558F'
      onClick={() => toggleFavorite(recipe)}
      fill={favorites.some((fav) => fav.title === recipe.title && fav.cookingTime == recipe.cookingTime) ? '#65558F' : 'none'}
    />
  );
};