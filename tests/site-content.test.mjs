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

test("course is a progressive curriculum rather than a shallow menu", async () => {
  const data = await read("app/course-data.ts");
  const lessons = [...data.matchAll(/nav\("[^"]*",/g)];
  assert.ok(lessons.length >= 28, `expected at least 28 navigation entries, got ${lessons.length}`);
  for (const phase of ["建立地图", "进程与权限", "多 Agent 协调", "状态与工作区", "界面与系统边缘", "实战与验证"]) {
    assert.match(data, new RegExp(phase));
  }
  for (const lesson of ["orientation", "boot-chain", "provider-bridges", "prompt-io", "hive-protocol", "message-routing", "safety-lifecycle", "persistence-authority", "git-workspaces", "memory-knowledge", "observability", "extension-guide", "architecture-lab", "self-check", "glossary"]) {
    assert.match(data, new RegExp(`(?:slug: )?"${lesson}"`));
  }
  assert.match(data, /intuition:/);
  assert.match(data, /mechanism,/);
  assert.match(data, /invariants,/);
  assert.match(data, /checkpoint:/);
});

test("practice surfaces include labs, glossary, quiz, and durable progress", async () => {
  const [data, interactions, site] = await Promise.all([read("app/course-data.ts"), read("app/CourseInteractions.tsx"), read("app/LearningSite.tsx")]);
  const glossaryCount = [...data.matchAll(/term\("/g)].length;
  const quizCount = [...data.matchAll(/q\("/g)].length;
  assert.ok(glossaryCount >= 48, `expected at least 48 glossary terms, got ${glossaryCount}`);
  assert.ok(quizCount >= 15, `expected at least 15 quiz questions, got ${quizCount}`);
  for (const component of ["ArchitectureLab", "GlossaryExplorer", "KnowledgeCheck"]) assert.match(interactions, new RegExp(`function ${component}`));
  assert.match(site, /md-course-completed/);
  assert.match(site, /LayeredExplainer/);
  assert.match(site, /LessonCompletion/);
});
