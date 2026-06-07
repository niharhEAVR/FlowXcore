import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

import { useParams } from "next/navigation";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { getRealtimeToken } from "./actions";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";

export const ManualTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => setDialogOpen(true);

  const params = useParams();
  const workflowId = params.workflowId as string;
  const channel = manualTriggerChannel({
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
      <ManualTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});