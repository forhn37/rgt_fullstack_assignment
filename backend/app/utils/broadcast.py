from typing import List
from fastapi import WebSocket

connected_clients: List[WebSocket] = []

async def broadcast_order_update(event: str, data: list):
    message = {"event": event, "data": data}
    for client in connected_clients:
        await client.send_json(message)

async def add_client(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)

async def remove_client(websocket: WebSocket):
    connected_clients.remove(websocket)
