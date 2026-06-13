import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const PLUGIN_ROOT = path.join(REPO_ROOT, "plugins", "claude");

test("marketplace.json is valid and points to an existing plugin", async () => {
  const marketplace = JSON.parse(await readFile(path.join(REPO_ROOT, ".claude-plugin", "marketplace.json"), "utf8")) as {
    name: string;
    plugins: Array<{ name: string; source: string }>;
  };
  assert.equal(marketplace.name, "aigentdocs");
  for (const plugin of marketplace.plugins) {
    await access(path.join(REPO_ROOT, plugin.source, ".claude-plugin", "plugin.json"));
  }
});

test("plugin.json is valid and named consistently", async () => {
  const plugin = JSON.parse(await readFile(path.join(PLUGIN_ROOT, ".claude-plugin", "plugin.json"), "utf8")) as {
    name: string;
    version: string;
  };
  assert.equal(plugin.name, "aigentdocs");
  assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
});

test("every command has frontmatter with a description", async () => {
  const commandsDir = path.join(PLUGIN_ROOT, "commands");
  const files = (await readdir(commandsDir)).filter((f) => f.endsWith(".md"));
  assert.ok(files.length >= 6, `expected at least 6 commands, found ${files.length}`);
  for (const file of files) {
    const content = await readFile(path.join(commandsDir, file), "utf8");
    assert.match(content, /^---\r?\n[\s\S]*?description:/, `${file} must start with frontmatter carrying a description`);
  }
});

test("every agent has name and description, and points to its standard profile", async () => {
  const agentsDir = path.join(PLUGIN_ROOT, "agents");
  const files = (await readdir(agentsDir)).filter((f) => f.endsWith(".md"));
  assert.equal(files.length, 4);
  for (const file of files) {
    const content = await readFile(path.join(agentsDir, file), "utf8");
    assert.match(content, /name: /);
    assert.match(content, /description: /);
    assert.match(content, /docs\/standard\/agent_[a-z_]+\.md/, `${file} must point to its profile in the standard`);
  }
});

test("the hook config points to an existing, executable script", async () => {
  const hooks = JSON.parse(await readFile(path.join(PLUGIN_ROOT, "hooks", "hooks.json"), "utf8")) as {
    hooks: { Stop: Array<{ hooks: Array<{ command: string }> }> };
  };
  const command = hooks.hooks.Stop[0]?.hooks[0]?.command ?? "";
  const script = command.replace("${CLAUDE_PLUGIN_ROOT}", PLUGIN_ROOT);
  const mode = (await stat(script)).mode & 0o777;
  assert.ok(mode & 0o100, "stop-lint.sh must be executable");
});
