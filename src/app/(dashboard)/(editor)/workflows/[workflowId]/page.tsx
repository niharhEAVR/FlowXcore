import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
    Editor,
    EditorError,
    EditorLoading
} from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
    params: Promise<{
        workflowId: string
    }>
}


export default async function Page({ params }: PageProps) {

    await requireAuth();

    const { workflowId } = await params;

    prefetchWorkflow(workflowId); // the reason we dont use await here because "void queryClient.prefetchQuery(...)" inside prefetch() intentionally says: start fetching, I don't need to wait here.


    return (<>
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError />}>
                <Suspense fallback={<EditorLoading />}>
                    <EditorHeader workflowId={workflowId} />
                    <main className="flex-1">
                        <Editor workflowId={workflowId} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </>);
}