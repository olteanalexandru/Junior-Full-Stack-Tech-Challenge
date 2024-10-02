'use client';
import Link from 'next/link';
import { Recipe } from './../types';
import { useLocalStorage } from './../hooks/useLocalStorage';

export default function Favorites() {
  const [favorites] = useLocalStorage<Recipe[]>('favorites', []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Favorite Recipes</h1>
      <div className="row">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <Link href={`/recipe/${recipe.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

