import { dirname, fromFileUrl, join } from "jsr:@std/path@^0.220.1";
import * as commonmark from "npm:commonmark";

const projectDir = dirname(dirname(fromFileUrl(import.meta.url)));
const changelogPath = join(projectDir, "CHANGES.md");

function findTopmostVersion(node: typeof commonmark.Node): string {
  const walker = node.walker();
  while (true) {
    const event = walker.next();
    if (!event) break;
    const node = event.node;
    if (
      node.type == "heading" && node.level == 2 &&
      node.firstChild.type == "text" &&
      node.firstChild.literal.startsWith("Version")
    ) {
      return node.firstChild.literal.replace(/^Version\s+/, "").trim();
    }
  }

  throw new Error("Version not found");
}

async function findLatestVersionFromChangelog(path: string): Promise<string> {
  const parser = new commonmark.Parser();
  const text = await Deno.readTextFile(path);
  const tree = parser.parse(text);
  return findTopmostVersion(tree);
}

function determineVersionSuffix(): string {
  const runNo = Deno.env.get("GITHUB_RUN_NUMBER");
  const commitSha = Deno.env.get("GITHUB_SHA");
  return `dev.${runNo}+${commitSha?.substring(0, 7)}`;
}

async function output(name: string, value: string): Promise<void> {
  const outputPath = Deno.env.get("GITHUB_OUTPUT");
  if (Deno.env.get("GITHUB_ACTIONS") === "true" && outputPath != null) {
    const escaped = value
      .replace(/%/g, "%25")
      .replace(/\r/g, "%0D")
      .replace(/\n/g, "%0A");
    await Deno.writeTextFile(outputPath, `${name}=${escaped}\n`);
  } else {
    console.log(value);
  }
}

async function main() {
  const baseVersion = await findLatestVersionFromChangelog(changelogPath);
  if (
    Deno.env.get("GITHUB_ACTIONS") === "true" &&
    Deno.env.get("GITHUB_REF_TYPE") === "branch"
  ) {
    const version = `${baseVersion}-${determineVersionSuffix()}`;
    await output("version", version);
  } else {
    await output("version", baseVersion);
  }
}

if (import.meta.main) await main();
