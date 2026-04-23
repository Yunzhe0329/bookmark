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


### 部署小坑
- Mac 的 CPU 架構是 ARM64，但雲端伺服器幾乎都是 AMD64（x86_64），本地端若直接`docker build`會是建立 ARM64的`Image`
- 和雲端架構不同，去導致出現奇怪的錯誤(Container跑不起來)
- build 時候改成 `docker build --platform linux/amd64 \ -t asia-east1-docker.pkg.dev/...`
- 前端用 VITE_API_URL 來決定打哪個 backend，但你 build image 時沒有設定這個環境變數，所以 baseURL 是空的，前端不知道 backend 在哪裡
    - nginx.conf 加一個 proxy，把 /api/* 轉發到 backend service 的 port 去處理
- 程式碼 bug：成功路徑沒有 setLoading(false)，只有 catch 才有。如果 navigate('/login') 因任何原因稍慢，畫面就會卡在「處理中」(註冊成功，但畫面卡住)
- GKE Autopilot 費用遠超預期（$84/天），改用 Cloud Run + Neon 免費 PostgreSQL，降低費用
- nginx proxy_pass 到 HTTPS backend 時，需加 `proxy_ssl_verify off` 否則憑證驗證失敗導致 502
- nginx 轉發請求時會帶上瀏覽器的 Origin header，backend CORS 設定只允許 localhost，導致 403。解法：在 nginx 加 `proxy_set_header Origin ""`，讓 backend 不做 CORS 檢查
- Backend 回傳的時間戳沒有帶 `Z`（UTC 標記），瀏覽器誤判為本地時間，時間顯示差 8 小時。解法：前端解析時補上 `Z`，即 `new Date(dateStr + 'Z')`
- Cloud Run 的 `--set-env-vars` 會取代所有環境變數，不是新增。只更新單一變數要用 `--update-env-vars`

