import { courseNavigation, deepPages, lessonSupplements, pagePatches } from "./course-data";

export const SOURCE_SHA = "956bfb4cff1af97f9cf29b9ce489ae69a5774843";
export const SOURCE_SHORT_SHA = SOURCE_SHA.slice(0, 8);
export const UPSTREAM_REPO = "https://github.com/chaitanyagiri/munder-difflin";
export const PROJECT_REPO = "https://github.com/xxiaoxiong/learn-munder-difflin";
export const SOURCE_BASE = `${UPSTREAM_REPO}/blob/${SOURCE_SHA}/`;

export type Locale = "zh" | "en";
export type Localized = { zh: string; en: string };

export type SourceRef = {
  path: string;
  lines?: string;
  symbols: string[];
  note: Localized;
  confidence?: "verified" | "runtime-unverified" | "design-only";
};

export type Section = {
  id: string;
  eyebrow?: Localized;
  title: Localized;
  lead: Localized;
  paragraphs?: Localized[];
  bullets?: Localized[];
  diagram?: DiagramKey;
  sources?: SourceRef[];
  callout?: { tone: "fact" | "warning" | "insight"; text: Localized };
  layers?: {
    intuition: Localized;
    mechanism: Localized[];
    invariants?: Localized[];
    checkpoint?: { question: Localized; answer: Localized };
  };
};

export type PageData = {
  slug: string;
  nav: Localized;
  kicker: Localized;
  title: Localized;
  summary: Localized;
  readTime: number;
  sections: Section[];
  phase?: number;
  lesson?: number;
  level?: "入门" | "进阶" | "深入" | "实战";
  keyQuestion?: Localized;
  objectives?: Localized[];
  prerequisites?: string[];
  takeaways?: Localized[];
};

export type NavigationItem = {
  slug: string;
  label: Localized;
  group: Localized;
  phase: number;
  lesson: number;
};

export type DiagramKey =
  | "system-context"
  | "electron-layers"
  | "launch-sequence"
  | "prompt-roundtrip"
  | "hive-flow"
  | "state-layers"
  | "pty-lifecycle"
  | "module-map"
  | "workspace-isolation";

const l = (zh: string, en: string): Localized => ({ zh, en });
const s = (
  path: string,
  lines: string | undefined,
  symbols: string[],
  zh: string,
  en: string,
  confidence: SourceRef["confidence"] = "verified",
): SourceRef => ({ path, lines, symbols, note: l(zh, en), confidence });

export const legacyNavigation = [
  { slug: "", label: l("首页", "Overview"), group: l("开始", "Start") },
  { slug: "architecture", label: l("架构总览", "Architecture"), group: l("核心", "Core") },
  { slug: "runtime", label: l("Agent 启动链", "Agent launch"), group: l("核心", "Core") },
  { slug: "hive", label: l("多 Agent / Hive", "Multi-agent / Hive"), group: l("核心", "Core") },
  { slug: "electron", label: l("Electron / IPC", "Electron / IPC"), group: l("运行时", "Runtime") },
  { slug: "pty", label: l("PTY Runtime", "PTY runtime"), group: l("运行时", "Runtime") },
  { slug: "state", label: l("状态与存储", "State & storage"), group: l("运行时", "Runtime") },
  { slug: "renderer", label: l("UI / Renderer", "UI / renderer"), group: l("界面", "Interface") },
  { slug: "integrations", label: l("Git 与外围模块", "Git & integrations"), group: l("界面", "Interface") },
  { slug: "source-map", label: l("源码地图", "Source map"), group: l("查阅", "Reference") },
  { slug: "call-flows", label: l("关键调用链", "Call flows"), group: l("查阅", "Reference") },
  { slug: "learning-path", label: l("学习路径", "Learning path"), group: l("查阅", "Reference") },
  { slug: "conclusions", label: l("架构结论", "Conclusions"), group: l("查阅", "Reference") },
] as const;

export const supportedProviders = [
  "Claude Code",
  "Codex",
  "Grok",
  "Kimi Code",
  "Gemini CLI",
  "Antigravity",
  "Qwen",
  "OpenCode",
  "Crush",
  "Pi",
  "Copilot",
  "Cursor",
  "Custom",
];

