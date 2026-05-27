import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { ApiResponse, Poem, PaginatedResponse, CreatePoemRequest, UpdatePoemRequest, PoemVersion, CreateVersionRequest } from '../types';

const router = Router();

router.get('/', optionalAuthMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.userId;

    const page = parseInt(req.query.page as string || '1', 10);
    const pageSize = parseInt(req.query.pageSize as string || '20', 10);
    const offset = (page - 1) * pageSize;

    const poem_type = req.query.poem_type as string | undefined;
    const is_publishedParam = req.query.is_published as string | undefined;
    const search = req.query.search as string | undefined;
    const sort_by = req.query.sort_by as string || 'created_at';
    const sort_order = req.query.sort_order as string || 'DESC';

    const whereClauses: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (userId) {
      whereClauses.push(`p.user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    } else {
      whereClauses.push(`p.is_published = true`);
    }

    if (poem_type) {
      whereClauses.push(`p.poem_type = $${paramIndex}`);
      params.push(poem_type);
      paramIndex++;
    }

    if (is_publishedParam !== undefined) {
      whereClauses.push(`p.is_published = $${paramIndex}`);
      params.push(is_publishedParam === 'true');
      paramIndex++;
    }

    if (search) {
      whereClauses.push(`(p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const validSortColumns = ['created_at', 'updated_at', 'like_count'];
    const validSortOrders = ['ASC', 'DESC'];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = validSortOrders.includes(sort_order) ? sort_order : 'DESC';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM poems p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      `SELECT p.*, u.username as author_username, u.avatar_url as author_avatar_url,
              t.name as template_name
       FROM poems p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN templates t ON p.template_id = t.template_id
       ${whereClause}
       ORDER BY p.${sortColumn} ${sortOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, pageSize, offset]
    );

    const poems: Poem[] = result.rows.map((row) => ({
      ...row,
      author: {
        username: row.author_username,
        avatar_url: row.author_avatar_url,
      },
      author_username: undefined,
      author_avatar_url: undefined,
    }));

    res.json({
      success: true,
      data: {
        items: poems,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      } as PaginatedResponse<Poem>,
    });
  } catch (err) {
    console.error('获取诗词列表错误:', err);
    res.status(500).json({
      success: false,
      error: '获取诗词列表失败',
    });
  }
});

router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, u.username as author_username, u.avatar_url as author_avatar_url,
              t.name as template_name
       FROM poems p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN templates t ON p.template_id = t.template_id
       WHERE p.poem_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const poem = result.rows[0];

    if (!poem.is_published && poem.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: '无权访问此诗词',
      });
      return;
    }

    const poemWithAuthor: Poem = {
      ...poem,
      author: {
        username: poem.author_username,
        avatar_url: poem.author_avatar_url,
      },
    };

    res.json({
      success: true,
      data: poemWithAuthor,
    });
  } catch (err) {
    console.error('获取诗词错误:', err);
    res.status(500).json({
      success: false,
      error: '获取诗词失败',
    });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.userId;
    const { title, content, poem_type, template_id, pingze_pattern, rhyme_scheme, is_published = false }: CreatePoemRequest = req.body;

    if (!title || !content || !poem_type) {
      res.status(400).json({
        success: false,
        error: '标题、内容和类型为必填项',
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO poems (user_id, title, content, poem_type, template_id, pingze_pattern, rhyme_scheme, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, title, content, poem_type, template_id || null, pingze_pattern || null, rhyme_scheme || null, is_published]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0] as Poem,
      message: '诗词创建成功',
    });
  } catch (err) {
    console.error('创建诗词错误:', err);
    res.status(500).json({
      success: false,
      error: '创建诗词失败',
    });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { title, content, poem_type, template_id, pingze_pattern, rhyme_scheme, is_published }: UpdatePoemRequest = req.body;

    const existingResult = await pool.query(
      'SELECT * FROM poems WHERE poem_id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const existingPoem = existingResult.rows[0];

    if (existingPoem.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: '无权修改此诗词',
      });
      return;
    }

    const newVersion = existingPoem.version + 1;

    const updateFields: string[] = [];
    const updateValues: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      updateValues.push(title);
      paramIndex++;
    }
    if (content !== undefined) {
      updateFields.push(`content = $${paramIndex}`);
      updateValues.push(content);
      paramIndex++;
    }
    if (poem_type !== undefined) {
      updateFields.push(`poem_type = $${paramIndex}`);
      updateValues.push(poem_type);
      paramIndex++;
    }
    if (template_id !== undefined) {
      updateFields.push(`template_id = $${paramIndex}`);
      updateValues.push(template_id || null);
      paramIndex++;
    }
    if (pingze_pattern !== undefined) {
      updateFields.push(`pingze_pattern = $${paramIndex}`);
      updateValues.push(pingze_pattern || null);
      paramIndex++;
    }
    if (rhyme_scheme !== undefined) {
      updateFields.push(`rhyme_scheme = $${paramIndex}`);
      updateValues.push(rhyme_scheme || null);
      paramIndex++;
    }
    if (is_published !== undefined) {
      updateFields.push(`is_published = $${paramIndex}`);
      updateValues.push(is_published);
      paramIndex++;
    }

    updateFields.push(`version = $${paramIndex}`);
    updateValues.push(newVersion);
    paramIndex++;

    updateValues.push(id);

    const result = await pool.query(
      `UPDATE poems SET ${updateFields.join(', ')} WHERE poem_id = $${paramIndex} RETURNING *`,
      updateValues
    );

    res.json({
      success: true,
      data: result.rows[0] as Poem,
      message: '诗词更新成功',
    });
  } catch (err) {
    console.error('更新诗词错误:', err);
    res.status(500).json({
      success: false,
      error: '更新诗词失败',
    });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const existingResult = await pool.query(
      'SELECT user_id FROM poems WHERE poem_id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    if (existingResult.rows[0].user_id !== userId) {
      res.status(403).json({
        success: false,
        error: '无权删除此诗词',
      });
      return;
    }

    await pool.query('DELETE FROM poems WHERE poem_id = $1', [id]);

    res.json({
      success: true,
      message: '诗词删除成功',
    });
  } catch (err) {
    console.error('删除诗词错误:', err);
    res.status(500).json({
      success: false,
      error: '删除诗词失败',
    });
  }
});

router.get('/:id/versions', optionalAuthMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const poemResult = await pool.query(
      'SELECT user_id, is_published FROM poems WHERE poem_id = $1',
      [id]
    );

    if (poemResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const poem = poemResult.rows[0];

    if (!poem.is_published && poem.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: '无权访问此诗词的版本历史',
      });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM poem_versions WHERE poem_id = $1 ORDER BY version_number DESC',
      [id]
    );

    res.json({
      success: true,
      data: result.rows as PoemVersion[],
    });
  } catch (err) {
    console.error('获取版本历史错误:', err);
    res.status(500).json({
      success: false,
      error: '获取版本历史失败',
    });
  }
});

router.post('/:id/versions', authMiddleware, async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { change_summary }: CreateVersionRequest = req.body;

    const poemResult = await pool.query(
      'SELECT * FROM poems WHERE poem_id = $1',
      [id]
    );

    if (poemResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: '诗词不存在',
      });
      return;
    }

    const poem = poemResult.rows[0];

    if (poem.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: '无权为此诗词创建版本',
      });
      return;
    }

    const newVersionNumber = poem.version;

    const result = await pool.query(
      `INSERT INTO poem_versions (poem_id, content, title, version_number, change_summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, poem.content, poem.title, newVersionNumber, change_summary || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0] as PoemVersion,
      message: '版本创建成功',
    });
  } catch (err) {
    console.error('创建版本错误:', err);
    res.status(500).json({
      success: false,
      error: '创建版本失败',
    });
  }
});

export default router;
