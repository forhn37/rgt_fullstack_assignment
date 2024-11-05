from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Dict, Union
from data_storage import add_order, get_all_orders
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 주문 데이터 모델
class Order(BaseModel):
    orderNumber: int
    food: str
    quantity: int
    category: str

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js가 실행 중인 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket 연결을 관리하는 클래스
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# 여러 개의 주문을 한 번에 받을 수 있도록 리스트 형식으로 수정
@app.post("/order")
async def create_order(orders: List[Order]):
    # 각 주문 데이터를 임시 저장소에 추가
    for order in orders:
        order_data: Dict[str, Union[int, str]] = {
            "order_number": order.orderNumber,
            "food": order.food,
            "quantity": order.quantity,
            "category": order.category
        }
        add_order(order_data)
        
        # WebSocket을 통해 모든 클라이언트에 새로운 주문 데이터 브로드캐스트
        await manager.broadcast({
            "event": "new_order",
            "data": order_data
        })

    return {"message": "주문이 접수되었습니다", "orders": orders}

# 모든 주문 조회 엔드포인트 (옵션)
@app.get("/order")
async def read_orders():
    return {"orders": get_all_orders()}

# WebSocket 엔드포인트
@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # 클라이언트에서 보낸 메시지를 수신할 수 있지만, 필요하지 않다면 생략 가능
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
