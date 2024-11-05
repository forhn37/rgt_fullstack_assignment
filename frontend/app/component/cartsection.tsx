// app/components/Cartsection.tsx
import React from 'react';

interface Order {
  food: string;
  quantity: number;
}

interface CartsectionProps {
  cartItems: Order[];
  clearCart: () => void;
  removeFromCart: (index: number) => void;
}

export default function Cartsection({ cartItems, clearCart, removeFromCart }: CartsectionProps) {
  const sendOrderToBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      });

      if (!response.ok) {
        throw new Error('Failed to send order');
      }

      alert('주문이 성공적으로 전송되었습니다!');
      clearCart();
    } catch (error) {
      console.error('Error sending order:', error);
      alert('주문 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">장바구니</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index} className="p-2 border-b flex justify-between items-center">
            <div>
              <span>{item.food}</span>
              <span> - {item.quantity}개</span>
            </div>
            <button
              onClick={() => removeFromCart(index)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={sendOrderToBackend}
        className="w-full mt-4 py-2 bg-green-500 text-white rounded"
      >
        주문 전송
      </button>
    </div>
  );
}
