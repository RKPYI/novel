import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import {nextCookies} from "better-auth/next-js";

export const auth = betterAuth({
  // Explicitly set baseURL so OAuth redirects work correctly in all environments
  baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || process.env.AUTH_URL || "",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  // Map Prisma models/fields to Better Auth expectations
  user: {
    modelName: "user",
    fields: {
      name: "name",
      email: "email",
      emailVerified: "emailVerified",
      image: "image",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    additionalFields: {
      role: { type: "string", fieldName: "role" },
    },
  },
  session: {
    storeSessionInDatabase: false,
  },
  account: {
    modelName: "account",
    fields: {
      providerId: "provider",
      accountId: "providerAccountId",
      userId: "userId",
      password: "password",
      type: "type",
      // OAuth token fields mapping (our DB uses snake_case)
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      tokenType: "token_type",
      scope: "scope",
      sessionState: "session_state",
      expiresAt: "expires_at",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  verification: {
    modelName: "verificationToken",
    fields: {
      identifier: "identifier",
      value: "token",
      expiresAt: "expires",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  // Enable email/password and Google social provider
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
});
