"use client";

import { useState, type ReactNode } from "react";


/* Design tokens (sampled from the app screenshots)
   page bg     #f8f9fb   app background + canvas
   surface     #ffffff   cards, header, nodes
   border      #e5e7eb   card + header borders
   text        #1c2230   headings
   muted       #6b7280   secondary text
   primary     #6366f1   buttons (hover #5558e8)
   handle      #eef1f8   node connector fill, #cfd5e3 stroke
   edge        #a8adb8   canvas wires
*/

const NAV_LINKS = [
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "How it runs", href: "#how-it-runs" },
  { label: "Stack", href: "#stack" },
];

const LOGIN = "http://localhost:3000/login";
const SIGNUP = "http://localhost:3000/signup";

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium font-sans whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366f1]";
const BTN_PRIMARY = "bg-[#6366f1] text-white hover:bg-[#5558e8]";
const BTN_OUTLINE =
  "bg-white text-[#1c2230] border border-[#e5e7eb] hover:bg-[#f3f4f8]";
const CARD = "rounded-xl border border-[#e5e7eb] bg-white";
const EYEBROW = "mb-3 text-sm font-medium text-[#6366f1]";

// ---------------------------------------------------------------------------
// Icons (lucide-style paths, inlined so no extra dependency is required)
// ---------------------------------------------------------------------------

const ICONS: Record<string, ReactNode> = {
  workflow: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  sparkles: (
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  panel: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  save: (
    <>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </>
  ),
  flask: (
    <>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </>
  ),
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
};

function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: keyof typeof ICONS;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    icon: "workflow",
    title: "Visual node canvas",
    body: "Drag, connect, and arrange nodes on an infinite canvas. Every action, trigger, and condition is a block you can see and rewire in seconds.",
  },
  {
    icon: "shield",
    title: "Type-safe API layer",
    body: "Every call between client and server is checked end to end with tRPC and Prisma — no runtime surprises when a workflow ships to production.",
  },
  {
    icon: "refresh",
    title: "Reliable background execution",
    body: "Inngest drives orchestration and retries, so long-running workflows and scheduled jobs finish even when an individual step fails.",
  },
  {
    icon: "sparkles",
    title: "Generate workflows from a prompt",
    body: "Describe what you want automated in plain language. The AI SDK turns that description into a configured, connected node graph.",
  },
  {
    icon: "history",
    title: "Execution monitoring",
    body: "Every run leaves a trace. Inspect inputs, outputs, and failures node by node, and re-run from the exact step that broke.",
  },
  {
    icon: "lock",
    title: "Secure by default",
    body: "Authentication, session handling, and a protected API layer are built in from the first request — no bolt-on auth later.",
  },
];

const PIPELINE_STEPS = [
  {
    id: "1",
    title: "Trigger fires",
    body: "A webhook lands, a schedule ticks, or a teammate clicks run. FlowXcore picks up the event the instant it happens.",
  },
  {
    id: "2",
    title: "Nodes execute in order",
    body: "Each connected node runs in sequence, passing its output forward as the input to the next — actions, conditions, transforms.",
  },
  {
    id: "3",
    title: "Inngest orchestrates",
    body: "Retries, delays, and parallel branches are handled by Inngest in the background, so a slow API call never blocks the rest.",
  },
  {
    id: "4",
    title: "Result lands",
    body: "The final node delivers the outcome — a message sent, a record updated, a file generated — and the run is logged for review.",
  },
];

const STACK = [
  { name: "Next.js", role: "App Router, server actions" },
  { name: "TypeScript", role: "End-to-end type safety" },
  { name: "tRPC", role: "Type-safe API layer" },
  { name: "Prisma", role: "Database ORM" },
  { name: "PostgreSQL", role: "Primary data store" },
  { name: "Inngest", role: "Background jobs & orchestration" },
  { name: "AI SDK", role: "Natural-language workflow generation" },
  { name: "Tailwind CSS", role: "Styling system" },
  { name: "Shadcn UI", role: "Component primitives" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#f8f9fb] font-sans text-[#1c2230] antialiased">
      <KeyframeStyles />
      <DotBackdrop />
      <Nav />
      <Hero />
      <StackStrip />
      <Features />
      <HowItRuns />
      <AiCallout />
      <Stack />
      <FinalCta />
      <Footer />
    </main>
  );
}

