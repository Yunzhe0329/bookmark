## Structure
controller → service → repository，DTO 不直接暴露 entity

## Flyway convention
V{n}__{描述}.sql，已執行的檔案不能修改，只能新增

## Auth
JwtAuthFilter extends OncePerRequestFilter
Controller 用 @AuthenticationPrincipal 取當前用戶

## Env vars (local)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bookmark_db
JWT_SECRET=任意長字串