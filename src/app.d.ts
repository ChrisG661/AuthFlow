// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />
declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface Platform {}
  interface Platform {
    env?: {
      //YOUR_KV_NAMESPACE: KVNamespace;
      //YOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;
    };
    context: {
      waitUntil(promise: Promise<any>): void;
    };
    caches: CacheStorage & { default: Cache };
  }
  interface UserSession {
    user: import("@supabase/supabase-js").User;
    accessToken?: string;
  }
  interface Locals extends UserSession {
    error: import("@supabase/supabase-js").ApiError;
  }

  interface Session extends UserSession { } // interface Platform {} // interface Stuff {}
}
