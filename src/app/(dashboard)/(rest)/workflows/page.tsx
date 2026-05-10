import { requireAuth } from "@/lib/auth-utils"

import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch } from "@/trpc/server";

import { WorkflowsList } from "@/app/features/workflows/components/workflows";

import { Suspense } from "react";
import { prefetchWorkflows } from "@/app/features/workflows/server/prefetch";

import { WorkflowsContainer } from "@/app/features/workflows/components/workflows";


export default async function Page() {

    await requireAuth();
    prefetchWorkflows();

    return (<WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<div>Failed to load workflows</div>}>
                <Suspense fallback={<div>Loading workflows...</div>}>
                    <WorkflowsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </WorkflowsContainer >)
}