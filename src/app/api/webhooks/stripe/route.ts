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

    const stripeData = {
      // Event metadata
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
    };

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 },
    );
  }
};

// This API route can be called by this url: /api/webhooks/stripe?workflowId=your_workflow_id



// this is what stripe response look like
/*
{
  "stripe": {
    "eventId": "evt_3TgJ********************",
    "eventType": "payment_intent.succeeded",
    "livemode": false,
    "raw": {
      "amount": 2000,
      "amount_capturable": 0,
      "amount_details": {
        "tip": {}
      },
      "amount_received": 2000,
      "application": null,
      "application_fee_amount": null,
      "automatic_payment_methods": null,
      "canceled_at": null,
      "cancellation_reason": null,
      "capture_method": "automatic_async",
      "client_secret": "pi_3T***************************************",
      "confirmation_method": "automatic",
      "created": 1780988368,
      "currency": "usd",
      "customer": null,
      "customer_account": null,
      "description": "(created by Stripe CLI)",
      "excluded_payment_method_types": null,
      "id": "pi_3Tg***********************",
      "last_payment_error": null,
      "latest_charge": "ch_3TgJd*****************",
      "livemode": false,
      "managed_payments": {
        "enabled": false
      },
      "metadata": {},
      "next_action": null,
      "object": "payment_intent",
      "on_behalf_of": null,
      "payment_method": "pm_1TgJ********************",
      "payment_method_configuration_details": null,
      "payment_method_options": {
        "card": {
          "installments": null,
          "mandate_options": null,
          "network": null,
          "request_three_d_secure": "automatic"
        }
      },
      "payment_method_types": [
        "card"
      ],
      "processing": null,
      "receipt_email": null,
      "review": null,
      "setup_future_usage": null,
      "shared_payment_granted_token": null,
      "shipping": {
        "address": {
          "city": "San Francisco",
          "country": "US",
          "line1": "510 Townsend St",
          "line2": null,
          "postal_code": "94103",
          "state": "CA"
        },
        "carrier": null,
        "name": "Jenny Rosen",
        "phone": null,
        "tracking_number": null
      },
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    },
    "timestamp": 1780988369
  }
}
*/