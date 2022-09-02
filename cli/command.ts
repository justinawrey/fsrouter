interface Option {
  key: string;
  description: string;
  default: string;
}

interface Argument {
  key: string;
  description: string;
}

// for example fsrouter *init* is the command
abstract class Command {
  #parent: Command | undefined;

  constructor(parent?: Command) {
    this.#parent = parent;
  }

  usage() {
    this.#parent;
  }

  abstract get key(): string;
  abstract get description(): string;
  abstract get subCommands(): Command[];
  abstract get arguments(): Argument[];
  abstract get options(): Option[];
}

class FsRouter extends Command {
  get key(): string {
    return "fsrouter";
  }

  get description(): string {
    return "";
  }

  get subCommands(): Command[] {
    return [new Serve(this), new Init(this)];
  }

  get arguments(): Argument[] {
    return [];
  }

  get options(): Option[] {
    return [];
  }
}

class Serve extends Command {
  get key(): string {
    return "serve";
  }

  get description(): string {
    throw "";
  }

  get subCommands(): Command[] {
    return [];
  }

  get arguments(): Argument[] {
    return [{
      key: "rootDir",
      description:
        "Directory from which to serve routes.  Can be relative or absolute.",
    }];
  }

  get options(): Option[] {
    return [{
      key: "--[no-]debug",
      description: "Show/hide debug information",
      default: "[default: hide]",
    }, {
      key: "--[no-]bootMessage",
      description: "Show/hide boot message on startup.",
      default: "[default: show]",
    }];
  }
}

class Init extends Command {
  get key(): string {
    return "init";
  }

  get description(): string {
    throw new Error("Method not implemented.");
  }

  get subCommands(): [] {
    throw new Error("Method not implemented.");
  }

  get arguments(): [] {
    throw new Error("Method not implemented.");
  }

  get options(): [] {
    throw new Error("Method not implemented.");
  }
}

function usage(rootCommand: Command): string {
  return `Usage:\n\n${rootCommand}`;
}

const fsrouter = new FsRouter();
console.log(usage(fsrouter));
