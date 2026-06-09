import { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = stripeTriggerChannel({
    workflowId,
  });

  await step.realtime.publish(
    "status-loading",
    ch.status,
    {
      nodeId,
      status: "loading",
    }
  );

 const result = await step.run("stripe-trigger", async () => context);

  await step.realtime.publish(
    "status-success",
    ch.status,
    {
      nodeId,
      status: "success",
    }
  );

  return result;
};