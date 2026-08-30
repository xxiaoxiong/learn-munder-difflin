import type { Localized, NavigationItem, PageData, Section, SourceRef } from "./site-data";

const l = (zh: string, en: string): Localized => ({ zh, en });
const s = (path: string, lines: string, symbols: string[], zh: string, en: string): SourceRef => ({
  path,
  lines,
  symbols,
  note: l(zh, en),
  confidence: "verified",
});

export const coursePhases = [
  { id: 0, label: l("建立地图", "Build the map"), outcome: l("知道系统边界、阅读顺序与判断证据的方法。", "Know the boundary, reading order, and evidence model.") },
  { id: 1, label: l("进程与权限", "Process & privilege"), outcome: l("从一次点击追到外部 CLI 进程，并理解恢复与失败边界。", "Trace a click into an external CLI process, including resume and failure boundaries.") },
  { id: 2, label: l("多 Agent 协调", "Multi-agent coordination"), outcome: l("读懂 Hive 协议、消息投递、任务状态与安全收尾。", "Understand Hive protocol, delivery, tasks, and safe shutdown.") },
  { id: 3, label: l("状态与工作区", "State & workspace"), outcome: l("判断每类事实的权威来源、持久化位置与恢复策略。", "Identify authority, persistence, and recovery for every kind of fact.") },
  { id: 4, label: l("界面与系统边缘", "Interface & perimeter"), outcome: l("理解 UI 如何投影事实，以及网络、遥测和集成如何守住边界。", "See how UI projects facts and how integrations protect system boundaries.") },
  { id: 5, label: l("实战与验证", "Practice & validation"), outcome: l("用实验、调用链和自测完成可迁移的架构理解。", "Turn understanding into transferable skill through labs, traces, and checks.") },
] as const;

const nav = (slug: string, zh: string, en: string, phase: number, lesson: number): NavigationItem => ({
  slug,
  label: l(zh, en),
  group: coursePhases[phase].label,
  phase,
  lesson,
});

export const courseNavigation: NavigationItem[] = [
  nav("", "课程首页", "Course home", 0, 0),
  nav("learning-path", "学习路线与用法", "How to learn", 0, 1),
  nav("orientation", "先建立四层心智模型", "Four-layer mental model", 0, 2),
  nav("architecture", "系统边界与总架构", "System boundary", 0, 3),
  nav("electron", "Electron 权限分层", "Electron privilege layers", 1, 4),
  nav("boot-chain", "启动链与服务装配", "Boot chain", 1, 5),
  nav("runtime", "Agent 创建全链路", "Agent launch", 1, 6),
  nav("provider-bridges", "Provider 适配与恢复", "Provider bridges", 1, 7),
  nav("pty", "PTY 会话与进程树", "PTY lifecycle", 1, 8),
  nav("prompt-io", "Prompt 输入与队列", "Prompt I/O", 1, 9),
  nav("hive", "Hive 协作模型", "Hive model", 2, 10),
  nav("hive-protocol", "文件协议与身份", "File protocol & identity", 2, 11),
  nav("message-routing", "消息路由与投递语义", "Message routing", 2, 12),
  nav("safety-lifecycle", "熔断、看门狗与收尾", "Safety lifecycle", 2, 13),
  nav("state", "状态分层总览", "State layers", 3, 14),
  nav("persistence-authority", "权威源与恢复", "Authority & recovery", 3, 15),
  nav("git-workspaces", "Git 工作区隔离", "Git workspace isolation", 3, 16),
  nav("memory-knowledge", "Memory 与知识图谱", "Memory & knowledge", 3, 17),
  nav("renderer", "Renderer 状态投影", "Renderer projection", 4, 18),
  nav("integrations", "Git、网络与外部集成", "Git & integrations", 4, 19),
  nav("observability", "实时、遥测与隐私", "Realtime & observability", 4, 20),
  nav("call-flows", "关键调用链播放器", "Call-flow player", 5, 21),
  nav("architecture-lab", "架构实验室", "Architecture lab", 5, 22),
  nav("extension-guide", "二次开发作战手册", "Extension playbook", 5, 23),
  nav("self-check", "理解度自测", "Knowledge check", 5, 24),
  nav("source-map", "源码地图", "Source map", 5, 25),
  nav("glossary", "术语与概念关系", "Glossary", 5, 26),
  nav("conclusions", "架构结论与取舍", "Conclusions", 5, 27),
];

type PagePatch = Partial<Omit<PageData, "sections">> & { appendSections?: Section[] };

const metadata = (
  phase: number,
  lesson: number,
  level: PageData["level"],
  keyQuestion: Localized,
  objectives: Localized[],
  prerequisites: string[],
  takeaways: Localized[],
): PagePatch => ({ phase, lesson, level, keyQuestion, objectives, prerequisites, takeaways });

export const pagePatches: Record<string, PagePatch> = {
  "learning-path": metadata(0, 1, "入门", l("怎样读，才能从看热闹变成会判断？", "How do you turn browsing into architectural judgment?"), [l("选择适合自己的阅读入口。", "Choose a suitable entry route."), l("理解课程中的证据、练习与完成标准。", "Understand evidence, practice, and completion criteria.")], [], [l("不要按文件名漫游；先回答问题，再追调用链。", "Start with questions and traces, not filenames.")]),
  architecture: metadata(0, 3, "入门", l("Munder Difflin 到底拥有什么、不拥有什么？", "What does Munder Difflin own—and not own?"), [l("区分 harness、orchestration、control plane 与 visualization。", "Separate harness, orchestration, control plane, and visualization."), l("画出 Electron 与外部 CLI 的责任边界。", "Draw the responsibility boundary between Electron and external CLIs.")], ["orientation"], [l("外部 CLI 拥有推理循环；Munder 拥有进程与协作生命周期。", "External CLIs own inference; Munder owns process and collaboration lifecycles.")]),
  electron: metadata(1, 4, "进阶", l("为什么一个桌面应用要拆成 Main、Preload、Renderer？", "Why split a desktop app into Main, Preload, and Renderer?"), [l("判断一项能力应放在哪个进程。", "Place a capability in the correct process."), l("理解 IPC 是权限边界而非普通函数调用。", "Treat IPC as a privilege boundary, not a normal function call.")], ["architecture"], [l("Renderer 只表达意图，Main 才执行特权动作。", "Renderer expresses intent; Main executes privileged actions.")]),
  runtime: metadata(1, 6, "深入", l("一次创建 Agent 如何变成可恢复、可观察的真实进程？", "How does agent creation become a resumable, observable process?"), [l("追踪 spawnAgentCore 的输入、分支与产物。", "Trace spawnAgentCore inputs, branches, and outputs."), l("识别工作区、provider 与 PTY 三个失败面。", "Identify workspace, provider, and PTY failure surfaces.")], ["electron", "boot-chain"], [l("创建 Agent 是跨状态、文件、Git、PTY 的事务式编排。", "Agent creation is transaction-like orchestration across state, files, Git, and PTY.")]),
  pty: metadata(1, 8, "深入", l("为什么 PTY 不是一个可随意替换的 child_process？", "Why is a PTY not a drop-in child_process?"), [l("理解终端语义、session 映射和进程树回收。", "Understand terminal semantics, session mapping, and process-tree cleanup."), l("解释 Windows 与 Unix 的生命周期差异。", "Explain Windows and Unix lifecycle differences.")], ["runtime", "provider-bridges"], [l("PTY 同时是传输层、交互设备和生命周期边界。", "A PTY is transport, interactive device, and lifecycle boundary at once.")]),
  hive: metadata(2, 10, "进阶", l("多个真实 CLI 进程如何形成一个可协作团队？", "How do real CLI processes become a team?"), [l("理解 god/worker、task、mailbox 与 router 的职责。", "Understand god/worker roles, tasks, mailboxes, and router."), l("区分协调协议与模型推理。", "Separate coordination protocol from model reasoning.")], ["prompt-io"], [l("Hive 用文件事实与安全投递协调进程，不代理它们的推理。", "Hive coordinates processes through file facts and safe delivery; it does not proxy reasoning.")]),
  state: metadata(3, 14, "深入", l("同一个界面事实为什么可能同时存在于四个地方？", "Why can one UI fact exist in four places?"), [l("区分 UI cache、config、SQLite 与协议文件。", "Separate UI cache, config, SQLite, and protocol files."), l("为任意状态判断 authority 与恢复路径。", "Determine authority and recovery path for any state.")], ["safety-lifecycle"], [l("存储位置不等于权威来源；先定义谁能覆盖谁。", "Storage location does not imply authority; define overwrite precedence.")]),
  renderer: metadata(4, 18, "进阶", l("UI 显示的‘状态’来自终端猜测，还是结构化事实？", "Does displayed state come from terminal guesses or structured facts?"), [l("追踪 hook/IPC 事实进入 Zustand 与组件的路径。", "Trace hook/IPC facts into Zustand and components."), l("识别乐观 UI、持久 cache 与主进程事实。", "Identify optimistic UI, persistent cache, and main-process facts.")], ["memory-knowledge"], [l("Renderer 应投影事实并管理交互，不应悄悄成为业务权威。", "Renderer should project facts and manage interaction, not become hidden business authority.")]),
  integrations: metadata(4, 19, "深入", l("系统边缘如何既开放集成，又不泄漏核心权限？", "How can the perimeter enable integrations without leaking core privilege?"), [l("比较 GitHub、Slack、Webhook、Realtime 的信任边界。", "Compare trust boundaries for GitHub, Slack, webhooks, and realtime."), l("辨别 loopback、secret gating 与公开 tunnel。", "Distinguish loopback, secret gating, and public tunnels.")], ["renderer"], [l("每一种集成都应写清入口、认证、权限、数据去向与撤销方式。", "Every integration needs an explicit entry point, auth, privilege, data destination, and revocation path.")]),
  "call-flows": metadata(5, 21, "实战", l("能否不靠猜测，从用户动作追到最终副作用？", "Can you trace a user action to its side effect without guessing?"), [l("沿进程泳道逐步读取输入和输出。", "Read inputs and outputs across process lanes."), l("用源码锚点验证每一次跨界。", "Verify every boundary crossing with source anchors.")], ["observability"], [l("高质量架构理解应能复述调用链，也能指出失败边界。", "Strong architectural understanding can retell a trace and identify failure boundaries.")]),
  "source-map": metadata(5, 25, "实战", l("遇到新问题时，应从哪个模块和符号开始？", "Where should a new investigation begin?"), [l("用领域而不是目录记忆源码。", "Remember source by domain rather than directory."), l("从上下游关系缩小搜索范围。", "Narrow searches through upstream/downstream relations.")], ["self-check"], [l("源码地图是调查索引，不是学习顺序。", "A source map is an investigation index, not a learning order.")]),
  conclusions: metadata(5, 27, "实战", l("哪些设计值得复用，哪些债务不能照搬？", "Which choices are reusable, and which debts should not be copied?"), [l("形成自己的架构评审结论。", "Form your own architecture review."), l("区分产品适配与企业级默认。", "Distinguish product fit from enterprise-grade defaults.")], ["glossary"], [l("架构评价必须把场景、收益、代价和替代方案放在一起。", "Architecture judgment must combine context, benefit, cost, and alternatives.")]),
};

const page = (config: PageData): PageData => config;
const layer = (
  intuitionZh: string,
  intuitionEn: string,
  mechanism: Localized[],
  invariants: Localized[],
  questionZh: string,
  questionEn: string,
  answerZh: string,
  answerEn: string,
): NonNullable<Section["layers"]> => ({
  intuition: l(intuitionZh, intuitionEn),
  mechanism,
  invariants,
  checkpoint: { question: l(questionZh, questionEn), answer: l(answerZh, answerEn) },
});

