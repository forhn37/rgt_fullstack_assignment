// frontend/app/component/ordercomp.tsx
"use client";

import { useState } from 'react';
import Mainsection from "./mainsection";
import Sidebar from "./sidebar";
import Cartsection from "./cartsection";
import Modal from "./modal";

interface Order {
  orderNumber: number;
  food: string;
  quantity: number;
  category: 'chinese' | 'italian' | 'korean';
}

export default function Order() {
  //3개의 카테고리 중 선택 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('chinese');
  //카트에 담은 주문내역 상태
  const [cartItems, setCartItems] = useState<Order[]>([]);
  //모달 open bool
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //
  const [selectedItem, setSelectedItem] = useState<{ name: string; image: string; category: 'chinese' | 'italian' | 'korean' } | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const orderCounters = { chinese: 1000, italian: 2000, korean: 3000 };

  const openModal = (itemName: string, imageSrc: string, category: 'chinese' | 'italian' | 'korean') => {
    setSelectedItem({ name: itemName, image: imageSrc, category });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const addToCart = (quantity: number) => {
    if (selectedItem) {
      setCartItems([
        ...cartItems,
        {
          orderNumber: 0,
          food: selectedItem.name,
          quantity,
          category: selectedItem.category,
        },
      ]);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 주문 내역을 히스토리에 추가하는 함수
  const addToHistory = (completedOrders: Order[]) => {
    setOrderHistory([...orderHistory, ...completedOrders]);
  };

  return (
    <div className='flex w-4/5'>
      <div className="w-1/6">
        <Sidebar setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="w-4/6">
        <Mainsection selectedCategory={selectedCategory} orderHistory={orderHistory} openModal={openModal} />
      </div>
      <div className="w-1/6">
        <Cartsection cartItems={cartItems} clearCart={clearCart} onSubmitOrder={addToHistory} />
      </div>
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
