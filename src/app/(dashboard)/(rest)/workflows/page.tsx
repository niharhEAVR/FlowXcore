import { requireAuth } from "@/lib/auth-utils"

import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch } from "@/trpc/server";

import { WorkflowsList } from "@/app/features/workflows/components/workflows";

import { Suspense } from "react";
import { prefetchWorkflows } from "@/app/features/workflows/server/prefetch";

import { WorkflowsContainer } from "@/app/features/workflows/components/workflows";
import { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/app/features/workflows/server/params-loader";

type Props = {
    searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: Props) {

    await requireAuth();

    const params = await workflowsParamsLoader(searchParams);
    prefetchWorkflows(params);

    return (<WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<div>Failed to load workflows</div>}>
                <Suspense fallback={<div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                    <span>Loading workflows...</span>
                </div>}>
                    <WorkflowsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </WorkflowsContainer >)
}