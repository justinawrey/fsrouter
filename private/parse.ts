import { relative } from "./deps/std/path.ts";

// parseRoute takes an absolute file path and transforms it into
// a valid route to which requests can be routed
function parseRoute(absoluteRootDir: string, absolutePath: string): string {
  let route = "/" + relative(absoluteRootDir, absolutePath);

  // TODO: this feels janky, although this should work just fine
  if (route.endsWith(".ts")) {
    route = route.slice(0, -3);
  }

  if (route.endsWith("index")) {
    route = route.slice(0, -5);
  }

  // Strip trailing '/' from folders acting as index.ts
  if (route !== "/" && route.endsWith("/")) {
    route = route.slice(0, -1);
  }

  return route;
}

export { parseRoute };
