# BookMark

個人書籤管理應用程式，支援帳號系統、標籤分類與全文搜尋。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | React 18 + Vite + React Router v6 |
| 後端 | Spring Boot 3.5 + Java 17 |
| 資料庫 | PostgreSQL 15 + Flyway 版本控制 |
| 認證 | JWT (jjwt 0.12) |
| 容器 | Docker Compose |
| 部署 | Vercel（前端）/ Render（後端 + DB）|

## 功能

- 使用者註冊 / 登入（JWT 認證）
- 新增、編輯、刪除書籤（URL、標題、描述）
- 為書籤加上 / 移除標籤
- 側邊欄依標籤篩選書籤
- 全文搜尋（標題、URL、描述、標籤）
- 格狀 / 列表版面切換
- 深色 / 淺色主題切換

## 專案結構

```
BookMark/
├── backend/                        # Spring Boot 應用
│   └── src/main/java/com/example/BookMark/
│       ├── controller/             # AuthController, BookmarkController
│       ├── service/                # AuthService, BookmarkService
│       ├── repository/             # JPA Repositories
│       ├── entity/                 # User, Bookmark, Tag
│       ├── dto/                    # 請求 / 回應 DTO
│       ├── security/               # JwtUtil, JwtAuthFilter, SecurityConfig
│       └── config/
├── frontend/                       # React + Vite 應用
│   └── src/
│       ├── api/client.js           # Axios 實例（自動附加 Bearer token）
│       ├── hooks.jsx               # useBookmarks, useAuth, useToast
│       ├── App.jsx                 # 路由設定
│       ├── AppLayout.jsx           # 主畫面（Header + Sidebar + 書籤列表）
│       ├── AuthPage.jsx            # 登入 / 註冊頁
│       ├── BookmarkCard.jsx        # 書籤卡片元件
│       ├── Modals.jsx              # BookmarkModal, DeleteConfirmModal
│       └── ui.jsx                  # 共用 UI 元件
└── docker-compose.yml              # 啟動本機 PostgreSQL
```

## 資料庫結構

```sql
users           -- id, email, password, created_at
bookmarks       -- id, user_id, url, title, description, created_at
tags            -- id, user_id, name  (UNIQUE per user)
bookmark_tags   -- bookmark_id, tag_id  (多對多中間表)
```

## API 端點

### 認證

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/auth/register` | 註冊 |
| POST | `/api/auth/login` | 登入，回傳 JWT |

### 書籤（需 Bearer token）

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/bookmarks` | 取得所有書籤 |
| POST | `/api/bookmarks` | 新增書籤 |
| PUT | `/api/bookmarks/{id}` | 更新書籤 |
| DELETE | `/api/bookmarks/{id}` | 刪除書籤 |
| POST | `/api/bookmarks/{id}/tags` | 新增標籤 |
| DELETE | `/api/bookmarks/{id}/tags/{tagName}` | 移除標籤 |

## 本機開發

### 前置需求

- Java 17+
- Node.js 18+
- Docker & Docker Compose

### 環境變數

複製 `.env.example` 為 `.env`，並依欄位說明填入對應的值。

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

前端預設開在 `http://localhost:5173`，後端開在 `http://localhost:8080`。

### 執行測試

```bash
# 後端測試
cd backend && ./mvnw test

# 前端測試
cd frontend && npm run test
```

## 部署說明

- **前端**：推送後 Vercel 自動部署，需設定環境變數 `REACT_APP_API_URL` 指向後端 URL。
- **後端 / DB**：部署於 Render，使用 Render 提供的 PostgreSQL。Render 免費方案有約 30 秒冷啟動延遲，為預期行為。
