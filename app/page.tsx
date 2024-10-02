  'use client';
  import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
  
  
  export default function Home() {
    const [query, setQuery] = useState<string>('');
    const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favorites', []);

 const router = useRouter();
 const listOfFavorites = (
  <div className="mt-5">
    <h2>Favorites</h2>
    <ul className="list-group">
      {favorites.map((fav) => (
        <li key={fav.id} className="list-group-item d-flex justify-content-between align-items-center">
          <a href={`/recipe/${fav.title}/${fav.cookingTime}`}>{fav.title}</a>
          <button 
            className="btn btn-outline-danger btn-sm" 
            onClick={() => setFavorites(favorites.filter((item) => item.id !== fav.id))}
          >
            ❤️
          </button>
        </li>
      ))}
    </ul>
  </div>
);
 
  
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`/recipes/?query=${encodeURIComponent(query)}`);
    };
  
    return (
      <div className="container mt-5">
        <h1 className="mb-4">AI-Powered Recipe Finder</h1>
        <form onSubmit={handleSearch}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Describe what you want to eat..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>
      {listOfFavorites}
    </div>
  );
}
  


  