export const deepPages: Record<string, PageData> = {
  orientation: page({
    slug: "orientation", nav: l("四层心智模型", "Four-layer mental model"), kicker: l("第 02 课 · 建立地图", "LESSON 02 · BUILD THE MAP"),
    title: l("先别钻进代码：用四层模型看懂整个系统", "Before reading code, see the whole system through four layers"),
    summary: l("把复杂桌面 Agent 系统拆成体验层、控制层、执行层与事实层。后续每一段源码都能被放回明确位置。", "Decompose the desktop agent system into experience, control, execution, and fact layers so every source module has a home."),
    readTime: 12, phase: 0, lesson: 2, level: "入门", prerequisites: [],
    keyQuestion: l("面对两万多行主进程代码，怎样不迷路？", "How do you avoid getting lost in a very large main process?"),
    objectives: [l("建立四层职责地图。", "Build a four-layer responsibility map."), l("学会用所有权、跨界与事实三个问题阅读源码。", "Read source through ownership, boundary, and fact questions.")],
    takeaways: [l("先定位责任层，再追调用链，最后验证状态权威。", "Locate the responsibility layer, trace the call, then verify state authority.")],
    sections: [
      {
        id: "four-layers", eyebrow: l("第一张地图", "THE FIRST MAP"), title: l("四层不是四个目录，而是四种责任", "The four layers are responsibilities, not folders"),
        lead: l("Experience 负责把事实变成可操作界面；Control 负责权限与编排；Execution 是外部 CLI 与 PTY；Facts 则是 config、SQLite、Hive 文件和运行时事件。", "Experience turns facts into interaction; Control owns privilege and orchestration; Execution is PTY plus external CLI; Facts live in config, SQLite, Hive files, and runtime events."),
        bullets: [l("体验层：React、Zustand、Pixi、xterm；可以展示和发出意图。", "Experience: React, Zustand, Pixi, xterm; displays facts and emits intent."), l("控制层：Electron Main managers；可以碰进程、文件、Git、数据库与网络。", "Control: Electron Main managers; can touch process, files, Git, DB, and network."), l("执行层：node-pty 与 provider CLI；真正运行 agent loop。", "Execution: node-pty and provider CLIs; actually run the agent loop."), l("事实层：有多个存储，但每类事实必须只有明确权威。", "Facts: multiple stores, but each fact needs explicit authority.")],
        layers: layer("把它想成机场：大屏是体验层，塔台是控制层，飞机是执行层，航班计划与雷达记录是事实层。", "Think of an airport: displays are experience, tower is control, aircraft are execution, and schedules/radar are facts.", [l("用户先在 Renderer 表达意图。", "Renderer captures user intent."), l("Preload 把有限能力翻译为 IPC。", "Preload translates a narrow capability into IPC."), l("Main 校验并编排副作用。", "Main validates and orchestrates side effects."), l("PTY/CLI 执行，事件再回流界面与存储。", "PTY/CLI executes and events flow back to UI and stores.")], [l("UI 不能因为‘能调 IPC’就拥有权限。", "UI does not own privilege merely because it can call IPC."), l("终端文本不是所有状态的权威。", "Terminal text is not authority for every state.")], "PtyManager 属于哪一层？它产生的事件又进入哪两层？", "Which layer owns PtyManager, and which two layers consume its events?", "PtyManager 属于控制层；它驱动执行层，并把事件送往体验层和事实层。", "PtyManager is control; it drives execution and feeds experience and fact layers."),
        sources: [s("src/main/index.ts", "L2216-L2265", ["createWindow"], "窗口由 Main 创建，说明体验容器也受控制层生命周期管理。", "Main creates the window, so even the experience container is control-owned."), s("src/preload/index.ts", "L1390-L1421", ["contextBridge.exposeInMainWorld"], "Preload 暴露受限能力而不是 Node 全权限。", "Preload exposes narrow capabilities, not full Node privilege.")],
      },
      {
        id: "three-questions", eyebrow: l("阅读算法", "READING ALGORITHM"), title: l("每看到一个函数，只问三个问题", "Ask three questions for every function"),
        lead: l("谁拥有这个动作？它跨过了哪条边界？它读写的事实由谁说了算？这三个问题比记住目录结构更可靠。", "Who owns the action? Which boundary does it cross? Who is authoritative for the fact it reads or writes? These questions outlast directory memorization."),
        bullets: [l("所有权：谁可以失败、重试、撤销或清理这个动作？", "Ownership: who may fail, retry, revoke, or clean up the action?"), l("跨界：Renderer→Preload、Preload→Main、Main→PTY、进程→文件分别改变什么信任？", "Boundary: what trust changes across Renderer→Preload, Preload→Main, Main→PTY, and process→file?"), l("事实：这是即时事件、缓存、持久记录还是协议状态？", "Fact: is this an event, cache, durable record, or protocol state?")],
        layers: layer("不要先问‘这个文件做什么’，先问‘这个副作用最终由谁负责’。", "Do not start with what a file does; start with who is accountable for the side effect.", [l("从 UI 动词或 IPC channel 找入口。", "Find an entry through a UI verb or IPC channel."), l("记录每一步输入、输出与可能失败。", "Record input, output, and failure at each step."), l("找到最终副作用与清理路径。", "Find the final side effect and cleanup path."), l("反向确认状态如何回到界面。", "Trace state back to the UI.")], [l("没有清理路径的资源创建链是不完整的。", "A resource creation trace without cleanup is incomplete."), l("没有 authority 定义的双写迟早漂移。", "Dual writes without authority eventually drift.")], "为什么 source map 不能替代调用链？", "Why can’t a source map replace a call trace?", "地图只告诉你模块在哪；调用链才说明数据、权限、失败和回收怎样流动。", "A map locates modules; a trace explains data, privilege, failure, and cleanup flow."),
      },
      {
        id: "evidence-ladder", eyebrow: l("证据等级", "EVIDENCE LADDER"), title: l("从产品现象到源码结论，要经过四级证据", "Move from product behavior to source conclusion through four evidence levels"),
        lead: l("本课程把设计意图、静态实现、运行时行为和架构判断分开，避免把‘看起来如此’写成‘一定如此’。", "The course separates design intent, static implementation, runtime behavior, and architectural judgment so appearance is not mistaken for certainty."),
        bullets: [l("L1 产品现象：能看到什么、点到什么。", "L1 Product observation: visible and interactive behavior."), l("L2 静态实现：函数、分支、类型、存储 schema。", "L2 Static implementation: functions, branches, types, and schemas."), l("L3 运行时证据：日志、进程、文件变化与网络行为。", "L3 Runtime evidence: logs, processes, file changes, and network behavior."), l("L4 架构判断：基于场景解释收益、风险与替代方案。", "L4 Architectural judgment: contextual benefits, risks, and alternatives.")],
        callout: { tone: "insight", text: l("课程中的源码卡片固定到 commit 956bfb4c；它们证明该版本的静态实现，不自动证明所有平台上的运行结果。", "Source cards are pinned to commit 956bfb4c; they prove that revision’s static implementation, not every platform’s runtime outcome.") },
      },
    ],
  }),

  "boot-chain": page({
    slug: "boot-chain", nav: l("启动链", "Boot chain"), kicker: l("第 05 课 · 进程与权限", "LESSON 05 · PROCESS & PRIVILEGE"),
    title: l("应用不是“打开窗口”就启动完了：服务装配决定运行边界", "Startup is more than opening a window: service assembly defines the runtime boundary"),
    summary: l("从 app.whenReady 追到 Hive、窗口、托盘与退出清理，理解全局 manager 的创建顺序为什么是一条隐含依赖图。", "Trace app.whenReady through Hive, windows, tray, and shutdown to understand the implicit dependency graph among global managers."),
    readTime: 14, phase: 1, lesson: 5, level: "深入", prerequisites: ["electron"],
    keyQuestion: l("启动顺序为什么是架构，而不只是样板代码？", "Why is startup order architecture rather than boilerplate?"),
    objectives: [l("画出启动与退出的对称链。", "Draw symmetric startup and shutdown chains."), l("识别全局 manager 的依赖和部分失败策略。", "Identify manager dependencies and partial-failure policy.")],
    takeaways: [l("启动创建所有权；退出验证所有权。", "Startup creates ownership; shutdown proves it.")],
    sections: [
      { id: "ready-chain", eyebrow: l("装配入口", "ASSEMBLY ENTRY"), title: l("app.whenReady 是组合根，不是业务函数", "app.whenReady is the composition root, not a business function"), lead: l("这里创建或连接全局服务，再把它们注入窗口、IPC 和事件处理器。读启动链时要记录顺序依赖，而不是只列函数名。", "It creates or connects global services and wires them into windows, IPC, and event handlers. Record ordering dependencies, not just function names."),
        layers: layer("像搭建舞台：先通电和装后台，再开前台窗口；先后顺序错了，按钮存在但背后的能力还没准备好。", "Like staging a theater: power and backstage services precede the front curtain.", [l("Electron 进入 ready。", "Electron becomes ready."), l("bootstrapHiveServices 装配协调服务。", "bootstrapHiveServices assembles coordination services."), l("createWindow 创建 BrowserWindow 并连接渲染层。", "createWindow creates BrowserWindow and connects renderer."), l("IPC、托盘、更新与外部入口在已有 owner 上注册。", "IPC, tray, updates, and external entry points register against existing owners.")], [l("被 handler 捕获的 manager 必须先创建。", "Managers captured by handlers must exist first."), l("部分初始化失败必须决定继续、降级还是退出。", "Partial initialization failure must choose continue, degrade, or exit.")], "窗口先于 Hive 创建会有什么风险？", "What risks arise if the window precedes Hive?", "Renderer 可能发出依赖 Hive 的请求，而 Main 尚无可用 owner，形成竞态或空引用。", "Renderer may issue Hive-dependent requests before Main has an owner, creating races or null state."),
        sources: [s("src/main/index.ts", "L4950-L5035", ["bootstrapHiveServices"], "Hive、hooks、closing time 等服务在集中装配函数中建立依赖。", "Hive, hooks, and closing-time services are wired in a central assembly function."), s("src/main/index.ts", "L5174-L5235", ["app.whenReady"], "ready 回调串联服务装配与窗口创建。", "The ready callback sequences service assembly and window creation.")],
      },
      { id: "global-managers", eyebrow: l("隐含依赖图", "IMPLICIT DEPENDENCY GRAPH"), title: l("全局变量让访问简单，也让初始化约束变隐形", "Globals simplify access while hiding initialization constraints"), lead: l("PtyManager、HiveManager、HookServer、ClosingTimeController 等拥有不同资源。真正要审计的是谁创建、谁引用、谁监听谁，以及失败后剩下什么。", "PtyManager, HiveManager, HookServer, and ClosingTimeController own different resources. Audit creation, references, subscriptions, and leftovers after failure."),
        bullets: [l("构造依赖：A 没有 B 就不能创建。", "Construction dependency: A cannot be created without B."), l("事件依赖：A 在运行中订阅 B。", "Event dependency: A subscribes to B at runtime."), l("清理依赖：A 必须在 B 之前停止，避免回调落到已销毁资源。", "Cleanup dependency: A must stop before B to avoid callbacks into destroyed resources."), l("降级依赖：可选模块失败不应拖垮核心启动。", "Degradation dependency: optional module failure should not sink core startup.")],
      },
      { id: "shutdown-symmetry", eyebrow: l("退出链", "SHUTDOWN SYMMETRY"), title: l("teardownAndQuit 是启动链的反向证明", "teardownAndQuit is the reverse proof of startup ownership"), lead: l("可靠退出需要先阻止新工作，再停调度和网络入口，随后回收 PTY/进程、落盘状态，最后让 Electron 退出。只调用 app.quit 不等于完成生命周期。", "Reliable shutdown blocks new work, stops schedulers and network entry points, reaps PTYs/processes, persists state, and only then exits Electron."),
        layers: layer("关机场不能只关大厅灯：必须停止放行、让飞机落地、保存记录，最后才断电。", "Closing an airport is not turning off lobby lights; stop departures, land aircraft, save records, then power down.", [l("设置退出/拒绝新工作状态。", "Mark shutdown and reject new work."), l("停止 router、watchdog、timer 与 server。", "Stop routers, watchdogs, timers, and servers."), l("终止 PTY 及其进程树。", "Terminate PTYs and process trees."), l("移除监听并完成最终落盘。", "Remove listeners and finish persistence.")], [l("清理必须幂等，多个退出事件不能重复破坏资源。", "Cleanup must be idempotent across multiple quit events."), l("先停生产者，再停消费者。", "Stop producers before consumers.")], "will-quit 监听器为什么不能替代显式 teardown？", "Why can’t a will-quit handler replace explicit teardown?", "它是最后防线；若需要异步顺序、拒绝新请求或用户确认，就必须更早进入受控退出流程。", "It is a last line of defense; ordered async cleanup and request rejection require an earlier controlled shutdown flow."),
        sources: [s("src/main/index.ts", "L3676-L3758", ["teardownAndQuit"], "集中退出函数协调多个资源 owner 的停止。", "Central shutdown coordinates multiple resource owners."), s("src/main/index.ts", "L5295-L5304", ["will-quit"], "Electron 退出事件承担最终清理防线。", "Electron quit events provide the final cleanup safety net.")],
      },
    ],
  }),

  "provider-bridges": page({
    slug: "provider-bridges", nav: l("Provider 适配", "Provider bridges"), kicker: l("第 07 课 · 进程与权限", "LESSON 07 · PROCESS & PRIVILEGE"),
    title: l("“支持 13 个 CLI”不是一个布尔值，而是一组能力矩阵", "Supporting 13 CLIs is not a boolean—it is a capability matrix"),
    summary: l("拆解 preset、bridge descriptor、启动参数、恢复语义与 hook 能力，理解统一界面下必须保留的差异。", "Decompose presets, bridge descriptors, arguments, resume semantics, and hook capabilities to see the differences hidden by a unified UI."),
    readTime: 16, phase: 1, lesson: 7, level: "深入", prerequisites: ["runtime"],
    keyQuestion: l("怎样统一多个 CLI，又不假装它们行为相同？", "How do you unify CLIs without pretending their behavior is identical?"),
    objectives: [l("读懂 AgentProviderPreset 的配置职责。", "Read AgentProviderPreset as behavior configuration."), l("比较 Claude 与 Codex 的恢复路径。", "Compare Claude and Codex resume paths.")],
    takeaways: [l("统一接口应公开能力差异，而不是吞掉差异。", "A unified interface should expose capability differences, not erase them.")],
    sections: [
      { id: "preset-contract", eyebrow: l("行为配置", "BEHAVIOR CONFIG"), title: l("Preset 把分支从编排器搬到数据，但没有消灭分支", "Presets move branches into data; they do not eliminate them"), lead: l("每个 provider 需要定义可执行命令、模型/权限参数、恢复方式、环境变量和可选 bridge。编排器仍要根据能力做条件路径。", "Each provider defines executable commands, model/permission flags, resume mode, environment, and optional bridges. The orchestrator still branches by capability."),
        layers: layer("像旅行转接头：外形统一不代表电压、协议和功能完全一样。", "Like travel adapters: a common shape does not imply identical voltage, protocol, or capability.", [l("UI 选择 provider id。", "UI selects a provider id."), l("providerPreset 解析静态能力。", "providerPreset resolves static capability."), l("spawnAgentCore 合并用户选择与 preset。", "spawnAgentCore combines user choices and preset."), l("bridgeOf 决定是否需要额外适配层。", "bridgeOf selects an optional adapter.")], [l("未知 provider 必须有显式 custom 路径或拒绝。", "Unknown providers need an explicit custom path or rejection."), l("不能向不支持的 CLI 注入假想参数。", "Do not inject imaginary flags into unsupported CLIs.")], "为什么 provider id 不能直接当可执行文件名？", "Why can’t provider id simply be the executable name?", "因为命令、参数、恢复子命令、环境和能力是独立维度，id 只是选择键。", "Because command, flags, resume subcommand, environment, and capability are independent dimensions; id is only a key."),
        sources: [s("src/shared/agentProvider.ts", "L24-L84", ["AgentProvider", "BridgeDescriptor", "AgentProviderPreset"], "类型把身份、bridge 与 preset 能力拆开。", "Types separate provider identity, bridge, and preset capability."), s("src/shared/agentProvider.ts", "L170-L270", ["AGENT_PROVIDER_PRESETS"], "Claude、Codex 等 preset 明确记录不同启动与恢复语义。", "Claude, Codex, and other presets encode distinct launch and resume semantics.")],
      },
      { id: "resume-semantics", eyebrow: l("恢复不是重启", "RESUME IS NOT RESTART"), title: l("同一个“继续会话”按钮背后有多种协议", "One Resume button hides several protocols"), lead: l("有的 CLI 用 flag 携带 session id，有的使用 resume 子命令，有的根本不可靠支持。恢复还依赖本地 provider 数据目录与正确的工作区。", "Some CLIs pass a session id flag, some use a resume subcommand, and some lack reliable support. Resume also depends on provider data and the right workspace."),
        bullets: [l("会话身份：内部 agent id 不等于 provider session id。", "Session identity: internal agent id is not provider session id."), l("命令形态：flag 与 subcommand 的 token 顺序不同。", "Command form: flags and subcommands have different token ordering."), l("数据归属：Codex 的 CODEX_HOME 等目录影响能否找到历史。", "Data ownership: directories such as CODEX_HOME affect discoverability."), l("失败语义：恢复失败应允许新会话、提示修复或中止，不能静默冒充成功。", "Failure semantics: resume failure should start fresh, guide repair, or abort—not silently claim success.")],
        sources: [s("src/main/index.ts", "L2772-L2850", ["resume", "resumeSubcommand"], "创建链按 provider 能力组装不同恢复命令。", "Launch assembly creates provider-specific resume commands."), s("src/main/index.ts", "L2450-L2505", ["CODEX_HOME"], "Codex 数据目录所有权被显式处理。", "Codex data-directory ownership is handled explicitly.")],
      },
      { id: "new-provider", eyebrow: l("扩展检查表", "EXTENSION CHECKLIST"), title: l("新增 Provider 要完成七项契约", "A new provider must satisfy seven contracts"), lead: l("真正完成支持，需要覆盖发现、启动、权限、模型、恢复、观测与清理；只把名字加进下拉框会产生半可用状态。", "Real support covers discovery, launch, permission, model, resume, observation, and cleanup. Adding a dropdown name creates a half-working state."),
        bullets: [l("可执行文件发现与版本探测。", "Executable discovery and version probing."), l("安全 tokenization 与参数顺序。", "Safe tokenization and argument order."), l("权限/approval 模式映射。", "Permission/approval mode mapping."), l("模型选择与默认值。", "Model selection and defaults."), l("session id 的捕获与恢复。", "Session-id capture and resume."), l("hook/status 能力与降级表现。", "Hook/status capability and degradation."), l("退出、升级与数据目录清理。", "Exit, upgrade, and data-directory cleanup.")],
        callout: { tone: "warning", text: l("能力矩阵中“未知”应呈现为未知，不能用统一 UI 制造已支持的错觉。", "Unknown capability must remain visibly unknown; a uniform UI must not fabricate support.") },
      },
    ],
  }),

  "prompt-io": page({
    slug: "prompt-io", nav: l("Prompt 输入与队列", "Prompt I/O"), kicker: l("第 09 课 · 进程与权限", "LESSON 09 · PROCESS & PRIVILEGE"),
    title: l("发送一句 Prompt，实际是在操纵一个有状态终端", "Sending a prompt means controlling a stateful terminal"),
    summary: l("从 composer、队列和 bracketed paste 追到 PTY 写入，解释为什么消息不能总是立即发送。", "Trace composer, queue, and bracketed paste into PTY writes, and see why messages cannot always be sent immediately."),
    readTime: 14, phase: 1, lesson: 9, level: "深入", prerequisites: ["pty"],
    keyQuestion: l("为什么 submitToPty 不能等价于 write(prompt + Enter)？", "Why isn’t submitToPty just write(prompt + Enter)?"),
    objectives: [l("区分直接发送、排队和 Hive 投递。", "Separate direct send, queueing, and Hive delivery."), l("理解终端焦点、paste 与 busy 状态。", "Understand terminal focus, paste semantics, and busy state.")],
    takeaways: [l("Prompt I/O 是有背压的协议，不是无状态文本框。", "Prompt I/O is a backpressured protocol, not a stateless textbox.")],
    sections: [
      { id: "input-path", eyebrow: l("输入链", "INPUT PATH"), title: l("用户文本先变成安全终端输入，再变成 CLI 行为", "User text becomes safe terminal input before CLI behavior"), lead: l("多行文本、控制字符和终端 paste mode 会改变输入解释。实现采用 bracketed paste，把一段 prompt 当作粘贴内容，最后再提交。", "Multiline text, control characters, and terminal paste mode change interpretation. Bracketed paste treats a prompt as one pasted unit before submission."),
        layers: layer("文本框交给的是一段意图；终端收到的却是一串控制序列和字节。中间必须有明确编码。", "The composer holds intent; the terminal receives control sequences and bytes. Encoding between them must be explicit.", [l("Composer 生成 prompt 与目标 agent。", "Composer produces prompt and target agent."), l("useHive 判断会话能否接收。", "useHive checks session readiness."), l("文本包装为 bracketed paste。", "Text is wrapped as bracketed paste."), l("Preload/Main 将字节写入对应 PTY。", "Preload/Main writes bytes to the selected PTY.")], [l("用户文本不得被当成 shell 命令重新拼接。", "User text must not be reassembled as a shell command."), l("写入目标必须绑定稳定 session，而非当前可见 tab 的偶然索引。", "The target must bind to a stable session, not an incidental visible-tab index.")], "bracketed paste 解决什么问题？", "What problem does bracketed paste solve?", "它告诉交互式 CLI 这是一整段粘贴文本，减少多行内容被逐行提前执行或被终端特殊处理的风险。", "It tells the interactive CLI that this is one paste, reducing premature per-line execution or terminal reinterpretation."),
        sources: [s("src/renderer/src/hooks/useHive.ts", "L124-L148", ["submitToPty", "bracketed paste"], "Renderer 明确包装 prompt 后再写入 PTY。", "Renderer explicitly wraps the prompt before PTY write.")],
      },
      { id: "backpressure", eyebrow: l("背压", "BACKPRESSURE"), title: l("Busy 状态把“立即发送”变成“排队等待安全窗口”", "Busy state turns immediate send into queueing for a safe window"), lead: l("当 CLI 正在工作或终端不在安全输入点，直接写入可能污染当前交互。消息队列将意图持久化，并在状态允许时按目标 drain。", "Writing while a CLI is busy or outside a safe prompt can corrupt interaction. The queue persists intent and drains by target when state permits."),
        bullets: [l("enqueue：保存消息、目标、顺序和可选上下文。", "Enqueue: store message, target, order, and optional context."), l("eligibility：用结构化状态判断是否可投递。", "Eligibility: use structured state to decide deliverability."), l("drain：一次提交一条，等待状态推进。", "Drain: submit one item and wait for state progress."), l("recovery：重载页面后队列仍可见，避免用户意图消失。", "Recovery: keep queued intent visible after reload.")],
        sources: [s("src/renderer/src/store/store.ts", "L351-L365", ["LS_QUEUES"], "队列有独立 localStorage key。", "Queues have a dedicated localStorage key."), s("src/renderer/src/store/store.ts", "L892-L932", ["enqueueMessage"], "store 维护目标队列与顺序。", "The store maintains target queues and ordering."), s("src/renderer/src/hooks/useHive.ts", "L641-L888", ["messageQueues", "dispatch"], "hook 根据会话状态驱动队列投递。", "The hook drains queues based on session state.")],
      },
      { id: "three-deliveries", eyebrow: l("三种投递", "THREE DELIVERY MODES"), title: l("直接 PTY、UI 队列与 Hive mailbox 解决不同问题", "Direct PTY, UI queues, and Hive mailboxes solve different problems"), lead: l("直接写 PTY 是本地用户到单会话；UI 队列处理 busy 背压；Hive mailbox 是 agent 间的持久协议事实。把三者混为一谈会造成重复、乱序或丢失。", "Direct PTY is local user-to-session; UI queues handle busy backpressure; Hive mailboxes are durable inter-agent protocol facts. Conflation creates duplicates, reordering, or loss."),
        callout: { tone: "insight", text: l("判断投递机制时先问：发送者是谁、目标是否在线、是否需要持久化、允许重复吗、谁负责确认？", "Choose delivery by asking: who sends, is the target online, must it persist, are duplicates allowed, and who acknowledges?") },
      },
    ],
  }),

  "hive-protocol": page({
    slug: "hive-protocol", nav: l("Hive 文件协议", "Hive file protocol"), kicker: l("第 11 课 · 多 Agent 协调", "LESSON 11 · MULTI-AGENT COORDINATION"),
    title: l("Hive 不是内存里的 Agent 列表，而是一套可检查的文件协议", "Hive is not an in-memory agent list—it is an inspectable file protocol"),
    summary: l("从身份注册、目录布局、原子写入与单一提交者理解 local-first 协调为什么选择文件作为协议介质。", "Use identity registration, directory layout, atomic writes, and a single committer to understand file-based local-first coordination."),
    readTime: 17, phase: 2, lesson: 11, level: "深入", prerequisites: ["hive"],
    keyQuestion: l("文件怎样从‘存储’升级为‘进程间协议’？", "How do files become an inter-process protocol rather than mere storage?"),
    objectives: [l("区分 registry、mailbox、task 与 session 事实。", "Separate registry, mailbox, task, and session facts."), l("理解原子写与单提交者约束。", "Understand atomic writes and the single-committer constraint.")],
    takeaways: [l("文件协议的优势是可见与可恢复，代价是并发语义必须自己定义。", "File protocols are inspectable and recoverable, but concurrency semantics are your responsibility.")],
    sections: [
      { id: "protocol-surface", eyebrow: l("协议面", "PROTOCOL SURFACE"), title: l("目录、文件名和 JSON 字段共同构成 API", "Directories, filenames, and JSON fields together form the API"), lead: l("Agent 不是通过共享对象协作，而是读写 hive 目录中的注册、任务、邮箱与会话事实。任何外部 CLI 只要获得工作区与协议说明，就能参与。", "Agents coordinate through registry, task, mailbox, and session facts in the hive directory rather than shared objects. Any CLI with workspace access and protocol instructions can participate."),
        layers: layer("像一间有收件箱、任务板和员工名册的办公室：员工不需要链接到同一内存，只需遵守同一套表单。", "Like an office with inboxes, task board, and roster: workers need not share memory if they follow the same forms.", [l("ensureAgent 分配稳定身份并创建目录。", "ensureAgent assigns stable identity and creates directories."), l("worker 在工作区中获得协议说明。", "Workers receive protocol instructions in their workspace."), l("router 轮询 outbox/消息事实。", "Router polls outbox/message facts."), l("结构化结果写回任务、邮箱与 session 记录。", "Structured results return to tasks, mailboxes, and session records.")], [l("身份必须稳定，显示名称不能作为唯一键。", "Identity must be stable; display name is not a unique key."), l("协议写入必须可被另一个进程完整读取，不能暴露半个 JSON。", "Writes must be fully readable by another process; half-written JSON is invalid protocol.")], "为什么文件协议特别适合管理外部 CLI？", "Why is a file protocol well suited to external CLIs?", "它不要求 CLI 链接应用 SDK；工作区、shell 与文件工具就是共同最小能力。", "It requires no linked app SDK; workspace, shell, and file tools are the common minimum capability."),
        sources: [s("src/main/hive.ts", "L611-L720", ["ensureAgent"], "身份与协议目录在 Agent 注册时建立。", "Identity and protocol directories are established during agent registration."), s("src/main/hive.ts", "L2616-L2741", ["protocol"], "Hive 向 worker 提供可执行的协作协议文本。", "Hive provides workers with executable collaboration protocol text.")],
      },
      { id: "atomicity", eyebrow: l("并发约束", "CONCURRENCY CONTRACT"), title: l("原子替换解决半写；它不自动解决业务冲突", "Atomic replacement prevents torn writes, not semantic conflicts"), lead: l("临时文件加 rename 能保证读者看到旧值或新值，但两个 writer 同时更新同一任务仍可能覆盖。系统进一步用集中 manager 和单一 Git 提交者降低冲突面。", "Temp-file plus rename lets readers see either old or new, but concurrent writers can still overwrite one another. A central manager and single Git committer reduce that conflict surface."),
        bullets: [l("物理原子性：不读到截断 JSON。", "Physical atomicity: never read truncated JSON."), l("逻辑串行性：同类更新经同一个 owner。", "Logical serialization: same-class updates pass one owner."), l("版本/条件更新：防止基于旧值覆盖新值。", "Version/conditional updates: prevent stale overwrite."), l("幂等：router 重试不能重复制造副作用。", "Idempotency: router retries must not duplicate side effects.")],
        sources: [s("src/main/hive.ts", "L2482-L2585", ["readJson", "commit"], "Hive 把写入完整性与 Git 提交串行化放在同一控制面。", "Hive centralizes write integrity and Git commit serialization.")],
      },
      { id: "protocol-evolution", eyebrow: l("演进", "EVOLUTION"), title: l("文件格式一旦被 Agent 读取，就已经是需要版本化的公共协议", "Once agents read a file format, it is a public protocol that needs versioning"), lead: l("字段重命名、目录移动或状态枚举变化都可能让正在运行的 CLI 继续按旧说明写入。安全演进需要 schema version、向后读取、迁移与未知字段容忍。", "Renamed fields, moved directories, or new status enums can leave running CLIs writing the old protocol. Safe evolution needs schema versions, backward reads, migration, and unknown-field tolerance."),
        callout: { tone: "warning", text: l("本地单机不等于没有并发：Electron Main、多个 CLI、文件 watcher 与 Git 同时触碰同一工作区。", "Local single-machine does not mean no concurrency: Main, multiple CLIs, watchers, and Git touch the same workspace.") },
      },
    ],
  }),

  "message-routing": page({
    slug: "message-routing", nav: l("消息路由", "Message routing"), kicker: l("第 12 课 · 多 Agent 协调", "LESSON 12 · MULTI-AGENT COORDINATION"),
    title: l("可靠投递不是“把文本塞进另一个终端”", "Reliable delivery is not pushing text into another terminal"),
    summary: l("拆开地址解析、mailbox 持久化、在线投递、终端接管和重试，读懂路由器的 at-least-once 倾向。", "Separate address resolution, mailbox persistence, online delivery, terminal handoff, and retry to understand the router’s at-least-once tendency."),
    readTime: 18, phase: 2, lesson: 12, level: "深入", prerequisites: ["hive-protocol"],
    keyQuestion: l("目标忙碌、离线或刚刚重启时，一条消息应该发生什么？", "What should happen when a target is busy, offline, or restarting?"),
    objectives: [l("画出 routeMessage 的分阶段语义。", "Draw routeMessage as staged semantics."), l("识别持久交付与即时注入的区别。", "Distinguish durable delivery from immediate injection.")],
    takeaways: [l("mailbox 记录事实，PTY 注入只是一次唤醒尝试。", "Mailbox records the fact; PTY injection is only a wake-up attempt.")],
    sections: [
      { id: "routing-stages", eyebrow: l("五段路由", "FIVE-STAGE ROUTING"), title: l("解析、记录、判定、注入、确认必须分开", "Resolution, recording, eligibility, injection, and acknowledgement must be separate"), lead: l("把路由写成一个 write 调用会丢失目标不存在、消息已记录但未唤醒、或注入后 CLI 未处理等中间状态。", "Reducing routing to one write loses intermediate states such as unknown target, durable-but-not-woken, or injected-but-unprocessed."),
        layers: layer("快递单不等于敲门：先确认地址并入库，再决定何时派送；无人开门也不能删除包裹记录。", "A shipping record is not the door knock: validate and store first, then attempt delivery without deleting the record when nobody answers.", [l("解析 recipient 与广播范围。", "Resolve recipient and broadcast scope."), l("生成消息 id 并写入目标 mailbox。", "Create message id and persist to target mailbox."), l("检查目标 session、busy 与 capability。", "Check target session, busy state, and capability."), l("选择终端 handoff 或等待下次 router tick。", "Choose terminal handoff or wait for a later router tick."), l("记录 routed/handled 进展，允许安全重试。", "Record routed/handled progress for safe retry.")], [l("先持久化，再尝试易失的终端注入。", "Persist before ephemeral terminal injection."), l("重试必须通过消息 id 去重。", "Retries require message-id deduplication."), l("广播要冻结收件人集合，避免成员变化导致不一致。", "Broadcast should snapshot recipients to avoid membership drift.")], "终端写入成功能否证明消息已处理？", "Does a successful terminal write prove handling?", "不能。它只证明字节进入 PTY；CLI 可能忙碌、拒绝输入、退出或尚未读取。", "No. It only proves bytes entered the PTY; the CLI may be busy, reject input, exit, or not read it yet."),
        sources: [s("src/main/hive.ts", "L1487-L1633", ["routeMessage"], "核心路由函数完成地址解析、协议写入与投递决策。", "Core routing performs address resolution, protocol writes, and delivery decisions."), s("src/main/hive.ts", "L1635-L1674", ["routeOnce", "startRouter"], "轮询器让未即时完成的消息继续推进。", "The polling router advances messages not completed immediately.")],
      },
      { id: "delivery-matrix", eyebrow: l("投递矩阵", "DELIVERY MATRIX"), title: l("在线性与忙碌度共同决定动作，不决定事实是否存在", "Online and busy state choose the action, not whether the fact exists"), lead: l("在线且空闲可尝试立即 handoff；在线但忙碌保留 mailbox 等待；离线同样保留；目标未知则应拒绝或进入死信，而不是无声丢弃。", "Online-idle can attempt handoff; online-busy and offline remain durable; unknown target should reject or dead-letter, never disappear silently."),
        bullets: [l("online + idle：记录后注入，并等待处理证据。", "Online + idle: persist, inject, await handling evidence."), l("online + busy：记录，稍后由状态变化/轮询触发。", "Online + busy: persist and trigger on state change/poll."), l("offline：记录但不声称 delivered。", "Offline: persist without claiming delivery."), l("unknown：显式错误，带 sender 可理解的原因。", "Unknown: explicit error with an actionable reason for sender.")],
      },
      { id: "handoff", eyebrow: l("安全注入", "SAFE HANDOFF"), title: l("terminal handoff 是受状态机约束的适配器", "Terminal handoff is an adapter constrained by a state machine"), lead: l("Renderer 的 useHive 在目标可接收时把消息转成 prompt。这个边界需要避免和用户队列同时写入、重复注入或在交互式确认阶段插入文本。", "Renderer useHive converts mail into a prompt only when the target can receive it. It must avoid racing user queues, duplicate injection, or writing during interactive approval."),
        sources: [s("src/renderer/src/hooks/useHive.ts", "L614-L720", ["terminal handoff"], "Renderer 负责把已路由事实安全转成终端输入。", "Renderer safely adapts routed facts into terminal input.")],
        callout: { tone: "insight", text: l("协议层的 delivered、终端层的 written、Agent 层的 handled 是三个不同状态。", "Protocol delivered, terminal written, and agent handled are three distinct states.") },
      },
    ],
  }),

  "safety-lifecycle": page({
    slug: "safety-lifecycle", nav: l("安全生命周期", "Safety lifecycle"), kicker: l("第 13 课 · 多 Agent 协调", "LESSON 13 · MULTI-AGENT COORDINATION"),
    title: l("自治系统最难的不是启动更多 Agent，而是知道何时停下来", "The hardest part of autonomy is not starting agents—it is knowing when to stop"),
    summary: l("把 circuit breaker、worker wake watchdog 与 Closing Time 组合成一套从异常检测到有序收尾的安全控制回路。", "Combine circuit breaker, worker-wake watchdog, and Closing Time into a safety loop from anomaly detection to orderly shutdown."),
    readTime: 18, phase: 2, lesson: 13, level: "深入", prerequisites: ["message-routing"],
    keyQuestion: l("无限循环、沉默 worker 与到时收尾分别由谁发现和处理？", "Who detects and handles loops, silent workers, and deadline shutdown?"),
    objectives: [l("区分三种安全控制器的信号和动作。", "Separate signals and actions of three safety controllers."), l("理解自动化安全需要可解释状态。", "Understand why automation safety needs explainable state.")],
    takeaways: [l("安全控制不是一个 stop 按钮，而是检测、限制、恢复与审计闭环。", "Safety is not one stop button; it is detection, limiting, recovery, and audit.")],
    sections: [
      { id: "three-controllers", eyebrow: l("三种失控", "THREE FAILURE MODES"), title: l("Breaker 管重复，watchdog 管沉默，Closing Time 管时间边界", "Breaker handles repetition, watchdog silence, and Closing Time deadlines"), lead: l("三者使用不同证据，不能合成一个模糊的 health flag：重复工具调用、worker 无唤醒与团队到期是不同故障。", "They use different evidence and must not collapse into one vague health flag: repeated tool calls, unwoken workers, and team deadlines are different failures."),
        layers: layer("像工厂安全：机器过载要熔断，值守人员失联要巡检，班次结束要按流程停线。", "Like factory safety: overload trips a breaker, missing operators trigger checks, and shift end runs a shutdown procedure.", [l("事件流进入对应控制器。", "Events feed the relevant controller."), l("控制器维护窗口、阈值或 deadline。", "Controllers maintain windows, thresholds, or deadlines."), l("命中条件后产生结构化状态与动作。", "Matched conditions produce structured state and action."), l("UI 和日志展示原因、计数与恢复路径。", "UI and logs expose reason, count, and recovery path.")], [l("安全动作必须说明触发证据。", "Safety actions must explain their evidence."), l("恢复/重置需要显式条件，不能自动抹掉事故。", "Recovery/reset needs explicit conditions and must not erase incidents.")], "为什么不能只靠用户观察终端发现死循环？", "Why not rely on users watching terminals for loops?", "多 Agent 会后台并发运行；人工观察既不及时也无法形成一致阈值、自动限制与审计记录。", "Concurrent background agents make observation late and inconsistent; it cannot provide thresholds, automatic limits, or audit records."),
        sources: [s("src/main/breaker.ts", "L111-L345", ["CircuitBreaker"], "Breaker 基于事件窗口计算重复与失控条件。", "CircuitBreaker evaluates repetition and runaway conditions over event windows."), s("src/main/workerWake.ts", "L1-L137", ["WorkerWakeWatchdog"], "watchdog 检查 worker 启动后的唤醒证据。", "The watchdog checks wake evidence after worker launch."), s("src/main/closingTime.ts", "L53-L230", ["ClosingTimeController"], "Closing Time 用 deadline 与消息进展推动有序收尾。", "Closing Time drives orderly shutdown through deadline and routing progress.")],
      },
      { id: "breaker-state", eyebrow: l("熔断状态机", "BREAKER STATE"), title: l("Open 之后最重要的是：什么被阻止，怎样恢复", "After Open, define what is blocked and how recovery works"), lead: l("熔断器必须明确作用域：阻止某个 agent、某类动作还是整个 Hive？同时需要 cooldown、人工 reset 或健康探测等恢复语义。", "A breaker needs scope: one agent, one action class, or the whole Hive? Recovery also needs cooldown, manual reset, or health probes."),
        bullets: [l("Closed：记录事件，正常放行。", "Closed: record events and allow work."), l("Open：拒绝匹配范围的新动作，并保留原因。", "Open: reject new matching actions and preserve reason."), l("Half-open/试探：若支持，应只放行受限探测。", "Half-open/probe: if supported, allow only bounded probes."), l("Reset：清除限制不等于删除历史证据。", "Reset: lifting restriction does not delete history.")],
      },
      { id: "closing-time", eyebrow: l("团队收尾", "TEAM SHUTDOWN"), title: l("Closing Time 是协议阶段，不是 kill all", "Closing Time is a protocol phase, not kill-all"), lead: l("到期后先通知停止接新任务、等待在途消息和任务落稳，再升级为强制终止。这样保留可恢复事实，也减少半完成 Git/文件操作。", "At deadline, stop accepting new tasks, wait for in-flight mail and task stabilization, then escalate to termination. This preserves recoverable facts and reduces half-finished Git/file work."),
        callout: { tone: "warning", text: l("任何自治超时都应同时定义软截止、硬截止、在途工作策略和最终报告。", "Every autonomy timeout needs soft deadline, hard deadline, in-flight policy, and final report.") },
      },
    ],
  }),

  "persistence-authority": page({
    slug: "persistence-authority", nav: l("权威源与恢复", "Authority & recovery"), kicker: l("第 15 课 · 状态与工作区", "LESSON 15 · STATE & WORKSPACE"),
    title: l("真正的状态设计问题不是“存哪里”，而是“冲突时听谁的”", "The real state question is not where it is stored, but who wins a conflict"),
    summary: l("用 authority、durability、scope 与 recovery 四个维度拆解 localStorage、config、SQLite、Hive 文件和进程内状态。", "Analyze localStorage, config, SQLite, Hive files, and in-memory state through authority, durability, scope, and recovery."),
    readTime: 18, phase: 3, lesson: 15, level: "深入", prerequisites: ["state"],
    keyQuestion: l("页面 cache、SQLite 与文件记录不一致时，哪个值覆盖哪个？", "When UI cache, SQLite, and files disagree, which value wins?"),
    objectives: [l("为状态写出 authority matrix。", "Write an authority matrix for state."), l("设计冷启动与崩溃恢复顺序。", "Design cold-start and crash-recovery order.")],
    takeaways: [l("每个事实要有一个权威 owner，其他副本必须声明是 cache、mirror 或 index。", "Each fact needs one authoritative owner; all copies must declare cache, mirror, or index status.")],
    sections: [
      { id: "four-dimensions", eyebrow: l("四维判断", "FOUR DIMENSIONS"), title: l("先判断 scope 与 authority，再选择存储", "Determine scope and authority before choosing storage"), lead: l("一个字段是否持久化只是第四个问题。更早的问题是它属于组件、窗口、用户还是工作区，谁可以修改，以及需要从何恢复。", "Persistence is only the fourth question. First determine whether data belongs to component, window, user, or workspace; who may modify it; and how it recovers."),
        layers: layer("像财务账：便签、报表缓存和总账都可能出现同一个数字，但只有总账能裁决。", "Like accounting: notes, cached reports, and ledger may show the same number, but only the ledger adjudicates.", [l("定义 scope：session/user/workspace/hive。", "Define scope: session/user/workspace/hive."), l("指定 authority owner 与写入口。", "Assign authority owner and write entry point."), l("给副本标注 cache/mirror/index。", "Label copies as cache/mirror/index."), l("规定启动水合、冲突裁决与损坏恢复。", "Specify hydration, conflict resolution, and corruption recovery.")], [l("两个可独立写入的‘权威副本’意味着没有权威。", "Two independently writable authorities mean no authority."), l("恢复不能仅依赖 UI 曾经写过 localStorage。", "Recovery cannot rely solely on UI having written localStorage.")], "主题偏好适合 localStorage，任务状态为什么不适合？", "Why is localStorage suitable for theme but not task state?", "主题是单用户 UI 偏好；任务是跨进程协作事实，需要 Main/Hive 控制并可被 worker 与恢复流程读取。", "Theme is a single-user UI preference; tasks are cross-process facts controlled by Main/Hive and needed by workers and recovery."),
        sources: [s("src/main/db.ts", "L49-L98", ["MIGRATIONS", "PersistStore"], "SQLite 提供受迁移管理的持久索引。", "SQLite provides migration-managed persistence."), s("src/renderer/src/store/store.ts", "L351-L455", ["localStorage"], "Renderer cache 与偏好存在浏览器侧。", "Renderer caches and preferences live browser-side."), s("src/main/roster.ts", "L83-L150", ["RosterStore"], "Roster 体现结构化 store 与文件 mirror 的并存。", "Roster shows a structured store alongside a file mirror.")],
      },
      { id: "startup-reconcile", eyebrow: l("冷启动", "COLD START"), title: l("启动水合是一场有顺序的 reconciliation", "Hydration is ordered reconciliation"), lead: l("Main 先读取 config/DB/协议文件建立可用事实；Renderer 再加载自己的偏好与 cache；随后通过 IPC snapshot 校正陈旧副本。顺序反过来会闪现或复活旧状态。", "Main first reads config/DB/protocol files, Renderer loads preferences/cache, then IPC snapshots correct stale copies. Reversing the order causes flicker or resurrected state."),
        bullets: [l("默认值只在‘不存在’时填充，不能覆盖已损坏但可诊断的数据。", "Defaults fill absence; they should not overwrite diagnosable corruption."), l("schema migration 在业务读取前完成。", "Schema migration precedes business reads."), l("UI cache 显示后要接受权威 snapshot 校正。", "UI cache must accept correction from the authoritative snapshot."), l("孤儿 session/进程需要重启时 reconciliation。", "Orphan sessions/processes need restart reconciliation.")],
      },
      { id: "failure-table", eyebrow: l("恢复表", "RECOVERY TABLE"), title: l("为每个 store 写下：丢了、旧了、坏了分别怎么办", "For every store, define missing, stale, and corrupt behavior"), lead: l("localStorage 可清空重建；config 损坏通常要保留备份并回退；SQLite 需要迁移/完整性策略；Hive 文件需要原子写、版本与协议级恢复。", "localStorage can be rebuilt; corrupt config needs backup/fallback; SQLite needs migration/integrity policy; Hive files need atomic write, versioning, and protocol recovery."),
        callout: { tone: "insight", text: l("‘可以重新生成’要写出从哪个权威源生成，否则只是愿望。", "‘Can be regenerated’ must name the authority used for regeneration, or it is only a wish.") },
      },
    ],
  }),

  "git-workspaces": page({
    slug: "git-workspaces", nav: l("Git 工作区隔离", "Git workspace isolation"), kicker: l("第 16 课 · 状态与工作区", "LESSON 16 · STATE & WORKSPACE"),
    title: l("多 Agent 隔离的核心不是多开终端，而是让写入边界可控", "Multi-agent isolation is not multiple terminals—it is controlled write boundaries"),
    summary: l("沿 root、worktree/clone、branch、cwd 与 Git 提交追踪 worker 的真实隔离程度，并审视失败时共享 cwd 的降级风险。", "Trace roots, worktrees/clones, branches, cwd, and Git commits to evaluate worker isolation and the risk of shared-cwd fallback."),
    readTime: 18, phase: 3, lesson: 16, level: "深入", prerequisites: ["persistence-authority"],
    keyQuestion: l("两个 Agent 不互相覆盖代码，需要同时隔离哪些东西？", "What must be isolated so two agents do not overwrite each other?"),
    objectives: [l("区分进程、文件、Git ref 与 provider 数据隔离。", "Separate process, file, Git-ref, and provider-data isolation."), l("评估 best-effort fallback。", "Evaluate best-effort fallback behavior.")],
    takeaways: [l("隔离是多维契约；不同 cwd 只解决其中一维。", "Isolation is multidimensional; separate cwd solves only one dimension.")],
    sections: [
      { id: "isolation-stack", eyebrow: l("四重隔离", "FOUR-FOLD ISOLATION"), title: l("Process、workspace、Git ref、provider home 必须分别审计", "Audit process, workspace, Git ref, and provider home separately"), lead: l("PTY session 让进程独立；worktree/clone 让文件视图独立；branch 让提交历史独立；provider home 决定 session、credential 与缓存是否串线。", "PTY sessions isolate processes; worktrees/clones isolate file views; branches isolate commit histories; provider homes determine whether sessions, credentials, and caches collide."),
        layers: layer("给每个工人一张桌子还不够：还要有独立文件夹、工作单号和工具柜。", "A separate desk is not enough; each worker also needs its own folder, job number, and tool cabinet.", [l("为 agent 选择 isolation mode。", "Choose an isolation mode for the agent."), l("创建 worktree/clone 与 branch。", "Create worktree/clone and branch."), l("将 PTY cwd 和环境绑定到该根目录。", "Bind PTY cwd and environment to that root."), l("提交/合并经集中策略串行化。", "Serialize commit/merge through a central policy.")], [l("显示的路径必须等于 PTY 真正 cwd。", "Displayed path must equal the PTY’s actual cwd."), l("fallback 不能静默降低隔离级别。", "Fallback must not silently weaken isolation."), l("删除工作区前确认没有活跃进程。", "Confirm no active process before workspace removal.")], "独立 branch 但共享 cwd 是否安全？", "Is a separate branch safe with a shared cwd?", "不安全。Git 工作树一次只能体现一个检出状态，进程仍会修改同一批文件。", "No. A worktree presents one checked-out state, and processes still modify the same files."),
        sources: [s("src/main/index.ts", "L2537-L2670", ["spawnAgentCore", "isolation"], "创建链决定工作区模式并把结果用于 Agent 启动。", "Launch chooses workspace mode and uses it for agent startup."), s("src/main/index.ts", "L2631-L2667", ["isolate", "addWorktree"], "隔离失败存在共享 cwd 的降级路径。", "Isolation failure can fall back to a shared cwd.")],
      },
      { id: "git-owner", eyebrow: l("提交所有权", "COMMIT OWNERSHIP"), title: l("多个 worker 可以改文件，但提交和整合最好有单一协调者", "Many workers may edit files, but commit and integration benefit from one coordinator"), lead: l("集中提交者可以统一作者信息、commit message、冲突处理与任务关联，避免多个 CLI 同时移动 Git HEAD 或操作 index。", "A central committer standardizes author, message, conflict handling, and task linkage while preventing multiple CLIs from racing HEAD or index."),
        bullets: [l("写文件权限与写 Git metadata 权限分离。", "Separate file-write permission from Git-metadata permission."), l("每次提交关联 agent/task/session。", "Associate commits with agent/task/session."), l("整合前验证工作区干净度与目标 branch。", "Verify workspace cleanliness and target branch before integration."), l("冲突是显式任务状态，不是被重试吞掉的异常。", "Conflicts are explicit task state, not exceptions hidden by retry.")],
        sources: [s("src/main/hive.ts", "L2482-L2585", ["single committer"], "Hive 通过单一提交路径降低 Git 并发风险。", "Hive reduces Git concurrency risk through a single commit path.")],
      },
      { id: "enterprise-default", eyebrow: l("策略判断", "POLICY JUDGMENT"), title: l("个人工具可以 best effort，企业控制面通常需要 fail closed", "Personal tools may use best effort; enterprise control planes often need fail closed"), lead: l("共享 cwd fallback 提高创建成功率，却可能破坏用户对隔离的假设。高风险仓库应拒绝启动、明确解释失败，并提供修复动作。", "Shared-cwd fallback improves launch success but can violate the user’s isolation assumption. High-risk repositories should refuse launch, explain failure, and offer repair."),
        callout: { tone: "warning", text: l("隔离模式必须成为 UI 可见、可审计的事实；不能只存在于创建日志中。", "Isolation mode must be a visible, auditable UI fact, not merely a launch log detail.") },
      },
    ],
  }),

  "memory-knowledge": page({
    slug: "memory-knowledge", nav: l("Memory 与知识", "Memory & knowledge"), kicker: l("第 17 课 · 状态与工作区", "LESSON 17 · STATE & WORKSPACE"),
    title: l("Memory、Knowledge 与 Memory Graph 是三件不同的事", "Memory, Knowledge, and the Memory Graph are three different things"),
    summary: l("区分可选的 mempalace 后端、知识管理器与客户端主题图，避免把可视化推导当成持久记忆权威。", "Separate the optional mempalace backend, knowledge manager, and client-derived topic graph so visualization is not mistaken for memory authority."),
    readTime: 15, phase: 3, lesson: 17, level: "深入", prerequisites: ["git-workspaces"],
    keyQuestion: l("界面看到一张“记忆图”，是否意味着系统已经拥有统一长期记忆？", "Does a visible memory graph imply unified long-term memory?"),
    objectives: [l("区分三个模块的数据来源和降级语义。", "Separate sources and degradation semantics of three modules."), l("判断图谱节点是事实还是派生视图。", "Determine whether graph nodes are facts or derived views.")],
    takeaways: [l("派生图可以重新计算；长期记忆必须有明确后端、写入和检索语义。", "A derived graph can be recomputed; long-term memory needs explicit backend, write, and retrieval semantics.")],
    sections: [
      { id: "three-concepts", eyebrow: l("概念拆分", "CONCEPT SPLIT"), title: l("相似名称掩盖了完全不同的生命周期", "Similar names hide different lifecycles"), lead: l("MemoryManager 管外部可选后端与采集循环；KnowledgeManager 管知识内容；Renderer 的 graph 从当前可见材料提取主题并布局。三者不能互相证明存在。", "MemoryManager owns an optional backend and mining loop; KnowledgeManager owns knowledge content; Renderer graph extracts and lays out topics from visible material. None proves the others exist."),
        layers: layer("档案库、知识手册和关系图不是同一个系统：图能从手册重画，档案库则保存可检索历史。", "An archive, handbook, and relationship map differ: maps can be redrawn from content, while archives retain retrievable history.", [l("MemoryManager 解析 backend 路径并尝试启动。", "MemoryManager resolves and starts a backend."), l("缺少 mempalace 时进入可用降级。", "Missing mempalace produces usable degradation."), l("KnowledgeManager 维护知识内容入口。", "KnowledgeManager maintains knowledge-content access."), l("extractTopics/buildGraph 在客户端生成展示图。", "extractTopics/buildGraph derives the display graph client-side.")], [l("可选后端失败不能让核心 Agent runtime 失败。", "Optional backend failure must not sink core runtime."), l("派生图不得反向覆盖原始知识。", "Derived graphs must not overwrite original knowledge."), l("UI 必须标出数据新鲜度和来源。", "UI should expose data source and freshness.")], "为什么 graph 节点不是天然的长期记忆？", "Why isn’t a graph node automatically long-term memory?", "它可能只是对当前文本的即时主题提取，没有稳定 id、写入协议、检索保证或跨会话持久化。", "It may be an immediate topic extraction without stable identity, write protocol, retrieval guarantees, or cross-session durability."),
        sources: [s("src/main/memory.ts", "L7-L12", ["mempalace", "Degrades"], "源码明确 mempalace 是可选能力并支持降级。", "Source explicitly marks mempalace optional and degradable."), s("src/main/memory.ts", "L113-L240", ["MemoryManager"], "MemoryManager 管路径、环境、进程和采集循环。", "MemoryManager owns path, environment, process, and mining loop."), s("src/main/knowledge.ts", "L52-L122", ["KnowledgeManager"], "知识内容由独立 manager 管理。", "Knowledge content has a separate manager.")],
      },
      { id: "derived-graph", eyebrow: l("派生视图", "DERIVED VIEW"), title: l("主题提取和图布局是解释层，不是数据层", "Topic extraction and graph layout are interpretation, not authority"), lead: l("extractTopics 从文本得到候选主题，buildGraph 再构造节点和边。参数、分词或输入变化都可能改变结果，因此应允许重算，并保留回到原文的路径。", "extractTopics derives candidate topics and buildGraph constructs nodes and edges. Input or algorithm changes alter results, so it must be recomputable and traceable to source."),
        sources: [s("src/renderer/src/components/memoryGraph/extractTopics.ts", "L78-L103", ["extractTopics"], "主题由客户端算法提取。", "Topics are extracted by a client-side algorithm."), s("src/renderer/src/components/memoryGraph/buildGraph.ts", "L88-L188", ["buildGraph", "topic layer"], "图节点和关系是派生布局。", "Graph nodes and relations are derived layout."), s("src/renderer/src/components/MemoryGraphPanel.tsx", "L23-L220", ["MemoryGraphPanel"], "面板消费派生图并提供交互。", "The panel consumes the derived graph for interaction.")],
      },
      { id: "design-memory", eyebrow: l("设计检查表", "DESIGN CHECKLIST"), title: l("要声称“长期记忆”，至少回答六个问题", "A long-term-memory claim must answer six questions"), lead: l("谁写、写什么粒度、如何去重、如何检索、如何遗忘、如何让用户删除或导出。没有这些契约，memory 只是功能名称。", "Who writes, at what granularity, how to deduplicate, retrieve, forget, delete, and export. Without these contracts, memory is only a feature name."),
        callout: { tone: "insight", text: l("最诚实的 UI 会区分：后端不可用、尚无数据、数据陈旧和算法没有提取到主题。", "An honest UI distinguishes backend unavailable, no data yet, stale data, and no topics extracted.") },
      },
    ],
  }),

  observability: page({
    slug: "observability", nav: l("实时与可观测性", "Realtime & observability"), kicker: l("第 20 课 · 界面与系统边缘", "LESSON 20 · INTERFACE & PERIMETER"),
    title: l("可观测性不是把所有数据发出去，而是让关键事实可解释", "Observability is not exporting everything—it is making critical facts explainable"),
    summary: l("比较 loopback telemetry、PostHog analytics、Realtime ephemeral token 与公网 webhook，建立数据边界和隐私判断。", "Compare loopback telemetry, PostHog analytics, realtime ephemeral tokens, and public webhooks to build a data-boundary and privacy model."),
    readTime: 17, phase: 4, lesson: 20, level: "深入", prerequisites: ["integrations"],
    keyQuestion: l("日志、产品分析、实时语音和 webhook 各自把什么数据送到哪里？", "What data do logs, analytics, realtime voice, and webhooks send where?"),
    objectives: [l("画出四类网络边界。", "Draw four network boundaries."), l("审查 credential 生命周期与最小数据原则。", "Audit credential lifecycle and data minimization.")],
    takeaways: [l("先按目的和信任边界分类，再谈统一 telemetry。", "Classify by purpose and trust boundary before unifying telemetry.")],
    sections: [
      { id: "four-boundaries", eyebrow: l("四种边界", "FOUR BOUNDARIES"), title: l("Loopback、厂商 SaaS、临时直连与公网入口不能混称“网络模块”", "Loopback, vendor SaaS, ephemeral direct connections, and public ingress are not one ‘network module’"), lead: l("它们的攻击面、数据接收者、credential 与撤销方式完全不同。审计时应为每条路径单独写数据流。", "Their attack surfaces, recipients, credentials, and revocation differ. Audit each as a separate data flow."),
        layers: layer("办公室内线、寄给统计公司的报表、一次性访客证和面向街道的收货口，都在‘通信’，但信任完全不同。", "An office intercom, vendor report, one-time visitor badge, and street-facing loading dock all communicate but have different trust.", [l("确定入口/出口与绑定地址。", "Identify ingress/egress and bind address."), l("列出 payload 中的用户、源码与 credential 数据。", "List user, source, and credential data in payloads."), l("确定认证、有效期与撤销。", "Determine auth, lifetime, and revocation."), l("记录失败时是否降级、重试或阻塞主流程。", "Record whether failure degrades, retries, or blocks core flow.")], [l("长期 provider key 不应进入 Renderer。", "Long-lived provider keys must not enter Renderer."), l("loopback 仍要校验 peer/secret，不能假定本机所有进程可信。", "Loopback still needs peer/secret validation; not every local process is trusted."), l("analytics 不应意外包含 prompt、源码或路径。", "Analytics must not accidentally include prompts, source, or paths.")], "为什么 ephemeral token 比把 API key 给 Renderer 更安全？", "Why is an ephemeral token safer than exposing an API key to Renderer?", "它权限和寿命受限，即使渲染层被读取，泄漏窗口与影响范围也更小。", "It has bounded privilege and lifetime, reducing the leakage window and impact if Renderer is inspected."),
        sources: [s("src/main/realtime.ts", "L2-L70", ["mint"], "Main 用长期凭据换取短期 Realtime secret。", "Main exchanges long-lived credentials for a short-lived realtime secret."), s("src/renderer/src/realtime/session.ts", "L297-L390", ["ephemeral token", "ephemeral client secret"], "Renderer 只消费临时 secret 建立会话。", "Renderer consumes only the ephemeral secret to connect."), s("src/main/telemetry.ts", "L7-L175", ["TelemetryCollector", "loopback"], "内部 telemetry server 明确绑定本机边界。", "Internal telemetry server explicitly uses a loopback boundary.")],
      },
      { id: "analytics-privacy", eyebrow: l("产品分析", "PRODUCT ANALYTICS"), title: l("事件名很小，context 可能很大：隐私审计要看最终 payload", "Event names are small; context can be huge—inspect the final payload"), lead: l("PostHog 初始化与事件包装应检查 opt-in/out、distinct id、属性白名单和错误对象序列化。不能因为事件名是 button_clicked 就假定没有敏感数据。", "Inspect opt-in/out, distinct id, property allowlists, and error serialization around PostHog. A button_clicked event name does not guarantee a harmless payload."),
        bullets: [l("默认最小：只收产品决策真正需要的字段。", "Minimal by default: collect only fields needed for product decisions."), l("明确关闭：用户关闭后停止新事件并处理缓存。", "Explicit off: stop new events and handle buffered data."), l("错误脱敏：路径、命令参数、prompt 与 token 不进入异常属性。", "Error redaction: exclude paths, command args, prompts, and tokens."), l("文档一致：代码事件与隐私声明同步。", "Documentation parity: code events and privacy statement stay aligned.")],
        sources: [s("src/main/analytics.ts", "L2-L11", ["Product analytics", "TELEMETRY.md"], "模块头部声明隐私设计边界。", "The module header states privacy design boundaries."), s("src/main/analytics.ts", "L181-L235", ["PostHog", "init"], "分析客户端由 Main 侧初始化。", "The analytics client initializes in Main.")],
      },
      { id: "public-ingress", eyebrow: l("公网入口", "PUBLIC INGRESS"), title: l("Webhook 一旦通过 tunnel 暴露，local-first 就不再等于 local-only", "Once tunneled, a webhook means local-first is no longer local-only"), lead: l("公开入口必须校验 secret、限制 payload、处理重放与速率，并把外部请求转换成受限内部命令。不能让请求体直接成为 shell 或 prompt。", "Public ingress requires secrets, payload limits, replay/rate controls, and translation into narrow internal commands. Request bodies must never become raw shell or prompt input."),
        sources: [s("src/main/webhook.ts", "L2-L18", ["secret-gated", "public"], "源码明确区分公开 tunnel 与 secret gate。", "Source explicitly describes public tunneling and secret gating."), s("src/main/webhook.ts", "L143-L190", ["WebhookServer", "tunnel URL"], "server 负责入口生命周期与公开地址。", "The server owns ingress lifecycle and public URL."), s("src/main/slack.ts", "L429-L475", ["isLoopback", "remoteAddress"], "Slack 本地入口也执行绑定与 peer 校验。", "Even Slack loopback ingress validates binding and peer.")],
        callout: { tone: "warning", text: l("任何外部触发器都应映射为 allowlist 动作，而不是通用‘执行这段文本’。", "Every external trigger should map to allowlisted actions, never a generic ‘execute this text’ primitive.") },
      },
    ],
  }),

  "extension-guide": page({
    slug: "extension-guide", nav: l("二次开发手册", "Extension playbook"), kicker: l("第 23 课 · 实战与验证", "LESSON 23 · PRACTICE & VALIDATION"),
    title: l("不要从“改哪个文件”开始：用六步闭环扩展系统", "Do not start with which file to edit—extend the system through a six-step loop"),
    summary: l("以新增 provider、IPC 能力和持久状态为例，把需求翻译成所有权、契约、状态、失败、可观测与验证。", "Use a provider, IPC capability, and persistent state to translate requirements into ownership, contract, state, failure, observability, and verification."),
    readTime: 20, phase: 5, lesson: 23, level: "实战", prerequisites: ["architecture-lab"],
    keyQuestion: l("怎样避免一个小功能横穿 Main、Preload、Renderer 后留下隐性债务？", "How do you avoid hidden debt when a small feature crosses Main, Preload, and Renderer?"),
    objectives: [l("使用六步扩展模板。", "Use the six-step extension template."), l("完成三类常见变更的影响分析。", "Analyze impact for three common change types.")],
    takeaways: [l("先画责任和状态流，再写接口与实现，最后用失败场景验证。", "Draw ownership and state flow first, implement contracts second, verify failures last.")],
    sections: [
      { id: "six-steps", eyebrow: l("通用闭环", "GENERAL LOOP"), title: l("Owner → Contract → State → Failure → Observe → Verify", "Owner → Contract → State → Failure → Observe → Verify"), lead: l("这六步覆盖一个跨进程功能从设计到可维护的最小闭环。跳过其中任何一步，通常会在重启、异常或二次修改时还债。", "These six steps form the minimum maintainable loop for a cross-process feature. Skipping one usually creates debt at restart, failure, or the next change."),
        layers: layer("像修建一条管线：先确定谁管理，再规定接头、流体储存、泄漏处理、仪表和压力测试。", "Like building a pipeline: define operator, interfaces, storage, leak handling, gauges, and pressure tests.", [l("Owner：副作用最终归 Main manager、Renderer 还是外部 CLI？", "Owner: does the side effect belong to Main manager, Renderer, or external CLI?"), l("Contract：IPC/type/schema 是否最小且可验证？", "Contract: is IPC/type/schema minimal and validated?"), l("State：权威源、cache、迁移和恢复是什么？", "State: what are authority, cache, migration, and recovery?"), l("Failure：超时、取消、重试、清理与降级是什么？", "Failure: timeout, cancellation, retry, cleanup, and degradation?"), l("Observe：用户与日志如何知道进展和原因？", "Observe: how do user and logs see progress and cause?"), l("Verify：单测、构建、桌面交互与平台差异怎样覆盖？", "Verify: how do tests, build, desktop interaction, and platform differences cover it?")], [l("所有资源创建都有对应释放。", "Every resource creation has a release."), l("所有跨界输入都在权威进程校验。", "Every cross-boundary input is validated in the authoritative process."), l("所有持久 schema 变化都有版本策略。", "Every persistent schema change has a version strategy.")], "为什么先加 Renderer 按钮容易制造假进度？", "Why does starting with a Renderer button create false progress?", "界面能点不代表权限、失败、恢复和清理已定义；最难的契约被推迟了。", "A clickable UI does not define privilege, failure, recovery, or cleanup; the hard contracts are deferred."),
      },
      { id: "provider-change", eyebrow: l("场景 A", "SCENARIO A"), title: l("新增 Provider：先做能力矩阵，再接创建链", "New provider: capability matrix before launch wiring"), lead: l("定义 provider id/preset、命令发现、参数 tokenization、权限/模型、resume、hook/status、数据目录和退出语义。然后再让 UI 只展示真实支持项。", "Define id/preset, discovery, tokenization, permission/model, resume, hook/status, data directory, and exit semantics. Then expose only real capabilities in UI."),
        bullets: [l("Shared：AgentProvider 类型与 preset。", "Shared: AgentProvider type and preset."), l("Main：spawnAgentCore、环境、恢复与错误归一。", "Main: spawnAgentCore, environment, resume, error normalization."), l("Renderer：能力驱动的表单与状态提示。", "Renderer: capability-driven form and status messaging."), l("验证：空格路径、多行 prompt、缺少 CLI、旧版本、恢复失败、Windows。", "Verify: spaced paths, multiline prompt, missing/old CLI, resume failure, and Windows.")],
        sources: [s("src/shared/agentProvider.ts", "L53-L270", ["AgentProviderPreset", "AGENT_PROVIDER_PRESETS"], "Provider 扩展的共享契约入口。", "Shared contract entry for provider extension."), s("src/main/index.ts", "L2537-L2941", ["spawnAgentCore"], "实际创建、恢复与结果归一的主编排器。", "Main orchestration for creation, resume, and result normalization.")],
      },
      { id: "ipc-state-change", eyebrow: l("场景 B / C", "SCENARIO B / C"), title: l("新增 IPC 或持久字段：契约必须在三层同时闭合", "New IPC or durable field must close the contract across three layers"), lead: l("Preload 类型、exposed API、Main handler、Renderer 调用只是最短链；还要补输入校验、权限、错误类型、事件回流、迁移、重启水合与删除语义。", "Preload types, exposed API, Main handler, and Renderer call are only the shortest path. Add input validation, privilege, typed errors, event return, migration, hydration, and deletion semantics."),
        bullets: [l("IPC request/response 使用可序列化 DTO，避免泄漏 Electron/Node 对象。", "Use serializable DTOs; never leak Electron/Node objects."), l("Main 重新校验路径、id 与枚举，不信任 Renderer。", "Main revalidates paths, ids, and enums; Renderer is untrusted."), l("若操作长时运行，返回 operation id 并发事件，不让一个 invoke 无限等待。", "For long operations, return an operation id and emit events instead of one unbounded invoke."), l("持久字段增加 migration、默认策略、导入导出与降级读取。", "Durable fields require migration, defaults, import/export, and degraded reads.")],
        callout: { tone: "insight", text: l("完成标准不是“Happy path 能跑”，而是“重启后仍正确、失败后可解释、取消后无孤儿资源”。", "Done means correct after restart, explainable after failure, and orphan-free after cancellation—not merely a working happy path.") },
      },
    ],
  }),

  "architecture-lab": page({
    slug: "architecture-lab", nav: l("架构实验室", "Architecture lab"), kicker: l("第 22 课 · 实战与验证", "LESSON 22 · PRACTICE & VALIDATION"),
    title: l("亲手改变条件，观察架构选择如何改变调用链", "Change conditions and watch architectural choices reshape the trace"),
    summary: l("三个可交互实验覆盖 Agent 创建、消息路由与状态权威。每次选择都会给出路径、失败面与源码入口。", "Three interactive experiments cover agent launch, message routing, and state authority, revealing path, failure surface, and source entry."),
    readTime: 16, phase: 5, lesson: 22, level: "实战", prerequisites: ["call-flows"],
    keyQuestion: l("如果一个条件变化，哪一层应该改变，哪一层必须保持不变？", "When one condition changes, which layer should change and which invariant must hold?"),
    objectives: [l("通过情景选择验证心智模型。", "Validate the mental model through scenarios."), l("从结果反推 owner 与 invariant。", "Infer owners and invariants from outcomes.")],
    takeaways: [l("架构理解应能预测分支，而不仅是复述当前实现。", "Architecture understanding should predict branches, not merely retell implementation.")],
    sections: [],
  }),
  "self-check": page({
    slug: "self-check", nav: l("理解度自测", "Knowledge check"), kicker: l("第 24 课 · 实战与验证", "LESSON 24 · PRACTICE & VALIDATION"),
    title: l("不是考文件名：检验你能否做架构判断", "Not a filename quiz—test your architectural judgment"),
    summary: l("15 道情境题即时解释为什么，并把错误答案送回对应课程。完成后得到分层能力诊断。", "Fifteen scenario questions explain why, link misconceptions to lessons, and produce a layered skill diagnosis."),
    readTime: 12, phase: 5, lesson: 24, level: "实战", prerequisites: ["extension-guide"],
    keyQuestion: l("你能否在新情境里正确选择 owner、边界与恢复策略？", "Can you choose the right owner, boundary, and recovery strategy in a new scenario?"),
    objectives: [l("验证核心概念而非记忆。", "Validate concepts rather than recall."), l("定位需要回看的课程。", "Locate lessons worth revisiting.")],
    takeaways: [l("能解释错误选项为什么错，才算真正掌握。", "Mastery means explaining why the wrong options fail.")],
    sections: [],
  }),
  glossary: page({
    slug: "glossary", nav: l("术语与概念关系", "Glossary"), kicker: l("第 26 课 · 实战与验证", "LESSON 26 · PRACTICE & VALIDATION"),
    title: l("不是名词表：从术语跳回责任、关系与源码", "Not a word list: connect terms to responsibility, relations, and source"),
    summary: l("按架构层筛选 48 个核心术语；每个术语包含浅白定义、最容易混淆的概念和继续阅读入口。", "Filter 48 core terms by layer; each includes a plain definition, common confusion, and follow-up lesson."),
    readTime: 18, phase: 5, lesson: 26, level: "实战", prerequisites: ["source-map"],
    keyQuestion: l("同一个词在产品界面、源码和架构讨论中是否指同一件事？", "Does one term mean the same thing in UI, source, and architecture discussion?"),
    objectives: [l("统一课程术语。", "Unify course vocabulary."), l("快速修复概念混淆。", "Repair conceptual confusion quickly.")],
    takeaways: [l("术语只有放回 owner、数据流与生命周期才有意义。", "Terms matter only when placed back into owner, data flow, and lifecycle.")],
    sections: [],
  }),
};

