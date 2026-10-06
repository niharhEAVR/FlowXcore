"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Background,
  Controls,
  Panel,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ChevronRight,
  FlaskConical,
  History,
  Lock,
  Menu,
  MousePointer2,
  PanelLeft,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Workflow,
  Globe,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseNode } from "@/components/react-flow-auto-generated-ui/base-node";
import { BaseHandle } from "@/components/react-flow-auto-generated-ui/base-handle";

import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeContent } from "@/components/react-flow-auto-generated-ui/base-node";

import gsap from "gsap";
import type { IconType } from "react-icons";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { LuZap } from "react-icons/lu";
import {
  SiTypescript,
  SiTrpc,
  SiPrisma,
  SiPostgresql,
  SiVercel,
  SiShadcnui,
} from "react-icons/si";

/* Design tokens
   page bg #f8f9fb · surface #fff · border #e5e7eb · text #1c2230
   muted #6b7280 · primary #6366f1 (hover #5558e8)
   handle #eef1f8 / #cfd5e3 · edge #a8adb8 */

const LOGIN = process.env.LOGIN;
const SIGNUP = process.env.SIGNUP;

const NAV_LINKS = [
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "How it runs", href: "#how-it-runs" },
  { label: "Stack", href: "#stack" },
];

// Same colors as before, layered on top of the shadcn Button variants
const PRIMARY = "bg-[#6366f1] text-white hover:bg-[#5558e8]";
const OUTLINE = "bg-white text-[#1c2230] border-[#e5e7eb] hover:bg-[#f3f4f8]";
const EYEBROW = "mb-3 text-sm font-medium text-[#6366f1]";
const DOTS = (gap: number, a: number) => ({
  backgroundImage: `radial-gradient(circle, rgba(107,114,128,${a}) 1px, transparent 1px)`,
  backgroundSize: `${gap}px ${gap}px`,
});

const FEATURES = [
  { icon: Workflow, title: "Visual node canvas", body: "Drag, connect, and arrange nodes on an infinite canvas. Every action, trigger, and condition is a block you can see and rewire in seconds." },
  { icon: ShieldCheck, title: "Type-safe API layer", body: "Every call between client and server is checked end to end with tRPC and Prisma — no runtime surprises when a workflow ships to production." },
  { icon: RefreshCw, title: "Reliable background execution", body: "Inngest drives orchestration and retries, so long-running workflows and scheduled jobs finish even when an individual step fails." },
  { icon: Sparkles, title: "Generate workflows from a prompt", body: "Describe what you want automated in plain language. The AI SDK turns that description into a configured, connected node graph." },
  { icon: History, title: "Execution monitoring", body: "Every run leaves a trace. Inspect inputs, outputs, and failures node by node, and re-run from the exact step that broke." },
  { icon: Lock, title: "Secure by default", body: "Authentication, session handling, and a protected API layer are built in from the first request — no bolt-on auth later." },
];

const PIPELINE_STEPS = [
  { title: "Trigger fires", body: "A webhook lands, a schedule ticks, or a teammate clicks run. FlowXcore picks up the event the instant it happens." },
  { title: "Nodes execute in order", body: "Each connected node runs in sequence, passing its output forward as the input to the next — actions, conditions, transforms." },
  { title: "Inngest orchestrates", body: "Retries, delays, and parallel branches are handled by Inngest in the background, so a slow API call never blocks the rest." },
  { title: "Result lands", body: "The final node delivers the outcome — a message sent, a record updated, a file generated — and the run is logged for review." },
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
      <style>{`
        @keyframes fx-scroll { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      {/* Faint dot grid, same as the editor canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          ...DOTS(30, 0.28),
          maskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 70%)",
        }}
      />

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

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function Section({
  id,
  band,
  children,
}: {
  id?: string;
  band?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 scroll-mt-16 py-20",
        band && "border-y border-[#e5e7eb] bg-white",
      )}
    >
      <div className="mx-auto max-w-[1180px] px-6">{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mb-12 max-w-[620px]">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mb-3 text-[1.6rem] font-semibold tracking-tight sm:text-[2.1rem]">{title}</h2>
      <p className="text-[15.5px] leading-relaxed text-[#6b7280]">{sub}</p>
    </div>
  );
}

function AuthButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button asChild className={PRIMARY}>
        <a href={SIGNUP}>Get Started</a>
      </Button>
      <Button asChild variant="outline" className={OUTLINE}>
        <a href={LOGIN}>Login</a>
      </Button>
    </div>
  );
}

// Three-bar mark from logo.svg (viewBox widened so the first bar isn't clipped)
function Brand() {
  const bars = [
    { d: "M0 10 H60 L40 110 H-20 Z", from: "#4f46e5", to: "#06b6d4" },
    { d: "M70 10 H130 L110 110 H50 Z", from: "#06b6d4", to: "#22c55e" },
    { d: "M140 10 H200 L180 110 H120 Z", from: "#22c55e", to: "#a3e635" },
  ];
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="-20 10 220 100" className="h-5 w-auto" aria-hidden="true">
        <defs>
          {bars.map((b, i) => (
            <linearGradient key={i} id={`fxLogoG${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={b.from} />
              <stop offset="100%" stopColor={b.to} />
            </linearGradient>
          ))}
        </defs>
        {bars.map((b, i) => (
          <path key={i} d={b.d} fill={`url(#fxLogoG${i})`} />
        ))}
      </svg>
      <span className="text-[17px] font-medium tracking-tight">FlowXcore</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------

