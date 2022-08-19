# fsrouter

A file system based router for [Deno](https://deno.land).

## Usage

Given a project with the following folder structure:

```
my-app/
├─ pages/
│  ├─ blog/
│  │  ├─ post.ts
│  │  ├─ index.ts
│  ├─ about.ts
│  ├─ index.ts
├─ mod.ts
```

And the following `mod.ts`:

```typescript
// my-app/mod.ts

import fsRouter from "https://deno.land/x/fsrouter@{VERSION}/mod.ts";
import { serve } from "https://deno.land/std@{VERSION}/http/server.ts";

// Use the file system router with base directory 'pages'
serve(await fsRouter("pages"));
```

Routes are then served as follows: | File | Route |
|---------------------|------------| | pages/index.ts | / | | pages/about.ts |
/about | | pages/blog/index.ts | /blog | | pages/blog/post.ts | /blog/post |
