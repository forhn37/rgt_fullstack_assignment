// app/components/Cartsection.tsx
import React from 'react';

interface Order {
  food: string;
  quantity: number;
}

interface CartsectionProps {
  cartItems: Order[];
}

export default function Cartsection({ cartItems }: CartsectionProps) {
  // 주문 내역을 백엔드로 전송하는 함수
  const sendOrderToBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems), // 장바구니 데이터를 JSON 형식으로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error('Failed to send order');
      }

      // 주문이 성공적으로 전송된 경우 처리 (예: 성공 알림, 장바구니 비우기 등)
      alert('주문이 성공적으로 전송되었습니다!');
      // 장바구니 비우기 등 추가 로직 필요 시 여기에 작성
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
          <li key={index} className="p-2 border-b flex justify-between">
            <span>{item.food}</span>
            <span>{item.quantity}개</span>
          </li>
        ))}
      </ul>
      {/* 주문 전송 버튼 */}
      <button
        onClick={sendOrderToBackend}
        className="w-full mt-4 py-2 bg-green-500 text-white rounded"
      >
        주문 전송
      </button>
    </div>
  );
}
