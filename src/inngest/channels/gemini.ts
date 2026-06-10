import { realtime } from "inngest";
import { z } from "zod";

export const geminiChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `gemini:${workflowId}`,
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

export type geminiStatusMessage = z.infer<
  typeof geminiChannel.topics.status.schema
>;