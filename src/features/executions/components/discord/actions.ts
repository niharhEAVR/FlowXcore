"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: discordChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}