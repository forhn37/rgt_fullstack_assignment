from typing import List
from fastapi import BackgroundTasks
from ..models.order_model import Order
from ..utils.broadcast import broadcast_order_update
import asyncio

orders: List[Order] = []

async def create_order(new_orders: List[Order], background_tasks: BackgroundTasks):
    orders.extend(new_orders)
    for order in new_orders:
        background_tasks.add_task(manage_order_status, order)
    await broadcast_order_update("new_order", [order.model_dump() for order in new_orders])
    return {"message": "주문이 접수되었습니다", "orders": new_orders}

async def read_orders():
    return {"orders": [order.model_dump() for order in orders]}

async def manage_order_status(order: Order):
    # 비동기적으로 상태 변경 작업을 독립적으로 실행
    asyncio.create_task(update_status_after_delay(order, "조리중", 10))  # 10초 후 "조리중"으로 변경
    asyncio.create_task(update_status_after_delay(order, "조리완료", 15))  # 15초 후 "조리완료"로 변경

async def update_status_after_delay(order: Order, new_status: str, delay: int):
    await asyncio.sleep(delay)
    order.status = new_status
    await broadcast_order_update("status_update", [order.model_dump()])