const basePages: Record<string, PageData> = {
  architecture: {
    slug: "architecture",
    nav: l("架构总览", "Architecture"),
    kicker: l("01 · SYSTEM CONTEXT", "01 · SYSTEM CONTEXT"),
    title: l("先把产品边界画对，再谈实现细节", "Draw the product boundary before reading implementation details"),
    summary: l(
      "Munder Difflin 是本地优先的多 CLI Agent harness：Electron 主进程掌握权限、进程、文件与调度，外部 CLI Agent 掌握模型推理与工具循环。",
      "Munder Difflin is a local-first multi-CLI agent harness: Electron owns privileged orchestration while external CLI agents own inference and tool loops.",
    ),
    readTime: 9,
    sections: [
      {
        id: "positioning",
        eyebrow: l("准确定位", "POSITIONING"),
        title: l("它是 harness + orchestration + control plane + visualization", "It combines harness, orchestration, control plane, and visualization"),
        lead: l(
          "它不实现通用 LLM 推理，也不替代 Claude Code、Codex 或 Gemini CLI 的 agent loop。它把这些已有 CLI 变成可创建、可隔离、可观察、可通信、可回收的本地 worker。",
          "It does not implement generic LLM inference or replace the agent loop in Claude Code, Codex, or Gemini CLI. It turns existing CLIs into locally managed workers.",
        ),
        bullets: [
          l("Harness：拼装命令、环境变量、模型/权限/恢复参数并托管终端。", "Harness: assembles commands, environment, model, permission, and resume arguments."),
          l("Orchestration：Hive registry、任务、邮箱路由、God/worker 分工、调度与 Closing Time。", "Orchestration: Hive registry, tasks, mailbox routing, god/worker roles, schedules, and Closing Time."),
          l("Control plane：Electron Main 内执行进程、文件、Git、数据库、网络与安全决策。", "Control plane: Electron Main performs process, file, Git, database, network, and safety operations."),
          l("Visualization：React + Zustand + Pixi + xterm 把真实运行状态映射为 office world。", "Visualization: React, Zustand, Pixi, and xterm map real runtime state into an office world."),
        ],
        diagram: "system-context",
        sources: [
          s("package.json", "L1-L57", ["dependencies", "scripts"], "依赖同时出现 Electron、node-pty、better-sqlite3、Pixi、xterm 与 Zustand，证明它是桌面编排壳而非模型库。", "The dependency set identifies a desktop orchestration shell rather than a model library."),
          s("src/shared/agentProvider.ts", "L20-L60", ["AgentProvider", "BridgeDescriptor"], "Provider 列表和 bridge 类型把外部 CLI 明确放在运行边界之外。", "Provider and bridge types place external CLIs beyond the harness boundary."),
          s("src/main/index.ts", "L2521-L2941", ["spawnAgentCore", "pty:spawn"], "统一 spawn 入口完成 provider 推断、worktree、Hive 注入与 PTY 启动。", "The unified spawn entry handles provider inference, worktrees, Hive injection, and PTY startup."),
        ],
      },
      {
        id: "where-multi-agent-lives",
        eyebrow: l("多 Agent 在哪里", "WHERE MULTI-AGENT LIVES"),
        title: l("多 Agent 发生在“多个独立 CLI 进程 + 一个本地协调层”", "Multi-agent means independent CLI processes plus one local coordination layer"),
        lead: l(
          "每个活跃 Agent 对应一个 PtyManager session 和一个 node-pty 子进程。它们共享 Hive 协议与任务账本，但拥有独立 CLI 会话、上下文窗口、终端、可选 worktree 和 provider 配置。",
          "Each active agent maps to a PtyManager session and a node-pty child process. Agents share Hive protocol and task ledgers while keeping separate CLI sessions, context windows, terminals, optional worktrees, and provider config.",
        ),
        callout: {
          tone: "insight",
          text: l("关键边界：Munder Difflin 管理 CLI 进程；CLI 再连接各自的 LLM Provider。模型推理不在 Electron 主进程中。", "Key boundary: Munder Difflin manages CLI processes; each CLI connects to its own LLM provider. Inference is not performed by Electron Main."),
        },
        sources: [
          s("src/main/pty.ts", "L532-L694", ["PtyManager.spawn", "pty.spawn", "PtySession"], "一条 session 记录持有 proc、cwd、command、owner 与输出时间。", "Each session owns its process, cwd, command, window owner, and output timestamps."),
          s("src/main/hive.ts", "L611-L720", ["HiveManager.ensureAgent", "SpawnInjection"], "Hive 只注入身份、协议、hook/bridge 与环境，不执行模型循环。", "Hive injects identity, protocol, bridges, and environment; it does not run the model loop."),
        ],
      },
      {
        id: "dependency-map",
        eyebrow: l("系统模块", "SYSTEM MODULES"),
        title: l("核心链与外围能力必须分开读", "Read the core chain separately from peripheral capabilities"),
        lead: l(
          "核心链是 Renderer → Preload → Main → Hive/PTY → 外部 CLI。Realtime voice、Slack/Webhook、tunnel、PostHog 和 updater 都挂在控制面外缘，不应被误认成 Agent 编排本体。",
          "The core chain is Renderer → Preload → Main → Hive/PTY → external CLI. Realtime voice, Slack/Webhook, tunnels, PostHog, and updater sit on the perimeter.",
        ),
        diagram: "module-map",
        sources: [
          s("electron.vite.config.ts", "L1-L77", ["defineConfig", "main", "preload", "renderer"], "构建配置直接给出三进程入口。", "Build configuration exposes the three process entry points."),
          s("src/main/index.ts", "L5174-L5247", ["app.whenReady", "bootstrapHiveServices", "createWindow"], "启动时按数据库、Hive、窗口、外部服务顺序组装系统。", "Startup assembles persistence, Hive, window, and peripheral services in order."),
        ],
      },
    ],
  },
  runtime: {
    slug: "runtime",
    nav: l("Agent 启动链", "Agent launch"),
    kicker: l("02 · LAUNCH PATH", "02 · LAUNCH PATH"),
    title: l("一个 Agent 如何真正跑起来", "How an agent actually starts"),
    summary: l("从 Add Agent 表单到外部 CLI 的完整入口链：参数校验、provider 推断、CLI 安装探测、Git 隔离、Hive 注入、恢复会话、权限姿态、PTY spawn。", "The complete path from Add Agent to the external CLI: validation, provider inference, CLI probing, Git isolation, Hive injection, resume, permissions, and PTY spawn."),
    readTime: 12,
    sections: [
      {
        id: "entry-chain",
        eyebrow: l("主调用链", "PRIMARY CALL CHAIN"),
        title: l("Renderer 只提出请求，Main 才能创建进程", "Renderer requests; Main creates the process"),
        lead: l("AddAgentModal 生成稳定 id 与 ptyId，preload 把结构化 SpawnPtyOptions 映射为 pty:spawn，Main 从唯一入口 spawnAgentCore 继续。", "AddAgentModal creates stable agent and PTY ids, preload maps SpawnPtyOptions to pty:spawn, and Main continues through the single spawnAgentCore entry."),
        diagram: "launch-sequence",
        sources: [
          s("src/renderer/src/components/AddAgentModal.tsx", "L391-L430", ["submit", "window.cth.spawnPty", "tokenizeCommand"], "表单层拆分命令并提交 cwd、provider、隔离、恢复与 Hive 元数据。", "The form submits cwd, provider, isolation, resume, and Hive metadata."),
          s("src/preload/index.ts", "L577-L622", ["spawnPty", "onPtyData", "onPtyExit"], "preload 暴露窄 API，没有把 ipcRenderer 本体交给页面。", "Preload exposes a narrow API instead of ipcRenderer itself."),
          s("src/main/index.ts", "L2521-L2555", ["ipcMain.handle('pty:spawn')", "spawnAgentCore"], "主进程验证输入、绑定窗口 owner 后进入统一核心。", "Main validates input, binds window ownership, and enters the shared core."),
        ],
      },
      {
        id: "provisioning",
        eyebrow: l("启动前编排", "PRE-SPAWN ORCHESTRATION"),
        title: l("在 pty.spawn 之前，控制面已经完成六类决策", "Six decisions complete before pty.spawn"),
        lead: l("实际顺序不是“点击后直接 spawn”。Main 会先扩展路径、判定 provider、检查/安装 CLI、创建 worktree、建立 Hive agent 目录与 bridge、补充模型/权限/恢复参数。", "The click does not directly spawn a process. Main expands paths, infers provider, probes the CLI, creates a worktree, provisions Hive, and adds model, permission, and resume arguments."),
        bullets: [
          l("路径：expandTilde 后再写入 registry 与 PTY，避免 `~` 被 Node 当成普通目录。", "Path: expandTilde runs before registry and PTY usage."),
          l("引擎：inferAgentProvider 以显式 provider 为先，否则从 executable 推断。", "Engine: inferAgentProvider honors explicit provider, then infers from the executable."),
          l("缺失 CLI：只运行 provider preset 内硬编码的可信安装命令，并在同一终端显示。", "Missing CLI: only trusted preset installers run, visibly, in the same terminal."),
          l("隔离：isolate=true 且 cwd 是 Git repo 时创建 `agent/<id>` worktree；失败会降级到共享 cwd。", "Isolation: isolate=true creates an `agent/<id>` worktree for Git repositories; failure falls back to shared cwd."),
          l("Hive：ensureAgent 写 identity、memory、邮箱、registry，并生成 provider 对应 hook/proxy。", "Hive: ensureAgent writes identity, memory, mailboxes, registry, and provider-specific bridges."),
          l("恢复：Claude 用 --resume；Codex 用 resume 子命令与正确 CODEX_HOME；其他 provider 读取 preset。", "Resume: Claude uses --resume; Codex uses its resume subcommand and owning CODEX_HOME; others follow presets."),
        ],
        sources: [
          s("src/main/index.ts", "L2561-L2719", ["isCommandAvailable", "addWorktree", "hive.ensureAgent"], "缺失引擎、worktree 与 Hive 的真实先后顺序。", "The actual ordering of engine checks, worktree creation, and Hive provisioning."),
          s("src/main/index.ts", "L2721-L2849", ["modelForRole", "seedSessionTranscript", "findCodexHomeForSession"], "provider-aware 的模型、权限与恢复参数。", "Provider-aware model, permissions, and resume arguments."),
          s("src/shared/agentProvider.ts", "L170-L245", ["AGENT_PROVIDER_PRESETS", "codex", "claude"], "Provider preset 声明默认命令、bridge、初始 prompt 与恢复能力。", "Provider presets declare commands, bridges, seed delivery, and resume behavior."),
        ],
      },
      {
        id: "process-boundary",
        eyebrow: l("最终边界", "FINAL BOUNDARY"),
        title: l("PtyManager.spawn 才真正创建 CLI 进程", "PtyManager.spawn is where the CLI process is actually created"),
        lead: l("最终调用 node-pty 的 pty.spawn(file, args, {cwd, env, cols, rows})。从这一刻起，外部 CLI 自己拥有 agent loop、模型连接、工具执行与上下文。", "The final call is node-pty's pty.spawn(file, args, {cwd, env, cols, rows}). From that point, the external CLI owns the agent loop, model connection, tools, and context."),
        sources: [
          s("src/main/pty.ts", "L532-L653", ["PtyManager.spawn", "resolveWindowsShimSpawn", "buildPtyEnv", "pty.spawn"], "跨平台命令解析和真正的进程创建点。", "Cross-platform command resolution and the actual process creation point."),
          s("src/main/ptyEnv.ts", undefined, ["buildPtyEnv"], "清理父会话身份变量，再合并交互式 PATH 与 per-agent env。", "Strips parent-session identity variables before merging user PATH and agent env."),
        ],
      },
    ],
  },
  hive: {
    slug: "hive",
    nav: l("多 Agent / Hive", "Multi-agent / Hive"),
    kicker: l("03 · ORCHESTRATION", "03 · ORCHESTRATION"),
    title: l("Hive：文件邮箱、任务账本与生命周期协调层", "Hive: file mailboxes, task ledger, and lifecycle coordination"),
    summary: l("Hive 不是一个内嵌 LLM planner，而是主进程中的本地协调协议：registry + agent directories + task files + poll router + hooks + safety controllers。", "Hive is not an embedded LLM planner. It is a main-process coordination protocol built from a registry, agent directories, task files, a polling router, hooks, and safety controllers."),
    readTime: 14,
    sections: [
      {
        id: "office-model",
        eyebrow: l("概念关系", "CONCEPTUAL MODEL"),
        title: l("Office 是可视化；Agent 是长期身份；Worker 是一次运行实例", "Office is visualization; an agent is durable identity; a worker is a running instance"),
        lead: l("Office/Floor 主要存在于 renderer。Hive registry 保存 agent 身份、角色、cwd、session 与状态；PTY session 是这次运行。Ephemeral worker 由 spawn-requests 文件触发，通常带独立 worktree。", "Office/Floor mainly lives in the renderer. Hive registry stores agent identity, role, cwd, session, and state; a PTY session is one run. Ephemeral workers are triggered by spawn-request files and usually get separate worktrees."),
        diagram: "workspace-isolation",
        sources: [
          s("src/main/hive.ts", "L133-L175", ["AgentMeta", "RegistryAgent", "Registry"], "registry 区分持久身份、运行状态与 archived 标记。", "The registry separates durable identity, runtime state, and archival."),
          s("src/main/index.ts", "L4497-L4868", ["processSpawnRequest", "ephemeralWorkerTick", "startEphemeralWorkerWatcher"], "主进程轮询 spawn-requests 并受 maxWorkers 限制。", "Main polls spawn requests under maxWorkers concurrency."),
        ],
      },
      {
        id: "mail-routing",
        eyebrow: l("消息路由", "MESSAGE ROUTING"),
        title: l("Agent 用 outbox 写信，Hive 每 1.5 秒路由到 inbox", "Agents write outbox files; Hive routes them to inboxes every 1.5 seconds"),
        lead: l("发送者目录决定真实 from，路由器规范化消息、应用 hop cap、解析 god/human/broadcast、检查 provider 的安全投递能力，再写目标 inbox 或发出 terminal handoff。", "The sender directory is authoritative. The router normalizes messages, applies a hop cap, resolves god/human/broadcast targets, checks provider delivery capability, and writes inbox files or emits a terminal handoff."),
        diagram: "hive-flow",
        bullets: [
          l("human 不对应独立审批队列；消息被路由给 god/orchestrator 代理。", "human is not a separate approval queue; messages route to the god/orchestrator proxy."),
          l("broadcast 只面向 active registry，排除归档 agent 与 send-only assistant。", "broadcast targets the active registry, excluding archived agents and the send-only assistant."),
          l("未知收件人、hookless provider 或失败的 terminal handoff 会记录 drop/bounce，避免静默丢信。", "Unknown recipients, hookless providers, or failed handoffs are logged and bounced rather than silently dropped."),
          l("outbox 文件成功路由后移动到 `.sent`；inbox 处理后进入 `.done`。", "Routed outbox files move to `.sent`; handled inbox files move to `.done`."),
        ],
        sources: [
          s("src/main/hive.ts", "L1487-L1633", ["send", "routeMessage", "emitTerminalHandoff"], "收件人解析、bounces、provider 分层和 renderer 事件。", "Recipient resolution, bounces, provider tiers, and renderer events."),
          s("src/main/hive.ts", "L1635-L1674", ["startRouter", "routeOnce"], "轮询每个 agent outbox，并用目录 id 强制真实发送者。", "Polls each outbox and makes the directory id authoritative."),
          s("src/renderer/src/hooks/useHive.ts", "L609-L888", ["onHiveTerminalHandoff", "dispatch", "submitToPty"], "Renderer 把 handoff 和 inbox nudge 放入同一安全队列，空闲时才输入 PTY。", "Renderer routes handoffs and nudges through the same idle-safe PTY queue."),
        ],
      },
      {
        id: "tasks-state",
        eyebrow: l("任务与状态", "TASKS & STATE"),
        title: l("Task 状态与 Agent 状态是两套状态机", "Task state and agent state are separate state machines"),
        lead: l("tasks.json 的卡片只有 todo / doing / blocked / done。Agent registry 记录 idle / working / blocked / gone；renderer 另外从 hook 与终端输出映射 idle / working / waiting / blocked。不要把 Kanban 状态当成进程状态。", "Task cards use todo/doing/blocked/done. The registry uses idle/working/blocked/gone, while renderer status adds waiting based on hooks and terminal output. Kanban state is not process state."),
        sources: [
          s("src/main/hive.ts", "L54-L175", ["HiveMessage", "HiveTask", "RegistryAgent"], "三种数据结构的状态字段在类型层就相互独立。", "Message, task, and agent state are separate in the type model."),
          s("src/main/hive.ts", "L1688-L1749", ["writeTasks", "addTask", "patchTask", "deleteTask"], "任务变更合并未知字段、原子写入并由单一 Hive committer 提交。", "Task mutations preserve unknown fields, write the ledger, and commit through the single Hive committer."),
          s("src/renderer/src/hooks/usePtyParser.ts", "L105-L181", ["usePtyParser", "BLOCK_HINTS"], "Renderer 用 TUI 输出补充状态：god 需要人时 blocked，worker 在 prompt 时 waiting。", "Renderer infers blocked vs waiting from the TUI, treating only god as human-blocked."),
        ],
      },
      {
        id: "safety-lifecycle",
        eyebrow: l("防失控与收尾", "SAFETY & SHUTDOWN"),
        title: l("Circuit Breaker 逐级升级；Closing Time 先保存再退出", "Circuit Breaker escalates gradually; Closing Time saves state before exit"),
        lead: l("Breaker 综合重复工具、错误风暴、token cap、速度与无进展信号，在 healthy → steering → constrained → stopped 间变化；hardStop 默认关闭。Closing Time 广播收尾、等待每个 worker ACK、验证 god COMPLETE 后才 teardown。", "The breaker combines repeated tools, error storms, token caps, velocity, and no-progress signals across healthy → steering → constrained → stopped; hardStop is off by default. Closing Time waits for worker acknowledgements before teardown."),
        sources: [
          s("src/main/breaker.ts", "L111-L345", ["CircuitBreaker", "tick", "evaluate"], "每个 beat 只升级或恢复一级，并把动作与状态分开。", "Each beat escalates or recovers one level and separates state from action."),
          s("src/main/closingTime.ts", "L53-L230", ["ClosingTimeController", "start", "onRouted"], "Closing Time 通过既有 inbox/steer rails 协调，不直接粗暴 kill。", "Closing Time coordinates through existing inbox and steer rails instead of immediately killing."),
          s("src/main/workerWake.ts", "L34-L120", ["WorkerWakeWatchdog", "classifyHook"], "主进程 watchdog 只唤醒真正空闲、有未读邮件且不处于 HITL 的 worker。", "The watchdog nudges only genuinely idle workers with unread mail and no HITL hold."),
        ],
      },
    ],
  },
  electron: {
    slug: "electron",
    nav: l("Electron / IPC", "Electron / IPC"),
    kicker: l("04 · PRIVILEGE BOUNDARY", "04 · PRIVILEGE BOUNDARY"),
    title: l("Main、Preload、Renderer、Shared 的权限分界", "Privilege boundaries across Main, Preload, Renderer, and Shared"),
    summary: l("Renderer 被 Chromium sandbox 隔离；Preload 用 contextBridge 暴露明确方法；所有进程、文件、Git、数据库与系统能力留在 Main。", "Renderer stays inside Chromium's sandbox; preload exposes explicit methods with contextBridge; process, filesystem, Git, database, and OS capabilities remain in Main."),
    readTime: 10,
    sections: [
      {
        id: "four-layers",
        eyebrow: l("四层职责", "FOUR LAYERS"),
        title: l("Shared 共享契约，Preload 共享能力但不共享权限", "Shared shares contracts; preload shares capabilities without sharing privileges"),
        lead: l("Shared 只能放无 Electron/UI 依赖的类型与 provider 规则；Renderer 负责视图和本地交互状态；Preload 把 IPC 包装成 window.cth；Main 是唯一可信执行层。", "Shared contains dependency-free contracts and provider rules; Renderer owns views and interaction state; preload wraps IPC as window.cth; Main is the trusted execution layer."),
        diagram: "electron-layers",
        sources: [
          s("electron.vite.config.ts", "L48-L77", ["main", "preload", "renderer", "alias"], "构建入口与 @shared alias 直接体现四层代码边界。", "Build entries and the @shared alias expose the code boundary."),
          s("src/main/index.ts", "L2216-L2251", ["createWindow", "webPreferences"], "窗口启用 sandbox 与 contextIsolation，并关闭 nodeIntegration。", "BrowserWindow enables sandbox and contextIsolation while disabling nodeIntegration."),
          s("src/preload/index.ts", "L565-L622", ["api", "spawnPty", "writePty"], "每个 capability 映射到固定 channel 与参数结构。", "Each capability maps to a fixed channel and argument shape."),
        ],
      },
      {
        id: "why-preload",
        eyebrow: l("为什么需要 Preload", "WHY PRELOAD"),
        title: l("页面不能直接 import Node，也不能拿到任意 IPC", "The page cannot import Node or access arbitrary IPC"),
        lead: l("如果把 ipcRenderer 或 fs 暴露给页面，任何 renderer 注入都能升级为本地文件/进程权限。当前 bridge 只暴露命名方法，Main 再做类型、路径、scheme 与状态校验。", "Exposing ipcRenderer or fs would turn renderer injection into local machine access. The current bridge exposes named methods while Main validates types, paths, schemes, and state."),
        bullets: [
          l("进程：pty:spawn / write / resize / kill 全部在 Main。", "Processes: PTY spawn/write/resize/kill stay in Main."),
          l("文件：fs:* IPC 调用 main/fs.ts 的 safeJoin 等路径保护。", "Files: fs:* IPC relies on path guards in main/fs.ts."),
          l("Git/GitHub：child_process 调 git/gh，Renderer 只接收结构化结果。", "Git/GitHub: Main invokes git/gh and returns normalized results."),
          l("数据库：better-sqlite3 是 native、同步模块，只在 Main 打开。", "Database: native synchronous better-sqlite3 opens only in Main."),
        ],
        sources: [
          s("src/main/index.ts", "L2943-L2964", ["pty:write", "pty:resize", "pty:kill", "pty:list"], "Main 对 PTY channel 做参数类型检查并调用 manager。", "Main validates PTY IPC arguments and delegates to the manager."),
          s("src/main/index.ts", "L3236-L3360", ["fs:listDir", "git:status", "git:checkout"], "文件与 Git 能力都在 Main 注册。", "Filesystem and Git capabilities are registered in Main."),
          s("src/main/db.ts", "L70-L167", ["PersistStore"], "SQLite 生命周期与查询完全位于主进程。", "SQLite lifecycle and queries live entirely in Main."),
        ],
      },
      {
        id: "event-return",
        eyebrow: l("事件返回", "EVENT RETURN PATH"),
        title: l("请求用 invoke/handle，流式事件用动态 channel", "Requests use invoke/handle; streams use dynamic channels"),
        lead: l("spawn/write 等请求用 Promise 风格 invoke/handle。PTY 输出与退出用 `pty:data:<id>`、`pty:exit:<id>` 推送；preload 返回取消订阅函数，renderer 的 terminalPool 全生命周期只订阅一次。", "Spawn/write requests use invoke/handle. PTY data and exit use dynamic push channels; preload returns unsubscribe functions and terminalPool subscribes once per terminal lifetime."),
        diagram: "prompt-roundtrip",
        sources: [
          s("src/main/pty.ts", "L655-L692", ["proc.onData", "proc.onExit", "safeSend"], "session identity guard 防止旧进程输出污染同 id 的新进程。", "A session identity guard prevents stale process events from corrupting a replacement."),
          s("src/renderer/src/components/terminalPool.ts", "L184-L216", ["onPtyData", "onPtyExit", "onPtyRelaunch"], "xterm pool 在视图卸载后仍保留 buffer 与订阅。", "The xterm pool preserves buffers and subscriptions while views detach."),
        ],
      },
    ],
  },
  pty: {
    slug: "pty",
    nav: l("PTY Runtime", "PTY runtime"),
    kicker: l("05 · PROCESS RUNTIME", "05 · PROCESS RUNTIME"),
    title: l("PTY 把外部 CLI 变成可管理 Worker", "PTY turns an external CLI into a managed worker"),
    summary: l("PtyManager 统一 spawn、输入、输出、resize、redraw、kill 与 quit sweep；它管理 OS 进程生命周期，但不实现模型 runtime。", "PtyManager unifies spawn, input, output, resize, redraw, kill, and quit sweeps. It manages OS process lifecycle, not model inference runtime."),
    readTime: 11,
    sections: [
      {
        id: "lifecycle",
        eyebrow: l("生命周期", "LIFECYCLE"),
        title: l("从 resolved command 到进程树清理", "From resolved command to process-tree cleanup"),
        lead: l("session map 以 ptyId 为键，保证一个 id 只有一个当前 owner。spawn 成功后注册 onData/onExit；显式 kill 会先杀 PTY、验证进程树，再同步移除 session；自然退出走相同 teardown hook。", "The session map keys by ptyId so only one current owner exists. Spawn registers onData/onExit; explicit kill terminates the PTY, verifies the process tree, and removes the session; natural exit invokes the same teardown hook."),
        diagram: "pty-lifecycle",
        sources: [
          s("src/main/pty.ts", "L305-L370", ["PtyManager", "attachExitHandler", "killByOwner"], "Manager 同时维护窗口 owner 与统一退出回调。", "The manager tracks window owners and a shared exit callback."),
          s("src/main/pty.ts", "L644-L748", ["pty.spawn", "onData", "onExit", "write", "resize", "kill"], "真正的 spawn 与五个核心操作都集中在一个类中。", "Actual spawn and core terminal operations live in one class."),
          s("src/main/procKill.ts", undefined, ["ensureKilled", "hardKillTree"], "进程树清理抽离为跨平台 best-effort 策略。", "Process-tree cleanup is isolated as a cross-platform best-effort policy."),
        ],
      },
      {
        id: "windows",
        eyebrow: l("跨平台差异", "CROSS-PLATFORM"),
        title: l("Windows 的难点不是 shell 名称，而是 shim、argv 与 ConPTY", "Windows complexity comes from shims, argv, and ConPTY"),
        lead: l("CreateProcess 不能直接执行 .cmd/.bat。实现优先解析 npm shim，直接启动其 interpreter + script，以保留多行 Hive prompt；解析失败才退回 cmd.exe，并显式警告多行参数会被截断。", "CreateProcess cannot directly execute .cmd/.bat. The implementation prefers decoding npm shims and launching the interpreter plus script so multi-line Hive prompts survive, falling back to cmd.exe with warnings."),
        bullets: [
          l("Unix 使用已缓存的交互式 shell PATH；Windows 继承 PATH 并追加 Hive runtime fallback。", "Unix uses cached interactive-shell PATH; Windows inherits PATH and appends the Hive runtime fallback."),
          l("Missing-CLI installer 走平台 shell；正常 CLI 尽量避免 shell parser。", "Missing-CLI installers use a platform shell; normal CLI launches avoid shell parsing when possible."),
          l("killAll 在 Windows 先同步 hardKillTree，再关闭 ConPTY，避免父进程退出后丢失后代。", "On Windows, killAll synchronously sweeps the process tree before closing ConPTY."),
        ],
        sources: [
          s("src/main/pty.ts", "L554-L643", ["resolveWindowsShimSpawn", "buildCmdCommandLine"], "Windows shim 解码与 cmd fallback 的完整分支。", "The complete Windows shim and cmd fallback branches."),
          s("src/main/pty.ts", "L773-L805", ["killAll", "hardKillTree"], "应用退出时 Windows/POSIX 采用不同清理策略。", "Quit-time cleanup differs between Windows and POSIX."),
          s("tools/patch-node-pty-conpty.cjs", undefined, ["ConPTY patch"], "postinstall 还会修补 node-pty ConPTY 行为。", "Postinstall also patches node-pty's ConPTY behavior."),
        ],
      },
      {
        id: "failure-recovery",
        eyebrow: l("故障与恢复", "FAILURE & RECOVERY"),
        title: l("同 id restart 通过 session identity guard 避免竞争", "Same-id restart avoids races with a session identity guard"),
        lead: l("kill 后马上以同 ptyId respawn 时，旧进程可能稍后才触发 onData/onExit。回调会检查 sessions.get(id) 是否仍是自己；不是就丢弃尾部输出和 stale exit。", "When a process is killed and respawned under the same ptyId, old callbacks can arrive late. Each callback verifies that it still owns the id before emitting."),
        callout: { tone: "fact", text: l("Sleep/wake 检查只用 signal 0 探测并通知，不自动替用户重启；真正 revive 仍由 renderer 的 spawn 流程负责。", "Sleep/wake health checks only probe and notify; renderer-owned spawn logic performs any real revive.") },
        sources: [
          s("src/main/pty.ts", "L655-L692", ["session identity guard"], "防止旧进程破坏新 TUI。", "Prevents the old process from corrupting the new TUI."),
          s("src/main/index.ts", "L5101-L5171", ["healthCheckPtys", "onSystemResume"], "睡眠恢复重新武装 scheduler/router，并延迟检查 PTY。", "Resume re-arms schedulers and the router before delayed PTY checks."),
          s("src/renderer/src/components/terminalPool.ts", "L848-L885", ["resetTerminal"], "Renderer 在不替换 Terminal 实例的情况下重置输入、picker 与显示。", "Renderer resets input and display without replacing the Terminal instance."),
        ],
      },
    ],
  },
  state: {
    slug: "state",
    nav: l("状态与存储", "State & storage"),
    kicker: l("06 · STATE MODEL", "06 · STATE MODEL"),
    title: l("四层状态：UI、Runtime、Persistent、External CLI", "Four state layers: UI, runtime, persistent, and external CLI"),
    summary: l("最重要的纠偏：当前 SQLite 只有 kv 与 command_history；Agent、队列、任务并没有统一进入 SQLite，而是分布在 Zustand/localStorage、roster.json、Hive 文件和外部 CLI 自己的存储中。", "Critical correction: current SQLite contains only kv and command_history. Agents, queues, and tasks remain distributed across Zustand/localStorage, roster.json, Hive files, and CLI-owned storage."),
    readTime: 12,
    sections: [
      {
        id: "four-layers",
        eyebrow: l("状态关系图", "STATE RELATIONSHIP"),
        title: l("一次状态变化通常跨越两到四层", "A state change usually crosses two to four layers"),
        lead: l("例如 Agent 输出先改变 External CLI/PTTY 状态，再由 Main 推送事件，Renderer 写入 Zustand，必要时镜像 roster；但 CLI 会话/上下文本身仍由外部 Agent 保存。", "Agent output changes external CLI and PTY state first, then Main pushes an event, Renderer updates Zustand, and selected roster data may be mirrored; the CLI still owns its session and context."),
        diagram: "state-layers",
        sources: [
          s("src/renderer/src/store/store.ts", "L170-L220", ["State", "messageQueues"], "Zustand 持有 active/archived/restorable agents、feed、selection、queue 与 UI 状态。", "Zustand holds agents, feeds, selection, queues, and UI state."),
          s("src/main/pty.ts", "L32-L52", ["PtySession"], "PTY session 是纯运行时内存，不是持久记录。", "PTY sessions are runtime memory, not durable records."),
          s("src/main/hive.ts", "L351-L375", ["root", "agentDir", "sockPath"], "Hive 状态位于 harnessHome/hive 的文件系统与 IPC socket。", "Hive state lives in harnessHome/hive plus a local IPC socket."),
        ],
      },
      {
        id: "sqlite-reality",
        eyebrow: l("实际数据库", "ACTUAL DATABASE"),
        title: l("SQLite Phase A 只有两张表", "SQLite Phase A has exactly two tables"),
        lead: l("harness.db 位于 Electron userData，开启 WAL。kv 目前主要保存窗口 bounds；command_history 保存用户提交的 prompt。代码注释明确把 agents、message_queue、cost_ledger 标记为未来迁移，不应按 SPEC.md 的理想模型描述为已完成。", "harness.db lives in Electron userData and uses WAL. kv mainly stores window bounds; command_history stores submitted prompts. Agents, message_queue, and cost_ledger are explicitly future migrations despite older design docs."),
        callout: { tone: "warning", text: l("文档差异：SPEC.md 写“SQLite: Agents, layouts, command history, goals”，但当前 `db.ts` 明确说明 agents/message_queue 尚未实现。以源码为准。", "Documentation drift: SPEC.md claims agents, layouts, command history, and goals in SQLite, while db.ts explicitly reserves agents/message_queue for the future. Source wins.") },
        sources: [
          s("src/main/db.ts", "L1-L17", ["Phase A scope"], "文件头直接声明 SQLite 当前范围与未来计划。", "The file header states current and future SQLite scope."),
          s("src/main/db.ts", "L49-L100", ["MIGRATIONS", "kv", "command_history"], "唯一 migration 创建两表和一个索引。", "The only migration creates two tables and one index."),
          s("SPEC.md", "L188-L212", ["Persistence", "Data model"], "设计文档保留目标模型，不能覆盖真实实现。", "The design document describes a target model, not current implementation.", "design-only"),
        ],
      },
      {
        id: "persistence-matrix",
        eyebrow: l("持久化矩阵", "PERSISTENCE MATRIX"),
        title: l("同一业务域使用多种持久化机制", "Each domain uses a different persistence mechanism"),
        lead: l("config.json 保存设置；localStorage 保存 UI/roster 并镜像到 harnessHome/roster.json；Hive registry/tasks/mailboxes/memory 是文件，且 Hive 自身是由单一 committer 管理的 Git repo；外部 CLI 会话保存在各自目录。", "config.json stores settings; localStorage stores UI/roster state and mirrors to harnessHome/roster.json; Hive registry, tasks, mailboxes, and memory are files in a single-committer Git repo; external CLIs keep their own sessions."),
        bullets: [
          l("内存：PtyManager sessions、timers、liveWorkers、breaker state、Zustand transient fields。", "Memory: PTY sessions, timers, liveWorkers, breaker state, and transient Zustand fields."),
          l("userData：config.json、harness.db、analytics install/version stamps、knowledge store。", "userData: config.json, harness.db, analytics stamps, and the knowledge store."),
          l("harnessHome：roster.json、hive/registry.json、tasks.json、board.md、agents/*、cost-ledger.jsonl。", "harnessHome: roster.json, hive registry/tasks/board, agent directories, and cost ledger."),
          l("External CLI：Claude transcripts、per-agent CODEX_HOME、provider sessions 与凭据。", "External CLI: Claude transcripts, per-agent CODEX_HOME, provider sessions, and credentials."),
        ],
        sources: [
          s("src/main/config.ts", "L586-L690", ["readConfig", "writeConfig", "persistConfig"], "配置从 userData/config.json 读取、合并默认值并写回。", "Configuration reads and writes userData/config.json."),
          s("src/main/roster.ts", "L1-L162", ["RosterStore", "read", "write"], "roster.json 解决 dev http origin 与 packaged file origin 的 localStorage 隔离。", "roster.json bridges localStorage separation between dev and packaged origins."),
          s("src/renderer/src/store/store.ts", "L363-L660", ["persistAgents", "persistQueues", "rosterMirror"], "localStorage 与 roster mirror 是 additive dual-write。", "localStorage and the roster mirror use additive dual-write."),
          s("src/main/hive.ts", "L2482-L2578", ["atomicWriteJson", "commit"], "Hive JSON 原子落盘，并由单一 committer 重试 Git 提交。", "Hive atomically writes JSON and retries commits through one committer."),
        ],
      },
      {
        id: "memory-reality",
        eyebrow: l("Memory Graph 实况", "MEMORY GRAPH REALITY"),
        title: l("Memory Graph 已有 UI；语义 memory 与 Knowledge Graph 仍是可选模块", "Memory Graph has UI; semantic memory and Knowledge Graph remain optional"),
        lead: l("旧 MEMORY_GRAPH_SPEC.md 自称“未写组件”，但当前源码已有 MemoryGraphPanel 与 client-side topic extraction。语义检索依赖可选 mempalace CLI；企业 Knowledge Graph 是另一套可选本地 store，不要混成 SQLite 内的一张统一图表。", "The old spec says no component existed, but current source contains MemoryGraphPanel and client-side topic extraction. Semantic search depends on optional mempalace; the Knowledge Graph is a separate optional local store, not a unified SQLite graph."),
        sources: [
          s("src/renderer/src/components/MemoryGraphPanel.tsx", "L23-L190", ["MemoryGraphPanel"], "当前 renderer 已有可视化组件。", "The renderer contains an implemented graph panel."),
          s("src/renderer/src/components/memoryGraph/extractTopics.ts", undefined, ["extractTopics"], "主题提取在客户端进行，并关注跨 agent 共享知识。", "Topic extraction runs client-side and highlights cross-agent knowledge."),
          s("src/main/memory.ts", "L1-L12", ["MemoryManager", "mempalace"], "Semantic memory 缺少 CLI 时静默降级，markdown memory 仍工作。", "Semantic memory degrades when the CLI is absent; markdown memory still works."),
          s("src/main/knowledge.ts", "L45-L92", ["KnowledgeManager", "active", "status"], "Knowledge Graph 由独立 config 开关和本地 store 管理。", "Knowledge Graph has its own config gate and local store."),
          s("MEMORY_GRAPH_SPEC.md", "L1-L8", ["Status"], "旧设计状态已经落后于源码。", "The old design status is stale relative to source.", "design-only"),
        ],
      },
    ],
  },
  renderer: {
    slug: "renderer",
    nav: l("UI / Renderer", "UI / renderer"),
    kicker: l("07 · VISUALIZATION", "07 · VISUALIZATION"),
    title: l("Office 世界如何映射真实运行状态", "How the office world maps real runtime state"),
    summary: l("React 组织 UI，Zustand 聚合前端状态，Pixi 绘制 office world，xterm 显示真实 PTY。Renderer 能观察和请求，但不能直接创建进程或访问文件系统。", "React structures the UI, Zustand aggregates frontend state, Pixi renders the office, and xterm displays the real PTY. Renderer observes and requests but cannot directly spawn processes or access files."),
    readTime: 10,
    sections: [
      {
        id: "render-stack",
        eyebrow: l("界面栈", "RENDERING STACK"),
        title: l("React 外壳 + Pixi 场景 + xterm 终端 + Monaco/CodeMirror 编辑器", "React shell + Pixi scene + xterm terminal + Monaco/CodeMirror editors"),
        lead: l("App.tsx 组织主界面与 provider service hooks；OfficeFloor 用 Pixi 场景对象渲染 avatar、座位、信封与工具气泡；terminalPool 将 xterm 实例与 React 视图解耦。", "App.tsx composes the shell and service hooks; OfficeFloor renders avatars, desks, envelopes, and tool bubbles through Pixi; terminalPool decouples xterm instances from React views."),
        sources: [
          s("src/renderer/src/App.tsx", undefined, ["App", "useHive", "OfficeFloor"], "Renderer 顶层组合 UI 与后台 effect。", "Renderer root composes UI and background effects."),
          s("src/renderer/src/scene/office/OfficeFloor.tsx", undefined, ["OfficeFloor"], "office visualization 的 React/Pixi 入口。", "React/Pixi entry for the office visualization."),
          s("src/renderer/src/components/terminalPool.ts", "L4-L88", ["TerminalEntry", "pool"], "每个 PTY 对应持久 xterm buffer，切换视图不会丢 scrollback。", "Each PTY retains an xterm buffer across view changes."),
        ],
      },
      {
        id: "status-mapping",
        eyebrow: l("状态映射", "STATUS MAPPING"),
        title: l("优先使用 hooks，终端解析作为可见输出补充", "Hooks lead; terminal parsing supplements visible output"),
        lead: l("HookServer 把 lifecycle event 推成 hive:hookEvent；useHive 更新 agent state、context、breaker 与队列。usePtyParser 同时解析 xterm 文本中的 tool 行、spinner 与 approval 提示，驱动 station/carrying/blocked/waiting。", "HookServer pushes lifecycle events through hive:hookEvent; useHive updates agent state, context, breaker, and queues. usePtyParser also reads visible TUI output to drive station, tool, blocked, and waiting indicators."),
        bullets: [
          l("working：真实 hook/tool event 或 TUI 的 tool/spinner 信号。", "working: hook/tool events or visible TUI tool/spinner signals."),
          l("idle：Stop/agent_end 或 4 秒无新工具输出的 drift。", "idle: Stop/agent_end or a four-second no-tool drift."),
          l("blocked：只有 god 真正等待人类输入时使用。", "blocked: reserved for god genuinely waiting on the human."),
          l("waiting：worker 停在 prompt，等待 god/自动协调，而不是等待人类。", "waiting: a worker parked at a prompt, awaiting god/automation rather than the human."),
        ],
        sources: [
          s("src/main/hooks.ts", "L120-L343", ["HookServer.handle", "emit"], "主进程验证 hook、记录 session、驱动 breaker 与控制输出。", "Main validates hooks, records sessions, feeds breaker signals, and emits state."),
          s("src/renderer/src/hooks/usePtyParser.ts", "L87-L181", ["usePtyParser"], "终端文本解析只覆盖可见 TUI 信号。", "Terminal parsing covers visible TUI signals."),
          s("src/renderer/src/hooks/useHive.ts", "L480-L770", ["onHiveHookEvent", "inbox wake"], "useHive 负责 hook 状态、quiescence fallback 与 inbox wake。", "useHive owns hook state, quiescence fallback, and inbox wake behavior."),
        ],
      },
      {
        id: "prompt-queue",
        eyebrow: l("用户操作到真实进程", "USER ACTION TO PROCESS"),
        title: l("Composer 不直接写 PTY；它先进入可恢复队列", "The composer queues before writing to the PTY"),
        lead: l("用户可在 Agent 忙碌时继续发消息。Zustand messageQueues 持久化队列；useHive 在 idle、PTY quiet、无 draft、无 picker、未暂停、boot grace 结束后才提交，并要求文本与 Enter 两次 write 都成功才删除队列项。", "Users can queue messages while an agent is busy. Zustand persists queues; useHive waits for idle, PTY quiet, no draft or picker, no pause, and boot grace, deleting an item only after text and Enter writes both succeed."),
        diagram: "prompt-roundtrip",
        sources: [
          s("src/renderer/src/components/MessageQueueComposer.tsx", "L30-L180", ["queueIt", "enqueueMessage"], "Composer 产生人类可读 queue item，并记录 composer telemetry。", "The composer creates a readable queue item and records composer telemetry."),
          s("src/renderer/src/hooks/useHive.ts", "L778-L888", ["dispatch", "deliverWithAcknowledgement", "submitToPty"], "投递具有状态、静默时间、控制面、prompt ownership 与重试门槛。", "Delivery uses status, quiescence, control, prompt ownership, and retry gates."),
          s("src/renderer/src/components/terminalPool.ts", "L332-L396", ["term.onData", "lineBuf", "inputDirty"], "xterm keystroke 同步写 PTY，并维护 user-owned prompt buffer。", "xterm keystrokes write the PTY and maintain a user-owned prompt buffer."),
        ],
      },
    ],
  },
  integrations: {
    slug: "integrations",
    nav: l("Git 与外围模块", "Git & integrations"),
    kicker: l("08 · PERIMETER", "08 · PERIMETER"),
    title: l("Git、Realtime、Tunnel、Telemetry 与 Updater", "Git, realtime, tunnels, telemetry, and updater"),
    summary: l("这些模块增强工作区隔离、远程触发、语音控制、观测与分发，但它们位于 Agent orchestration 外围。", "These modules add workspace isolation, remote triggers, voice control, observability, and distribution while remaining peripheral to core orchestration."),
    readTime: 12,
    sections: [
      {
        id: "git-workspace",
        eyebrow: l("Git / Workspace", "GIT / WORKSPACE"),
        title: l("默认共享 cwd；显式 isolate 才创建独立 worktree", "Shared cwd by default; explicit isolation creates a worktree"),
        lead: l("spawnAgentCore 在 isRepo 且 isolate=true 时，从当前 branch 创建 `agent/<id>` 分支与 `<harnessHome>/worktrees/<id>`。失败是 best-effort 降级而非硬失败。回收前检查 dirty 与 ahead commits；有未集成工作就保留。", "spawnAgentCore creates an `agent/<id>` branch and worktree only when isolate=true in a repository. Failures fall back to shared cwd. Cleanup preserves dirty or ahead work."),
        diagram: "workspace-isolation",
        sources: [
          s("src/main/git.ts", "L212-L330", ["mainRepoRoot", "addWorktree", "removeWorktree", "worktreeHasUnintegratedWork", "worktreeIsGcSafe"], "worktree 生命周期采用 fail-safe 数据保护。", "Worktree lifecycle uses fail-safe data preservation."),
          s("src/main/index.ts", "L2631-L2667", ["addWorktree", "worktreePaths", "worktreeOrigins"], "spawn 时仅在用户请求且 repo 有效时隔离。", "Spawn isolates only on request and within a valid repository."),
          s("src/main/index.ts", "L517-L620", ["finalizeWorkerWorktree", "preservedWorktrees"], "teardown 会先判断未集成工作再决定 remove 或 preserve。", "Teardown evaluates unintegrated work before remove or preserve."),
        ],
      },
      {
        id: "git-github",
        eyebrow: l("Git / GitHub 能力", "GIT / GITHUB CAPABILITIES"),
        title: l("Git 封装是只读浏览 + 受保护 checkout；GitHub 通过 gh CLI", "Git wrapper offers browsing plus guarded checkout; GitHub uses gh CLI"),
        lead: l("main/git.ts 封装 status、log、diff、branch、compare、worktree 与 checkout；checkout 在 dirty working tree 时 fail-safe 拒绝。main/github.ts 仅用 gh CLI 读取 issues 和 CI runs，不是完整 PR 协调层。", "main/git.ts wraps status, log, diff, branches, compare, worktrees, and checkout; checkout refuses dirty worktrees. main/github.ts uses gh CLI for issues and CI runs, not full PR orchestration."),
        sources: [
          s("src/main/git.ts", "L59-L209", ["getStatus", "getLog", "getDiff"], "所有 git/fs 访问留在 Main，renderer 只拿结构化文本。", "Git and file access stay in Main; renderer receives structured data."),
          s("src/main/git.ts", "L331-L489", ["getLogGraph", "compareRefs", "listWorktrees", "checkoutRef"], "历史、比较和 checkout 有 rev/path/dirty guard。", "History, compare, and checkout enforce rev, path, and dirty guards."),
          s("src/main/github.ts", "L25-L118", ["listIssues", "listCIRuns"], "GitHub 集成是小型 gh adapter。", "GitHub integration is a small gh adapter."),
        ],
      },
      {
        id: "remote-realtime",
        eyebrow: l("Realtime / Voice / Tunnel", "REALTIME / VOICE / TUNNEL"),
        title: l("语音 orchestrator 在 Renderer；真实 OpenAI key 留在 Main", "Voice orchestrator lives in Renderer; the real OpenAI key stays in Main"),
        lead: l("Realtime Michael 通过 Main mint 的短期 token 建立 WebRTC session，并使用工具读写 Hive；高风险动作必须语音确认。Slack/Webhook 在 Main 开本地 server，可选 localtunnel/tunnelmole 暴露公网 URL。", "Realtime Michael uses a short-lived token minted by Main to open a WebRTC session and operate Hive tools; destructive actions require spoken confirmation. Slack/Webhook servers run in Main and can optionally expose tunnels."),
        sources: [
          s("src/renderer/src/realtime/session.ts", "L1-L40", ["RealtimeSession", "OpenAIRealtimeWebRTC"], "voice session 明确运行在 renderer，并使用 ephemeral secret。", "The voice session explicitly runs in Renderer with an ephemeral secret."),
          s("src/main/realtime.ts", undefined, ["mintRealtimeToken"], "Main 用 write-only secret broker mint 短期 token。", "Main uses the write-only secret broker to mint a short-lived token."),
          s("src/main/realtimeActions.ts", "L100-L170", ["VERBS", "SETTING_POLICY", "PENDING_TTL_MS"], "动作按 soft/destructive 分层并限定可写设置。", "Actions are tiered soft/destructive with an allowlisted settings surface."),
          s("src/main/slack.ts", undefined, ["SlackServer"], "Slack request 验签与解析留在 Main。", "Slack signature verification and parsing stay in Main."),
          s("src/main/webhook.ts", undefined, ["WebhookServer"], "Generic webhook 使用 endpoint secret 与本地 server。", "Generic webhook uses endpoint secrets and a local server."),
        ],
      },
      {
        id: "telemetry-updates",
        eyebrow: l("Telemetry / Analytics / Update", "TELEMETRY / ANALYTICS / UPDATE"),
        title: l("本地 OTel 与外发 PostHog 是两套不同数据面", "Local OTel and outbound PostHog are separate data planes"),
        lead: l("telemetry.ts 是 loopback-only OTLP collector，用于 token/cost/tool 状态和 breaker；analytics.ts 才是匿名 allowlist PostHog，受 build key、DO_NOT_TRACK 与设置三重门控。updater 只在 packaged build 使用 electron-updater，并提供 GitHub release notify fallback。", "telemetry.ts is a loopback-only OTLP collector for usage and breaker inputs; analytics.ts is the allowlisted PostHog path gated by build key, DO_NOT_TRACK, and settings. Updater uses electron-updater only in packaged builds with a GitHub release fallback."),
        sources: [
          s("src/main/telemetry.ts", "L1-L30", ["TelemetryCollector", "OTLP"], "本地 collector 不向外发送 prompt 或内容。", "The local collector does not send prompt content externally."),
          s("src/main/analytics.ts", "L1-L32", ["Analytics", "EVENTS", "DO_NOT_TRACK"], "外发事件由 per-event property allowlist 限制。", "Outbound events are constrained by per-event property allowlists."),
          s("TELEMETRY.md", "L1-L107", ["Privacy contract"], "隐私契约列明发送内容与三种完全禁用方式。", "The privacy contract lists sent data and three full opt-out mechanisms."),
          s("src/main/updater.ts", "L11-L36", ["initAutoUpdater"], "更新只在 packaged build 生效，失败降级为 release 页面通知。", "Updates run only in packaged builds and fall back to release notifications."),
        ],
      },
    ],
  },
  "source-map": {
    slug: "source-map",
    nav: l("源码地图", "Source map"),
    kicker: l("09 · SOURCE MAP", "09 · SOURCE MAP"),
    title: l("按架构域导航源码，而不是按目录背文件", "Navigate by architecture domain, not directory trivia"),
    summary: l("每个域给出入口、关键 symbols、上游依赖与下游消费者。所有链接固定到分析 commit。", "Each domain identifies entry points, key symbols, upstream dependencies, and downstream consumers. Every link pins the analyzed commit."),
    readTime: 8,
    sections: [],
  },
  "call-flows": {
    slug: "call-flows",
    nav: l("关键调用链", "Call flows"),
    kicker: l("10 · CALL FLOWS", "10 · CALL FLOWS"),
    title: l("八条端到端链路，把文件重新连成系统", "Eight end-to-end flows reconnect files into a system"),
    summary: l("每条链都沿“入口 → 调用 → 状态变化 → 输出”展开，可逐步查看输入、输出、文件、symbol 与下一跳。", "Each flow follows entry → call → state change → output, with inspectable inputs, outputs, files, symbols, and next hops."),
    readTime: 15,
    sections: [],
  },
  "learning-path": {
    slug: "learning-path",
    nav: l("学习路径", "Learning path"),
    kicker: l("11 · LEARNING PATH", "11 · LEARNING PATH"),
    title: l("从产品边界到二次开发的八级路线", "An eight-level path from product boundary to extension work"),
    summary: l("先理解谁拥有推理，再读 IPC 和 PTY；之后进入 lifecycle、Hive、状态存储与 visualization。", "First learn who owns inference, then IPC and PTY; continue into lifecycle, Hive, persistence, and visualization."),
    readTime: 7,
    sections: [],
  },
  conclusions: {
    slug: "conclusions",
    nav: l("架构结论", "Conclusions"),
    kicker: l("12 · ENGINEERING TAKEAWAYS", "12 · ENGINEERING TAKEAWAYS"),
    title: l("可复用的是本地 Agent 控制面，不是另一套模型 Runtime", "The reusable asset is a local agent control plane, not another model runtime"),
    summary: l("真正困难的是跨进程生命周期、异构 CLI bridge、可靠消息投递、工作区隔离和状态一致性，而不是像素办公室本身。", "The hard parts are cross-process lifecycle, heterogeneous CLI bridges, reliable message delivery, workspace isolation, and state consistency—not the pixel office itself."),
    readTime: 9,
    sections: [
      {
        id: "hard-parts",
        eyebrow: l("真正难点", "THE HARD PARTS"),
        title: l("难的是协调不可靠边界", "The hard problem is coordinating unreliable boundaries"),
        lead: l("外部 CLI 的 hook 能力、prompt 形态、resume 参数、权限与 Windows shim 各不相同；进程退出、重启、睡眠和 renderer reload 也会产生竞争。代码的大量复杂度用于守住这些边界。", "External CLIs differ in hooks, prompt shape, resume arguments, permissions, and Windows shims; process exit, restart, sleep, and renderer reload introduce races. Much of the code protects these boundaries."),
        bullets: [
          l("核心：spawnAgentCore、PtyManager、HiveManager、HookServer、useHive、roster/store。", "Core: spawnAgentCore, PtyManager, HiveManager, HookServer, useHive, and roster/store."),
          l("产品 UI：OfficeFloor、sprites、panels、theme；它很有价值，但不决定编排正确性。", "Product UI: OfficeFloor, sprites, panels, and themes; valuable, but not the source of orchestration correctness."),
          l("外围：Realtime、Slack/Webhook/tunnel、PostHog、updater，可独立裁剪。", "Perimeter: realtime, Slack/Webhook/tunnels, PostHog, and updater can be trimmed independently."),
        ],
        sources: [
          s("src/main/index.ts", "L2531-L2941", ["spawnAgentCore"], "统一入口承载最多跨域复杂度。", "The unified spawn entry carries the widest cross-domain complexity."),
          s("src/shared/agentProvider.ts", "L39-L167", ["AgentProviderPreset", "BridgeDescriptor"], "异构 CLI 差异被显式建模，而非藏在 if/else 文案中。", "CLI heterogeneity is explicitly modeled instead of hidden in UI copy."),
          s("src/main/pty.ts", "L655-L692", ["session identity guard"], "重启竞争是实际工程问题。", "Restart races are an actual engineering concern."),
        ],
      },
      {
        id: "enterprise-reuse",
        eyebrow: l("企业平台复用", "ENTERPRISE REUSE"),
        title: l("值得复用：控制面原语；需要重做：治理与权威数据层", "Reuse control-plane primitives; rebuild governance and authoritative data"),
        lead: l("PTY lifecycle、provider preset/bridge、IPC 边界、worktree fail-safe、mailbox/task protocol、breaker 与 graceful shutdown 都有复用价值。企业化时必须补充中心策略、审计、RBAC、远程 worker、持久队列、事务性状态和可观测 SLO。", "PTY lifecycle, provider bridges, IPC boundaries, fail-safe worktrees, mailbox/task protocols, breaker logic, and graceful shutdown are reusable. Enterprise use still needs central policy, audit, RBAC, remote workers, durable queues, transactional state, and SLOs."),
        callout: { tone: "warning", text: l("不应直接复用：localStorage 作为 roster/queue 主体、best-effort worktree 降级、单机文件轮询路由、带大量 LIVE-UNVERIFIED 的 provider bridge。", "Do not directly reuse localStorage-authoritative roster/queues, best-effort isolation fallback, single-machine file polling, or provider bridges marked LIVE-UNVERIFIED.") },
        sources: [
          s("src/main/db.ts", "L12-L47", ["future migrations"], "源码自己承认 authority flip 与 cost ledger 迁移尚未完成。", "Source acknowledges that the authority flip and cost-ledger migration are future work."),
          s("src/main/hive.ts", "L1635-L1674", ["poll-based router"], "文件轮询适合 local-first 单机，不等于分布式消息系统。", "File polling suits a local-first single machine; it is not a distributed message system."),
          s("src/main/index.ts", "L2631-L2667", ["best-effort isolation"], "隔离失败会降级共享 cwd，企业默认策略通常应 fail closed。", "Isolation failure falls back to shared cwd; enterprise defaults often need fail-closed behavior."),
        ],
      },
      {
        id: "runtime-comparison",
        eyebrow: l("与自建 Runtime 的根本差异", "DIFFERENCE FROM BUILDING A RUNTIME"),
        title: l("LangGraph/DeepAgents 定义 agent loop；Munder Difflin 管理现成 agent loop", "LangGraph/DeepAgents define the loop; Munder Difflin manages existing loops"),
        lead: l("自建 Runtime 通常拥有模型调用、tool registry、memory/context、planner/graph 与 retry semantics。Munder Difflin 把这些留给 Claude Code、Codex 等 CLI，自己拥有进程、窗口、工作区、消息路由、可视化与运维控制。", "A custom runtime usually owns model calls, tool registry, memory/context, planning graphs, and retries. Munder Difflin leaves those to CLI agents and owns processes, windows, workspaces, message routing, visualization, and operational controls."),
        bullets: [
          l("与 Claude Code/Codex CLI 的边界：它们是被管理的 runtime，不是 SDK 依赖。", "Boundary with Claude Code/Codex CLI: they are managed runtimes, not SDK dependencies."),
          l("与 LLM Provider 的边界：大多数推理连接由 CLI 建立；Munder 仅在 Realtime voice/BYOK proxy 等外围路径直接处理 provider credential/traffic。", "Boundary with LLM providers: CLIs establish most inference connections; Munder directly handles provider credentials or traffic only in peripheral voice/BYOK proxy paths."),
          l("多 Agent 的价值来自多个真实进程与协调协议，而非一个进程内模拟多个角色。", "Multi-agent value comes from multiple real processes and a coordination protocol, not in-process role simulation."),
        ],
        diagram: "system-context",
        sources: [
          s("src/main/pty.ts", "L644-L653", ["pty.spawn"], "外部 CLI 是真正的执行边界。", "The external CLI is the real execution boundary."),
          s("src/renderer/src/realtime/session.ts", "L1-L9", ["Realtime Michael"], "Realtime voice 是例外性的外围 provider 连接，源码明确其位置。", "Realtime voice is a peripheral direct-provider exception and source states its location."),
        ],
      },
    ],
  },
};

