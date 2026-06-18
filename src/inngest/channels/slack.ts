import { realtime } from "inngest";
import { z } from "zod";

export const slackChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `slack:${workflowId}`,
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

export type slackStatusMessage = z.infer<
  typeof slackChannel.topics.status.schema
>;