function Nav() {
  const [open, setOpen] = useState(false);
  const linkCls = "text-sm text-[#6b7280] transition-colors hover:text-[#1c2230]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-3.5">
        <a href="#top" aria-label="FlowXcore home">
          <Brand />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={linkCls}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href={LOGIN} className={linkCls}>Login</a>
          <Button asChild className={PRIMARY}>
            <a href={SIGNUP}>Get Started</a>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="flex flex-col border-t border-[#e5e7eb] bg-white px-6 pb-4 pt-2 md:hidden">
          {[...NAV_LINKS, { label: "Login", href: LOGIN ?? "#" }].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="border-b border-[#e5e7eb] py-2.5 text-sm text-[#6b7280]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button asChild className={cn(PRIMARY, "mt-3")}>
            <a href={SIGNUP}>Get Started</a>
          </Button>
        </div>
      )}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  const meta = [
    ["API layer", "tRPC + Prisma"],
    ["Job runner", "Inngest"],
    ["Build", "Next.js + AI SDK"],
  ];
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
        <AuthButtons className="mb-10" />
        <dl className="flex max-w-[480px] flex-wrap gap-x-10 gap-y-6">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="mb-1 text-xs text-[#6b7280]">{k}</dt>
              <dd className="text-sm font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <EditorPreview />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Editor preview — real React Flow canvas using the existing BaseNode/BaseHandle
// ---------------------------------------------------------------------------

type PreviewData = { label: string; icon: ReactNode; trigger?: boolean };

const GeminiIcon = () => (
  <svg viewBox="0 0 24 24" className="size-9" aria-hidden="true">
    <defs>
      <linearGradient id="fxGemini" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="40%" stopColor="#34a853" />
        <stop offset="70%" stopColor="#fbbc04" />
        <stop offset="100%" stopColor="#ea4335" />
      </linearGradient>
    </defs>
    <path d="M12 2C12.8 7.5 16.5 11.2 22 12 16.5 12.8 12.8 16.5 12 22 11.2 16.5 7.5 12.8 2 12 7.5 11.2 11.2 7.5 12 2Z" fill="url(#fxGemini)" />
  </svg>
);

const handleCls = "!size-[11px] !border-[#cfd5e3] !bg-[#eef1f8]";

function PreviewNode({ data }: NodeProps<Node<PreviewData>>) {
  return (
    <BaseNode
      className={cn(
        "flex size-[70px] items-center justify-center rounded-lg border-[#9ca3af] bg-white text-[#6b7280] hover:bg-white",
        data.trigger && "rounded-l-[28px]",
      )}
    >
      {data.icon}
      {!data.trigger && <BaseHandle type="target" position={Position.Left} className={handleCls} />}
      <BaseHandle type="source" position={Position.Right} className={handleCls} />
      <span className="absolute left-1/2 top-full mt-2 w-24 -translate-x-1/2 text-center text-[13px] font-medium leading-tight text-[#1c2230]">
        {data.label}
      </span>
    </BaseNode>
  );
}

const nodeTypes = { preview: PreviewNode };

const previewNodes: Node<PreviewData>[] = [
  { id: "t", type: "preview", position: { x: 30, y: 125 }, data: { trigger: true, label: "Click to 'Execute workflow'", icon: <MousePointer2 className="size-6" /> } },
  { id: "h1", type: "preview", position: { x: 190, y: 40 }, data: { label: "HTTP Request", icon: <Globe className="size-7" /> } },
  { id: "h2", type: "preview", position: { x: 205, y: 215 }, data: { label: "HTTP Request", icon: <Globe className="size-7" /> } },
  { id: "g", type: "preview", position: { x: 380, y: 40 }, data: { label: "Gemini", icon: <GeminiIcon /> } },
];

