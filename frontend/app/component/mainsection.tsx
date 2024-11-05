// app/components/ContentArea.tsx
"use client"; // 클라이언트 컴포넌트 선언
import React from 'react';
import Image from 'next/image';

interface ContentAreaProps {
  selectedCategory: string;
}

export default function Mainsection({ selectedCategory }: ContentAreaProps) {
  const images: { [key: string]: string[] } = {
    chinese: [
      '/images/chinese1.jpg',
      '/images/chinese2.jpg',
      '/images/chinese3.jpg',
      '/images/chinese4.jpg',
      '/images/chinese5.jpg',
      '/images/chinese6.jpg',
    ],
    italian: [
      '/images/italian1.jpg',
      '/images/italian2.jpg',
      '/images/italian3.jpg',
      '/images/italian4.jpg',
      '/images/italian5.jpg',
      '/images/italian6.jpg',
    ],
    korean: [
      '/images/korean1.jpg',
      '/images/korean2.jpg',
      '/images/korean3.jpg',
      '/images/korean4.jpg',
      '/images/korean5.jpg',
      '/images/korean6.jpg',
    ],
    orders: [],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
      <div className="grid grid-cols-2 gap-4">
        {images[selectedCategory]?.map((image, index) => (
          <Image
            key={index}
            src={image}
            width={1290}
            height={1290}
            alt={`${selectedCategory}-${index + 1}`}
            className="w-full h-48 object-cover rounded-lg shadow"
          />
        ))}
      </div>
    </div>
  );
}
