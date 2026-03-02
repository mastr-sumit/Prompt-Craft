// ════════════════════════════════════════════
// PromptCraft — AI Prompt Studio
// script.js — With Image/Video Upload Support
// ════════════════════════════════════════════

const TOOLS = [
  {
    id: 'veo3', name: 'Veo 3', type: 'VIDEO', emoji: '🎬', color: '#f95b8e',
    placeholder: 'e.g. surfer riding a massive wave at sunset… (ya image/video upload karo!)',
    tags: ['aerial drone','tracking shot','slow-mo 120fps','golden hour','dolly zoom','handheld shaky','steadicam','POV first-person'],
    systemHint: `You are a world-class cinematographer and AI video prompt engineer specializing in Google Veo 3.
Write ULTRA-DETAILED prompts: [SHOT TYPE] → [SUBJECT detail] → [ACTION] → [ENVIRONMENT] → [CAMERA MOVEMENT] → [LIGHTING with Kelvin] → [ATMOSPHERE] → [COLOR GRADE] → [AUDIO] → [SPECS]
- Always end with: "Shot on ARRI Alexa 35, anamorphic 2.39:1, 24fps, cinematic color grade"
- Include audio description (Veo 3 generates audio)
- Minimum 150 words. Each variation = different director's vision.`,
    tmplFields: [
      { key: 'subject',  label: 'SUBJECT / CHARACTER',   ph: 'weathered 40-year-old fisherman, orange oilskin jacket' },
      { key: 'action',   label: 'ACTION / MOVEMENT',     ph: 'pulling heavy fishing nets from dark churning ocean' },
      { key: 'setting',  label: 'SETTING / ENVIRONMENT', ph: 'Norwegian fjord at dawn, fog-covered cliffs' },
      { key: 'camera',   label: 'CAMERA MOVEMENT',       ph: 'slow crane rising from water level to aerial' },
      { key: 'lighting', label: 'LIGHTING & TIME',       ph: 'pre-dawn blue hour, 6000K, soft diffused' },
      { key: 'mood',     label: 'MOOD / ATMOSPHERE',     ph: 'melancholic, isolated, raw human struggle' },
      { key: 'audio',    label: 'AUDIO / SOUNDS',        ph: 'waves crashing, rope tension, distant foghorn' },
    ],
    tmplFn: (f) => `Cinematic video: ${f.subject||'[subject]'} ${f.action||'[action]'} in ${f.setting||'[setting]'}. Camera: ${f.camera||'[camera]'}. Lighting: ${f.lighting||'[lighting]'}. Mood: ${f.mood||'[mood]'}. Audio: ${f.audio||'[audio]'}. Shot on ARRI Alexa 35, anamorphic 2.39:1, 24fps.`
  },
  {
    id: 'mj', name: 'Midjourney', type: 'IMAGE', emoji: '🎨', color: '#5b6cf9',
    placeholder: 'e.g. ancient temple ruins at dawn, mist, dramatic god rays…',
    tags: ['--ar 16:9','--v 6.1','--style raw','--chaos 25','--stylize 750','hyperrealistic','--weird 500','--no text'],
    systemHint: `You are a master Midjourney v6.1 prompt architect.
STRUCTURE: [SUBJECT detail], [ART STYLE + MEDIUM + 3 ARTIST REFS], [LIGHTING], [CAMERA/LENS], [COLOR PALETTE], [QUALITY BOOSTERS], [PARAMETERS]
- Always 3 artist references minimum
- Lighting: Rembrandt, split, butterfly, chiaroscuro
- Always end with: --ar [ratio] --v 6.1 --style raw --stylize [400-1000] --chaos [0-30]`,
    tmplFields: [
      { key: 'subject',  label: 'MAIN SUBJECT',           ph: 'ancient samurai warrior, scarred face, worn armor' },
      { key: 'style',    label: 'ART STYLE + MEDIUM',     ph: 'oil painting on linen, dark fantasy' },
      { key: 'artists',  label: 'ARTIST REFS (3 min)',    ph: 'Greg Rutkowski, Alphonse Mucha, Frank Frazetta' },
      { key: 'lighting', label: 'LIGHTING SETUP',         ph: 'dramatic chiaroscuro, single torch, deep shadows' },
      { key: 'lens',     label: 'CAMERA / LENS',          ph: 'Hasselblad 100mm, f/2.8, shallow DOF' },
      { key: 'params',   label: 'MJ PARAMETERS',          ph: '--ar 3:4 --v 6.1 --style raw --stylize 800' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'}, ${f.style||'[style]'}, in the style of ${f.artists||'[artists]'}, ${f.lighting||'[lighting]'}, ${f.lens||'[lens]'}, ultra-detailed, masterpiece, 8K ${f.params||'--ar 1:1 --v 6.1 --style raw --stylize 750'}`
  },
  {
    id: 'sd', name: 'Stable Diffusion', type: 'IMAGE', emoji: '🖼️', color: '#5bf9c3',
    placeholder: 'e.g. cyberpunk city market, neon rain reflections…',
    tags: ['score_9','masterpiece','best quality','8k uhd','(sharp focus:1.4)','RAW photo','(photorealistic:1.3)'],
    systemHint: `You are an expert Stable Diffusion XL prompt engineer.
Always start with: "score_9, score_8_up, masterpiece, best quality, ultra highres, RAW photo, 8k uhd"
Use weight syntax: (word:1.1-1.5) for important elements.
Always include detailed negative prompt at the end prefixed with "Negative prompt:"`,
    tmplFields: [
      { key: 'quality',  label: 'QUALITY TAGS',          ph: 'score_9, masterpiece, best quality, 8k uhd, RAW photo' },
      { key: 'subject',  label: 'SUBJECT WITH WEIGHTS',  ph: '(beautiful woman:1.0), (green eyes:1.3)' },
      { key: 'style',    label: 'STYLE + MEDIUM',        ph: '(photorealistic:1.3), cinematic photography' },
      { key: 'lighting', label: 'LIGHTING',              ph: '(golden hour:1.3), (volumetric rays:1.2)' },
      { key: 'camera',   label: 'CAMERA / LENS',         ph: '(85mm lens:1.2), (f/1.4:1.2), (shallow DOF:1.3)' },
      { key: 'negative', label: 'NEGATIVE PROMPT',       ph: 'ugly, deformed, blurry, watermark, bad anatomy' },
    ],
    tmplFn: (f) => `${f.quality||'score_9, masterpiece, best quality, 8k uhd'}, ${f.subject||'[subject]'}, ${f.style||'[style]'}, ${f.lighting||'[lighting]'}, ${f.camera||'[camera]'}\n\nNegative prompt: ${f.negative||'ugly, deformed, noisy, blurry, watermark, bad anatomy'}`
  },
  {
    id: 'flux', name: 'Flux / NanoBanana', type: 'IMAGE', emoji: '⚡', color: '#f9c35b',
    placeholder: 'e.g. cozy rainy Japanese café, warm light, film grain…',
    tags: ['photorealistic','35mm film grain','bokeh','Leica M6','Kodak Portra 400','editorial photography'],
    systemHint: `You are a master photographer and Flux model specialist. Write flowing descriptive prose.
Always include: camera body, lens, film stock/look, lighting ratio with Kelvin temp, specific color palette names, emotional mood.
Write like a photographer briefing a creative team — full sentences, immersive detail.`,
    tmplFields: [
      { key: 'subject',  label: 'SUBJECT (obsessive detail)', ph: '35-year-old woman, reading, ink-stained fingers' },
      { key: 'setting',  label: 'SETTING',                   ph: 'small Kyoto bookshop, wooden shelves' },
      { key: 'lighting', label: 'LIGHTING (technical)',       ph: 'north window, 5600K diffused, 3:1 ratio' },
      { key: 'camera',   label: 'CAMERA + FILM',             ph: 'Leica M6, 50mm f/1.4, Kodak Portra 400' },
      { key: 'palette',  label: 'COLOR PALETTE',             ph: 'muted sage, warm cream, dusty gold' },
      { key: 'mood',     label: 'MOOD',                      ph: 'quiet solitude, stolen moment, nostalgia' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'} in ${f.setting||'[setting]'}. Lighting: ${f.lighting||'[lighting]'}. ${f.camera||'[camera]'}. Colors: ${f.palette||'[palette]'}. Mood: ${f.mood||'[mood]'}.`
  },
  {
    id: 'sora', name: 'Sora', type: 'VIDEO', emoji: '🎥', color: '#ff9f6a',
    placeholder: 'e.g. paper boat sailing flooded Venice at dusk…',
    tags: ['realistic physics','seamless loop','4K cinematic','wide establishing','slow push-in','physics simulation'],
    systemHint: `You are an elite Sora prompt engineer. Sora excels at realistic physics and cinematic storytelling.
Structure: 1) Wide establishing scene 2) Subject with narrative 3) Physics/motion detail 4) Camera choreography 5) Temporal changes 6) Sensory feeling`,
    tmplFields: [
      { key: 'scene',    label: 'OPENING SCENE',    ph: 'fog-draped Alps bridge, 6am, glacial river' },
      { key: 'subject',  label: 'SUBJECT',          ph: 'young woman, mustard jacket, gripping railing' },
      { key: 'physics',  label: 'MOTION DETAIL',    ph: 'jacket rippling, river churning, spray in light' },
      { key: 'camera',   label: 'CAMERA',           ph: 'water-level push from 40ft, rising under arch' },
      { key: 'time',     label: 'TIME / WEATHER',   ph: 'early morning, 6600K overcast, light drizzle' },
      { key: 'duration', label: 'DURATION',         ph: '8-second slow sequence, 24fps, no cuts' },
    ],
    tmplFn: (f) => `${f.scene||'[scene]'}. Subject: ${f.subject||'[subject]'}. Motion: ${f.physics||'[physics]'}. Camera: ${f.camera||'[camera]'}. Time: ${f.time||'[time]'}. Duration: ${f.duration||'[duration]'}. Cinematic 4K.`
  },
  {
    id: 'dalle', name: 'DALL-E 3', type: 'IMAGE', emoji: '🤖', color: '#a0ff6a',
    placeholder: 'e.g. futuristic underwater city at night, bioluminescent…',
    tags: ['photorealistic','digital oil painting','concept art','3D render','cross-section','isometric'],
    systemHint: `You are an expert DALL-E 3 prompt engineer. Write complete narrative sentences.
Always include: medium/style, subject detail with materials and colors, composition (rule of thirds), three-point lighting with Kelvin temps, mood.
End every prompt with: "Ultra-detailed, professional quality, sharp focus, perfect exposure."`,
    tmplFields: [
      { key: 'medium',   label: 'MEDIUM / STYLE',   ph: 'hyperrealistic digital painting, concept art' },
      { key: 'subject',  label: 'SUBJECT (detail)',  ph: 'ancient redwood, hollow trunk glowing amber' },
      { key: 'setting',  label: 'SETTING',          ph: 'Pacific Northwest forest, fern floor, fog' },
      { key: 'lighting', label: 'LIGHTING',         ph: '3-point: warm 3400K key, cool 7000K rim, fill' },
      { key: 'comp',     label: 'COMPOSITION',      ph: 'centered, extreme low angle, wide 16:9' },
      { key: 'mood',     label: 'MOOD',             ph: 'ancient, mystical, sacred, awe-inspiring' },
    ],
    tmplFn: (f) => `${f.medium||'A hyperrealistic digital painting'} of ${f.subject||'[subject]'} in ${f.setting||'[setting]'}. Lighting: ${f.lighting||'[lighting]'}. Composition: ${f.comp||'[composition]'}. Mood: ${f.mood||'[mood]'}. Ultra-detailed, sharp focus, perfect exposure.`
  },
  {
    id: 'runway', name: 'Runway Gen-3', type: 'VIDEO', emoji: '🛤️', color: '#c35bf9',
    placeholder: 'e.g. liquid mercury morphing into butterfly, macro, iridescent…',
    tags: ['morphing','macro close-up','warp distortion','laminar flow','abstract organic','chromatic aberration'],
    systemHint: `You are a visual effects artist and Runway Gen-3 specialist. Runway = visual poetry.
Always describe: subject like a materials scientist, transformation with frame-by-frame detail, motion quality (laminar/turbulent/elastic), visual style, specific hex colors, surface texture poetically.`,
    tmplFields: [
      { key: 'subject',  label: 'VISUAL SUBJECT',   ph: 'liquid mercury sphere, perfectly reflective' },
      { key: 'motion',   label: 'TRANSFORMATION',   ph: 'slowly elongates, erupts into micro-droplets' },
      { key: 'physics',  label: 'MOTION QUALITY',   ph: 'elastic deceleration, gravity-defying, 0.3x slow' },
      { key: 'style',    label: 'VISUAL STYLE',     ph: 'extreme macro f/2.8, white studio, softbox' },
      { key: 'color',    label: 'COLOR PALETTE',    ph: 'cobalt #1B3A6B to electric cyan #00F5FF' },
      { key: 'texture',  label: 'SURFACE QUALITY',  ph: 'simultaneously solid and liquid, breathing obsidian' },
    ],
    tmplFn: (f) => `${f.subject||'[subject]'}. Motion: ${f.motion||'[motion]'}. Physics: ${f.physics||'[physics]'}. Style: ${f.style||'[style]'}. Colors: ${f.color||'[color]'}. Texture: ${f.texture||'[texture]'}.`
  },
  {
    id: 'chatgpt', name: 'ChatGPT / Claude', type: 'TEXT', emoji: '💬', color: '#6aaeff',
    placeholder: 'e.g. AI assistant that helps doctors write clinical notes…',
    tags: ['chain-of-thought','act as expert','few-shot examples','JSON output','step-by-step','XML tags'],
    systemHint: `You are a world-class LLM prompt engineer for GPT-4, Claude, and Gemini.
Always include: specific role/persona, rich context, brutally specific task, exact output format (JSON/XML/markdown), constraints, chain-of-thought trigger.
End with: "Think step by step. Show reasoning before final answer."`,
    tmplFields: [
      { key: 'role',     label: 'ROLE / PERSONA',   ph: 'You are a senior UX researcher, 10 years exp' },
      { key: 'context',  label: 'CONTEXT',          ph: 'User is a startup founder, no design background' },
      { key: 'task',     label: 'TASK (specific)',   ph: 'Critique landing page copy, rewrite for conversion' },
      { key: 'format',   label: 'OUTPUT FORMAT',    ph: 'JSON: {issue, severity, original, rewrite, reason}' },
      { key: 'rules',    label: 'CONSTRAINTS',      ph: 'Max 3 rewrites, no jargon, explain every change' },
      { key: 'cot',      label: 'REASONING',        ph: 'Think step by step. Show analysis first.' },
    ],
    tmplFn: (f) => `${f.role||'[role]'}.\n\nContext: ${f.context||'[context]'}\n\nTask: ${f.task||'[task]'}\n\nOutput: ${f.format||'[format]'}\n\nRules: ${f.rules||'[rules]'}\n\n${f.cot||'Think step by step.'}`
  },
];

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
let activeTool    = TOOLS[0];
let mode          = 'both';
let history       = [];
let lastInput     = '';
let uploadedMedia = null;  // { base64, type, name, analysis }

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
  document.getElementById('ipTags').innerHTML = activeTool.tags.map(tg =>
    `<span class="ip-tag" onclick="addTag('${tg.replace(/'/g,"\\'")}')">${tg}</span>`
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
  document.getElementById('tmplFields').innerHTML = activeTool.tmplFields.map(f => `
    <div class="tf-row">
      <label class="tf-lbl">${f.label}</label>
      <input class="tf-input" data-key="${f.key}" placeholder="${f.ph}" oninput="updateTmplPreview()">
    </div>`).join('');
}
function updateTmplPreview() {
  const fields = {};
  document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
  document.getElementById('tmplPreview').innerHTML =
    activeTool.tmplFn(fields).replace(/\[([^\]]+)\]/g, '<em>[$1]</em>');
}
function useTemplate() {
  const fields = {};
  document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
  const result = activeTool.tmplFn(fields).replace(/\[[^\]]+\]/g,'').replace(/\s+/g,' ').trim();
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
// MEDIA UPLOAD
// ════════════════════════════════════════════
const uploadZone = document.getElementById('uploadZone');

// Drag & Drop support
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
});

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  // Size check — 20MB max
  if (file.size > 20 * 1024 * 1024) {
    alert('File too large! Maximum size is 20MB.');
    return;
  }

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  if (!isVideo && !isImage) {
    alert('Sirf images (JPG, PNG, GIF) aur videos (MP4, MOV, WEBM) support hote hain!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target.result.split(',')[1]; // remove data:... prefix

    uploadedMedia = { base64, type: file.type, name: file.name, analysis: null };

    // Preview show karo
    showPreview(file, e.target.result, isVideo);

    // Turant Gemini se analyze karwao
    analyzeMedia(base64, file.type, file.name);
  };
  reader.readAsDataURL(file);
}

function showPreview(file, dataUrl, isVideo) {
  document.getElementById('previewFileName').textContent = file.name;
  document.getElementById('previewType').textContent = isVideo ? 'VIDEO' : 'IMAGE';

  const container = document.getElementById('previewContainer');
  if (isVideo) {
    container.innerHTML = `<video class="preview-media-video" controls src="${dataUrl}"></video>`;
  } else {
    container.innerHTML = `<img class="preview-media" src="${dataUrl}" alt="preview">`;
  }

  document.getElementById('mediaPreview').classList.add('show');
  document.getElementById('analysisStatus').style.display = 'flex';
  setAnalysisStatus('analyzing', '🔍 Gemini vision se analyze ho raha hai...');
}

function removeMedia() {
  uploadedMedia = null;
  document.getElementById('mediaPreview').classList.remove('show');
  document.getElementById('mediaInput').value = '';
  document.getElementById('previewContainer').innerHTML = '';
}

function setAnalysisStatus(state, message) {
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  dot.className  = `status-dot ${state}`;
  text.className = `status-text ${state}`;
  text.textContent = message;
}

async function analyzeMedia(base64, mediaType, fileName) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaBase64: base64,
        mediaType:   mediaType,
        toolName:    activeTool.name
      })
    });

    const data = await res.json();

    if (data.error) {
      setAnalysisStatus('error', '❌ Analysis failed: ' + data.error);
      uploadedMedia.analysis = null;
      return;
    }

    uploadedMedia.analysis = data.analysis;
    setAnalysisStatus('done', '✅ Visual style analyzed! Generate dabao.');

  } catch (err) {
    setAnalysisStatus('error', '❌ Network error — analysis skip ho jayegi');
    uploadedMedia.analysis = null;
  }
}

