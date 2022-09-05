import { type FsHandler } from "../../../mod.ts";

const handler: FsHandler = (_req, slugs) => {
  return new Response(`/blog/${slugs.id} (string)`);
};

export default handler;
