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
