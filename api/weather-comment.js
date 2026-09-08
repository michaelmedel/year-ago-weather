export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
  if (!HF_TOKEN) {
    return res.status(500).json({ error: 'API token not configured' });
  }

  const { todayWeather, lastWeather, todayTemp, lastTemp, location } = req.body;

  const prompt = `Generate ONE witty, edgy weather comment (max 20 words) comparing: Today in ${location} is ${todayTemp}° and ${todayWeather}. Last year was ${lastTemp}° and ${lastWeather}. Be sarcastic but avoid politics/religion.`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt, parameters: { max_length: 100 } })
    });

    const result = await response.json();
    
    if (result[0]?.generated_text) {
      let text = result[0].generated_text.replace(prompt, '').trim();
      text = text.split('\n')[0].trim();
      if (text) return res.json({ commentary: text });
    }

    // Fallback
    const fallbacks = [
      "Mother Nature doing whatever she wants. Respect the chaos.",
      "Last year called. It wants its weather back.",
      "Same time, totally different vibes.",
      "Nature's memory is as selective as ours.",
      "Different day, same temperature drama."
    ];
    return res.json({ commentary: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
  } catch (error) {
    const fallbacks = [
      "Mother Nature doing whatever she wants. Respect the chaos.",
      "Last year called. It wants its weather back.",
      "Same time, totally different vibes."
    ];
    return res.json({ commentary: fallbacks[Math.floor(Math.random() * fallbacks.length)] });
  }
}
