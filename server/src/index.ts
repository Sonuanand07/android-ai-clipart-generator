import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import { z } from 'zod';

import { env } from './config';
import { generateStyledClipart } from './openaiProvider';
import { ClipartIntensity, ClipartStyleId } from './types';

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a minute and try again.',
  },
});

const bodySchema = z.object({
  styles: z.array(z.enum(['cartoon', 'flat', 'anime', 'pixel', 'sketch'])).min(1).max(5),
  customPrompt: z.string().max(180).default(''),
  intensity: z.enum(['low', 'medium', 'high']).default('medium'),
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin:
      env.CORS_ORIGIN === '*'
        ? true
        : env.CORS_ORIGIN.split(',').map((value) => value.trim()),
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, provider: 'openai', model: env.OPENAI_IMAGE_MODEL });
});

app.post('/v1/generate', limiter, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'An image file is required.' });
      return;
    }

    const parsedStyles = typeof req.body.styles === 'string' ? JSON.parse(req.body.styles) : [];
    const payload = bodySchema.parse({
      styles: parsedStyles,
      customPrompt: typeof req.body.customPrompt === 'string' ? req.body.customPrompt : '',
      intensity: typeof req.body.intensity === 'string' ? req.body.intensity : 'medium',
    });

    if (!req.file.mimetype.startsWith('image/')) {
      res.status(400).json({ error: 'Only image uploads are supported.' });
      return;
    }

    const results = await Promise.all(
      payload.styles.map((styleId) =>
        generateStyledClipart({
          fileBuffer: req.file!.buffer,
          fileName: req.file!.originalname || 'portrait.jpg',
          mimeType: req.file!.mimetype,
          styleId: styleId as ClipartStyleId,
          intensity: payload.intensity as ClipartIntensity,
          customPrompt: payload.customPrompt,
        }),
      ),
    );

    res.json({
      sessionId: `session_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      provider: 'openai',
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0]?.message ?? 'Invalid request.' });
      return;
    }

    if (error instanceof SyntaxError) {
      res.status(400).json({ error: 'Invalid styles payload.' });
      return;
    }

    const message = error instanceof Error ? error.message : 'Generation failed.';
    res.status(500).json({ error: message });
  }
});

app.listen(env.PORT, () => {
  console.log(`ClipMint proxy listening on port ${env.PORT}`);
});
