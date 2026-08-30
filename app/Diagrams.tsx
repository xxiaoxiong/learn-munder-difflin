import type { DiagramKey, Locale } from "./site-data";

type Copy = { zh: string; en: string };
type Node = { title: Copy; detail: Copy; tone?: string };

const t = (zh: string, en: string): Copy => ({ zh, en });

function DiagramNode({ node, locale }: { node: Node; locale: Locale }) {
  return (
    <div className={`diagram-node ${node.tone ?? ""}`}>
      <strong>{node.title[locale]}</strong>
      <span>{node.detail[locale]}</span>
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="diagram-arrow" aria-hidden="true">
      {label && <span>{label}</span>}
      <i>→</i>
    </div>
  );
}

const data: Record<DiagramKey, { title: Copy; caption: Copy }> = {
  "system-context": {
    title: t("系统边界：管理 Agent，而非实现 Agent", "System boundary: manage agents, do not implement them"),
    caption: t("虚线外是 Munder Difflin 不拥有的推理运行时与模型服务。", "Beyond the dashed edge sit inference runtimes and model services Munder Difflin does not own."),
  },
  "electron-layers": {
    title: t("Electron 权限分层", "Electron privilege layers"),
    caption: t("所有 Node 能力都留在 Main；Renderer 只能经 preload 暴露的 cth API 请求。", "All Node privileges remain in Main; Renderer can request only the cth API exposed by preload."),
  },
  "launch-sequence": {
    title: t("Agent 启动主链", "Agent launch chain"),
    caption: t("一个入口串起 UI、IPC、workspace、Hive、provider 适配与真实进程。", "One entry links UI, IPC, workspace, Hive, provider adaptation, and the real process."),
  },
  "prompt-roundtrip": {
    title: t("Prompt 与终端输出往返", "Prompt and terminal output round trip"),
    caption: t("输入需要等待安全窗口；输出按 PTY owner 回送，并同时进入 xterm 与状态解析。", "Input waits for a safe window; output returns to the PTY owner and feeds both xterm and state parsing."),
  },
  "hive-flow": {
    title: t("Hive 文件协议与投递分支", "Hive file protocol and delivery branches"),
    caption: t("Task ledger 表示工作意图；mailbox / terminal queue 才承担实际投递。", "The task ledger represents work intent; mailboxes and terminal queues perform delivery."),
  },
  "state-layers": {
    title: t("状态不是一张表：五层权威", "State is not one table: five authorities"),
    caption: t("源码当前 SQLite 仅保存窗口 KV 和命令历史；其余状态各有明确归属。", "Current source uses SQLite only for window KV and command history; other state has distinct owners."),
  },
  "pty-lifecycle": {
    title: t("PTY 生命周期与重启保护", "PTY lifecycle and restart guards"),
    caption: t("同一个 ptyId 可重用，但 session identity 防止旧进程回调污染新会话。", "A PTY id can be reused, while session identity prevents stale callbacks from corrupting a new session."),
  },
  "module-map": {
    title: t("模块依赖地图", "Module dependency map"),
    caption: t("Main 是能力核心，Renderer 是可视化控制台，外部 CLI 是 Agent runtime。", "Main is the capability core, Renderer the visual console, and external CLIs the agent runtime."),
  },
  "workspace-isolation": {
    title: t("Worktree 隔离与保全策略", "Worktree isolation and preservation"),
    caption: t("隔离是 best-effort；清理则偏向保全，脏或领先分支不会被自动删除。", "Isolation is best-effort; cleanup favors preservation, so dirty or ahead worktrees survive."),
  },
};

function SystemContext({ locale }: { locale: Locale }) {
  const left: Node = { title: t("人类 / Trigger", "Human / trigger"), detail: t("输入目标、确认、干预", "Goals, confirmation, intervention"), tone: "accent" };
  const center: Node = { title: t("Munder Difflin", "Munder Difflin"), detail: t("Harness · Orchestration · Control plane · Visualization", "Harness · Orchestration · Control plane · Visualization"), tone: "primary" };
  const runtime: Node = { title: t("外部 CLI Runtime", "External CLI runtime"), detail: t("Claude Code · Codex · Gemini · …", "Claude Code · Codex · Gemini · …"), tone: "external" };
  const provider: Node = { title: t("模型 / Tool 服务", "Model / tool services"), detail: t("推理、tool loop、provider session", "Inference, tool loop, provider session"), tone: "external" };
  return (
    <div className="context-diagram">
      <DiagramNode node={left} locale={locale} /><Arrow label={locale === "zh" ? "操作" : "operate"} />
      <DiagramNode node={center} locale={locale} /><Arrow label="PTY" />
      <div className="external-boundary"><DiagramNode node={runtime} locale={locale} /><Arrow label="API" /><DiagramNode node={provider} locale={locale} /></div>
    </div>
  );
}

