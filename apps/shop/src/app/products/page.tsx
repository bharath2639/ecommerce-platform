'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌍 Define Base URLs (Cloud or Local)
  const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:3001';
  const ORDER_URL = process.env.NEXT_PUBLIC_ORDER_API_URL || 'http://localhost:3002';

  // 1. Fetch Products on Load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Hitting your Product Service (Dynamic URL)
        const res = await axios.get(`${PRODUCT_URL}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Handle "Buy Now" (The Saga Trigger)
  const buyProduct = async (productId: string) => {
    try {
      const userId = 'test-user-1'; // Hardcoded for demo
      // Hitting your Order Service (Dynamic URL)
      await axios.post(`${ORDER_URL}/api/orders`, {
        userId,
        productId,
        quantity: 1,
        price: 100, // Ideally fetching real price, but simplifying for now
      });
      alert('Order Placed! Check console logs for Saga updates.');
    } catch (error) {
      alert('Failed to place order.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Products...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">🔥 Super Scale Shop ({products.length} items)</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 truncate">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{product.description}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">${product.price}</span>
              <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                Stock: {product.stock}
              </span>
            </div>

            <button
              onClick={() => buyProduct(product.id)}
              disabled={product.stock === 0}
              className={`mt-4 w-full py-2 px-4 rounded text-white font-bold transition
                ${product.stock > 0 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}