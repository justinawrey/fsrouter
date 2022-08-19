import { type Handler, join, parse, relative, walk } from "./deps.ts";

export default async function fsRouter(path: string): Promise<Handler> {
  const pathMap = new Map<string, Handler>();

  for await (const entry of walk(path, { includeDirs: false, exts: [".ts"] })) {
    const parsedPath = parse(entry.path);

    const relativeDir = relative(path, parsedPath.dir);
    let out = join(parsedPath.root, relativeDir, parsedPath.name);
    if (out.endsWith("index")) {
      out = out.slice(0, -5);
    }

    if (out !== "/" && out.endsWith("/")) {
      out = out.slice(0, -1);
    }

    const handler = await import(entry.path);
    pathMap.set(out, handler.default);
  }

  return (req, connInfo) => {
    const { pathname } = new URL(req.url);

    if (!pathMap.has(pathname)) return new Response("404");

    const handler = pathMap.get(pathname) as Handler;
    return handler(req, connInfo);
  };
}
