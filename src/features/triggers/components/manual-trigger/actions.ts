"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";


export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: manualTriggerChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}