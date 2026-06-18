"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getRealtimeToken } from "./actions";
import { useParams } from "next/navigation";


import { DiscordDialog, DiscordFormValues } from "./dialog";
import { discordChannel } from "@/inngest/channels/discord";

type DiscordNodeData = {
  webhookUrl?: string;
  content?: string;
};


type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const params = useParams();

  const workflowId = params.workflowId as string;

  const channel = discordChannel({
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

  const handleSubmit = (values: DiscordFormValues) => {
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
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

DiscordNode.displayName = "DiscordNode";