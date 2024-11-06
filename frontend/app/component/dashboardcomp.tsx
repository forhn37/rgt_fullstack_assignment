'use client'
import { useEffect, useState } from 'react';
import { Order } from './mainsection';

interface OrderWithStatus extends Order {
  status: string;
}

function Dashboard() {
  const [orders, setOrders] = useState<OrderWithStatus[]>([]);

  useEffect(() => {
    const fetchInitialOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/order');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch initial orders');
        }
      } catch (error) {
        console.error('Error fetching initial orders:', error);
      }
    };

    fetchInitialOrders();

    const ws = new WebSocket('ws://localhost:8000/ws/dashboard');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === 'new_order') {
        setOrders((prevOrders) => [...prevOrders, ...message.data]);
      } else if (message.event === 'status_update') {
        const updatedOrders = message.data;
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            const updatedOrder = updatedOrders.find((preOrders: OrderWithStatus) => preOrders.orderNumber === order.orderNumber);
            return updatedOrder ? { ...order, status: updatedOrder.status } : order;
          })
        );
      }
    };

    ws.onclose = () => console.log('WebSocket 연결이 종료되었습니다.');
    ws.onerror = (error) => console.error('WebSocket 오류:', error);

    return () => ws.close();
  }, []);

  const chineseOrders = orders.filter((order) => order.category === 'chinese');
  const italianOrders = orders.filter((order) => order.category === 'italian');
  const koreanOrders = orders.filter((order) => order.category === 'korean');

  return (
    <div className="flex justify-around p-6 space-x-6">
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-red-500 text-white text-center py-2 rounded-t-lg font-bold">중국 음식 주문</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">주문 번호</th>
              <th className="border px-4 py-2">음식</th>
              <th className="border px-4 py-2">수량</th>
              <th className="border px-4 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {chineseOrders.map((order) => (
              <tr key={`${order.orderNumber}-${order.food}`} className="text-center">
                <td className="border px-4 py-2">{order.orderNumber}</td>
                <td className="border px-4 py-2">{order.food}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-red-500 text-white text-center py-2 rounded-t-lg font-bold">이탈리아 음식 주문</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">주문 번호</th>
              <th className="border px-4 py-2">음식</th>
              <th className="border px-4 py-2">수량</th>
              <th className="border px-4 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {italianOrders.map((order) => (
              <tr key={`${order.orderNumber}-${order.food}`} className="text-center">
                <td className="border px-4 py-2">{order.orderNumber}</td>
                <td className="border px-4 py-2">{order.food}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-red-500 text-white text-center py-2 rounded-t-lg font-bold">한국 음식 주문</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">주문 번호</th>
              <th className="border px-4 py-2">음식</th>
              <th className="border px-4 py-2">수량</th>
              <th className="border px-4 py-2">상태</th>
            </tr>
          </thead>
          <tbody>
            {koreanOrders.map((order) => (
              <tr key={`${order.orderNumber}-${order.food}`} className="text-center">
                <td className="border px-4 py-2">{order.orderNumber}</td>
                <td className="border px-4 py-2">{order.food}</td>
                <td className="border px-4 py-2">{order.quantity}</td>
                <td className="border px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Repeat for Italian and Korean orders */}
    </div>
  );
}

export default Dashboard;