export const lessonSupplements: Record<string, Section[]> = {
  architecture: [{ id: "ownership-test", eyebrow: l("迁移能力", "TRANSFER TEST"), title: l("遇到新需求，用所有权测试把它放回正确层", "Place new requirements with an ownership test"), lead: l("不要凭目录命名决定位置。问它需要什么权限、谁负责失败与清理、事实由谁裁决，再决定落在 Renderer、Main、外部 CLI 还是协议文件。", "Do not choose by directory name. Ask which privilege it needs, who handles failure/cleanup, and who adjudicates its facts before placing it in Renderer, Main, external CLI, or protocol files."), layers: layer("一个‘自动整理代码’按钮横跨四层：按钮在体验层，授权和编排在控制层，CLI 在执行层，任务与结果在事实层。", "An ‘organize code’ button spans four layers: UI in experience, authorization/orchestration in control, CLI in execution, and tasks/results in facts.", [l("圈出最终副作用：改文件、启进程还是发网络请求。", "Circle the final side effect: file, process, or network."), l("把副作用 owner 放在 Main manager 或外部 CLI。", "Place its owner in a Main manager or external CLI."), l("定义最小 IPC/协议契约。", "Define a minimal IPC/protocol contract."), l("让 Renderer 只投影进展、错误和结果。", "Let Renderer project progress, errors, and result.")], [l("权限不随 UI 便利性下沉。", "Privilege never moves downward for UI convenience."), l("每条创建链都有反向清理链。", "Every creation trace has a reverse cleanup trace.")], "‘搜索历史命令’的查询逻辑应放在哪里？", "Where should command-history search logic live?", "查询和持久 authority 在 Main/PersistStore；Renderer 只提交 query 并展示 DTO 结果。", "Query and persistence authority live in Main/PersistStore; Renderer submits a query and renders DTOs.") }],
  electron: [{ id: "capability-design", eyebrow: l("设计练习", "DESIGN EXERCISE"), title: l("把“给 Renderer 一个能力”改写成最小契约", "Rewrite ‘give Renderer access’ as a minimal contract"), lead: l("好的 Preload API 以用户意图命名，参数窄、结果可序列化、错误可分类；Main 对路径、id 与枚举重新校验。", "A good Preload API names user intent, narrows arguments, returns serializable results, and classifies errors; Main revalidates paths, ids, and enums."), layers: layer("暴露 openProject(projectId) 比暴露 readFile(path) 更容易守住项目边界。", "Exposing openProject(projectId) protects project boundaries better than readFile(path).", [l("用例声明需要的最小动作。", "Declare the minimal use-case action."), l("设计 request/response DTO 与错误码。", "Design request/response DTOs and error codes."), l("Preload 只桥接这一能力。", "Bridge only that capability in Preload."), l("Main 解析 id、检查 scope，再调用 owner。", "Main resolves ids, validates scope, then calls the owner.")], [l("不暴露原始 ipcRenderer。", "Never expose raw ipcRenderer."), l("不让 Renderer 传任意 shell 命令。", "Never let Renderer pass arbitrary shell commands.")], "为什么 TypeScript interface 不能替代 Main 校验？", "Why can’t a TypeScript interface replace Main validation?", "运行时消息可以被构造或来自过期页面；类型在编译后不执行安全检查。", "Runtime messages can be forged or stale; types do not enforce security after compilation.") }],
  runtime: [{ id: "launch-failure-matrix", eyebrow: l("失败推导", "FAILURE REASONING"), title: l("创建链要按阶段提交，否则会留下半个 Agent", "Stage launch commits or leave half an agent behind"), lead: l("工作区、provider 命令、PTY、roster 与 UI session 任一步都可能失败。为每一阶段写出已创建资源、补偿动作和用户可见错误。", "Workspace, provider command, PTY, roster, and UI session can each fail. For every stage list created resources, compensation, and visible error."), layers: layer("像办理入住：房间没准备好就不能发房卡；发了房卡后失败则必须注销记录。", "Like check-in: do not issue a key before the room is ready; if a later step fails, revoke the record.", [l("校验 provider 与项目输入，不产生副作用。", "Validate provider/project input without side effects."), l("创建隔离工作区，失败则停止。", "Create isolated workspace; stop on failure."), l("创建 PTY，失败则清理工作区。", "Create PTY; clean workspace on failure."), l("注册 roster/session；失败则终止进程并清理。", "Register roster/session; on failure kill process and clean up.")], [l("UI 只在 owner 返回稳定 id 后宣布成功。", "UI announces success only after owner returns a stable id."), l("补偿操作幂等。", "Compensating actions are idempotent.")], "PTY 已创建但 roster 写入失败，应该怎样？", "PTY exists but roster registration fails—what now?", "终止 PTY 进程树、回收临时工作区并返回阶段化错误，不能留下 UI 看不到的 worker。", "Kill the PTY tree, reclaim temporary workspace, and return a staged error; never leave an invisible worker.") }],
  pty: [{ id: "pty-invariants", eyebrow: l("生命周期不变量", "LIFECYCLE INVARIANTS"), title: l("用三个 id 和一条回收链证明没有孤儿进程", "Use three identities and one cleanup chain to prove no orphan remains"), lead: l("Agent id、内部 PTY session id 与 OS pid 用途不同。任何关闭入口都应先解析到唯一 session，再对其进程树执行幂等回收并广播最终状态。", "Agent id, internal PTY session id, and OS pid serve different purposes. Every close path must resolve one session, idempotently reap its process tree, and publish final state."), layers: layer("关掉屏幕不等于关掉机器；删掉 UI tab 也不等于终止 CLI。", "Turning off a display does not power off the machine; removing a UI tab does not terminate the CLI.", [l("稳定映射 agent → session → pid/tree。", "Maintain stable agent → session → pid/tree mapping."), l("先标记 closing，拒绝新写入。", "Mark closing and reject new writes."), l("关闭 PTY 并回收后代进程。", "Close PTY and reap descendants."), l("移除映射，发送 exit/final state。", "Remove mappings and emit exit/final state.")], [l("同一 session 的 close 可重复调用。", "Close may be called repeatedly for one session."), l("退出事件只广播一次最终语义。", "Exit events publish one final semantic outcome.")], "只收到 shell exit 事件，为什么仍要清理映射？", "Why clean mappings even after shell exit?", "进程退出不会自动删除应用内 session、listener、buffer 与 roster 关联。", "Process exit does not remove app session, listeners, buffers, or roster links.") }],
  hive: [{ id: "coordination-model", eyebrow: l("一致性模型", "CONSISTENCY MODEL"), title: l("Hive 接受短暂不一致，但必须最终收敛且可解释", "Hive accepts temporary inconsistency but must converge explainably"), lead: l("文件轮询、多个进程与终端 handoff 意味着 UI、mailbox 和 Agent 认知可能短暂不同。设计重点不是假装同步，而是定义状态推进、重试和最终证据。", "Polling, multiple processes, and terminal handoff mean UI, mailbox, and agent knowledge may briefly diverge. Define progress, retry, and final evidence instead of pretending synchrony."), layers: layer("任务板、收件箱和员工口头确认不会同一毫秒更新；系统要保证它们最终对上账。", "Task board, inbox, and verbal acknowledgement do not update in the same millisecond; the system must eventually reconcile them.", [l("每个事实有稳定 id 与单调状态。", "Every fact has stable identity and monotonic state."), l("router 可重试未终结状态。", "Router retries nonterminal states."), l("Agent 处理结果写回结构化事实。", "Agent results return as structured facts."), l("UI 从事实 snapshot/event 校正。", "UI reconciles from fact snapshots/events.")], [l("状态不能从 handled 退回 pending。", "State cannot regress from handled to pending."), l("重试不能新建不同消息 id。", "Retry must not invent a new message id.")], "为什么 polling 不是这里最大的架构问题？", "Why isn’t polling the largest architectural problem here?", "频率只影响延迟；真正风险是没有稳定身份、幂等、单调状态和冲突裁决。", "Frequency affects latency; the deeper risks are missing identity, idempotency, monotonic state, and conflict rules.") }],
  state: [{ id: "authority-workbook", eyebrow: l("状态工作表", "STATE WORKSHEET"), title: l("为任何新字段先填六格，再决定 schema", "Fill six cells for every new field before choosing a schema"), lead: l("字段名、scope、authority、写入者、副本、恢复/删除共同定义状态契约。只写一个 Zustand slice 或 DB column 还没有完成设计。", "Name, scope, authority, writers, copies, and recovery/deletion define a state contract. A Zustand slice or DB column alone is not a design."), layers: layer("‘selectedAgentId’可能只是当前窗口选择；‘agentStatus’却是跨进程事实。名字相似，生命周期完全不同。", "selectedAgentId may be one-window UI selection; agentStatus is a cross-process fact. Similar names, different lifecycles.", [l("定义 scope 与生命周期终点。", "Define scope and lifecycle end."), l("指定唯一 authority owner。", "Assign one authoritative owner."), l("列出所有 writer 与 cache/mirror。", "List all writers and caches/mirrors."), l("定义启动、冲突、损坏、删除和导出。", "Define startup, conflict, corruption, deletion, and export.")], [l("没有恢复来源就不要称为 cache。", "Do not call it a cache without a recovery source."), l("删除必须传播到所有派生副本。", "Deletion propagates to all derived copies.")], "窗口布局和任务状态能否共用同一持久策略？", "Can window layout and task state share one persistence policy?", "通常不能：前者是 UI 偏好，后者是跨 Agent 协作事实，scope、authority 和恢复要求不同。", "Usually not: one is UI preference, the other cross-agent fact; scope, authority, and recovery differ.") }],
  renderer: [{ id: "projection-loop", eyebrow: l("投影闭环", "PROJECTION LOOP"), title: l("状态进入 UI 前要标明：快照、事件、乐观值还是派生值", "Label UI state as snapshot, event, optimistic, or derived"), lead: l("同一组件可能同时显示 Main snapshot、hook event 和本地交互。若没有来源标签与 reconciliation，旧 event 或乐观值会覆盖更权威的新事实。", "A component may combine Main snapshots, hook events, and local interaction. Without provenance and reconciliation, stale events or optimistic values can overwrite newer authority."), layers: layer("UI 像仪表盘：读数来自传感器，按钮发出意图，但仪表盘不应偷偷改写发动机事实。", "UI is a dashboard: readings come from sensors and buttons express intent, but the dashboard must not rewrite engine facts.", [l("snapshot 建立基线与版本。", "Snapshot establishes baseline and version."), l("event 只推进匹配实体的更新。", "Events advance matching entities."), l("optimistic 值带 operation id 和回滚。", "Optimistic values carry operation id and rollback."), l("derived selector 从权威 cache 重算。", "Derived selectors recompute from authoritative cache.")], [l("旧 event 不覆盖更高版本 snapshot。", "Stale events do not overwrite a newer snapshot."), l("组件卸载不影响业务操作 owner。", "Component unmount does not own business-operation lifecycle.")], "Pixi 中的 worker 动画能否作为 Agent busy 权威？", "Can a Pixi worker animation be busy-state authority?", "不能；动画应由 hook/PTY/Hive 的结构化状态派生，最多是展示 cache。", "No; animation derives from structured hook/PTY/Hive state and is at most a display cache.") }],
  integrations: [{ id: "trust-review", eyebrow: l("边界审计", "BOUNDARY REVIEW"), title: l("为每个集成画五列：入口、认证、权限、数据、撤销", "Audit every integration across ingress, auth, privilege, data, and revocation"), lead: l("GitHub CLI、Slack loopback、公开 webhook 和 Realtime 会话使用不同信任模型。统一到一个“integration manager”不会消除这些差异。", "GitHub CLI, Slack loopback, public webhooks, and realtime sessions use different trust models. One integration manager does not erase them."), layers: layer("门禁卡、客服电话和快递口都连接外部，但不能共用一把万能钥匙。", "Badge reader, support phone, and loading dock all connect outside but cannot share one master key.", [l("确定请求从哪里进入或数据向哪里出去。", "Locate ingress or egress."), l("定义身份、secret/token 寿命与 scope。", "Define identity, secret/token lifetime, and scope."), l("把请求映射到 allowlist 内部动作。", "Map requests to allowlisted internal actions."), l("记录数据最小化、错误、撤销与停服。", "Record minimization, failure, revocation, and shutdown.")], [l("外部文本不直接成为 shell/prompt。", "External text never becomes raw shell/prompt."), l("长期 credential 不跨到低信任层。", "Long-lived credentials do not cross into lower-trust layers.")], "loopback server 是否可以不认证？", "Can a loopback server omit authentication?", "不应默认如此；同机其他进程仍可访问，应结合随机 secret、peer 校验与最小 action。", "Not by default; other local processes can connect, so use random secrets, peer validation, and narrow actions.") }],
  conclusions: [{ id: "decision-record", eyebrow: l("最终能力", "FINAL SKILL"), title: l("把结论写成决策记录，而不是优缺点清单", "Write conclusions as decision records, not pro/con lists"), lead: l("每个判断要包含场景、目标、选择、收益、代价、失败边界、替代方案与复审触发器。这样结论才能迁移到你的项目。", "Each judgment needs context, goal, choice, benefit, cost, failure boundary, alternatives, and review trigger so it transfers to your project."), layers: layer("‘文件协议简单’不是结论；‘在 local-first、外部 CLI 无 SDK 的前提下，文件协议用并发复杂度换来可检查与零集成成本’才是。", "‘Files are simple’ is not a conclusion; ‘for local-first external CLIs without an SDK, files trade concurrency complexity for inspectability and zero integration cost’ is.", [l("写出当时场景与硬约束。", "State context and hard constraints."), l("解释选择解决了什么。", "Explain what the choice solves."), l("列出新增风险与缓解。", "List introduced risks and mitigations."), l("定义规模/合规/平台变化时的复审条件。", "Define review triggers for scale, compliance, or platform change.")], [l("评价不脱离产品场景。", "Evaluation stays tied to product context."), l("替代方案用同一目标比较。", "Alternatives are compared against the same goal.")], "何时应把 Hive 文件 router 换成数据库队列？", "When should Hive’s file router become a database queue?", "当多机、强事务、查询/审计、吞吐或 exactly-once 需求超过文件协议收益时；不是因为‘数据库更高级’。", "When multi-machine, transaction, query/audit, throughput, or exactly-once needs outweigh file benefits—not because databases are ‘more advanced.’") }],
};

