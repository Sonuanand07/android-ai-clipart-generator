import { ClipartStyleDefinition } from '../types/clipart';

export const CLIPART_STYLES: ClipartStyleDefinition[] = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    subtitle: 'Rounded, expressive, bright.',
    accent: '#FF9E5B',
    gradient: ['#FFE1C8', '#FFF6E9'],
    promptAccent:
      'vibrant editorial cartoon clipart, rounded silhouette, clean edges, playful expression, polished commercial sticker design',
  },
  {
    id: 'flat',
    label: 'Flat Illustration',
    subtitle: 'Graphic shapes and bold color blocks.',
    accent: '#57BFAE',
    gradient: ['#DDF6F1', '#F2FFFC'],
    promptAccent:
      'flat illustration clipart, geometric shading, simplified vectors, clear shape language, modern app-store quality',
  },
  {
    id: 'anime',
    label: 'Anime',
    subtitle: 'Crisp lines with cinematic warmth.',
    accent: '#FF7E9E',
    gradient: ['#FFD6E1', '#FFF0F4'],
    promptAccent:
      'anime portrait clipart, cel shading, expressive eyes, sharp line art, premium character illustration',
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    subtitle: 'Readable tiny-grid sprite energy.',
    accent: '#4E73FF',
    gradient: ['#D9E4FF', '#F5F8FF'],
    promptAccent:
      'pixel art portrait sprite, readable 32-bit aesthetic, crisp limited palette, game-ready clipart composition',
  },
  {
    id: 'sketch',
    label: 'Sketch',
    subtitle: 'Minimal outline with clean character.',
    accent: '#7D6BFF',
    gradient: ['#ECE8FF', '#FBFAFF'],
    promptAccent:
      'sketch outline clipart, elegant contour lines, minimal ink shading, refined stationery illustration finish',
  },
];

export const STYLE_MAP = Object.fromEntries(
  CLIPART_STYLES.map((style) => [style.id, style]),
) as Record<ClipartStyleDefinition['id'], ClipartStyleDefinition>;
