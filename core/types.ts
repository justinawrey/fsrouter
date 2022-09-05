import { http } from "../deps.ts";
import { type Matches } from "./slug.ts";

/**
 * Slugs is an object of text matched from route wildcards.  See FsHandler example for more details.
 */
export type Slugs = Readonly<Matches>;

/**
 * Every file to which routes are being served must export a function of type FsHandler as its
 * default export.  FsHandler is very similar to the standard library Handler type -- the first argument
 * is a Request object, the second argument is of type Slugs, and the third argument is the
 * standard library type ConnInfo.  The Slugs argument is placed as the second argument instead of
 * the third for better ergonomics.  See example below for more details.
 *
 * ```typescript
 * import { type FsHandler } from "https://deno.land/x/fsrouter@{VERSION}/handler.ts"
 *
 * // The slugs object here contains any matched text from route wildcards.
 * // For example, if this handler was defined in the file '/[id].ts' and the
 * // server was hit with the route '/hello', the query object would be of the shape
 * // { id: 'hello' }
 * const handler: FsHandler = (_req, slugs) => {
 *   return new Response(`/${slugs.id}`);
 * };
 *
 * export default handler;
 * ```
 */
export type FsHandler = (
  request: Request,
  slugs: Slugs,
  connInfo: http.ConnInfo,
) => Response | Promise<Response>;
