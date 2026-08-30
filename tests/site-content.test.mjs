import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("pins the analyzed upstream snapshot", async () => {
  const data = await read("app/site-data.ts");
  assert.match(data, /956bfb4cff1af97f9cf29b9ce489ae69a5774843/);
  assert.match(data, /chaitanyagiri\/munder-difflin/);
  assert.match(data, /confidence.*verified/);
});

test("covers every required architecture surface", async () => {
  const data = await read("app/site-data.ts");
  for (const surface of ["architecture", "runtime", "hive", "electron", "pty", "state", "renderer", "integrations", "source-map", "call-flows", "learning-path", "conclusions"]) {
    assert.match(data, new RegExp(surface.replace("-", "\\-")));
  }
  for (const flow of ["boot", "spawn-agent", "send-prompt", "output", "hive-task", "agent-message", "restart", "closing"]) {
    assert.match(data, new RegExp(`id: "${flow}"`));
  }
});

test("starter preview is completely replaced", async () => {
  const [page, layout, packageJson] = await Promise.all([read("app/page.tsx"), read("app/layout.tsx"), read("package.json")]);
  assert.match(page, /LearningSite/);
  assert.match(layout, /Munder Difflin 架构学习手册/);
  assert.doesNotMatch(packageJson, /vinext|react-loading-skeleton|wrangler|drizzle/);
});
