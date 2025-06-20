import { useEffect, useState } from 'react';

export default function SimpleApp() {
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testAPI() {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        setApiData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }
    testAPI();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Ko Lake Villa</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Ko Lake Villa - Error</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Ko Lake Villa - Gallery Test</h1>
      <p>API Connection: Working</p>
      <p>Gallery Images: {Array.isArray(apiData) ? apiData.length : 0}</p>
      <div>
        <h2>Sample Images:</h2>
        {Array.isArray(apiData) && apiData.slice(0, 3).map((img: any) => (
          <div key={img.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{img.title}</h3>
            <p>{img.description}</p>
            <p>Category: {img.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}