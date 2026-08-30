"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { glossaryTerms, labFacts, quizQuestions } from "./course-data";
import type { Locale, Localized } from "./site-data";

const text = (value: Localized, locale: Locale) => value[locale];

export function ArchitectureLab({ locale }: { locale: Locale }) {
  const [lab, setLab] = useState<"launch" | "routing" | "authority">("launch");
  const [provider, setProvider] = useState("codex");
  const [isolation, setIsolation] = useState("worktree");
  const [resume, setResume] = useState(true);
  const [target, setTarget] = useState("busy");
  const [broadcast, setBroadcast] = useState(false);
  const [fact, setFact] = useState<(typeof labFacts)[number]["id"]>("task");

  const c = locale === "zh" ? {
    labels: ["实验 A · 创建 Agent", "实验 B · 路由消息", "实验 C · 状态权威"],
    launchTitle: "改变 Provider、隔离和恢复，预测创建链",
    provider: "Provider", isolation: "工作区隔离", resume: "继续已有会话", yes: "是", no: "否",
    routeTitle: "改变目标状态，观察持久记录与即时投递",
    target: "目标状态", broadcast: "广播消息", result: "推演结果", invariant: "必须保持的不变量", source: "回到相关课程",
    authorityTitle: "选择一个事实，判断谁说了算",
  } : {
    labels: ["Lab A · Launch agent", "Lab B · Route message", "Lab C · State authority"],
    launchTitle: "Change provider, isolation, and resume to predict the launch trace",
    provider: "Provider", isolation: "Workspace isolation", resume: "Resume prior session", yes: "Yes", no: "No",
    routeTitle: "Change target state to observe durability and immediate delivery",
    target: "Target state", broadcast: "Broadcast", result: "Simulation result", invariant: "Invariant", source: "Open related lesson",
    authorityTitle: "Choose a fact and decide who has authority",
  };

  const launchTrace = useMemo(() => {
    const preset = provider === "codex" ? "providerPreset(codex) → resume subcommand / CODEX_HOME" : provider === "claude" ? "providerPreset(claude) → resume flag / hook capability" : "custom preset → explicit command validation";
    const workspace = isolation === "worktree" ? "create isolated worktree + branch → bind PTY cwd" : isolation === "shared" ? "reuse project cwd → isolation warning" : "isolation creation fails → abort (fail closed)";
    const session = resume ? "resolve provider session id → assemble provider-specific resume tokens" : "create a fresh provider session";
    const finish = isolation === "failed" ? "no PTY is created; return actionable error" : "PtyManager.create → register roster/session → stream status to Renderer";
    return ["Renderer intent → Preload capability → Main spawnAgentCore", preset, workspace, session, finish];
  }, [provider, isolation, resume]);

  const routeTrace = useMemo(() => {
    const first = broadcast ? "snapshot eligible recipients → create per-recipient delivery facts" : "resolve one stable recipient id";
    const action = target === "idle" ? "persist mailbox → terminal handoff now → await handled evidence" : target === "busy" ? "persist mailbox → do not inject → router retries after a safe state" : target === "offline" ? "persist mailbox → mark pending, never claim delivered" : "reject with unknown-recipient error / dead-letter; do not discard silently";
    return [first, "assign stable message id → atomic protocol write", action];
  }, [target, broadcast]);

  const currentFact = labFacts.find((item) => item.id === fact) ?? labFacts[0];

  return (
    <div className="lab-shell">
      <div className="lab-tabs" role="tablist" aria-label="Architecture experiments">
        {(["launch", "routing", "authority"] as const).map((id, index) => <button role="tab" aria-selected={lab === id} className={lab === id ? "active" : ""} onClick={() => setLab(id)} key={id}><span>0{index + 1}</span>{c.labels[index]}</button>)}
      </div>

      {lab === "launch" && <div className="lab-workbench">
        <div className="lab-controls"><span className="eyebrow">SPAWN SCENARIO</span><h2>{c.launchTitle}</h2>
          <label>{c.provider}<select value={provider} onChange={(e) => setProvider(e.target.value)}><option value="codex">Codex</option><option value="claude">Claude Code</option><option value="custom">Custom CLI</option></select></label>
          <label>{c.isolation}<select value={isolation} onChange={(e) => setIsolation(e.target.value)}><option value="worktree">Git worktree</option><option value="shared">Shared cwd / best effort</option><option value="failed">Fail closed</option></select></label>
          <div className="control-row"><span>{c.resume}</span><button className={resume ? "active" : ""} onClick={() => setResume(true)}>{c.yes}</button><button className={!resume ? "active" : ""} onClick={() => setResume(false)}>{c.no}</button></div>
        </div>
        <div className="lab-output"><span>{c.result}</span><ol>{launchTrace.map((step, index) => <li key={step}><em>{String(index + 1).padStart(2, "0")}</em><p>{step}</p></li>)}</ol><div className={`lab-invariant ${isolation === "shared" ? "warning" : ""}`}><b>{c.invariant}</b><p>{locale === "zh" ? (isolation === "shared" ? "降级后的真实隔离级别必须可见；两个 worker 不能被误导为拥有独立写入边界。" : "只有工作区成功后才能创建 PTY；创建失败不得留下 roster、目录或孤儿进程。") : (isolation === "shared" ? "The weakened isolation level must be visible; workers must not be presented as independently isolated." : "Create the PTY only after workspace success; failure must leave no roster, directory, or orphan process.")}</p></div><Link href="/runtime">{c.source}<Icon name="arrow" size={15} /></Link></div>
      </div>}

      {lab === "routing" && <div className="lab-workbench">
        <div className="lab-controls"><span className="eyebrow">DELIVERY SCENARIO</span><h2>{c.routeTitle}</h2>
          <label>{c.target}<select value={target} onChange={(e) => setTarget(e.target.value)}><option value="idle">Online / idle</option><option value="busy">Online / busy</option><option value="offline">Offline</option><option value="unknown">Unknown recipient</option></select></label>
          <div className="control-row"><span>{c.broadcast}</span><button className={broadcast ? "active" : ""} onClick={() => setBroadcast(true)}>{c.yes}</button><button className={!broadcast ? "active" : ""} onClick={() => setBroadcast(false)}>{c.no}</button></div>
        </div>
        <div className="lab-output"><span>{c.result}</span><ol>{routeTrace.map((step, index) => <li key={step}><em>{String(index + 1).padStart(2, "0")}</em><p>{step}</p></li>)}</ol><div className="lab-invariant"><b>{c.invariant}</b><p>{locale === "zh" ? "mailbox persisted、PTY written 与 Agent handled 是三个状态；重试使用 message id 去重。" : "Mailbox persisted, PTY written, and Agent handled are three states; retries deduplicate by message id."}</p></div><Link href="/message-routing">{c.source}<Icon name="arrow" size={15} /></Link></div>
      </div>}

      {lab === "authority" && <div className="lab-workbench">
        <div className="lab-controls"><span className="eyebrow">AUTHORITY EXPLORER</span><h2>{c.authorityTitle}</h2><div className="fact-picker">{labFacts.map((item) => <button className={fact === item.id ? "active" : ""} onClick={() => setFact(item.id)} key={item.id}>{text(item.label, locale)}</button>)}</div></div>
        <div className="authority-card"><span>FACT / {currentFact.id.toUpperCase()}</span><h3>{text(currentFact.label, locale)}</h3><dl><div><dt>AUTHORITATIVE OWNER</dt><dd>{currentFact.owner}</dd></div><div><dt>STORE / REPRESENTATION</dt><dd>{currentFact.store}</dd></div><div><dt>RECOVERY</dt><dd>{text(currentFact.recovery, locale)}</dd></div></dl><Link href={currentFact.lesson}>{c.source}<Icon name="arrow" size={15} /></Link></div>
      </div>}
    </div>
  );
}

