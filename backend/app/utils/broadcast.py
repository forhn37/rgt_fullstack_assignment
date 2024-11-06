from typing import List
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

connected_clients: List[WebSocket] = []

async def broadcast_order_update(event: str, data: list):
    message = {"event": event, "data": data}
    disconnected_clients = []  # 연결이 끊긴 클라이언트를 추적

    for client in connected_clients:
        try:
            await client.send_json(message)
        except WebSocketDisconnect:
            disconnected_clients.append(client)
        except Exception as e:
            print(f"Error sending message to client: {e}")
            disconnected_clients.append(client)
    
    for client in disconnected_clients:
        await remove_client(client)

async def add_client(websocket: WebSocket):
    try:
        await websocket.accept()
        connected_clients.append(websocket)
    except Exception as e:
        print(f"Error accepting WebSocket connection: {e}")

async def remove_client(websocket: WebSocket):
    try:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
            await websocket.close()  # 안전하게 연결 종료
    except Exception as e:
        print(f"Error removing WebSocket client: {e}")