function LayerDiagram({ locale }: { locale: Locale }) {
  const layers: Node[] = [
    { title: t("Renderer", "Renderer"), detail: t("React · Zustand · Pixi · xterm · Monaco", "React · Zustand · Pixi · xterm · Monaco"), tone: "ui" },
    { title: t("Preload / window.cth", "Preload / window.cth"), detail: t("contextBridge · typed IPC capabilities", "contextBridge · typed IPC capabilities"), tone: "bridge" },
    { title: t("Main Process", "Main process"), detail: t("PTY · FS · Git · SQLite · Hive · network", "PTY · FS · Git · SQLite · Hive · network"), tone: "main" },
    { title: t("OS 与外部进程", "OS and child processes"), detail: t("node-pty · git/gh · CLI agents · filesystem", "node-pty · git/gh · CLI agents · filesystem"), tone: "external" },
  ];
  return <div className="layer-diagram">{layers.map((node, index) => <div className="layer-row" key={node.title.en}><span>{String(index + 1).padStart(2, "0")}</span><DiagramNode node={node} locale={locale} />{index < layers.length - 1 && <b>↓</b>}</div>)}</div>;
}

function SequenceDiagram({ locale, mode }: { locale: Locale; mode: "launch" | "roundtrip" | "pty" | "worktree" }) {
  const sequences: Record<typeof mode, Node[]> = {
    launch: [
      { title: t("AddAgentModal", "AddAgentModal"), detail: t("校验表单 / tokenize", "Validate / tokenize"), tone: "ui" },
      { title: t("preload.spawnPty", "preload.spawnPty"), detail: t("ipcRenderer.invoke", "ipcRenderer.invoke"), tone: "bridge" },
      { title: t("spawnAgentCore", "spawnAgentCore"), detail: t("provider · install · resume", "provider · install · resume"), tone: "main" },
      { title: t("Git + Hive", "Git + Hive"), detail: t("worktree · identity · env", "worktree · identity · env"), tone: "state" },
      { title: t("PtyManager.spawn", "PtyManager.spawn"), detail: t("command · cwd · args · env", "command · cwd · args · env"), tone: "runtime" },
      { title: t("CLI Agent", "CLI agent"), detail: t("拥有 agent loop", "Owns the agent loop"), tone: "external" },
    ],
    roundtrip: [
      { title: t("消息队列", "Message queue"), detail: t("prompt 等待", "Prompt waits"), tone: "ui" },
      { title: t("安全投递门", "Safe delivery gate"), detail: t("idle · quiet · no picker", "Idle · quiet · no picker"), tone: "state" },
      { title: t("pty:write × 2", "pty:write × 2"), detail: t("文本 → 140ms → Enter", "Text → 140ms → Enter"), tone: "bridge" },
      { title: t("CLI Agent", "CLI agent"), detail: t("模型 / tool loop", "Model / tool loop"), tone: "external" },
      { title: t("pty:data:id", "pty:data:id"), detail: t("owner window", "Owner window"), tone: "main" },
      { title: t("xterm + parser", "xterm + parser"), detail: t("显示 + 状态", "View + state"), tone: "ui" },
    ],
    pty: [
      { title: t("validate", "validate"), detail: t("id / cwd / command", "id / cwd / command"), tone: "state" },
      { title: t("resolve", "resolve"), detail: t("PATH / Windows shim", "PATH / Windows shim"), tone: "main" },
      { title: t("spawn", "spawn"), detail: t("xterm-256color", "xterm-256color"), tone: "runtime" },
      { title: t("stream", "stream"), detail: t("data / write / resize", "data / write / resize"), tone: "runtime" },
      { title: t("exit", "exit"), detail: t("identity guard", "identity guard"), tone: "accent" },
      { title: t("reap", "reap"), detail: t("process tree cleanup", "process tree cleanup"), tone: "external" },
    ],
    worktree: [
      { title: t("检查 Git repo", "Check Git repo"), detail: t("mainRepoRoot", "mainRepoRoot"), tone: "state" },
      { title: t("创建 agent/<id>", "Create agent/<id>"), detail: t("worktrees/<id>", "worktrees/<id>"), tone: "main" },
      { title: t("Agent 执行", "Agent executes"), detail: t("独立 cwd", "Isolated cwd"), tone: "runtime" },
      { title: t("退出审计", "Exit audit"), detail: t("dirty / ahead?", "Dirty / ahead?"), tone: "accent" },
      { title: t("保留或清理", "Preserve or clean"), detail: t("fail safe", "Fail safe"), tone: "external" },
    ],
  };
  return <div className="sequence-diagram">{sequences[mode].map((node, index) => <div className="sequence-item" key={`${mode}-${node.title.en}`}><DiagramNode node={node} locale={locale} />{index < sequences[mode].length - 1 && <Arrow label={String(index + 1).padStart(2, "0")} />}</div>)}</div>;
}

