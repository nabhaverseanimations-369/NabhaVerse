import { z } from "zod";
import type { ZodRawShape, ZodTypeAny } from "zod";

/**
 * Environment variable validation for NabhaVerse Studio.
 *
 * Environment variables are validated once at startup using Zod schemas so
 * that missing or malformed configuration fails fast with a descriptive
 * error instead of surfacing as a runtime `undefined` bug deep in the app.
 */

export interface CreateEnvOptions<TShape extends ZodRawShape> {
  /** Zod object schema describing every expected environment variable. */
  schema: z.ZodObject<TShape>;
  /** Source of raw environment variables. Defaults to `process.env`. */
  values?: Record<string, string | undefined>;
}

/** Type-safe, validated environment object inferred from a Zod schema. */
export type Env<TShape extends ZodRawShape> = z.infer<z.ZodObject<TShape>>;

function readProcessEnv(): Record<string, string | undefined> {
  const candidate = globalThis as {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return candidate.process?.env ?? {};
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

/**
 * Validates the provided (or process-wide) environment variables against a
 * Zod schema, returning a fully typed, immutable environment object.
 *
 * @throws {Error} A descriptive error listing every invalid/missing variable.
 */
export function createEnv<TShape extends ZodRawShape>({
  schema,
  values = readProcessEnv(),
}: CreateEnvOptions<TShape>): Env<TShape> {
  const result = schema.safeParse(values);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${formatIssues(result.error)}\n\nCheck your .env.local file against .env.example.`,
    );
  }

  return Object.freeze(result.data) as Env<TShape>;
}

/** Reusable schema fragment for `NODE_ENV`. */
export const nodeEnvSchema: ZodTypeAny = z
  .enum(["development", "test", "production"])
  .default("development");

/** Reusable schema fragment for a required, non-empty URL string. */
export const urlSchema: ZodTypeAny = z.string().url();

/** Reusable schema fragment for a required, non-empty secret/token string. */
export const secretSchema: ZodTypeAny = z.string().min(1, "must not be empty");

/** Common server-side environment schema shared across NabhaVerse services. */
export const commonServerEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  DATABASE_URL: urlSchema,
  REDIS_URL: urlSchema,
  JWT_SECRET: secretSchema,
});

/** Common browser-exposed environment schema for the Next.js web app. */
export const commonClientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: urlSchema,
});

export { z };
