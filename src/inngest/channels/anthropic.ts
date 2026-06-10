import { realtime } from "inngest";
import { z } from "zod";

export const anthropicChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `anthropic:${workflowId}`,
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

export type anthropicStatusMessage = z.infer<
  typeof anthropicChannel.topics.status.schema
>;