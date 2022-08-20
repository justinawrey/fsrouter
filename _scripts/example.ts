import { serve } from "std/http/server.ts";
import { fromFileUrl } from "std/path/mod.ts";
import { fsRouter } from "../mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

const rootDir = fromFileUrl(import.meta.resolve("./pages"));
serve(await fsRouter(rootDir));
