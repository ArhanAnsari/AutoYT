# AutoYT 🚀

An AI-powered system that automatically creates and publishes YouTube videos with minimal human input using **completely free APIs**.

## Features

- **A-Z Automation**: From prompt generating a YouTube script using Google Gemini to final rendering and automatically uploading to your channel.
- **Robust Tech Stack**: Built with Next.js 15 App Router, Convex Realtime Database & Serverless Backend, and TailwindCSS.
- **Visual Scene Editor**: An intuitive Studio Dashboard to manage and customize generated video scenes.
- **Free AI Models**: Uses completely free APIs for all AI operations:
  - 🖼️ Image Generation: Pollinations.ai (no auth) + Replicate Flux free tier
  - 🎙️ Text-to-Speech: VoiceRSS (no auth) + ElevenLabs free tier (300k chars/month)
  - 📹 Video Assembly: FFmpeg + Remotion (both free & open-source)

## Architecture & Data Flow

1. **NextAuth.js Google Authentication**: Logs in users and captures YouTube upload scopes
2. **Convex Realtime Database**: Stores users, channels, videos, and scenes with live synchronization
3. **Gemini AI Script Generation**: Transforms prompts into structured video scripts with Hook, Intro, Body, and CTA
4. **Scene Management**: Each generated script is broken into sequential scenes with narration and visual prompts
5. **Free Image Generation**: Pollinations.ai (primary) or Replicate Flux (alternative) generates images for each scene
6. **Free Text-to-Speech**: VoiceRSS (primary) or ElevenLabs free tier converts narration to audio
7. **Video Assembly Pipeline**: Combines images and audio into final `.mp4` files
8. **YouTube Publishing**: Direct upload to authenticated YouTube channel using Google APIs

## Quick Start

### Install Dependencies

```bash
npm install
# Optional: For Replicate image generation
npm install replicate
```

### Configure Environment Variables

Create a `.env.local` file:

```bash
# Google OAuth (Required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth (Required)
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Gemini API (Required)
GEMINI_API_KEY=your_google_ai_studio_key

# Convex Backend (Required)
CONVEX_DEPLOYMENT=your_deployment_name
NEXT_PUBLIC_CONVEX_URL=https://your_deployment.convex.cloud

# Optional: Replicate (for Flux image generation free tier)
REPLICATE_API_TOKEN=your_replicate_api_token

# Optional: ElevenLabs (for premium voice quality - free tier available)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Run Development Server

Terminal 1 - Start Convex Backend:

```bash
npx convex dev
```

Terminal 2 - Start Next.js App:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Free AI Services Used

| Service             | Feature                 | Free Tier                    | Auth Required    |
| ------------------- | ----------------------- | ---------------------------- | ---------------- |
| **Pollinations.ai** | Image Generation        | Unlimited                    | No               |
| **Replicate**       | Image Generation (Flux) | 1000s of free API calls      | Yes, but free    |
| **VoiceRSS**        | Text-to-Speech          | Unlimited                    | No               |
| **ElevenLabs**      | Premium Text-to-Speech  | 300k chars/month             | Yes              |
| **Google Gemini**   | Script Generation       | 60 requests/minute free tier | Yes              |
| **Convex**          | Backend Database        | 1M queries/month             | Requires account |

## Workflow

1. **Create New Video**: Enter a topic/prompt on the dashboard
2. **Generate Script**: Gemini AI creates a structured script with scenes
3. **Generate Images**: Click the image button for each scene (uses Pollinations.ai)
4. **Generate Audio**: Click the audio button for each scene (uses VoiceRSS)
5. **Assemble Video**: Click "Assemble Video" to combine all assets
6. **Publish**: One-click YouTube upload to your authenticated channel

## Project Structure

```
app/
  ├── (auth)/          # Authentication pages (login/signup)
  ├── (dashboard)/     # Protected dashboard & studio
  ├── api/
  │   ├── videos/      # Video generation pipeline
  │   ├── generate-image/ # Image generation endpoint
  │   └── generate-audio/ # Audio generation endpoint
  └── page.tsx         # Landing page

services/
  ├── ai/
  │   ├── gemini.ts    # Script generation
  │   ├── image.ts     # Image generation
  │   └── tts.ts       # Text-to-speech

convex/
  ├── schema.ts        # Database schema
  ├── users.ts         # User mutations & queries
  ├── videos.ts        # Video mutations & queries
  └── _generated/      # Auto-generated API types

components/
  ├── studio/          # Video editing interface
  └── ui/              # Shadcn UI components
```

## Future Enhancements

- [ ] Background job queue for async video processing
- [ ] Automatic video scheduling and batch processing
- [ ] Multi-language support for scripts and voice
- [ ] Custom branding templates
- [ ] Analytics dashboard for video performance
- [ ] Webhook integrations for automation triggers

## License

MIT - Feel free to use AutoYT for personal and commercial projects!
