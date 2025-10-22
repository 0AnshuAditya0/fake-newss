# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- HuggingFace account (free)

## Installation

```bash
# 1. Navigate to project directory
cd fake-news

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your HuggingFace API key to .env.local
# Get it from: https://huggingface.co/settings/tokens

# 5. Start the development server
npm run dev

# 6. Open http://localhost:3000
```

## First Analysis

1. **Go to homepage**: http://localhost:3000
2. **Click "Analyze URL" tab**
3. **Enter a test URL**: `https://www.reuters.com/world/`
4. **Click "Analyze Now"**
5. **View results** with credibility score and detailed breakdown

## Project Structure

```
fake-news/
├── app/                    # Pages and API routes
│   ├── page.tsx           # Homepage
│   ├── analyze/[id]/      # Results page
│   ├── dashboard/         # Analytics
│   └── api/               # Backend APIs
├── components/            # React components
├── lib/                   # Utilities & ML logic
└── public/               # Static files
```

## Key Features

✅ **AI-Powered Analysis** - HuggingFace RoBERTa model  
✅ **Multi-Signal Detection** - 5 different analysis methods  
✅ **URL & Text Analysis** - Flexible input options  
✅ **Real-Time Results** - Instant credibility scores  
✅ **Analytics Dashboard** - Track your analyses  
✅ **Export Reports** - Download analysis results  

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Troubleshooting
rm -rf node_modules .next
npm install          # Clean reinstall
```

## Environment Variables

```env
# Required
HUGGINGFACE_API_KEY=hf_xxxxx

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

Try these test cases:

1. **Credible Source**: https://www.bbc.com/news
2. **Text with Clickbait**: "You won't believe what happened next!"
3. **Emotional Language**: "SHOCKING revelation destroys everything!"

## Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🔧 Check [SETUP.md](./SETUP.md) for detailed setup
- 🔌 Review [API.md](./API.md) for API reference
- 🤝 See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## Need Help?

- Check the troubleshooting section in [SETUP.md](./SETUP.md)
- Open an issue on GitHub
- Review the documentation files

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

**Ready to fight fake news!** 🛡️
