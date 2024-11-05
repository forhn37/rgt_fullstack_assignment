'use client'
// app/component/ordercomp.tsx
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
  const [selectedCategory, setSelectedCategory] = useState<'chinese' | 'italian' | 'korean' | 'orders'>('chinese');
  const [cartItems, setCartItems] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
      const existingIndex = cartItems.findIndex(
        (item) => item.food === selectedItem.name && item.category === selectedItem.category
      );

      if (existingIndex > -1) {
        // 동일한 메뉴가 있을 경우 수량을 추가
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingIndex].quantity += quantity;
        setCartItems(updatedCartItems);
      } else {
        // 새로운 메뉴일 경우 장바구니에 추가
        setCartItems([
          ...cartItems,
          {
            orderNumber: orderCounters[selectedItem.category],
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

  const addToHistory = (completedOrders: Order[]) => {
    const updatedOrders = completedOrders.map((order) => {
      const newOrderNumber = orderCounters[order.category]++;
      return { ...order, orderNumber: newOrderNumber };
    });
    setOrderHistory([...orderHistory, ...updatedOrders]);
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
};
