import { colors, log } from "./deps.ts";

export function setupLogger(debug: boolean): Promise<void> {
  return log.setup({
    handlers: {
      default: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: colors.yellow(`${colors.bold("[{levelName}]")} {msg}`),
      }),
    },

    loggers: {
      default: {
        level: debug ? "DEBUG" : "INFO",
        handlers: ["default"],
      },
    },
  });
}
