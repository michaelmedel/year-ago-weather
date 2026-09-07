# Deployment Guide: GitHub + Vercel

This guide walks you through deploying the Weather Compare App to production using GitHub and Vercel.

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a repository named `year-ago-weather` (or your preferred name)
3. **Do NOT** initialize with README (we already have one)
4. Copy the repository URL

## Step 2: Push Code to GitHub

Run these commands in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/year-ago-weather.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and use your repository URL.

## Step 3: Deploy Backend to Vercel

### 3a. Create Vercel Account & Project

1. Go to [vercel.com](https://vercel.com)
2. Sign up (free tier available)
3. Click "Add New..." → "Project"
4. Import your GitHub repository `year-ago-weather`
5. Accept the default settings and click "Deploy"

Vercel will automatically detect this is a Node.js project and deploy it.

### 3b. Set Environment Variables

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name:** `HUGGINGFACE_API_TOKEN`
   - **Value:** (Paste your Hugging Face API token)
   - **Environments:** Production, Preview, Development
4. Click "Save"
5. Redeploy the project (Settings → Deployments → Redeploy)

### 3c. Get Your Vercel URL

After deployment:
1. Go to "Deployments" tab
2. Click the most recent deployment
3. Copy the URL (looks like `https://year-ago-weather.vercel.app`)

## Step 4: Set Up Custom Domain (yearagoweather.com)

### If you own the domain:

1. In Vercel dashboard, go to Settings → Domains
2. Click "Add Domain"
3. Enter your domain `yearagoweather.com`
4. Vercel will show you nameservers to add to your domain registrar
5. Update your domain registrar's nameservers
6. Wait 24-48 hours for DNS to propagate

### Using GitHub Pages (alternative):

If you want to serve the frontend from GitHub Pages:

1. Go to your GitHub repository Settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` directory
5. GitHub will generate a URL (your-username.github.io/year-ago-weather)

**Note:** GitHub Pages is optional - Vercel already hosts your entire app.

## Step 5: Verify Deployment

1. Visit `https://year-ago-weather.vercel.app` (or your custom domain)
2. Search for a city
3. Click "Check the Weather"
4. Verify the AI commentary appears

## Troubleshooting

### "Generating witty commentary..." stays loading

- Check Vercel logs: Project → Functions → weather-comment logs
- Verify HUGGINGFACE_API_TOKEN is set in Environment Variables
- Ensure your Hugging Face token is valid

### Domain not working

- DNS changes take 24-48 hours to propagate
- Check Vercel DNS settings are correctly pointing to your domain
- Try clearing your browser cache

### API 500 error

- Check Vercel Function logs for errors
- Verify environment variable is set and valid
- Restart the deployment

## Local Development

To test locally before deploying:

```bash
npm install
npm run dev
```

Then update `.env` with your Hugging Face token.

## Updating Your App

To deploy updates:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
3. Vercel automatically redeploys on every push

## Cost

- **Vercel:** Free tier includes unlimited deployments and API calls
- **Hugging Face:** Free tier ~30k requests/month (plenty for a hobby project)
- **GitHub:** Free public repository

This is a completely free deployment!

## Support

- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Hugging Face Docs: https://huggingface.co/docs
