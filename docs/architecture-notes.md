# Munder Difflin 架构分析笔记

## 1. 精确定位

Munder Difflin 是本地优先的多 CLI Agent 桌面系统。它同时扮演四个角色：

1. **Harness**：启动、停止、恢复多个 CLI，维护 PTY、terminal 与工作区。
2. **Orchestration layer**：通过 Hive task、mailbox、hook 和安全 prompt delivery 协调多个真实 Agent。
3. **Control plane**：集中掌握进程、文件、Git、DB、权限、保护策略和外围触发器。
4. **Visualization**：用 Office、Kanban、terminal、Git/IDE panels 显示运行事实并接受人类操作。

它不是 LangGraph / DeepAgents 一类的进程内 agent runtime。模型请求、tool registry、tool loop 和 provider session 通常属于被启动的 Claude Code、Codex 等外部 CLI。

## 2. 运行与权限边界

### Electron Main

`src/main/index.ts` 是 composition root：创建窗口，初始化 persist/Hive/hooks/telemetry，注册 IPC，启动 Slack/Webhook 等可选服务，并统一关闭。Main 还拥有 `PtyManager`、Git/FS、SQLite 与 OS child process 权限。

### Preload

`src/preload/index.ts` 用 `contextBridge.exposeInMainWorld('cth', api)` 暴露窄能力面。动态 PTY channel、Hive、Git、DB、dialog、settings 等都在这里转换成 renderer 可用的 typed methods。

### Renderer

BrowserWindow 使用 `sandbox: true`、`contextIsolation: true`、`nodeIntegration: false`。React Renderer 只处理交互和可视化，不能直接 import Node 模块。

## 3. Agent 启动链

```text
AddAgentModal.submit
  → window.cth.spawnPty
  → ipcMain.handle('pty:spawn')
  → spawnAgentCore
     → infer provider / probe or install CLI
     → optional Git worktree
     → hive.ensureAgent
     → provider-specific args/env/resume
  → PtyManager.spawn
  → node-pty.spawn
  → external CLI agent runtime
```

`spawnAgentCore` 是跨域复杂度最高的唯一主入口。隔离失败当前会降级共享 cwd；这符合 local-first 的 best-effort 策略，但企业环境可能需要改成 fail closed。

## 4. PTY Runtime

`PtyManager` 统一处理：

- `id/cwd/command` 校验与 executable resolution；
- interactive shell PATH；
- Windows `.cmd/.bat` shim 解码与 `cmd.exe` fallback；
- `node-pty` spawn、write、resize、redraw、kill、list；
- `pty:data:<id>` / `pty:exit:<id>` owner-window 事件；
- 同 id 重启时的 session identity guard；
- Windows/POSIX 的 process tree cleanup。

它管理 OS 进程生命周期，不接管外部 CLI 内部的模型运行逻辑。

## 5. Hive 多 Agent 协调

Hive 根目录位于 `<harnessHome>/hive`。每个 Agent 有 identity、memory、cursor、inbox/outbox 和 registry entry。Router 默认约 1.5 秒扫描 outbox：

- 目录 ID 是权威 sender，避免伪造 `from`；
- hop cap 为 12；
- 支持 god/human/broadcast 语义；
- 可接收 inbox 的 provider 走文件投递；
- hookless / terminal proxy provider 走 Renderer terminal handoff；
- 成功文件移到 `.sent`，格式错误进入 quarantine。

Task ledger 与消息投递是两层：`tasks.json` 表示工作意图，mailbox / terminal queue 才负责把 work order 交给 Agent。

`useHive` 的 safe drain 会检查 Agent status、PTY quiet、pause、boot grace、draft/picker ownership、precondition 和 cooldown。文本与 Enter 两次写入全部成功后才从队列移除。

## 6. 安全与收尾

- `CircuitBreaker`：healthy → steering → constrained → stopped；观察重复 tool、error storm、成本/Token 上限、velocity 与 no-progress。
- `WorkerWakeWatchdog`：只唤醒真正 idle、有未读 mail、无 HITL 阻塞且满足 cooldown 的 worker。
- `ClosingTimeController`：广播保存协议、steer busy worker、逐个等待 ACK，并独立核验 god 的 COMPLETE。
- 退出路径停止 router/hooks/watchers/servers/sidecars/timers，回收全部 PTY 树，并给 analytics 约 1.2 秒有界 flush。

## 7. 状态权威

| 层 | 当前内容 | 主要权威 |
| --- | --- | --- |
| SQLite | `kv`、`command_history` | Main `PersistStore` |
| Config / roster | settings、Agent roster mirror、Renderer queue/preferences | `config.json`、`roster.json`、localStorage |
| Hive files + Git | registry、tasks、mailbox、memory、log、cost ledger | `HiveManager` 与单一 Git committer |
| Runtime memory | PTY sessions、timers、live workers、breaker state | Main / Renderer process memory |
| External CLI storage | transcripts、per-Agent `CODEX_HOME`、provider config/credentials | 各 CLI runtime |

这套架构没有“一个数据库就是全部真相”。二次开发前必须先确定目标状态的当前写入者与恢复路径。

## 8. Git / Workspace

Main Git adapter 提供 status/log/diff/branch/ahead-behind、history DAG、compare、worktree 与 guarded checkout。Agent isolation 创建 `agent/<id>` 分支和 `<harnessHome>/worktrees/<id>`；退出时发现 dirty 或 ahead 会保留 worktree，避免破坏未合并工作。

`src/main/github.ts` 只是基于 `gh` CLI 的 issues / CI runs 小型适配器，不是完整 PR orchestration。

## 9. Renderer 与外围模块

- xterm terminal pool 即使离屏也保留终端 buffer；PTY stream 同时喂给 xterm 和 parser。
- `usePtyParser` 根据可见 TUI 与 hook 信号映射 working/idle/waiting/blocked、station 与当前 tool。
- Pixi Office 是真实事件的空间化投影，不是 Agent runtime。
- Realtime Michael 在 Renderer 用 WebRTC 建 session，Main 只签发短期 ephemeral token，长期 key 留在 Main。
- 本地 OTLP collector 只监听 loopback，为 breaker/UI 提供 token、cost、tool 信号；PostHog analytics 是单独、受 gate 控制的 outbound 路径。

## 10. 二次开发判断

### 值得复用

PTY lifecycle、provider preset/bridge、Preload capability seam、worktree 保全、mailbox/task protocol、安全投递、breaker、graceful shutdown。

### 企业化前需要重做或补强

中心策略与审计、RBAC、远程 worker、持久事务队列、可观测 SLO、数据 authority flip、凭证治理，以及隔离失败时的 fail-closed 策略。

### 不应直接照搬为分布式架构

localStorage 主导的 roster/queue、单机文件轮询 router、best-effort worktree 降级，以及仍标记 runtime-unverified 的 provider bridge。
