import { type Handler, resolve, walk, type WalkOptions } from "./deps.ts";
import { parseRoute } from "./parse.ts";
import type { MapValueType } from "./_util.ts";

// A map of route strings to their respective handler functions
type RouteMap = Map<string, Handler>;

// Given a map of routes to their respective handlers, returns a single
// handler that correctly forwards requests to the right handler.
// If a route is hit that doesn't exist, the returned handler will 404.
function handleRoutes(routeMap: RouteMap): MapValueType<RouteMap> {
  return (req, connInfo) => {
    const route = new URL(req.url).pathname;

    // TODO: This isn't a real 404
    if (!routeMap.has(route)) return new Response("404");

    // Unfortunately we still have to assert the Handler type here, even though
    // we're now sure that the route indeed does exist in the route map
    const handler = routeMap.get(route) as MapValueType<RouteMap>;
    return handler(req, connInfo);
  };
}

// fsRouter creates a Handler which handles requests
// according to the shape of the filesystem at the given rootDir.
// Each file within rootDir must provide a Handler as its default export.
// The provided handler will be used to execute requests if the requested route
// matches the file's position in the filesystem.
export default async function fsRouter(rootDir: string): Promise<Handler> {
  const routeMap: RouteMap = new Map();

  const walkOpts: WalkOptions = {
    // Exclude directories when walking the filesystem.  We only care
    // about files which have declared handlers in them.
    includeDirs: false,

    // Only allow typescript files because they are the only files which
    // will have actual handler definitions.
    // TODO: maybe act as a static file server for all other files?
    exts: [".ts"],
  };

  for await (const filePath of walk(rootDir, walkOpts)) {
    // Derive the correct route from raw file paths,
    // e.g. /example/blog/post.ts -> /blog/post (where example is the root directory)
    const absolutePath = resolve(Deno.cwd(), filePath.path);
    const absoluteRootDir = resolve(Deno.cwd(), rootDir);
    const route = parseRoute(absoluteRootDir, absolutePath);

    // Load up all of the files that should be handling routes and
    // save the information in the route map
    const handler = (await import(absolutePath)).default;
    routeMap.set(route, handler);
  }

  console.log(routeMap);

  return handleRoutes(routeMap);
}
