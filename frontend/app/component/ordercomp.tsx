// frontend/app/order/page.tsx
"use client";

import { useState } from 'react';
import Mainsection from "../component/mainsection"
import Sidebar from "../component/sidebar"
import Cartsection from "../component/cartsection"

interface Order {
  food: string;
  quantity: number;
}

export default function Order() {
  const [selectedCategory, setSelectedCategory] = useState<string>('중국음식');

  return (
    <div className='flex w-4/5'>
      <div className="w-1/6">
        <Sidebar setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="w-4/6">
        <Mainsection selectedCategory={selectedCategory}  />
      </div>
      <div className="w-1/6">
        <Cartsection />
      </div>
    </div>


  )
}
