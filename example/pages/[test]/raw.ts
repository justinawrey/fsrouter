import { type FsHandler } from "../../../mod.ts";

const handler: FsHandler = (_req, slugs) => {
  return new Response(`/${slugs.test}/raw`);
};

export default handler;
