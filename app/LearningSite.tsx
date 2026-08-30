"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArchitectureDiagram } from "./Diagrams";
import { ArchitectureLab, GlossaryExplorer, KnowledgeCheck } from "./CourseInteractions";
import { coursePhases } from "./course-data";
import { Icon } from "./icons";
import {
  callFlows,
  learningLevels,
  navigation,
  pages,
  PROJECT_REPO,
  sourceDomains,
  sourceHref,
  SOURCE_SHA,
  SOURCE_SHORT_SHA,
  supportedProviders,
  UPSTREAM_REPO,
  type Locale,
  type Localized,
  type SourceRef,
} from "./site-data";

const text = (value: Localized, locale: Locale) => value[locale];

const ui = {
  zh: {
    project: "架构学习手册",
    search: "搜索章节",
    searchHint: "输入 runtime、PTY、Hive…",
    source: "固定源码证据",
    verified: "已核验",
    unverified: "运行时未核验",
    design: "仅设计文档",
    read: "分钟阅读",
    toc: "本页目录",
    previous: "上一章",
    next: "下一章",
    copy: "复制 commit",
    copied: "已复制",
    sourceMap: "打开源码",
    noResult: "没有匹配的章节",
    complete: "标记本课完成",
    completed: "本课已完成",
    courseProgress: "课程进度",
    objectives: "学完你能",
    keyQuestion: "本课核心问题",
    prerequisites: "建议先学",
    noPrerequisite: "无需前置课程",
    layered: ["先建立直觉", "再走机制", "守住不变量", "检查理解"],
    reveal: "查看答案",
    hide: "收起答案",
  },
  en: {
    project: "Architecture field guide",
    search: "Search chapters",
    searchHint: "Try runtime, PTY, Hive…",
    source: "Pinned source evidence",
    verified: "Verified",
    unverified: "Runtime-unverified",
    design: "Design-only",
    read: "min read",
    toc: "On this page",
    previous: "Previous",
    next: "Next",
    copy: "Copy commit",
    copied: "Copied",
    sourceMap: "Open source",
    noResult: "No matching chapter",
    complete: "Mark lesson complete",
    completed: "Lesson complete",
    courseProgress: "Course progress",
    objectives: "You will be able to",
    keyQuestion: "Key question",
    prerequisites: "Recommended first",
    noPrerequisite: "No prerequisite",
    layered: ["Build intuition", "Trace mechanics", "Protect invariants", "Check understanding"],
    reveal: "Reveal answer",
    hide: "Hide answer",
  },
};

function Header({
  locale,
  setLocale,
  theme,
  setTheme,
  openNav,
  onSearch,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  openNav: () => void;
  onSearch: () => void;
}) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={openNav} aria-label="Open navigation"><Icon name="menu" /></button>
      <Link className="brand" href="/" aria-label="Munder Difflin architecture guide home">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span><b>MUNDER</b><small>DIFFLIN / LEARN</small></span>
      </Link>
      <div className="top-actions">
        <button className="search-trigger" onClick={onSearch}><Icon name="search" size={16} /><span>{ui[locale].search}</span><kbd>⌘ K</kbd></button>
        <div className="locale-switch" aria-label="Language switcher">
          <button className={locale === "zh" ? "active" : ""} onClick={() => setLocale("zh")}>中</button>
          <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button>
        </div>
        <button className="icon-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle color theme"><Icon name={theme === "dark" ? "sun" : "moon"} /></button>
        <a className="icon-button desktop-github" href={PROJECT_REPO} target="_blank" rel="noreferrer" aria-label="Project on GitHub"><Icon name="github" /></a>
      </div>
    </header>
  );
}

