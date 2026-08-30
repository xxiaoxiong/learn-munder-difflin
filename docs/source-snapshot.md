# 源码快照与分析口径

## 固定基线

| 项目 | 值 |
| --- | --- |
| 上游仓库 | `https://github.com/chaitanyagiri/munder-difflin` |
| 分析分支 | `main` |
| 固定 commit | `956bfb4cff1af97f9cf29b9ce489ae69a5774843` |
| 短 SHA | `956bfb4c` |
| 获取日期 | `2026-08-30` |
| 学习站仓库 | `https://github.com/xxiaoxiong/learn-munder-difflin` |

站内所有证据链接均使用以下形式：

```text
https://github.com/chaitanyagiri/munder-difflin/blob/956bfb4cff1af97f9cf29b9ce489ae69a5774843/<path>#Lx-Ly
```

这样可避免 upstream `main` 更新后“分析结论和链接指向不同实现”的问题。

## 分析方法

1. 从 `package.json`、Electron boot 与 `createWindow` 确认产品形态和安全边界。
2. 从 Renderer 用户入口反向追踪 Preload IPC、Main handler、manager 和外部进程。
3. 以 `spawnAgentCore` 为主干，分别展开 provider、Git worktree、Hive、resume 和 PTY。
4. 把状态按“谁写入、谁读取、谁是当前权威”分类，而不是依据文件名推断架构。
5. 对 task、message、prompt delivery、restart 与 shutdown 做端到端链路核对。
6. 将 `SPEC.md` / `MEMORY_GRAPH_SPEC.md` 与当前实现交叉验证，明确文档漂移。

## 证据等级

- **已核验（verified）**：结论可由固定 commit 的实际代码、配置或测试直接支持。
- **运行时未核验（runtime-unverified）**：源码声明支持，但需要特定 CLI、账号、操作系统或服务才能做 live 验证。
- **仅设计文档（design-only）**：只存在于规格文档，或规格状态已经落后于当前实现；不能当成当前运行事实。

## 重要的文档漂移

### SQLite 当前只有两类数据

[`src/main/db.ts`](https://github.com/chaitanyagiri/munder-difflin/blob/956bfb4cff1af97f9cf29b9ce489ae69a5774843/src/main/db.ts#L12-L68) 明确说明 Phase A 只有：

- `kv`：当前主要用于窗口 bounds；
- `command_history`：用户提交过的 prompt 历史。

`agents`、message queue、cost ledger 等仍是 future migrations。旧 `SPEC.md` 中更完整的 SQLite 模型属于目标设计，不是当前事实。

### Memory Graph 已经有实现

旧 `MEMORY_GRAPH_SPEC.md` 的状态段落仍写着等待实现，但当前源码已有 `MemoryGraphPanel.tsx` 与 `components/memoryGraph/*`。站点将规格状态标为 design-only，以实际源码为准。

### Provider 支持不等于完全验证

`src/shared/agentProvider.ts` 显式列出多个 provider preset / bridge。部分 bridge 带 `LIVE-UNVERIFIED` 或 TODO 语义，因此学习站把“代码存在”和“所有 runtime 路径已在线验证”分开表述。

## 未执行的外部运行验证

本分析没有为每个 provider 登录账号，也没有真实启动 Claude Code、Codex、Grok、Gemini 等全部 CLI；没有连接真实 Slack、OpenAI Realtime、tunnel 或 PostHog 服务。这些不影响对代码结构和边界的静态核验，但相关行为不应被描述为端到端已验证。
