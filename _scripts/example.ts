import { serve } from "../private/deps/std/http.ts";
import { fromFileUrl } from "../private/deps/std/path.ts";
import { fsRouter } from "../mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

const rootDir = fromFileUrl(import.meta.resolve("./pages"));
serve(await fsRouter(rootDir));
