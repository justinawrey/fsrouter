# :postbox: `fsrouter` | [![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/fsrouter/mod.ts) [![deno module](https://shield.deno.dev/x/fsrouter)](https://deno.land/x/fsrouter) ![release](https://github.com/justinawrey/fsrouter/actions/workflows/release.yml/badge.svg)

A file system based router for [Deno](https://deno.land). Supports
[Deno Deploy](https://deno.com/deploy)!

## Basic usage

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
[FsHandler](https://deno.land/x/fsrouter/mod.ts?s=FsHandler) as its default
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

As well as `.jsx` and `.tsx` files, with jsx runtime modules from whichever
source you wish:

```tsx
// my-app/pages/blog/post.tsx

/** @jsx h */
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.33/mod.ts";

function App() {
  return (
    <html>
      <head>
        <title>Hello from JSX</title>
      </head>
      <body>
        <h1>Hello world</h1>
      </body>
    </html>
  );
}

export default (_req: Request) => {
  const html = renderSSR(<App />);

  return new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
};
```

Initialize a server by calling `fsRouter`:

```typescript
// my-app/mod.ts
import { fsRouter } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";
import { serve } from "https://deno.land/std@{VERSION}/http/server.ts";

// Use the file system router with base directory 'pages'
// The first argument to fsRouter requires an absolute path
// Paths starting with 'file://' are okay
serve(await fsRouter(import.meta.resolve("./pages")));
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

An options object can be provided as the second argument to `fsRouter`. See
[RouterOptions](https://deno.land/x/fsrouter/mod.ts?s=RouterOptions) for
details.

## Dynamic routes

Dynamic routes are supported using the `[slug]` syntax. This works for files,
folders, or both. For example:

| File                   | Matches                         |
| ---------------------- | ------------------------------- |
| `pages/blog/[id].ts`   | `/blog/123`, `/blog/first-post` |
| `pages/[id1]/[id2].ts` | `/any/route`                    |
| `pages/[fallback].ts`  | `/caught-all`, `/any`           |

Matching slug values are provided as the second argument to `FsHandler`. Given
the files as defined in the table above, the route `/any/route` will be provided
a slug object of the shape `{ id1: 'any', id2: 'route' }`:

```typescript
// my-app/pages/[id1]/[id2].ts
import { type Slugs } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";

// req url: /any/route
export default (req: Request, slugs: Slugs) => {
  console.log(slugs.id1); // 'any'
  console.log(slugs.id2); // 'route'

  return new Response("Matched dynamic route!");
};
```

## Typed dynamic routes

Slugs can optionally include a `:string` or `:number` postfix to exclusively
match strings and numbers respectively. For example:

| File                        | Matches                                 |
| --------------------------- | --------------------------------------- |
| `pages/blog/[id:number].ts` | `/blog/123`, `/blog/45`                 |
| `pages/blog/[id:string].ts` | `/blog/first-post`, `/blog/second-post` |

Matches for slugs of type `:number` will be automatically converted to type
`number`:

```typescript
// my-app/pages/blog/[id:number].ts
import { type Slugs } from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";

// req url: /blog/123
export default (req: Request, slugs: Slugs) => {
  console.log(typeof slugs.id); // 'number'

  return new Response("Matched dynamic route!");
};
```

This automatic conversion behaviour can be disabled via
[RouterOptions.convertToNumber](https://deno.land/x/fsrouter/mod.ts?s=RouterOptions).

## Watch mode

During development, you can use Deno's built-in `--watch=<folder>` to restart
the server on changes. Providing a bare `--watch` has the caveat of not being
able to detect new file additions, since by default Deno will watch only files
it can statically discover. By providing a root directory, Deno will be able to
detect new file additions as well:

```bash
deno run --allow-read --allow-net --watch=pages my-app/mod.ts
```

## Permissions

Using `fsrouter` requires both `--allow-read` and `--allow-net` for the
following reasons:

- `--allow-read`: `fsrouter` needs to traverse the filesystem in order to
  discover handler files
- `--allow-net`: `fsrouter` itself doesn't actually need network access, but
  since it's very likely your script will include using `fsrouter` in tandem
  with some sort of file server, you'll likely need this permission grant

When deploying to Deno Deploy, `--allow-write` is also required so `fsrouter`
can generate a manifest file containing static imports.

## Deno Deploy

When running locally with the Deno CLI, this module uses dynamic imports to
resolve file names to their respective routes. As Deno Deploy
[does not support dynamic imports](https://github.com/denoland/deploy_feedback/issues/1),
a "manifest" file containing static imports for every route must be generated
during development and committed to your linked repository. This is the same
approach taken by [Fresh](https://fresh.deno.dev/), and is enabled by default.

If you do not need to run your code in Deno Deploy, you can disable manifest
generation with
[RouterOptions.generateManifest](https://deno.land/x/fsrouter/mod.ts?s=RouterOptions).
