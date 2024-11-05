// app/components/Mainsection.tsx
"use client";
import React from 'react';
import Image from 'next/image';

interface MainsectionProps {
  selectedCategory: string;
  openModal: (itemName: string, imageSrc: string) => void;
}

export default function Mainsection({ selectedCategory, openModal }: MainsectionProps) {
  const images: { [key: string]: { src: string; name: string }[] } = {
    chinese: [
      { src: '/images/chinese1.jpg', name: 'Chinese Food 1' },
      { src: '/images/chinese2.jpg', name: 'Chinese Food 2' },
      { src: '/images/chinese3.jpg', name: 'Chinese Food 3' },
      { src: '/images/chinese4.jpg', name: 'Chinese Food 4' },
      { src: '/images/chinese5.jpg', name: 'Chinese Food 5' },
      { src: '/images/chinese6.jpg', name: 'Chinese Food 6' },
    ],
    italian: [
      { src: '/images/italian1.jpg', name: 'Italian Food 1' },
      { src: '/images/italian2.jpg', name: 'Italian Food 2' },
      { src: '/images/italian3.jpg', name: 'Italian Food 3' },
      { src: '/images/italian4.jpg', name: 'Italian Food 4' },
      { src: '/images/italian5.jpg', name: 'Italian Food 5' },
      { src: '/images/italian6.jpg', name: 'Italian Food 6' },
    ],
    korean: [
      { src: '/images/korean1.jpg', name: 'Korean Food 1' },
      { src: '/images/korean2.jpg', name: 'Korean Food 2' },
      { src: '/images/korean3.jpg', name: 'Korean Food 3' },
      { src: '/images/korean4.jpg', name: 'Korean Food 4' },
      { src: '/images/korean5.jpg', name: 'Korean Food 5' },
      { src: '/images/korean6.jpg', name: 'Korean Food 6' },
    ],
    orders: [],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
      <div className="grid grid-cols-2 gap-4">
        {images[selectedCategory]?.map((item, index) => (
          <div key={index} onClick={() => openModal(item.name, item.src)} className="cursor-pointer">
            <Image
              src={item.src}
              width={1290}
              height={1290}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg shadow"
            />
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
