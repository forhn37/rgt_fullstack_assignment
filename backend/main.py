from fastapi import FastAPI
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

    return {"message": "주문이 접수되었습니다", "orders": orders}

# 모든 주문 조회 엔드포인트 (옵션)
@app.get("/order")
async def read_orders():
    return {"orders": get_all_orders()}

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js가 실행 중인 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
