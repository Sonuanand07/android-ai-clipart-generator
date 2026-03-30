export type ClipartStyleId = 'cartoon' | 'flat' | 'anime' | 'pixel' | 'sketch';
export type ClipartIntensity = 'low' | 'medium' | 'high';

export type ProviderResult = {
  styleId: ClipartStyleId;
  imageUrl: string;
  revisedPrompt: string;
};
