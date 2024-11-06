import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Union
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 주문 데이터 모델
class Order(BaseModel):
    orderNumber: int
    food: str
    quantity: int
    category: str
    status: str = "접수됨"  # 초기 상태는 "접수됨" 

# 임시 저장소와 WebSocket 연결 관리
orders: List[Order] = []
connected_clients: List[WebSocket] = []

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/order")
async def create_order(new_orders: List[Order], background_tasks: BackgroundTasks):
    for order in new_orders:
        orders.append(order)
        background_tasks.add_task(manage_order_status, order)  # 주문 상태 관리

    await broadcast_order_update("new_order", new_orders)
    return {"message": "주문이 접수되었습니다", "orders": new_orders}

@app.get("/order")
async def read_orders():
    return {"orders": orders}

@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # 클라이언트의 메시지 수신 (필요하지 않으면 생략 가능)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

async def manage_order_status(order: Order):
    # 비동기적으로 상태 변경 작업을 독립적으로 실행
    asyncio.create_task(update_status_after_delay(order, "조리중", 10))  # 20초 후 "조리중"으로 변경
    asyncio.create_task(update_status_after_delay(order, "조리완료", 20))  # 50초 후 "조리완료"로 변경

async def update_status_after_delay(order: Order, new_status: str, delay: int):
    # 지연 후 상태 업데이트
    await asyncio.sleep(delay)
    order.status = new_status
    await broadcast_order_update("status_update", [order])

async def broadcast_order_update(event: str, updated_orders: List[Order]):
    message = {
        "event": event,
        "data": [order.model_dump() for order in updated_orders]
    }
    for client in connected_clients:
        await client.send_json(message)
