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

  const prompt = `Generate one witty, edgy weather comment in 20 words or fewer. Compare today's weather in ${location} (${todayTemp} degrees, ${todayWeather}) with last year's (${lastTemp} degrees, ${lastWeather}). Use 3 to 5 relevant weather emojis. Be sarcastic, but avoid politics and religion. Return only the comment.`;

  try {
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.1-8B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
        temperature: 0.8
      })
    });

    const result = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: result.error || 'AI provider error' });
    }

    const text = result.choices?.[0]?.message?.content?.trim();
    if (!text) return res.status(502).json({ error: 'AI returned no commentary' });
    return res.json({ commentary: text.split('\n')[0].trim() });
  } catch (error) {
    return res.status(502).json({ error: 'AI provider unavailable' });
  }
}
