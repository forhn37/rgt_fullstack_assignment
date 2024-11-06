from fastapi import APIRouter, BackgroundTasks
from typing import List
from ...models.order_model import Order
from ...services.order_service import create_order, read_orders
from fastapi import HTTPException

router = APIRouter()

@router.post("/order")
async def create_order_endpoint(new_orders: List[Order], background_tasks: BackgroundTasks):
    try:
        # create_order를 호출하여 주문 생성 및 상태 관리
        return await create_order(new_orders, background_tasks)
    except Exception as e:
        # 예상치 못한 오류 발생 시 예외 처리
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/order")
async def read_orders_endpoint():
    try:
        # 주문 목록을 반환
        return await read_orders()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch orders: " + str(e))
