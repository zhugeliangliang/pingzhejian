-- ============================================
-- 平仄间 (PingZe Jian) - 中国诗词创作平台
-- 迁移脚本 001: 初始架构
-- 适用于: PostgreSQL / AnalyticDB PostgreSQL
-- ============================================

-- 迁移事务开始
BEGIN;

-- 创建迁移记录表（用于追踪迁移历史）
CREATE TABLE IF NOT EXISTS schema_migrations (
    version     INTEGER PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    applied_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 启用必要扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    bio             TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. 词牌/诗体模板表 (templates)
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
    template_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    type            VARCHAR(20)  NOT NULL CHECK (type IN ('词', '诗', '曲', '赋')),
    dynasty         VARCHAR(50),
    line_count      INTEGER      NOT NULL,
    character_count INTEGER      NOT NULL,
    pingze_pattern  JSONB        NOT NULL,
    rhyme_scheme    JSONB        NOT NULL,
    description     TEXT,
    example_poem    TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. 诗词作品表 (poems)
-- ============================================
CREATE TABLE IF NOT EXISTS poems (
    poem_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID         NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    content         TEXT         NOT NULL,
    poem_type       VARCHAR(20)  NOT NULL CHECK (poem_type IN ('词', '诗', '曲', '赋')),
    template_id     UUID         REFERENCES templates(template_id) ON DELETE SET NULL,
    pingze_pattern  VARCHAR(500),
    rhyme_scheme    VARCHAR(500),
    version         INTEGER      NOT NULL DEFAULT 1,
    is_published    BOOLEAN      NOT NULL DEFAULT FALSE,
    like_count      INTEGER      NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. 诗词版本历史表 (poem_versions)
-- ============================================
CREATE TABLE IF NOT EXISTS poem_versions (
    version_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id         UUID         NOT NULL REFERENCES poems(poem_id) ON DELETE CASCADE,
    content         TEXT         NOT NULL,
    title           VARCHAR(200),
    version_number  INTEGER      NOT NULL,
    change_summary  TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. 诗词点赞表 (poem_likes)
-- ============================================
CREATE TABLE IF NOT EXISTS poem_likes (
    like_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id         UUID         NOT NULL REFERENCES poems(poem_id) ON DELETE CASCADE,
    user_id         UUID         NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (poem_id, user_id)
);

-- ============================================
-- 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE INDEX IF NOT EXISTS idx_poems_user_id ON poems(user_id);
CREATE INDEX IF NOT EXISTS idx_poems_template_id ON poems(template_id);
CREATE INDEX IF NOT EXISTS idx_poems_is_published ON poems(is_published);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON poems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_like_count ON poems(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_poems_user_published ON poems(user_id, is_published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_poem_versions_poem_id ON poem_versions(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_versions_version_number ON poem_versions(poem_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_poem_likes_poem_id ON poem_likes(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_likes_user_id ON poem_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_poem_likes_poem_user ON poem_likes(poem_id, user_id);

-- ============================================
-- 触发器函数：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_poems_updated_at
    BEFORE UPDATE ON poems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 触发器函数：同步更新 poems.like_count
-- ============================================
CREATE OR REPLACE FUNCTION sync_poem_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE poems SET like_count = like_count + 1 WHERE poem_id = NEW.poem_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE poems SET like_count = like_count - 1 WHERE poem_id = OLD.poem_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_poem_likes_sync_count
    AFTER INSERT OR DELETE ON poem_likes
    FOR EACH ROW
    EXECUTE FUNCTION sync_poem_like_count();

-- ============================================
-- 记录迁移版本
-- ============================================
INSERT INTO schema_migrations (version, name)
VALUES (1, 'initial_schema')
ON CONFLICT (version) DO NOTHING;

COMMIT;
