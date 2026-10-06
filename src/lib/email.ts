import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.EMAIL_FROM ?? "FlowXcore <no-reply@hire-nihar.info>";


export async function sendVerificationEmail(
    email: string,
    url: string,
) {

    const { data, error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Verify your FlowXcore account",

        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your FlowXcore account</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
    font-family: Arial, Helvetica, sans-serif;
    color: #18181b;
">

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="background-color: #f4f4f5; padding: 40px 16px;"
    >
        <tr>
            <td align="center">

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="
                        max-width: 560px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                    "
                >

                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px 20px;">
                            <h1 style="
                                margin: 0;
                                font-size: 26px;
                                font-weight: 700;
                                color: #18181b;
                            ">
                                FlowXcore
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 40px;">

                            <h2 style="
                                margin: 0 0 16px;
                                font-size: 24px;
                                line-height: 1.3;
                                color: #18181b;
                            ">
                                Verify your email
                            </h2>

                            <p style="
                                margin: 0 0 16px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: #52525b;
                            ">
                                Thanks for signing up for FlowXcore.
                                Please verify your email address to
                                complete your account setup.
                            </p>

                            <!-- Button -->
                            <table
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="margin: 28px 0;"
                            >
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            background-color: #18181b;
                                            border-radius: 8px;
                                        "
                                    >
                                        <a
                                            href="${url}"
                                            style="
                                                display: inline-block;
                                                padding: 13px 24px;
                                                font-size: 15px;
                                                font-weight: 600;
                                                color: #ffffff;
                                                text-decoration: none;
                                            "
                                        >
                                            Verify my email
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="
                                margin: 0 0 12px;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #71717a;
                            ">
                                This verification link will expire
                                after 1 hour.
                            </p>

                            <p style="
                                margin: 24px 0 8px;
                                font-size: 14px;
                                line-height: 1.6;
                                color: #71717a;
                            ">
                                If the button above doesn't work,
                                copy and paste this link into your browser:
                            </p>

                            <p style="
                                margin: 0;
                                font-size: 13px;
                                line-height: 1.6;
                                word-break: break-all;
                            ">
                                <a
                                    href="${url}"
                                    style="
                                        color: #2563eb;
                                        text-decoration: none;
                                    "
                                >
                                    ${url}
                                </a>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            padding: 24px 40px;
                            border-top: 1px solid #e4e4e7;
                        ">
                            <p style="
                                margin: 0;
                                font-size: 12px;
                                line-height: 1.5;
                                color: #a1a1aa;
                            ">
                                If you didn't create a FlowXcore account,
                                you can safely ignore this email.
                            </p>

                            <p style="
                                margin: 12px 0 0;
                                font-size: 12px;
                                color: #a1a1aa;
                            ">
                                © ${new Date().getFullYear()} FlowXcore
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
        `,

        text: `
Welcome to FlowXcore!

Please verify your email address to complete your account setup.

Verify your email:
${url}

This verification link will expire after 1 hour.

If you didn't create a FlowXcore account, you can safely ignore this email.

© ${new Date().getFullYear()} FlowXcore
        `,
    });

    if (error) {
        throw new Error(
            "We couldn't send the verification email. Please try again."
        );
    }


    return data;
}