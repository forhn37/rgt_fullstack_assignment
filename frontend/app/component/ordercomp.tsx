// frontend/app/component/ordercomp.tsx
"use client";

import { useState } from 'react';
import Mainsection from "./mainsection";
import Sidebar from "./sidebar";
import Cartsection from "./cartsection";
import Modal from "./modal";

interface Order {
  food: string;
  quantity: number;
}

export default function Order() {
  const [selectedCategory, setSelectedCategory] = useState<string>('chinese');
  const [cartItems, setCartItems] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; image: string } | null>(null);

  const openModal = (itemName: string, imageSrc: string) => {
    setSelectedItem({ name: itemName, image: imageSrc });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const addToCart = (quantity: number) => {
    if (selectedItem) {
      setCartItems([...cartItems, { food: selectedItem.name, quantity }]);
    }
  };

  // 장바구니를 비우는 함수
  const clearCart = () => {
    setCartItems([]);
  };

  // 장바구니 항목 삭제 함수
  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <div className='flex w-4/5'>
      <div className="w-1/6">
        <Sidebar setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="w-4/6">
        <Mainsection selectedCategory={selectedCategory} openModal={openModal} />
      </div>
      <div className="w-1/6">
        <Cartsection cartItems={cartItems} clearCart={clearCart} removeFromCart={removeFromCart} />
      </div>
      {/* 모달 창 */}
      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={addToCart}
          imageSrc={selectedItem.image}
          itemName={selectedItem.name}
        />
      )}
    </div>
  );
}
