# 平仄间 (PingZe Jian) - 中国诗词创作平台

一个现代化的诗词创作 Web 应用，融合新中式极简美学与智能辅助工具，助您在创作中精准把握平仄格律。

## 功能特性

- **平仄格律检测** - 实时检测输入文字的平仄属性，支持数百个常用汉字，自动处理多音字
- **词牌/诗体模板库** - 内置经典词牌（水调歌头、满江红等）和诗体（绝句、律诗等）模板
- **在线创作工作台** - 直观的编辑器界面，实时显示平仄标注和格律检测结果
- **AI 辅助创作** - 智能韵脚建议和对仗建议，提升创作体验
- **作品管理** - 保存、编辑、删除作品，支持版本历史记录
- **分享导出** - 生成精美诗词卡片图片或复制纯文本格式
- **响应式设计** - 适配桌面和移动端，支持离线使用

## 技术栈

### 前端
- React 19 + TypeScript
- Vite 8 构建工具
- TailwindCSS 4 样式框架
- React Router 7 路由管理
- html2canvas 图片生成

### 后端
- Express.js 4 + TypeScript
- AnalyticDB PostgreSQL 数据库
- JWT 身份认证
- bcryptjs 密码加密

## 快速开始

### 前置要求

- Node.js >= 18
- PostgreSQL 数据库

### 安装依赖

```bash
# 安装前端依赖
cd pingze-poetry-platform
npm install

# 安装后端依赖
cd server
npm install
```

### 配置环境变量

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和 JWT 密钥。

### 初始化数据库

```bash
# 运行数据库迁移
psql -U <user> -d <database> -f server/database/schema.sql

# 插入种子数据（可选）
psql -U <user> -d <database> -f server/database/seed.sql
```

### 启动服务

```bash
# 启动后端服务（终端 1）
cd server
npm run dev

# 启动前端开发服务器（终端 2）
cd pingze-poetry-platform
npm run dev
```

前端应用将在 `http://localhost:5173` 启动，后端 API 在 `http://localhost:3001` 运行。

## 项目结构

```
├── pingze-poetry-platform/        # 前端应用
│   ├── src/
│   │   ├── components/            # UI 组件
│   │   │   ├── editor/            # 编辑器相关组件
│   │   │   ├── works/             # 作品管理组件
│   │   │   ├── ai/                # AI 辅助组件
│   │   │   └── share/             # 分享相关组件
│   │   ├── pages/                 # 页面组件
│   │   ├── hooks/                 # 自定义 React Hooks
│   │   ├── utils/                 # 工具函数（平仄检测、韵部查询等）
│   │   └── data/                  # 静态数据（模板等）
│   └── server/                    # 后端服务
│       └── src/
│           ├── routes/            # API 路由
│           ├── middleware/        # 中间件（认证等）
│           └── db/                # 数据库配置
├── server/database/               # 数据库脚本
│   ├── schema.sql                 # 数据库架构
│   ├── migrations/                # 迁移文件
│   └── seed.sql                   # 种子数据
└── .trae/specs/                   # 项目规格文档
```

## 可用脚本

### 前端

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run preview` | 预览生产构建 |

### 后端

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器（热重载） |
| `npm run build` | 编译 TypeScript |
| `npm run start` | 运行生产版本 |
| `npm run typecheck` | 运行 TypeScript 类型检查 |

## 设计规范

- **主题**: 新中式极简美学，融合传统书法意境与现代设计语言
- **色彩**: 宣纸白、墨黑、朱砂红、靛青为主色调
- **排版**: 竖排/横排可选，留白充足，呼吸感强
- **字体**: 楷体/宋体类书法字体，配合现代无衬线字体
