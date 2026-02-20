'use client';
import { useState, useEffect } from 'react';
import EbasiAPI from '../../lib/api';  // Changed from ../lib/api to ../../lib/api

export default function TestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      console.log('Loading products...');
      const data = await EbasiAPI.getProducts();
      console.log('Received data:', data);
      setProducts(data.results || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>EBASI STORE - API Test</h1>
      <h2>Products ({products.length}):</h2>
      {products.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{product.name}</h3>
          <p>Price: ₹{product.price}</p>
          <p>Category: {product.category?.name}</p>
          <p>SKU: {product.sku}</p>
        </div>
      ))}
      
      {products.length === 0 && (
        <div>
          <p>No products found!</p>
          <p>Django API Test: <a href="http://127.0.0.1:8000/api/v1/products/" target="_blank">Click here</a></p>
        </div>
      )}
    </div>
  );
}
