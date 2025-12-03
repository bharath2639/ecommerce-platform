// apps/shop/src/app/page.tsx
'use client'; // Required for React hooks (useState)

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  // 🌍 Define Base URL (Cloud or Local)
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToken('');
    
    try {
      // 1. Call your NestJS Auth Service (Dynamic URL)
      const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Success! Save/Show the token
        setToken(data.token);
        console.log('JWT Received:', data.token);
      } else {
        setError(data.message || 'Login Failed');
      }
    } catch (err) {
      setError('Could not connect to server. Is Auth Service running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>

        {/* RESULT DISPLAY */}
        {token && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded break-all text-xs">
            <strong>Success! Token:</strong> {token}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}