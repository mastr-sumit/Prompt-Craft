// ════════════════════════════════════════════
// PromptCraft — Text Generation API
// api/generate.js
// ════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { systemPrompt, userPrompt, visualAnalysis } = req.body;

    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'systemPrompt and userPrompt required' });
    }

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Visual analysis hai toh system prompt mein add karo
    const finalSystem = visualAnalysis
      ? `${systemPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPLOADED MEDIA VISUAL ANALYSIS (use as style reference):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${visualAnalysis}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: Generate prompts that CLOSELY MATCH this visual style, lighting, mood, color palette, and composition. User wants to recreate this aesthetic.`
      : systemPrompt;

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
          { role: 'system', content: finalSystem },
          { role: 'user',   content: userPrompt }
        ]
      })
    });

    const data = await groqRes.json();
    if (data.error) return res.status(400).json({ error: data.error.message });

    return res.status(200).json({ text: data.choices[0].message.content });

  } catch (err) {
    console.error('Generate error:', err);
    return res.status(500).json({ error: 'Generation failed: ' + err.message });
  }
}
