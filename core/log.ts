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
            let formattedArg = "";

            switch (typeof arg) {
              case "object":
                formattedArg = colors.bold(JSON.stringify(arg, null, 2));
                break;

              case "number":
                formattedArg = colors.bold(arg.toString());
                break;

              case "string":
                formattedArg = arg;
                break;

              default:
            }

            baseLog += ` ${formattedArg}`;
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
