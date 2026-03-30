import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionCard({ eyebrow, title, description, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    gap: 12,
    ...theme.shadow.soft,
  },
  eyebrow: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.medium,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 21,
    lineHeight: 24,
  },
  description: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  children: {
    gap: 12,
  },
});
