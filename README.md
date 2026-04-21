# BookMark

平常聽 Podcast 或逛網路時，常常看到值得買的書或有用的連結，但收進瀏覽器書籤又很容易忘記、找不到。
這個專案是用來解決自己的問題，順便作為練習部署到雲端的 side project。

## Stack

| 層級 | 技術 |
|------|------|
| 前端 | React 18 + Vite + React Router v6 |
| 後端 | Spring Boot 3.5 + Java 17 |
| 資料庫 | PostgreSQL 15 + Flyway 版本控制 |
| 認證 | JWT (jjwt 0.12) |
| 容器 | Docker Compose |
| 部署 | Vercel（前端）/ Render（後端 + DB）|

## Function

- 使用者註冊 / 登入（JWT 認證）
- 新增、編輯、刪除書籤（URL、標題、描述）
- 為書籤加上 / 移除標籤
- 側邊欄依標籤篩選書籤
- 全文搜尋（標題、URL、描述、標籤）
- 格狀 / 列表版面切換
- 深色 / 淺色主題切換

## Structure
```
BookMark/
├── backend/                        # Spring Boot(Controller -> Service -> Repository)
│   
├── frontend/                       # React + Vite 
│                  
└── docker-compose.yml             
```

## Schema

```sql
users           -- id, email, password, created_at
bookmarks       -- id, user_id, url, title, description, created_at
tags            -- id, user_id, name  (UNIQUE per user)
bookmark_tags   -- bookmark_id, tag_id  (多對多中間表)
```


## 本機開發

### 前置需求

- Java 17+
- Node.js 18+
- Docker & Docker Compose

### 環境變數

參考.env.example內格式。

### 啟動步驟

```bash
# 1. 啟動資料庫
docker-compose up -d db

# 2. 啟動後端
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# 3. 啟動前端
cd frontend
npm install
npm run dev
```

前端開在 `http://localhost:5173`，後端開在 `http://localhost:8080`。

### 執行測試

```bash
# 後端測試
cd backend && ./mvnw test

# 前端測試
cd frontend && npm run test
```

# 代辦事項
  階段一：先搞懂 Kubernetes 基本概念（不用 GKE）                                 

  在本機用 minikube 或 kind 練習，不花錢：
  - Pod、Deployment、Service 這三個是核心，先搞懂這三個
  - ConfigMap / Secret — 對應你現在的環境變數
  - Ingress — 對應你現在 nginx 做的事

  這個階段的目標：把你的 docker-compose.yml 翻譯成等價的 k8s yaml。

  階段二：把現有 Docker image 推上去

  你已經有 backend/Dockerfile 和 frontend/Dockerfile，下一步是：
  1. 開 GCP 帳號（有 $300 免費額度，夠用很久）
  2. 在 Artifact Registry 建一個 repo
  3. docker push 把 image 推上去

  階段三：建 GKE cluster 並部署

  # 建一個最小的 cluster（Autopilot 模式比較省事）
  gcloud container clusters create-auto bookmark-cluster --region=asia-east1     

  # 套用你的 k8s yaml
  kubectl apply -f k8s/

  階段四：處理 PostgreSQL

  這是你專案最大的坑。選項：
  - Cloud SQL（建議）：GCP 管理的 PostgreSQL，用 Cloud SQL Proxy sidecar
  接進去，最省心
  - 自己在 k8s 裡跑 PostgreSQL：需要 PersistentVolume，比較麻煩，不建議初學用    

  ---
  你的專案具體要準備的 yaml

  k8s/
  ├── backend-deployment.yaml    # 你的 Spring Boot
  ├── backend-service.yaml
  ├── frontend-deployment.yaml   # 你的 React/nginx
  ├── frontend-service.yaml
  ├── ingress.yaml               # 對外路由
  └── secret.yaml                # JWT_SECRET, DB 連線資訊

  ---
  最小可行的起點

  1. 先裝 kubectl + minikube，在本機把你的 app 跑起來
  2. 再開 GCP，把同一份 yaml 打到 GKE

  不建議直接從 GKE 開始，因為本機失敗比較容易 debug，也不用擔心費用。

  ---
  要不要我幫你把現有的 docker-compose.yml 轉成基本的 k8s yaml 當起點？