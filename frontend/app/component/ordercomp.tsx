// frontend/app/order/page.tsx
"use client";

import { useState } from 'react';

interface Order {
  food: string;
  quantity: number;
}

export default function Order() {
  const [food, setFood] = useState<Order['food']>('Pizza');
  const [quantity, setQuantity] = useState<Order['quantity']>(1);
  const [message, setMessage] = useState<string>('');

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ food, quantity }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
    } else {
      setMessage('주문에 실패했습니다');
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">주문 페이지</h1>
      <form onSubmit={handleOrderSubmit} className="space-y-4 p-4 border border-gray-300 rounded shadow-lg w-80">
        <label className="block">
          <span className="text-gray-700">음식 선택:</span>
          <div className="flex space-x-2 mt-2">
            <button type="button" onClick={() => setFood('Pizza')} className={`px-4 py-2 border rounded ${food === 'Pizza' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pizza</button>
            <button type="button" onClick={() => setFood('Burger')} className={`px-4 py-2 border rounded ${food === 'Burger' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Burger</button>
            <button type="button" onClick={() => setFood('Pasta')} className={`px-4 py-2 border rounded ${food === 'Pasta' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pasta</button>
          </div>
        </label>
        
        <label className="block">
          <span className="text-gray-700">수량:</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            min="1"
            required
            className="mt-2 p-2 border rounded w-full"
          />
        </label>
        
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">주문하기</button>
      </form>
      {message && <p className="mt-4 text-lg font-semibold text-blue-600">{message}</p>}
    </div>
  );
}
