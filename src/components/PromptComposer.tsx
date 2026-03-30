import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '../constants/theme';
import { ClipartIntensity } from '../types/clipart';
import { SectionCard } from './SectionCard';

const INTENSITIES: ClipartIntensity[] = ['low', 'medium', 'high'];

type PromptComposerProps = {
  customPrompt: string;
  intensity: ClipartIntensity;
  onChangePrompt: (value: string) => void;
  onChangeIntensity: (value: ClipartIntensity) => void;
  disabled?: boolean;
};

export function PromptComposer({
  customPrompt,
  intensity,
  onChangePrompt,
  onChangeIntensity,
  disabled = false,
}: PromptComposerProps) {
  return (
    <SectionCard
      eyebrow="Creative Controls"
      title="Fine-tune the look without overwhelming the user."
      description="Prompt text is optional. Intensity controls how far the model stylizes away from the uploaded portrait while keeping facial identity anchored."
    >
      <TextInput
        editable={!disabled}
        multiline
        numberOfLines={4}
        onChangeText={onChangePrompt}
        placeholder="Optional prompt: warm smile, hoodie, clean background, sticker pack energy..."
        placeholderTextColor="#8D95A6"
        style={styles.input}
        value={customPrompt}
      />

      <View style={styles.segmentWrap}>
        {INTENSITIES.map((item) => {
          const selected = item === intensity;

          return (
            <Pressable
              key={item}
              disabled={disabled}
              onPress={() => onChangeIntensity(item)}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentSelected,
                pressed && !disabled && styles.segmentPressed,
              ]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {item[0].toUpperCase() + item.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 118,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlignVertical: 'top',
    color: theme.colors.ink,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  segmentWrap: {
    flexDirection: 'row',
    gap: 10,
  },
  segment: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: theme.colors.mint,
    borderColor: theme.colors.mint,
  },
  segmentPressed: {
    opacity: 0.84,
  },
  segmentText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  segmentTextSelected: {
    color: '#083B34',
  },
});
