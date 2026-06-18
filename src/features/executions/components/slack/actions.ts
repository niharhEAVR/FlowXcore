"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";

export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: slackChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}