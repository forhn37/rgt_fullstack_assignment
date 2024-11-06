# tests/test_order_integration.py
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

order_data = [
    {
        "orderNumber": 1,
        "food": "Chinese Food 1",
        "quantity": 2,
        "category": "chinese",
        "status": "접수됨"
    },
    {
        "orderNumber": 2,
        "food": "Italian Food 1",
        "quantity": 1,
        "category": "italian",
        "status": "접수됨"
    },
]

@pytest.mark.asyncio
async def test_order_status_update():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        await client.post("/api/v1/order", json=order_data)

        # 상태가 "조리중"으로 변경되었는지 확인
        await asyncio.sleep(10)
        response = await client.get("/api/v1/order")
        orders = response.json().get("orders", [])
        assert all(order["status"] == "조리중" for order in orders)

        # 상태가 "조리완료"로 변경되었는지 확인
        await asyncio.sleep(10)
        response = await client.get("/api/v1/order")
        orders = response.json().get("orders", [])
        assert all(order["status"] == "조리완료" for order in orders)
