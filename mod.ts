import { extname, type Handler, join, serve } from "./deps.ts";

const pathMap = new Map<string, Handler>();

for await (const dirEntry of Deno.readDir("example")) {
  const basename = dirEntry.name;
  const ext = extname(basename);
  const path = "/" + basename.replace(ext, "");

  const handler = await import(join(Deno.cwd(), "example", basename));
  pathMap.set(path, handler.default);
}

const handleRequest: Handler = (req, connInfo) => {
  const { pathname } = new URL(req.url);
  if (!pathMap.has(pathname)) return new Response("404");

  const handler = pathMap.get(pathname) as Handler;
  return handler(req, connInfo);
};

serve(handleRequest);
