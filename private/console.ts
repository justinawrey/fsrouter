import { bold, cyan, red } from "./deps/std/fmt.ts";
import { type FileMap } from "../mod.ts";

// Logs a warning message saying that you
// may have accidentally started a server with no routes
export function warningMessage(rootDir: string) {
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
export function bootMessage(fileMap: FileMap, rootDir: string) {
  console.log("");
  console.log(
    bold(
      `Serving ${cyan(fileMap.size.toString())} ${
        fileMap.size === 1 ? "route" : "routes"
      } from directory ${cyan(rootDir)}:\n`,
    ),
  );
  fileMap.forEach((file, route) =>
    console.log(`- ${bold(cyan(file))} -> ${bold(cyan(route))}`)
  );
  console.log("");
}
