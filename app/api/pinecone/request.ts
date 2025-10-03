
export const searchMovies = async(query: string, limit: number = 5) => {
  try {
    const response = await fetch("/api/pinecone/search", {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search failed:', error);
  }
}

export const fetchAllMovies = async() => {
  try {
    const response = await fetch("/api/", {
      method: 'GET',
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search failed:', error);
  }
}