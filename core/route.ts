import { path } from "../deps.ts";
import { type FsHandler } from "./handler.ts";

function removeExtension(filePath: string): string {
  const ext = path.extname(filePath);
  return filePath.slice(0, -ext.length);
}

function removeIndex(filePath: string): string {
  if (!filePath.endsWith("/index")) {
    return filePath;
  }

  return filePath.slice(0, -6);
}

function isSlug(part: string): boolean {
  return part.startsWith("[") && part.endsWith("]") && part.length > 2;
}

// parseRoute takes an absolute file path and transforms it into
// a valid route to which requests can be routed
function parseRoute(
  absoluteRootDir: string,
  absolutePath: string,
): string {
  let route = "/" + path.relative(absoluteRootDir, absolutePath);

  // Do some processing on the file path to turn it into a valid route
  route = removeExtension(route);
  route = removeIndex(route);

  return route || "/";
}

export class Route {
  constructor(
    // The original file name for this route, from fs.walk
    public file: string,
    // The absolute path of the route
    public absPath: string,
    // The absolute root dir from which the router was started
    public absRootDir: string,
    // The RouterHandler in charge of responding to http requests for this route
    public handler: FsHandler,
  ) {}

  static async create(
    filePath: string,
    rootDir: string,
  ): Promise<Route> {
    // Derive the correct route from raw file paths,
    // e.g. /example/blog/post.ts -> /blog/post (where example is the root directory)
    const absPath = path.toFileUrl(path.resolve(Deno.cwd(), filePath)).href;
    const absRootDir = path.toFileUrl(path.resolve(Deno.cwd(), rootDir)).href;

    return new this(
      filePath,
      absPath,
      absRootDir,
      (await import(absPath)).default as FsHandler,
    );
  }

  // Sort an array of routes by length, longest to shortest
  static sort(routes: Route[]): Route[] {
    routes.sort((a, b) => b.length - a.length);
    return routes;
  }

  get relativePath(): string {
    return path.relative(Deno.cwd(), this.file);
  }

  // The parsed route, e.g. with file extension and trailing '/index' stripped away
  get parsed(): string {
    return parseRoute(this.absRootDir, this.absPath);
  }

  // A list of '/' delimited 'parts' of the route
  get parts(): string[] {
    return this.parsed.split("/").filter((part) => part !== "");
  }

  // The amount of '/' delimited 'parts' the route has
  get length(): number {
    return this.parts.length;
  }

  // Slugs from the filename, with the '[' and ']' characters stripped away
  get slugs(): string[] {
    return this.parts.filter((part) => isSlug(part)).map((slug) =>
      slug.slice(1, -1)
    );
  }

  // Whether or not this route has slugs in it
  get hasSlugs(): boolean {
    return this.slugs.length > 0;
  }

  get regEx(): RegExp {
    return new RegExp(
      "^\\/" +
        this.parts.map((part) => isSlug(part) ? "(\\w+)" : part).join("\\/") +
        "$",
      "g",
    );
  }

  matches(urlPath: string): Record<string, string> | null {
    const matches = this.regEx.exec(urlPath);
    if (!matches) {
      return null;
    }

    const matchObj: Record<string, string> = {};
    for (const [index, match] of matches.slice(1).entries()) {
      matchObj[this.slugs[index]] = match;
    }

    return matchObj;
  }
}
