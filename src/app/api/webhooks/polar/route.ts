import { Webhook } from "standardwebhooks";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.EMAIL_FROM ?? "FlowXcore <no-reply@hire-nihar.info>";

const BRAND = "FlowXcore";
const BRAND_COLOR = "#18181b";

/* ------------------------------ Helpers ------------------------------ */

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px;">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;font-weight:600;text-align:right;">${value}</td>
  </tr>`;

const layout = (preheader: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background:${BRAND_COLOR};padding:24px 32px;">
          <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">${BRAND}</span>
        </td></tr>
        <tr><td style="padding:32px;color:#111827;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">
          This is an automated message. Please keep it for your records.<br/>
          &copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* --------------------------- Email templates --------------------------- */

function buildReceiptEmail(order: any) {
  const sub = order.subscription;
  const product = esc(order.product?.name ?? "your plan");
  const ref = esc(order.invoice_number ?? order.id);
  const isTrial = sub?.status === "trialing" && order.total_amount === 0;

  if (isTrial) {
    const price = money(sub.amount, sub.currency);
    const interval = sub.recurring_interval; // "month"
    const trialEnd = fmtDate(sub.trial_end);

    const html = layout(
      `Your free trial of ${BRAND} has started. First charge: ${trialEnd}.`,
      `
      <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Your free trial has started</h1>
      <p style="margin:0 0 16px;">Thank you for subscribing to ${product}. Your first ${interval} is free, and no payment has been taken today.</p>
      <p style="margin:0 0 24px;">Your trial runs until <b>${trialEnd}</b>. From that date, your subscription will renew at <b>${price} per ${interval}</b> unless you cancel before then.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        ${row("Plan", product)}
        ${row("Free trial", `Until ${trialEnd}`)}
        ${row("Amount due today", money(0, order.currency))}
        ${row("First charge", `${trialEnd} (${price})`)}
        ${row("Recurring price", `${price} / ${interval}`)}
        ${row("Reference", ref)}
      </table>

      <p style="margin:0;color:#4b5563;font-size:14px;">You can cancel at any time before the trial ends and you will not be charged.</p>`,
    );

    const text = [
      `${BRAND} - Your free trial has started`,
      ``,
      `Thank you for subscribing to ${order.product?.name}. Your first ${interval} is free and no payment has been taken today.`,
      `Your trial runs until ${trialEnd}. After that, your subscription renews at ${price} per ${interval} unless you cancel before then.`,
      ``,
      `Plan: ${order.product?.name}`,
      `Amount due today: ${money(0, order.currency)}`,
      `First charge: ${trialEnd} (${price})`,
      `Reference: ${order.invoice_number ?? order.id}`,
    ].join("\n");

    return {
      subject: `Your ${BRAND} free trial has started`,
      html,
      text,
    };
  }

  // Regular paid order (first paid month, renewals, one-time purchases)
  const paid = money(order.total_amount, order.currency);
  const date = fmtDate(order.created_at);
  const period =
    sub?.current_period_start && sub?.current_period_end
      ? `${fmtDate(sub.current_period_start)} to ${fmtDate(sub.current_period_end)}`
      : null;

  const html = layout(
    `Payment of ${paid} received for ${BRAND}.`,
    `
    <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Payment receipt</h1>
    <p style="margin:0 0 24px;">Thank you. We have received your payment for ${product}.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${row("Plan", product)}
      ${row("Amount paid", paid)}
      ${row("Date", date)}
      ${period ? row("Billing period", period) : ""}
      ${row("Reference", ref)}
    </table>

    ${
      sub
        ? `<p style="margin:0;color:#4b5563;font-size:14px;">Your subscription renews automatically each ${sub.recurring_interval}. You can cancel at any time.</p>`
        : ""
    }`,
  );

  const text = [
    `${BRAND} - Payment receipt`,
    ``,
    `Thank you. We have received your payment for ${order.product?.name}.`,
    ``,
    `Amount paid: ${paid}`,
    `Date: ${date}`,
    period ? `Billing period: ${period}` : "",
    `Reference: ${order.invoice_number ?? order.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: `Payment receipt - ${BRAND}`, html, text };
}

/* ------------------------------ Webhook ------------------------------ */

export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const body = await req.text(); // raw body, read once

  let event: any;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "webhook-id": req.headers.get("webhook-id") ?? "",
      "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": req.headers.get("webhook-signature") ?? "",
    });
  } catch (err) {
    console.error("Invalid signature:", err);
    return new Response("Invalid signature", { status: 403 });
  }

  console.log("Verified. Event type:", event.type);

  // Only order.paid matters. Ignore the rest.
  if (event.type !== "order.paid") {
    return new Response(null, { status: 202 });
  }

  const order = event.data;
  const email: string = order.customer.email;

  try {
    const { subject, html, text } = buildReceiptEmail(order);

    await resend.emails.send(
      { from: FROM, to: email, subject, html, text },
      { idempotencyKey: `receipt-${order.id}` }, // retries won't resend
    );
  } catch (err) {
    console.error("Email failed:", err);
    return new Response("Email failed", { status: 500 }); // Polar will retry
  }

  return new Response(null, { status: 202 });
}