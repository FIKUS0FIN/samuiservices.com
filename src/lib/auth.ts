/* eslint-disable @typescript-eslint/no-require-imports */
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { PrismaClient } from "@prisma/client"
let _prismaClient: PrismaClient | null = null;

function initPrismaClient(): PrismaClient {
  if (_prismaClient) return _prismaClient;

  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_TEST_MODE === "true" || process.env.RENDER === "true") {
    // Hide native modules from bundlers by using eval to prevent Cloudflare WebAssembly/Native errors
        const req = eval('require');
    const { PrismaLibSql } = req("@prisma/adapter-libsql");
    const { PrismaClient: LocalClient } = req("@prisma/client");
    
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    const adapter = new PrismaLibSql({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
    _prismaClient = new LocalClient({ adapter, log: ["query"] });
  } else {
                    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    if (!env || !env.DB) throw new Error("Cloudflare DB binding not found");
        const { PrismaD1 } = require("@prisma/adapter-d1");
    // Use the Edge client to prevent WASM compilation errors on Cloudflare
        const { PrismaClient: EdgeClient } = require("@prisma/client/edge");
    const adapter = new PrismaD1(env.DB);
    _prismaClient = new EdgeClient({ adapter, log: ["query"] });
  }
  return _prismaClient!;
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = initPrismaClient();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email === 'dmytro@apex-root.com') {
        try {
          await prisma.user.update({
            where: { email: 'dmytro@apex-root.com' },
            data: { role: 'ADMIN' }
          });
        } catch (e) { console.error(e); }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session
    },
  },
}

if (process.env.NEXT_PUBLIC_TEST_MODE === "true" || process.env.ADMIN_TEST_PASSWORD) {
  authOptions.providers.push(
    CredentialsProvider({
      name: "Test Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password (for remote testing)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        console.log("--- AUTHORIZE ATTEMPT ---");
        console.log("Email:", credentials.email);
        console.log("Password provided:", credentials.password ? "***" : "none");
        
        let adminPassword = process.env.ADMIN_TEST_PASSWORD;
        console.log("process.env.ADMIN_TEST_PASSWORD exists:", !!adminPassword);

        if (process.env.NODE_ENV === "production") {
          try {
                            const { getCloudflareContext } = require("@opennextjs/cloudflare");
            const { env } = getCloudflareContext();
            console.log("Cloudflare env object exists:", !!env);
            console.log("env.ADMIN_TEST_PASSWORD exists:", !!env?.ADMIN_TEST_PASSWORD);
            // Always prefer runtime Cloudflare env over process.env which might be baked in
            if (env?.ADMIN_TEST_PASSWORD) {
              adminPassword = env.ADMIN_TEST_PASSWORD;
            }
          } catch (e) {
            console.error("Failed to get Cloudflare context for secrets", e);
          }
        }

        console.log("Final adminPassword set:", !!adminPassword);

        // If not in local test mode, enforce password check
        if (process.env.NEXT_PUBLIC_TEST_MODE !== "true") {
          console.log("Provided password length:", credentials.password?.length);
          console.log("Admin password length:", adminPassword?.length);
          
          if (!credentials.password || credentials.password.trim() !== adminPassword?.trim()) {
            console.log("Password mismatch! (Even after trim)");
            return null;
          }
        }
        
        console.log("Password matched or bypassed. Finding user...");
        
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: "Test User",
              role: (credentials.email === 'admin@admesamui.local' || credentials.email === 'dmytro@apex-root.com') ? 'ADMIN' : 'USER'
            }
          });
        } else if (credentials.email === 'dmytro@apex-root.com' && user.role !== 'ADMIN') {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
          });
        }
        return user;
      }
    })
  );
}
