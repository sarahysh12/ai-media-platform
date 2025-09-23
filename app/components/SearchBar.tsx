"use client";
import { useEffect, useState } from "react";

import { searchMovies } from "../api/pinecone/request";
import { SearchResults } from "./SearchResults";
import { ResultItemType } from "./SearchResults";

export const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ResultItemType[]>([]);
    const [isRequestPending, setIsRequestPending] = useState(false);

     useEffect(() => {
       searchMovies('give me 10 random movies').then(data => {
         setResults(data)
       })
     }, [])

     const handleSearch = async () => {
       setIsRequestPending(true);
       try {
         const data = await searchMovies(query);
         setResults(data);
       } catch (error) {
         console.error('Search failed:', error);
       } finally {
         setIsRequestPending(false);
       }
     }

  return (
    <div>
      <div className="flex gap-2">
        <input type="text" placeholder="Search media..." onChange={(e) => setQuery(e.target.value)} value={query} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="border px-2 py-1 flex-1"/>
        <button onClick={handleSearch} className="px-3 py-1 bg-blue-500 text-white disabled:bg-blue-300 flex items-center gap-2" disabled={isRequestPending}>
          {isRequestPending && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {'Search'}
        </button>
      </div>
      <SearchResults data={results} />
    </div>
  )
}