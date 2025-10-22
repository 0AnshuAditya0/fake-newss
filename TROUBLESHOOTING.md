# 🔧 Troubleshooting Guide

Common issues and their solutions for the Fake News Detector application.

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms**: Error messages during dependency installation

**Solutions**:

1. **Clear npm cache**
```bash
npm cache clean --force
npm install
```

2. **Delete lock file and reinstall**
```bash
rm package-lock.json
rm -rf node_modules
npm install
```

3. **Update npm**
```bash
npm install -g npm@latest
```

4. **Use different package manager**
```bash
yarn install
# or
pnpm install
```

---

## Environment Variable Issues

### Issue: "Invalid API key" or "Unauthorized"

**Symptoms**: 401 errors when analyzing content

**Solutions**:

1. **Verify `.env.local` exists** in project root
2. **Check API key format**: Should start with `hf_`
3. **Regenerate API key** at https://huggingface.co/settings/tokens
4. **Restart dev server** after changing `.env.local`
```bash
# Stop server (Ctrl+C)
npm run dev
```

5. **Check for typos** in variable name:
```env
# Correct
HUGGINGFACE_API_KEY=hf_xxxxx

# Wrong
HUGGING_FACE_API_KEY=hf_xxxxx  # Missing underscore
```

### Issue: Environment variables not loading

**Solutions**:

1. **File must be named** `.env.local` (not `.env`)
2. **File must be in project root** (same level as package.json)
3. **No spaces around `=`**:
```env
# Correct
HUGGINGFACE_API_KEY=hf_xxxxx

# Wrong
HUGGINGFACE_API_KEY = hf_xxxxx
```

---

## Development Server Issues

### Issue: Port 3000 already in use

**Symptoms**: `EADDRINUSE: address already in use :::3000`

**Solutions**:

1. **Use different port**
```bash
npm run dev -- -p 3001
```

2. **Kill process using port 3000** (Windows)
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

3. **Kill process** (macOS/Linux)
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: Changes not reflecting in browser

**Solutions**:

1. **Hard refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear `.next` folder**
```bash
rm -rf .next
npm run dev
```
3. **Disable browser cache** in DevTools
4. **Check file is saved** before expecting changes

---

## Analysis Issues

### Issue: "Failed to scrape URL"

**Symptoms**: Error when analyzing URLs

**Possible Causes & Solutions**:

1. **Website blocks scraping**
   - Try analyzing the text directly instead
   - Some sites have anti-scraping measures

2. **Invalid URL format**
   - Ensure URL starts with `http://` or `https://`
   - Check for typos in URL

3. **Website requires JavaScript**
   - The scraper doesn't execute JavaScript
   - Copy and paste the text instead

4. **Timeout**
   - Website is slow to respond
   - Try again or use text analysis

5. **CORS issues**
   - This shouldn't happen with server-side scraping
   - Check if API route is working: http://localhost:3000/api/analyze

### Issue: "Text is too short for analysis"

**Symptoms**: Error with minimum 50 characters message

**Solution**: Ensure text is at least 50 characters long
```javascript
// Minimum valid text
"This is a test article with enough characters for analysis to work properly."
```

### Issue: Analysis takes too long

**Possible Causes**:

1. **First request (cold start)**
   - HuggingFace API initializes on first use
   - Subsequent requests will be faster

2. **Large text content**
   - Text is automatically limited to 5000 characters
   - Consider analyzing shorter excerpts

3. **Slow internet connection**
   - Check your internet speed
   - Try again with better connection

4. **HuggingFace API issues**
   - Check https://status.huggingface.co/
   - Wait and try again

### Issue: Inaccurate results

**Understanding**:

The system combines multiple signals. Inaccuracies can occur because:

1. **ML model limitations**: No model is 100% accurate
2. **Satire/humor**: May be flagged as fake
3. **Opinion pieces**: May show bias
4. **New sources**: Not in credibility database

**Recommendations**:
- Use as a tool, not absolute truth
- Verify with multiple sources
- Consider context and nuance
- Check the explanation for reasoning

---

## UI/Display Issues

### Issue: Styles not loading

**Symptoms**: Unstyled or broken layout

**Solutions**:

1. **Check Tailwind is working**
```bash
npm run dev
# Look for Tailwind compilation messages
```

2. **Rebuild**
```bash
rm -rf .next
npm run dev
```

3. **Verify `globals.css` is imported** in `app/layout.tsx`

### Issue: Components not rendering

