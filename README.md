# fsrouter ![release](https://github.com/justinawrey/fsrouter/actions/workflows/release.yml/badge.svg)

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

Initialize `fsrouter` with the following `mod.ts`:

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

---

**Note**: since `fsrouter` requires access to both the network and the file
system, `--allow-read` and `--allow-net` are required arguments when executing
modules.
