import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

const version = Deno.args[0];

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    // package.json properties
    name: "aitertools",
    version,
    description: "Well-tested utility functions dealing with async iterables",
    keywords: [
      "iterable",
      "iterator",
      "async",
      "stream",
      "async-iterable",
      "async-iterator",
    ],
    license: "LGPL-3.0-or-later",
    author: {
      name: "Hong Minhee",
      email: "hong@minhee.org",
      url: "https://hongminhee.org/",
    },
    homepage: "https://github.com/dahlia/aitertools",
    repository: {
      type: "git",
      url: "git+https://github.com/dahlia/aitertools.git",
    },
    bugs: {
      url: "https://github.com/dahlia/aitertools/issues",
    },
  },
  shims: {
    deno: true,
  },
  importMap: "deno.json",
  typeCheck: "both",
  test: true,
  declaration: "separate",
  esModule: true,
  rootTestDir: "./tests",
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
Deno.copyFileSync("CHANGES.md", "npm/CHANGES.md");
