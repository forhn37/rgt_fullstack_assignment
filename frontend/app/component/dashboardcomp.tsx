'use client'
import { useEffect, useState } from 'react';
import { Order } from './mainsection';

// interface Order {
//   order_number: number;
//   food: string;
//   quantity: number;
//   category: string;
// }

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]); // State 타입 정의

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const ws = new WebSocket('ws://localhost:8000/ws/dashboard');
  
      ws.onopen = () => {
        console.log('WebSocket 연결이 시작되었습니다.');
      };
  
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.event === 'new_order') {
          setOrders((prevOrders) => [...prevOrders, message.data]);
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
  
  return (
    <div>
      <h2>실시간 주문 대시보드</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            주문 번호: {order.orderNumber}, 음식: {order.food}, 수량: {order.quantity}, 카테고리: {order.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
