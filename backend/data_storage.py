from typing import List, Dict, Union

# 주문 데이터를 저장할 임시 리스트
orders: List[Dict[str, Union[int, str]]] = []

def add_order(order_data: Dict[str, Union[int, str]]) -> None:
    """
    주문 데이터를 임시 저장소에 추가하는 함수
    """
    orders.append(order_data)

def get_all_orders() -> List[Dict[str, Union[int, str]]]:
    """
    모든 주문을 반환하는 함수
    """
    return orders
