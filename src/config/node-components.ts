import { InitialNode } from "@/components/created-ui/initial-node";
import { NodeType } from "@/generated/enums";
import type { NodeTypes } from "@xyflow/react";


export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
