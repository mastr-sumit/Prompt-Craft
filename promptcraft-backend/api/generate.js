// ════════════════════════════════════════════
// PromptCraft — Backend API
// api/generate.js
// Groq key yahan safely chupi rahegi!
// ════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS — sabhi origins se allow karo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight request handle karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sirf POST allow karo
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, userPrompt, count } = req.body;

    // Validation
    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'systemPrompt and userPrompt required' });
    }

    // Groq API key — Vercel environment variable se aayegi (safe!)
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return res.status(500).json({ error: 'Server configuration error — API key missing' });
    }

    // Groq API call
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        temperature: 0.9,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt }
        ]
      })
    });

    const data = await groqRes.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const text = data.choices[0].message.content;
    return res.status(200).json({ text });

  } catch (err) {
    console.error('Backend error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
