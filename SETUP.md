# 🚀 Setup Guide

Complete step-by-step guide to set up and run the Fake News Detector application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm or yarn**: Package manager (npm comes with Node.js)
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

- **Git**: Version control (optional but recommended)
  - Download from [git-scm.com](https://git-scm.com/)

## Step 1: Get the Code

### Option A: Clone from Git
```bash
git clone <repository-url>
cd fake-news
```

### Option B: Download ZIP
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal in the project folder

## Step 2: Install Dependencies

Run one of the following commands in the project root:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- HuggingFace Inference
- Axios, Cheerio, Recharts
- shadcn/ui components
- And more...

**Installation time**: 2-5 minutes depending on your internet speed.

## Step 3: Get HuggingFace API Key

The application uses HuggingFace's API for ML-based fake news detection.

1. **Create a HuggingFace account** (free)
   - Visit [https://huggingface.co/join](https://huggingface.co/join)
   - Sign up with email or GitHub

2. **Generate an API token**
   - Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Click "New token"
   - Name it (e.g., "Fake News Detector")
   - Select "Read" access
   - Click "Generate"
   - **Copy the token** (you won't see it again!)

3. **Important**: Keep your API key secure and never commit it to version control.

## Step 4: Configure Environment Variables

1. **Create `.env.local` file** in the project root:

```bash
# Windows (PowerShell)
New-Item .env.local

# macOS/Linux
touch .env.local
```

2. **Add your configuration**:

Open `.env.local` in a text editor and add:

```env
# HuggingFace API Key (required)
HUGGINGFACE_API_KEY=hf_your_actual_key_here

# Application URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Replace `hf_your_actual_key_here`** with your actual HuggingFace API key.

## Step 5: Run the Development Server

Start the application:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

## Step 6: Open in Browser

1. Open your web browser
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. You should see the Fake News Detector homepage!

## Step 7: Test the Application

### Quick Test

1. **Analyze a URL**:
   - Click "Analyze URL" tab
   - Enter: `https://www.reuters.com/world/`
   - Click "Analyze Now"
   - Wait for results (5-10 seconds)

2. **Analyze Text**:
   - Click "Analyze Text" tab
   - Paste any news article text (minimum 50 characters)
   - Click "Analyze Now"

3. **Check Dashboard**:
   - Click "Dashboard" in the navigation
   - View your analysis statistics

### Expected Results

- **Credible sources** (Reuters, AP News, BBC): High scores (70-100)
- **Clickbait content**: Lower scores with red flags
- **Emotional language**: Flagged in highlights
- **Unknown sources**: Medium scores (40-70)

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Invalid API key" error

**Solutions**:
1. Verify your HuggingFace API key is correct
2. Ensure `.env.local` file is in the project root
3. Restart the development server after changing `.env.local`
4. Check that the key starts with `hf_`

### Issue: Port 3000 already in use

**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

### Issue: Scraping fails for certain URLs

**Possible causes**:
- Website blocks scraping
- CORS restrictions
- Website requires JavaScript rendering
- Invalid URL format

**Solution**: Try analyzing the text directly instead of the URL.

### Issue: Slow analysis

**Causes**:
- First request to HuggingFace API (cold start)
- Large text content
- Slow internet connection

**Solution**: Subsequent requests will be faster.

## Building for Production

### Build the application

```bash
npm run build
```

This creates an optimized production build in `.next/` folder.

### Run production server locally

```bash
npm run start
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables when asked.

## Environment Variables for Production

When deploying, set these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `HUGGINGFACE_API_KEY` | Your HuggingFace API key | `hf_xxxxx` |
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://yourapp.vercel.app` |

## Development Tips

### Hot Reload
The development server supports hot reload. Changes to files will automatically refresh the browser.

### TypeScript Errors
If you see TypeScript errors, run:
```bash
npm run lint
```

### Clear Cache
If you experience strange behavior:
```bash
rm -rf .next
npm run dev
```

### View API Logs
API route logs appear in the terminal where you ran `npm run dev`.

## Next Steps

1. **Customize the application**:
   - Add more credible/unreliable sources in `lib/ml-service.ts`
   - Adjust analysis weights
   - Modify UI colors in `tailwind.config.ts`

2. **Explore the code**:
   - Start with `app/page.tsx` (homepage)
   - Check `lib/ml-service.ts` (analysis logic)
   - Review `app/api/analyze/route.ts` (API endpoint)

3. **Add features**:
   - User authentication
   - Database integration
   - More ML models
   - Chrome extension

## Getting Help

- **Documentation**: See [README.md](./README.md)
- **Issues**: Check existing GitHub issues
- **Community**: Join discussions on GitHub

## Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Keep your HuggingFace API key secret
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting in production
- [ ] Validate all user inputs
- [ ] Keep dependencies updated

## Success! 🎉

You now have a fully functional Fake News Detector running locally!

Try analyzing different types of content and explore the dashboard to see statistics.

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.
