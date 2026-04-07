# AutoYT Free API Setup Guide

This guide explains how to use AutoYT with completely free APIs.

## 1. Image Generation

### Option A: Pollinations.ai (Recommended - No Auth)

**Features:**

- Completely free
- No authentication required
- High quality AI-generated images
- Fast generation

**Implementation:** Already configured in `services/ai/image.ts` as fallback

### Option B: Replicate (Free Tier)

**Setup:**

1. Sign up at [replicate.com](https://replicate.com)
2. Get your free API token from the dashboard
3. Add to `.env.local`:
   ```bash
   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Features:**

- Free tier: Sufficient for testing
- Uses open-source Flux model
- High quality output
- Fallback to Pollinations if quota exceeded

## 2. Text-to-Speech

### Option A: VoiceRSS (Recommended - No Auth)

**Features:**

- Completely free
- No authentication required
- Multiple language support
- ~100 characters limit per request (handled automatically)

**Implementation:** Already configured in `services/ai/tts.ts` as primary

### Option B: ElevenLabs (Premium Quality - Free Tier)

**Setup:**

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Get your free API key from settings
3. Add to `.env.local`:
   ```bash
   ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxx
   ```

**Free Tier Benefits:**

- 300,000 characters/month
- Premium voice quality
- Multiple voice options
- Natural-sounding output

**Voice IDs:** Copy from [ElevenLabs voices documentation](https://docs.elevenlabs.io/voices)

## 3. Script Generation (Gemini)

### Setup:

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Create API Key"
3. Select your project
4. Copy the API key
5. Add to `.env.local`:
   ```bash
   GEMINI_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxx
   ```

**Free Tier:** 60 requests/minute (sufficient for most use cases)

## 4. Backend Database (Convex)

### Setup:

1. Create account at [convex.dev](https://convex.dev)
2. Create a new project
3. Run:
   ```bash
   npx convex auth
   ```
4. Get your deployment URL from the dashboard
5. Add to `.env.local`:
   ```bash
   CONVEX_DEPLOYMENT=your-project-deployment
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   ```

**Free Tier:**

- 1M queries/month
- 500MB storage
- Perfect for MVP and testing

## 5. Google OAuth Setup

### Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google (for production)
   ```
6. Copy Client ID and Client Secret
7. Add to `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   ```

**Required Scopes:**

- `youtube.upload` - Upload videos to YouTube
- `userinfo.email` - Get user email
- `userinfo.profile` - Get user profile

## 6. Complete .env.local Example

```bash
# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth (Required)
NEXTAUTH_SECRET=your-secret-generated-with-openssl
NEXTAUTH_URL=http://localhost:3000

# Gemini API (Required)
GEMINI_API_KEY=your-gemini-api-key

# Convex (Required)
CONVEX_DEPLOYMENT=your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Optional: Replicate Image Generation
REPLICATE_API_TOKEN=r8_your-replicate-token

# Optional: ElevenLabs Premium TTS
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

## 7. Testing the Pipeline

### Step 1: Start Backend

```bash
npx convex dev
```

### Step 2: Start Frontend

```bash
npm run dev
```

### Step 3: Test Authentication

- Visit http://localhost:3000
- Click "Sign In"
- Complete Google OAuth flow
- You should be redirected to dashboard

### Step 4: Generate Video

- On Dashboard, click "Create Resource"
- Enter a topic (e.g., "How to Make Pizza")
- Watch as Gemini generates a script
- Click image icon to generate scene images (Pollinations.ai is free, no setup needed)
- Click audio icon to generate voiceover (VoiceRSS is free)
- Click "Assemble Video" to combine all assets

## Cost Analysis

### Monthly Costs (Based on 10 videos/month)

| Service             | Cost   | Notes                        |
| ------------------- | ------ | ---------------------------- |
| **Pollinations.ai** | $0     | Free unlimited               |
| **VoiceRSS**        | $0     | Free unlimited               |
| **Gemini API**      | $0     | 60 req/min free (sufficient) |
| **Convex**          | $0     | 1M queries/month free        |
| **Google OAuth**    | $0     | Free                         |
| **Replicate**       | $0     | Free tier sufficient         |
| **ElevenLabs**      | $0     | 300k chars/month free        |
| **YouTube**         | $0     | Free hosting                 |
| **Vercel**          | $0     | Deploy free tier available   |
| **Total**           | **$0** | Completely Free!             |

## Scaling Considerations

### To upgrade from free APIs:

1. **Image Generation:**

   - Upgrade from Pollinations → Stable Diffusion Pro
   - Or use Together AI API
   - Or self-host via Replicate paid tier

2. **Text-to-Speech:**

   - Upgrade ElevenLabs for more characters
   - Use Azure Speech Services
   - Use AWS Polly

3. **Video Generation:**

   - Deploy Remotion on AWS Lambda
   - Use Mux for video hosting
   - Use Cloudflare Stream

4. **Hosting:**
   - Deploy on Vercel (free) or upgrade to Pro
   - Database on Convex (free tier → paid)

## Troubleshooting

### Images not generating?

- Check if Pollinations.ai is accessible
- Verify prompt is not empty
- Try Replicate as alternative (requires API token)

### Audio not generating?

- VoiceRSS is free and doesn't require setup
- Text might be too long (auto-truncated)
- Try ElevenLabs for better quality

### Video not assembling?

- Ensure all scenes have images and audio
- Check browser console for errors
- Verify video status in dashboard

## Support & Resources

- [Pollinations.ai Docs](https://pollinations.ai)
- [VoiceRSS Docs](https://www.voicerss.org)
- [ElevenLabs Docs](https://docs.elevenlabs.io)
- [Replicate Docs](https://replicate.com/docs)
- [Convex Docs](https://docs.convex.dev)
- [Google Gemini API](https://ai.google.dev)
