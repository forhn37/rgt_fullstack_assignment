from fastapi import APIRouter, WebSocket
from ...services.websocket_service import websocket_endpoint

router = APIRouter()

@router.websocket("/ws/dashboard")
async def websocket_endpoint_route(websocket: WebSocket):
    await websocket_endpoint(websocket)
