# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

React (Vite) + Spring Boot 3 + PostgreSQL 15 + Docker Compose  
Deploy: Vercel (frontend) + Render (backend + DB)

## Current progress

**Backend: COMPLETE and tested locally.**  
**Next task: write tests, then start frontend.**

Completed backend layers (all tested with curl):
- Flyway migration (`V1__init_schema.sql`): users / bookmarks / tags / bookmark_tags
- JPA Entities: `User`, `Bookmark`, `Tag`
- Repositories: `UserRepository`, `BookmarkRepository`, `TagRepository`
- Services: `AuthService`, `BookmarkService`
- DTOs: `AuthRequest`, `AuthResponse`, `BookmarkRequest`, `BookmarkResponse`, `TagRequest`
- Controllers: `AuthController` (`/api/auth/**`), `BookmarkController` (`/api/bookmarks/**`)
- Security: `JwtUtil`, `JwtAuthFilter`, `SecurityConfig`

**Next session should start with: writing tests for `BookmarkService` and `AuthService`, then frontend setup.**

Known quirk: `/error` must be `permitAll()` in `SecurityConfig` so Spring Boot error responses are not blocked by Security.

## Local development

```bash
# Start only the database (run backend from IDE for easier debugging)
docker-compose up -d db

# Backend (must use local profile for env vars)
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Frontend
cd frontend && npm run dev

# Run backend tests
cd backend && ./mvnw test

# Run a single backend test class
cd backend && ./mvnw test -Dtest=MyServiceTest
```

## Backend architecture

**Package layout**: `com.example.BookMark`  
Layer pattern: `controller → service → repository`; DTOs are used to avoid exposing entities directly.

**Auth**: `JwtAuthFilter extends OncePerRequestFilter`. Controllers use `@AuthenticationPrincipal` to get the current user. JWT is issued on login and validated on every request.

**Database migrations**: Flyway with naming convention `V{n}__{description}.sql`. Already-executed files must never be modified — only add new migration files.

**Local env vars** (set in IDE run config or `.env`):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bookmark_db
JWT_SECRET=<any long string>
```

## Frontend architecture

**API client**: Axios instance in `src/api/` with an interceptor that automatically attaches the `Bearer` token.  
**Auth state**: JWT stored in `localStorage`, managed via `useAuth` hook.  
**Config**: `REACT_APP_API_URL` points to the backend (local: `http://localhost:8080`).

## Key design decisions

- `Tag` has `UNIQUE(user_id, name)`: each user has their own tag namespace (no sharing between users).
- `Bookmark.addTag()` / `removeTag()` helpers keep the bidirectional JPA relationship in sync — always use these instead of mutating the collections directly.
- Render free tier has ~30 s cold-start delay on the backend — expected behavior, not a bug.