import type { Handler } from "../deps.ts";

const handler: Handler = (_req) => {
  return new Response("contact");
};

export default handler;
