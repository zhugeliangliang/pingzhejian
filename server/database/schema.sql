-- ============================================
-- 平仄间 (PingZe Jian) - 中国诗词创作平台
-- 数据库架构设计 - AnalyticDB PostgreSQL
-- ============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 用户表 (users)
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

COMMENT ON TABLE users IS '用户信息表';
COMMENT ON COLUMN users.user_id IS '用户唯一标识';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.email IS '邮箱';
COMMENT ON COLUMN users.password_hash IS '密码哈希';
COMMENT ON COLUMN users.avatar_url IS '头像URL';
COMMENT ON COLUMN users.bio IS '个人简介';

-- ============================================
-- 词牌/诗体模板表 (templates)
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

COMMENT ON TABLE templates IS '诗词模板表（词牌/诗体）';
COMMENT ON COLUMN templates.template_id IS '模板唯一标识';
COMMENT ON COLUMN templates.name IS '模板名称（如水调歌头、五言绝句）';
COMMENT ON COLUMN templates.type IS '类型：词/诗/曲/赋';
COMMENT ON COLUMN templates.dynasty IS '朝代';
COMMENT ON COLUMN templates.line_count IS '句数';
COMMENT ON COLUMN templates.character_count IS '总字数';
COMMENT ON COLUMN templates.pingze_pattern IS '平仄模式（JSON格式）';
COMMENT ON COLUMN templates.rhyme_scheme IS '押韵规则（JSON格式）';
COMMENT ON COLUMN templates.description IS '模板描述';
COMMENT ON COLUMN templates.example_poem IS '代表作品示例';

-- ============================================
-- 诗词作品表 (poems)
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

COMMENT ON TABLE poems IS '诗词作品表';
COMMENT ON COLUMN poems.poem_id IS '诗词唯一标识';
COMMENT ON COLUMN poems.user_id IS '作者ID';
COMMENT ON COLUMN poems.title IS '标题';
COMMENT ON COLUMN poems.content IS '正文内容';
COMMENT ON COLUMN poems.poem_type IS '类型：词/诗/曲/赋';
COMMENT ON COLUMN poems.template_id IS '使用的模板ID';
COMMENT ON COLUMN poems.pingze_pattern IS '平仄格式';
COMMENT ON COLUMN poems.rhyme_scheme IS '押韵方案';
COMMENT ON COLUMN poems.version IS '版本号';
COMMENT ON COLUMN poems.is_published IS '是否已发布';
COMMENT ON COLUMN poems.like_count IS '点赞数（冗余字段，用于排序）';

-- ============================================
-- 诗词版本历史表 (poem_versions)
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

COMMENT ON TABLE poem_versions IS '诗词版本历史表';
COMMENT ON COLUMN poem_versions.version_id IS '版本唯一标识';
COMMENT ON COLUMN poem_versions.poem_id IS '所属诗词ID';
COMMENT ON COLUMN poem_versions.content IS '该版本内容';
COMMENT ON COLUMN poem_versions.title IS '该版本标题';
COMMENT ON COLUMN poem_versions.version_number IS '版本号';
COMMENT ON COLUMN poem_versions.change_summary IS '修改说明';

-- ============================================
-- 诗词点赞表 (poem_likes)
-- ============================================
CREATE TABLE IF NOT EXISTS poem_likes (
    like_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id         UUID         NOT NULL REFERENCES poems(poem_id) ON DELETE CASCADE,
    user_id         UUID         NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (poem_id, user_id)
);

COMMENT ON TABLE poem_likes IS '诗词点赞表';
COMMENT ON COLUMN poem_likes.like_id IS '点赞唯一标识';
COMMENT ON COLUMN poem_likes.poem_id IS '诗词ID';
COMMENT ON COLUMN poem_likes.user_id IS '点赞用户ID';

-- ============================================
-- 索引设计
-- ============================================

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 诗词表索引
CREATE INDEX idx_poems_user_id ON poems(user_id);
CREATE INDEX idx_poems_template_id ON poems(template_id);
CREATE INDEX idx_poems_is_published ON poems(is_published);
CREATE INDEX idx_poems_created_at ON poems(created_at DESC);
CREATE INDEX idx_poems_like_count ON poems(like_count DESC);
CREATE INDEX idx_poems_user_published ON poems(user_id, is_published, created_at DESC);

-- 版本表索引
CREATE INDEX idx_poem_versions_poem_id ON poem_versions(poem_id);
CREATE INDEX idx_poem_versions_version_number ON poem_versions(poem_id, version_number DESC);

-- 点赞表索引
CREATE INDEX idx_poem_likes_poem_id ON poem_likes(poem_id);
CREATE INDEX idx_poem_likes_user_id ON poem_likes(user_id);
CREATE INDEX idx_poem_likes_poem_user ON poem_likes(poem_id, user_id);

-- ============================================
-- 触发器：自动更新 updated_at
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
-- 触发器：同步更新 poems.like_count
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
