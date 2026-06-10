"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { openaiChannel } from "@/inngest/channels/openai";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: openaiChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}