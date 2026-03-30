import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { STYLE_MAP } from '../constants/styles';
import { theme } from '../constants/theme';
import { GenerationSession } from '../types/clipart';
import { SectionCard } from './SectionCard';

type HistoryStripProps = {
  sessions: GenerationSession[];
  onSelect: (session: GenerationSession) => void;
};

const formatSessionTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export function HistoryStrip({ sessions, onSelect }: HistoryStripProps) {
  return (
    <SectionCard
      eyebrow="Recent Sessions"
      title="Jump back into previous generations."
      description="Recent runs are cached locally so you can compare packs, reopen a good prompt, or re-share a result without starting over."
    >
      {sessions.length === 0 ? (
        <Text style={styles.emptyText}>No sessions cached yet. Your latest render will show up here.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {sessions.map((session) => {
            const firstResult = session.results[0];
            const styleNames = session.selectedStyles.map((item) => STYLE_MAP[item].label).join(' • ');

            return (
              <Pressable
                key={session.id}
                onPress={() => onSelect(session)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <Image
                  source={{ uri: firstResult?.localUri ?? firstResult?.imageUrl ?? session.sourcePreviewUri }}
                  style={styles.image}
                />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{formatSessionTime(session.createdAt)}</Text>
                  <Text numberOfLines={2} style={styles.cardMeta}>
                    {styleNames}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 12,
  },
  card: {
    width: 176,
    borderRadius: theme.radius.medium,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    opacity: 0.84,
  },
  image: {
    width: '100%',
    height: 116,
    backgroundColor: '#F6EFE6',
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  cardMeta: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
  },
});
