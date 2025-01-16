import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/ApiServices';

const Data = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Data</h2>
      <ul>
        <li>
          {data.name} - {data.age}
        </li>
      </ul>
    </div>
  );
};

export default Data;