// ════════════════════════════════════════════
// GENERATE
// ════════════════════════════════════════════
const STYLE_CLASSES = ['sty-c','sty-a','sty-t','sty-e','sty-m'];
const STYLE_LABELS  = ['CINEMATIC','ARTISTIC','TECHNICAL','EPIC','SURREAL'];

async function generate() {
  const input  = document.getElementById('kw').value.trim();
  const hasMedia = uploadedMedia && uploadedMedia.analysis;

  // Text ya media — koi ek toh hona chahiye
  if (!input && !hasMedia) {
    document.getElementById('kw').focus();
    return;
  }

  // Agar analysis abhi chal rahi hai toh wait karo
  if (uploadedMedia && !uploadedMedia.analysis && uploadedMedia.analysis !== null) {
    renderError('Please wait — media is still being analyzed...');
    return;
  }

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

  // ── TEMPLATE PROMPTS ──
  if (doTmpl) {
    const fields = {};
    document.querySelectorAll('.tf-input').forEach(inp => { fields[inp.dataset.key] = inp.value.trim(); });
    const hasFields = Object.values(fields).some(v => v.length > 0);
    if (hasFields) tmplPrompts.push(activeTool.tmplFn(fields).replace(/\[[^\]]+\]/g,'[?]'));
    if (input) tmplPrompts.push(buildKeywordTemplate(input, style));
  }

  // ── AI PROMPTS via Backend ──
  if (doAI) {
    try {
      const aiCount    = doTmpl ? Math.max(1, count - tmplPrompts.length) : count;
      const wordTarget = len === 'detailed' ? '150-220' : len === 'medium' ? '80-130' : '40-70';

      // Agar media upload hua hai toh uska context add karo
      const mediaContext = hasMedia
        ? `\nThe user has uploaded a reference ${uploadedMedia.type.startsWith('video/') ? 'video' : 'image'}. Generate prompts that MATCH ITS VISUAL STYLE closely.`
        : '';

      const systemPrompt = `You are a world-class AI prompt engineer. Your prompts are used by professional filmmakers and artists.

${activeTool.systemHint}${mediaContext}

Write ${aiCount} ULTRA-DETAILED prompts for ${activeTool.name}.
STYLE: ${style}
WORD COUNT: ${wordTarget} words minimum per prompt
VARIATIONS: Each prompt = completely different creative angle

OUTPUT RULES:
- Separate prompts with exactly: ---SPLIT---
- NO numbering, NO labels — start first prompt immediately`;

      const userContent = hasMedia
        ? `Create ${aiCount} ultra-detailed ${activeTool.name} prompts${input ? ` for: "${input}"` : ''} that closely match the uploaded ${uploadedMedia.type.startsWith('video/') ? 'video' : 'image'} style.`
        : `Create ${aiCount} ultra-detailed ${activeTool.name} prompts for: "${input}"`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt:    userContent,
          visualAnalysis: hasMedia ? uploadedMedia.analysis : null
        })
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

  if (!all.length) {
    renderError('No prompts generated. Please try again.');
    btn.disabled = false; btn.classList.remove('loading');
    return;
  }

  renderPrompts(all, style);
  saveHist(input || '📎 Media upload', all);
  btn.disabled = false;
  btn.classList.remove('loading');
}

