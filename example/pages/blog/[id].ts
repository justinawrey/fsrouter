import { type FsHandler } from "../../../mod.ts";

const handler: FsHandler = (_req) => {
  return new Response(`/blog/id`);
};

export default handler;
