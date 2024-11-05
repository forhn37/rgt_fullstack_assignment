'use client'
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
  // 3개의 카테고리 중 선택 상태
  const [selectedCategory, setSelectedCategory] = useState<'chinese' | 'italian' | 'korean' | 'orders'>('chinese');
  
  // 카트에 담은 주문내역 상태
  const [cartItems, setCartItems] = useState<Order[]>([]);
  
  // 모달 open 상태
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string; image: string; category: 'chinese' | 'italian' | 'korean' } | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // 카테고리별 주문 번호 상태 관리
  const [orderCounters, setOrderCounters] = useState({ chinese: 1000, italian: 2000, korean: 3000 });

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
      // 현재 카테고리의 주문 번호 가져오기
      const newOrderNumber = orderCounters[selectedItem.category];
  
      // 새로운 주문 항목 생성
      const newOrder = {
        orderNumber: newOrderNumber,
        food: selectedItem.name,
        quantity,
        category: selectedItem.category,
      };
  
      // 카트에 추가
      setCartItems([...cartItems, newOrder]);
  
      // orderCounters 상태 업데이트: 해당 카테고리의 주문 번호 증가
      setOrderCounters((prevCounters) => ({
        ...prevCounters,
        [selectedItem.category]: prevCounters[selectedItem.category] + 1,
      }));
    }
  };
  

  const clearCart = () => {
    setCartItems([]);
  };

  // 주문 내역을 히스토리에 추가하고 주문 번호를 부여하는 함수
  const addToHistory = (completedOrders: Order[]) => {
    const updatedOrders = completedOrders.map((order) => {
      // 현재 카테고리의 주문 번호 가져오기
      const newOrderNumber = orderCounters[order.category];

      // 새로운 주문 내역 생성
      const updatedOrder = { ...order, orderNumber: newOrderNumber };

      // 주문 번호 증가 및 상태 업데이트
      setOrderCounters((prevCounters) => ({
        ...prevCounters,
        [order.category]: prevCounters[order.category]
      }));

      return updatedOrder;
    });

    setOrderHistory([...orderHistory, ...updatedOrders]); // 주문 내역 추가
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
