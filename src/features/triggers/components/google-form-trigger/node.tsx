import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

import { GoogleFormTriggerDialog } from "./dialog";
import { useParams } from "next/navigation";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { getRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

export const GoogleFormTrigger = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => setDialogOpen(true);

  const params = useParams();
  const workflowId = params.workflowId as string;
  const channel = googleFormTriggerChannel({
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
      <GoogleFormTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon="/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});


