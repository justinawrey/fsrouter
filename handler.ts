import { http } from "./private/deps.ts";

/**
 * Query is an object of text matched from route wildcards.  See FsHandler example for more details.
 */
export type Query = Readonly<Record<string, string>>;

/**
 * Every file to which routes are being served must export a function of type FsHandler as its
 * default export.  FsHandler is very similar to the standard library Handler type -- the first argument
 * is a Request object, the second argument is a Query type, and the third argument is the
 * standard library ConnInfo type.  The Query argument is placed as the second argument instead of
 * the third for better ergonomics.  See example below for more details.
 *
 * ```typescript
 * import { type FsHandler } from "https://deno.land/x/fsrouter@{VERSION}/handler.ts"
 *
 * // The query object here contains any matched text from route wildcards.
 * // For example, if this handler was defined in the file '/[id].ts' and the
 * // server was hit with the route '/hello', the query object would be of the shape
 * // { id: 'hello' }
 * const handler: FsHandler = (_req, query) => {
 *   return new Response(`/${query.id}`);
 * };
 *
 * export default handler;
 * ```
 */
export type FsHandler = (
  request: Request,
  query: Query,
  connInfo: http.ConnInfo,
) => Response | Promise<Response>;
