"use client"; // 클라이언트 컴포넌트 선언
import React from 'react';

interface SidebarProps {
  setSelectedCategory: (category: string) => void;
}

export default function Sidebar({ setSelectedCategory }: SidebarProps) {
  const categories = ['chinese', 'italian', 'korean','orders'];

  return (
    <div className="bg-gray-100 p-4 space-y-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className="w-full text-left p-2 hover:bg-gray-300 rounded"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
