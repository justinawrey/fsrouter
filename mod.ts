import {
  bold,
  cyan,
  errors,
  type Handler,
  isHttpError,
  resolve,
  walk,
  type WalkOptions,
} from "./deps.ts";
import { parseRoute } from "./src/parse.ts";
import type { MapValueType } from "./src/util.ts";

// A map of route strings to their respective handler functions
type RouteMap = Map<string, Handler>;

// A map of route string to their respective file names
type FileMap = Map<string, string>;

// Given a map of routes to their respective handlers, returns a single
// handler that correctly forwards requests to the right handler.
// If a route is hit that doesn't exist, the returned handler will 404.
function handleRoutes(routeMap: RouteMap): MapValueType<RouteMap> {
  return (req, connInfo) => {
    const route = new URL(req.url).pathname;

    // Respond with a 404 Not Found if asking for a route
    // that does not exist
    if (!routeMap.has(route)) {
      try {
        throw new errors.NotFound();
      } catch (e) {
        if (isHttpError(e)) {
          return new Response(e.message, { status: e.status });
        } else {
          throw e;
        }
      }
    }

    // Unfortunately we still have to assert the Handler type here, even though
    // we're now sure that the route indeed does exist in the route map
    const handler = routeMap.get(route) as MapValueType<RouteMap>;
    return handler(req, connInfo);
  };
}

// Logs a boot message containing information about
// which files map to which routes.
function bootMessage(fileMap: FileMap, rootDir: string) {
  console.log("");
  console.log(
    bold(
      `Serving ${cyan(fileMap.size.toString())} routes from directory ${
        cyan(rootDir)
      }:\n`,
    ),
  );
  fileMap.forEach((file, route) =>
    console.log(`- ${bold(cyan(file))} -> ${bold(cyan(route))}`)
  );
  console.log("");
}

/**
 * A collection of options to be passed in on initialization.
 */
interface RouterOptions {
  /**
   * Whether or not an information message should be shown on startup.
   * Defaults to true.
   */
  bootMessage?: boolean;
}

/**
 * fsRouter creates a Handler which handles requests
 * according to the shape of the filesystem at the given rootDir.
 * Each file within rootDir must provide a Handler as its default
 * export, which will be used to execute requests if the requested
 * route matches the file's position in the filesystem.
 *
 * Given a project with the following folder structure:
 *
 * ```bash
 * my-app/
 * ├─ pages/
 * │  ├─ blog/
 * │  │  ├─ post.ts
 * │  │  ├─ index.ts
 * │  ├─ about.ts
 * │  ├─ index.ts
 * ├─ mod.ts
 * ```
 *
 * Each "route file" must export a Handler as its default export:
 *
 * ```typescript
 * // my-app/pages/blog/post.ts
 * export default (req: Request) => {
 *   return new Response("hello world!");
 * };
 * ```
 *
 * Initialize `fsrouter`:
 *
 * ```typescript
 * // my-app/mod.ts
 * import { fsRouter } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";
 * import { serve } from "https://deno.land/std@{VERSION}/http/server.ts";
 *
 * // Use the file system router with base directory 'pages'
 * serve(await fsRouter("pages"));
 *
 * // Or, provide an options (RouterOptions) object:
 * // serve(await fsRouter("pages"), { bootMessage: false });
 * ```
 *
 * @param rootDir The directory at which routes will be served
 * @param opts An optional options object
 * @returns A Promise which resolves to a Handler
 */
async function fsRouter(
  rootDir: string,
  opts: RouterOptions = {
    bootMessage: true,
  },
): Promise<Handler> {
  const routeMap: RouteMap = new Map();
  const fileMap: FileMap = new Map();

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
    // save the information in respective maps
    const handler = (await import(absolutePath)).default;
    routeMap.set(route, handler);
    fileMap.set(route, filePath.path);
  }

  // If RouterOptions.bootMessage = true, show startup stats
  if (opts.bootMessage) {
    bootMessage(fileMap, rootDir);
  }

  return handleRoutes(routeMap);
}

export { fsRouter, type RouterOptions };
