from fastapi import WebSocket, WebSocketDisconnect
from ..utils.broadcast import add_client, remove_client

async def websocket_endpoint(websocket: WebSocket):
    await add_client(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await remove_client(websocket)