export type GlossaryTerm = {
  term: string;
  layer: "experience" | "control" | "execution" | "facts" | "coordination" | "safety";
  definition: Localized;
  contrast: Localized;
  href: string;
};

const term = (termName: string, layerName: GlossaryTerm["layer"], zh: string, en: string, contrastZh: string, contrastEn: string, href: string): GlossaryTerm => ({
  term: termName, layer: layerName, definition: l(zh, en), contrast: l(contrastZh, contrastEn), href,
});

export const glossaryTerms: GlossaryTerm[] = [
  term("Renderer", "experience", "Electron 中运行 React 界面的低权限进程。", "Low-privilege Electron process running the React UI.", "不是 Main，也不应直接拥有文件和进程权限。", "Not Main; it should not directly own file or process privilege.", "/electron"),
  term("Zustand", "experience", "Renderer 内的交互状态容器。", "Interaction-state container inside Renderer.", "它可以缓存事实，但不自动成为业务权威。", "It may cache facts but is not automatically business authority.", "/renderer"),
  term("xterm", "experience", "把 PTY 字节流呈现为交互终端的前端组件。", "Frontend terminal that presents PTY byte streams.", "xterm 是视图，node-pty 才拥有 OS 终端会话。", "xterm is a view; node-pty owns the OS terminal session.", "/pty"),
  term("Pixi", "experience", "用于 Office 世界可视化的 2D 渲染层。", "2D rendering layer used by the Office world.", "动画状态是运行事实的投影，不是调度器。", "Animation is a projection of runtime facts, not the scheduler.", "/renderer"),
  term("Optimistic UI", "experience", "在权威操作完成前先展示预期结果的交互策略。", "Showing expected results before authoritative work completes.", "需要失败回滚，不能伪造成最终事实。", "Needs failure rollback and must not impersonate final fact.", "/renderer"),
  term("Hydration", "experience", "页面启动时把持久或主进程事实装入 UI 状态。", "Loading durable or Main-owned facts into UI state at startup.", "不是简单读取 localStorage，而是有顺序的校正。", "Not merely reading localStorage; it is ordered reconciliation.", "/persistence-authority"),
  term("Context bridge", "control", "Preload 向 Renderer 暴露白名单能力的 Electron 机制。", "Electron mechanism for exposing allowlisted capabilities from Preload.", "不是把 ipcRenderer 或 Node 全量交给页面。", "Not exposing all of ipcRenderer or Node to the page.", "/electron"),
  term("IPC", "control", "Renderer/Preload 与 Main 之间的序列化消息边界。", "Serialized message boundary between Renderer/Preload and Main.", "不是普通函数调用；输入需要重新校验。", "Not a normal function call; inputs require revalidation.", "/electron"),
  term("Main process", "control", "拥有 OS 进程、文件、Git、数据库和网络权限的控制面。", "Control plane owning OS process, file, Git, DB, and network privilege.", "不负责模型推理，也不应承担所有 UI 细节。", "Does not own model inference or every UI detail.", "/architecture"),
  term("Manager", "control", "集中拥有一类资源与生命周期的 Main 侧对象。", "Main-side object that centrally owns one resource class and lifecycle.", "有方法不等于 owner；关键是创建、清理和不变量。", "Methods alone do not imply ownership; creation, cleanup, and invariants do.", "/boot-chain"),
  term("Composition root", "control", "创建 manager 并连接依赖的启动装配位置。", "Startup location that creates managers and wires dependencies.", "它编排依赖，不应吸收全部业务实现。", "It wires dependencies; it should not absorb all business logic.", "/boot-chain"),
  term("Capability API", "control", "按具体意图暴露的最小跨进程能力集合。", "Minimal cross-process API organized by concrete intent.", "优于暴露通用 shell、任意路径或原始 IPC。", "Safer than exposing generic shell, arbitrary paths, or raw IPC.", "/electron"),
  term("Provider", "execution", "被 Munder 管理的外部 CLI 类型，如 Claude Code 或 Codex。", "External CLI type managed by Munder, such as Claude Code or Codex.", "不是底层 LLM API provider 的同义词。", "Not synonymous with the underlying LLM API provider.", "/provider-bridges"),
  term("Provider preset", "execution", "描述某 CLI 命令、参数、恢复和能力的数据配置。", "Configuration describing a CLI command, flags, resume, and capabilities.", "统一了选择入口，但保留行为差异。", "Unifies selection while preserving behavioral differences.", "/provider-bridges"),
  term("Bridge", "execution", "把某 provider 的事件或协议适配到统一控制面的可选层。", "Optional layer adapting provider events or protocol to the control plane.", "不是每个 CLI 都有同等 bridge/hook 能力。", "Not every CLI has equivalent bridge/hook capability.", "/provider-bridges"),
  term("PTY", "execution", "带终端语义的伪终端会话，承载交互式 CLI。", "Pseudo-terminal session carrying an interactive CLI.", "不同于仅捕获 stdout 的普通 child_process。", "Unlike a simple child_process that merely captures stdout.", "/pty"),
  term("Session", "execution", "一次受管理的 PTY/CLI 运行实例及其映射。", "One managed PTY/CLI runtime instance and its mapping.", "内部 session、agent identity 与 provider session id 不等价。", "Internal session, agent identity, and provider session id differ.", "/runtime"),
  term("Resume", "execution", "用 provider 的历史身份继续既有 CLI 会话。", "Continuing a prior CLI session using provider history identity.", "不是仅用相同 prompt 重新启动。", "Not merely restarting with the same prompt.", "/provider-bridges"),
  term("Bracketed paste", "execution", "用控制序列把多行文本标为一次粘贴。", "Control-sequence protocol marking multiline text as one paste.", "减少逐行提前执行，不代表目标一定接受输入。", "Reduces premature line execution but does not guarantee acceptance.", "/prompt-io"),
  term("Process tree", "execution", "CLI 及其派生子进程形成的操作系统资源树。", "OS resource tree formed by a CLI and its descendants.", "关闭 PTY 前端不一定回收全部后代。", "Closing the PTY frontend may not reap all descendants.", "/pty"),
  term("Authority", "facts", "冲突时有权决定某类事实最终值的 owner/store。", "Owner/store that decides the final value of a fact during conflict.", "存得更久或副本更多都不代表更权威。", "Longer retention or more copies do not imply authority.", "/persistence-authority"),
  term("Cache", "facts", "可从权威源重建、用于性能或体验的副本。", "Rebuildable copy used for performance or UX.", "若无法说明重建来源，它可能不是 cache。", "If no rebuild source exists, it may not be a cache.", "/persistence-authority"),
  term("Mirror", "facts", "为兼容或可检查性同步出的事实副本。", "Synchronized fact copy for compatibility or inspectability.", "需要明确写方向与冲突裁决。", "Needs explicit write direction and conflict resolution.", "/state"),
  term("Index", "facts", "从原始事实派生、用于检索的结构。", "Structure derived from source facts for retrieval.", "索引损坏应可重建，不应反向改原始事实。", "A corrupt index should be rebuildable and never rewrite source facts.", "/memory-knowledge"),
  term("SQLite migration", "facts", "按版本演进数据库 schema 与数据的受控步骤。", "Controlled, versioned evolution of database schema and data.", "默认字段不是迁移旧数据的完整替代。", "Defaults are not a complete migration for old data.", "/persistence-authority"),
  term("Config", "facts", "面向用户/应用设置的持久配置文件。", "Durable configuration for user/application settings.", "不适合承载高频并发协议更新。", "Not suited for high-frequency concurrent protocol updates.", "/state"),
  term("localStorage", "facts", "Renderer 浏览器上下文中的键值持久化。", "Key-value persistence in Renderer browser context.", "适合偏好和可重建 cache，不适合作为跨进程任务权威。", "Good for preferences and rebuildable caches, not cross-process task authority.", "/persistence-authority"),
  term("Atomic write", "facts", "先写临时文件再替换，避免读到半个文件。", "Write-temp-then-replace pattern preventing torn reads.", "它不自动防止两个完整写入互相覆盖。", "It does not prevent two complete writes from overwriting each other.", "/hive-protocol"),
  term("Reconciliation", "facts", "比较多个现实来源并恢复成一致状态的过程。", "Process of comparing realities and restoring consistent state.", "不同于无条件让最后加载的副本覆盖全部。", "Not blindly letting the last-loaded copy overwrite everything.", "/persistence-authority"),
  term("Derived view", "facts", "由原始数据计算出的可重建展示或索引。", "Rebuildable presentation or index computed from source data.", "Memory Graph 是派生视图，不天然是长期记忆。", "The Memory Graph is derived, not automatically long-term memory.", "/memory-knowledge"),
  term("Hive", "coordination", "用文件协议、router、任务和 mailbox 协调多个真实 Agent 的子系统。", "Subsystem coordinating real agents through files, router, tasks, and mailboxes.", "不是 LLM 推理 runtime，也不是单个共享聊天。", "Not an LLM runtime or one shared chat.", "/hive"),
  term("God agent", "coordination", "拥有更高协调职责的主 Agent 角色。", "Lead-agent role with higher coordination responsibility.", "角色权力来自协议和控制面，不来自不同模型本质。", "Its authority comes from protocol/control, not a fundamentally different model.", "/hive"),
  term("Worker", "coordination", "在隔离工作区执行任务的受管理 CLI Agent。", "Managed CLI agent executing tasks in an isolated workspace.", "进程在线不等于已经唤醒或正在处理任务。", "A live process is not necessarily awake or handling work.", "/safety-lifecycle"),
  term("Roster", "coordination", "记录 Agent 身份、角色与运行关联的名册。", "Roster recording agent identity, role, and runtime links.", "显示名称不能替代稳定 id。", "Display name cannot replace a stable id.", "/hive-protocol"),
  term("Mailbox", "coordination", "Agent 间持久消息事实的收件结构。", "Inbox structure for durable inter-agent message facts.", "不同于一次易失的 PTY 写入。", "Different from one ephemeral PTY write.", "/message-routing"),
  term("Router", "coordination", "推进待投递消息并选择安全交付路径的控制器。", "Controller advancing pending mail and choosing a safe delivery path.", "轮询频率不等于 delivered/handled 语义。", "Polling frequency is not delivery/handling semantics.", "/message-routing"),
  term("Task", "coordination", "带身份、状态、归属与结果的协作工作单元。", "Coordination work unit with identity, state, ownership, and result.", "不是 UI Kanban 卡片本身；卡片是其投影。", "Not the Kanban card itself; the card is a projection.", "/hive"),
  term("Handoff", "coordination", "把已路由消息适配成目标 CLI 可消费的终端输入。", "Adapting routed mail into terminal input consumable by target CLI.", "written 不等于 handled。", "Written does not mean handled.", "/message-routing"),
  term("At-least-once", "coordination", "允许重试导致重复、依靠 idempotency 去重的投递倾向。", "Delivery tendency that retries may duplicate and relies on idempotency.", "不等于 exactly-once；后者通常需要更强事务。", "Not exactly-once, which usually needs stronger transactions.", "/message-routing"),
  term("Worktree", "coordination", "同一 Git 仓库的独立工作树与检出状态。", "Independent work tree and checkout for one Git repository.", "它隔离文件视图，但不自动隔离 provider 数据或进程。", "It isolates file view, not provider data or processes.", "/git-workspaces"),
  term("Circuit breaker", "safety", "根据事件窗口阻止重复或失控行为的控制器。", "Controller blocking repetitive or runaway behavior based on event windows.", "不是通用进程崩溃检测器。", "Not a generic process crash detector.", "/safety-lifecycle"),
  term("Watchdog", "safety", "等待期望进展，超时后发出诊断或动作的监视器。", "Monitor awaiting expected progress and acting on timeout.", "进程存在只是一种信号，不等于业务健康。", "Process existence is only one signal, not business health.", "/safety-lifecycle"),
  term("Closing Time", "safety", "在 deadline 后推动团队停止接活、收敛并退出的协议阶段。", "Protocol phase that stops new work, converges, and exits after deadline.", "不是立即 kill all。", "Not immediate kill-all.", "/safety-lifecycle"),
  term("Fail closed", "safety", "安全条件不满足时拒绝继续，而不是降低保护。", "Refuse to proceed when safety conditions fail instead of weakening protection.", "与 best-effort fallback 的可用性取舍相反。", "Trades availability differently from best-effort fallback.", "/git-workspaces"),
  term("Idempotency", "safety", "同一操作重复执行不会制造额外副作用的性质。", "Property that repeated execution creates no extra side effect.", "不是‘通常不会重复’，而是有稳定 key 与处理记录。", "Not ‘usually no duplicate’; it needs stable keys and processing records.", "/message-routing"),
  term("Ephemeral token", "safety", "寿命和权限受限、给低信任边界使用的临时凭据。", "Short-lived, scope-limited credential for a lower-trust boundary.", "不能与长期 provider API key 等同。", "Not equivalent to a long-lived provider API key.", "/observability"),
  term("Loopback", "safety", "只绑定本机网络接口的服务边界。", "Service boundary bound only to local network interfaces.", "本机进程仍可能恶意，需 peer/secret 校验。", "Local processes may still be hostile; validate peer/secret.", "/observability"),
  term("Secret gating", "safety", "只有持有 secret 的请求才能进入某个入口。", "Requiring a secret before accepting an ingress request.", "还需要限流、重放防护和 payload 校验。", "Still needs rate limit, replay defense, and payload validation.", "/observability"),
];

