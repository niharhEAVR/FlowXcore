import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/prisma";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type AnthropicData = {
  variableName?: string;
    credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = anthropicChannel({
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
    throw new NonRetriableError("Anthropic node: Variable name is missing");
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
    throw new NonRetriableError("Anthropic node: User prompt is missing");
  }

  if (!data.credentialId) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw new NonRetriableError("Anthropic node: Credential is required");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

 const credential = await step.run("get-credential", () => {
    return prisma.credential.findUnique({
      where: {
        id: data.credentialId,
      },
    });
  });

  if(!credential) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw new NonRetriableError("Anthropic node: API key is missing");
  }

  const anthropic = createAnthropic({
    apiKey: credential.value,
  });


  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        // cast to any to satisfy generateText's expected LanguageModel type
        model: anthropic("claude-sonnet-4-20250514") as any,
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