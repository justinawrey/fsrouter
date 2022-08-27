import { type Handler } from "./deps/std/http.ts";
import { resolve, toFileUrl } from "./deps/std/path.ts";
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
function parseRoute(
  absoluteRootDir: string,
  absolutePath: string,
): string {
  let route = "/" + relative(absoluteRootDir, absolutePath);

  // Do some processing on the file path to turn it into a valid route
  route = removeExtension(route);
  route = removeIndex(route);

  return route || "/";
}

export class Route {
  constructor(
    // // The parsed route with file extension and /index stripped away
    public parsed: string,
    // // The original file name for this route
    public file: string,
    // // The Handler responsible for responding to requests
    public handler: Handler,
  ) {}

  static async create(
    filePath: string,
    rootDir: string,
  ): Promise<Route> {
    // Derive the correct route from raw file paths,
    // e.g. /example/blog/post.ts -> /blog/post (where example is the root directory)
    const absPath = toFileUrl(resolve(Deno.cwd(), filePath)).href;
    const absRootDir = toFileUrl(resolve(Deno.cwd(), rootDir)).href;

    return new this(
      parseRoute(absRootDir, absPath),
      filePath,
      (await import(absPath)).default as Handler,
    );
  }
}
