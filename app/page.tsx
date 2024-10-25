  'use client';
  import { useState } from 'react';
import { useRouter } from 'next/navigation';
import  Favorites  from './Components/Favorites'; 
  
  
  export default function Home() {
    const [query, setQuery] = useState<string>('');

 const router = useRouter();
   
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`/recipes/?query=${encodeURIComponent(query)}`);
    };
  
    return (
      <div className="container mt-5">
        <form onSubmit={handleSearch}>
          <div className="input-group mb-3">
          <input
          type="text"
          className="form-control"
          placeholder="What do you feel like eating?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ 
            background: 'none', 
            color: 'grey', 
            borderColor: 'lightGrey', 
            borderRight: 'none', 
            borderTopLeftRadius: '50px', 
            borderBottomLeftRadius: '50px'
          }}
        />
        <button 
          className="btn btn-primary" 
          type="submit" 
          style={{ 
            background: 'none', 
            color: 'grey', 
            borderColor: 'lightGrey', 
            borderLeft: 'none', 
            borderTopRightRadius: '50px', 
            borderBottomRightRadius: '50px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 13L10.1 10.1M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

          </div>
          
        </form>
        <Favorites />
    </div>
    
  );
}
  


