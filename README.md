# RGT Fullstack Assignment

## 프로젝트 개요

### 가정 상황
RGT 푸드코트는 각 테이블에 비치된 키오스크를 통해 다양한 음식을 주문할 수 있습니다. 푸드코트에는 세 가지 음식점이 있으며, 각각 고유한 주문번호를 발행합니다:

- 이탈리아 음식점
- 한식 음식점
- 중국 음식점

주문이 접수된 후 10초 후에 "조리 중" 상태로 변경되며, 15초 후에는 "조리 완료" 상태로 변경됩니다. 고객은 키오스크에서 본인의 주문 내역과 상태를 확인할 수 있으며, 푸드코트 내 대형 화면에는 모든 주문의 상태가 실시간 업데이트됩니다. 
(단, 식당에서 조리할 수 있는 최대음식의 숫자는 고려하지 않는다.)

---

## 요구사항

### 식당 주문 처리 시스템

- **프론트엔드**는 `Next.js`, `TypeScript`, `Tailwind CSS`를 사용하여 `/order`와 `/dashboard` 페이지로 구현됩니다.
- 페이지 컴포넌트는 `Server Component`로, 이벤트 및 상태 관리가 필요한 하위 컴포넌트는 `Client Component`로 구현하여 렌더링 효율을 높였습니다.
- **백엔드**는 `FastAPI`를 사용하며, 주문 요청을 JSON 형식으로 받아 주문 데이터를 `List`에 저장합니다.

### 실시간 주문 현황 대시보드

- `/dashboard` 페이지는 `WebSocket`을 통해 실시간으로 주문 상태를 반영합니다.
- 클라이언트에서 주문 상태(접수됨, 조리 중, 조리 완료)는 서버에서 주기적으로 갱신하여 대시보드에 표시됩니다.
- 여러 클라이언트가 대시보드를 열 경우, 초기 데이터는 API를 통해 가져오고 실시간 상태는 WebSocket을 통해 추가로 반영됩니다.

---

## 시스템 설계 방안

### 1. 모듈화 구조
코드를 모듈별로 나누어 유지보수를 용이하게 합니다:
- `app`: 서버 진입점 및 기본 설정
- `api/v1`: API 라우터 및 버전 관리
- `models`: 데이터 모델 정의
- `services`: 주문 상태 처리 로직
- `utils`: WebSocket 관련 기능 및 유틸리티
- `tests`: 유닛 및 통합 테스트 관리

### 2. API 버전 관리
- `/api/v1` 경로를 추가하여 버전 관리를 도입했습니다. 이는 API 변경 시 기존 클라이언트와의 호환성을 보장합니다.

### 3. 비즈니스 로직과 라우터 분리
- API 요청 처리는 라우터에서, 비즈니스 로직은 서비스 계층에서 관리해 코드의 관심사를 분리했습니다.

### 4. 실시간 대시보드 WebSocket 연결 및 재연결 처리
- WebSocket 연결 실패 시 자동으로 재연결하여 시스템의 안정성을 강화했습니다.

---

## 최적화 기법

### 1. 주문 상태 일괄 처리
- 주문 상태 업데이트 시 여러 상태 정보를 일괄 업데이트하여 네트워크 요청 수를 줄이고 UI 렌더링을 최적화했습니다.
- `updateQueue`를 통해 상태 변경 사항을 1초마다 한꺼번에 반영합니다.

### 2. `Map` 자료구조 활용
- 주문을 `orderNumber`를 키로 저장한 `Map` 자료구조를 사용해 주문을 빠르게 조회하고 업데이트할 수 있습니다. 이는 다수의 주문을 처리할 때 성능을 향상시킵니다.

### 3. 기타 최적화
- 백엔드에서 `asyncio.Queue` 사용을 고려하였으며, 추후 동시성 개선을 위해 `List`에서 비동기 Queue 구조로 변경할 계획입니다.

---

## 추후 추가할 기능
- `/order` 페이지의 새로고침 시 `orderCounters`의 상태가 초기화되는 문제를 해결하기 위해 `LocalStorage` 또는 백엔드 주문번호 생성 방식을 고려합니다.
- `asyncio.Queue`로 백엔드 자료구조를 전환하여 동시성 및 성능을 개선합니다.


## 설치 및 실행 가이드

### 1. 프로젝트 클론  


  git clone https://github.com/forhn/rgt_fullstack_assignment.git
  cd rgt_fullstack_assignment

### 2. 프론트엔드 설치 및 실행

- 프론트엔드 설정:

  ```bash
  cd frontend
  npm install

### 3. 백엔드 설치 및 실행

- 백엔드 설정:

  백엔드 폴더로 이동하여 가상 환경을 설정합니다.

  ```bash
  cd backend
  python -m venv venv
  source venv/bin/activate  # Windows: venv\Scripts\activate
  pip install -r requirements.txt

### 백엔드 서버 실행
uvicorn app.main:app --reload

백엔드는 기본적으로 http://localhost:8000에서 실행됩니다.

### 4. 주요 엔드포인트
- 주문 API: http://localhost:8000/api/v1/order (POST 요청으로 주문 생성)
- 대시보드 WebSocket: ws://localhost:8000/api/v1/ws/dashboard (실시간 주문 현황)

테스트
테스트 실행:

--- 

  ```bash
    pytest
    테스트 경로: /backend/tests
