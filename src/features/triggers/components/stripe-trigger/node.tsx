import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

import { StripeTriggerDialog } from "./dialog";
import { useParams } from "next/navigation";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { getRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

export const StripeTrigger = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => setDialogOpen(true);

  const params = useParams();
  const workflowId = params.workflowId as string;
  const channel = stripeTriggerChannel({
    workflowId: workflowId,
  });
  const topics = ["status", "tokens"] as const;


  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel,
    topics,
    token: () => getRealtimeToken(workflowId),
  });

  return (
    <>
      <StripeTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
       icon="/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});


