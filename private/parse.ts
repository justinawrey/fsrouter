import { extname, relative } from "./deps/std/path.ts";

function removeExtension(path: string) {
  const ext = extname(path);
  return path.slice(0, -ext.length);
}

function removeIndex(path: string) {
  if (!path.endsWith("/index")) {
    return path;
  }

  return path.slice(0, -6);
}

// parseRoute takes an absolute file path and transforms it into
// a valid route to which requests can be routed
export function parseRoute(
  absoluteRootDir: string,
  absolutePath: string,
): string {
  let route = "/" + relative(absoluteRootDir, absolutePath);

  // Do some processing on the file path to turn it into a valid route
  route = removeExtension(route);
  route = removeIndex(route);

  return route || "/";
}
