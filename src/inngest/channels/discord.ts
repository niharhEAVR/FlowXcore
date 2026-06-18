import { realtime } from "inngest";
import { z } from "zod";

export const discordChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `discord:${workflowId}`,
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

export type discordStatusMessage = z.infer<
  typeof discordChannel.topics.status.schema
>;