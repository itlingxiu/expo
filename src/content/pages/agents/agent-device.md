---
title: agent-device 与 Expo
description: 使用 agent-device，让 AI 编程智能体在本地和远程设备上验证、调试、分析并测试正在运行的 Expo 应用。
---

# agent-device 与 Expo

[`agent-device`](https://agent-device.dev) 是 Callstack 出品的开源、面向智能体的 CLI。它让 AI 编程智能体操作正在运行的 Expo 应用，并用 UI 状态、截图、视频、日志、网络活动、追踪和性能数据验证结果。

阅读代码和自动化测试并不总能反映正在运行的应用里发生了什么。有了 `agent-device`，智能体可以检查某个屏幕是否渲染、某条流程是否完成、某个请求是否发出，然后报告它所观察到的现象。这把行为审查加进了智能体实现改动时使用的同一套工作流。

`agent-device` 在 Codex、Claude Code、Cursor 和其他编程智能体的终端中运行，并可选集成 [Model Context Protocol (MCP)](/mcp)。同一套命令模型覆盖 Android 模拟器、iOS 模拟器、物理设备、Android TV、tvOS、macOS、Linux 和 Web。

常规响应保持紧凑。语义快照包含可操作的引用，例如 `@e3`；命令结果会说明失败时如何恢复；较大的输出会保存为产物。这样智能体可以把更多上下文留给应用本身的工作。

:::note
`agent-device` 由 [Callstack](https://www.callstack.com) 构建并维护，以 MIT 许可证提供。受支持的平台和命令的完整列表见 [`agent-device` 文档](https://oss.callstack.com/agent-device/)。
:::

**前置条件**

- **Node.js 22.12 或更高版本**：`agent-device` CLI 需要 Node.js 22.12 或更新版本。
- **用于本地测试的设备环境（可选）**：要在 Android 上本地测试，请安装 [Android SDK Platform Tools（`adb`）](/workflow/android-studio-emulator#设置-android-studio)，并确认 `adb` 在 `PATH` 中。要在 iOS 上本地测试，请使用已[安装 Xcode](/workflow/ios-simulator#设置-xcode-和-watchman) 的 macOS。使用[设备云](https://oss.callstack.com/agent-device/docs/device-clouds)或[远程设备主机](https://oss.callstack.com/agent-device/docs/remote-proxy)时，可以跳过这些本地工具链。

## 快速开始

1. **安装 `agent-device`**

   全局安装 CLI，这样编程智能体就能从终端使用稳定的 `agent-device` 命令。

   :::tabs
   :::tab npm
   ```sh
   npm install -g agent-device@latest
   ```
   :::
   :::tab yarn
   ```sh
   yarn global add agent-device@latest
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm add -g agent-device@latest
   ```
   :::
   :::tab bun
   ```sh
   bun add -g agent-device@latest
   ```
   :::
   :::

   检查本地工具链和设备是否就绪，然后阅读与版本匹配的工作流指南：

   ```sh
   agent-device doctor
   agent-device --version
   agent-device help workflow
   ```

2. **安装 `agent-device` skill（可选）**

   如果编程智能体支持 skills，请安装官方 skill。它会教智能体选择正确的工作流，并阅读与已安装 CLI 版本匹配的帮助。

   :::tabs
   :::tab npm
   ```sh
   npx skills add callstack/agent-device
   ```
   :::
   :::tab yarn
   ```sh
   yarn dlx skills add callstack/agent-device
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm dlx skills add callstack/agent-device
   ```
   :::
   :::tab bun
   ```sh
   bunx skills add callstack/agent-device
   ```
   :::
   :::

   也可以不安装 skill 就使用 `agent-device`。告诉智能体使用 `agent-device` 即可；它可以从 CLI 内置帮助中学习当前工作流。客户端专用说明和可选的 MCP 配置见 [AI Agent Setup](https://oss.callstack.com/agent-device/docs/agent-setup)。

3. **运行 Expo 应用**

   在 Android 模拟器或 iOS 模拟器上启动应用。`agent-device` 操作的是已安装的应用，因此不必向 Expo 项目添加 `agent-device` 库。

   ```sh
   # 在模拟器上构建并运行应用
   npx expo run:android
   npx expo run:ios

   # 或为已安装的开发构建或 Expo Go 启动开发服务器
   npx expo start
   ```

4. **向智能体提问**

   让编程智能体对正在运行的应用使用 `agent-device`。它可以发现应用、打开会话、检查当前屏幕、对元素执行操作并验证结果。

   ```text 示例提示词
   使用 `agent-device` 在 iOS 上打开我的 Expo 应用的设置屏幕，验证它已正确加载，并截一张图作为证据。
   ```

   如果智能体确认设置屏幕已加载并返回截图路径，说明它能够观察并控制你的应用。

## `agent-device` 循环如何工作

智能体打开应用，读取一份紧凑的无障碍快照，并对 `@e2` 这类引用执行操作。已稳定的交互可以在同一次响应中包含随之产生的 UI 变化。然后智能体用断言或适合该任务的证据验证结果，例如截图、聚焦的日志窗口或性能采样。

```bash
agent-device apps --platform ios
agent-device open MyApp --platform ios
agent-device snapshot -i
# @e1 [heading] "Welcome"
# @e2 [button] "Get Started"
agent-device press @e2 --settle
agent-device screenshot ./artifacts/get-started.png
agent-device close
```

智能体按照随已安装 CLI 附带的工作流指引来选择并运行这些命令。

## `agent-device` 让智能体能做什么

- **控制与交互：** 检查无障碍标签、角色、值、测试 ID 和可交互引用。启动应用、点按、输入、滚动、执行手势、处理警告框、打开 deep link，并更改设备状态。在 Android、iOS、Web、TV 和桌面目标上，本地或通过[设备云](https://oss.callstack.com/agent-device/docs/device-clouds)与[远程代理](https://oss.callstack.com/agent-device/docs/remote-proxy)使用同一套命令。
- **分析与调试：** 检查 React Native 组件、props、hooks、缓慢的 commit 和重复渲染；通过 Metro 的 Chrome DevTools Protocol (CDP) 执行有针对性的 JavaScript；并收集聚焦的日志以及可用的网络请求和响应。在同一会话中补充平台所支持的原生 CPU、内存、FPS 与帧健康、追踪、崩溃、截图、视频和音频证据。
- **测试与重复：** 把一次成功的会话录制成确定性的 `.ad` 脚本，回放它，或在 CI 中用内置测试命令运行它，并为失败的运行保留产物。用 `agent-device test --maestro` 运行受支持的 Maestro YAML，或把兼容的 `.ad` 流程导出为 Maestro YAML。

这覆盖了日常实现检查、探索性 QA、缺陷复现和性能工作。当调查需要实时原生断点、变量、内存检查或单步执行时，`agent-device` 可以复现并记录流程，同时让 Xcode 或 LLDB 附加到应用进程。与版本匹配的诊断和分析指引，请从 `agent-device help debugging`、`agent-device help react-devtools` 和 `agent-device help cdp` 开始，或参见 [Debugging and Profiling](https://oss.callstack.com/agent-device/docs/debugging-profiling)。

## 示例提示词

设置完成后，描述你想要的结果和证据。例如：

| 任务 | 示例提示词 |
| --- | --- |
| 验证一次实现 | 打开应用并测试新的结账流程。截下确认屏幕，并报告任何挡住你的问题。 |
| 在真机上复现缺陷 | 使用我的 BrowserStack 订阅，在一台真实 Android 设备上复现 issue #123。 |
| 检查无障碍 | 检查注册流程，并报告缺少或含糊的无障碍标签的可交互元素。提供相关截图。 |
| 分析一个缓慢的屏幕 | 在滚动时分析商品列表。用回放脚本设计可重复的实验，并找出 React 或原生性能问题的责任方。 |
| 设计到代码的循环 | 实现这个 Figma 设计，用截图对比在 iOS 上验证，并迭代直到差异低于 2%。 |
| 内部试用应用 | 以首次使用者的身份探索应用，并为每项发现附一张截图，返回一份按优先级排序的报告。 |

## 把 `agent-device` 与 Expo AI 工具一起使用

`agent-device` 补充 Expo 自己的智能体工具。Expo Skills 教智能体如何实现功能，Expo MCP Server 提供当前的 Expo 与 EAS 上下文，`agent-device` 则让它在正在运行的应用中验证结果。

- **[Expo MCP Server](/mcp#安装与设置)**：连接远程 Expo MCP Server，让智能体实时访问 Expo 文档和 EAS。
- **[Expo Skills](/skills#安装-expo-skills)**：安装教给智能体已知可靠 Expo 模式的插件。

自动化拉取请求测试可以从 Callstack 的 [`agent-device` EAS Workflow 模板](https://github.com/callstackincubator/eas-agent-device/blob/main/.eas/workflows/agent-qa-mobile.yml)开始。它展示如何针对 Expo 应用运行 AI QA 智能体，并保留可供审查的产物。

## 可选的 MCP 设置

大多数编程智能体可以通过集成终端直接使用 `agent-device`。如果客户端支持 MCP，并且你更喜欢结构化工具，可以把它配置为启动已安装的 CLI：

```json
{
  "mcpServers": {
    "agent-device": {
      "command": "agent-device",
      "args": ["mcp"]
    }
  }
}
```

MCP 为同一套设备工作流提供结构化工具。请保持 CLI 可用，这样智能体才能阅读与版本匹配的帮助，并使用仅在终端中提供的设置命令。

## 限制与提示

- 无障碍标签、角色和测试 ID 会让智能体交互可靠得多。把截图用作证据或视觉回退，但操作时优先使用引用和选择器。
- 把会改变状态的命令放在同一会话中按顺序执行。任务结束后关闭会话；在 CI 中如果模拟器也应停止，使用 `agent-device close --shutdown`。
- 设备级 UI 自动化（包括快照、点按、输入、截图和日志）可在开发构建或 Expo Go 中已安装的应用上工作，无需向项目添加库。
- React Native 组件检查和 React 性能分析需要开发服务器以及兼容的 React DevTools 连接，因此请保持它们运行。在 Expo Go 中，原生 CPU、内存和追踪分析针对的是 Expo Go 宿主进程，而不是应用专用的原生二进制文件，因此请使用开发构建来分析你的原生代码。
- 日志默认关闭。请让智能体为一次复现打开聚焦的日志窗口，而不是收集无边界的设备日志。
- 物理设备自动化需要特定于平台的配对、签名、权限和信任设置。请先从模拟器开始，然后按照[安装指南](https://oss.callstack.com/agent-device/docs/installation)配置物理设备。
- 在 [EAS Simulator](/preview/eas-simulator/introduction) 的 Android 会话中，请以无头模式启动模拟器。设置 `AGENT_DEVICE_HEADLESS=1`，或向 `agent-device boot` 传入 `--headless`。带窗口的模拟器在那里无法启动。
- 当任务需要更深入、与版本匹配的指引时，运行 `agent-device help react-native`、`agent-device help debugging` 或 `agent-device help dogfood`。
