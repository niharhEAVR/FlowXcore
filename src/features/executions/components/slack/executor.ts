import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { slackChannel } from "@/inngest/channels/slack";
import ky from "ky";
import { decode } from "html-entities";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  workflowId,
}) => {

  const ch = slackChannel({
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

  if (!data.content) {
    await step.realtime.publish(
      "status-error",
      ch.status,
      {
        nodeId,
        status: "error",
      }
    );
    throw new NonRetriableError("Slack node: Message content is required");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {

    const result = await step.run("slack-webhook", async () => {
      if (!data.webhookUrl) {
        await step.realtime.publish(
          "status-error",
          ch.status,
          {
            nodeId,
            status: "error",
          }
        );
        throw new NonRetriableError("Slack node: Webhook URL is required");
      }
      await ky.post(data.webhookUrl, {
        json: {
          content: content, // The key depends on workflow config
        },
      });

      if (!data.variableName) {
        await step.realtime.publish(
          "status-error",
          ch.status,
          {
            nodeId,
            status: "error",
          }
        );
        throw new NonRetriableError("Slack node: Variable name is missing");
      }


      return {
        ...context,
        [data.variableName]: {
          messageContent: content,
        },
      };
    });

    await step.realtime.publish(
      "status-success",
      ch.status,
      {
        nodeId,
        status: "success",
      }
    );
    return result;
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