// ════════════════════════════════════════════
// PromptCraft — Media Analysis API
// api/analyze.js
// Gemini Vision se image/video analyze karta hai
// ════════════════════════════════════════════

export const config = {
  api: { bodyParser: { sizeLimit: '50mb' } }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mediaBase64, mediaType, toolName } = req.body;

    if (!mediaBase64 || !mediaType) {
      return res.status(400).json({ error: 'mediaBase64 and mediaType required' });
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured on server' });
    }

    // ── Gemini ke liye content parts banao ──
    const isVideo = mediaType.startsWith('video/');

    const analysisPrompt = `You are a professional visual analyst. Analyze this ${isVideo ? 'video' : 'image'} in extreme detail for the purpose of creating AI generation prompts for ${toolName}.

Analyze and describe:
1. SUBJECT: Who/what is the main subject? Physical details, appearance, clothing, expression
2. COMPOSITION: Shot type, framing, rule of thirds, leading lines, foreground/background
3. LIGHTING: Type of light, direction, color temperature (warm/cool/neutral), shadows, highlights
4. COLOR PALETTE: Dominant colors, color grading style, saturation, contrast
5. MOOD & ATMOSPHERE: Emotional tone, time of day, weather, ambience
6. CAMERA STYLE: Apparent lens, depth of field, motion blur, film grain, shooting style
7. VISUAL STYLE: Artistic style, reference to photographers/directors/artists if applicable
8. UNIQUE ELEMENTS: Any special techniques, effects, or distinctive visual choices

Be extremely specific and technical. This analysis will be used to recreate a similar visual style.`;

    // Gemini API call with vision
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mediaType,
                  data: mediaBase64
                }
              },
              { text: analysisPrompt }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1500
          }
        })
      }
    );

    const geminiData = await geminiRes.json();

    if (geminiData.error) {
      return res.status(400).json({ error: geminiData.error.message });
    }

    const analysis = geminiData.candidates[0].content.parts[0].text;
    return res.status(200).json({ analysis });

  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
}
