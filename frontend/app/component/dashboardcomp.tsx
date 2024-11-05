'use client'
import { useEffect, useState } from 'react';
import { Order } from './mainsection';

interface OrderWithStatus extends Order {
  status: string; // 주문 상태
}

function Dashboard() {
  const [orders, setOrders] = useState<OrderWithStatus[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const ws = new WebSocket('ws://localhost:8000/ws/dashboard');

      ws.onopen = () => {
        console.log('WebSocket 연결이 시작되었습니다.');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.event === 'new_order') {
          const newOrder: OrderWithStatus = {
            ...message.data,
            status: '접수됨', // 초기 상태 설정
          };
          setOrders((prevOrders) => [...prevOrders, newOrder]);

          // 상태 변경 타이머 설정
          setTimeout(() => updateOrderStatus(newOrder.orderNumber, '조리중'), 20000); // 20초 후 조리중
          setTimeout(() => updateOrderStatus(newOrder.orderNumber, '조리완료'), 50000); // 50초 후 조리완료
        }
      };

      ws.onclose = () => {
        console.log('WebSocket 연결이 종료되었습니다.');
      };

      ws.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        ws.close();
      };
    }, 500); // 0.5초 지연 후 WebSocket 연결 시도

    return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const updateOrderStatus = (orderNumber: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
      )
    );
  };

  // 카테고리별로 주문을 분류
  const chineseOrders = orders.filter((order) => order.category === 'chinese');
  const italianOrders = orders.filter((order) => order.category === 'italian');
  const koreanOrders = orders.filter((order) => order.category === 'korean');

  return (
    <div className="flex justify-around p-6 space-x-6">
      {/* Chinese Orders Table */}
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

      {/* Italian Orders Table */}
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-green-500 text-white text-center py-2 rounded-t-lg font-bold">이탈리아 음식 주문</h3>
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

      {/* Korean Orders Table */}
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-bold">한식 주문</h3>
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
    </div>
  );
}

export default Dashboard;
