import { ClipartIntensity, ClipartStyleId } from './types';

const STYLE_PROMPTS: Record<ClipartStyleId, { label: string; accent: string }> = {
  cartoon: {
    label: 'Cartoon',
    accent:
      'vibrant editorial cartoon clipart, rounded silhouette, clean edges, playful expression, premium sticker-pack finish',
  },
  flat: {
    label: 'Flat Illustration',
    accent:
      'flat illustration clipart, geometric shading, simplified vectors, bold color blocks, modern product-quality finish',
  },
  anime: {
    label: 'Anime',
    accent:
      'anime portrait clipart, cel shading, expressive eyes, sharp line art, premium character illustration',
  },
  pixel: {
    label: 'Pixel Art',
    accent:
      'pixel art portrait sprite, crisp limited palette, readable 32-bit aesthetic, game-ready clipart composition',
  },
  sketch: {
    label: 'Sketch',
    accent:
      'sketch outline clipart, elegant contour lines, minimal ink shading, refined stationery illustration finish',
  },
};

const INTENSITY_PROMPTS: Record<ClipartIntensity, string> = {
  low: 'Apply gentle stylization and stay very close to the original portrait.',
  medium: 'Apply clear stylization while keeping the face and likeness strongly recognizable.',
  high: 'Push the style boldly while preserving the person\'s identity, age, and overall likeness.',
};

export function buildPrompt(styleId: ClipartStyleId, intensity: ClipartIntensity, customPrompt: string) {
  const style = STYLE_PROMPTS[styleId];
  const userRequest = customPrompt.trim()
    ? `User preference to include when it does not conflict with identity preservation: ${customPrompt.trim()}.`
    : '';

  return [
    `Transform the supplied portrait into a polished ${style.label} portrait.` ,
    style.accent,
    INTENSITY_PROMPTS[intensity],
    'Preserve the person\'s identity, face shape, hairstyle, skin tone, expression, accessories, and clothing cues.',
    'Keep the composition centered, chest-up, cleanly separated from the background, and highly readable on mobile.',
    'Avoid extra people, text, watermark, duplicated features, distorted anatomy, extra limbs, or busy background clutter.',
    userRequest,
  ]
    .filter(Boolean)
    .join(' ');
}
