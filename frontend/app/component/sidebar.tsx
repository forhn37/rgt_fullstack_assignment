import React from 'react';

interface SidebarProps {
  setSelectedCategory: (category: 'chinese' | 'italian' | 'korean' | 'orders') => void;
}

export default function Sidebar({ setSelectedCategory }: SidebarProps) {
  const categories: Array<'chinese' | 'italian' | 'korean' | 'orders'> = ['chinese', 'italian', 'korean', 'orders'];

  return (
    <div className=" p-4 space-y-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className="w-full p-2 bg-green- rounded text-center h-20 text-2xl border bg-green-500 text-white"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
