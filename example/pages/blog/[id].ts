export default (_req: Request, slugs: Record<string, string>) => {
  return new Response(`/blog/${slugs.id}`);
};
