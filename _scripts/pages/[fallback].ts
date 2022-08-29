import { type FsHandler } from "../../handler.ts";

const handler: FsHandler = (_req, query) => {
  return new Response(`/${query.fallback}`);
};

export default handler;
