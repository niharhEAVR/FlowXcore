import { realtime } from "inngest";
import { z } from "zod";

export const openaiChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `openai:${workflowId}`,
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

export type openaiStatusMessage = z.infer<
  typeof openaiChannel.topics.status.schema
>;