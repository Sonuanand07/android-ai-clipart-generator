import { env } from './config';
import { buildPrompt } from './stylePrompts';
import { ClipartIntensity, ClipartStyleId, ProviderResult } from './types';

type GenerateImageArgs = {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  styleId: ClipartStyleId;
  intensity: ClipartIntensity;
  customPrompt: string;
};

function toImageUrl(data: unknown) {
  if (typeof data === 'string' && data.startsWith('http')) {
    return data;
  }

  if (typeof data === 'string' && data.length > 100) {
    return `data:image/png;base64,${data}`;
  }

  return null;
}

export async function generateStyledClipart({
  fileBuffer,
  fileName,
  mimeType,
  styleId,
  intensity,
  customPrompt,
}: GenerateImageArgs): Promise<ProviderResult> {
  const prompt = buildPrompt(styleId, intensity, customPrompt);
  const file = new File([new Uint8Array(fileBuffer)], fileName, { type: mimeType });
  const body = new FormData();
  body.set('model', env.OPENAI_IMAGE_MODEL);
  body.set('prompt', prompt);
  body.set('size', '1024x1024');
  body.set('image', file);

  const response = await fetch(`${env.OPENAI_BASE_URL}/images/edits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload.error?.message === 'string'
        ? payload.error.message
        : 'OpenAI image generation failed.';
    throw new Error(errorMessage);
  }

  const candidate = payload?.data?.[0];
  const imageUrl = toImageUrl(candidate?.url) ?? toImageUrl(candidate?.b64_json);

  if (!imageUrl) {
    throw new Error('The image provider returned an unsupported response payload.');
  }

  return {
    styleId,
    imageUrl,
    revisedPrompt: prompt,
  };
}

