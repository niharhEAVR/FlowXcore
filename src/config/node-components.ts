import { InitialNode } from "@/components/created-ui/initial-node";
import { NodeType } from "@/generated/enums";
import type { NodeTypes } from "@xyflow/react";

import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { GoogleFormTrigger } from "@/features/triggers/components/google-form-trigger/node";
import { StripeTrigger } from "@/features/triggers/components/stripe-trigger/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";
import { OpenAiNode } from "@/features/executions/components/openai/node";
import { GrokNode } from "@/features/executions/components/grok/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTrigger,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.OPENAI]: OpenAiNode,
  [NodeType.GROK]: GrokNode,
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
