import { realtime } from "inngest";
import { z } from "zod";

export const stripeTriggerChannel = realtime.channel({
    name: ({ workflowId }: { workflowId: string }) =>
        `stripe-trigger:${workflowId}`,
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

export type stripeTriggerStatusMessage = z.infer<
    typeof stripeTriggerChannel.topics.status.schema
>;