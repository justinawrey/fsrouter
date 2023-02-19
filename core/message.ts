import { colors, jsonTree, path } from "../deps.ts";
import { removeExtension, type Route } from "./route.ts";

// Logs a warning message saying that you
// may have accidentally started a server with no routes
export function errorRootDirEmpty(rootDir: string): void {
  console.log("");
  error(
    `directory ${colors.bold(rootDir)} is empty - 0 routes are being served`,
  );
  console.log("");
}

export function errorDirNotFound(rootDir: string): void {
  error(`directory ${colors.bold(rootDir)} could not be found`);
}

export function errorRootDirRelative(rootDir: string): void {
  error(
    `directory ${
      colors.bold(rootDir)
    } is a relative path - please provide an absolute path using ${
      colors.bold("import.meta.resolve")
    }`,
  );
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

  // TODO: all of this is ripe for cleaning up
  // deno-lint-ignore no-explicit-any
  const tree: Record<any, any> = {
    [formattedRootDir]: {},
  };

  // Build the json tree
  // TODO: this is not exactly right for when cwd()
  // is a level deeper than rootDir
  let root = tree[formattedRootDir];
  for (let { relativePath } of routes) {
    relativePath = relativePath.replace(relativeRootDir, "");
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }
    const parts = relativePath.split("/");

    for (const part of parts) {
      if (!(part in root)) {
        root[part] = {};
      }
      root = root[part];
    }

    root = tree[formattedRootDir];
  }

  // Traverse again to fill in displayed routes
  // deno-lint-ignore no-explicit-any
  function traverse(root: Record<any, any>, displayRoute: string) {
    for (const key in root) {
      const nextTree = root[key];
      const nextDisplayRoute = `${displayRoute}/${key}`;

      if (Object.keys(nextTree).length === 0) {
        root[key] = nextDisplayRoute;
      }

      traverse(nextTree, nextDisplayRoute);
    }
  }
  traverse(root, "");

  const treeString = jsonTree(tree, {
    showValues: true,
    align: true,
    seperator: "  →   ",
    keyTransform: (key, leaf) => leaf ? colors.cyan(key) : key,
    valueTransform: (key) => colors.bold(colors.italic(removeExtension(key))),
  });

  console.log(`${treeString}\n`);
}

export function error(msg: string): void {
  console.log(colors.red(colors.bold(colors.italic("Error:"))) + " " + msg);
}
