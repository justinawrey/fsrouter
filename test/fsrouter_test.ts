import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { path } from "../deps.ts";
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
  assertEquals(await makeRequest("/about"), "/about");
});

Deno.test("Basic handlers defined in .js files work", async () => {
  assertEquals(await makeRequest("/contact"), "/contact");
});

Deno.test("Handlers defined in folder index files work", async () => {
  assertEquals(await makeRequest("/"), "/");
});

Deno.test("Handlers defined in nested folder index files work", async () => {
  assertEquals(await makeRequest("/blog"), "/blog");
});

Deno.test("Basic nested handlers work", async () => {
  assertEquals(await makeRequest("/blog/post"), "/blog/post");
});

Deno.test("Handlers with slugs work", async () => {
  assertEquals(await makeRequest("/arbitrary"), "/arbitrary");
});

Deno.test("Handlers with nested slugs work", async () => {
  assertEquals(await makeRequest("/blog/123"), "/blog/123");
});

Deno.test("Responds with 404 when route not found", async () => {
  assertEquals(await makeRequest("/this/is/not/a/route"), "Not Found");
});
