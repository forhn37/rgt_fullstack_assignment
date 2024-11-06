from fastapi import FastAPI
from .api.v1 import order_routes, websocket_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(order_routes.router, prefix="/api/v1")
app.include_router(websocket_routes.router, prefix="/api/v1")
