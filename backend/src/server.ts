import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { getPrisma } from './lib/prisma';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analysisRoutes from './routes/analysis.routes';
import financeRoutes from './routes/finance.routes';
import schemeRoutes from './routes/scheme.routes';
import aiRoutes from './routes/ai.routes';
import productRoutes from './routes/product.routes';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Render (and most PaaS hosts) put the app behind a reverse proxy that sets
// X-Forwarded-For. Trust the first proxy hop so req.ip is the real client IP —
// required for express-rate-limit to bucket per client instead of per proxy.
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '5mb' }));

// Throttle auth endpoints to limit abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// Throttle AI endpoints — each call can hit the paid OpenRouter API, so cap the
// per-IP rate to prevent cost/abuse spikes.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI requests. Please slow down and try again shortly.' },
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/product', productRoutes);

app.get('/', (_req, res) => {
  res.json({ success: true, message: 'RuralMate AI API. See /api/health' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler. Client errors (e.g. malformed JSON body from express.json,
// which sets status 400 / type 'entity.parse.failed') are returned as 4xx
// instead of masking them as 500. Only genuine server errors are logged and 500.
app.use(
  (
    err: Error & { status?: number; statusCode?: number; type?: string },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status = err.status ?? err.statusCode;
    if (err.type === 'entity.parse.failed' || status === 400) {
      res.status(400).json({ success: false, message: 'Invalid JSON payload' });
      return;
    }
    if (typeof status === 'number' && status >= 400 && status < 500) {
      res.status(status).json({ success: false, message: 'Bad request' });
      return;
    }
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  },
);

// Bind to 0.0.0.0 so cloud hosts (e.g. Render) can route external traffic.
const server = app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`✅ RuralMate AI backend running on port ${PORT}`);
  console.log(`   Health check: /api/health`);
});

// Graceful shutdown: on Render (or any host) a redeploy sends SIGTERM.
// Stop accepting connections, disconnect Prisma, then exit cleanly.
let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(async () => {
    try {
      await getPrisma()?.$disconnect();
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line no-console
    console.log('✅ Shutdown complete.');
    process.exit(0);
  });
  // Safety net: force-exit if connections don't drain in time.
  setTimeout(() => process.exit(0), 10000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

export default app;