const enhancedBasePages = Object.fromEntries(
  Object.entries(basePages).map(([slug, current]) => {
    const patch = pagePatches[slug];
    if (!patch) return [slug, current];
    const { appendSections = [], ...metadata } = patch;
    return [slug, { ...current, ...metadata, sections: [...current.sections, ...appendSections, ...(lessonSupplements[slug] ?? [])] }];
  }),
) as Record<string, PageData>;

export const pages: Record<string, PageData> = { ...enhancedBasePages, ...deepPages };
export const navigation = courseNavigation;

export const sourceDomains = [
  {
    id: "bootstrap",
    title: l("Bootstrap", "Bootstrap"),
    purpose: l("组装 Electron app、全局 managers、生命周期与 IPC。", "Assembles Electron, global managers, lifecycle, and IPC."),
    files: ["src/main/index.ts", "electron.vite.config.ts", "package.json"],
    symbols: ["app.whenReady", "bootstrapHiveServices", "createWindow", "teardownAndQuit"],
    upstream: l("Electron app/config", "Electron app/config"),
    downstream: l("所有 Main service、Preload、Renderer", "All Main services, preload, renderer"),
  },
  {
    id: "electron-ipc",
    title: l("Electron / IPC", "Electron / IPC"),
    purpose: l("把受限 renderer 请求映射到 Main 权限。", "Maps restricted renderer requests to Main privileges."),
    files: ["src/preload/index.ts", "src/preload/index.d.ts", "src/main/index.ts"],
    symbols: ["contextBridge.exposeInMainWorld", "api", "ipcMain.handle"],
    upstream: l("Renderer 用户操作", "Renderer user actions"),
    downstream: l("PTY、FS、Git、DB、Hive、integrations", "PTY, FS, Git, DB, Hive, integrations"),
  },
  {
    id: "agent-runtime",
    title: l("Agent Runtime", "Agent runtime"),
    purpose: l("解析命令、创建 PTY、维护 session 与回收进程树。", "Resolves commands, creates PTYs, tracks sessions, and reaps process trees."),
    files: ["src/main/pty.ts", "src/main/ptyEnv.ts", "src/main/procKill.ts", "src/main/workerLaunch.ts"],
    symbols: ["PtyManager", "buildPtyEnv", "ensureKilled", "tokenizeWorkerCommand"],
    upstream: l("spawnAgentCore", "spawnAgentCore"),
    downstream: l("外部 CLI、PTY events", "External CLIs and PTY events"),
  },
  {
    id: "orchestration",
    title: l("Orchestration / Hive", "Orchestration / Hive"),
    purpose: l("身份、mailbox、task、router、prompt injection 与 session 记录。", "Identity, mailboxes, tasks, routing, prompt injection, and session records."),
    files: ["src/main/hive.ts", "src/main/hooks.ts", "src/main/control.ts", "src/shared/agentProvider.ts"],
    symbols: ["HiveManager", "HookServer", "ControlRegistry", "AgentProviderPreset"],
    upstream: l("Main lifecycle、CLI hook/bridge", "Main lifecycle and CLI hooks/bridges"),
    downstream: l("Agent env/args、renderer state、Hive files", "Agent env/args, renderer state, Hive files"),
  },
  {
    id: "tasks-messaging",
    title: l("Task & Messaging", "Task & messaging"),
    purpose: l("任务账本、Agent 邮箱、路由与空闲安全投递。", "Task ledger, agent mailboxes, routing, and idle-safe delivery."),
    files: ["src/main/hive.ts", "src/shared/taskLedger.ts", "src/renderer/src/hooks/useHive.ts", "src/renderer/src/hooks/queueDelivery.ts"],
    symbols: ["HiveTask", "routeMessage", "mergeTaskLedger", "deliverWithAcknowledgement"],
    upstream: l("UI、Agent outbox、Slack/Webhook", "UI, agent outbox, Slack/Webhook"),
    downstream: l("tasks.json、inbox、PTY queue", "tasks.json, inboxes, PTY queue"),
  },
  {
    id: "safety",
    title: l("Safety & Lifecycle", "Safety & lifecycle"),
    purpose: l("循环/成本保护、唤醒、优雅收尾与进程清理。", "Loop/cost protection, wakeups, graceful shutdown, and cleanup."),
    files: ["src/main/breaker.ts", "src/main/closingTime.ts", "src/main/workerWake.ts", "src/main/costLifetime.ts"],
    symbols: ["CircuitBreaker", "ClosingTimeController", "WorkerWakeWatchdog", "CostLedgerTotals"],
    upstream: l("hook、telemetry、任务与 PTY 活性", "Hooks, telemetry, task and PTY liveness"),
    downstream: l("steer/constrain/stop、shutdown", "Steer/constrain/stop and shutdown"),
  },
  {
    id: "state-db",
    title: l("State & DB", "State & DB"),
    purpose: l("设置、窗口/prompt history、roster mirror 与 renderer state。", "Settings, window/prompt history, roster mirror, and renderer state."),
    files: ["src/main/db.ts", "src/main/config.ts", "src/main/roster.ts", "src/renderer/src/store/store.ts"],
    symbols: ["PersistStore", "readConfig", "RosterStore", "useStore"],
    upstream: l("UI 与 Main services", "UI and Main services"),
    downstream: l("SQLite、config.json、roster.json、localStorage", "SQLite, config.json, roster.json, localStorage"),
  },
  {
    id: "git-workspace",
    title: l("Git / Workspace", "Git / workspace"),
    purpose: l("Git 浏览、受保护 checkout 与 Agent worktree 隔离。", "Git browsing, guarded checkout, and agent worktree isolation."),
    files: ["src/main/git.ts", "src/main/github.ts", "src/renderer/src/components/GitTab.tsx", "src/renderer/src/ide/GitPanes.tsx"],
    symbols: ["addWorktree", "worktreeHasUnintegratedWork", "checkoutRef", "listIssues"],
    upstream: l("spawn 与 IDE", "Spawn and IDE"),
    downstream: l("git/gh 子进程、Monaco diff", "git/gh subprocesses and Monaco diff"),
  },
  {
    id: "renderer",
    title: l("Renderer", "Renderer"),
    purpose: l("Office、terminal、editor、store 与用户交互。", "Office, terminal, editors, store, and user interaction."),
    files: ["src/renderer/src/App.tsx", "src/renderer/src/scene/office/OfficeFloor.tsx", "src/renderer/src/components/terminalPool.ts", "src/renderer/src/hooks/usePtyParser.ts"],
    symbols: ["App", "OfficeFloor", "TerminalEntry", "usePtyParser"],
    upstream: l("Preload events 与用户输入", "Preload events and user input"),
    downstream: l("Pixi/xterm/Monaco、IPC 请求", "Pixi/xterm/Monaco and IPC requests"),
  },
  {
    id: "memory-knowledge",
    title: l("Memory & Knowledge", "Memory & knowledge"),
    purpose: l("Markdown memory、可选 semantic memory、Knowledge Graph 与图形展示。", "Markdown memory, optional semantic memory, Knowledge Graph, and graph visualization."),
    files: ["src/main/memory.ts", "src/main/knowledge.ts", "src/main/kg-core.cjs", "src/renderer/src/components/MemoryGraphPanel.tsx"],
    symbols: ["MemoryManager", "KnowledgeManager", "MemoryGraphPanel"],
    upstream: l("Hive agent directories、配置", "Hive agent directories and config"),
    downstream: l("mempalace、knowledge store、renderer graph", "mempalace, knowledge store, renderer graph"),
  },
  {
    id: "realtime-perimeter",
    title: l("Realtime & Triggers", "Realtime & triggers"),
    purpose: l("语音 orchestrator、Slack/Webhook 与 tunnel。", "Voice orchestration, Slack/Webhook, and tunnels."),
    files: ["src/main/realtime.ts", "src/main/realtimeActions.ts", "src/main/slack.ts", "src/main/webhook.ts", "src/renderer/src/realtime/session.ts"],
    symbols: ["RealtimeSession", "realtimeAction", "SlackServer", "WebhookServer"],
    upstream: l("OpenAI Realtime、外部 HTTP", "OpenAI Realtime and external HTTP"),
    downstream: l("Hive actions、tasks、prompt queue", "Hive actions, tasks, and prompt queue"),
  },
  {
    id: "observability",
    title: l("Telemetry & Updates", "Telemetry & updates"),
    purpose: l("本地 OTLP、匿名 analytics、transcript fallback 与 app update。", "Local OTLP, anonymous analytics, transcript fallback, and app updates."),
    files: ["src/main/telemetry.ts", "src/main/analytics.ts", "src/main/transcript.ts", "src/main/updater.ts"],
    symbols: ["TelemetryCollector", "Analytics", "readAgentUsage", "initAutoUpdater"],
    upstream: l("CLI OTel/transcript、app lifecycle", "CLI OTel/transcripts and app lifecycle"),
    downstream: l("breaker、UI events、PostHog、GitHub releases", "Breaker, UI events, PostHog, GitHub releases"),
  },
  {
    id: "tests",
    title: l("Tests", "Tests"),
    purpose: l("关键边界的 Node 单测与 Electron quit sweep 验证。", "Node tests for key boundaries plus Electron quit-sweep verification."),
    files: ["test/", "package.json"],
    symbols: ["node --test", "quit-sweep.electron.test.cjs"],
    upstream: l("Shared/Main/Renderer 纯函数与 source loading", "Shared/Main/Renderer pure functions and source loading"),
    downstream: l("回归保护", "Regression protection"),
  },
];

