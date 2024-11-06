from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ...services.websocket_service import websocket_endpoint

router = APIRouter()

@router.websocket("/ws/dashboard")
async def websocket_endpoint_route(websocket: WebSocket):
    try:
        await websocket_endpoint(websocket)
    except WebSocketDisconnect:
        # 클라이언트가 연결을 끊은 경우 처리
        print("Client disconnected")
    except Exception as e:
        # 기타 예외가 발생한 경우 처리
        print(f"An unexpected error occurred: {e}")
        await websocket.close()  # 오류 발생 시 WebSocket 연결 닫기
