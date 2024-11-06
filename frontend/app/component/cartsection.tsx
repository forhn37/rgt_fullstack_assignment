// app/components/Cartsection.tsx
import React from 'react';
import { useState } from 'react';
import SuccessModal from './successmodal';

interface Order {
  orderNumber: number;
  food: string;
  quantity: number;
  category: 'chinese' | 'italian' | 'korean';
}

interface CartsectionProps {
  cartItems: Order[];
  clearCart: () => void;
  onSubmitOrder: (completedOrders: Order[]) => void;
  updateCartItems: (updatedItems: Order[]) => void; // 새로 추가된 props
}

export default function Cartsection({ cartItems, clearCart, onSubmitOrder, updateCartItems }: CartsectionProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const sendOrderToBackend = async () => {
    try {
      // 주문 번호가 업데이트된 데이터를 받아오기
      const ordersWithUpdatedNumbers = onSubmitOrder(cartItems);

      const response = await fetch('http://localhost:8000/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordersWithUpdatedNumbers),
      });

      if (!response.ok) {
        throw new Error('Failed to send order');
      }

      setIsModalOpen(true);
      clearCart(); // 장바구니 비우기
    } catch (error) {
      console.error('Error sending order:', error);
      alert('주문 전송 중 오류가 발생했습니다.');
    }
  };

  // 장바구니에서 항목 삭제
  const removeItemFromCart = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    updateCartItems(updatedItems);
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
              onClick={() => removeItemFromCart(index)}
              className="text-red-500 hover:text-red-700"
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
      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
