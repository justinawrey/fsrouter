import { asserts, path } from "../deps.ts";
import { fsRouter } from "../mod.ts";

const handler = await fsRouter(
  path.fromFileUrl(import.meta.resolve("../example/pages")),
  { bootMessage: false },
);

async function makeRequest(path: string): Promise<string> {
  const req = new Request(`http://localhost:3000${path}`);

  // @ts-ignore - there is no real connInfo here to pass
  const res = await handler(req, null);
  return res.text();
}

Deno.test("Basic handlers defined in .ts files work", async () => {
  asserts.assertEquals(await makeRequest("/about"), "/about");
});

Deno.test("Basic handlers defined in .js files work", async () => {
  asserts.assertEquals(await makeRequest("/contact"), "/contact");
});

Deno.test("Handlers defined in folder index files work", async () => {
  asserts.assertEquals(await makeRequest("/"), "/");
});

Deno.test("Handlers defined in nested folder index files work", async () => {
  asserts.assertEquals(await makeRequest("/blog"), "/blog");
});

Deno.test("Basic nested handlers work", async () => {
  asserts.assertEquals(await makeRequest("/blog/post"), "/blog/post");
});

Deno.test("Handlers with slugs work", async () => {
  asserts.assertEquals(await makeRequest("/arbitrary"), "/arbitrary");
});

Deno.test("Handlers with :number typed slugs work", async () => {
  asserts.assertEquals(await makeRequest("/blog/123"), "/blog/123 (number)");
});

Deno.test("Handlers with :string typed slugs work", async () => {
  asserts.assertEquals(await makeRequest("/blog/hi"), "/blog/hi (string)");
});

Deno.test("Longest routes are matched first", async () => {
  asserts.assertEquals(await makeRequest("/blog/123/out"), "/blog/123/out");
});

Deno.test("Responds with 404 when route not found", async () => {
  asserts.assertEquals(await makeRequest("/this/is/not/a/route"), "Not Found");
});
