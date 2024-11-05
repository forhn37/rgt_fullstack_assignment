// app/components/Mainsection.tsx
"use client";
import React from 'react';
import Image from 'next/image';

interface Order {
  orderNumber: number;
  food: string;
  quantity: number;
  category: 'chinese' | 'italian' | 'korean';
}

interface MainsectionProps {
  selectedCategory: 'chinese' | 'italian' | 'korean' | 'orders';
  orderHistory: Order[];
  openModal: (itemName: string, imageSrc: string, category: 'chinese' | 'italian' | 'korean') => void;
}

export default function Mainsection({ selectedCategory, orderHistory, openModal }: MainsectionProps) {
  const menuItems = {
    chinese: [
      { name: 'Chinese Food 1', image: '/jjajangmyun.jpg' },
      { name: 'Chinese Food 2', image: '/jjamppong.jpg' },
    ],
    italian: [
      { name: 'Italian Food 1', image: '/images/italian1.jpg' },
      { name: 'Italian Food 2', image: '/images/italian2.jpg' },
    ],
    korean: [
      { name: 'Korean Food 1', image: '/images/korean1.jpg' },
      { name: 'Korean Food 2', image: '/images/korean2.jpg' },
    ],
  };
// 주문 내역을 테이블 형식으로 렌더링
  if (selectedCategory === 'orders') {
    // category를 상수선언으로 변경하지 못하도록 설정
    const categories = ['chinese', 'italian', 'korean'] as const;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">주문 내역</h2>
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">
              {/* 첫글자 대문자 설정 - 타이틀설정 */}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">주문 번호</th>
                  <th className="border p-2">메뉴명</th>
                  <th className="border p-2">수량</th>
                  <th className="border p-2">상태</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory
                  .filter((order) => order.category === category)
                  .map((order) => (
                    <tr key={order.orderNumber}>
                      <td className="border p-2">{order.orderNumber}</td>
                      <td className="border p-2">{order.food}</td>
                      <td className="border p-2">{order.quantity}</td>
                      <td className="border p-2">대기 중</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{selectedCategory} 메뉴</h2>
      <div className="grid grid-cols-2 gap-4">
        {menuItems[selectedCategory].map((item, index) => (
          <div key={index} onClick={() => openModal(item.name, item.image, selectedCategory as 'chinese' | 'italian' | 'korean')}>
            <Image src={item.image} alt={item.name} width={150} height={150} className="object-cover rounded-lg shadow" />
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
