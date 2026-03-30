# ClipMint AI

ClipMint AI is an Android-first React Native app for generating multi-style clipart portraits from a single uploaded image. The app supports camera/gallery upload, client-side compression, batch generation across multiple styles, polished loading states, and native save/share flows.

## What is included

- Expo + React Native TypeScript mobile app
- Node/Express proxy for secure AI calls
- Multi-style generation flow for cartoon, flat illustration, anime, pixel art, and sketch
- Client-side image validation and compression
- Skeleton loaders, recent-session cache, save to gallery, and share sheet support
- Android prebuild/release scripts

## Stack

- Mobile: Expo SDK 54, React Native 0.81, TypeScript
- Storage/UI helpers: AsyncStorage, Expo Image Picker, Image Manipulator, Media Library, Sharing, Haptics, Linear Gradient
- Backend: Express, Multer, Helmet, CORS, express-rate-limit, Zod
- AI provider: OpenAI image edits via `gpt-image-1` through the backend proxy

## Project structure

- `App.tsx` - main screen composition and polished single-screen workflow
- `src/` - mobile theme, hooks, components, services, and local session storage
- `server/` - secure proxy for rate-limited image generation requests

## Setup

### 1. Install app dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
npm --prefix server install
```

### 3. Configure environment variables

Create `.env` in the project root from `.env.example`:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8787
```

Create `server/.env` from `server/.env.example` and add your OpenAI key:

```bash
PORT=8787
OPENAI_API_KEY=sk-...
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_BASE_URL=https://api.openai.com/v1
CORS_ORIGIN=*
```

### 4. Run the backend

```bash
npm run dev:server
```

### 5. Run the mobile app

```bash
npm start
```

For an Android emulator, `10.0.2.2` works as the API host. For a physical device, set `EXPO_PUBLIC_API_URL` to your deployed backend URL.

## Android build

Generate the Android native project:

```bash
npm run prepare:android
```

Build a release APK locally after Android Studio / SDK is configured:

```bash
npm run android:release
```

Expected output:

- `android/app/build/outputs/apk/release/app-release.apk`

## Submission checklist

Replace these placeholders before submitting:

- APK download link: `TODO_ADD_GOOGLE_DRIVE_APK_LINK`
- Screen recording link: `TODO_ADD_GOOGLE_DRIVE_RECORDING_LINK`
- GitHub repository: `TODO_ADD_GITHUB_REPO_LINK`

## README submission notes

- APK download link (Drive): `TODO_ADD_GOOGLE_DRIVE_APK_LINK`
- Screen recording link (Drive): `TODO_ADD_GOOGLE_DRIVE_RECORDING_LINK`

## Tech decisions

- Expo was chosen for fast Android iteration, native device APIs, and a cleaner 72-hour delivery path.
- The app keeps AI secrets off-device by routing generation through a small backend proxy.
- Batch generation renders multiple styles together so the experience feels deliberate and high-signal instead of serial and slow.
- Images are resized/compressed on-device before upload to improve speed, reduce bandwidth, and stay within provider limits.
- Recent sessions are cached locally so users can quickly reopen or re-share earlier outputs.

## Tradeoffs made

- The project uses a single polished screen rather than a deeper navigation tree to keep the flow extremely fast.
- `gpt-image-1` is wired as the default provider because it can handle image edits from a source portrait with strong prompt control, but the backend shape is small enough to swap providers later.
- The UI was handcrafted and refined in code; if your evaluation process strictly requires a Stitch export artifact, you should run this same screen structure through Stitch and replace the corresponding presentation components before submission.

## Security notes

- No API keys are stored in the Android app.
- The backend validates file type, file size, style IDs, and prompt length.
- Basic rate limiting is applied per IP.

## Deployment suggestions

Low-cost options for the backend:

- Railway or Render starter service for quick Node deployment
- Fly.io small instance
- Any lightweight VPS with HTTPS in front

For the final submission, deploy the backend, set `EXPO_PUBLIC_API_URL` to the live URL, build the APK, upload the APK + screen recording to Drive, and replace the placeholder links above.
