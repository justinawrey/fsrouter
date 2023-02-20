import { RouterOptions } from "./handler.ts";
import { type Route } from "./route.ts";
import { colors, log, path } from "../deps.ts";

export function generateManifest(
  routes: Route[],
  rootDir: string,
  options: RouterOptions,
) {
  const manifestPath = path.join(rootDir, "..", "deploy-generated.ts");
  log.debug(
    `Generated manifest ${
      colors.bold("deploy-generated.ts")
    } at ${manifestPath}`,
  );

  return Deno.writeTextFile(
    manifestPath,
    generateManifestText(routes, rootDir, options),
  );
}

function generateManifestText(
  routes: Route[],
  rootDir: string,
  options: RouterOptions,
) {
  const relativeRootDir = `./${path.basename(rootDir)}`;

  function getRelativePath(file: string) {
    return `./${path.join(relativeRootDir, path.relative(rootDir, file))}`;
  }

  return `// WARNING: This is an auto-generated file.

// This file SHOULD NOT be manually modified and SHOULD be checked in to source control.  
// This file should be used as the entry point file for Deno Deploy.

// If you're deploying to a Deno environment that supports dynamic imports (e.g. something other than Deno Deploy)
// and you want to opt out of generating this file, you can
//  1) Set RouterOptions.generateManifest to false
//  2) Delete this file
 
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { fsRouter } from "https://deno.land/x/fsrouter/core/handler.ts";
import { Route } from "https://deno.land/x/fsrouter/core/route.ts";

const rootDir = "${relativeRootDir}";

${
    routes
      .map((route, index) =>
        `import $${index} from "${getRelativePath(route.file)}";`
      )
      .join("\n")
  }

const _routes = await Promise.all([
  ${
    routes.map((route, index) =>
      `Route.create(
    "${getRelativePath(route.file)}",
    rootDir,
    $${index},
  ),`
    ).join("\n  ")
  }
]);

const devModeOptions = ${JSON.stringify(options, null, 2)}

const options = {
  ...devModeOptions,
  generateManifest: false,
  _routes,
};

serve(await fsRouter(import.meta.resolve(rootDir), options));`;
}
