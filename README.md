# Weather Compare App with AI Commentary

A fun web app that compares today's weather to last year's weather with witty, AI-generated commentary powered by Hugging Face.

## Features
- 🌦️ Search for any city worldwide
- 📊 Compare today's weather to exactly one year ago
- 🤖 AI-generated witty and edgy commentary (non-political)
- ⚡ Fallback commentary if API is down
- 📱 Mobile-friendly responsive design

## Setup

### 1. Get a Free Hugging Face API Token
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token (read access is fine)
5. Copy the token

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
```bash
cp .env.example .env
```

Then edit `.env` and paste your Hugging Face token:
```
HUGGINGFACE_API_TOKEN=your_token_here
```

### 4. Start the Server
```bash
npm start
```

The app will be running at `http://localhost:3000`

## How It Works

1. **Frontend** (`index.html`) - Search for a city and fetch weather data from Open-Meteo API
2. **Backend** (`server.js`) - 
   - Receives weather data from the frontend
   - Sends it to Hugging Face Inference API with a witty prompt
   - Returns AI-generated commentary
3. **Fallback** - If the AI API fails or rate-limits, uses pre-written witty quips

## API Endpoints

### POST `/api/weather-comment`
Generates witty weather commentary

**Request:**
```json
{
  "todayWeather": "rain",
  "lastWeather": "clear skies",
  "todayTemp": 65,
  "lastTemp": 72,
  "location": "San Francisco, CA"
}
```

**Response:**
```json
{
  "commentary": "Last year you were vibing in the sun. Now you're getting rained on. Nature said 'reset.'"
}
```

## Tone Guidelines

The AI generates commentary that is:
- ✅ Witty and edgy
- ✅ Funny and sarcastic
- ✅ About weather only
- ❌ Never political
- ❌ Never religious
- ❌ Never controversial

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **AI Model:** Hugging Face Inference API (Llama 2)
- **Weather Data:** Open-Meteo API (free, no auth needed)

## Development

To run with auto-reload:
```bash
npm run dev
```

## Free Tier Limits
- Hugging Face free tier: ~30k requests/month
- Rate limit: Shared across all users, may get rate-limited during high traffic
- Open-Meteo: Unlimited free requests

## Troubleshooting

**"Pick a real place first" error**
- Make sure you've selected a city from the dropdown

**"Generating witty commentary..." stays loading**
- The Hugging Face API might be rate-limited
- Check your internet connection
- Verify HUGGINGFACE_API_TOKEN in .env

**Server won't start**
- Make sure Node.js is installed: `node --version`
- Make sure port 3000 is not in use
- Try: `PORT=3001 npm start`

## License
MIT
