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
      const existingIndex = cartItems.findIndex(
        (item) => item.food === selectedItem.name && item.category === selectedItem.category
      );

      if (existingIndex > -1) {
        // 동일한 메뉴가 있을 경우 수량을 추가
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingIndex].quantity += quantity;
        setCartItems(updatedCartItems);
      } else {
        // 새로운 메뉴일 경우 장바구니에 추가 (주문 번호는 임시로 0)
        setCartItems([
          ...cartItems,
          {
            orderNumber: 0, // 실제 주문 번호는 addToHistory에서 부여
            food: selectedItem.name,
            quantity,
            category: selectedItem.category,
          },
        ]);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 주문 내역을 히스토리에 추가하고 주문 번호를 부여하는 함수
  const addToHistory = (completedOrders: Order[]) => {
    const updatedCounters = { ...orderCounters };
    const updatedOrders = completedOrders.map((order) => {
      // 현재 카테고리의 주문 번호 가져오기
      const newOrderNumber = updatedCounters[order.category];
  
      // 새로운 주문 내역 생성
      const updatedOrder = { ...order, orderNumber: newOrderNumber };
  
      // 복사본에서 주문 번호를 증가시킴
      updatedCounters[order.category] += 1;
  
      return updatedOrder;
    });
    
    setOrderCounters(updatedCounters);

    setOrderHistory((prevHistory) => [...prevHistory, ...updatedOrders]); // 주문 내역 추가

    clearCart(); // 주문 후 장바구니 비우기

    return updatedOrders; 
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
        <Cartsection cartItems={cartItems} clearCart={clearCart} onSubmitOrder={addToHistory} updateCartItems={setCartItems} />
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
