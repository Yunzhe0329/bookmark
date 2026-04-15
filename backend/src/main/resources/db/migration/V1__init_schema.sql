CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE bookmarks (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url         TEXT         NOT NULL,
    title       VARCHAR(500),
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE tags (
    id      BIGSERIAL PRIMARY KEY,
    user_id BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name    VARCHAR(100) NOT NULL,
    CONSTRAINT uq_user_tag UNIQUE (user_id, name)
);

CREATE TABLE bookmark_tags (
    bookmark_id BIGINT NOT NULL REFERENCES bookmarks(id) ON DELETE CASCADE,
    tag_id      BIGINT NOT NULL REFERENCES tags(id)      ON DELETE CASCADE,
    PRIMARY KEY (bookmark_id, tag_id)
);
