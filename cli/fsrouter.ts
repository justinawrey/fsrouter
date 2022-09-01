import { flags, http, log } from "../deps.ts";
import { fsRouter, RouterOptions } from "../core/entry.ts";
import { setupLogger } from "../core/log.ts";
import { usage } from "./usage.ts";
import { error } from "../core/message.ts";
import { version } from "./version.ts";

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

if (args.version) {
  console.log(version);
  Deno.exit(0);
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

http.serve(await fsRouter(rootDir, routerOptions as RouterOptions));
