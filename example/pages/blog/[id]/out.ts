import { type FsHandler } from "../../../../mod.ts";

const handler: FsHandler = (_req, query) => {
  return new Response(`/blog/${query.id}/out`);
};

export default handler;
