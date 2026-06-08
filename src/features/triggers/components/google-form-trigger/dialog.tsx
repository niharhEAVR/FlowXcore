"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateGoogleFormScript } from "./utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({
    open,
    onOpenChange
}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    // Construct the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webhookUrl =
        `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const script = generateGoogleFormScript(webhookUrl);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[80vh] flex flex-col">

                <DialogHeader>
                    <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's Apps Script to trigger
                        this workflow when a form is submitted.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
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
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(webhookUrl);
                                        toast.success("Webhook URL copied to clipboard");
                                    } catch {
                                        toast.error("Failed to copy URL");
                                    }
                                }}
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup instructions:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open your Google Form.</li>

                            <li>
                                Click on <strong>Three Dot</strong> →{" "}
                                <img
                                    src="/logos/Google_Apps_Script.svg"
                                    alt="Google Apps Script"
                                    className="w-4 h-4 inline"
                                />{" "}
                                Apps Script.
                            </li>

                            <li>Replace the default code in the Apps Script editor with the generated script below.</li>

                            <li>Save the script and authorize any permissions Google requests.</li>

                            <li>Open the <strong>Triggers</strong> panel and click <strong>Add Trigger</strong>.</li>

                            <li>Select the <code>onFormSubmit</code> function.</li>

                            <li>Select <strong>Head</strong> as the deployment.</li>

                            <li>Select <strong>From form</strong> as the event source.</li>

                            <li>Select <strong>On form submit</strong> as the event type.</li>

                            <li>Save the trigger configuration.</li>
                        </ol>
                    </div>


                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Script:</h4>
                        <Textarea
                            defaultValue={script}
                            readOnly
                            className="min-h-[300px] font-mono text-xs"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(script);
                                    toast.success("Script copied to clipboard");
                                } catch {
                                    toast.error("Failed to copy Script to clipboard");
                                }
                            }}
                        >
                            <CopyIcon className="size-4 mr-2" />
                            Copy Google Apps Script
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            This script includes your webhook URL and handles form submissions
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};