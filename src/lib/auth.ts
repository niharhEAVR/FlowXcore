import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

import { polar, checkout, portal, usage } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),

    emailAndPassword: {
        enabled: true,

        autoSignIn: false,

        requireEmailVerification: true,
    },

    emailVerification: {
        enabled: true,

        sendOnSignUp: true,

        sendVerificationEmail: async ({ user, url }) => {
            await sendVerificationEmail(user.email, url);
        },

        autoSignInAfterVerification: true,
        expiresIn: 3600,
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"], // Add your providers
        },
    },

    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            enableCustomartPortal: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "8b4a187d-79d4-44b6-b43b-98729bb855b6", // ID of Product from Polar Dashboard
                            slug: "FlowXcore" // Custom slug for easy reference in Checkout URL, e.g. /checkout/FlowXcore
                        }
                    ],
                    successUrl: "/success?checkout_id={CHECKOUT_ID}",
                    authenticatedUsersOnly: true,
                    returnUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
                }),
                portal(),
                usage(),
            ],
        })
    ]
});