const edgeStyle = { stroke: "#a8adb8", strokeWidth: 1.75 };
const previewEdges: Edge[] = [
  { id: "t-h1", source: "t", target: "h1" },
  { id: "t-h2", source: "t", target: "h2" },
  { id: "h1-g", source: "h1", target: "g" },
].map((e) => ({ ...e, animated: true, style: edgeStyle }));

function EditorPreview() {
  return (
    <div
      id="workflow"
      className="scroll-mt-24 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_24px_60px_-30px_rgba(40,50,110,0.28)]"
      role="img"
      aria-label="FlowXcore editor showing a trigger connected to two HTTP Request nodes and a Gemini node"
    >
      <div className="flex h-12 items-center justify-between border-b border-[#e5e7eb] px-4">
        <div className="flex items-center gap-2.5 text-sm text-[#6b7280]">
          <PanelLeft className="size-4 text-[#1c2230]" />
          <span>Workflows</span>
          <ChevronRight className="size-3.5" />
          <span className="text-[#1c2230]">customer-report</span>
        </div>
        <Button size="sm" className={PRIMARY} tabIndex={-1} aria-hidden="true">
          <Save /> Save
        </Button>
      </div>

      {/* taller canvas + larger fit padding so the bottom node label clears the Execute button */}
      <div className="pointer-events-none h-[440px] w-full bg-[#f8f9fb] sm:h-[500px]">
        <ReactFlow
          nodes={previewNodes}
          edges={previewEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={26} size={1} color="rgba(107,114,128,0.35)" />
          <Controls showInteractive={false} position="bottom-left" className="hidden sm:flex" />
          <Panel position="top-right">
            <Button size="icon" variant="outline" className={cn(OUTLINE, "size-8")}>
              <Plus />
            </Button>
          </Panel>
          <Panel position="bottom-center" className="mb-3">
            <Button size="sm" className={PRIMARY}>
              <FlaskConical /> Execute workflow
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stack strip — marquee
// ---------------------------------------------------------------------------

const STACK_ICONS: Record<string, IconType> = {
  "Next.js": RiNextjsFill,
  TypeScript: SiTypescript,
  tRPC: SiTrpc,
  Prisma: SiPrisma,
  PostgreSQL: SiPostgresql,
  Inngest: LuZap, // no Inngest logo in react-icons
  "AI SDK": SiVercel,
  "Tailwind CSS": RiTailwindCssFill,
  "Shadcn UI": SiShadcnui,
};

const marqueeItems = STACK.map((s) => ({ name: s.name, icon: STACK_ICONS[s.name] }));

function MarqueeRow({ items }: { items: typeof marqueeItems }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const firstHalf = el.children.length / 2;

    let width = 0;

    for (let i = 0; i < firstHalf; i++) {
      width += (el.children[i] as HTMLElement).offsetWidth;
    }

    const tween = gsap.fromTo(
      el,
      { x: 0 },
      {
        x: -width,
        duration: 60,
        repeat: -1,
        ease: "none",
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="overflow-hidden w-full h-[2vw] min-h-12 flex items-center">
      <div
        ref={rowRef}
        className="flex flex-nowrap w-max gap-8 md:gap-12 lg:gap-16 will-change-transform"
      >
        {[...items, ...items].map((tech, index) => {
          const Icon = tech.icon;

          return (
            <div
              key={`${tech.name}-${index}`}
              className="flex items-center gap-2 md:gap-3 shrink-0"
              style={{ color: "#1c2230", opacity: 0.2 }}
            >
              <Icon className="text-2xl sm:text-3xl md:text-[3vw]" />

              <span className="text-2xl sm:text-3xl md:text-[3vw] font-serif italic leading-none whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StackStrip() {
  const mask = "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)";
  return (
    <section
      aria-label="Technologies used"
      className="relative z-10 w-full overflow-hidden border-y border-[#e5e7eb] bg-white py-10"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <MarqueeRow items={marqueeItems} />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="What it does"
        title="Everything a workflow needs, wired together"
        sub="Each piece below is a node in the platform itself — built to compose the same way the workflows it powers do."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <Card
            key={title}
            className="gap-0 rounded-xl border-[#e5e7eb] bg-white py-6 shadow-none transition-shadow hover:shadow-[0_8px_24px_-14px_rgba(40,50,110,0.25)]"
          >
            <CardHeader className="gap-0">
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#f8f9fb] text-[#6366f1]">
                <Icon className="size-[19px]" />
              </span>
              <CardTitle className="mb-2 text-[17px] font-semibold tracking-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[14.5px] leading-relaxed text-[#6b7280]">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// How it runs — a genuine sequence, so numbering is earned
// ---------------------------------------------------------------------------

function HowItRuns() {
  return (
    <Section id="how-it-runs" band>
      <SectionHeading
        eyebrow="Execution"
        title="What happens after you hit run"
        sub="A workflow is a sequence by definition — here's the order events actually move through."
      />
      <ol className="flex flex-col">
        {PIPELINE_STEPS.map((s, i) => (
          <li key={s.title} className="relative grid grid-cols-[56px_1fr] gap-5 pb-10 last:pb-0">
            <span className="z-10 mx-auto flex size-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-sm font-medium text-[#6366f1] shadow-sm">
              {i + 1}
            </span>
            <div>
              <h3 className="mb-1.5 mt-2 text-[17px] font-semibold">{s.title}</h3>
              <p className="max-w-[540px] text-[14.5px] leading-relaxed text-[#6b7280]">{s.body}</p>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-[27px] top-10 w-px bg-[#e5e7eb]" />
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Node editor callout — drag, drop, configure
// ---------------------------------------------------------------------------

function AiCallout() {
  const palette = [
    { icon: Globe, label: "HTTP Request" },
  ];
  const fields = [
    { label: "Endpoint URL", value: "https://api.example.com/customers" },
    { label: "Method", value: "GET" },
  ];
  return (
    <Section>
      <Card className="grid gap-10 rounded-xl border-[#e5e7eb] bg-white p-8 shadow-none md:grid-cols-2 md:items-center md:p-12">
        <div>
          <p className={EYEBROW}>Node editor</p>
          <h2 className="mb-3.5 text-[1.5rem] font-semibold tracking-tight sm:text-[1.9rem]">
            Drag a node. Set it up. Run it.
          </h2>
          <p className="max-w-[460px] text-[15.5px] leading-relaxed text-[#6b7280]">
            Pick a node from the list, drop it on the canvas, and connect it to
            the one before it. Open any node to fill in its settings — URL,
            method, model, prompt — then save and run the workflow.
          </p>
        </div>

        <div
          className="pointer-events-none flex flex-col items-center rounded-xl border border-[#e5e7eb] bg-[#f8f9fb] p-5"
          style={DOTS(24, 0.3)}
          aria-hidden="true"
        >
          {/* Node list */}
          <div className="grid max-w-[400px] grid-cols-1 gap-3">
            {palette.map(({ icon: Icon, label }) => (
              <BaseNode
                key={label}
                tabIndex={-1}
                className="flex items-center gap-2 rounded-lg border-[#e5e7eb] bg-white px-3 py-2.5 text-sm font-medium hover:bg-white"
              >
                <GripVertical className="size-4 text-[#9ca3af]" />
                <Icon className="size-4 text-[#6b7280]" />
                {label}
              </BaseNode>
            ))}
          </div>

          <div className="my-1 h-6 w-px bg-[#a8adb8]" />

          {/* Node settings */}
          <BaseNode
            tabIndex={-1}
            className="w-full max-w-[400px] rounded-lg border-[#e5e7eb] bg-white hover:bg-white"
          >
            <BaseNodeHeader className="border-b border-[#e5e7eb] !mb-0">
              <Globe className="size-4 text-[#6b7280]" />
              <BaseNodeHeaderTitle className="text-sm">HTTP Request</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
              {fields.map((f) => (
                <div key={f.label} className="grid gap-1.5">
                  <Label className="text-xs font-medium text-[#6b7280]">{f.label}</Label>
                  <Input
                    readOnly
                    tabIndex={-1}
                    value={f.value}
                    className="h-9 border-[#e5e7eb] bg-white text-sm text-[#1c2230]"
                  />
                </div>
              ))}
            </BaseNodeContent>
          </BaseNode>
        </div>
      </Card>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

function Stack() {
  return (
    <Section id="stack" band>
      <SectionHeading
        eyebrow="Under the hood"
        title="Built on a type-safe, production-minded stack"
        sub="No part of this was picked for the resume line — each tool earns its place in the request lifecycle."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STACK.map((s) => (
          <div
            key={s.name}
            className="flex flex-row items-baseline justify-between gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8f9fb] px-5 py-4 sm:flex-col sm:items-start sm:gap-1"
          >
            <span className="text-[15px] font-semibold">{s.name}</span>
            <span className="text-right text-[13px] text-[#6b7280] sm:text-left">{s.role}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA + Footer
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
        <AuthButtons className="justify-center" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#e5e7eb] bg-white px-6 py-10">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p className="max-w-[460px] text-[13.5px] leading-relaxed text-[#6b7280]">
          A workflow automation platform inspired by n8n. Built with Next.js, tRPC, Prisma, and the AI SDK.
        </p>
      </div>
    </footer>
  );
}