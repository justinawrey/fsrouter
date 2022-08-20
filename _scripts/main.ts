import { serve } from "std/http/server.ts";
import { fsRouter } from "../mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

if (Deno.args.length !== 1) {
  console.log(
    "Usage: deno run --allow-read --allow-net _scripts/main.ts <dir>",
  );
  Deno.exit();
}

const dir = Deno.args[0];
serve(await fsRouter(dir));
