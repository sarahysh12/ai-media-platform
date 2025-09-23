export const searchMovies = async(query: string) => {
    try {
      const response = await fetch("/api/search", {
          method: 'POST',
          body: JSON.stringify({ query }),
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