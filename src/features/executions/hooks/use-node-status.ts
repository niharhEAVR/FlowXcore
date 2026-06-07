import { useEffect, useState } from "react";
import { useRealtime } from "inngest/react";

import type { NodeStatus } from "@/components/react-flow-auto-generated-ui/node-status-indicator";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import type { ClientSubscriptionToken } from "inngest/react";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: ReturnType<typeof httpRequestChannel>;
  topics: readonly string[];
  token: () => Promise<ClientSubscriptionToken>;
}

export function useNodeStatus({
  nodeId,
  channel,
  topics,
  token,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { messages } = useRealtime({
    channel,
    topics,
    token,
    enabled: true,
    bufferInterval: 100,
  });

  useEffect(() => {
    if (!messages.all.length) {
      return;
    }

    // Walk backwards because newest messages are at the end
    for (let i = messages.all.length - 1; i >= 0; i--) {
      const msg = messages.all[i];
      console.log(msg);

      if (msg.kind === "run") {
        continue;
      }

      if (!msg.topic || !topics.includes(msg.topic)) {
        continue;
      }

      const data = msg.data as {
        nodeId?: string;
        status?: NodeStatus;
      };

      if (data.nodeId !== nodeId) {
        continue;
      }

      if (data.status) {
        setStatus(data.status);
      }

      break;
    }
  }, [messages.all, nodeId, topics]);

  return status;
}


// Output message example:

/*
{
    "byTopic": {
        "status": {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "b5me51x6zln36xqtqgbw0hb6",
                "status": "success"
            },
            "createdAt": "2026-06-04T06:23:15.993Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        }
    },
    "all": [
        {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "ex9rp61k8m64ym1v6isp1ts8",
                "status": "loading"
            },
            "createdAt": "2026-06-04T06:23:15.320Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        },
        {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "ex9rp61k8m64ym1v6isp1ts8",
                "status": "success"
            },
            "createdAt": "2026-06-04T06:23:15.790Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        },
        {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "b5me51x6zln36xqtqgbw0hb6",
                "status": "loading"
            },
            "createdAt": "2026-06-04T06:23:15.806Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        },
        {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "b5me51x6zln36xqtqgbw0hb6",
                "status": "success"
            },
            "createdAt": "2026-06-04T06:23:15.993Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        }
    ],
    "last": {
        "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
        "topic": "status",
        "data": {
            "nodeId": "b5me51x6zln36xqtqgbw0hb6",
            "status": "success"
        },
        "createdAt": "2026-06-04T06:23:15.993Z",
        "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
        "kind": "data",
        "envId": "00000000-0000-4000-b000-000000000000"
    },
    "delta": [
        {
            "channel": "http-request:cmpuozyd70000c4vuyiagy94c",
            "topic": "status",
            "data": {
                "nodeId": "b5me51x6zln36xqtqgbw0hb6",
                "status": "success"
            },
            "createdAt": "2026-06-04T06:23:15.993Z",
            "runId": "01KT8MSQPHXHWQX5NAXH6C3FSA",
            "kind": "data",
            "envId": "00000000-0000-4000-b000-000000000000"
        }
    ]
}

*/