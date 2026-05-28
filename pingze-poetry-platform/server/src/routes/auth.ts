import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { User, LoginResponse, ApiResponse } from '../types';

const router = Router();

const SALT_ROUNDS = 10;

router.post('/register', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: '用户名、邮箱和密码为必填项',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: '密码长度至少为6位',
      });
      return;
    }

    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({
        success: false,
        error: '用户名或邮箱已存在',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING user_id, username, email, avatar_url, bio, created_at, updated_at`,
      [username, email, passwordHash]
    );

    const user: User = result.rows[0];

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: { token, user },
      message: '注册成功',
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({
      success: false,
      error: '注册失败，请稍后重试',
    });
  }
});

router.post('/login', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: '邮箱和密码为必填项',
      });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: '邮箱或密码错误',
      });
      return;
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: '邮箱或密码错误',
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: { token, user: userWithoutPassword } as LoginResponse,
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试',
    });
  }
});

router.get('/me', async (req: Request, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '未认证',
      });
      return;
    }

    const result = await pool.query(
      'SELECT user_id, username, email, avatar_url, bio, created_at, updated_at FROM users WHERE user_id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0] as User,
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({
      success: false,
      error: '获取用户信息失败',
    });
  }
});

export default router;