function buildKeywordTemplate(input, style) {
  const t = activeTool;
  if (t.type === 'VIDEO') {
    return `${input}. Cinematic ${style.toLowerCase()} aesthetic. Smooth tracking shot, precision depth-of-field. Three-point lighting with atmospheric haze. Immersive audio soundscape. ARRI Alexa 35, anamorphic 2.39:1, 24fps.`;
  } else if (t.id === 'sd') {
    return `score_9, score_8_up, masterpiece, best quality, 8k uhd, RAW photo, (${input}:1.2), (${style.toLowerCase()}:1.1), (photorealistic:1.3), (ultra-detailed:1.4), (sharp focus:1.4)\n\nNegative prompt: ugly, deformed, blurry, watermark, bad anatomy`;
  } else if (t.type === 'IMAGE') {
    return `${input}. ${style} aesthetic. Rule of thirds composition. Three-point lighting: warm 3400K key, cool 7000K rim, soft fill. Medium format camera, prime lens, wide aperture. Ultra-detailed, award-winning, sharp focus.`;
  } else {
    return `You are a world-class expert. Task: ${input}.\n\nApproach with ${style.toLowerCase()} precision. Think step by step. Provide detailed, actionable output with clear sections.`;
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
  setTimeout(() => wrap.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

function renderError(msg) {
  document.getElementById('pGrid').innerHTML = `<div class="err-card">⚠️ <div><strong>Error:</strong> ${esc(msg)}<br><small style="opacity:.6;margin-top:6px;display:block">Thodi der baad try karo.</small></div></div>`;
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
    setTimeout(()=> b.textContent='📋 Copy All', 2000);
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
  history.unshift({ query, tool:activeTool.name, emoji:activeTool.emoji, items, t:Date.now() });
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

document.getElementById('kw').addEventListener('keydown', e => {
  if((e.metaKey||e.ctrlKey)&&e.key==='Enter') generate();
});
