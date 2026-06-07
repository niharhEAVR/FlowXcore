import { realtime } from "inngest";
import { z } from "zod";

export const manualTriggerChannel = realtime.channel({
    name: ({ workflowId }: { workflowId: string }) =>
        `manual-trigger:${workflowId}`,
    topics: {
        status: {
            schema: z.object({
                nodeId: z.string(),
                status: z.enum(["loading", "success", "error"]),
            }),
        },
        tokens: {
            schema: z.object({ token: z.string(), step: z.string() }),
        },
    },
});

export type ManualTriggerStatusMessage = z.infer<
    typeof manualTriggerChannel.topics.status.schema
>;