import { StatusBar } from 'expo-status-bar';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { HistoryStrip } from './src/components/HistoryStrip';
import { PrimaryButton } from './src/components/PrimaryButton';
import { PromptComposer } from './src/components/PromptComposer';
import { ResultsGrid } from './src/components/ResultsGrid';
import { SectionCard } from './src/components/SectionCard';
import { StyleChips } from './src/components/StyleChips';
import { UploadPanel } from './src/components/UploadPanel';
import { CLIPART_STYLES } from './src/constants/styles';
import { theme } from './src/constants/theme';
import { useClipartStudio } from './src/hooks/useClipartStudio';

const STATUS_COPY = {
  idle: 'Ready to turn portraits into polished clipart sets.',
  uploading: 'Preparing image for clean, fast generation.',
  ready: 'Image is ready. Pick your styles and render the batch.',
  processing: 'Generating all selected styles in parallel.',
  success: 'Fresh clipart set ready to save or share.',
  error: 'Something went wrong. You can retry without losing your setup.',
} as const;

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const studio = useClipartStudio();

  if (!fontsLoaded) {
    return <View style={styles.bootSplash} />;
  }

  const selectedCount = studio.selectedStyles.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#FFF6E9', '#FFF0F2', '#F6FBFA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={styles.glowWrap}>
        <View style={styles.glowPeach} />
        <View style={styles.glowMint} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>ANDROID BUILD</Text>
              <Text style={styles.badge}>BATCH GENERATION</Text>
              <Text style={styles.badge}>SECURE PROXY</Text>
            </View>

            <Text style={styles.title}>Turn one portrait into a full clipart pack</Text>
            <Text style={styles.subtitle}>
              Upload once, render across multiple styles, and save polished PNG outputs without
              exposing a single API key in the app.
            </Text>

            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{CLIPART_STYLES.length}</Text>
                <Text style={styles.metricLabel}>Styles built in</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{selectedCount}</Text>
                <Text style={styles.metricLabel}>Selected now</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>PNG</Text>
                <Text style={styles.metricLabel}>Export ready</Text>
              </View>
            </View>
          </View>

          <SectionCard
            eyebrow={studio.phase === 'processing' ? 'Rendering' : 'Studio Status'}
            title={STATUS_COPY[studio.phase]}
            description={
              studio.error ??
              'Camera, gallery, prompt tuning, and save/share flows are all handled directly here.'
            }
          >
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  studio.phase === 'success' && styles.statusDotSuccess,
                  studio.phase === 'error' && styles.statusDotError,
                  studio.phase === 'processing' && styles.statusDotProcessing,
                ]}
              />
              <Text style={styles.statusText}>
                {studio.phase === 'processing'
                  ? 'Generating styles asynchronously'
                  : studio.phase === 'uploading'
                    ? 'Compressing and validating image'
                    : studio.phase === 'success'
                      ? `${studio.results.length} outputs generated`
                      : studio.phase === 'error'
                        ? 'Retry available'
                        : 'Standing by'}
              </Text>
            </View>
          </SectionCard>

          <UploadPanel
            image={studio.selectedImage}
            phase={studio.phase}
            onPickFromGallery={studio.pickFromGallery}
            onTakePhoto={studio.takePhoto}
            onReset={studio.resetSource}
          />

          <SectionCard
            eyebrow="Style System"
            title="Generate one look or a full pack in parallel."
            description="Every style has its own tuned prompt accent so the outputs feel distinct, not like the same image with a filter slapped on top."
          >
            <StyleChips
              selectedStyles={studio.selectedStyles}
              onToggleStyle={studio.toggleStyle}
              disabled={studio.phase === 'processing'}
            />
          </SectionCard>

          <PromptComposer
            customPrompt={studio.customPrompt}
            intensity={studio.intensity}
            onChangePrompt={studio.setCustomPrompt}
            onChangeIntensity={studio.setIntensity}
            disabled={studio.phase === 'processing'}
          />

          <SectionCard
            eyebrow="Batch Render"
            title="Make the AI work while the UI stays smooth."
            description="Selected styles render together. Skeleton cards preserve layout while the proxy validates, fans out requests, and returns normalized results."
          >
            <PrimaryButton
              label={
                studio.phase === 'processing'
                  ? 'Generating Clipart Set...'
                  : `Generate ${selectedCount} Style${selectedCount === 1 ? '' : 's'}`
              }
              onPress={studio.generate}
              disabled={!studio.canGenerate}
              loading={studio.phase === 'processing'}
            />
          </SectionCard>

          <ResultsGrid
            results={studio.results}
            selectedStyles={studio.selectedStyles}
            isProcessing={studio.phase === 'processing'}
            onDownload={studio.downloadResult}
            onShare={studio.shareResult}
          />

          <HistoryStrip sessions={studio.sessions} onSelect={studio.loadSession} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  bootSplash: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    paddingTop: 10,
    gap: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    color: theme.colors.ink,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 11,
    letterSpacing: 1.1,
    fontFamily: theme.fonts.medium,
    overflow: 'hidden',
  },
  title: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  subtitle: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: 620,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minHeight: 86,
    borderRadius: theme.radius.large,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(32, 40, 55, 0.08)',
    padding: 14,
    justifyContent: 'space-between',
    ...theme.shadow.soft,
  },
  metricValue: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 22,
  },
  metricLabel: {
    color: theme.colors.inkMuted,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: theme.colors.sun,
  },
  statusDotProcessing: {
    backgroundColor: theme.colors.blue,
  },
  statusDotSuccess: {
    backgroundColor: theme.colors.success,
  },
  statusDotError: {
    backgroundColor: theme.colors.error,
  },
  statusText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.medium,
    fontSize: 14,
  },
  glowWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  glowPeach: {
    position: 'absolute',
    top: 18,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 158, 91, 0.18)',
  },
  glowMint: {
    position: 'absolute',
    top: 240,
    left: -70,
    width: 210,
    height: 210,
    borderRadius: 210,
    backgroundColor: 'rgba(87, 191, 174, 0.12)',
  },
});


