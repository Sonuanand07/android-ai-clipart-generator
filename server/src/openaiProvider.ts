import { GoogleGenAI } from '@google/genai';

import { env } from './config';
import { buildPrompt } from './stylePrompts';
import { ClipartIntensity, ClipartStyleId, ProviderResult } from './types';

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

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
  mimeType,
  styleId,
  intensity,
  customPrompt,
}: GenerateImageArgs): Promise<ProviderResult> {
  const prompt = `${buildPrompt(styleId, intensity, customPrompt)} Generate a final square image output.`;

  const response = await ai.models.generateContent({
    model: env.GEMINI_IMAGE_MODEL,
    contents: [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: fileBuffer.toString('base64'),
        },
      },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data);
  const imageUrl = toImageUrl(imagePart?.inlineData?.data);

  if (!imageUrl) {
    const textFeedback = parts
      .map((part) => part.text)
      .filter(Boolean)
      .join(' ')
      .trim();

    throw new Error(
      textFeedback || 'Gemini did not return an image. Try again with a clearer portrait.',
    );
  }

  return {
    styleId,
    imageUrl,
    revisedPrompt: prompt,
  };
}
