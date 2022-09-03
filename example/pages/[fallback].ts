import { type FsHandler } from "../../mod.ts";

const handler: FsHandler = (_req, slugs) => {
  return new Response(`/${slugs.fallback}`);
};

export default handler;
