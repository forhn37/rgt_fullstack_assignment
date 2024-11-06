'use client'
import { useEffect, useState } from 'react';
import { Order } from './mainsection';

interface OrderWithStatus extends Order {
  status: string;
}

function Dashboard() {
  const [orders, setOrders] = useState<OrderWithStatus[]>([]);
  const [updateQueue, setUpdateQueue] = useState<OrderWithStatus[]>([]);

  useEffect(() => {
    // 기존 데이터를 가져오는 함수
    const fetchInitialOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/order');
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

    // WebSocket 연결 함수
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/api/v1/ws/dashboard');

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.event === 'new_order' || message.event === 'status_update') {
          setUpdateQueue((prevQueue) => [...prevQueue, ...message.data]);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket 연결이 종료되었습니다. 5초 후 재연결을 시도합니다.');
        setTimeout(connectWebSocket, 2000); // 5초 후 재연결
      };

      // ws.onerror = (error) => console.error('WebSocket 오류:', error);

      return ws;
    };

    const ws = connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 종료
    return () => ws.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (updateQueue.length > 0) {
        setOrders((prevOrders) => {
          const orderMap = new Map(prevOrders.map((order) => [order.orderNumber, order]));

          updateQueue.forEach((updatedOrder) => {
            orderMap.set(updatedOrder.orderNumber, {
              ...orderMap.get(updatedOrder.orderNumber)!,
              ...updatedOrder,
            });
          });

          setUpdateQueue([]);
          return Array.from(orderMap.values());
        });
      }
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, [updateQueue]);

  const chineseOrders = orders.filter((order) => order.category === 'chinese');
  const italianOrders = orders.filter((order) => order.category === 'italian');
  const koreanOrders = orders.filter((order) => order.category === 'korean');

  return (
    <div className="flex justify-around p-6 space-x-6">
      {/* 테이블 컴포넌트 */}
      <div className="border border-gray-300 rounded-lg shadow-lg w-1/3">
        <h3 className="bg-yellow-500 text-white text-center py-2 rounded-t-lg font-bold">중국 음식 주문</h3>
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
        <h3 className="bg-green-700 text-white text-center py-2 rounded-t-lg font-bold">이탈리아 음식 주문</h3>
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
    </div>
  );
}

export default Dashboard;
