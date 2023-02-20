import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { fsRouter } from "../mod.ts";

serve(
  await fsRouter(import.meta.resolve("./pages"), {
    debug: true,
    generateManifest: false,
  }),
);
