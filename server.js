const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Hugging Face API configuration
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL_ID = "meta-llama/Llama-2-7b-chat-hf"; // Free tier model

async function generateWittyCommentary(weatherData) {
  if (!HF_API_TOKEN) {
    console.error("Hugging Face API token not configured");
    return null;
  }

  const { todayWeather, lastWeather, todayTemp, lastTemp, location } = weatherData;

  const prompt = `You are a witty, edgy weather commentator. Generate ONE short, clever comment (max 20 words) comparing today's weather to last year. Be sarcastic and funny but avoid politics, religion, and controversial topics. Just be funny about weather.

Today in ${location}: ${todayTemp}° and ${todayWeather}
Last year same day: ${lastTemp}° and ${lastWeather}

Make a witty one-liner:`;

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL_ID}`,
      {
        headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: prompt, parameters: { max_length: 60 } }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result[0] && result[0].generated_text) {
      // Extract just the generated part (after the prompt)
      let text = result[0].generated_text.replace(prompt, "").trim();
      // Clean up any weird characters
      text = text.split('\n')[0].trim();
      return text || null;
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return null;
  }

  return null;
}

app.post('/api/weather-comment', async (req, res) => {
  try {
    const weatherData = req.body;
    const commentary = await generateWittyCommentary(weatherData);

    if (commentary) {
      res.json({ commentary });
    } else {
      // Fallback to static commentary if API fails
      const fallbacks = [
        "Mother Nature doing whatever she wants. Respect the chaos.",
        "Last year called. It wants its weather back.",
        "Same time, totally different vibes.",
        "Nature's memory is as selective as ours.",
        "Different day, same temperature drama."
      ];
      res.json({ commentary: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
    }
  } catch (error) {
    console.error("Error in /api/weather-comment:", error);
    res.status(500).json({ error: "Failed to generate commentary" });
  }
});

app.listen(PORT, () => {
  console.log(`🌦️  Weather AI Agent running on http://localhost:${PORT}`);
  console.log(`Make sure HUGGINGFACE_API_TOKEN is set in .env`);
});
