import { InitialNode } from "@/components/created-ui/initial-node";
import { NodeType } from "@/generated/enums";
import type { NodeTypes } from "@xyflow/react";

import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";


export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
/* This line represents: the key of the types of nodeComponents, here is a example

if:

const nodeComponents = {
  INITIAL: InitialNode,
  EMAIL: EmailNode,
  CONDITION: ConditionNode
};

then: 

type RegisteredNodeType =
  | "INITIAL"
  | "EMAIL"
  | "CONDITION";

*/