export type QuizQuestion = {
  id: string;
  phase: number;
  prompt: Localized;
  options: Localized[];
  answer: number;
  explanation: Localized;
  href: string;
};

const q = (id: string, phase: number, zh: string, en: string, options: [string, string][], answer: number, explainZh: string, explainEn: string, href: string): QuizQuestion => ({
  id, phase, prompt: l(zh, en), options: options.map(([ozh, oen]) => l(ozh, oen)), answer, explanation: l(explainZh, explainEn), href,
});

export const quizQuestions: QuizQuestion[] = [
  q("owner", 0, "用户点击“创建 Agent”后，谁应拥有最终进程创建与清理？", "Who owns final process creation and cleanup after Create Agent?", [["Renderer 组件", "Renderer component"], ["Electron Main", "Electron Main"], ["Zustand store", "Zustand store"]], 1, "Main 拥有 OS 权限与应用生命周期；Renderer 只表达意图。", "Main owns OS privilege and app lifecycle; Renderer expresses intent.", "/electron"),
  q("runtime", 0, "Munder Difflin 与 Claude Code/Codex 的核心边界是什么？", "What is the core boundary with Claude Code/Codex?", [["Munder 实现模型推理，它们只画 UI", "Munder infers; they draw UI"], ["双方共享同一 agent loop", "They share one agent loop"], ["外部 CLI 拥有推理循环，Munder 管进程与协作生命周期", "CLIs own inference; Munder owns process and coordination lifecycle"]], 2, "这是整套架构的第一性边界。", "This is the primary architectural boundary.", "/architecture"),
  q("ipc", 1, "Renderer 传入一个路径给 Main 时，Main 最安全的做法是？", "When Renderer sends a path to Main, what is safest?", [["相信 TypeScript 类型", "Trust TypeScript"], ["在 Main 重新解析、校验范围和权限", "Re-resolve and validate scope/permission in Main"], ["把 fs 暴露给 Renderer", "Expose fs to Renderer"]], 1, "跨 IPC 后类型不再是安全边界，权威进程必须校验。", "Types are not a security boundary across IPC; the authoritative process validates.", "/electron"),
  q("boot", 1, "退出链为什么通常先停 router/timer，再销毁其消费者？", "Why stop routers/timers before destroying consumers?", [["减少 CSS 重绘", "Reduce CSS repaint"], ["避免新回调落到已销毁资源", "Prevent new callbacks into destroyed resources"], ["让 app.quit 更快返回字符串", "Make app.quit return a string faster"]], 1, "先停生产者再停消费者，是资源清理的基本顺序。", "Stop producers before consumers is a core cleanup ordering rule.", "/boot-chain"),
  q("provider", 1, "统一 Provider UI 时，哪项设计最正确？", "Which design is best for a unified Provider UI?", [["所有 CLI 强制相同 resume flag", "Force one resume flag"], ["用能力矩阵驱动可用控件与分支", "Drive controls and branches from a capability matrix"], ["隐藏所有不支持状态", "Hide unsupported states"]], 1, "统一界面应呈现真实能力，而不是制造行为一致的假象。", "A unified UI should present real capabilities, not fake equivalence.", "/provider-bridges"),
  q("pty", 1, "关闭 xterm tab 后，为什么仍要检查进程树？", "Why inspect the process tree after closing an xterm tab?", [["xterm 只是视图，CLI 及子进程可能仍活着", "xterm is only a view; CLI descendants may remain"], ["为了保存主题", "To save theme"], ["因为 Git branch 会消失", "Because the Git branch disappears"]], 0, "终端视图、PTY session 与 OS process tree 是不同生命周期。", "Terminal view, PTY session, and OS process tree have distinct lifecycles.", "/pty"),
  q("queue", 1, "目标 CLI busy 时，用户消息最合理的处理是？", "When a target CLI is busy, what should happen to user intent?", [["无声丢弃", "Drop silently"], ["立即注入当前确认提示", "Inject into current approval prompt"], ["持久排队，待安全状态再 drain", "Persist and drain at a safe state"]], 2, "队列提供背压与恢复，不污染当前交互。", "Queueing provides backpressure and recovery without corrupting interaction.", "/prompt-io"),
  q("mail", 2, "PTY write 返回成功，消息状态最多能更新为什么？", "A successful PTY write proves at most what?", [["Agent 已理解", "Agent understood"], ["字节已写入终端", "Bytes were written to the terminal"], ["任务已完成", "Task completed"]], 1, "written、delivered、handled 必须分开。", "Written, delivered, and handled are distinct.", "/message-routing"),
  q("atomic", 2, "临时文件 + rename 能解决什么？", "What does temp-file + rename solve?", [["所有业务冲突", "All semantic conflicts"], ["半写/截断读取", "Torn/truncated reads"], ["Exactly-once 投递", "Exactly-once delivery"]], 1, "原子替换保护文件完整性，但并不串行化两个 writer 的业务更新。", "Atomic replacement protects file integrity but does not serialize semantic updates.", "/hive-protocol"),
  q("breaker", 2, "熔断器 Open 后仍必须明确什么？", "What remains essential after a breaker opens?", [["作用域、原因与恢复条件", "Scope, cause, and recovery condition"], ["只改按钮颜色", "Only change button color"], ["删除全部历史", "Delete all history"]], 0, "安全动作需要可解释范围与受控恢复。", "Safety actions need explainable scope and controlled recovery.", "/safety-lifecycle"),
  q("authority", 3, "任务同时出现在 localStorage 和 Hive 文件，冲突时应如何决定？", "A task appears in localStorage and Hive files; how resolve conflict?", [["最后加载者赢", "Last loaded wins"], ["文件更大者赢", "Larger file wins"], ["按预先定义的 authority/mirror 关系裁决", "Use predefined authority/mirror relationship"]], 2, "存储介质不决定权威，数据契约决定。", "Storage medium does not decide authority; the data contract does.", "/persistence-authority"),
  q("isolation", 3, "worktree 创建失败后静默共享 cwd 的主要风险是？", "What is the main risk of silently sharing cwd after worktree failure?", [["违反用户隔离假设，worker 可能互相覆盖", "Violates isolation expectations and enables overwrites"], ["字体加载变慢", "Fonts load slowly"], ["Realtime token 过期", "Realtime token expires"]], 0, "fallback 提升可用性，但降低安全边界必须显式。", "Fallback improves availability, but weakened safety must be explicit.", "/git-workspaces"),
  q("memory", 3, "客户端 extractTopics 生成的节点最准确的分类是？", "How should client-extracted topic nodes be classified?", [["长期记忆权威", "Long-term memory authority"], ["可重算派生视图", "Recomputable derived view"], ["Provider session id", "Provider session id"]], 1, "算法输出依赖当前输入，可重算且应追溯原文。", "Algorithmic output depends on current input and should be recomputable and traceable.", "/memory-knowledge"),
  q("token", 4, "Realtime 为什么由 Main mint 临时 secret 给 Renderer？", "Why does Main mint a temporary realtime secret for Renderer?", [["让长期 key 不跨入低信任边界", "Keep long-lived key out of a lower-trust boundary"], ["减少 React 组件", "Reduce React components"], ["替代 Hive router", "Replace Hive router"]], 0, "临时、限权凭据缩小泄漏影响。", "Short-lived scoped credentials reduce leakage impact.", "/observability"),
  q("done", 5, "跨进程功能的高质量完成标准是什么？", "What is a strong done criterion for a cross-process feature?", [["Happy path 按钮可点", "Happy-path button clicks"], ["重启正确、失败可解释、取消无孤儿资源", "Correct after restart, explainable failure, orphan-free cancellation"], ["新增一个菜单", "One more menu item"]], 1, "完成度来自完整生命周期，而不是界面入口。", "Completion comes from full lifecycle, not a UI entry.", "/extension-guide"),
];

