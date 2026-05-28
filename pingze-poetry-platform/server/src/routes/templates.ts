import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { ApiResponse, Template } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const type = req.query.type as string | undefined;
    const dynasty = req.query.dynasty as string | undefined;
    const search = req.query.search as string | undefined;

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (type) {
      whereClauses.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (dynasty) {
      whereClauses.push(`dynasty = $${paramIndex}`);
      params.push(dynasty);
      paramIndex++;
    }

    if (search) {
      whereClauses.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT * FROM templates ${whereClause} ORDER BY name ASC`,
      params
    );

    res.json({
      success: true,
      data: result.rows as Template[],
    });
  } catch (err) {
    console.error('获取模板列表错误:', err);
    res.status(500).json({
      success: false,
      error: '获取模板列表失败',
    });
  }
});

router.get('/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM templates WHERE template_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '模板不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0] as Template,
    });
  } catch (err) {
    console.error('获取模板错误:', err);
    res.status(500).json({
      success: false,
      error: '获取模板失败',
    });
  }
});

export default router;
