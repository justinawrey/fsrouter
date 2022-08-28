import { type FsHandler } from "../../private/route.ts";

const handler: FsHandler = (_req, query) => {
  return new Response(`Hello from: /${query.fallback}`);
};

export default handler;
