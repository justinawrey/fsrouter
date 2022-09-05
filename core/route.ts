import { path } from "../deps.ts";
import { type FsHandler } from "./types.ts";
import { Slug } from "./slug.ts";
import { type Matches } from "./slug.ts";

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

  // Sort an array of routes by number of raw parts, longest to shortest
  static sort(routes: Route[]): Route[] {
    routes.sort((a, b) => {
      const lengthFactor = b.rawParts.length - a.rawParts.length;

      // If they're the same length, we could be in an inconclusive situation like:
      // a: /[test]/raw
      // b: /blog/[id]
      // In this case, sort by longest 'raw base path'
      if (lengthFactor === 0) {
        return b.baseLength - a.baseLength;
      }

      // Otherwise just sort by sheer number of raw parts
      return lengthFactor;
    });

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

  // The length of the 'base' of the route, e.g. how many raw
  // parts it has before a slug part occurs.
  // For example, /hi/its/[me] has baseLength 2.
  get baseLength(): number {
    let baseLength = 0;

    for (const part of this.parts) {
      if (!Slug.isSlug(part)) {
        baseLength++;
      } else {
        break;
      }
    }

    return baseLength;
  }

  // Slugs from the filename, with the '[' and ']' characters stripped away
  get slugs(): Slug[] {
    return this.parts.filter((part) => Slug.isSlug(part)).map((slug) =>
      new Slug(slug)
    );
  }

  get rawParts(): string[] {
    return this.parts.filter((part) => !Slug.isSlug(part));
  }

  // Whether or not this route has slugs in it
  get hasSlugs(): boolean {
    return this.slugs.length > 0;
  }

  get regEx(): RegExp {
    function getPartRegex(part: string): string {
      if (!Slug.isSlug(part)) {
        return part;
      }

      return new Slug(part).regEx;
    }

    return new RegExp(
      "^\\/" +
        this.parts.map(getPartRegex).join("\\/") +
        "$",
      "g",
    );
  }

  matches(urlPath: string, convertToNumber: boolean): Matches | null {
    const matches = this.regEx.exec(urlPath);
    if (!matches) {
      return null;
    }

    const matchObj: Matches = {};
    for (const [index, match] of matches.slice(1).entries()) {
      const shouldConvert = this.slugs[index].type === "number" &&
        convertToNumber;

      matchObj[this.slugs[index].raw] = shouldConvert ? parseInt(match) : match;
    }

    return matchObj;
  }
}
