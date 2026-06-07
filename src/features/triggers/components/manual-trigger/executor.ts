import { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = manualTriggerChannel({
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

  const result = await step.run("manual-trigger", async () => context);

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