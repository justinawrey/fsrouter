export default (_req: Request, query: Record<string, string>) => {
  return new Response(`/blog/${query.id}`);
};
