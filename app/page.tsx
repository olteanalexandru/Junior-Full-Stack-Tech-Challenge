  'use client';
  import { useState } from 'react';
import { useRouter } from 'next/navigation';
  
  
  export default function Home() {
    const [query, setQuery] = useState<string>('');
 const router = useRouter();
  
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`/recipes?query=${encodeURIComponent(query)}`);
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
      </div>
    );
  }
  


  