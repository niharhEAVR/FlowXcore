import { requireAuth } from "@/lib/auth-utils"

import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";

import {
    WorkflowsList,
    WorkflowsLoading,
    WorkflowsContainer,
    WorkflowsError
} from "@/features/workflows/components/workflows";

import { Suspense } from "react";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";

import { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";


type Props = {
    searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: Props) {

    await requireAuth();

    const params = await workflowsParamsLoader(searchParams);
    prefetchWorkflows(params);

    return (<WorkflowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<WorkflowsError />}>
                <Suspense fallback={<WorkflowsLoading />}>
                    <WorkflowsList />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </WorkflowsContainer >)
}