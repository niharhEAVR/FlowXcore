"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { getRealtimeToken } from "./actions";
import { useParams } from "next/navigation";


import { GrokDialog, GrokFormValues} from "./dialog";
import { grokChannel } from "@/inngest/channels/grok";

type GrokNodeData = {
  variableName?: string,
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};


type GrokNodeType = Node<GrokNodeData>;

export const GrokNode = memo((props: NodeProps<GrokNodeType>) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const params = useParams();

  const workflowId = params.workflowId as string;

  const channel = grokChannel({
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

  const handleSubmit = (values: GrokFormValues) => {
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
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  return (
    <>
      <GrokDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={"/grok.svg"}
        name="Grok"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  )
});

GrokNode.displayName = "GrokNode";