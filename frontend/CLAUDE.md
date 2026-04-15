## API
axios instance 在 src/api/，interceptor 自動帶 Bearer token
REACT_APP_API_URL 指向後端（local: http://localhost:8080）

## Auth state
JWT 存 localStorage，useAuth hook 管理登入狀態