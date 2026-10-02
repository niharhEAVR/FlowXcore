"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";


export default function SuccessPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      await new Promise((res) => setTimeout(res, 1500));

      try {
        await authClient.customer.state();
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSyncing(false);
      }
    };

    refresh();
  }, [queryClient]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
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
          <LogoMark />
          <span className="text-[17px] font-medium tracking-tight text-foreground">
            FlowXcore
          </span>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-8 shadow-sm duration-500 sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" strokeWidth={1.75} />
          </div>

          <div className="text-center">
            <span className="text-sm font-medium text-primary">
              Payment confirmed
            </span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              You&apos;re all set
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your plan is active. We&apos;re wiring up your workspace so every
              workflow is ready when you are.
            </p>
          </div>

          <div
            className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Activating your workspace…</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Workspace ready</span>
              </>
            )}
          </div>

          <Button
            onClick={() => router.push("/workflows")}
            className="mt-8 w-full gap-2"
            size="lg"
            disabled={isSyncing}
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            A receipt has been sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}

// Three-bar FlowXcore mark (from logo.svg, viewBox widened so the first bar
// isn't clipped by its negative x coordinate).
function LogoMark() {
  return (
    <svg viewBox="-20 10 220 100" className="h-5 w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="fxSuccG1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="fxSuccG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="fxSuccG3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
      </defs>
      <path d="M0 10 H60 L40 110 H-20 Z" fill="url(#fxSuccG1)" />
      <path d="M70 10 H130 L110 110 H50 Z" fill="url(#fxSuccG2)" />
      <path d="M140 10 H200 L180 110 H120 Z" fill="url(#fxSuccG3)" />
    </svg>
  );
}