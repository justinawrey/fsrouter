import { colors, path } from "./deps.ts";
import { type Route } from "./route.ts";

// Logs a warning message saying that you
// may have accidentally started a server with no routes
export function errorMessage(rootDir: string) {
  console.log("");
  console.log(
    colors.red(
      `${colors.bold("Warning:")} directory ${
        colors.bold(rootDir)
      } is empty - 0 routes are being served`,
    ),
  );
  console.log("");
}

// Logs a boot message containing information about
// which files map to which routes
export function bootMessage(routes: Route[], rootDir: string) {
  const relativeRootDir = path.relative(Deno.cwd(), rootDir);

  console.log("");
  console.log(
    colors.bold(
      `Serving ${colors.cyan(routes.length.toString())} ${
        routes.length === 1 ? "route" : "routes"
      } from directory ${colors.cyan(relativeRootDir)}:\n`,
    ),
  );
  for (const { relativePath, parsed } of routes) {
    console.log(
      `- ${colors.bold(colors.cyan(relativePath))} -> ${
        colors.bold(colors.cyan(parsed))
      }`,
    );
  }
  console.log("");
}
