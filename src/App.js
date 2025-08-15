import React, { useEffect, useMemo, useRef, useState } from "react";

// ------------------------------------------------------------
// Generative Architecture — Single-File React App
// - Tailwind CSS for styling (UI is responsive & modern)
// - Animated generative canvas (pure Canvas API)
// - Controls: complexity, density, speed, stroke, palette
// - Presets: load / save / share via URL & localStorage
// - Actions: Export PNG, Randomize
// - Dark Mode persisted
// ------------------------------------------------------------

// ---------- Utilities ----------
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const rand = (min = 0, max = 1) => Math.random() * (max - min) + min;
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return (h >>> 0).toString(36);
};

// Generate a palette from a base hue
const makePalette = (h: number) => [
  `hsl(${h}, 85%, 60%)`,
  `hsl(${(h + 40) % 360}, 85%, 60%)`,
  `hsl(${(h + 80) % 360}, 85%, 60%)`,
  `hsl(${(h + 200) % 360}, 85%, 65%)`,
  `hsl(${(h + 320) % 360}, 85%, 65%)`,
];

// Nice curated palettes
const CURATED = [
  { name: "Aurora", colors: ["#7BDFF2", "#B2F7EF", "#EFF7F6", "#F7D6E0", "#F2B5D4"] },
  { name: "Sunset", colors: ["#ff9a8b", "#ff6a88", "#ff99ac", "#fad0c4", "#ffd1ff"] },
  { name: "Midnight", colors: ["#1f2937", "#111827", "#3b82f6", "#06b6d4", "#22d3ee"] },
  { name: "Forest", colors: ["#0b6e4f", "#2dd4bf", "#34d399", "#fcd34d", "#ef4444"] },
  { name: "Ghibli", colors: ["#88D1C3", "#F6E7CB", "#F4A259", "#5B8E7D", "#BC4B51"] },
];

// Default settings
const DEFAULTS = {
  complexity: 0.55, // 0..1
  density: 0.45, // 0..1
  speed: 0.6, // 0..1
  stroke: 0.5, // 0..1
  hue: 210, // base hue for dynamic palette
  curated: "Aurora" || null,
  seed: 12345,
};

type Settings = typeof DEFAULTS;

type Preset = Settings & { id: string; title: string; date: number };

