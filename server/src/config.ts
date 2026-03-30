import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8787),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_IMAGE_MODEL: z.string().default('gpt-image-1'),
  OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);
