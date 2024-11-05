'use client'
import { useEffect, useState } from 'react';
import { Order } from './mainsection';

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

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

  // 카테고리별로 주문을 분류
  const chineseOrders = orders.filter((order) => order.category === 'chinese');
  const italianOrders = orders.filter((order) => order.category === 'italian');
  const koreanOrders = orders.filter((order) => order.category === 'korean');

  return (
    <div>
      <h2>실시간 주문 대시보드</h2>

      {/* Chinese Orders Table */}
      <h3>중국 음식 주문</h3>
      <table>
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>음식</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {chineseOrders.map((order) => (
            <tr key={`${order.orderNumber}-${order.food}`}>
              <td>{order.orderNumber}</td>
              <td>{order.food}</td>
              <td>{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Italian Orders Table */}
      <h3>이탈리아 음식 주문</h3>
      <table>
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>음식</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {italianOrders.map((order) => (
            <tr key={`${order.orderNumber}-${order.food}`}>
              <td>{order.orderNumber}</td>
              <td>{order.food}</td>
              <td>{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Korean Orders Table */}
      <h3>한식 주문</h3>
      <table>
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>음식</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {koreanOrders.map((order) => (
            <tr key={`${order.orderNumber}-${order.food}`}>
              <td>{order.orderNumber}</td>
              <td>{order.food}</td>
              <td>{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
