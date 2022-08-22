# `fsrouter` | ![format](https://github.com/justinawrey/fsrouter/actions/workflows/format.yml/badge.svg) ![lint](https://github.com/justinawrey/fsrouter/actions/workflows/lint.yml/badge.svg) ![test](https://github.com/justinawrey/fsrouter/actions/workflows/test.yml/badge.svg) ![release](https://github.com/justinawrey/fsrouter/actions/workflows/release.yml/badge.svg)

A file system based router for [Deno](https://deno.land).

## Usage

Given a project with the following folder structure:

```bash
my-app/
├─ pages/
│  ├─ blog/
│  │  ├─ post.ts
│  │  ├─ index.ts
│  ├─ about.ts
│  ├─ index.ts
├─ mod.ts
```

Each "route file" must export a
[Handler](https://deno.land/std@0.152.0/http/server.ts?s=Handler) as its default
export:

```typescript
// my-app/pages/blog/post.ts
export default (req: Request) => {
  return new Response("hello world!");
};
```

`.js` files are fine as well:

```javascript
// my-app/pages/blog/post.js
export default (req) => {
  return new Response("hello world!");
};
```

Initialize a server by calling `fsRouter`:

```typescript
// my-app/mod.ts
import { fsRouter } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";
import { serve } from "https://deno.land/std@{VERSION}/http/server.ts";

// Use the file system router with base directory 'pages'
serve(await fsRouter("pages"));
```

Now running:

```bash
deno run --allow-read --allow-net my-app/mod.ts
```

Results in routes being served as follows:

| File                  | Route        |
| --------------------- | ------------ |
| `pages/index.ts`      | `/`          |
| `pages/about.ts`      | `/about`     |
| `pages/blog/index.ts` | `/blog`      |
| `pages/blog/post.ts`  | `/blog/post` |

During development, you can use Deno's built-in `--watch=<folder>` to restart
the server on changes. Providing a bare `--watch` has the caveat of not being
able to detect new file additions, since by default Deno will watch only files
it can statically discover. By providing a root directory, Deno will be able to
detect new file additions as well:

```bash
deno run --allow-read --allow-net --watch=pages my-app/mod.ts
```

---

**Note**: since `fsrouter` requires access to both the network and the file
system, `--allow-read` and `--allow-net` are required arguments when executing
modules.