export type FlowStep = {
  lane: "ui" | "bridge" | "main" | "runtime" | "external" | "state";
  title: Localized;
  action: Localized;
  input: Localized;
  output: Localized;
  source: SourceRef;
};

export type CallFlow = {
  id: string;
  title: Localized;
  summary: Localized;
  steps: FlowStep[];
};

const step = (
  lane: FlowStep["lane"],
  title: Localized,
  action: Localized,
  input: Localized,
  output: Localized,
  source: SourceRef,
): FlowStep => ({ lane, title, action, input, output, source });

export const callFlows: CallFlow[] = [
  {
    id: "boot",
    title: l("应用启动", "Application boot"),
    summary: l("Electron ready 后按权限依赖顺序打开存储、Hive 与窗口。", "After Electron is ready, storage, Hive, and the window start in privilege order."),
    steps: [
      step("main", l("Electron ready", "Electron ready"), l("进入 app.whenReady 回调，清理遗留 mic gate。", "Enter app.whenReady and reset the mic gate."), l("Electron app ready", "Electron app ready"), l("可启动 Main services", "Main services can start"), s("src/main/index.ts", "L5174-L5189", ["app.whenReady"], "启动入口。", "Startup entry.")),
      step("state", l("打开持久层", "Open persistence"), l("PersistStore.open 创建/迁移 harness.db。", "PersistStore.open creates or migrates harness.db."), l("userData path", "userData path"), l("WAL SQLite handle", "WAL SQLite handle"), s("src/main/db.ts", "L79-L102", ["open", "migrate"], "数据库先于窗口打开。", "Database opens before the window.")),
      step("main", l("启动 Hive services", "Start Hive services"), l("初始化 hive、hooks、telemetry、router、memory 与 worker watcher。", "Initialize Hive, hooks, telemetry, router, memory, and worker watcher."), l("harnessHome config", "harnessHome config"), l("本地协调面开始运行", "Local coordination plane is live"), s("src/main/index.ts", "L4950-L5098", ["bootstrapHiveServices", "armAlwaysOnBeats"], "协调服务组装点。", "Coordination assembly point.")),
      step("main", l("创建 BrowserWindow", "Create BrowserWindow"), l("启用 sandbox/contextIsolation，绑定 preload 并加载 renderer。", "Enable sandbox/contextIsolation, bind preload, and load renderer."), l("保存的窗口 bounds", "Saved window bounds"), l("隔离 renderer 窗口", "Sandboxed renderer window"), s("src/main/index.ts", "L2216-L2368", ["createWindow"], "窗口权限边界。", "Window privilege boundary.")),
      step("ui", l("React 挂载", "React mounts"), l("App 读取 config/roster，恢复团队并订阅 Hive/PTY 事件。", "App reads config/roster, restores the team, and subscribes to events."), l("window.cth API", "window.cth API"), l("Office/terminal UI", "Office and terminal UI"), s("src/renderer/src/App.tsx", undefined, ["App", "useRestoreTeam", "useHive"], "Renderer 启动。", "Renderer startup.")),
    ],
  },
  {
    id: "spawn-agent",
    title: l("创建 / 启动 Agent", "Create / start an agent"),
    summary: l("唯一 spawn 核心串起 Renderer、IPC、worktree、Hive 与 PTY。", "One spawn core links Renderer, IPC, worktree, Hive, and PTY."),
    steps: [
      step("ui", l("提交表单", "Submit form"), l("验证 name/cwd/command，生成 agent id 与 pty id。", "Validate name/cwd/command and create agent/PTy ids."), l("用户表单", "User form"), l("SpawnPtyOptions", "SpawnPtyOptions"), s("src/renderer/src/components/AddAgentModal.tsx", "L391-L430", ["submit"], "Renderer 入口。", "Renderer entry.")),
      step("bridge", l("Preload bridge", "Preload bridge"), l("spawnPty 调用 ipcRenderer.invoke('pty:spawn')。", "spawnPty invokes the pty:spawn IPC channel."), l("结构化 opts", "Structured opts"), l("Promise result", "Promise result"), s("src/preload/index.ts", "L577-L581", ["spawnPty"], "窄 IPC seam。", "Narrow IPC seam.")),
      step("main", l("统一 spawn 核心", "Unified spawn core"), l("推断 provider、探测 CLI、准备 worktree 与 resume。", "Infer provider, probe CLI, and prepare worktree and resume."), l("validated opts + window owner", "Validated opts and window owner"), l("最终 command/args/env/cwd", "Final command, args, env, cwd"), s("src/main/index.ts", "L2521-L2930", ["spawnAgentCore"], "主控制链。", "Main control chain.")),
      step("state", l("Hive provisioning", "Hive provisioning"), l("写 identity、memory、mailboxes、registry 与 bridge 配置。", "Write identity, memory, mailboxes, registry, and bridge config."), l("AgentMeta + feature flags", "AgentMeta and feature flags"), l("SpawnInjection", "SpawnInjection"), s("src/main/hive.ts", "L611-L720", ["ensureAgent"], "本地身份与协调状态。", "Local identity and coordination state.")),
      step("runtime", l("创建 PTY", "Create PTY"), l("解析跨平台 executable，调用 pty.spawn。", "Resolve the platform executable and call pty.spawn."), l("command/args/env/cwd/grid", "command/args/env/cwd/grid"), l("PtySession + child pid", "PtySession and child pid"), s("src/main/pty.ts", "L532-L672", ["PtyManager.spawn", "pty.spawn"], "真正的进程创建点。", "Actual process creation point.")),
      step("external", l("外部 CLI Agent", "External CLI agent"), l("CLI 登录/连接 provider，运行自己的 agent loop 与 tools。", "The CLI connects to its provider and runs its own agent loop and tools."), l("argv/env/PTY", "argv/env/PTY"), l("TUI output + hook/telemetry", "TUI output plus hooks/telemetry"), s("src/shared/agentProvider.ts", "L62-L167", ["AgentProviderPreset"], "外部 runtime 能力由 preset 描述。", "External runtime capability is described by presets.")),
    ],
  },
  {
    id: "send-prompt",
    title: l("用户给 Agent 发送 Prompt", "Send a prompt to an agent"),
    summary: l("Composer 先排队；idle-safe drain 再分两次写入 text 与 Enter。", "The composer queues first; an idle-safe drain writes text and Enter separately."),
    steps: [
      step("ui", l("Composer queue", "Composer queue"), l("将可见文本写入 per-agent messageQueues。", "Append visible text to the per-agent queue."), l("draft", "draft"), l("QueuedMessage", "QueuedMessage"), s("src/renderer/src/components/MessageQueueComposer.tsx", "L135-L180", ["queueIt"], "人类输入入口。", "Human input entry.")),
      step("state", l("Zustand 持久化", "Zustand persistence"), l("enqueueMessage 去重 compact/nudge，并写 localStorage + roster mirror。", "enqueueMessage deduplicates compact/nudge and persists the queue."), l("agent id + text", "agent id and text"), l("messageQueues snapshot", "messageQueues snapshot"), s("src/renderer/src/store/store.ts", "L892-L932", ["enqueueMessage", "persistQueues"], "UI queue 权威层。", "UI queue authority.")),
      step("ui", l("安全投递门", "Safe delivery gate"), l("检查 status、PTY quiet、pause、boot grace、draft/picker 与 precondition。", "Check status, PTY quiet, pause, boot grace, draft/picker, and precondition."), l("queue head + live facts", "queue head and live facts"), l("可投递 / 保留 / 丢弃", "Deliver, defer, or drop"), s("src/renderer/src/hooks/useHive.ts", "L778-L888", ["dispatch"], "不会在 agent mid-stream 时输入。", "Never types while an agent is mid-stream.")),
      step("bridge", l("Text + Enter", "Text + Enter"), l("submitToPty 串行写文本，140ms 后单独写回车。", "submitToPty serializes text and sends Enter 140ms later."), l("single/multiline prompt", "Single/multiline prompt"), l("两次 pty:write", "Two pty:write calls"), s("src/renderer/src/hooks/useHive.ts", "L115-L157", ["submitToPty"], "多行使用 bracketed paste。", "Multiline text uses bracketed paste.")),
      step("runtime", l("PTY stdin", "PTY stdin"), l("Main 校验 channel，PtyManager.write 调 proc.write。", "Main validates the channel and PtyManager.write calls proc.write."), l("pty id + bytes", "PTY id and bytes"), l("CLI TUI input", "CLI TUI input"), s("src/main/index.ts", "L2943-L2946", ["pty:write"], "Main IPC 入口。", "Main IPC entry.")),
      step("external", l("Agent turn", "Agent turn"), l("外部 CLI 接管 prompt，运行模型/工具循环。", "External CLI consumes the prompt and runs the model/tool loop."), l("terminal input", "Terminal input"), l("stdout/stderr + hooks", "stdout/stderr and hooks"), s("src/main/pty.ts", "L700-L708", ["write"], "字节交付边界。", "Byte delivery boundary.")),
    ],
  },
  {
    id: "output",
    title: l("Agent 执行并返回终端输出", "Agent returns terminal output"),
    summary: l("node-pty 数据事件回到 owner window，再进入 xterm 与状态解析。", "node-pty data events return to the owner window, then enter xterm and state parsing."),
    steps: [
      step("external", l("CLI 输出", "CLI output"), l("模型回复、tool UI 与错误写入 PTY。", "Model responses, tool UI, and errors write to PTY."), l("Agent activity", "Agent activity"), l("PTY data chunk", "PTY data chunk"), s("src/main/pty.ts", "L674-L682", ["proc.onData"], "输出入口。", "Output entry.")),
      step("main", l("Owner routing", "Owner routing"), l("更新 lastOutputAt 并发送 `pty:data:<id>` 给所属窗口。", "Update lastOutputAt and send pty:data:<id> to the owner window."), l("data + session identity", "data and session identity"), l("Electron push event", "Electron push event"), s("src/main/pty.ts", "L655-L682", ["safeSend"], "旧 session 输出会被丢弃。", "Stale session output is dropped.")),
      step("bridge", l("Preload listener", "Preload listener"), l("onPtyData 包装 ipcRenderer.on 并返回 unsubscribe。", "onPtyData wraps ipcRenderer.on and returns unsubscribe."), l("dynamic channel", "Dynamic channel"), l("string callback", "String callback"), s("src/preload/index.ts", "L603-L607", ["onPtyData"], "事件桥。", "Event bridge.")),
      step("ui", l("xterm buffer", "xterm buffer"), l("terminalPool normalize chunk、写 xterm、保持 scroll following。", "terminalPool normalizes the chunk, writes xterm, and preserves scroll following."), l("raw chunk", "Raw chunk"), l("visible terminal + stream callback", "Visible terminal plus stream callback"), s("src/renderer/src/components/terminalPool.ts", "L184-L197", ["term.write"], "显示路径。", "Display path.")),
      step("state", l("状态映射", "State mapping"), l("usePtyParser/hook events 更新 working、idle、waiting、blocked、station 与 tool。", "usePtyParser and hooks update status, station, and tool state."), l("visible text + hook events", "Visible text and hook events"), l("Zustand agent state", "Zustand agent state"), s("src/renderer/src/hooks/usePtyParser.ts", "L87-L181", ["usePtyParser"], "office avatar 的数据来源。", "Data source for office avatars.")),
    ],
  },
  {
    id: "hive-task",
    title: l("Hive 创建并调度 Task", "Create and schedule a Hive task"),
    summary: l("Task ledger 持久化工作意图，真正投递仍通过 mailbox/terminal queue。", "The task ledger persists work intent; actual delivery still uses mailbox or terminal queues."),
    steps: [
      step("ui", l("创建卡片", "Create card"), l("Kanban、voice、Slack 或 webhook 产生 HiveTask。", "Kanban, voice, Slack, or webhook creates a HiveTask."), l("title/assignee/status/deps", "title/assignee/status/deps"), l("hive:addTask", "hive:addTask"), s("src/preload/index.ts", "L1069-L1077", ["hiveAddTask", "hivePatchTask"], "UI bridge。", "UI bridge.")),
      step("main", l("最新账本合并", "Merge latest ledger"), l("addTask 读取最新 tasks.json，按 id 幂等追加。", "addTask reads current tasks.json and appends idempotently by id."), l("HiveTask", "HiveTask"), l("merged tasks array", "Merged tasks array"), s("src/main/hive.ts", "L1718-L1739", ["addTask", "patchTask"], "避免 stale collection clobber。", "Avoids stale-collection clobber.")),
      step("state", l("落盘 + Git", "Persist and commit"), l("writeTasks 保留未知字段，写 tasks.json、log，并由 Hive 单一 committer 提交。", "writeTasks preserves unknown fields, writes tasks.json/log, and commits via Hive."), l("latest ledger", "Latest ledger"), l("durable task card", "Durable task card"), s("src/main/hive.ts", "L1693-L1715", ["writeTasks", "mergeTaskLedger"], "任务持久层。", "Task persistence.")),
      step("main", l("调度消息", "Dispatch message"), l("god/trigger 发送 work order 到 assignee mailbox；router 解析 provider 路径。", "God or a trigger sends a work order to the assignee mailbox; router selects the provider path."), l("HiveMessage", "HiveMessage"), l("inbox file or terminal handoff", "Inbox file or terminal handoff"), s("src/main/hive.ts", "L1487-L1633", ["send", "routeMessage"], "任务与消息是两层。", "Tasks and messages are separate layers.")),
      step("external", l("Worker 执行", "Worker executes"), l("空闲 nudge/Stop drain 让 CLI 读取 inbox，并在完成后更新 card/send done。", "Idle nudge or Stop drain prompts the CLI to read its inbox, then update the card and send done."), l("work order", "Work order"), l("code changes + result", "Code changes and result"), s("src/main/hive.ts", "L2616-L2741", ["PROTOCOL_MD"], "Agent 协议定义任务行为。", "Agent protocol defines task behavior.")),
    ],
  },
  {
    id: "agent-message",
    title: l("Agent 间消息", "Agent-to-agent message"),
    summary: l("文件 outbox 是发送入口，router 决定 inbox 或 terminal handoff。", "A file outbox is the send entry; router chooses inbox or terminal handoff."),
    steps: [
      step("external", l("写 outbox", "Write outbox"), l("Agent 写 JSON message 到自己的 outbox。", "Agent writes a JSON message to its own outbox."), l("to/act/subject/body", "to/act/subject/body"), l("outbox/*.json", "outbox/*.json"), s("src/main/hive.ts", "L2616-L2694", ["PROTOCOL_MD"], "协议入口。", "Protocol entry.")),
      step("main", l("Router poll", "Router poll"), l("routeOnce 扫描目录、规范化，并强制 from=目录 id。", "routeOnce scans directories, normalizes, and makes directory id authoritative."), l("outbox file", "Outbox file"), l("normalized HiveMessage", "Normalized HiveMessage"), s("src/main/hive.ts", "L1635-L1674", ["routeOnce"], "防发送者伪造。", "Prevents sender spoofing.")),
      step("main", l("Resolve targets", "Resolve targets"), l("应用 hop cap、god/human/broadcast、archived 与 provider delivery rules。", "Apply hop cap, god/human/broadcast, archive, and provider rules."), l("registry + message", "Registry and message"), l("delivered targets or bounce", "Delivered targets or bounce"), s("src/main/hive.ts", "L1495-L1585", ["routeMessage"], "核心路由策略。", "Core routing policy.")),
      step("state", l("Inbox / handoff", "Inbox or handoff"), l("原生/bridged provider 写 inbox；hookless/proxy terminal provider 发 renderer handoff。", "Native or bridged providers receive inbox files; hookless or terminal proxy providers receive renderer handoffs."), l("target capability", "Target capability"), l("file or UI event", "File or UI event"), s("src/main/hive.ts", "L1534-L1566", ["canReceiveInbox", "emitTerminalHandoff"], "异构 provider 分支。", "Heterogeneous provider branch.")),
      step("ui", l("Idle delivery", "Idle delivery"), l("Renderer 产生 inbox nudge/work order，并经 message queue 等待安全 prompt。", "Renderer queues an inbox nudge or work order until the prompt is safe."), l("hive event + PTY facts", "Hive event and PTY facts"), l("submitted terminal instruction", "Submitted terminal instruction"), s("src/renderer/src/hooks/useHive.ts", "L609-L888", ["onHiveTerminalHandoff", "dispatch"], "最后一公里。", "Last-mile delivery.")),
    ],
  },
  {
    id: "restart",
    title: l("Restart / Cancel", "Restart / cancel"),
    summary: l("kill 与 spawn 复用同 ptyId，但保留 Agent 身份和可恢复 session。", "Kill and spawn reuse the PTY id while preserving agent identity and resumable sessions."),
    steps: [
      step("ui", l("请求重启", "Request restart"), l("Renderer killPty，重置 pooled terminal，再用保存 recipe spawnPty。", "Renderer kills the PTY, resets the pooled terminal, and spawns from the saved recipe."), l("Agent recipe", "Agent recipe"), l("kill + respawn requests", "Kill and respawn requests"), s("src/renderer/src/components/CommandCenterPanel.tsx", "L450-L520", ["killPty", "spawnPty"], "用户控制入口。", "User control entry.")),
      step("runtime", l("终止进程", "Terminate process"), l("PtyManager.kill 调 proc.kill + ensureKilled 并删除 session。", "PtyManager.kill calls proc.kill plus ensureKilled and removes the session."), l("pty id", "PTY id"), l("process tree stopped", "Process tree stopped"), s("src/main/pty.ts", "L736-L748", ["kill"], "运行时终止。", "Runtime termination.")),
      step("main", l("共享 teardown", "Shared teardown"), l("archive agent、清理 map；worktree 有未集成工作则 preserve。", "Archive agent and clean maps; preserve worktrees with unintegrated work."), l("ptyToAgent/worktree maps", "ptyToAgent/worktree maps"), l("archived or preserved state", "Archived or preserved state"), s("src/main/index.ts", "L435-L620", ["teardownPty", "finalizeWorkerWorktree"], "生命周期收尾。", "Lifecycle cleanup.")),
      step("state", l("恢复 session", "Resume session"), l("Registry 中的 sessionId 驱动 Claude --resume、Codex resume 等。", "Registry sessionId drives Claude --resume, Codex resume, and provider-specific resumes."), l("saved session id + provider", "Saved session id and provider"), l("resume args or honest fresh fallback", "Resume args or honest fresh fallback"), s("src/main/index.ts", "L2772-L2849", ["lastSession", "seedSessionTranscript", "findCodexHomeForSession"], "provider-aware resume。", "Provider-aware resume.")),
      step("runtime", l("同 id 新 session", "New session under same id"), l("旧 callback 通过 identity guard 被抑制，新进程接管动态 channel。", "Old callbacks are suppressed by identity guards and the new process owns the channels."), l("same pty id", "Same PTY id"), l("clean xterm + live process", "Clean xterm and live process"), s("src/main/pty.ts", "L655-L692", ["PtySession identity"], "避免 restart race。", "Avoids restart races.")),
    ],
  },
  {
    id: "closing",
    title: l("App Closing / Cleanup", "App closing / cleanup"),
    summary: l("有活跃 PTY 时先提示；Closing Time 保存团队状态；最终 teardown 停服务、杀进程树并有界 flush analytics。", "Active PTYs trigger a warning; Closing Time saves team state; final teardown stops services, reaps processes, and performs a bounded analytics flush."),
    steps: [
      step("ui", l("请求关闭", "Request close"), l("窗口 close/before-quit 检查 PTY 数量并让 renderer 显示确认。", "Window close/before-quit checks live PTYs and asks renderer for confirmation."), l("window close", "Window close"), l("app:closeRequested", "app:closeRequested"), s("src/main/index.ts", "L2323-L2351", ["win.on('close')"], "防意外退出。", "Prevents accidental exit.")),
      step("main", l("Closing Time", "Closing Time"), l("广播保存指令、steer 忙碌 Agent、等待 worker ACK。", "Broadcast save instructions, steer busy agents, and await worker acknowledgements."), l("live agent ids", "Live agent ids"), l("ACK progress", "ACK progress"), s("src/main/closingTime.ts", "L83-L147", ["start"], "优雅收尾协议。", "Graceful shutdown protocol.")),
      step("state", l("验证 COMPLETE", "Verify COMPLETE"), l("只接受 god 的 COMPLETE，并独立确认每个 live worker 已 ACK。", "Accept COMPLETE only from god and independently verify live worker acknowledgements."), l("routed messages + registry", "Routed messages and registry"), l("complete / refused", "Complete or refused"), s("src/main/closingTime.ts", "L170-L217", ["onRouted"], "避免过早退出。", "Prevents premature exit.")),
      step("main", l("Teardown services", "Tear down services"), l("停止 router/hooks/worker watcher/memory/servers/sidecars/timers。", "Stop router, hooks, watcher, memory, servers, sidecars, and timers."), l("global managers", "Global managers"), l("no background services", "No background services"), s("src/main/index.ts", "L3676-L3720", ["teardownAndQuit"], "统一关闭路径。", "Unified shutdown path.")),
      step("runtime", l("Kill all PTYs", "Kill all PTYs"), l("Windows 同步 process-tree sweep；POSIX HUP + best-effort sweep。", "Windows performs a synchronous process-tree sweep; POSIX uses HUP plus best effort."), l("sessions map", "Sessions map"), l("all CLI trees stopped", "All CLI trees stopped"), s("src/main/pty.ts", "L773-L805", ["killAll"], "进程清理。", "Process cleanup.")),
      step("main", l("Bounded analytics flush", "Bounded analytics flush"), l("will-quit 最多等待约 1.2 秒，再 app.exit。", "will-quit waits at most about 1.2 seconds, then app.exit."), l("session_ended event", "session_ended event"), l("process exit", "Process exit"), s("src/main/index.ts", "L5280-L5303", ["will-quit"], "网络不会卡死退出。", "Network cannot wedge shutdown.")),
    ],
  },
];

