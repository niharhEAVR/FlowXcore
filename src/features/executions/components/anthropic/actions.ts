"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { anthropicChannel } from "@/inngest/channels/anthropic";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: anthropicChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}