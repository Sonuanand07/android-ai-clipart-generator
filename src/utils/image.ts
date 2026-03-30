import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImagePickerAsset } from 'expo-image-picker';

import { GenerationResult, PreparedImage } from '../types/clipart';

const MAX_SOURCE_SIZE_BYTES = 20 * 1024 * 1024;
const TARGET_MAX_DIMENSION = 1400;
const RESULT_DIRECTORY = `${FileSystem.cacheDirectory}generated`;

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function validatePickedAsset(asset: ImagePickerAsset) {
  if (!asset.uri) {
    throw new Error('The selected file is missing a readable image path.');
  }

  if (asset.mimeType && !asset.mimeType.startsWith('image/')) {
    throw new Error('Please choose a valid image file.');
  }

  if (asset.fileSize && asset.fileSize > MAX_SOURCE_SIZE_BYTES) {
    throw new Error('Please pick an image smaller than 20 MB.');
  }
}

export async function prepareImageAsset(asset: ImagePickerAsset): Promise<PreparedImage> {
  validatePickedAsset(asset);

  const fallbackWidth = asset.width ?? TARGET_MAX_DIMENSION;
  const fallbackHeight = asset.height ?? TARGET_MAX_DIMENSION;
  const longestEdge = Math.max(fallbackWidth, fallbackHeight);
  const resizeRatio = longestEdge > TARGET_MAX_DIMENSION ? TARGET_MAX_DIMENSION / longestEdge : 1;

  const resized = await ImageManipulator.manipulateAsync(
    asset.uri,
    resizeRatio < 1
      ? [
          {
            resize: {
              width: Math.round(fallbackWidth * resizeRatio),
              height: Math.round(fallbackHeight * resizeRatio),
            },
          },
        ]
      : [],
    {
      compress: 0.82,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const info = await FileSystem.getInfoAsync(resized.uri);

  return {
    id: createId(),
    previewUri: asset.uri,
    uploadUri: resized.uri,
    fileName: asset.fileName ?? `portrait-${Date.now()}.jpg`,
    mimeType: 'image/jpeg',
    width: resized.width,
    height: resized.height,
    fileSizeBytes: info.exists ? info.size ?? 0 : asset.fileSize ?? 0,
  };
}

async function ensureResultDirectory() {
  const info = await FileSystem.getInfoAsync(RESULT_DIRECTORY);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(RESULT_DIRECTORY, { intermediates: true });
  }
}

export async function ensureLocalResultFile(result: GenerationResult) {
  if (result.localUri) {
    return result.localUri;
  }

  await ensureResultDirectory();
  const targetUri = `${RESULT_DIRECTORY}/${result.id}.png`;
  const download = await FileSystem.downloadAsync(result.imageUrl, targetUri);
  return download.uri;
}

