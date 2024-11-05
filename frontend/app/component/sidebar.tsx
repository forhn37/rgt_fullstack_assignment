import React from 'react';

interface SidebarProps {
  setSelectedCategory: (category: 'chinese' | 'italian' | 'korean' | 'orders') => void;
}

export default function Sidebar({ setSelectedCategory }: SidebarProps) {
  const categories: Array<'chinese' | 'italian' | 'korean' | 'orders'> = ['chinese', 'italian', 'korean', 'orders'];

  return (
    <div className="bg-gray-100 p-4 space-y-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className="w-full text-left p-2 hover:bg-gray-300 rounded"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
