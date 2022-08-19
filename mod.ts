import { Handler, join, serve, walk } from "./deps.ts";

const pathMap = new Map<string, Handler>();

for await (const entry of walk("example", { includeDirs: false })) {
  const { path } = entry;

  console.log(path);

  const route = path.replace("example", "").replace(".ts", "");

  const handler = await import(join(Deno.cwd(), path));
  pathMap.set(route, handler.default);
}

const handleRequest: Handler = (req, connInfo) => {
  const { pathname } = new URL(req.url);

  console.log(pathname);

  if (!pathMap.has(pathname)) return new Response("404");

  const handler = pathMap.get(pathname) as Handler;
  return handler(req, connInfo);
};

console.log(pathMap);

serve(handleRequest);
