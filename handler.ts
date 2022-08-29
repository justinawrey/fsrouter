import { type ConnInfo } from "./private/deps/std/http.ts";

/** */
export type Query = Readonly<Record<string, string>>;

/** */
export type FsHandler = (
  request: Request,
  query: Query,
  connInfo: ConnInfo,
) => Response | Promise<Response>;
