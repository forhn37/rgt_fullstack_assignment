from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from data_storage import add_order, get_all_orders
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 주문 데이터 모델
class Order(BaseModel):
    food: str
    quantity: int

# 주문 접수 엔드포인트
@app.post("/order")
async def create_order(order: Order):
    # 주문 데이터를 딕셔너리로 변환하여 임시 저장소에 추가
    order_data: Dict[str, int] = {"food": order.food, "quantity": order.quantity}
    add_order(order_data)
    return {"message": "주문이 접수되었습니다", "order": order}

# 모든 주문 조회 엔드포인트 (옵션)
@app.get("/order")
async def read_orders():
    return {"orders": get_all_orders()}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js가 실행 중인 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
