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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[280px] w-[280px] translate-x-1/4 translate-y-1/4 rounded-full bg-chart-2/15 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700 ease-out">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 animate-in fade-in zoom-in-50 fill-mode-both duration-500 delay-150 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/20">
            <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={1.75} />
          </div>

          <div className="text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Payment confirmed
            </span>
            <h1 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
              You&apos;re all set
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your plan is active. We&apos;re wiring up your workspace so every
              workflow is ready when you are.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
            {isSyncing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Activating your workspace…</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Workspace ready</span>
              </>
            )}
          </div>

          <Button
            onClick={() => router.push("/workflows")}
            className="mt-8 w-full gap-2"
            size="lg"
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