import { type FsHandler } from "../../mod.ts";

const handler: FsHandler = (_req, query) => {
  return new Response(`/${query.fallback}`);
};

export default handler;
