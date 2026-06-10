"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getRealtimeToken } from "./actions";
import { useParams } from "next/navigation";


import { AnthropicDialog, AnthropicFormValues} from "./dialog";
import { anthropicChannel } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};


type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const params = useParams();

  const workflowId = params.workflowId as string;

  const channel = anthropicChannel({
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

  const handleSubmit = (values: AnthropicFormValues) => {
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values
          }
        }
      }
      return node;
    }))
  };

   const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `claude-sonnet-4-5: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/anthropic.svg"}
        name="Anthropic"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

AnthropicNode.displayName = "AnthropicNode";