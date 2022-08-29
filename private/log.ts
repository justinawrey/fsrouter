import { bold, cyan, red } from "./deps/std/fmt.ts";
import { relative } from "./deps/std/path.ts";
import { type Route } from "./route.ts";

// Logs a warning message saying that you
// may have accidentally started a server with no routes
export function errorMessage(rootDir: string) {
  console.log("");
  console.log(
    red(
      `${bold("Warning:")} directory ${
        bold(rootDir)
      } is empty - 0 routes are being served`,
    ),
  );
  console.log("");
}

// Logs a boot message containing information about
// which files map to which routes
export function bootMessage(routes: Route[], rootDir: string) {
  const relativeRootDir = relative(Deno.cwd(), rootDir);

  console.log("");
  console.log(
    bold(
      `Serving ${cyan(routes.length.toString())} ${
        routes.length === 1 ? "route" : "routes"
      } from directory ${cyan(relativeRootDir)}:\n`,
    ),
  );
  for (const { relativePath, parsed } of routes) {
    console.log(`- ${bold(cyan(relativePath))} -> ${bold(cyan(parsed))}`);
  }
  console.log("");
}
