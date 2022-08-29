import { ConsoleHandler, setup } from "./deps/std/log.ts";

export async function setupLogger(debug: boolean) {
  await setup({
    handlers: {
      default: new ConsoleHandler("DEBUG"),
    },

    loggers: {
      default: {
        level: debug ? "DEBUG" : "INFO",
        handlers: ["default"],
      },
    },
  });
}
