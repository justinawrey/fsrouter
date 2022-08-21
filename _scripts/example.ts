import { serve } from "../private/deps/std/http.ts";
import { fsRouter } from "../mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

serve(await fsRouter("pages"));
