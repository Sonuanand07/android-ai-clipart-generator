import AsyncStorage from '@react-native-async-storage/async-storage';

import { GenerationSession } from '../types/clipart';

const HISTORY_KEY = 'clipart-lab/sessions';
const MAX_SESSIONS = 8;

export async function loadGenerationHistory() {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);

  if (!raw) {
    return [] as GenerationSession[];
  }

  try {
    const parsed = JSON.parse(raw) as GenerationSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveGenerationSession(session: GenerationSession) {
  const existing = await loadGenerationHistory();
  const next = [session, ...existing.filter((item) => item.id !== session.id)].slice(0, MAX_SESSIONS);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}
