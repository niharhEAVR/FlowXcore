"use server";

import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";


export async function getRealtimeToken(runId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: stripeTriggerChannel({ workflowId: runId }),
    topics: ["status", "tokens"],
  });
}