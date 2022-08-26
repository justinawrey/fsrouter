import { errors, isHttpError } from "./deps/std/http.ts";

export function notFound(): Response {
  try {
    throw new errors.NotFound();
  } catch (e) {
    if (isHttpError(e)) {
      return new Response(e.message, { status: e.status });
    } else {
      throw e;
    }
  }
}