function Sidebar({ slug, locale, open, close, completed }: { slug: string; locale: Locale; open: boolean; close: () => void; completed: string[] }) {
  const completeCount = navigation.filter((item) => item.slug && completed.includes(item.slug)).length;
  const lessonCount = navigation.filter((item) => item.slug).length;
  return (
    <>
      <div className={`nav-scrim ${open ? "visible" : ""}`} onClick={close} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-mobile-head"><span>{ui[locale].project}</span><button className="icon-button" onClick={close}><Icon name="close" /></button></div>
        <div className="sidebar-progress"><div><span>{ui[locale].courseProgress}</span><b>{completeCount}/{lessonCount}</b></div><i><em style={{ width: `${(completeCount / lessonCount) * 100}%` }} /></i></div>
        <nav aria-label="Learning guide chapters">
          {coursePhases.map((phase) => (
            <div className="nav-group" key={phase.id}>
              <p><span>PHASE {phase.id}</span>{text(phase.label, locale)}</p>
              {navigation.filter((item) => item.phase === phase.id).map((item) => {
                const isActive = item.slug === slug;
                const done = Boolean(item.slug && completed.includes(item.slug));
                return <Link className={`${isActive ? "active" : ""} ${done ? "done" : ""}`} href={`/${item.slug}`} key={item.slug || "home"} onClick={close}><em>{String(item.lesson).padStart(2, "0")}</em><span>{text(item.label, locale)}</span>{done && <Icon name="check" size={12} />}{isActive && <i />}</Link>;
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-source">
          <span className="status-dot" />
          <div><small>SOURCE SNAPSHOT</small><a href={`${UPSTREAM_REPO}/tree/${SOURCE_SHA}`} target="_blank" rel="noreferrer">{SOURCE_SHORT_SHA}</a></div>
        </div>
      </aside>
    </>
  );
}

function SearchDialog({ locale, close }: { locale: Locale; close: () => void }) {
  const [query, setQuery] = useState("");
  const results = navigation.filter((item) => {
    const page = item.slug ? pages[item.slug] : undefined;
    const haystack = [text(item.label, locale), item.slug, page ? text(page.summary, locale) : ""].join(" ").toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [close]);
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={ui[locale].search} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="search-dialog">
        <div className="search-field"><Icon name="search" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui[locale].searchHint} /><button onClick={close}>ESC</button></div>
        <div className="search-results">
          {results.length ? results.map((item, index) => <Link href={`/${item.slug}`} key={item.slug || "home"}><em>{String(index + 1).padStart(2, "0")}</em><span><b>{text(item.label, locale)}</b><small>/{item.slug}</small></span><Icon name="arrow" size={16} /></Link>) : <p>{ui[locale].noResult}</p>}
        </div>
      </div>
    </div>
  );
}

function SourceCard({ source, locale }: { source: SourceRef; locale: Locale }) {
  const confidence = source.confidence ?? "verified";
  const labels = { verified: ui[locale].verified, "runtime-unverified": ui[locale].unverified, "design-only": ui[locale].design };
  return (
    <a className="source-card" href={sourceHref(source)} target="_blank" rel="noreferrer">
      <div className="source-card-top"><code>{source.path}</code>{source.lines && <span>{source.lines}</span>}</div>
      <div className="symbol-row">{source.symbols.map((symbol) => <code key={symbol}>{symbol}</code>)}</div>
      <p>{text(source.note, locale)}</p>
      <div className={`confidence ${confidence}`}><i />{labels[confidence]}</div>
    </a>
  );
}

function LayeredExplainer({ layers, locale }: { layers: NonNullable<(typeof pages)[string]["sections"][number]["layers"]>; locale: Locale }) {
  const available = ["intuition", "mechanism", ...(layers.invariants?.length ? ["invariants"] : []), ...(layers.checkpoint ? ["checkpoint"] : [])] as ("intuition" | "mechanism" | "invariants" | "checkpoint")[];
  const [active, setActive] = useState<(typeof available)[number]>("intuition");
  const [revealed, setRevealed] = useState(false);
  const labels = { intuition: ui[locale].layered[0], mechanism: ui[locale].layered[1], invariants: ui[locale].layered[2], checkpoint: ui[locale].layered[3] };
  return <div className="layered-explainer"><div className="layer-tabs" role="tablist">{available.map((id, index) => <button role="tab" aria-selected={active === id} className={active === id ? "active" : ""} onClick={() => setActive(id)} key={id}><em>{String(index + 1).padStart(2, "0")}</em>{labels[id]}</button>)}</div><div className="layer-panel" role="tabpanel">
    {active === "intuition" && <p className="intuition-copy">{text(layers.intuition, locale)}</p>}
    {active === "mechanism" && <ol>{layers.mechanism.map((item, index) => <li key={index}><span>{index + 1}</span>{text(item, locale)}</li>)}</ol>}
    {active === "invariants" && <ul>{layers.invariants?.map((item, index) => <li key={index}><Icon name="check" size={14} />{text(item, locale)}</li>)}</ul>}
    {active === "checkpoint" && layers.checkpoint && <div className="checkpoint"><span>CHECKPOINT</span><h3>{text(layers.checkpoint.question, locale)}</h3><button onClick={() => setRevealed((value) => !value)}>{revealed ? ui[locale].hide : ui[locale].reveal}</button>{revealed && <p>{text(layers.checkpoint.answer, locale)}</p>}</div>}
  </div></div>;
}

function SectionBlock({ section, index, locale }: { section: (typeof pages)[string]["sections"][number]; index: number; locale: Locale }) {
  return (
    <section className="content-section" id={section.id}>
      <div className="section-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="section-copy">
        {section.eyebrow && <span className="eyebrow">{text(section.eyebrow, locale)}</span>}
        <h2>{text(section.title, locale)}</h2>
        <p className="section-lead">{text(section.lead, locale)}</p>
        {section.paragraphs?.map((paragraph, i) => <p key={i}>{text(paragraph, locale)}</p>)}
        {section.bullets && <ul className="fact-list">{section.bullets.map((bullet, i) => <li key={i}><span>0{i + 1}</span>{text(bullet, locale)}</li>)}</ul>}
        {section.callout && <div className={`callout ${section.callout.tone}`}><strong>{section.callout.tone === "warning" ? "WATCH" : section.callout.tone === "fact" ? "SOURCE FACT" : "ARCHITECTURE NOTE"}</strong><p>{text(section.callout.text, locale)}</p></div>}
        {section.layers && <LayeredExplainer layers={section.layers} locale={locale} />}
      </div>
      {section.diagram && <ArchitectureDiagram kind={section.diagram} locale={locale} />}
      {section.sources && <div className="evidence-block"><div className="evidence-label"><span>{ui[locale].source}</span><i /></div><div className="source-grid">{section.sources.map((source, i) => <SourceCard source={source} locale={locale} key={`${source.path}-${i}`} />)}</div></div>}
    </section>
  );
}

function Home({ locale, completed }: { locale: Locale; completed: string[] }) {
  const c = locale === "zh" ? {
    kicker: "面向二次开发者的源码架构学习站",
    titleA: "看懂一个",
    titleB: "Agent 控制平面",
    titleC: "如何运转。",
    lead: "Munder Difflin 不是另一个 Agent Runtime。它把 Claude Code、Codex 等真实 CLI 进程装进一个本地优先的 Electron 协作系统：负责启动、隔离、协调、观察与收尾。",
    start: "开始学习",
    map: "查看源码地图",
    thesis: "一句话架构",
    thesisText: "外部 CLI 拥有推理循环；Munder Difflin 拥有进程与协作生命周期。",
    boundary: "30 秒建立正确边界",
    boundaryLead: "先把四个相邻概念分开，后面的所有源码都会自然落位。",
    axes: [
      ["Harness", "管理多个 CLI 进程、终端、工作区与恢复配方。"],
      ["Orchestration", "用 Hive task、mailbox、hook 与安全投递协调真实 Agent。"],
      ["Control plane", "集中处理权限、生命周期、安全保护与外围触发器。"],
      ["Visualization", "把终端和 hook 事实投影成 Office、Kanban 与状态面板。"],
    ],
    trail: "推荐阅读顺序",
    trailLead: "从边界到执行，再到协作与二次开发判断。每章都附固定 commit 的源码锚点。",
    capabilities: "被管理的外部 Runtime",
    capabilitiesLead: "支持不等于行为完全一致。provider preset 明确记录了参数、hook 与 resume 能力差异。",
    curriculum: "六个阶段，把复杂系统逐层讲透",
    curriculumLead: "每一阶段都有明确产出；先建立边界，再追进程、协调、状态与系统边缘，最后用实验验证。",
    resume: "继续学习",
    completeLabel: "已完成",
  } : {
    kicker: "A source-grounded architecture guide for builders",
    titleA: "Understand how an",
    titleB: "agent control plane",
    titleC: "actually works.",
    lead: "Munder Difflin is not another agent runtime. It places real CLIs such as Claude Code and Codex inside a local-first Electron collaboration system that launches, isolates, coordinates, observes, and retires them.",
    start: "Start learning",
    map: "Explore source map",
    thesis: "Architecture in one sentence",
    thesisText: "External CLIs own inference loops; Munder Difflin owns process and collaboration lifecycles.",
    boundary: "Build the right boundary in 30 seconds",
    boundaryLead: "Separate four adjacent ideas first and every source module lands naturally.",
    axes: [
      ["Harness", "Manages multiple CLI processes, terminals, workspaces, and resume recipes."],
      ["Orchestration", "Coordinates real agents through Hive tasks, mailboxes, hooks, and safe delivery."],
      ["Control plane", "Centralizes privileges, lifecycle, safety controls, and external triggers."],
      ["Visualization", "Projects terminal and hook facts into the Office, Kanban, and status panels."],
    ],
    trail: "Recommended reading trail",
    trailLead: "Move from boundaries to execution, coordination, then extension decisions. Every chapter includes pinned source anchors.",
    capabilities: "Managed external runtimes",
    capabilitiesLead: "Support does not mean identical behavior. Provider presets explicitly describe argument, hook, and resume differences.",
    curriculum: "Six phases that build a deep system model",
    curriculumLead: "Each phase has an outcome: boundary first, then process, coordination, state, perimeter, and hands-on validation.",
    resume: "Continue learning",
    completeLabel: "completed",
  };
  const trailSlugs = ["orientation", "architecture", "runtime", "hive", "state", "architecture-lab"];
  const trail = trailSlugs.map((slug) => navigation.find((item) => item.slug === slug)).filter((item): item is (typeof navigation)[number] => Boolean(item));
  const nextLesson = navigation.find((item) => item.slug && !completed.includes(item.slug)) ?? navigation[1];
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-kicker"><span>●</span>{c.kicker}</div>
          <h1>{c.titleA}<br /><em>{c.titleB}</em><br />{c.titleC}</h1>
          <p>{c.lead}</p>
          <div className="hero-actions"><Link className="button primary" href="/learning-path">{c.start}<Icon name="arrow" /></Link><Link className="button secondary" href="/source-map">{c.map}</Link></div>
          <Link className="resume-card" href={`/${nextLesson.slug}`}><span>{c.resume}</span><b>{String(nextLesson.lesson).padStart(2, "0")} · {text(nextLesson.label, locale)}</b><em>{completed.length}/{navigation.length - 1} {c.completeLabel}<Icon name="arrow" size={15} /></em></Link>
        </div>
        <div className="hero-console" aria-label="Architecture summary terminal">
          <div className="console-bar"><span><i /><i /><i /></span><code>architecture.boundary</code><b>LIVE</b></div>
          <div className="console-body">
            <p><span>01</span><code>runtime.owner</code><b>external_cli</b></p>
            <p><span>02</span><code>process.transport</code><b>node_pty</b></p>
            <p><span>03</span><code>coordination</code><b>hive_files</b></p>
            <p><span>04</span><code>privilege.owner</code><b>electron_main</b></p>
            <p><span>05</span><code>visual.control</code><b>renderer</b></p>
            <div className="console-result"><small>{c.thesis}</small><strong>{c.thesisText}</strong></div>
          </div>
        </div>
      </section>

      <section className="home-section boundary-section">
        <div className="section-intro"><span className="eyebrow">SYSTEM POSITIONING</span><h2>{c.boundary}</h2><p>{c.boundaryLead}</p></div>
        <div className="axis-grid">{c.axes.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
        <ArchitectureDiagram kind="system-context" locale={locale} />
      </section>

      <section className="home-section provider-section">
        <div className="section-intro"><span className="eyebrow">PROVIDER SURFACE</span><h2>{c.capabilities}</h2><p>{c.capabilitiesLead}</p></div>
        <div className="provider-cloud">{supportedProviders.map((provider, index) => <span key={provider}><i style={{"--delay": `${index * 90}ms`} as React.CSSProperties} />{provider}</span>)}</div>
      </section>

      <section className="home-section curriculum-section">
        <div className="section-intro"><span className="eyebrow">COURSE ARCHITECTURE</span><h2>{c.curriculum}</h2><p>{c.curriculumLead}</p></div>
        <div className="phase-grid">{coursePhases.map((phase) => { const items = navigation.filter((item) => item.slug && item.phase === phase.id); const done = items.filter((item) => completed.includes(item.slug)).length; return <article key={phase.id}><div><em>0{phase.id}</em><span>{done}/{items.length}</span></div><h3>{text(phase.label, locale)}</h3><p>{text(phase.outcome, locale)}</p><i><b style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} /></i><Link href={`/${items[0]?.slug}`}>{locale === "zh" ? "进入阶段" : "Enter phase"}<Icon name="arrow" size={14} /></Link></article>; })}</div>
      </section>

      <section className="home-section trail-section">
        <div className="section-intro"><span className="eyebrow">LEARNING TRAIL</span><h2>{c.trail}</h2><p>{c.trailLead}</p></div>
        <div className="trail-list">{trail.map((item, index) => <Link href={`/${item.slug}`} key={item.slug}><em>{String(index + 1).padStart(2, "0")}</em><span><b>{text(item.label, locale)}</b><small>{pages[item.slug]?.summary[locale]}</small></span><Icon name="arrow" /></Link>)}</div>
      </section>
    </>
  );
}

function SourceMapPage({ locale }: { locale: Locale }) {
  const page = pages["source-map"];
  return <><PageHero page={page} locale={locale} /><div className="domain-grid">{sourceDomains.map((domain, index) => <article className="domain-card" key={domain.id}><div className="domain-index">{String(index + 1).padStart(2, "0")}</div><h2>{text(domain.title, locale)}</h2><p>{text(domain.purpose, locale)}</p><div className="domain-files">{domain.files.map((file) => <a href={`${UPSTREAM_REPO}/blob/${SOURCE_SHA}/${file}`} target="_blank" rel="noreferrer" key={file}>{file}<span>↗</span></a>)}</div><div className="domain-symbols">{domain.symbols.map((symbol) => <code key={symbol}>{symbol}</code>)}</div><dl><div><dt>UPSTREAM</dt><dd>{text(domain.upstream, locale)}</dd></div><div><dt>DOWNSTREAM</dt><dd>{text(domain.downstream, locale)}</dd></div></dl></article>)}</div></>;
}

function CallFlowsPage({ locale }: { locale: Locale }) {
  const page = pages["call-flows"];
  const [flowId, setFlowId] = useState(callFlows[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const flow = callFlows.find((item) => item.id === flowId) ?? callFlows[0];
  const selected = flow.steps[stepIndex] ?? flow.steps[0];
  const lanes = { ui: "Renderer", bridge: "Preload / IPC", main: "Main", runtime: "PTY", external: "External", state: "State" };
  return <><PageHero page={page} locale={locale} /><div className="flow-explorer"><div className="flow-tabs" role="tablist">{callFlows.map((item, index) => <button className={item.id === flowId ? "active" : ""} key={item.id} onClick={() => { setFlowId(item.id); setStepIndex(0); }}><span>{String(index + 1).padStart(2, "0")}</span>{text(item.title, locale)}</button>)}</div><div className="flow-stage"><div className="flow-stage-head"><span>CALL FLOW / {flow.id.toUpperCase()}</span><h2>{text(flow.title, locale)}</h2><p>{text(flow.summary, locale)}</p></div><div className="flow-timeline">{flow.steps.map((step, index) => <button className={`${step.lane} ${index === stepIndex ? "active" : ""}`} onClick={() => setStepIndex(index)} key={`${flow.id}-${index}`}><em>{String(index + 1).padStart(2, "0")}</em><span><small>{lanes[step.lane]}</small><b>{text(step.title, locale)}</b></span>{index < flow.steps.length - 1 && <i />}</button>)}</div><div className="flow-detail"><div className={`lane-tag ${selected.lane}`}>{lanes[selected.lane]}</div><div><h3>{text(selected.title, locale)}</h3><p>{text(selected.action, locale)}</p><dl><div><dt>INPUT</dt><dd>{text(selected.input, locale)}</dd></div><div><dt>OUTPUT</dt><dd>{text(selected.output, locale)}</dd></div></dl></div><SourceCard source={selected.source} locale={locale} /></div></div></div></>;
}

function LearningPathPage({ locale }: { locale: Locale }) {
  const page = pages["learning-path"];
  return <><PageHero page={page} locale={locale} /><div className="path-phases">{coursePhases.map((phase) => { const lessons = navigation.filter((item) => item.slug && item.phase === phase.id); return <section key={phase.id}><div className="path-phase-head"><em>PHASE {phase.id}</em><div><h2>{text(phase.label, locale)}</h2><p>{text(phase.outcome, locale)}</p></div></div><div>{lessons.map((item) => <Link href={`/${item.slug}`} key={item.slug}><span>{String(item.lesson).padStart(2, "0")}</span><b>{text(item.label, locale)}</b><small>{pages[item.slug]?.readTime} {ui[locale].read}</small><Icon name="arrow" size={15} /></Link>)}</div></section>; })}</div><div className="learning-road compact-road"><div className="road-line" />{learningLevels.map((item) => <Link href={item.href} className="road-level" key={item.level}><em>{String(item.level).padStart(2, "0")}</em><div><span>READER ROUTE {item.level}</span><h2>{text(item.title, locale)}</h2><p>{text(item.text, locale)}</p></div><Icon name="arrow" /></Link>)}</div></>;
}

function PageHero({ page, locale }: { page: (typeof pages)[string]; locale: Locale }) {
  return <section className="page-hero"><div className="page-hero-meta"><span>{text(page.kicker, locale)}</span><span>{page.readTime} {ui[locale].read}</span>{page.level && <span>{page.level}</span>}</div><h1>{text(page.title, locale)}</h1><p>{text(page.summary, locale)}</p>{page.keyQuestion && <div className="lesson-contract"><div className="contract-question"><span>{ui[locale].keyQuestion}</span><strong>{text(page.keyQuestion, locale)}</strong></div><div className="contract-objectives"><span>{ui[locale].objectives}</span><ul>{page.objectives?.map((objective, index) => <li key={index}><Icon name="check" size={14} />{text(objective, locale)}</li>)}</ul></div><div className="contract-prerequisites"><span>{ui[locale].prerequisites}</span>{page.prerequisites?.length ? <div>{page.prerequisites.map((prerequisite) => { const navItem = navigation.find((item) => item.slug === prerequisite); return <Link href={`/${prerequisite}`} key={prerequisite}>{navItem ? text(navItem.label, locale) : prerequisite}<Icon name="arrow" size={12} /></Link>; })}</div> : <p>{ui[locale].noPrerequisite}</p>}</div></div>}<div className="page-rule"><i /></div></section>;
}

function ArchitectureLabPage({ locale }: { locale: Locale }) { return <><PageHero page={pages["architecture-lab"]} locale={locale} /><ArchitectureLab locale={locale} /></>; }
function GlossaryPage({ locale }: { locale: Locale }) { return <><PageHero page={pages.glossary} locale={locale} /><GlossaryExplorer locale={locale} /></>; }
function SelfCheckPage({ locale }: { locale: Locale }) { return <><PageHero page={pages["self-check"]} locale={locale} /><KnowledgeCheck locale={locale} /></>; }

function GenericPage({ slug, locale }: { slug: string; locale: Locale }) {
  const page = pages[slug];
  return <><PageHero page={page} locale={locale} /><div className="article-layout"><article className="article-content">{page.sections.map((section, index) => <SectionBlock section={section} index={index} locale={locale} key={section.id} />)}</article><aside className="page-toc"><span>{ui[locale].toc}</span>{page.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><i>{String(index + 1).padStart(2, "0")}</i>{text(section.title, locale)}</a>)}</aside></div></>;
}

function LessonCompletion({ slug, locale, completed, toggle }: { slug: string; locale: Locale; completed: boolean; toggle: () => void }) {
  const page = pages[slug];
  if (!page) return null;
  return <section className={`lesson-completion ${completed ? "done" : ""}`}><div><span>{completed ? "LESSON COMPLETE" : "LESSON CHECKPOINT"}</span><h2>{completed ? ui[locale].completed : (locale === "zh" ? "能用自己的话回答核心问题了吗？" : "Can you answer the key question in your own words?")}</h2>{page.takeaways?.map((item, index) => <p key={index}><Icon name="check" size={14} />{text(item, locale)}</p>)}</div><button onClick={toggle}><Icon name="check" size={18} />{completed ? ui[locale].completed : ui[locale].complete}</button></section>;
}

function PageFooter({ slug, locale }: { slug: string; locale: Locale }) {
  const index = navigation.findIndex((item) => item.slug === slug);
  const previous = index > 0 ? navigation[index - 1] : null;
  const next = index >= 0 && index < navigation.length - 1 ? navigation[index + 1] : null;
  return <footer className="page-footer"><div className="pager">{previous ? <Link href={`/${previous.slug}`}><small>← {ui[locale].previous}</small><b>{text(previous.label, locale)}</b></Link> : <span />}{next ? <Link className="next" href={`/${next.slug}`}><small>{ui[locale].next} →</small><b>{text(next.label, locale)}</b></Link> : <Link className="next" href="/"><small>BACK TO</small><b>Overview</b></Link>}</div><div className="footer-base"><span>MUNDER DIFFLIN / ARCHITECTURE FIELD GUIDE</span><span>Source <a href={`${UPSTREAM_REPO}/tree/${SOURCE_SHA}`}>{SOURCE_SHORT_SHA}</a> · 2026</span></div></footer>;
}

export default function LearningSite({ slug }: { slug: string }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  /* One-time reconciliation with browser-owned preferences after SSR. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedLocale = localStorage.getItem("md-locale") as Locale | null;
    const savedTheme = localStorage.getItem("md-theme") as "light" | "dark" | null;
    if (savedLocale === "zh" || savedLocale === "en") setLocaleState(savedLocale);
    if (savedTheme === "light" || savedTheme === "dark") setThemeState(savedTheme);
    try { const savedCompleted = JSON.parse(localStorage.getItem("md-course-completed") ?? "[]"); if (Array.isArray(savedCompleted)) setCompleted(savedCompleted.filter((item): item is string => typeof item === "string")); } catch { /* Ignore malformed browser cache. */ }
    setPreferencesReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => { document.documentElement.dataset.theme = theme; if (preferencesReady) localStorage.setItem("md-theme", theme); }, [theme, preferencesReady]);
  useEffect(() => { document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"; if (preferencesReady) localStorage.setItem("md-locale", locale); }, [locale, preferencesReady]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const setLocale = (value: Locale) => setLocaleState(value);
  const setTheme = (value: "light" | "dark") => setThemeState(value);
  const chapter = useMemo(() => navigation.findIndex((item) => item.slug === slug), [slug]);
  const special = slug === "source-map" ? <SourceMapPage locale={locale} /> : slug === "call-flows" ? <CallFlowsPage locale={locale} /> : slug === "learning-path" ? <LearningPathPage locale={locale} /> : slug === "architecture-lab" ? <ArchitectureLabPage locale={locale} /> : slug === "glossary" ? <GlossaryPage locale={locale} /> : slug === "self-check" ? <SelfCheckPage locale={locale} /> : slug ? <GenericPage slug={slug} locale={locale} /> : <Home locale={locale} completed={completed} />;
  const toggleCompleted = () => setCompleted((items) => { const next = items.includes(slug) ? items.filter((item) => item !== slug) : [...items, slug]; localStorage.setItem("md-course-completed", JSON.stringify(next)); return next; });

  return (
    <div className="site-shell">
      <Header locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} openNav={() => setNavOpen(true)} onSearch={() => setSearchOpen(true)} />
      <Sidebar slug={slug} locale={locale} open={navOpen} close={() => setNavOpen(false)} completed={completed} />
      <main className="main-column">
        {slug && <div className="chapter-rail"><span>CHAPTER {String(chapter).padStart(2, "0")}</span><i><b style={{ width: `${Math.max(5, (chapter / (navigation.length - 1)) * 100)}%` }} /></i></div>}
        {special}
        {slug && <LessonCompletion slug={slug} locale={locale} completed={completed.includes(slug)} toggle={toggleCompleted} />}
        <PageFooter slug={slug} locale={locale} />
      </main>
      <button className={`snapshot-pill ${copied ? "copied" : ""}`} onClick={async () => { await navigator.clipboard.writeText(SOURCE_SHA); setCopied(true); setTimeout(() => setCopied(false), 1400); }}><Icon name={copied ? "check" : "copy"} size={14} /><span>{copied ? ui[locale].copied : SOURCE_SHORT_SHA}</span></button>
      {searchOpen && <SearchDialog locale={locale} close={() => setSearchOpen(false)} />}
    </div>
  );
}