export const labFacts = [
  { id: "theme", label: l("主题偏好", "Theme preference"), owner: "Renderer", store: "localStorage", recovery: l("缺失时使用默认主题；可安全重建。", "Use a default when absent; safely rebuildable."), lesson: "/persistence-authority" },
  { id: "task", label: l("Hive 任务状态", "Hive task state"), owner: "HiveManager", store: "Hive files / SQLite index", recovery: l("协议文件为协作事实；索引可重建，冲突按 manager 规则裁决。", "Protocol files are coordination facts; indexes rebuild and manager rules adjudicate."), lesson: "/hive-protocol" },
  { id: "terminal", label: l("终端输出", "Terminal output"), owner: "PTY session", store: "Runtime stream / bounded buffer", recovery: l("历史缓冲可恢复一部分展示，但不能重建已退出进程。", "Buffered history restores some display, not an exited process."), lesson: "/pty" },
  { id: "provider-session", label: l("Provider 会话身份", "Provider session identity"), owner: "Provider CLI + mapping", store: "Provider home / app mapping", recovery: l("需要 provider-specific id 与正确数据目录，不能用 agent id 代替。", "Needs provider-specific id and data directory; agent id is insufficient."), lesson: "/provider-bridges" },
  { id: "graph", label: l("Memory Graph 节点", "Memory Graph node"), owner: "Derived algorithm", store: "Recomputed client view", recovery: l("从原始材料重新提取和构图，不反向覆盖知识。", "Re-extract and rebuild from source material without overwriting knowledge."), lesson: "/memory-knowledge" },
] as const;
