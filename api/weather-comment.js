// Vercel Serverless Function for Weather Commentary
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL_ID = "meta-llama/Llama-2-7b-chat-hf";

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
      let text = result[0].generated_text.replace(prompt, "").trim();
      text = text.split('\n')[0].trim();
      return text || null;
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return null;
  }

  return null;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const weatherData = req.body;
    const commentary = await generateWittyCommentary(weatherData);

    if (commentary) {
      return res.status(200).json({ commentary });
    } else {
      // Fallback commentary
      const fallbacks = [
        "Mother Nature doing whatever she wants. Respect the chaos.",
        "Last year called. It wants its weather back.",
        "Same time, totally different vibes.",
        "Nature's memory is as selective as ours.",
        "Different day, same temperature drama."
      ];
      return res.status(200).json({ 
        commentary: fallbacks[Math.floor(Math.random() * fallbacks.length)] 
      });
    }
  } catch (error) {
    console.error("Error in weather-comment handler:", error);
    return res.status(500).json({ error: "Failed to generate commentary" });
  }
}
