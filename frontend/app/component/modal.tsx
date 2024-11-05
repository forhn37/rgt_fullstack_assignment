// app/components/Modal.tsx
"use client";
import React from 'react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  imageSrc: string;
  itemName: string;
}

export default function Modal({ isOpen, onClose, onAddToCart, imageSrc, itemName }: ModalProps) {
  const [quantity, setQuantity] = React.useState(1);

  if (!isOpen) return null;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400">✕</button>
        <div className="flex">
          <Image
            src={imageSrc}
            alt={itemName}
            width={150}  // 기본 너비 설정
            height={150} // 기본 높이 설정
            className="w-1/2 h-32 object-cover rounded"
          />
          <div className="flex flex-col justify-between ml-4 w-1/2">
            <h2 className="text-lg font-bold mb-2">{itemName}</h2>
            <div className="flex items-center">
              <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 border">-</button>
              <span className="mx-2">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 border">+</button>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onAddToCart(quantity);
            onClose();
          }}
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded"
        >
          담기
        </button>
      </div>
    </div>
  );
}
