// ════════════════════════════════════════════
// PromptCraft — AI Prompt Studio
// script.js — PUBLIC VERSION (no API key needed!)
// ════════════════════════════════════════════

const TOOLS = [
  {
    id: 'veo3', name: 'Veo 3', type: 'VIDEO', emoji: '🎬', color: '#f95b8e',
    placeholder: 'e.g. surfer riding a massive wave at sunset, slow motion aerial shot…',
    tags: ['aerial drone','tracking shot','slow-mo 120fps','golden hour','dolly zoom','handheld shaky','steadicam','POV first-person'],
    systemHint: `You are a world-class cinematographer and AI video prompt engineer specializing in Google Veo 3.

Write ULTRA-DETAILED prompts using this exact structure:
[SHOT TYPE + CAMERA ANGLE] → [SUBJECT with extreme physical detail] → [PRECISE ACTION] → [ENVIRONMENT] → [CAMERA MOVEMENT technical] → [LIGHTING with Kelvin temp] → [ATMOSPHERE] → [COLOR GRADE] → [AUDIO] → [TECHNICAL SPECS]

RULES:
- Shot type must be specific: "extreme low-angle wide establishing shot"
- Subject: clothing texture, body posture, facial expression, hair behavior, skin tone, age
- Camera: "smooth 8-second dolly push-in closing from 20 feet to 2 feet"
- Lighting: color temperature in Kelvin (2700K warm amber, 5600K daylight, 9000K cool blue)
- Always end with: "Shot on ARRI Alexa 35, anamorphic 2.39:1, 24fps, cinematic color grade"
- Include audio: ambient sounds, music tone, sound effects
- Minimum 150 words per prompt
- Each variation = completely different director's vision (Nolan, Villeneuve, Kubrick)`,
    tmplFields: [
      { key: 'subject',  label: 'SUBJECT / CHARACTER',   ph: 'a weathered 40-year-old fisherman, rough hands, orange oilskin jacket' },
      { key: 'action',   label: 'ACTION / MOVEMENT',     ph: 'slowly pulling heavy fishing nets from dark churning ocean' },
      { key: 'setting',  label: 'SETTING / ENVIRONMENT', ph: 'Norwegian fjord at dawn, towering fog-covered cliffs' },
      { key: 'camera',   label: 'CAMERA MOVEMENT',       ph: 'slow crane shot rising from water level to high aerial' },
      { key: 'lighting', label: 'LIGHTING & TIME',       ph: 'pre-dawn blue hour, 6000K, soft diffused, long blue shadows' },
      { key: 'mood',     label: 'MOOD / ATMOSPHERE',     ph: 'melancholic, isolated, raw human struggle against nature' },
      { key: 'audio',    label: 'AUDIO / SOUNDS',        ph: 'waves crashing, rope tension creaking, distant foghorn' },
    ],
    tmplFn: (f) => `Cinematic video: ${f.subject||'[subject]'} ${f.action||'[action]'} in ${f.setting||'[setting]'}. Camera: ${f.camera||'[camera]'}. Lighting: ${f.lighting||'[lighting]'}. Mood: ${f.mood||'[mood]'}. Audio: ${f.audio||'[audio]'}. Shot on ARRI Alexa 35, anamorphic 2.39:1, 24fps, cinematic color grade.`
  },
  {
    id: 'mj', name: 'Midjourney', type: 'IMAGE', emoji: '🎨', color: '#5b6cf9',
    placeholder: 'e.g. ancient temple ruins at dawn, mist, dramatic god rays…',
    tags: ['--ar 16:9','--v 6.1','--style raw','--chaos 25','--stylize 750','hyperrealistic','--weird 500','--no text, watermark'],
    systemHint: `You are a master Midjourney v6.1 prompt architect.

PROMPT STRUCTURE:
[PRIMARY SUBJECT with maximum specificity], [SECONDARY ELEMENTS], [ART STYLE + MEDIUM + 3 ARTIST REFERENCES], [LIGHTING SETUP], [CAMERA/LENS TECHNICAL], [COLOR PALETTE], [QUALITY BOOSTERS], [PARAMETERS]

RULES:
- Describe physical attributes with obsessive detail: materials, textures, colors, surface qualities
- Always include 3 artist references minimum
- Lighting: use photography terminology (Rembrandt, split, butterfly)
- Camera: "Shot on Hasselblad H6D, 100mm medium format, f/2.8"
- Always end with: --ar [ratio] --v 6.1 --style raw --stylize [400-1000] --chaos [0-30]
- Quality boosters: "award-winning, ArtStation, 8K, ultra-detailed, masterpiece"`,
    tmplFields: [
      { key: 'subject',  label: 'MAIN SUBJECT (detailed)',    ph: 'ancient samurai warrior, scarred face, worn lacquered armor' },
      { key: 'style',    label: 'ART STYLE + MEDIUM',         ph: 'oil painting on linen, dark fantasy, photorealistic' },
      { key: 'artists',  label: 'ARTIST REFERENCES (3 min)',  ph: 'Greg Rutkowski, Alphonse Mucha, Frank Frazetta' },
      { key: 'lighting', label: 'LIGHTING SETUP',             ph: 'dramatic chiaroscuro, single torch light, deep shadows' },
      { key: 'lens',     label: 'CAMERA / LENS',              ph: 'Hasselblad 100mm medium format, f/2.8, shallow DOF' },
      { key: 'params',   label: 'MJ PARAMETERS',              ph: '--ar 3:4 --v 6.1 --style raw --stylize 800 --chaos 15' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'}, ${f.style||'[style]'}, in the style of ${f.artists||'[artists]'}, ${f.lighting||'[lighting]'}, ${f.lens||'[lens]'}, ultra-detailed, masterpiece, award-winning, 8K ${f.params||'--ar 1:1 --v 6.1 --style raw --stylize 750'}`
  },
  {
    id: 'sd', name: 'Stable Diffusion', type: 'IMAGE', emoji: '🖼️', color: '#5bf9c3',
    placeholder: 'e.g. cyberpunk city street market, neon rain reflections, ultra detailed…',
    tags: ['score_9','masterpiece','best quality','8k uhd','(sharp focus:1.4)','RAW photo','(photorealistic:1.3)','(intricate details:1.3)'],
    systemHint: `You are an expert Stable Diffusion XL prompt engineer.

POSITIVE PROMPT STRUCTURE:
[QUALITY HEADER], [SUBJECT with weighted details], [STYLE], [ENVIRONMENT], [LIGHTING], [CAMERA]

QUALITY HEADER (always start with):
"score_9, score_8_up, masterpiece, best quality, ultra highres, RAW photo, 8k uhd"

WEIGHT SYNTAX — use for important elements:
(word:1.1-1.5) to emphasize, [word] to de-emphasize
Example: "(piercing blue eyes:1.3), (detailed skin pores:1.4)"

ALWAYS include detailed NEGATIVE PROMPT:
"ugly, deformed, noisy, blurry, low quality, worst quality, jpeg artifacts, watermark, signature, extra limbs, malformed hands, bad anatomy, disfigured, mutated, out of frame"`,
    tmplFields: [
      { key: 'quality',  label: 'QUALITY TAGS',          ph: 'score_9, masterpiece, best quality, 8k uhd, RAW photo' },
      { key: 'subject',  label: 'SUBJECT WITH WEIGHTS',  ph: '(beautiful woman:1.0), (green eyes:1.3), (silk dress:1.2)' },
      { key: 'style',    label: 'STYLE + MEDIUM',        ph: '(photorealistic:1.3), (hyperrealistic:1.2), cinematic' },
      { key: 'lighting', label: 'LIGHTING WITH WEIGHTS', ph: '(golden hour:1.3), (volumetric rays:1.2), (bokeh:1.4)' },
      { key: 'camera',   label: 'CAMERA / LENS',         ph: '(85mm lens:1.2), (f/1.4:1.2), (shallow DOF:1.3)' },
      { key: 'negative', label: 'NEGATIVE PROMPT',       ph: 'ugly, deformed, blurry, watermark, extra limbs, bad anatomy' },
    ],
    tmplFn: (f) => `${f.quality||'score_9, masterpiece, best quality, 8k uhd, RAW photo'}, ${f.subject||'[subject]'}, ${f.style||'[style]'}, ${f.lighting||'[lighting]'}, ${f.camera||'[camera]'}\n\nNegative prompt: ${f.negative||'ugly, deformed, noisy, blurry, low quality, watermark, bad anatomy, extra limbs'}`
  },
  {
    id: 'flux', name: 'Flux / NanoBanana', type: 'IMAGE', emoji: '⚡', color: '#f9c35b',
    placeholder: 'e.g. cozy rainy Japanese café, warm light, film grain, editorial photo…',
    tags: ['photorealistic','35mm film grain','bokeh','editorial photography','Leica M6','Kodak Portra 400','medium format','sharp focus'],
    systemHint: `You are a master photographer and Flux model specialist. Write in flowing descriptive prose.

INCLUDE ALL OF THESE:
- Subject with obsessive detail: light on fabric, eye color, hand tension, shoe scuffs
- Camera: "Shot on Leica M6 with Kodak Portra 400" or "Fujifilm GFX 100S medium format"
- Lens: "50mm Summilux f/1.4 wide open"
- Exposure: "underexposed 1/3 stop for rich shadows"
- Lighting: "north-facing window at 10 o'clock, 5600K diffused, 3:1 lighting ratio"
- Color palette: specific names — "muted sage, dusty rose, faded terracotta, warm cream"
- Mood: "like a stolen private moment the viewer is intruding upon"`,
    tmplFields: [
      { key: 'subject',  label: 'SUBJECT (obsessive detail)', ph: '35-year-old Japanese woman, reading, ink-stained fingers' },
      { key: 'setting',  label: 'SETTING / ENVIRONMENT',      ph: 'small Kyoto bookshop, wooden shelves floor to ceiling' },
      { key: 'lighting', label: 'LIGHTING (technical)',        ph: 'north window, 5600K diffused, 3:1 ratio, soft shadows' },
      { key: 'camera',   label: 'CAMERA + FILM STOCK',        ph: 'Leica M6, 50mm f/1.4, Kodak Portra 400, -1/3 stop' },
      { key: 'palette',  label: 'COLOR PALETTE',              ph: 'muted sage, warm cream, dusty gold, faded terracotta' },
      { key: 'mood',     label: 'MOOD / ATMOSPHERE',          ph: 'quiet solitude, stolen moment, melancholic nostalgia' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'} in ${f.setting||'[setting]'}. Lighting: ${f.lighting||'[lighting]'}. ${f.camera||'[camera]'}. Color palette: ${f.palette||'[palette]'}. Mood: ${f.mood||'[mood]'}.`
  },
  {
    id: 'sora', name: 'Sora', type: 'VIDEO', emoji: '🎥', color: '#ff9f6a',
    placeholder: 'e.g. paper boat sailing flooded Venice at dusk, magical realism…',
    tags: ['realistic physics','seamless loop','4K cinematic','wide establishing','slow push-in','magical realism','physics simulation','nature doc style'],
    systemHint: `You are an elite Sora prompt engineer. Sora excels at realistic physics and cinematic storytelling.

STRUCTURE:
1. SCENE ESTABLISHMENT: Wide shot with geography and scale — be architectural and precise
2. SUBJECT INTRODUCTION: Who, emotional state, what and WHY
3. PHYSICS AND MOTION: Fabric movement, water turbulence, particle physics — be precise
4. CAMERA CHOREOGRAPHY: Write like a shot list — distances, heights, movements
5. TEMPORAL ELEMENTS: What changes over the duration of the clip
6. SENSORY COMPLETENESS: What should the viewer FEEL watching this`,
    tmplFields: [
      { key: 'scene',    label: 'OPENING SCENE (wide)',     ph: 'fog-draped Alps stone bridge, 6am, glacial river below' },
      { key: 'subject',  label: 'SUBJECT + NARRATIVE',      ph: 'young woman, mustard jacket, gripping railing, staring downstream' },
      { key: 'physics',  label: 'PHYSICS / MOTION DETAIL',  ph: 'jacket rippling in wind, river churning, spray catching light' },
      { key: 'camera',   label: 'CAMERA CHOREOGRAPHY',      ph: 'water-level push from 40ft, rising under bridge arch' },
      { key: 'time',     label: 'TIME OF DAY / WEATHER',    ph: 'early morning, 6600K overcast, light fog, drizzle' },
      { key: 'duration', label: 'DURATION / PACING',        ph: '8-second slow sequence, 24fps, no cuts' },
    ],
    tmplFn: (f) => `${f.scene||'[scene]'}. Subject: ${f.subject||'[subject]'}. Motion: ${f.physics||'[physics]'}. Camera: ${f.camera||'[camera]'}. Time/weather: ${f.time||'[time]'}. Duration: ${f.duration||'[duration]'}. Photorealistic, cinematic 4K.`
  },
  {
    id: 'dalle', name: 'DALL-E 3', type: 'IMAGE', emoji: '🤖', color: '#a0ff6a',
    placeholder: 'e.g. futuristic underwater city at night, bioluminescent life, epic scale…',
    tags: ['photorealistic','digital oil painting','concept art','3D render','detailed illustration','overhead view','cross-section','isometric'],
    systemHint: `You are an expert DALL-E 3 prompt engineer. DALL-E 3 reads prompts like a human — write complete narrative sentences.

STRUCTURE:
"A [medium/style] of [subject]..." then build layer by layer.

ALWAYS INCLUDE:
- Medium: "hyperrealistic digital oil painting" / "cinematic Phase One XF IQ4 photograph"
- Subject: proportions, materials, surface qualities, specific colors, scale references
- Composition: "rule of thirds, subject left third, horizon at 35% from bottom"
- Lighting: three-point setup with Kelvin temperatures
- Mood: what feeling should the viewer have?

END EVERY PROMPT WITH:
"Ultra-detailed, professional quality, sharp focus, perfect exposure."`,
    tmplFields: [
      { key: 'medium',   label: 'MEDIUM / STYLE',          ph: 'hyperrealistic digital painting, cinematic concept art' },
      { key: 'subject',  label: 'SUBJECT (full detail)',    ph: 'ancient redwood tree, hollow trunk glowing amber inside' },
      { key: 'setting',  label: 'ENVIRONMENT / SETTING',   ph: 'Pacific Northwest misty forest, fern floor, morning fog' },
      { key: 'lighting', label: 'LIGHTING SETUP',          ph: '3-point: warm 3400K key, cool 7000K rim, soft fill below' },
      { key: 'comp',     label: 'COMPOSITION',             ph: 'centered, extreme low angle looking up, wide 16:9' },
      { key: 'mood',     label: 'MOOD / ATMOSPHERE',       ph: 'ancient, mystical, sacred natural cathedral, awe-inspiring' },
    ],
    tmplFn: (f) => `${f.medium||'A hyperrealistic digital painting'} of ${f.subject||'[subject]'} in ${f.setting||'[setting]'}. Lighting: ${f.lighting||'[lighting]'}. Composition: ${f.comp||'[composition]'}. Mood: ${f.mood||'[mood]'}. Ultra-detailed, professional quality, sharp focus, perfect exposure.`
  },
  {
    id: 'runway', name: 'Runway Gen-3', type: 'VIDEO', emoji: '🛤️', color: '#c35bf9',
    placeholder: 'e.g. liquid mercury morphing into butterfly, abstract macro, iridescent…',
    tags: ['morphing transition','macro close-up','warp distortion','laminar flow','abstract organic','particle system','chromatic aberration','time reversal'],
    systemHint: `You are a visual effects artist and Runway Gen-3 specialist. Runway = visual poetry and transformation.

ALWAYS DESCRIBE:
1. SUBJECT like a materials scientist — molecular surface quality, reflectivity, weight
2. TRANSFORMATION — Runway's superpower: how things morph, flow, dissolve frame by frame
3. MOTION QUALITY: "imperceptibly slow", "violent snap", "elastic deceleration", "laminar flow", "fractal branching"
4. VISUAL STYLE: "extreme macro f/2.8, white studio, single overhead softbox"
5. COLOR: specific hex codes — "cobalt blue #1B3A6B to electric cyan #00F5FF"
6. TEXTURE: "simultaneously solid and liquid — like obsidian that learned to breathe"`,
    tmplFields: [
      { key: 'subject',  label: 'VISUAL SUBJECT (material)', ph: 'liquid mercury sphere, perfectly reflective, studio-lit' },
      { key: 'motion',   label: 'TRANSFORMATION / MOTION',   ph: 'slowly elongates then erupts into suspended micro-droplets' },
      { key: 'physics',  label: 'MOTION QUALITY / PHYSICS',  ph: 'elastic deceleration, gravity-defying, 0.3x slow motion' },
      { key: 'style',    label: 'VISUAL STYLE',              ph: 'extreme macro f/2.8, white studio, single overhead softbox' },
      { key: 'color',    label: 'COLOR + LIGHT PALETTE',     ph: 'cobalt blue #1B3A6B to electric cyan #00F5FF, prismatic edges' },
      { key: 'texture',  label: 'TEXTURE / SURFACE QUALITY', ph: 'simultaneously solid and liquid, breathing obsidian quality' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'}. Motion: ${f.motion||'[motion]'}. Physics: ${f.physics||'[physics]'}. Style: ${f.style||'[style]'}. Colors: ${f.color||'[color]'}. Texture: ${f.texture||'[texture]'}.`
  },
  {
    id: 'chatgpt', name: 'ChatGPT / Claude', type: 'TEXT', emoji: '💬', color: '#6aaeff',
    placeholder: 'e.g. AI assistant that helps doctors write clinical notes faster…',
    tags: ['chain-of-thought','act as expert','few-shot examples','XML tags','JSON output','step-by-step','critique then improve','roleplay persona'],
    systemHint: `You are a world-class LLM prompt engineer for GPT-4, Claude 3.5, and Gemini.

PROMPT ARCHITECTURE:
1. ROLE/PERSONA: "You are [specific expert] with [X years] experience in [field]..." — the more specific, the better
2. CONTEXT: Rich background about the user's situation and needs
3. TASK: Brutally specific — BAD: "write a note" GOOD: "Write a SOAP note, 2-4 sentences per section, standard abbreviations, differential diagnosis ranked by probability"
4. OUTPUT FORMAT: Exact structure — JSON schema, XML tags, markdown headers
5. CONSTRAINTS: What NOT to do, word limits, style rules
6. FEW-SHOT: Include 1-2 examples input→output before the real task
7. CHAIN-OF-THOUGHT: End with "Think step by step. Show reasoning before final answer."`,
    tmplFields: [
      { key: 'role',     label: 'ROLE / PERSONA (specific)',  ph: 'You are a senior UX researcher at Google, 10 years experience' },
      { key: 'context',  label: 'CONTEXT / BACKGROUND',       ph: 'User is a startup founder with no design background' },
      { key: 'task',     label: 'TASK (brutally specific)',    ph: 'Critique this landing page copy and rewrite for conversion' },
      { key: 'format',   label: 'OUTPUT FORMAT',              ph: 'JSON: {issue, severity, original_text, rewrite, reason}' },
      { key: 'rules',    label: 'CONSTRAINTS / RULES',        ph: 'Max 3 rewrites, no jargon, explain every change made' },
      { key: 'cot',      label: 'REASONING STYLE',            ph: 'Think step by step. Show analysis before final answer.' },
    ],
    tmplFn: (f) => `${f.role||'[role]'}.\n\nContext: ${f.context||'[context]'}\n\nTask: ${f.task||'[task]'}\n\nOutput format: ${f.format||'[format]'}\n\nConstraints: ${f.rules||'[rules]'}\n\n${f.cot||'Think step by step. Show reasoning before the final answer.'}`
  },
];

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
let activeTool = TOOLS[0];
let mode = 'both';
let history = [];
let lastInput = '';

try { history = JSON.parse(localStorage.getItem('pc_history') || '[]'); } catch(e) {}

// ════════════════════════════════════════════
// INIT TOOLS
// ════════════════════════════════════════════
const strip = document.getElementById('toolStrip');
TOOLS.forEach(t => {
  const el = document.createElement('div');
  el.className = 'tool-tab' + (t.id === activeTool.id ? ' active' : '');
  el.dataset.id = t.id;
  el.innerHTML = `<span class="t-emoji">${t.emoji}</span><div><span class="t-name">${t.name}</span><span class="t-type">${t.type}</span></div>`;
  el.onclick = () => pickTool(t, el);
  strip.appendChild(el);
});

function pickTool(t, el) {
  activeTool = t;
  document.querySelectorAll('.tool-tab').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('activeBadge').textContent = t.name;
  document.getElementById('kw').placeholder = t.placeholder;
  renderTags();
  renderTmplFields();
  updateTmplPreview();
}

// ════════════════════════════════════════════
// QUICK TAGS
// ════════════════════════════════════════════
function renderTags() {
  const c = document.getElementById('ipTags');
  c.innerHTML = activeTool.tags.map(tg =>
    `<span class="ip-tag" onclick="addTag('${tg.replace(/'/g, "\\'")}')">${tg}</span>`
  ).join('');
}
function addTag(t) {
  const ta = document.getElementById('kw');
  ta.value = ta.value ? ta.value + ', ' + t : t;
  ta.focus();
}
renderTags();

// ════════════════════════════════════════════
// TEMPLATE BUILDER
// ════════════════════════════════════════════
function renderTmplFields() {
  const c = document.getElementById('tmplFields');
  c.innerHTML = activeTool.tmplFields.map(f => `
    <div class="tf-row">
      <label class="tf-lbl">${f.label}</label>
      <input class="tf-input" data-key="${f.key}" placeholder="${f.ph}" oninput="updateTmplPreview()">
    </div>
  `).join('');
}

function updateTmplPreview() {
  const fields = {};
  document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
  const result = activeTool.tmplFn(fields);
  document.getElementById('tmplPreview').innerHTML = result.replace(/\[([^\]]+)\]/g, '<em>[$1]</em>');
}

function useTemplate() {
  const fields = {};
  document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
  const result = activeTool.tmplFn(fields).replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
  if (result) { document.getElementById('kw').value = result; document.getElementById('kw').focus(); }
}

renderTmplFields();
updateTmplPreview();

// ════════════════════════════════════════════
// MODE TOGGLE
// ════════════════════════════════════════════
function setMode(m, btn) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ════════════════════════════════════════════
// GENERATE — calls backend, no API key needed!
// ════════════════════════════════════════════
const STYLE_CLASSES = ['sty-c','sty-a','sty-t','sty-e','sty-m'];
const STYLE_LABELS  = ['CINEMATIC','ARTISTIC','TECHNICAL','EPIC','SURREAL'];

async function generate() {
  const input = document.getElementById('kw').value.trim();
  if (!input) { document.getElementById('kw').focus(); return; }

  const style = document.getElementById('selStyle').value;
  const count = parseInt(document.getElementById('selCount').value);
  const len   = document.getElementById('selLen').value;
  const btn   = document.getElementById('genBtn');

  btn.disabled = true;
  btn.classList.add('loading');
  lastInput = input;

  let aiPrompts   = [];
  let tmplPrompts = [];

  const doAI   = mode !== 'template';
  const doTmpl = mode !== 'ai';

  // ── TEMPLATE PROMPTS (instant) ──
  if (doTmpl) {
    const fields = {};
    document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
    const hasFields = Object.values(fields).some(v => v.length > 0);
    if (hasFields) tmplPrompts.push(activeTool.tmplFn(fields).replace(/\[[^\]]+\]/g, '[?]'));
    tmplPrompts.push(buildKeywordTemplate(input, style));
  }

  // ── AI PROMPTS — calls YOUR backend ──
  if (doAI) {
    try {
      const aiCount    = doTmpl ? Math.max(1, count - tmplPrompts.length) : count;
      const wordTarget = len === 'detailed' ? '150-220' : len === 'medium' ? '80-130' : '40-70';

      const systemPrompt = `You are a world-class AI prompt engineer. Your prompts are used by professional filmmakers, photographers, and artists.

${activeTool.systemHint}

WRITE ${aiCount} ULTRA-DETAILED prompts for ${activeTool.name}.
STYLE: ${style}
WORD COUNT: ${wordTarget} words per prompt MINIMUM
VARIATIONS: Each prompt = completely different creative interpretation

OUTPUT RULES:
- Separate prompts with exactly: ---SPLIT---
- NO numbering, NO labels, NO intro — start first prompt immediately`;

      const userPrompt = `Write ${aiCount} ultra-detailed professional ${activeTool.name} prompts for: "${input}"`;

      // ✅ Call YOUR backend — API key stays hidden on server!
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, userPrompt, count: aiCount })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      aiPrompts = data.text.split('---SPLIT---').map(p => p.trim()).filter(p => p.length > 30);

    } catch (err) {
      renderError(err.message);
      btn.disabled = false;
      btn.classList.remove('loading');
      return;
    }
  }

  const all = [
    ...tmplPrompts.map(text => ({ text, src: 'template' })),
    ...aiPrompts.map(text   => ({ text, src: 'ai' })),
  ];

  if (all.length === 0) {
    renderError('No prompts generated. Please try again.');
    btn.disabled = false; btn.classList.remove('loading');
    return;
  }

  renderPrompts(all, style);
  saveHist(input, all);
  btn.disabled = false;
  btn.classList.remove('loading');
}

function buildKeywordTemplate(input, style) {
  const t = activeTool;
  if (t.type === 'VIDEO') {
    return `${input}. Cinematic ${style.toLowerCase()} aesthetic. Camera: smooth tracking shot with precision depth-of-field rack focus. Lighting: three-point professional setup with atmospheric haze and volumetric rays. Audio: immersive ambient soundscape. Shot on ARRI Alexa 35, anamorphic 2.39:1, 24fps, cinematic grade.`;
  } else if (t.id === 'sd') {
    return `score_9, score_8_up, masterpiece, best quality, 8k uhd, RAW photo, (${input}:1.2), (${style.toLowerCase()} style:1.1), (photorealistic:1.3), (ultra-detailed:1.4), (perfect lighting:1.3), (sharp focus:1.4)\n\nNegative prompt: ugly, deformed, noisy, blurry, low quality, watermark, bad anatomy, extra limbs`;
  } else if (t.type === 'IMAGE') {
    return `${input}. ${style} aesthetic. Rule of thirds composition. Three-point lighting: warm 3400K key, cool 7000K rim, soft fill. Medium format camera, prime lens, wide aperture. Ultra-detailed, award-winning, tack-sharp, perfect exposure.`;
  } else {
    return `You are a world-class expert. Task: ${input}.\n\nApproach with ${style.toLowerCase()} precision. Think step by step. Provide detailed, specific, actionable output with clear sections.`;
  }
}

// ════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════
function renderPrompts(items, style) {
  const wrap  = document.getElementById('outWrap');
  const grid  = document.getElementById('pGrid');
  const badge = document.getElementById('outBadge');
  badge.textContent = `${items.length} result${items.length !== 1 ? 's' : ''}`;
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const cls  = STYLE_CLASSES[i % STYLE_CLASSES.length];
    const lbl  = STYLE_LABELS[i % STYLE_LABELS.length];
    const card = document.createElement('div');
    card.className = 'p-card';
    card.innerHTML = `
      <div class="p-card-hdr">
        <div class="p-num">PROMPT ${i+1} <span class="p-style ${cls}">${lbl}</span></div>
        <button class="cp-btn" onclick="cpOne(this,${i})">📋 Copy</button>
      </div>
      <div class="p-body">
        <div class="p-text" id="pt${i}">${esc(item.text)}</div>
        <div class="p-source">SOURCE: <span class="src-pill ${item.src==='ai'?'src-ai':'src-tmpl'}">${item.src==='ai'?'✦ AI Generated':'⊞ Template Built'}</span></div>
      </div>`;
    grid.appendChild(card);
  });
  wrap.classList.add('show');
  setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function renderError(msg) {
  const grid = document.getElementById('pGrid');
  grid.innerHTML = `<div class="err-card">⚠️ <div><strong>Error:</strong> ${esc(msg)}<br><small style="opacity:.6;margin-top:6px;display:block">Server mein kuch problem aayi. Thodi der baad try karo.</small></div></div>`;
  document.getElementById('outWrap').classList.add('show');
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function cpOne(btn, i) {
  navigator.clipboard.writeText(document.getElementById('pt'+i).textContent).then(() => {
    btn.textContent='✓ Copied'; btn.classList.add('ok');
    setTimeout(() => { btn.textContent='📋 Copy'; btn.classList.remove('ok'); }, 2000);
  });
}

function copyAll() {
  const all = [...document.querySelectorAll('[id^="pt"]')].map(e=>e.textContent).join('\n\n---\n\n');
  navigator.clipboard.writeText(all).then(() => {
    const b = document.querySelector('.act-btn'); b.textContent='✓ Copied!';
    setTimeout(() => b.textContent='📋 Copy All', 2000);
  });
}

function regen() { document.getElementById('kw').value = lastInput; generate(); }

function exportTxt() {
  const tool = activeTool.name;
  const prompts = [...document.querySelectorAll('[id^="pt"]')].map((e,i)=>`PROMPT ${i+1}\n${'─'.repeat(50)}\n${e.textContent}`).join('\n\n');
  const blob = new Blob([`PromptCraft Export — ${tool}\n${'═'.repeat(50)}\n\n${prompts}`],{type:'text/plain'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=`promptcraft-${tool.toLowerCase().replace(/\s/g,'-')}-${Date.now()}.txt`; a.click();
}

// ════════════════════════════════════════════
// HISTORY
// ════════════════════════════════════════════
function saveHist(query, items) {
  history.unshift({ query, tool: activeTool.name, emoji: activeTool.emoji, items, t: Date.now() });
  if (history.length > 30) history = history.slice(0,30);
  try { localStorage.setItem('pc_history', JSON.stringify(history)); } catch(e) {}
  renderHist();
}

function renderHist() {
  if (!history.length) return;
  document.getElementById('histSec').style.display = 'block';
  document.getElementById('histGrid').innerHTML = history.slice(0,9).map((h,i) => `
    <div class="h-card" onclick="loadHist(${i})">
      <div class="h-top"><span class="h-emoji">${h.emoji}</span><div class="h-query">${esc(h.query)}</div></div>
      <div class="h-meta"><span>${h.tool}</span><span>${h.items.length} prompts</span><span>${ago(h.t)}</span></div>
    </div>`).join('');
}

function loadHist(i) { const h=history[i]; document.getElementById('kw').value=h.query; renderPrompts(h.items,'Cinematic'); }
function clearHist() { history=[]; localStorage.removeItem('pc_history'); document.getElementById('histSec').style.display='none'; }
function ago(ts) {
  const s=Math.floor((Date.now()-ts)/1000);
  if(s<60) return 'just now'; if(s<3600) return Math.floor(s/60)+'m ago';
  if(s<86400) return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago';
}
renderHist();

document.getElementById('kw').addEventListener('keydown', e => { if((e.metaKey||e.ctrlKey)&&e.key==='Enter') generate(); });
