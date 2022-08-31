import { flags, http, log } from "../private/deps.ts";
import { fsRouter, RouterOptions } from "../mod.ts";
import { setupLogger } from "../private/log.ts";
import { usage } from "./usage.ts";
import { error } from "../private/message.ts";

if (!import.meta.main) {
  Deno.exit(0);
}

const defaultOptions: Required<RouterOptions> = {
  debug: false,
  bootMessage: true,
};

const args = flags.parse(Deno.args, {
  default: defaultOptions,
  boolean: [...Object.keys(defaultOptions), "help"],
  negatable: Object.keys(defaultOptions),
});

await setupLogger(args.debug);
log.debug("Executable called with args:", args);

if (args.help) {
  usage({ verbose: true });
}

const rawArgs = args._;
if (rawArgs.length === 0) {
  error("root directory must be supplied\n");
  usage();
}

if (rawArgs.length > 1) {
  error("supplied too many arguments\n");
  usage();
}

const rootDir = rawArgs[0].toString();
const routerOptions: Omit<typeof args, "_"> = { ...args };
delete routerOptions._;

// TODO: if rootDir can't be found, this should gracefully die
http.serve(await fsRouter(rootDir, routerOptions as RouterOptions));