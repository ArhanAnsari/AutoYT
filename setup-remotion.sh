#!/bin/bash

# AutoYT Remotion Setup Script
# Install and configure Remotion for video generation

echo "🎬 Setting up Remotion for AutoYT..."

# Install Remotion packages
npm install remotion @remotion/cli @remotion/renderer --save

echo "✅ Remotion packages installed!"
echo ""
echo "📝 Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Open the studio and generate a video with all:
   - Script generated ✓
   - Images generated for each scene ✓ 
   - Audio generated for each scene ✓"
echo "3. Click 'Assemble Video' button"
echo ""
echo "🚀 For production video rendering:"
echo "   Option A: Deploy to Remotion Lambda (AWS Lambda-based rendering)"
echo "   Option B: Use local FFmpeg for simple MP4 output"
echo "   Option C: Use Mux, Cloudflare Stream, or similar cloud services"
echo ""
echo "📚 Learn more: https://www.remotion.dev"
