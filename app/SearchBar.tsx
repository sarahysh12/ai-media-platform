"use client";
import { useState } from "react";

interface SearchResult {
    id: string;
    values: number[];
    metadata: {
        text: string;
    };
    score: number;
}

export const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = async() => {
        const response = await fetch("/api/search", {
            method: 'POST',
            body: JSON.stringify({ query }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json();
        setResults(data);
    }

  return (
    <div>
      <input type="text" placeholder="Search media..." onChange={(e) => setQuery(e.target.value)} value={query} className="border px-2 py-1"/>
      <button onClick={handleSearch} className="ml-2 px-3 py-1 bg-blue-500 text-white">Search</button>

      <ul>
        {results?.map((item, idx) => <li key={idx} className="text-sm text-white">{item?.metadata.text} (score: {item?.score.toFixed(3)})</li>)}
      </ul>
    </div>
  )
}