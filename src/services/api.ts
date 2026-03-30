import { GenerateClipartRequest, GenerateClipartResponse } from '../types/clipart';

const DEFAULT_API_BASE_URL = 'http://10.0.2.2:8787';
const REQUEST_TIMEOUT_MS = 120000;

const trimSlash = (value: string) => value.replace(/\/+$/, '');

export function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  return trimSlash(configured || DEFAULT_API_BASE_URL);
}

export async function generateClipartBatch(
  payload: GenerateClipartRequest,
): Promise<GenerateClipartResponse> {
  const file: { uri: string; name: string; type: string } = {
    uri: payload.image.uploadUri,
    name: payload.image.fileName,
    type: payload.image.mimeType,
  };

  const body = new FormData();
  body.append('image', file as never);
  body.append('styles', JSON.stringify(payload.styleIds));
  body.append('customPrompt', payload.customPrompt.trim());
  body.append('intensity', payload.intensity);
  body.append('width', String(payload.image.width));
  body.append('height', String(payload.image.height));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/generate`, {
      method: 'POST',
      body,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data && typeof data.error === 'string'
          ? data.error
          : 'The AI proxy could not generate clipart for this image.';
      throw new Error(message);
    }

    return data as GenerateClipartResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Generation timed out. Please retry with fewer styles or a smaller image.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
