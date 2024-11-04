from typing import List, Dict

# 주문 데이터를 저장할 임시 리스트
orders: List[Dict[str, int]] = []

def add_order(order: Dict[str, int]) -> None:
    """
    새로운 주문을 임시 저장소에 추가하는 함수
    """
    orders.append(order)

def get_all_orders() -> List[Dict[str, int]]:
    """
    모든 주문을 반환하는 함수
    """
    return orders
