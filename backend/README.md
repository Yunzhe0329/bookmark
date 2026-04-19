# BookMark Backend

RESTful API built with Spring Boot 3, providing authentication and bookmark management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.5 |
| Language | Java 17 |
| Database | PostgreSQL 15 |
| Migration | Flyway |
| Security | Spring Security + JWT (jjwt 0.12.6) |
| ORM | Spring Data JPA (Hibernate) |

---

## Project Structure

```
src/main/java/com/example/BookMark/
├── controller/        # HTTP endpoints
│   ├── AuthController.java
│   └── BookmarkController.java
├── service/           # Business logic
│   ├── AuthService.java
│   └── BookmarkService.java
├── repository/        # Database queries
│   ├── UserRepository.java
│   ├── BookmarkRepository.java
│   └── TagRepository.java
├── entity/            # JPA entities
│   ├── User.java
│   ├── Bookmark.java
│   └── Tag.java
├── dto/               # Request / Response shapes
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── BookmarkRequest.java
│   ├── BookmarkResponse.java
│   └── TagRequest.java
├── security/
│   ├── JwtUtil.java         # Token generation & validation
│   └── JwtAuthFilter.java   # Per-request JWT verification
└── config/
    └── SecurityConfig.java  # Security rules & beans
```

---

## Database Schema

```sql
users
  id         BIGSERIAL PRIMARY KEY
  email      VARCHAR(255) NOT NULL UNIQUE
  password   VARCHAR(255) NOT NULL          -- BCrypt hashed
  created_at TIMESTAMP   NOT NULL DEFAULT NOW()

bookmarks
  id          BIGSERIAL PRIMARY KEY
  user_id     BIGINT NOT NULL  →  users(id) ON DELETE CASCADE
  url         TEXT NOT NULL
  title       VARCHAR(500)
  description TEXT
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()

tags
  id      BIGSERIAL PRIMARY KEY
  user_id BIGINT       NOT NULL  →  users(id) ON DELETE CASCADE
  name    VARCHAR(100) NOT NULL
  UNIQUE (user_id, name)           -- each user has their own tag namespace

bookmark_tags  (join table)
  bookmark_id  →  bookmarks(id) ON DELETE CASCADE
  tag_id       →  tags(id)      ON DELETE CASCADE
  PRIMARY KEY (bookmark_id, tag_id)
```

---

## API Reference

### Authentication

All auth endpoints are public (no token required).

#### POST `/api/auth/register`

Register a new user.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- `email` — valid email format, required
- `password` — minimum 8 characters, required

**Responses:**
| Status | Meaning |
|--------|---------|
| 201 Created | Registration successful |
| 409 Conflict | Email already in use |
| 400 Bad Request | Validation failed |

---

#### POST `/api/auth/login`

Login and receive a JWT token.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "<jwt>"
}
```

**Responses:**
| Status | Meaning |
|--------|---------|
| 200 OK | Login successful, token returned |
| 401 Unauthorized | Invalid email or password |

---

### Bookmarks

All bookmark endpoints require the `Authorization` header:
```
Authorization: Bearer <jwt>
```

#### GET `/api/bookmarks`

Get all bookmarks for the authenticated user.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "title": "Example",
    "description": "An example site",
    "createdAt": "2026-04-19T10:00:00",
    "tags": ["reading", "tech"]
  }
]
```

---

#### POST `/api/bookmarks`

Create a new bookmark.

**Request body:**
```json
{
  "url": "https://example.com",
  "title": "Example",
  "description": "An example site"
}
```

**Validation:**
- `url` — required

**Responses:**
| Status | Meaning |
|--------|---------|
| 201 Created | Bookmark created |
| 400 Bad Request | Validation failed |

---

#### PUT `/api/bookmarks/{id}`

Update an existing bookmark.

**Request body:** same as POST

**Responses:**
| Status | Meaning |
|--------|---------|
| 200 OK | Bookmark updated |
| 404 Not Found | Bookmark not found or does not belong to user |

---

#### DELETE `/api/bookmarks/{id}`

Delete a bookmark.

**Responses:**
| Status | Meaning |
|--------|---------|
| 204 No Content | Bookmark deleted |
| 404 Not Found | Bookmark not found or does not belong to user |

---

#### POST `/api/bookmarks/{id}/tags`

Add a tag to a bookmark. If the tag does not exist for this user, it is created automatically.

**Request body:**
```json
{
  "name": "reading"
}
```

**Response (200 OK):** updated `BookmarkResponse` with new tag included.

---

#### DELETE `/api/bookmarks/{id}/tags/{tagName}`

Remove a tag from a bookmark. If the tag does not exist, the request is silently ignored (no error).

**Response (200 OK):** updated `BookmarkResponse` with tag removed.

---

## Security

- Passwords are hashed with **BCrypt**.
- JWT is signed with HMAC-SHA and expires after **24 hours** (`app.jwt.expiration-ms=86400000`).
- Session is **stateless** — no server-side session is stored.
- CSRF protection is **disabled** (not needed for stateless JWT).
- `JwtAuthFilter` runs on every request, validates the token, and injects the `User` object into the Spring Security context.

---

## Local Development

### Prerequisites

- Java 17
- Docker (for PostgreSQL)
- Maven

### Start the database

```bash
docker-compose up -d db
```

### Configure environment

Create `src/main/resources/application-local.properties` (already in `.gitignore`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookmark_db
spring.datasource.username=bookmark_user
spring.datasource.password=bookmark_pass
app.jwt.secret=<any string of at least 32 characters>
```

### Run the application

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The server starts on `http://localhost:8080`.

### Run tests

```bash
# All tests
./mvnw test

# Single test class
./mvnw test -Dtest=AuthServiceTest
./mvnw test -Dtest=BookmarkServiceTest
```

---

## Design Decisions

- **Tag namespace per user** — `UNIQUE(user_id, name)` ensures tags are isolated between users. Two users can have a tag with the same name without conflict.
- **`Bookmark.addTag()` / `removeTag()` helpers** — always use these methods instead of mutating the `tags` collection directly, to keep the bidirectional JPA relationship in sync.
- **`/error` is `permitAll()`** — required so Spring Boot's default error responses are not blocked by the security filter.
- **DTOs over entities** — controllers never return raw JPA entities. `BookmarkResponse` maps the entity fields (including tag names) to a safe, serializable shape.