import { realtime } from "inngest";
import { z } from "zod";

export const grokChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `grok:${workflowId}`,
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

export type grokStatusMessage = z.infer<
  typeof grokChannel.topics.status.schema
>;