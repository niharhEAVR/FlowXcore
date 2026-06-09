"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { ArrowLeftRight } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const StripeTriggerDialog = ({
  open,
  onOpenChange
}: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const webhookUrl =
    `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-auto max-h-[60vh]">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                defaultValue={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions: Example guide</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard.</li>
              <li>Go to <strong>Workbench</strong> → <strong>Webhooks</strong>.</li>
              <li>
                Click{" "}
                <Button size={"sm2"} className="cursor-auto">
                  <PlusIcon className="w-4 h-4 inline" /> Add destination
                </Button>
              </li>
              <li>Select the event you want to listen for, for example <strong>checkout.session.completed</strong>, then click <strong>Continue</strong>.</li>
              <li>Select <strong>Webhook endpoint</strong>, then click <strong>Continue</strong>.</li>
              <li>Paste the webhook URL provided above.</li>
              <li>
                Click{" "}
                <Button size={"sm2"} className="cursor-auto">
                  Create destination
                </Button>
              </li>
              <li>
                In this example, we are using <strong>checkout.session.completed</strong>, so we need to update the destination settings.
              </li>
              <li>
                Click{" "}
                <Button variant={"outline"} size={"sm2"} className="cursor-auto">
                  Edit destination
                </Button>{" "}
                and add <strong>payment_intent.succeeded</strong> as an additional event, then click <strong>Save</strong>.
              </li>
              <li>
                Finally, click{" "}
                <Button variant={"outline"} size={"sm2"} className="cursor-auto">
                  <ArrowLeftRight className="w-4 h-4" /> Send test events
                </Button>{" "}
                and follow the on-screen instructions.
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.amount}}"}</code> - Payment amount</li>
              <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.currency}}"}</code> - Currency code</li>
              <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.customerId}}"}</code> - Customer ID</li>
              <li><code className="bg-background px-1 py-0.5 rounded">{"{{json stripe}}"}</code> - Full event data as JSON</li>
              <li><code className="bg-background px-1 py-0.5 rounded">{"{{stripe.eventType}}"}</code> - Event type (e.g., checkout.session.completed)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};