function KeyframeStyles() {
  return (
    <style>{`
      @keyframes fx-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
      }
    `}</style>
  );
}

// Faint dot grid — the same canvas dots used inside the editor
function DotBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(107,114,128,0.28) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 70%)",
        maskImage:
          "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 70%)",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Logo — exact three-bar mark from logo.svg (viewBox widened so the first bar
// is not clipped by its negative x coordinate)
// ---------------------------------------------------------------------------

function LogoMark({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="-20 10 220 100"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fxLogoG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="fxLogoG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="fxLogoG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
      </defs>
      <path d="M0 10 H60 L40 110 H-20 Z" fill="url(#fxLogoG1)" />
      <path d="M70 10 H130 L110 110 H50 Z" fill="url(#fxLogoG2)" />
      <path d="M140 10 H200 L180 110 H120 Z" fill="url(#fxLogoG3)" />
    </svg>
  );
}

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[17px] font-medium tracking-tight text-[#1c2230]">
        FlowXcore
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3.5">
        <a href="#top" aria-label="FlowXcore home">
          <Brand />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#6b7280] transition-colors hover:text-[#1c2230]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={LOGIN}
            className="text-sm text-[#6b7280] transition-colors hover:text-[#1c2230]"
          >
            Login
          </a>
          <a
            href={SIGNUP}
            className={`${BTN_BASE} ${BTN_PRIMARY} px-4 py-2 text-sm`}
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          className="flex flex-col gap-1 p-2 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-[1.5px] w-5 bg-[#1c2230]" />
          <span className="block h-[1.5px] w-5 bg-[#1c2230]" />
          <span className="block h-[1.5px] w-5 bg-[#1c2230]" />
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[#e5e7eb] bg-white px-6 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b border-[#e5e7eb] py-2.5 text-sm text-[#6b7280]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={LOGIN}
            className="border-b border-[#e5e7eb] py-2.5 text-sm text-[#6b7280]"
          >
            Login
          </a>
          <a
            href={SIGNUP}
            className={`${BTN_BASE} ${BTN_PRIMARY} mt-3 px-4 py-2 text-sm`}
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero — the product itself: the real editor canvas, nodes and wires
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]"
    >
      <div>
        <p className={EYEBROW}>Workflow automation, self-hosted</p>
        <h1 className="mb-5 text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.7rem] lg:text-[3.2rem]">
          Connect your tools.
          <br />
          Let the workflow run itself.
        </h1>
        <p className="mb-8 max-w-[500px] text-[16.5px] leading-relaxed text-[#6b7280]">
          FlowXcore is a visual, node-based automation platform inspired by n8n.
          Wire triggers to actions, hand the graph to AI when you&apos;d rather
          describe it than build it, and watch every run execute reliably in the
          background.
        </p>
        <div className="mb-10 flex flex-wrap gap-3">
          <a
            href={SIGNUP}
            className={`${BTN_BASE} ${BTN_PRIMARY} px-5 py-2.5 text-sm`}
          >
            Get Started
          </a>
          <a
            href={LOGIN}
            className={`${BTN_BASE} ${BTN_OUTLINE} px-5 py-2.5 text-sm`}
          >
            Login
          </a>
        </div>
        <dl className="flex max-w-[480px] flex-wrap gap-x-10 gap-y-6">
          <div>
            <dt className="mb-1 text-xs text-[#6b7280]">API layer</dt>
            <dd className="text-sm font-medium">tRPC + Prisma</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-[#6b7280]">Job runner</dt>
            <dd className="text-sm font-medium">Inngest</dd>
          </div>
          <div>
            <dt className="mb-1 text-xs text-[#6b7280]">Build</dt>
            <dd className="text-sm font-medium">Next.js + AI SDK</dd>
          </div>
        </dl>
      </div>

      <EditorPreview />
    </section>
  );
}

/**
 * Static replica of the in-app editor: breadcrumb header with Save, dotted
 * canvas, the trigger -> HTTP Request -> Gemini graph, zoom controls and the
 * Execute workflow button. Wires carry a travelling pulse to suggest a run.
 */
function EditorPreview() {
  return (
    <div
      id="workflow"
      className="scroll-mt-24 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_24px_60px_-30px_rgba(40,50,110,0.28)]"
      role="img"
      aria-label="FlowXcore editor showing a trigger connected to two HTTP Request nodes and a Gemini node"
    >
      {/* Editor header */}
      <div className="flex h-12 items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
        <div className="flex items-center gap-2.5 text-sm text-[#6b7280]">
          <Icon name="panel" size={16} className="text-[#1c2230]" />
          <span>Workflows</span>
          <Icon name="chevron" size={14} />
          <span className="text-[#1c2230]">sweet-little-bunny</span>
        </div>
        <span
          className={`${BTN_BASE} ${BTN_PRIMARY} px-3 py-1.5 text-[13px]`}
          aria-hidden="true"
        >
          <Icon name="save" size={14} />
          Save
        </span>
      </div>

      {/* Canvas */}
      <div
        className="relative bg-[#f8f9fb] pb-16"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(107,114,128,0.35) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <svg viewBox="0 0 520 340" className="block h-auto w-full" aria-hidden="true">
          <defs>
            <linearGradient id="fxGemini" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285f4" />
              <stop offset="40%" stopColor="#34a853" />
              <stop offset="70%" stopColor="#fbbc04" />
              <stop offset="100%" stopColor="#ea4335" />
            </linearGradient>
          </defs>

          {/* Wires */}
          <g fill="none" stroke="#a8adb8" strokeWidth="1.75">
            <path d="M100,160 C150,160 140,75 190,75" />
            <path d="M100,160 C150,160 155,250 205,250" />
            <path d="M260,75 H380" />
          </g>

          {/* Traveling pulses */}
          <g fill="#6366f1">
            <circle r="3.5">
              <animateMotion dur="3s" repeatCount="indefinite" path="M100,160 C150,160 140,75 190,75" />
            </circle>
            <circle r="3.5">
              <animateMotion dur="3s" begin="0.5s" repeatCount="indefinite" path="M100,160 C150,160 155,250 205,250" />
            </circle>
            <circle r="3.5">
              <animateMotion dur="2.2s" begin="1.4s" repeatCount="indefinite" path="M260,75 H380" />
            </circle>
          </g>

          {/* Trigger node (rounded on the left, like the editor) */}
          <path
            d="M58,125 H92 a8 8 0 0 1 8 8 V187 a8 8 0 0 1 -8 8 H58 a28 28 0 0 1 -28 -28 V153 a28 28 0 0 1 28 -28 Z"
            fill="#fff"
            stroke="#9ca3af"
            strokeWidth="1.5"
          />
          <g transform="translate(47,142) scale(1.25)" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
          </g>
          <text x="65" y="215" textAnchor="middle" fill="#1c2230" fontSize="12.5" fontWeight="500" fontFamily="inherit">
            <tspan x="65" dy="0">Click to &apos;Execute</tspan>
            <tspan x="65" dy="16">workflow&apos;</tspan>
          </text>

          {/* HTTP Request (top) */}
          <HttpNode x={190} y={40} />
          {/* Gemini */}
          <g>
            <rect x="380" y="40" width="70" height="70" rx="8" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
            <g transform="translate(398,58) scale(1.5)">
              <path
                d="M12 2 C12.8 7.5 16.5 11.2 22 12 C16.5 12.8 12.8 16.5 12 22 C11.2 16.5 7.5 12.8 2 12 C7.5 11.2 11.2 7.5 12 2 Z"
                fill="url(#fxGemini)"
              />
            </g>
            <Handle cx={380} cy={75} />
            <Handle cx={450} cy={75} />
            <NodeLabel x={415} y={128} title="Gemini" />
          </g>
          {/* HTTP Request (bottom) */}
          <HttpNode x={205} y={215} />
        </svg>

        {/* Canvas controls */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#1c2230]" aria-hidden="true">
          <Icon name="plus" size={15} />
        </div>
        <div className="absolute bottom-3 left-3 hidden flex-col overflow-hidden rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] sm:flex" aria-hidden="true">
          <span className="flex h-7 w-7 items-center justify-center border-b border-[#e5e7eb]">
            <Icon name="plus" size={14} />
          </span>
          <span className="flex h-7 w-7 items-center justify-center">
            <Icon name="minus" size={14} />
          </span>
        </div>
        <span
          className={`${BTN_BASE} ${BTN_PRIMARY} absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-[13px]`}
          aria-hidden="true"
        >
          <Icon name="flask" size={15} />
          Execute workflow
        </span>
      </div>
    </div>
  );
}

function Handle({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r="7" fill="#eef1f8" stroke="#cfd5e3" strokeWidth="1.25" />;
}

function NodeLabel({ x, y, title }: { x: number; y: number; title: string }) {
  return (
    <text textAnchor="middle" fontFamily="inherit">
      <tspan x={x} y={y} fill="#1c2230" fontSize="13" fontWeight="500">
        {title}
      </tspan>
    </text>
  );
}

function HttpNode({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="70" height="70" rx="8" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
      <g
        transform={`translate(${x + 17},${y + 17}) scale(1.5)`}
        fill="none"
        stroke="#6b7280"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </g>
      <Handle cx={x} cy={y + 35} />
      <Handle cx={x + 70} cy={y + 35} />
      <NodeLabel x={x + 35} y={y + 88} title="HTTP Request" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Stack strip — quiet ticker beneath the hero
// ---------------------------------------------------------------------------

function StackStrip() {
  const items = STACK.map((s) => s.name);
  const loop = [...items, ...items];
  return (
    <div
      aria-label="Technologies used"
      className="relative z-10 overflow-hidden border-y border-[#e5e7eb] bg-white py-4"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        maskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max gap-12" style={{ animation: "fx-scroll 32s linear infinite" }}>
        {loop.map((name, i) => (
          <span key={`${name}-${i}`} className="whitespace-nowrap text-sm font-medium text-[#9ca3af]">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-[1180px] scroll-mt-16 px-6 py-20">
      <SectionHeading
        eyebrow="What it does"
        title="Everything a workflow needs, wired together"
        sub="Each piece below is a node in the platform itself — built to compose the same way the workflows it powers do."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className={`${CARD} p-6 transition-shadow hover:shadow-[0_8px_24px_-14px_rgba(40,50,110,0.25)]`}
          >
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#f8f9fb] text-[#6366f1]">
              <Icon name={f.icon} size={19} />
            </span>
            <h3 className="mb-2 text-[17px] font-semibold tracking-tight">{f.title}</h3>
            <p className="text-[14.5px] leading-relaxed text-[#6b7280]">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it runs — a genuine sequence, so numbering is earned here
// ---------------------------------------------------------------------------

function HowItRuns() {
  return (
    <section
      id="how-it-runs"
      className="relative z-10 scroll-mt-16 border-y border-[#e5e7eb] bg-white py-20"
    >
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="Execution"
          title="What happens after you hit run"
          sub="A workflow is a sequence by definition — here's the order events actually move through."
        />

        <ol className="m-0 flex list-none flex-col p-0">
          {PIPELINE_STEPS.map((step, i) => (
            <li key={step.id} className="relative grid grid-cols-[56px_1fr] gap-5 pb-10 last:pb-0">
              <div className="flex items-start justify-center">
                <span className="z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-sm font-medium text-[#6366f1] shadow-sm">
                  {step.id}
                </span>
              </div>
              <div>
                <h3 className="mb-1.5 mt-2 text-[17px] font-semibold">{step.title}</h3>
                <p className="m-0 max-w-[540px] text-[14.5px] leading-relaxed text-[#6b7280]">
                  {step.body}
                </p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[27px] top-10 w-px bg-[#e5e7eb]"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// AI callout — natural-language workflow generation
// ---------------------------------------------------------------------------

function AiCallout() {
  const nodes = ["Sheet row added", "Send Slack message", "Create Notion entry"];
  return (
    <section className="relative z-10 mx-auto max-w-[1180px] px-6 py-20">
      <div className={`${CARD} grid gap-10 p-8 md:grid-cols-2 md:items-center md:p-12`}>
        <div>
          <p className={EYEBROW}>AI SDK integration</p>
          <h2 className="mb-3.5 text-[1.5rem] font-semibold tracking-tight sm:text-[1.9rem]">
            Describe the automation. Get the graph.
          </h2>
          <p className="m-0 max-w-[460px] text-[15.5px] leading-relaxed text-[#6b7280]">
            Type what you want in plain language and the AI SDK assembles a
            working node graph from it — trigger, actions, and connections
            already configured, ready to refine on the canvas.
          </p>
        </div>

        <div
          className="flex flex-col items-center rounded-xl border border-[#e5e7eb] bg-[#f8f9fb] p-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(107,114,128,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        >
          <div className="w-full max-w-[400px] rounded-lg border border-[#e5e7eb] bg-white px-4 py-3.5">
            <span className="mb-1.5 block text-xs font-medium text-[#6b7280]">Prompt</span>
            <p className="m-0 text-sm italic leading-relaxed">
              &quot;When a new row is added to my sheet, send a Slack message and log it in
              Notion.&quot;
            </p>
          </div>

          <div className="my-1 h-5 w-px bg-[#a8adb8]" />

          <div className="flex w-full max-w-[400px] flex-col items-center">
            {nodes.map((node, i) => (
              <div key={node} className="flex w-full flex-col items-center">
                <div className="relative flex w-full items-center rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium">
                  <span className="absolute -left-[7px] h-3.5 w-3.5 rounded-full border border-[#cfd5e3] bg-[#eef1f8]" />
                  {node}
                  <span className="absolute -right-[7px] h-3.5 w-3.5 rounded-full border border-[#cfd5e3] bg-[#eef1f8]" />
                </div>
                {i < nodes.length - 1 && <div className="h-4 w-px bg-[#a8adb8]" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stack — full tech list
// ---------------------------------------------------------------------------

function Stack() {
  return (
    <section
      id="stack"
      className="relative z-10 scroll-mt-16 border-y border-[#e5e7eb] bg-white py-20"
    >
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="Under the hood"
          title="Built on a type-safe, production-minded stack"
          sub="No part of this was picked for the resume line — each tool earns its place in the request lifecycle."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="flex flex-row items-baseline justify-between gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8f9fb] px-5 py-4 sm:flex-col sm:items-start sm:gap-1"
            >
              <span className="text-[15px] font-semibold">{item.name}</span>
              <span className="text-right text-[13px] text-[#6b7280] sm:text-left">{item.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
  return (
    <section className="relative z-10 px-6 py-24 text-center">
      <div className="mx-auto max-w-[640px]">
        <h2 className="mb-3.5 text-[1.7rem] font-semibold tracking-tight sm:text-[2.4rem]">
          Wire your first workflow today
        </h2>
        <p className="mb-8 text-[15.5px] leading-relaxed text-[#6b7280]">
          Try the live build, or pull the source and run it against your own
          database and services.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={SIGNUP}
            className={`${BTN_BASE} ${BTN_PRIMARY} px-5 py-2.5 text-sm`}
          >
            Get Started
          </a>
          <a
            href={LOGIN}
            className={`${BTN_BASE} ${BTN_OUTLINE} px-5 py-2.5 text-sm`}
          >
            Login
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#e5e7eb] bg-white px-6 py-10">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p className="m-0 max-w-[460px] text-[13.5px] leading-relaxed text-[#6b7280]">
          A workflow automation platform inspired by n8n. Built with Next.js, tRPC, Prisma, and the AI SDK.
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Shared section heading
// ---------------------------------------------------------------------------

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-12 max-w-[620px]">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mb-3 text-[1.6rem] font-semibold tracking-tight sm:text-[2.1rem]">{title}</h2>
      {sub && <p className="m-0 text-[15.5px] leading-relaxed text-[#6b7280]">{sub}</p>}
    </div>
  );
}