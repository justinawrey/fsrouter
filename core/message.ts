import { colors, jsonTree, path } from "../deps.ts";
import { type Route } from "./route.ts";
import { iterate } from "./util.ts";

// Logs a warning message saying that you
// may have accidentally started a server with no routes
export function errorRootDirEmpty(rootDir: string): void {
  console.log("");
  error(
    `directory ${colors.bold(rootDir)} is empty - 0 routes are being served`,
  );
  console.log("");
}

export function errDirNotFound(rootDir: string): void {
  error(`directory ${colors.bold(rootDir)} could not be found`);
}

// Logs a boot message containing information about
// which files map to which routes
export function bootMessage(routes: Route[], rootDir: string): void {
  const relativeRootDir = path.relative(Deno.cwd(), rootDir);
  const formattedRootDir = relativeRootDir === "" ? "." : relativeRootDir;

  console.log("");
  console.log(
    colors.bold(
      `Serving ${colors.cyan(routes.length.toString())} ${
        routes.length === 1 ? "route" : "routes"
      } from directory ${colors.cyan(formattedRootDir)}:\n`,
    ),
  );

  // deno-lint-ignore no-explicit-any
  const tree: Record<any, any> = {
    [formattedRootDir]: {},
  };

  // Build the json tree
  let root = tree[formattedRootDir];
  for (const { relativePath } of routes) {
    const parts = relativePath.split("/").slice(2);

    for (const part of parts) {
      if (!(part in root)) {
        root[part] = {};
      }
      root = root[part];
    }

    root = tree[formattedRootDir];
  }

  iterate(tree);

  console.log(jsonTree.jsonTree(tree, false));
}

export function error(msg: string): void {
  console.log(colors.red(colors.bold(colors.italic("Error:"))) + " " + msg);
}
