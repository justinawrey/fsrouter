import { http, path } from "../private/deps.ts";
import { fsRouter } from "../mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

const rootDir = path.fromFileUrl(import.meta.resolve("./pages"));
http.serve(await fsRouter(rootDir));
