import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { fsRouter } from "../mod.ts";
import { path } from "../deps.ts";

serve(await fsRouter(path.fromFileUrl(import.meta.resolve("./pages"))));
