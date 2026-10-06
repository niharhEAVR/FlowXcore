import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// app/not-found.tsx
// Next.js renders this automatically for every URL that doesn't match a route
// (and whenever you call notFound() in a page). Same design as the success and
// verify-email pages; fixed to one screen so there is no scrollbar.

export default function NotFound() {
  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Dotted canvas backdrop, same as the workflow editor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(107,114,128,0.28) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="FlowXcore logo"
            width={220}
            height={120}
            priority
            className="h-6 w-auto"
          />
          <span className="text-[17px] font-medium tracking-tight text-foreground">
            FlowXcore
          </span>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-8 shadow-sm duration-500 sm:p-10">
          {/* Two nodes with a broken wire: this route isn't connected to anything */}
          <svg
            viewBox="0 0 220 70"
            className="mx-auto mb-6 h-[70px] w-[220px]"
            aria-hidden="true"
          >
            <g fill="none" stroke="#a8adb8" strokeWidth="1.75" strokeDasharray="4 4">
              <path d="M67,35 H88" />
              <path d="M132,35 H153" />
            </g>
            <rect x="10" y="10" width="50" height="50" rx="8" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
            <rect x="160" y="10" width="50" height="50" rx="8" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
            <circle cx="60" cy="35" r="6" fill="#eef1f8" stroke="#cfd5e3" strokeWidth="1.25" />
            <circle cx="160" cy="35" r="6" fill="#eef1f8" stroke="#cfd5e3" strokeWidth="1.25" />
            <text
              x="110"
              y="40"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="14"
              fontWeight="600"
              fontFamily="inherit"
            >
              404
            </text>
          </svg>

          <div className="text-center">
            <span className="text-sm font-medium text-primary">Error 404</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Page not found
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved. Check the URL, or head back to your workflows.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" size="lg" className="flex-1">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild size="lg" className="flex-1 gap-2">
              <Link href="/workflows">
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}