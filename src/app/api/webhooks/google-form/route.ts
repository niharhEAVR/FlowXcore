import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: workflowId" },
        { status: 400 },
      );
    };

    const body = await request.json();

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );

  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Google Form submission" },
      { status: 500 },
    );
  }
};

// This API route can be called by this url: /api/webhooks/google-form?workflowId=your_workflow_id


// this is what google form response look like
/*
{
  "googleForm": {
    "formId": "1ldju6A*********************",
    "formTitle": "FlowXcore Test",
    "raw": {
      "formId": "1ldju6A*********************",
      "formTitle": "FlowXcore Test",
      "respondentEmail": "",
      "responseId": "2_ABaOnu*******************************************",
      "responses": {
        "url": "https://jsonplaceholder.typicode.com/users/3"
      },
      "timestamp": "2026-06-09T07:01:08.180Z"
    },
    "respondentEmail": "",
    "responseId": "2_ABaOnu*******************************************",
    "responses": {
      "url": "https://jsonplaceholder.typicode.com/users/3"
    },
    "timestamp": "2026-06-09T07:01:08.180Z"
  }
}
*/