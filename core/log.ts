import { colors, log } from "../deps.ts";

export function setupLogger(debug: boolean): void {
  return log.setup({
    handlers: {
      default: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: ({ levelName, msg, args }) => {
          let baseLog = `${
            colors.bold(colors.italic(`[${levelName}]`))
          } ${msg}`;

          for (const arg of args) {
            baseLog += " " + colors.bold(
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : arg as string,
            );
          }

          return colors.yellow(baseLog);
        },
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
