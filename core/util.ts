// deno-lint-ignore no-explicit-any
export function iterate(obj: Record<any, any>) {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (Object.keys(obj[key]).length === 0) {
        console.log(`key: ${key}, val: ${obj[key]}`);
      } else {
        iterate(obj[key]);
      }
    }
  });
}
