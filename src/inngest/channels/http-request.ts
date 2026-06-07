import { realtime } from "inngest";
import { z } from "zod";

export const httpRequestChannel = realtime.channel({
  name: ({ workflowId }: { workflowId: string }) =>
    `http-request:${workflowId}`,
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

export type HttpRequestStatusMessage = z.infer<
  typeof httpRequestChannel.topics.status.schema
>;