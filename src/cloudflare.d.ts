/**
 * Type declarations for the Cloudflare Workers runtime module.
 * Astro v6 uses `import { env } from "cloudflare:workers"` instead
 * of `Astro.locals.runtime.env`.
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/bindings/
 */
declare module 'cloudflare:workers' {
  const env: import('./types').Env;
  export { env };
}
