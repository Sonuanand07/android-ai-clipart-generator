export type ClipartStyleId = 'cartoon' | 'flat' | 'anime' | 'pixel' | 'sketch';
export type ClipartIntensity = 'low' | 'medium' | 'high';
export type StudioPhase = 'idle' | 'uploading' | 'ready' | 'processing' | 'success' | 'error';

export type ClipartStyleDefinition = {
  id: ClipartStyleId;
  label: string;
  subtitle: string;
  accent: string;
  gradient: [string, string];
  promptAccent: string;
};

export type PreparedImage = {
  id: string;
  previewUri: string;
  uploadUri: string;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeBytes: number;
};

export type GenerationResult = {
  id: string;
  sessionId: string;
  styleId: ClipartStyleId;
  styleLabel: string;
  imageUrl: string;
  localUri?: string;
  revisedPrompt?: string;
  createdAt: string;
};

export type GenerationSession = {
  id: string;
  createdAt: string;
  sourcePreviewUri: string;
  selectedStyles: ClipartStyleId[];
  customPrompt: string;
  intensity: ClipartIntensity;
  results: GenerationResult[];
};

export type GenerateClipartRequest = {
  image: PreparedImage;
  styleIds: ClipartStyleId[];
  customPrompt: string;
  intensity: ClipartIntensity;
};

export type GenerateClipartResponse = {
  sessionId: string;
  generatedAt: string;
  provider: string;
  results: Array<{
    styleId: ClipartStyleId;
    imageUrl: string;
    revisedPrompt?: string;
  }>;
};
