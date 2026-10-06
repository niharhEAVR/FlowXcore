import Image from "next/image";

export default function VerifyEmailPage() {
    return (<>
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
            <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-border bg-card p-8 shadow-sm duration-500 sm:p-10">
                <div className="text-center">
                    <span className="text-sm font-medium text-primary">
                        Verification sent
                    </span>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Check your email
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        We&apos;ve sent you a verification link. Click the link in your
                        email to verify your account.
                    </p>
                </div>

                <ul className="mt-6 space-y-2.5 rounded-lg border border-border bg-background px-4 py-3.5 text-sm text-muted-foreground">
                    <li className="flex gap-2.5">
                        <Dot />
                        <span>Can&apos;t find it? Check your spam folder too.</span>
                    </li>
                    <li className="flex gap-2.5">
                        <Dot />
                        <span>
                            You can close this window after clicking the link. You&apos;ll
                            be redirected to the dashboard after verification.
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </>
    );
}

function Dot() {
    return (
        <span
            aria-hidden
            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
        />
    );
}