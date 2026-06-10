"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { grokChannel } from "@/inngest/channels/grok";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: grokChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}