export function GlossaryExplorer({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState("all");
  const layerLabels: Record<string, Localized> = {
    all: { zh: "全部", en: "All" }, experience: { zh: "体验层", en: "Experience" }, control: { zh: "控制层", en: "Control" }, execution: { zh: "执行层", en: "Execution" }, facts: { zh: "事实层", en: "Facts" }, coordination: { zh: "协调", en: "Coordination" }, safety: { zh: "安全", en: "Safety" },
  };
  const filtered = glossaryTerms.filter((item) => {
    const haystack = `${item.term} ${text(item.definition, locale)} ${text(item.contrast, locale)}`.toLowerCase();
    return (layer === "all" || item.layer === layer) && haystack.includes(query.trim().toLowerCase());
  });
  return <div className="glossary-shell"><div className="glossary-tools"><label><Icon name="search" size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={locale === "zh" ? "搜索术语、定义或易混淆概念" : "Search terms, definitions, or confusions"} /></label><div role="tablist">{Object.entries(layerLabels).map(([id, label]) => <button className={layer === id ? "active" : ""} onClick={() => setLayer(id)} key={id}>{text(label, locale)}</button>)}</div><span>{filtered.length} / {glossaryTerms.length}</span></div><div className="glossary-grid">{filtered.map((item, index) => <article key={item.term}><div><em>{String(index + 1).padStart(2, "0")}</em><span>{text(layerLabels[item.layer], locale)}</span></div><h2>{item.term}</h2><p>{text(item.definition, locale)}</p><aside><b>{locale === "zh" ? "别混淆" : "DON’T CONFUSE"}</b>{text(item.contrast, locale)}</aside><Link href={item.href}>{locale === "zh" ? "继续理解" : "Open lesson"}<Icon name="arrow" size={14} /></Link></article>)}</div>{!filtered.length && <div className="empty-state">{locale === "zh" ? "没有匹配项，试试更短的关键词。" : "No matches. Try a shorter query."}</div>}</div>;
}

export function KnowledgeCheck({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const current = quizQuestions[index];
  const selected = answers[current.id];
  const answered = selected !== undefined;
  const score = quizQuestions.filter((item) => answers[item.id] === item.answer).length;
  const complete = Object.keys(answers).length === quizQuestions.length;
  const percent = Math.round((score / quizQuestions.length) * 100);
  const phaseScores = [0, 1, 2, 3, 4, 5].map((phase) => {
    const items = quizQuestions.filter((item) => item.phase === phase);
    return { phase, total: items.length, correct: items.filter((item) => answers[item.id] === item.answer).length };
  });
  const c = locale === "zh" ? { question: "情境题", correct: "判断正确", wrong: "再想一层", next: "下一题", previous: "上一题", explain: "为什么", review: "回看课程", result: "能力诊断", reset: "重新作答", answered: "已完成", of: "题", phase: "阶段" } : { question: "Scenario", correct: "Correct judgment", wrong: "Think one layer deeper", next: "Next", previous: "Previous", explain: "Why", review: "Review lesson", result: "Skill diagnosis", reset: "Reset", answered: "answered", of: "questions", phase: "Phase" };
  return <div className="quiz-shell"><div className="quiz-progress"><div><span>{Object.keys(answers).length} / {quizQuestions.length} {c.answered}</span><b style={{ width: `${(Object.keys(answers).length / quizQuestions.length) * 100}%` }} /></div>{quizQuestions.map((item, qIndex) => <button aria-label={`Question ${qIndex + 1}`} className={`${qIndex === index ? "active" : ""} ${answers[item.id] !== undefined ? (answers[item.id] === item.answer ? "correct" : "wrong") : ""}`} onClick={() => setIndex(qIndex)} key={item.id}>{qIndex + 1}</button>)}</div>
    <div className="quiz-card"><span>{c.question} {String(index + 1).padStart(2, "0")} / {quizQuestions.length}</span><h2>{text(current.prompt, locale)}</h2><div className="quiz-options">{current.options.map((option, optionIndex) => <button disabled={answered} className={answered ? (optionIndex === current.answer ? "correct" : optionIndex === selected ? "wrong" : "muted") : ""} onClick={() => setAnswers((value) => ({ ...value, [current.id]: optionIndex }))} key={optionIndex}><em>{String.fromCharCode(65 + optionIndex)}</em>{text(option, locale)}{answered && optionIndex === current.answer && <Icon name="check" size={16} />}</button>)}</div>{answered && <div className={`quiz-explanation ${selected === current.answer ? "correct" : "wrong"}`}><b>{selected === current.answer ? c.correct : c.wrong} · {c.explain}</b><p>{text(current.explanation, locale)}</p><Link href={current.href}>{c.review}<Icon name="arrow" size={14} /></Link></div>}<div className="quiz-nav"><button disabled={index === 0} onClick={() => setIndex((value) => value - 1)}>← {c.previous}</button><button disabled={index === quizQuestions.length - 1} onClick={() => setIndex((value) => value + 1)}>{c.next} →</button></div></div>
    {complete && <section className="quiz-result"><div className="result-score"><span>{c.result}</span><strong>{percent}<i>%</i></strong><p>{locale === "zh" ? (percent >= 80 ? "你已经能在新情境里做出稳定判断。建议带着扩展手册进入真实代码。" : "基础地图已经形成；按下方阶段得分回看薄弱环节，再做一次实验。") : (percent >= 80 ? "You can make stable judgments in new scenarios. Apply the extension playbook to real code." : "The map is forming. Review weaker phases below, then rerun the labs.")}</p></div><div className="phase-scores">{phaseScores.map((item) => <div key={item.phase}><span>{c.phase} {item.phase}</span><b>{item.correct}/{item.total}</b><i><em style={{ width: `${item.total ? (item.correct / item.total) * 100 : 0}%` }} /></i></div>)}</div><button onClick={() => { setAnswers({}); setIndex(0); }}>{c.reset}</button></section>}
  </div>;
}
