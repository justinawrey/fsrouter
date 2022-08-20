import { serve } from "./deps.ts";
import { fsRouter } from "../public/mod.ts";

if (!import.meta.main) {
  Deno.exit();
}

if (Deno.args.length !== 1) {
  console.log("Usage: deno run --allow-read --allow-net main.ts <dir>");
  Deno.exit();
}

const dir = Deno.args[0];
serve(await fsRouter(dir));
