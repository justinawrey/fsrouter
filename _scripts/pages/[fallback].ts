import { type FsHandler } from "../../private/route.ts";

const handler: FsHandler = (_req, query) => {
  return new Response(`/${query.fallback}`);
};

export default handler;
