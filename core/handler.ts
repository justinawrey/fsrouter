import { colors, fs, http, log } from "../deps.ts";
import {
  bootMessage as _bootMessage,
  errorDirNotFound,
  errorRootDirEmpty,
} from "./message.ts";
import { notFound } from "./response.ts";
import { normalizeRootDir, Route } from "./route.ts";
import { setupLogger } from "./log.ts";

// Re-export
export * from "./types.ts";

// Given a map of routes to their respective handlers, returns a single
// handler that correctly forwards requests to the right handler.
// If a route is hit that doesn't exist, the returned handler will 404.
function handleRoutes(routes: Route[], options: RouterOptions): http.Handler {
  // Split routes into ones that are exact (don't have slugs) and ones that aren't
  const exactRoutes = routes.filter((route) => !route.hasSlugs);
  const slugRoutes = Route.sort(routes.filter((route) => route.hasSlugs));

  log.debug(
    "Slug matching order:",
    slugRoutes.map((route) => route.parsed),
  );

  // Make a map out of the exact routes for easier lookup
  const exactRouteMap = new Map<string, Route>(
    exactRoutes.map((route) => [route.parsed, route]),
  );

  return (req, connInfo) => {
    const urlPath = new URL(req.url).pathname;
    const exactRoute = exactRouteMap.get(urlPath);

    // Exact route (no slugs) found, serve it
    if (exactRoute) {
      log.debug(
        `Url ${colors.bold(urlPath)} matched exact file:`,
        exactRoute.relativePath,
      );
      return exactRoute.handler(req, {}, connInfo);
    }

    // Otherwise, try matching slug routes
    for (const slugRoute of slugRoutes) {
      const matches = slugRoute.matches(urlPath, options.convertToNumber);
      if (matches) {
        log.debug(
          `Url ${urlPath} matched file ${
            colors.bold(slugRoute.relativePath)
          } with parameters:`,
          matches,
        );
        log.debug("Matched with pattern:", slugRoute.regEx.toString());

        return slugRoute.handler(req, matches, connInfo);
      }
    }

    // Respond with a 404 Not Found if asking for a route
    // that does not exist
    return notFound();
  };
}

async function discoverRoutes(rootDir: string): Promise<Route[]> {
  const walkOpts: fs.WalkOptions = {
    // Exclude directories when walking the filesystem.  We only care
    // about files which have declared handlers in them.
    includeDirs: false,

    // Only allow typescript files because they are the only files which
    // will have actual handler definitions.
    // TODO: maybe act as a static file server for all other files?
    exts: [".ts", ".js", ".jsx", ".tsx"],
  };

  const files: fs.WalkEntry[] = [];
  try {
    for await (const filePath of fs.walk(rootDir, walkOpts)) {
      files.push(filePath);
    }
  } catch (_e) {
    // Deno bug: error should be instance of Deno.errors.NotFound
    // https://github.com/denoland/deno_std/issues/1310
    // TODO: isolate the error better when this is fixed
    errorDirNotFound(rootDir);
    Deno.exit(0);
  }

  log.debug("fs.walk found", files.length, "entries:", files);
  return Promise.all(
    files.map((file) => Route.create(file.path, rootDir)),
  );
}

/**
 * A collection of options to be passed in on initialization.
 */
export interface RouterOptions {
  /**
   * Whether or not an information message should be shown on startup.
   * Defaults to true.
   */
  bootMessage: boolean;

  /**
   * Whether or not to output debug information to console.
   * Defaults to false.
   */
  debug: boolean;

  /**
   * Whether or not slugs of type :number should be automatically converted to numbers
   * in the matches object.
   *
   * For example, given the slug [id:number]:
   * - if convertToNumber === true, then (typeof slugs.id) === 'number'
   * - if convertToNumber === false, then (typeof slugs.id) === 'string'
   *
   * Defaults to true.
   */
  convertToNumber: boolean;
}

const defaultOptions: RouterOptions = {
  bootMessage: true,
  debug: false,
  convertToNumber: true,
};

/**
 * fsRouter creates a standard library Handler which handles requests
 * according to the shape of the filesystem at the given rootDir.
 * Each file within rootDir must provide a FsHandler as its default
 * export, which will be used to execute requests if the requested
 * route matches the file's position in the filesystem.
 * See docs on FsHandler.
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
 * Each "route file" must export a FsHandler as its default export:
 *
 * ```typescript
 * // my-app/pages/blog/post.ts
 * export default (req: Request) => {
 *   return new Response("hello world!");
 * };
 * ```
 *
 * Initialize a server by calling `fsRouter`:
 *
 * ```typescript
 * // my-app/mod.ts
 * import { fsRouter } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";
 * import { serve } from "https://deno.land/std@{VERSION}/http/server.ts";
 *
 * // Use the file system router with base directory 'pages'
 * serve(await fsRouter(import.meta.resolve("./pages")));
 *
 * // Or, provide an options (RouterOptions) object:
 * // serve(await fsRouter(import.meta.resolve("./pages")), { bootMessage: false });
 * ```
 *
 * @param rootDir The directory at which routes will be served
 * @param opts An optional options object
 * @returns A Promise which resolves to a Handler
 */
export async function fsRouter(
  rootDir: string,
  options: Partial<RouterOptions> = {},
): Promise<http.Handler> {
  const mergedOptions: RouterOptions = {
    ...defaultOptions,
    ...options,
  };

  setupLogger(mergedOptions.debug);

  log.debug("fsRouter initialized with root dir:", rootDir);
  log.debug("fsRouter initialized with options:", mergedOptions);

  rootDir = normalizeRootDir(rootDir);
  const routes = await discoverRoutes(rootDir);
  if (routes.length === 0) {
    errorRootDirEmpty(rootDir);
    Deno.exit(0);
  }

  if (mergedOptions.bootMessage) {
    _bootMessage(routes, rootDir);
  }

  return handleRoutes(routes, mergedOptions);
}
