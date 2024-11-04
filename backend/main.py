from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Order(BaseModel):
    food: str
    quantity: int

@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI! hahahaha"}

@app.post("/order")
async def create_order(order: Order):
    return {"message": "Order received", "order": order}