**Solutions**:

1. **Check browser console** for errors (F12)
2. **Verify component imports** are correct
3. **Check for TypeScript errors**
```bash
npm run build
```

### Issue: Icons not showing

**Solutions**:

1. **Verify lucide-react is installed**
```bash
npm install lucide-react
```

2. **Check import statements**
```typescript
import { Shield, Check } from "lucide-react";
```

---

## Data Persistence Issues

### Issue: Analysis history not saving

**Symptoms**: Dashboard shows no data after analyses

**Solutions**:

1. **Check localStorage is enabled** in browser
2. **Clear localStorage and try again**
```javascript
// In browser console
localStorage.clear()
```

3. **Check browser privacy settings**
   - Some browsers block localStorage in private mode

4. **Verify `saveAnalysis()` is called** after analysis

### Issue: Lost data after refresh

**Expected Behavior**: Data is stored in browser localStorage

**Note**: 
- Data is per-browser, per-device
- Clearing browser data will delete analyses
- Not synced across devices
- Consider implementing backend storage for persistence

---

## Build Issues

### Issue: Build fails with TypeScript errors

**Solutions**:

1. **Check all TypeScript errors**
```bash
npm run build
```

2. **Fix type errors** in reported files

3. **Verify all imports** are correct

4. **Check `tsconfig.json`** is properly configured

### Issue: Build succeeds but app doesn't work

**Solutions**:

1. **Test production build locally**
```bash
npm run build
npm run start
```

2. **Check environment variables** are set for production

3. **Review build logs** for warnings

---

## Deployment Issues

### Issue: Vercel deployment fails

**Solutions**:

1. **Check build logs** in Vercel dashboard

2. **Verify environment variables** are set in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `HUGGINGFACE_API_KEY`

3. **Check Node.js version**
   - Vercel should use Node 18+
   - Set in `package.json`:
```json
"engines": {
  "node": ">=18.0.0"
}
```

4. **Review build command**
   - Should be: `next build`

### Issue: API routes not working in production

**Solutions**:

1. **Check API route paths** are correct
2. **Verify serverless function limits**
   - Timeout: 10 seconds (Vercel Hobby)
   - Memory: 1024 MB
3. **Check environment variables** in production

---

## Performance Issues

### Issue: Slow page loads

**Solutions**:

1. **Enable production mode**
```bash
npm run build
npm run start
```

2. **Check network tab** in DevTools
3. **Optimize images** if added
4. **Consider CDN** for static assets

### Issue: High memory usage

**Solutions**:

1. **Limit analysis history** in localStorage
2. **Clear old analyses** periodically
3. **Check for memory leaks** in DevTools

---

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues

- **IE 11**: Not supported (use modern browser)
- **Old mobile browsers**: May have issues

---

## API Rate Limiting

### Issue: "Rate limit exceeded"

**Symptoms**: 429 error after multiple requests

**Solutions**:

1. **Wait 1 minute** before trying again
2. **Adjust rate limit** in `app/api/analyze/route.ts`:
```typescript
const RATE_LIMIT = 10; // Increase if needed
const RATE_WINDOW = 60 * 1000; // 1 minute
```

3. **Implement request queuing** in your application
4. **Consider caching** results for repeated analyses

---

## Getting More Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Review error messages carefully
3. ✅ Check browser console (F12)
4. ✅ Review relevant documentation
5. ✅ Search existing GitHub issues

### How to Report Issues

Include:
- **Description**: What's wrong?
- **Steps to reproduce**: How to trigger the issue?
- **Expected behavior**: What should happen?
- **Actual behavior**: What actually happens?
- **Environment**: OS, browser, Node version
- **Screenshots**: If applicable
- **Error messages**: Full error text

### Resources

- 📖 [README.md](./README.md) - Main documentation
- 🔧 [SETUP.md](./SETUP.md) - Setup guide
- 🔌 [API.md](./API.md) - API reference
- 💬 GitHub Issues - Community support

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

1. ⬜ Restart development server
2. ⬜ Hard refresh browser (Ctrl+Shift+R)
3. ⬜ Clear `.next` folder
4. ⬜ Check `.env.local` file exists and is correct
5. ⬜ Verify all dependencies are installed
6. ⬜ Check browser console for errors
7. ⬜ Review recent code changes
8. ⬜ Try in different browser
9. ⬜ Clear browser cache/localStorage
10. ⬜ Reinstall dependencies

---

**Still having issues?** Open an issue on GitHub with detailed information!
