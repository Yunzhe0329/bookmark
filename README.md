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

