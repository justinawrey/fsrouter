import { fsRouter } from "../core/entry.ts";
import { path } from "../deps.ts";

// @ts-ignore - bench exists?
// TODO: this doesn't work?
Deno.bench("Boot -- walk fs", async () => {
  await fsRouter(
    path.fromFileUrl(import.meta.resolve("../example/pages")),
    { bootMessage: false, debug: true },
  );
});
