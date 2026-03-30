import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { STYLE_MAP } from '../constants/styles';
import { theme } from '../constants/theme';
import { ClipartStyleId, GenerationResult } from '../types/clipart';
import { SectionCard } from './SectionCard';
import { ShimmerBlock } from './ShimmerBlock';

type ResultsGridProps = {
  results: GenerationResult[];
  selectedStyles: ClipartStyleId[];
  isProcessing: boolean;
  onDownload: (result: GenerationResult) => void;
  onShare: (result: GenerationResult) => void;
};

export function ResultsGrid({
  results,
  selectedStyles,
  isProcessing,
  onDownload,
  onShare,
}: ResultsGridProps) {
  const showSkeleton = isProcessing && results.length === 0;
  const hasResults = results.length > 0;

  return (
    <SectionCard
      eyebrow="Outputs"
      title="Clipart results land together in a single surface."
      description="Each card is saveable, shareable, and labeled by style so the final review feels closer to a real product handoff than a one-off model test."
    >
      {showSkeleton ? (
        <View style={styles.grid}>
          {selectedStyles.map((styleId) => (
            <View key={styleId} style={styles.card}>
              <ShimmerBlock style={styles.imageSkeleton} />
              <ShimmerBlock style={styles.labelSkeleton} />
              <ShimmerBlock style={styles.metaSkeleton} />
            </View>
          ))}
        </View>
      ) : null}

      {!showSkeleton && !hasResults ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Your generated pack will appear here.</Text>
          <Text style={styles.emptyText}>
            Select at least one style, then render to compare outputs side by side.
          </Text>
        </View>
      ) : null}

      {hasResults ? (
        <View style={styles.grid}>
          {results.map((result) => {
            const style = STYLE_MAP[result.styleId];

            return (
              <View key={result.id} style={styles.card}>
                <Image source={{ uri: result.localUri ?? result.imageUrl }} style={styles.image} />
                <View style={styles.labelRow}>
                  <Text style={styles.cardTitle}>{result.styleLabel}</Text>
                  <View style={[styles.styleDot, { backgroundColor: style.accent }]} />
                </View>
                <Text numberOfLines={2} style={styles.cardText}>
                  {result.revisedPrompt ?? style.subtitle}
                </Text>
                <View style={styles.actionRow}>
                  <MiniButton label="Save" onPress={() => onDownload(result)} />
                  <MiniButton label="Share" onPress={() => onShare(result)} />
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </SectionCard>
  );
}

type MiniButtonProps = {
  label: string;
  onPress: () => void;
};

function MiniButton({ label, onPress }: MiniButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.miniButton, pressed && styles.miniButtonPressed]}>
      <Text style={styles.miniButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: theme.radius.medium,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    gap: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#F7F0E7',
  },
  imageSkeleton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
  },
  labelSkeleton: {
    height: 16,
    width: '64%',
  },
  metaSkeleton: {
    height: 42,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  styleDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },
  cardText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    minHeight: 36,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: theme.radius.pill,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniButtonPressed: {
    opacity: 0.8,
  },
  miniButtonText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  emptyWrap: {
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.borderStrong,
    paddingHorizontal: 18,
    paddingVertical: 24,
    gap: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
