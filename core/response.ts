import { http } from "../deps.ts";

export function notFound(): Response {
  try {
    throw new http.errors.NotFound();
  } catch (e) {
    if (http.isHttpError(e)) {
      return new Response(e.message, { status: e.status });
    } else {
      throw e;
    }
  }
}
