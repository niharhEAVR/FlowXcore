import { realtime } from "inngest";
import { z } from "zod";

export const googleFormTriggerChannel = realtime.channel({
    name: ({ workflowId }: { workflowId: string }) =>
        `google-form-trigger:${workflowId}`,
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

export type googleFormTriggerStatusMessage = z.infer<
    typeof googleFormTriggerChannel.topics.status.schema
>;