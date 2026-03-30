import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { PreparedImage, StudioPhase } from '../types/clipart';
import { SectionCard } from './SectionCard';

type UploadPanelProps = {
  image: PreparedImage | null;
  phase: StudioPhase;
  onPickFromGallery: () => void;
  onTakePhoto: () => void;
  onReset: () => void;
};

export function UploadPanel({
  image,
  phase,
  onPickFromGallery,
  onTakePhoto,
  onReset,
}: UploadPanelProps) {
  return (
    <SectionCard
      eyebrow="Source Image"
      title="Upload from camera or gallery."
      description="The app validates the file, compresses oversized photos on-device, and preserves a clean preview before anything is sent to the AI proxy."
    >
      <View style={styles.previewFrame}>
        {image ? (
          <Image source={{ uri: image.previewUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No portrait selected yet</Text>
            <Text style={styles.emptyText}>
              Square crops work best, but any portrait-style image will be resized automatically.
            </Text>
          </View>
        )}

        <View style={styles.previewBadge}>
          <Text style={styles.previewBadgeText}>
            {phase === 'uploading' ? 'Preparing...' : image ? 'Ready for AI' : 'Awaiting upload'}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <ActionButton label="Open Gallery" onPress={onPickFromGallery} />
        <ActionButton label="Use Camera" onPress={onTakePhoto} />
      </View>

      {image ? <ActionButton label="Reset Image" onPress={onReset} subtle /> : null}
    </SectionCard>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  subtle?: boolean;
};

function ActionButton({ label, onPress, subtle = false }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        subtle && styles.actionButtonSubtle,
        pressed && styles.actionPressed,
      ]}
    >
      <Text style={[styles.actionLabel, subtle && styles.actionLabelSubtle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  previewFrame: {
    borderRadius: theme.radius.large,
    minHeight: 280,
    overflow: 'hidden',
    backgroundColor: '#F9F4EC',
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
  },
  preview: {
    width: '100%',
    height: 320,
  },
  emptyState: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 10,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  emptyText: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  previewBadge: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewBadgeText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionButtonSubtle: {
    backgroundColor: '#FFF5F0',
    borderColor: '#FFD4B5',
  },
  actionPressed: {
    opacity: 0.84,
  },
  actionLabel: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  actionLabelSubtle: {
    color: '#A64E1B',
  },
});