// ---------- Main Component ----------
export default function App() {
  // Theme
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("ga_theme");
    return saved ? saved === "dark" : true;
  });

  // Settings state
  const [settings, setSettings] = useState<Settings>(() => {
    const urlParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const fromURL = urlParams.get("preset");
    if (fromURL) {
      try {
        const json = atob(fromURL);
        const parsed = JSON.parse(json);
        return { ...DEFAULTS, ...parsed };
      } catch {}
    }
    const saved = localStorage.getItem("ga_settings");
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  });

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Derived palette
  const palette = useMemo(() => {
    if (settings.curated) {
      const cur = CURATED.find((p) => p.name === settings.curated) || CURATED[0];
      return cur.colors;
    }
    return makePalette(settings.hue);
  }, [settings.curated, settings.hue]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem("ga_settings", JSON.stringify(settings));
  }, [settings]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem("ga_theme", dark ? "dark" : "light");
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Resize canvas to DPR
  const fitCanvas = () => {
    const c = canvasRef.current!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = c.getBoundingClientRect();
    c.width = Math.floor(rect.width * dpr);
    c.height = Math.floor(rect.height * dpr);
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Simple seeded PRNG (Mulberry32)
  function createPRNG(seed: number) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Generative field function
  const field = (x: number, y: number, t: number, rnd: () => number) => {
    // Smooth layered sin/cos + slight randomness per seed
    const k1 = 2 + settings.complexity * 8;
    const k2 = 0.5 + settings.density * 2.5;
    const s = Math.sin(x * k2 + t * (0.5 + settings.speed)) + Math.cos(y * k2 * 1.1 - t * (0.4 + settings.speed * 0.8));
    const n = (rnd() - 0.5) * 0.3; // seed flicker
    return Math.sin(s * k1 + n);
  };

  // Animation loop
  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let running = true;
    fitCanvas();

    const rnd = createPRNG(settings.seed || 1);

    const draw = () => {
      if (!running) return;
      const rect = c.getBoundingClientRect();
      const w = rect.width; const h = rect.height;

      // Background
      const bg = dark ? "#0b0f1a" : "#f8fafc";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Centered grid of flow lines
      const cols = Math.floor(40 + settings.density * 160);
      const rows = Math.floor(24 + settings.density * 120);
      const margin = 24;
      const gw = w - margin * 2;
      const gh = h - margin * 2;
      const dx = gw / (cols - 1);
      const dy = gh / (rows - 1);

      // Drawing parameters
      const baseAlpha = clamp(0.05 + settings.stroke * 0.35, 0.05, 0.5);
      const lw = clamp(0.4 + settings.stroke * 2.2, 0.4, 2.6);
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Animated time
      timeRef.current += 0.005 + settings.speed * 0.01;
      const t = timeRef.current;

      // Multicolour passes
      const passes = palette.length;
      for (let p = 0; p < passes; p++) {
        ctx.strokeStyle = palette[p];
        ctx.globalAlpha = baseAlpha * (1 - p / (passes * 1.2));
        for (let i = 0; i < cols; i++) {
          ctx.beginPath();
          for (let j = 0; j < rows; j++) {
            const x = margin + i * dx;
            const y = margin + j * dy;
            const f = field(i / cols, j / rows, t + p * 0.2, rnd);
            const ox = Math.cos(f * Math.PI * 2) * 10 * (0.5 + settings.complexity);
            const oy = Math.sin(f * Math.PI * 2) * 10 * (0.5 + settings.complexity);
            if (j === 0) ctx.moveTo(x + ox, y + oy);
            else ctx.lineTo(x + ox, y + oy);
          }
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => fitCanvas();
    window.addEventListener("resize", onResize);
    draw();

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [settings, dark]);

  // Controls handlers
  const update = (k: keyof Settings, v: number | string | null) => {
    setSettings((s) => ({ ...s, [k]: v } as Settings));
  };

  const randomize = () => {
    const curated = Math.random() < 0.6 ? CURATED[Math.floor(rand(0, CURATED.length))].name : null;
    setSettings((s) => ({
      ...s,
      complexity: rand(0.2, 0.9),
      density: rand(0.2, 0.9),
      speed: rand(0.1, 0.9),
      stroke: rand(0.2, 0.9),
      hue: Math.floor(rand(0, 360)),
      curated,
      seed: Math.floor(rand(1, 10_000_000)),
    }));
  };

  const exportPNG = () => {
    const c = canvasRef.current!;
    const link = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `generative-architecture-${stamp}.png`;
    link.href = c.toDataURL("image/png", 1.0);
    link.click();
  };

  const makeShare = () => {
    const minimal = { ...settings };
    const encoded = btoa(JSON.stringify(minimal));
    const url = `${location.origin}${location.pathname}#preset=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard! ✨");
  };

  // Presets (local)
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem("ga_presets");
    return saved ? JSON.parse(saved) : [];
  });

  const savePreset = () => {
    const id = hash(JSON.stringify(settings) + Date.now());
    const title = prompt("Give this preset a name:", "My Preset");
    if (!title) return;
    const p: Preset = { id, title, date: Date.now(), ...(settings as Settings) };
    const next = [p, ...presets].slice(0, 24);
    setPresets(next);
    localStorage.setItem("ga_presets", JSON.stringify(next));
  };

  const loadPreset = (p: Preset) => setSettings({
    complexity: p.complexity,
    density: p.density,
    speed: p.speed,
    stroke: p.stroke,
    hue: p.hue,
    curated: p.curated,
    seed: p.seed,
  });

  const removePreset = (id: string) => {
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    localStorage.setItem("ga_presets", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100 transition-colors">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/40 dark:supports-[backdrop-filter]:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 shadow-inner" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Generative Architecture</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">playground · gallery · export</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm hover:shadow-sm active:scale-[.98] transition"
              aria-label="Toggle theme"
            >
              {dark ? "🌙 Dark" : "☀️ Light"}
            </button>
            <a
              href="#about"
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm hover:shadow-sm"
            >About</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-10 grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Canvas area */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white/60 dark:bg-slate-900/60">
          <div className="relative aspect-[16/10]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur">Live Canvas</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 backdrop-blur">Generative Flow</span>
            </div>
            <div className="absolute right-4 bottom-4 flex flex-wrap items-center gap-2">
              <button onClick={exportPNG} className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm shadow hover:opacity-90">Export PNG</button>
              <button onClick={makeShare} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white/80 dark:bg-slate-900/70 backdrop-blur">Copy Share Link</button>
              <button onClick={randomize} className="px-3 py-2 rounded-xl border border-transparent text-sm bg-gradient-to-r from-indigo-500 to-emerald-400 text-white shadow hover:opacity-95">Randomize ✨</button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <aside className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 bg-white/70 dark:bg-slate-900/60">
          <h2 className="text-base font-semibold mb-4">Controls</h2>
          <div className="space-y-5">
            <Slider label="Complexity" value={settings.complexity} onChange={(v) => update("complexity", v)} />
            <Slider label="Density" value={settings.density} onChange={(v) => update("density", v)} />
            <Slider label="Speed" value={settings.speed} onChange={(v) => update("speed", v)} />
            <Slider label="Stroke" value={settings.stroke} onChange={(v) => update("stroke", v)} />

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium">Palette</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CURATED.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => update("curated", p.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs border ${settings.curated === p.name ? "border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700"}`}
                    >{p.name}</button>
                  ))}
                  <button
                    onClick={() => update("curated", null)}
                    className={`px-3 py-1.5 rounded-xl text-xs border ${settings.curated === null ? "border-slate-900 dark:border-white" : "border-slate-300 dark:border-slate-700"}`}
                  >Dynamic</button>
                </div>
              </div>

              {settings.curated === null && (
                <div className="col-span-2">
                  <label className="text-sm font-medium">Base Hue</label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="range" min={0} max={360} value={settings.hue} onChange={(e) => update("hue", Number(e.target.value))} className="w-full" />
                    <div className="w-10 h-6 rounded-md border border-slate-300 dark:border-slate-700" style={{ background: `hsl(${settings.hue}, 85%, 60%)` }} />
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <label className="text-sm font-medium">Seed</label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="number" value={settings.seed} onChange={(e) => update("seed", Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-transparent border border-slate-300 dark:border-slate-700" />
                  <button onClick={() => update("seed", Math.floor(rand(1, 10_000_000)))} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm">Shuffle</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={savePreset} className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm">Save Preset</button>
              <button onClick={() => setPresets([]) || localStorage.removeItem("ga_presets")} className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm">Clear All</button>
            </div>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Your Presets</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Click to load · right side menu to save</p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Stored locally on this device</div>
        </div>
        {presets.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl p-6 text-center">
            No presets yet. Tweak the controls, then hit <span className="font-medium">Save Preset</span>.
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presets.map((p) => (
              <li key={p.id} className="group relative">
                <button
                  onClick={() => loadPreset(p)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left bg-white/60 dark:bg-slate-900/60 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate pr-2">{p.title}</div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(p.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3 flex gap-1">
                    {(p.curated ? (CURATED.find((c) => c.name === p.curated)?.colors || []) : makePalette(p.hue)).slice(0,5).map((c, i) => (
                      <span key={i} className="h-6 flex-1 rounded-md border border-slate-200 dark:border-slate-800" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Spec label="Complexity" v={p.complexity} />
                    <Spec label="Density" v={p.density} />
                    <Spec label="Speed" v={p.speed} />
                    <Spec label="Stroke" v={p.stroke} />
                  </div>
                </button>
                <button
                  onClick={() => removePreset(p.id)}
                  className="absolute -top-2 -right-2 px-2.5 py-1.5 rounded-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove preset"
                >✕</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* About */}
      <footer id="about" className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">What is this?</h4>
            <p className="mt-2">A lightweight generative art playground built with React + Canvas. Tweak parameters, save your presets, export PNGs, and share links that reconstruct the exact scene.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Tips</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Use <span className="font-medium">Randomize</span> to discover happy accidents.</li>
              <li>Switch to <span className="font-medium">Dynamic</span> palette, then move the <span className="font-medium">Hue</span> slider.</li>
              <li>Increase <span className="font-medium">Stroke</span> for stronger, bolder lines.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Keyboard</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><kbd className="px-1.5 py-0.5 rounded border">R</kbd> — Randomize</li>
              <li><kbd className="px-1.5 py-0.5 rounded border">E</kbd> — Export PNG</li>
              <li><kbd className="px-1.5 py-0.5 rounded border">D</kbd> — Toggle Dark</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pb-8">© {new Date().getFullYear()} Generative Architecture</div>
      </footer>

      <Keybind onExport={exportPNG} onRandomize={randomize} onDark={() => setDark((d) => !d)} />
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function Spec({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 bg-white/50 dark:bg-slate-900/40">
      <span>{label}</span>
      <span className="tabular-nums">{v.toFixed(2)}</span>
    </div>
  );
}

function Keybind({ onExport, onRandomize, onDark }: { onExport: () => void; onRandomize: () => void; onDark: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e") onExport();
      if (e.key.toLowerCase() === "r") onRandomize();
      if (e.key.toLowerCase() === "d") onDark();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExport, onRandomize, onDark]);
  return null;
}
