import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authMiddleware } from '../middleware/auth';
import { ApiResponse, Poem } from '../types';

const router = Router();

router.post('/text', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { poem_id } = req.body;

    if (!poem_id) {
      res.status(400).json({
        success: false,
        error: '诗词ID为必填项',
      });
      return;
    }

    const result = await pool.query(
      `SELECT p.*, u.username as author_username, t.name as template_name
       FROM poems p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN templates t ON p.template_id = t.template_id
       WHERE p.poem_id = $1`,
      [poem_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const poem = result.rows[0];

    const formattedText = [
      poem.title,
      '',
      `作者：${poem.author_username}`,
      `类型：${poem.poem_type}`,
      poem.template_name ? `词牌/诗体：${poem.template_name}` : '',
      '',
      poem.content,
      '',
      `创建时间：${new Date(poem.created_at).toLocaleString('zh-CN')}`,
      `版本：v${poem.version}`,
    ].filter(Boolean).join('\n');

    res.json({
      success: true,
      data: {
        poem_id: poem.poem_id,
        title: poem.title,
        formatted_text: formattedText,
      },
    });
  } catch (err) {
    console.error('导出文本错误:', err);
    res.status(500).json({
      success: false,
      error: '导出文本失败',
    });
  }
});

router.post('/image', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { poem_id } = req.body;

    if (!poem_id) {
      res.status(400).json({
        success: false,
        error: '诗词ID为必填项',
      });
      return;
    }

    const result = await pool.query(
      `SELECT p.*, u.username as author_username
       FROM poems p
       LEFT JOIN users u ON p.user_id = u.user_id
       WHERE p.poem_id = $1`,
      [poem_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const poem = result.rows[0];

    const contentLines = poem.content.split('\n').filter((line: string) => line.trim());

    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Serif SC', 'SimSun', serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .poem-card {
      background: #fffef8;
      border-radius: 16px;
      padding: 3rem 2.5rem;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }

    .poem-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #e74c3c, #f39c12, #e74c3c);
    }

    .poem-type {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #f5f0e8;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #8b7355;
      margin-bottom: 1.5rem;
      letter-spacing: 2px;
    }

    .poem-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2c1810;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .poem-author {
      text-align: center;
      color: #8b7355;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #c9b99a, transparent);
      margin: 0 auto 2rem;
    }

    .poem-content {
      text-align: center;
      font-size: 1.1rem;
      line-height: 2;
      color: #3d2b1f;
      letter-spacing: 1px;
    }

    .poem-content p {
      margin: 0.5rem 0;
    }

    .poem-footer {
      margin-top: 2.5rem;
      text-align: right;
      font-size: 0.75rem;
      color: #b0a090;
      border-top: 1px solid #e8e0d5;
      padding-top: 1rem;
    }

    .seal {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border: 2px solid #c0392b;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c0392b;
      font-size: 0.7rem;
      font-weight: 700;
      transform: rotate(-5deg);
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="poem-card">
    <span class="poem-type">${poem.poem_type}</span>
    <h1 class="poem-title">${poem.title}</h1>
    <p class="poem-author">${poem.author_username}</p>
    <div class="divider"></div>
    <div class="poem-content">
      ${contentLines.map((line: string) => `<p>${line}</p>`).join('\n      ')}
    </div>
    <div class="poem-footer">
      平仄间 · ${new Date(poem.created_at).toLocaleDateString('zh-CN')}
    </div>
    <div class="seal">平仄间</div>
  </div>
</body>
</html>`;

    res.json({
      success: true,
      data: {
        poem_id: poem.poem_id,
        title: poem.title,
        html_content: htmlContent,
      },
    });
  } catch (err) {
    console.error('生成诗词卡片错误:', err);
    res.status(500).json({
      success: false,
      error: '生成诗词卡片失败',
    });
  }
});

export default router;
