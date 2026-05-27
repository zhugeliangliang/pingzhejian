import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './middleware/auth';
import authRoutes from './routes/auth';
import poemRoutes from './routes/poems';
import templateRoutes from './routes/templates';
import exportRoutes from './routes/export';
import { ApiResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/export', exportRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((err: Error, req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  console.error('未处理的错误:', err);

  res.status(500).json({
    success: false,
    error: '服务器内部错误',
  });
});

app.listen(PORT, () => {
  console.log(`平仄间 (PingZe Jian) 服务器已启动，端口: ${PORT}`);
});

export default app;
