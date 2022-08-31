import { colors } from "../private/deps.ts";

interface UsageOptions {
  verbose?: boolean;
  exit?: boolean;
}

// TODO: go from camelcase to kebab case
// TODO: this help message should be derived from the actual args state
export function usage(
  { verbose = false, exit = true }: UsageOptions = {},
): void {
  console.log(
    `${colors.bold(colors.gray(colors.italic("Usage:")))} fsrouter ${
      colors.bold("<rootDir> [...options]")
    }`,
  );

  if (verbose) {
    console.log(`
${colors.bold(colors.gray(colors.italic("Arguments:")))}
${colors.bold("rootDir")}             Directory from which to serve routes.
                    Can be relative or absolute.

${colors.bold(colors.gray(colors.italic("Options:")))}
${colors.bold("--[no-]debug")}        Show/hide debug information.        ${
      colors.bold(colors.italic("[default: hide]"))
    }
${colors.bold("--[no-]bootMessage")}  Show/hide boot message on startup.  ${
      colors.bold(colors.italic("[default: show]"))
    }
${colors.bold("--help")}              Show this help message.
${colors.bold("--version")}           Show current version.`);
  }

  if (exit) {
    Deno.exit(0);
  }
}
