// app/components/Mainsection.tsx
"use client";
import React from 'react';
import Image from 'next/image';

export interface Order {
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
      { name: '짜장면', image: '/C1.webp' },
      { name: '짬뽕', image: '/C2.webp' },
      { name: '볶음밥', image: '/C3.webp' },
      { name: '고추잡채밥', image: '/C4.webp' },
      { name: '깐풍기', image: '/C5.webp' },
      { name: '양장피', image: '/C6.webp' },
    ],
    italian: [
      { name: '펜네', image: '/i1.webp' },
      { name: '라자냐', image: '/i2.webp' },
      { name: '포모도로', image: '/i3.webp' },
      { name: '알프레도', image: '/i4.webp' },
      { name: '까르보나라', image: '/i5.webp' },
      { name: '봉골레', image: '/i6.webp' },
    ],
    korean: [
      { name: '김치찌개', image: '/k1.webp' },
      { name: '동태찌개', image: '/k2.webp' },
      { name: '된장찌개', image: '/k3.webp' },
      { name: '매운탕', image: '/k4.webp' },
      { name: '부대찌개', image: '/k5.webp' },
      { name: '짜글이', image: '/k6.webp' },
    ],
  };

  // 주문 내역을 테이블 형식으로 렌더링
  if (selectedCategory === 'orders') {
    // category를 상수선언으로 변경하지 못하도록 설정
    const categories = ['chinese', 'italian', 'korean'] as const;

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">주문 내역</h2>
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-2">
              {/* 첫글자 대문자 설정 - 타이틀설정 */}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <table className="w-full border-2">
              <thead>
                <tr >
                  <th className="border p-2 text-center">주문 번호</th>
                  <th className="border p-2 text-center">메뉴명</th>
                  <th className="border p-2 text-center">수량</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory
                  .filter((order) => order.category === category)
                  .map((order) => (
                    <tr key={`${order.food}-${order.orderNumber}`}>
                      <td className="border p-2 text-center">{order.orderNumber}</td>
                      <td className="border p-2 text-center">{order.food}</td>
                      <td className="border p-2 text-center">{order.quantity}</td>
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
      <div className="grid grid-cols-2 gap-4">
        {menuItems[selectedCategory].map((item, index) => (
          <div key={index} onClick={() => openModal(item.name, item.image, selectedCategory as 'chinese' | 'italian' | 'korean')} className='flex flex-col justify-center'>
            <div className='flex flex-col justify-center items-center'>

              <Image src={item.image} alt={item.name} width={400} height={400} className="rounded-lg shadow" />
              <p className="text-center mt-2 font-semibold">{item.name}</p>


            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
