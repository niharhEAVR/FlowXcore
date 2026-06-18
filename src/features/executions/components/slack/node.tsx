"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getRealtimeToken } from "./actions";
import { useParams } from "next/navigation";


import { SlackDialog, SlackFormValues } from "./dialog";
import { slackChannel } from "@/inngest/channels/slack";

type SlackNodeData = {
  webhookUrl?: string;
  content?: string;
};


type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const params = useParams();

  const workflowId = params.workflowId as string;

  const channel = slackChannel({
    workflowId: workflowId,
  });

  const topics = ["status"] as const;

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel,
    topics,
    token: () => getRealtimeToken(workflowId),
  });


  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SlackFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values,
          }
        }
      }
      return node;
    }))
  };

  const nodeData = props.data;
   const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

SlackNode.displayName = "SlackNode";