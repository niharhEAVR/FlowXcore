import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/prisma";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type GeminiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = geminiChannel({
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
    throw new NonRetriableError("Gemini node: Variable name is missing");
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
    throw new NonRetriableError("Gemini node: Credential is required");
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
    throw new NonRetriableError("Gemini node: User prompt is missing");
  }

  // TODO: Throw if credential is missing

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

   if (!credential) {
    await step.realtime.publish(
        "status-error",
        ch.status,
        {
          nodeId,
          status: "error",
        }
      );
    throw new NonRetriableError("Gemini node: Credential not found");
  }

  const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });

  try {
    const { steps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
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