import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8787),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_IMAGE_MODEL: z.string().default('gemini-2.5-flash-image'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);
