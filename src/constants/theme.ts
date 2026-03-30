import { Platform } from 'react-native';

export const theme = {
  colors: {
    canvas: '#FFF8EF',
    surface: 'rgba(255,255,255,0.82)',
    surfaceStrong: '#FFFFFF',
    border: 'rgba(32, 40, 55, 0.08)',
    borderStrong: 'rgba(32, 40, 55, 0.14)',
    ink: '#1A1C24',
    inkMuted: '#576074',
    peach: '#FF9E5B',
    peachSoft: '#FFE1C8',
    mint: '#57BFAE',
    mintSoft: '#DDF6F1',
    blue: '#4E73FF',
    sun: '#FFB44E',
    success: '#2AA374',
    error: '#D35656',
    overlay: 'rgba(26, 28, 36, 0.05)',
  },
  fonts: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    bold: 'SpaceGrotesk_700Bold',
  },
  radius: {
    medium: 18,
    large: 24,
    pill: 999,
  },
  shadow: {
    soft: Platform.select({
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#37261C',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      },
    }),
  },
} as const;
