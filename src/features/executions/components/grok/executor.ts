import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createXai } from '@ai-sdk/xai';
import type { NodeExecutor } from "@/features/executions/types";
import { grokChannel } from "@/inngest/channels/grok";


Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type GrokData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const grokExecutor: NodeExecutor<GrokData> = async ({
  data,
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = grokChannel({
    workflowId,
  });

  await step.realtime.publish(
    "status-loading",
    ch.status,
    {
      nodeId,
      status: "loading",
    }
  );

  if (!data.variableName) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw new NonRetriableError("Grok node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw new NonRetriableError("Grok node: User prompt is missing");
  }

  // TODO: Throw if credential is missing

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credential that user selected

  const credentialValue = process.env.XAI_API_KEY!;

  if(!credentialValue) {
      await step.realtime.publish(
        "status-error",
        ch.status,
        {
          nodeId,
          status: "error",
        }
      );
      throw new NonRetriableError("Grok node: API key is missing");
    }

  const grok = createXai({
    apiKey: credentialValue,
  });


  try {
    const { steps } = await step.ai.wrap(
      "grok-generate-text",
      generateText,
      {
        model: grok("grok-3-mini") as any,
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type === "text"
        ? steps[0].content[0].text
        : "";


    await step.realtime.publish(
      "status-success",
      ch.status,
      {
        nodeId,
        status: "success",
      }
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    }


  }
  catch (err) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw err;
  }
};