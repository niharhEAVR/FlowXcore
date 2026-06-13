"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getRealtimeToken } from "./actions";
import { useParams } from "next/navigation";


import { GeminiDialog, GeminiFormValues} from "./dialog";
import { geminiChannel } from "@/inngest/channels/gemini";

type GeminiNodeData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};


type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const params = useParams();

  const workflowId = params.workflowId as string;

  const channel = geminiChannel({
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

  const handleSubmit = (values: GeminiFormValues) => {
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
    ? `gemini-2.0-flash: ${nodeData.userPrompt.slice(0, 50)}...`
    : "Not configured";

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/gemini.svg"}
        name="Gemini"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

GeminiNode.displayName = "GeminiNode";