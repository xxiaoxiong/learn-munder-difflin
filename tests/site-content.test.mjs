import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
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

test("course graph is sequential, localized, and internally linked", () => {
  const audit = String.raw`
    const m = await import('./app/course-data.ts');
    const issues = [];
    const nav = m.courseNavigation;
    const bySlug = new Map(nav.map((item) => [item.slug, item]));
    if (new Set(nav.map((item) => item.slug)).size !== nav.length) issues.push('duplicate navigation slug');
    nav.forEach((item, index) => {
      if (item.lesson !== index) issues.push('lesson sequence: ' + item.slug);
      if (!item.label.zh.trim() || !item.label.en.trim()) issues.push('navigation locale: ' + item.slug);
    });
    const assertLocalized = (value, path = 'root') => {
      if (!value || typeof value !== 'object') return;
      if ('zh' in value || 'en' in value) {
        if (typeof value.zh !== 'string' || !value.zh.trim() || typeof value.en !== 'string' || !value.en.trim()) issues.push('localized copy: ' + path);
        return;
      }
      for (const [key, child] of Object.entries(value)) assertLocalized(child, path + '.' + key);
    };
    assertLocalized(m.coursePhases, 'phases');
    assertLocalized(m.deepPages, 'pages');
    assertLocalized(m.glossaryTerms, 'terms');
    assertLocalized(m.quizQuestions, 'quiz');
    for (const [slug, page] of Object.entries(m.deepPages)) {
      const item = bySlug.get(slug);
      if (!item || page.slug !== slug || page.lesson !== item.lesson || page.phase !== item.phase) issues.push('page/nav mismatch: ' + slug);
      if (!page.keyQuestion || !page.objectives?.length || !page.takeaways?.length) issues.push('lesson contract: ' + slug);
      if (!['architecture-lab', 'self-check', 'glossary'].includes(slug) && page.sections.length < 3) issues.push('lesson depth: ' + slug);
      for (const prerequisite of page.prerequisites ?? []) {
        const required = bySlug.get(prerequisite);
        if (!required || required.lesson >= item.lesson) issues.push('prerequisite: ' + prerequisite + ' -> ' + slug);
      }
    }
    const lessonLinkExists = (href) => bySlug.has(href.startsWith('/') ? href.slice(1) : href);
    if (new Set(m.glossaryTerms.map((item) => item.term)).size !== m.glossaryTerms.length) issues.push('duplicate glossary term');
    for (const item of m.glossaryTerms) if (!lessonLinkExists(item.href)) issues.push('term link: ' + item.term);
    for (const item of m.quizQuestions) {
      if (item.answer < 0 || item.answer >= item.options.length || item.options.length < 3) issues.push('quiz answer: ' + item.id);
      if (!lessonLinkExists(item.href)) issues.push('quiz link: ' + item.id);
    }
    for (const item of m.labFacts) if (!lessonLinkExists(item.lesson)) issues.push('lab link: ' + item.id);
    console.log(JSON.stringify({ issues, nav: nav.length, pages: Object.keys(m.deepPages).length, terms: m.glossaryTerms.length, quiz: m.quizQuestions.length }));
    if (issues.length) process.exitCode = 1;
  `;
  const result = spawnSync(process.execPath, ["--experimental-strip-types", "--experimental-specifier-resolution=node", "--input-type=module", "-e", audit], {
    cwd: fileURLToPath(root),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout.trim());
  assert.deepEqual(report.issues, []);
  assert.equal(report.nav, 28);
  assert.ok(report.pages >= 15);
  assert.ok(report.terms >= 48);
  assert.ok(report.quiz >= 15);
});