function HiveDiagram({ locale }: { locale: Locale }) {
  return (
    <div className="hive-diagram">
      <div className="hive-column"><small>INTENT</small><DiagramNode locale={locale} node={{ title: t("tasks.json", "tasks.json"), detail: t("todo · doing · blocked · done", "todo · doing · blocked · done"), tone: "state" }} /></div>
      <Arrow label={locale === "zh" ? "派单" : "assign"} />
      <div className="hive-core"><small>ROUTER · 1.5s</small><DiagramNode locale={locale} node={{ title: t("HiveManager", "HiveManager"), detail: t("registry · route · log · Git", "registry · route · log · Git"), tone: "primary" }} /><div className="hive-branches"><span>↙ inbox</span><span>handoff ↘</span></div></div>
      <div className="hive-targets"><DiagramNode locale={locale} node={{ title: t("Hook / inbox Agent", "Hook / inbox agent"), detail: t("文件投递 + idle nudge", "File delivery + idle nudge"), tone: "runtime" }} /><DiagramNode locale={locale} node={{ title: t("Terminal-only Agent", "Terminal-only agent"), detail: t("Renderer 安全队列", "Renderer safe queue"), tone: "ui" }} /></div>
    </div>
  );
}

function StateDiagram({ locale }: { locale: Locale }) {
  const nodes: Node[] = [
    { title: t("SQLite", "SQLite"), detail: t("kv · command_history", "kv · command_history"), tone: "accent" },
    { title: t("config / roster", "config / roster"), detail: t("config.json · roster.json · localStorage", "config.json · roster.json · localStorage"), tone: "state" },
    { title: t("Hive files + Git", "Hive files + Git"), detail: t("registry · tasks · mailboxes · memory", "registry · tasks · mailboxes · memory"), tone: "primary" },
    { title: t("运行时内存", "Runtime memory"), detail: t("PTY sessions · timers · breaker", "PTY sessions · timers · breaker"), tone: "runtime" },
    { title: t("外部 CLI", "External CLI"), detail: t("transcripts · CODEX_HOME · credentials", "Transcripts · CODEX_HOME · credentials"), tone: "external" },
  ];
  return <div className="state-diagram">{nodes.map((node, index) => <div className="state-card" key={node.title.en}><em>{String(index + 1).padStart(2, "0")}</em><DiagramNode node={node} locale={locale} /></div>)}</div>;
}

function ModuleMap({ locale }: { locale: Locale }) {
  return <div className="module-map"><div className="module-top"><DiagramNode locale={locale} node={{title:t("Renderer", "Renderer"),detail:t("App · Office · terminal · store", "App · Office · terminal · store"),tone:"ui"}}/><DiagramNode locale={locale} node={{title:t("Preload", "Preload"),detail:t("window.cth capability surface", "window.cth capability surface"),tone:"bridge"}}/></div><span className="module-line">↕ IPC</span><div className="module-core"><DiagramNode locale={locale} node={{title:t("Main / Bootstrap", "Main / bootstrap"),detail:t("生命周期 + manager 组装", "Lifecycle + manager assembly"),tone:"primary"}}/><div className="module-grid"><DiagramNode locale={locale} node={{title:t("PTY", "PTY"),detail:t("进程", "Processes"),tone:"runtime"}}/><DiagramNode locale={locale} node={{title:t("Hive", "Hive"),detail:t("协调", "Coordination"),tone:"state"}}/><DiagramNode locale={locale} node={{title:t("Git", "Git"),detail:t("隔离", "Isolation"),tone:"accent"}}/><DiagramNode locale={locale} node={{title:t("Perimeter", "Perimeter"),detail:t("voice · trigger · OTel", "Voice · trigger · OTel"),tone:"external"}}/></div></div><span className="module-line">↓ child process / filesystem / HTTP</span><div className="module-bottom"><span>CLI runtimes</span><span>Hive files</span><span>Git worktrees</span><span>Provider services</span></div></div>;
}

export function ArchitectureDiagram({ kind, locale }: { kind: DiagramKey; locale: Locale }) {
  const copy = data[kind];
  let content: React.ReactNode;
  if (kind === "system-context") content = <SystemContext locale={locale} />;
  else if (kind === "electron-layers") content = <LayerDiagram locale={locale} />;
  else if (kind === "launch-sequence") content = <SequenceDiagram locale={locale} mode="launch" />;
  else if (kind === "prompt-roundtrip") content = <SequenceDiagram locale={locale} mode="roundtrip" />;
  else if (kind === "hive-flow") content = <HiveDiagram locale={locale} />;
  else if (kind === "state-layers") content = <StateDiagram locale={locale} />;
  else if (kind === "pty-lifecycle") content = <SequenceDiagram locale={locale} mode="pty" />;
  else if (kind === "workspace-isolation") content = <SequenceDiagram locale={locale} mode="worktree" />;
  else content = <ModuleMap locale={locale} />;
  return <figure className="architecture-diagram"><div className="diagram-heading"><span>{locale === "zh" ? "交互图解" : "VISUAL MODEL"}</span><h3>{copy.title[locale]}</h3></div>{content}<figcaption>{copy.caption[locale]}</figcaption></figure>;
}