export const learningLevels = [
  { level: 1, title: l("产品边界", "Product boundary"), text: l("先能解释 Munder Difflin 不做模型推理，而是管理外部 CLI runtime。", "Explain why Munder Difflin manages external CLI runtimes instead of doing inference."), href: "/architecture" },
  { level: 2, title: l("Electron 与 IPC", "Electron and IPC"), text: l("掌握 renderer 为什么无 Node 权限，以及 preload 如何形成窄能力面。", "Learn why Renderer lacks Node privileges and how preload forms a narrow capability surface."), href: "/electron" },
  { level: 3, title: l("PTY Runtime", "PTY runtime"), text: l("跟踪 command/args/env/cwd 到 node-pty，再理解输入输出与 process cleanup。", "Trace command/args/env/cwd into node-pty, then study I/O and cleanup."), href: "/pty" },
  { level: 4, title: l("Agent Lifecycle", "Agent lifecycle"), text: l("阅读 spawnAgentCore 的 provider、CLI install、worktree、Hive、resume 与 restart 逻辑。", "Read provider, CLI install, worktree, Hive, resume, and restart logic in spawnAgentCore."), href: "/runtime" },
  { level: 5, title: l("Hive / Multi-Agent", "Hive / multi-agent"), text: l("区分 registry、task ledger、mailbox、hook、nudge 与 terminal handoff。", "Separate registry, task ledger, mailbox, hooks, nudges, and terminal handoffs."), href: "/hive" },
  { level: 6, title: l("State / Storage", "State / storage"), text: l("记住当前 SQLite 只有两表，其他权威分散在 roster、Hive files 与 CLI storage。", "Remember that SQLite currently has two tables while other state lives in roster, Hive files, and CLI storage."), href: "/state" },
  { level: 7, title: l("Renderer / Visualization", "Renderer / visualization"), text: l("理解 xterm 与 Pixi 如何消费真实事件，而不是替代 runtime。", "Understand how xterm and Pixi consume real events rather than replacing runtime."), href: "/renderer" },
  { level: 8, title: l("扩展与二次开发", "Extension work"), text: l("从 provider preset、IPC capability、Hive protocol 或企业权威数据层选择一个明确边界扩展。", "Extend one explicit boundary: provider preset, IPC capability, Hive protocol, or enterprise authority layer."), href: "/conclusions" },
];

export function sourceHref(ref: Pick<SourceRef, "path" | "lines">): string {
  const clean = ref.path.replace(/\\/g, "/");
  const anchor = ref.lines ? `#${ref.lines}` : "";
  return `${SOURCE_BASE}${clean}${anchor}`;
}
