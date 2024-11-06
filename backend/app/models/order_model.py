from pydantic import BaseModel

class Order(BaseModel):
    orderNumber: int
    food: str
    quantity: int
    category: str
    status: str = "접수됨"
