from fastapi import APIRouter, BackgroundTasks
from typing import List
from ...models.order_model import Order
from ...services.order_service import create_order, read_orders

router = APIRouter()

@router.post("/order")
async def create_order_endpoint(new_orders: List[Order], background_tasks: BackgroundTasks):
    return await create_order(new_orders, background_tasks)

@router.get("/order")
async def read_orders_endpoint():
    return await read_orders()
