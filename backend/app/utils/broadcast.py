from typing import List
from fastapi import WebSocket, WebSocketDisconnect

connected_clients: List[WebSocket] = []

async def broadcast_order_update(event: str, data: list):
    message = {"event": event, "data": data}
    disconnected_clients = []  # 연결이 끊긴 클라이언트를 수집

    for client in connected_clients:
        try:
            await client.send_json(message)
        except WebSocketDisconnect:
            # WebSocketDisconnect 발생 시 클라이언트를 제거 목록에 추가
            disconnected_clients.append(client)
        except Exception as e:
            # 기타 예외 처리 (로그 작성 등을 통해 문제를 추적)
            print(f"Error sending message to client: {e}")
            disconnected_clients.append(client)
    
    # 연결이 끊긴 클라이언트를 목록에서 제거
    for client in disconnected_clients:
        await remove_client(client)

async def add_client(websocket: WebSocket):
    try:
        await websocket.accept()
        connected_clients.append(websocket)
    except Exception as e:
        # 연결 수락 중 오류 발생 시
        print(f"Error accepting WebSocket connection: {e}")

async def remove_client(websocket: WebSocket):
    try:
        connected_clients.remove(websocket)
        await websocket.close()  # 연결을 안전하게 종료
    except ValueError:
        # 연결이 이미 제거된 경우 발생할 수 있는 오류 처리
        print("Client already removed from connected clients list.")
    except Exception as e:
        # 기타 예외 처리
        print(f"Error removing WebSocket client: {e}")
