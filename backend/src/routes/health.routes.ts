import { Router } from 'express';
import { getPrisma } from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  let database: 'ok' | 'error' | 'in-memory' = 'in-memory';
  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      database = 'ok';
    } catch {
      database = 'error';
    }
  }
  // Configured-but-unreachable DB is a real problem worth surfacing to Render's
  // health check. In-memory demo mode (no DATABASE_URL) is still healthy (200).
  const httpStatus = database === 'error' ? 503 : 200;
  res.status(httpStatus).json({
    success: database !== 'error',
    message: 'RuralMate AI API is running',
    api: 'ok',
    backend: 'ok',
    database,
  });
});

export default router;
