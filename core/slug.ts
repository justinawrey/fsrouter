// deno-lint-ignore no-explicit-any
export type Matches = Record<string, any>;

export class Slug {
  rawWithType: string;

  constructor(slugFromPath: string) {
    this.rawWithType = slugFromPath.slice(1, -1);
  }

  static isSlug(part: string): boolean {
    return part.startsWith("[") && part.endsWith("]") && part.length > 2;
  }

  get raw(): string {
    if (
      this.rawWithType.endsWith(":string") ||
      this.rawWithType.endsWith(":number")
    ) {
      return this.rawWithType.slice(0, -7);
    }

    return this.rawWithType;
  }

  get type(): "string" | "number" | null {
    if (this.rawWithType.endsWith(":string")) {
      return "string";
    }

    if (this.rawWithType.endsWith(":number")) {
      return "number";
    }

    return null;
  }

  get hasType(): boolean {
    return !!this.type;
  }

  // A regex string, as can be supplied to new Regex(...)
  get regEx(): string {
    if (this.type === "string") {
      return "([a-zA-Z]+)";
    }

    if (this.type === "number") {
      return "([0-9]+)";
    }

    return "(\\w+)";
  }
}
