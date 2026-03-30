import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { CLIPART_STYLES, STYLE_MAP } from '../constants/styles';
import { generateClipartBatch } from '../services/api';
import { loadGenerationHistory, saveGenerationSession } from '../storage/history';
import {
  ClipartIntensity,
  ClipartStyleId,
  GenerationResult,
  GenerationSession,
  PreparedImage,
  StudioPhase,
} from '../types/clipart';
import { ensureLocalResultFile, prepareImageAsset } from '../utils/image';

const DEFAULT_STYLE_IDS = CLIPART_STYLES.map((style) => style.id);

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something unexpected happened.';

export function useClipartStudio() {
  const [selectedImage, setSelectedImage] = useState<PreparedImage | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<ClipartStyleId[]>(DEFAULT_STYLE_IDS);
  const [customPrompt, setCustomPrompt] = useState('');
  const [intensity, setIntensity] = useState<ClipartIntensity>('medium');
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [phase, setPhase] = useState<StudioPhase>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGenerationHistory()
      .then(setSessions)
      .catch(() => undefined);
  }, []);

  const canGenerate = useMemo(
    () =>
      Boolean(selectedImage) &&
      selectedStyles.length > 0 &&
      phase !== 'uploading' &&
      phase !== 'processing',
    [phase, selectedImage, selectedStyles.length],
  );

  async function handleImageSelection(asset?: ImagePicker.ImagePickerAsset) {
    if (!asset) {
      return;
    }

    try {
      setError(null);
      setPhase('uploading');
      const prepared = await prepareImageAsset(asset);

      startTransition(() => {
        setSelectedImage(prepared);
        setResults([]);
        setPhase('ready');
      });

      await Haptics.selectionAsync();
    } catch (selectionError) {
      setPhase('error');
      setError(getErrorMessage(selectionError));
    }
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to upload an image.');
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!response.canceled) {
      await handleImageSelection(response.assets[0]);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow camera access to capture a photo.');
      return;
    }

    const response = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!response.canceled) {
      await handleImageSelection(response.assets[0]);
    }
  }

  function toggleStyle(styleId: ClipartStyleId) {
    setSelectedStyles((current) => {
      if (current.includes(styleId)) {
        return current.length === 1 ? current : current.filter((item) => item !== styleId);
      }

      return [...current, styleId];
    });
  }

  async function generate() {
    if (!selectedImage || selectedStyles.length === 0 || phase === 'processing') {
      return;
    }

    try {
      setError(null);
      setPhase('processing');

      const response = await generateClipartBatch({
        image: selectedImage,
        styleIds: selectedStyles,
        customPrompt,
        intensity,
      });

      const mappedResults = response.results.map((item) => ({
        id: createId(),
        sessionId: response.sessionId,
        styleId: item.styleId,
        styleLabel: STYLE_MAP[item.styleId].label,
        imageUrl: item.imageUrl,
        revisedPrompt: item.revisedPrompt,
        createdAt: response.generatedAt,
      }));

      const session: GenerationSession = {
        id: response.sessionId,
        createdAt: response.generatedAt,
        sourcePreviewUri: selectedImage.previewUri,
        selectedStyles,
        customPrompt,
        intensity,
        results: mappedResults,
      };

      const storedSessions = await saveGenerationSession(session);

      startTransition(() => {
        setResults(mappedResults);
        setSessions(storedSessions);
        setPhase('success');
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (generationError) {
      setPhase('error');
      setError(getErrorMessage(generationError));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function downloadResult(result: GenerationResult) {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow media access to save generated clipart.');
        return;
      }

      const localUri = await ensureLocalResultFile(result);
      await MediaLibrary.createAssetAsync(localUri);

      setResults((current) =>
        current.map((item) => (item.id === result.id ? { ...item, localUri } : item)),
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'The PNG has been added to your gallery.');
    } catch (downloadError) {
      Alert.alert('Save failed', getErrorMessage(downloadError));
    }
  }

  async function shareResult(result: GenerationResult) {
    try {
      const localUri = await ensureLocalResultFile(result);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing unavailable', 'This device does not support the native share sheet.');
        return;
      }

      setResults((current) =>
        current.map((item) => (item.id === result.id ? { ...item, localUri } : item)),
      );

      await Sharing.shareAsync(localUri);
    } catch (shareError) {
      Alert.alert('Share failed', getErrorMessage(shareError));
    }
  }

  function resetSource() {
    setSelectedImage(null);
    setResults([]);
    setError(null);
    setPhase('idle');
  }

  function loadSession(session: GenerationSession) {
    setResults(session.results);
    setSelectedStyles(session.selectedStyles);
    setCustomPrompt(session.customPrompt);
    setIntensity(session.intensity);
    setError(null);
    setPhase('success');

    if (session.sourcePreviewUri) {
      setSelectedImage({
        id: session.id,
        previewUri: session.sourcePreviewUri,
        uploadUri: session.sourcePreviewUri,
        fileName: `session-${session.id}.jpg`,
        mimeType: 'image/jpeg',
        width: 1024,
        height: 1024,
        fileSizeBytes: 0,
      });
    }
  }

  return {
    canGenerate,
    customPrompt,
    downloadResult,
    error,
    generate,
    intensity,
    loadSession,
    phase,
    pickFromGallery,
    resetSource,
    results,
    selectedImage,
    selectedStyles,
    sessions,
    setCustomPrompt,
    setIntensity,
    shareResult,
    takePhoto,
    toggleStyle,
  };
}


