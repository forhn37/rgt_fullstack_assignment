# tests/test_dashboard_integration.py
import pytest
from httpx import AsyncClient
from starlette.testclient import WebSocketTestSession
from app.main import app

order_data = [
    {"orderNumber": 1, "food": "Chinese Food 1", "quantity": 2, "category": "chinese", "status": "접수됨"}
]

@pytest.mark.asyncio
async def test_dashboard_real_time_updates():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        await client.post("/api/v1/order", json=order_data)
        try:
            async with client.websocket_connect("/api/v1/ws/dashboard") as websocket:
                await websocket.send_json({"event": "new_order", "data": order_data})
                message = await websocket.receive_json()
                assert message["event"] == "new_order"
                assert message["data"] == order_data
        except Exception as e:
            print(f"WebSocket connection error: {e}")
            assert False, "WebSocket connection failed"
