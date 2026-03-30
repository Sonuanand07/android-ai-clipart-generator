import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CLIPART_STYLES } from '../constants/styles';
import { theme } from '../constants/theme';
import { ClipartStyleId } from '../types/clipart';

type StyleChipsProps = {
  selectedStyles: ClipartStyleId[];
  onToggleStyle: (styleId: ClipartStyleId) => void;
  disabled?: boolean;
};

export function StyleChips({
  selectedStyles,
  onToggleStyle,
  disabled = false,
}: StyleChipsProps) {
  return (
    <View style={styles.wrap}>
      {CLIPART_STYLES.map((style) => {
        const selected = selectedStyles.includes(style.id);

        return (
          <Pressable
            key={style.id}
            disabled={disabled}
            onPress={() => onToggleStyle(style.id)}
            style={({ pressed }) => [
              styles.chip,
              { borderColor: style.accent },
              selected && { backgroundColor: style.accent, borderColor: style.accent },
              disabled && styles.disabled,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{style.label}</Text>
            <Text style={[styles.subtitle, selected && styles.subtitleSelected]}>
              {style.subtitle}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: '48%',
    minHeight: 96,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceStrong,
  },
  label: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  subtitleSelected: {
    color: 'rgba(255,255,255,0.88)',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
