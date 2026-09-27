---
title: 使用 PostHog
description: 安装与配置 PostHog 以进行产品分析、会话回放和错误跟踪的指南。
---

# 使用 PostHog

> 支持平台：Android、iOS。

[PostHog](https://posthog.com/) 是带有会话回放、功能标志和错误跟踪的产品分析平台。

EAS CLI 集成会自动化标准的 PostHog React Native 设置：安装 SDK、创建 PostHog 组织与项目，并配置环境变量。你也可以[手动设置](#手动设置)，本指南其余部分保持不变。

## 前置条件

- **Expo 账户** —— 注册 [Expo 账户](https://expo.dev/signup)。
- **EAS CLI** —— 用 `npm install -g eas-cli` 全局安装 EAS CLI。
- **已链接到 EAS 的 Expo 项目** —— 创建 Expo 项目并用 `eas init` 把它链接到 EAS。

## 你将学到

本指南涵盖把 PostHog 集成到 Expo 项目：

- 在 React Native 应用中[安装并配置 PostHog](#安装并配置-posthog)
- 带 source map 与原生崩溃符号化的[错误跟踪](#错误跟踪)
- [发布标记](#发布标记)、[标准 EAS 属性](#标准-eas-属性)、[功能标志](#功能标志)和[故障排除](#故障排除)

## 安装并配置 PostHog

1. ### 运行 `connect` 命令

在项目目录中运行以下命令：

```sh
eas integrations:posthog:connect
```

此命令会：

- 提示选择 PostHog **区域**（US 或 EU）。区域决定数据驻留地，连接后不能更改。
- 为你创建 PostHog 组织与项目，如果已经连接过则复用现有的。如果你的邮箱已有 PostHog 账户，`connect` 会打开浏览器让你批准关联，然后继续。
- 询问要设置哪些功能：**Analytics**、**Session replay** 和 **Error tracking** 的多选，默认全部启用。
- 如果启用 **error tracking**，会提示你粘贴 PostHog **个人 API 密钥**。在 PostHog 的 **Settings → Personal API keys** 下用 “Source map upload” 预设创建一个。（非交互模式下，用 `--posthog-cli-api-key` 传入。）
- 安装 PostHog SDK 和所需的 Expo 模块（如果保留该功能，还会安装会话回放包）。
- 把 `posthog-react-native/expo` 配置插件添加到应用配置。该插件接好 PostHog SDK、会话回放和错误符号化所依赖的原生模块。它会替你编辑静态[应用配置](/workflow/configuration)文件，但无法编辑[动态应用配置](/workflow/configuration#dynamic-configuration)，因此会打印出插件条目供你添加。
- 把 `EXPO_PUBLIC_POSTHOG_API_KEY` 和 `EXPO_PUBLIC_POSTHOG_HOST` 写入 **.env.local**，以及 Production、Preview 和 Development 环境的 EAS 环境变量。启用错误跟踪时，还会把个人 API 密钥存为 `POSTHOG_CLI_API_KEY`（[敏感可见性](/eas/environment-variables#visibility-settings-for-environment-variables)），以及公开的 `POSTHOG_CLI_PROJECT_ID` 和 `POSTHOG_CLI_HOST`。

重新运行 `connect` 是安全的：它会复用现有组织与项目，并在覆盖环境变量之前提示。

<details>
<summary>在 CI 或非交互模式中运行</summary>

传入 `--non-interactive`，并带上 `--region US` 或 `--region EU`（必填，因为数据驻留没有安全的默认值）。用 `--session-replay` / `--no-session-replay` 和 `--error-tracking` / `--no-error-tracking` 控制功能；错误跟踪还需要 `--posthog-cli-api-key`。用 `--overwrite` 可以不提示就替换现有环境变量。

</details>

2. ### 用 `<PostHogProvider>` 包裹应用

在根布局文件（使用 Expo Router 时为 **src/app/\_layout.tsx**）中，用 `<PostHogProvider>` 包裹应用，从命令写入的环境变量读取密钥。全部选项见 [PostHog React Native 文档](https://posthog.com/docs/libraries/react-native)，包括[错误跟踪自动捕获](https://posthog.com/docs/error-tracking/installation/react-native)。

```tsx src/app/_layout.tsx
import { PostHogProvider } from 'posthog-react-native';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
        enableSessionReplay: false, // 如果启用了会话回放，设为 true
        // 捕获 JS 异常（如果没有启用错误跟踪，请删除）：
        errorTracking: {
          autocapture: { uncaughtExceptions: true, unhandledRejections: true },
        },
        // disabled: __DEV__, // 取消注释以停止从开发构建发送事件
      }}>
      <Slot />
    </PostHogProvider>
  );
}
```

3. ### 创建开发构建

会话回放和原生崩溃符号化需要[开发构建](/develop/development-builds/introduction)，因为它们在 Expo Go 中不可用。产品分析在 Expo Go 中可用。

```sh
eas build --profile development
```

4. ### 验证配置

添加一个临时按钮来捕获测试事件，运行开发构建并点按它：

```tsx
import { Button } from 'react-native';
import { usePostHog } from 'posthog-react-native';

// 在组件内部
const posthog = usePostHog();
<Button title="Send test event" onPress={() => posthog?.capture('test_event')} />
```

打开你的 PostHog 项目（根据区域为 `https://us.posthog.com` 或 `https://eu.posthog.com`），确认事件已到达。

## 错误跟踪

如果启用了错误跟踪，PostHog 会对两件不同的事做符号化，并且你要分别设置它们：

- **JavaScript source map**，用于 JS/TS 异常，包括 Hermes 字节码。参见 [Source map](#source-map)。
- **原生调试符号**，用于原生 Android 和 iOS 崩溃（ProGuard/R8 映射和 dSYM）。可选。参见[原生崩溃符号化](#原生崩溃符号化)。

### Source map

Source map 让 JavaScript 堆栈跟踪（包括 Hermes 字节码）指向原始源码，而不是压缩后的输出。

首先设置注入，以便每个 bundle 都被标记以便上传。把下面的内容添加到项目根目录的 **metro.config.js**（如果文件不存在就创建）：

```js metro.config.js
const { getPostHogExpoConfig } = require('posthog-react-native/metro');

const config = getPostHogExpoConfig(__dirname);

module.exports = config;
```

如果你已经自定义了 Metro 配置（例如使用 NativeWind 或在 Monorepo 中），请把更改应用到 `getPostHogExpoConfig` 返回的 `config` 对象上，而不是自己调用 `getDefaultConfig`。

PostHog 的 CLI 使用 `connect` 设置的 `POSTHOG_CLI_*` 环境变量进行身份验证。要从自己的机器上传，改为运行 `posthog-cli login`。

**在 EAS Build 上**，`posthog-react-native/expo` 配置插件会在 Android（Gradle）和 iOS（Xcode）构建阶段自动上传 source map，因此没有额外命令要运行。

**在 EAS Update 上**，OTA 更新只发布 JavaScript，因此每次更新后只上传它们的 source map（原生符号在构建时已固定）。[安装 PostHog 的 CLI](https://posthog.com/docs/error-tracking/upload-source-maps/cli)，然后一次导出一个平台并上传其 map：

```sh
eas update --platform ios

posthog-cli hermes upload --directory dist
```

**dist** 是 EAS Update 的默认输出目录。每次上传导出一个平台：PostHog 上传的是原生（Hermes）source map，因此 **dist** 中的 Web bundle 不会被处理。

<details>
<summary>用 EAS Workflows 自动化上传</summary>

EAS Build 会把 source map 上传作为原生构建的一部分，因此构建工作流不需要额外内容。对于更新，用 `eas update` 发布，然后对更新导出的 **dist** 目录运行 [`eas/posthog_upload_sourcemaps`](/eas/workflows/syntax#easposthog_upload_sourcemaps) 函数。

- [为错误跟踪上传 source map](/guides/using-posthog/recipes#为错误跟踪上传-source-map) —— 一个完整工作流，发布更新并从同一次导出上传 source map。

</details>

### 原生崩溃符号化

可选。原生崩溃（相对于 JavaScript 异常）需要在构建时上传原生调试符号。选择加入后，`posthog-react-native/expo` 插件可以在 EAS Build 期间完成此操作：

```json app.json
{
  "expo": {
    "plugins": [["posthog-react-native/expo", { "uploadNativeSymbols": true }]]
  }
}
```

这是端到端所需的三部分之一：构建时符号上传（上文）、provider 中的原生崩溃自动捕获，以及 PostHog 项目中的异常自动捕获设置。完整设置见 [PostHog 的原生崩溃自动捕获](https://posthog.com/docs/libraries/react-native#native-crash-autocapture)。

## 发布标记

通过从 [`expo-updates`](/versions/latest/sdk/updates) 和 [`expo-constants`](/versions/latest/sdk/constants) 注册[超级属性](https://posthog.com/docs/libraries/react-native#super-properties)，把每个捕获的事件映射回产生它的更新、项目和账户：

```tsx
import { useEffect } from 'react';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { usePostHog } from 'posthog-react-native';

function ReleaseTagger() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.register({
      'eas/update_id': Updates.updateId,
      'eas/channel': Updates.channel,
      'eas/runtime_version': Updates.runtimeVersion,
      'eas/project_id': Constants.expoConfig?.extra?.eas?.projectId,
      'eas/account': Constants.expoConfig?.owner,
    });
  }, [posthog]);

  return null;
}
```

在 `<PostHogProvider>` 内部渲染 `<ReleaseTagger />`。此后每次 `capture()` 都会带上这些属性，因此你可以在 PostHog 中按 `eas/update_id` 筛选或分组事件。只有当[应用配置](/workflow/configuration)设置了 `owner` 时，`eas/account` 才有值。`eas/update_id` 和 `eas/channel` 只在发布和预览构建中设置。在 Expo Go 和开发构建中它们为 `null`，因此来自这些构建的事件不会带上它们。

## 标准 EAS 属性

PostHog 识别这些 `eas/` 名称。它会在每一项旁边显示 Expo 标志，并把带有标识符的项链接到 expo.dev 上的对应页面。每个值从哪里来，取决于事件是在应用中触发还是在工作流中触发：

| 属性 | 在应用中 | 在工作流中 | 在 PostHog 中打开 |
| --- | --- | --- | --- |
| `eas/update_id` | `expo-updates` | 更新作业 | `expo.dev/updates/<id>` |
| `eas/build_id` | 不可用 | 构建作业 | `expo.dev/builds/<id>` |
| `eas/channel` | `expo-updates` | 构建作业 | 无链接 |
| `eas/runtime_version` | `expo-updates` | 构建或更新作业 | 无链接 |
| `eas/project_id` | `expo-constants` | `${{ app.id }}` | `expo.dev/projects/<id>` |
| `eas/account` | `expo-constants` | `${{ account.name }}` | `expo.dev/accounts/<name>` |
| `eas/workflow_id` | 不可用 | `${{ workflow.id }}` | `expo.dev/workflows/<id>` |

`ReleaseTagger` 代码片段从 `expo-updates` 和 `expo-constants` 设置应用内的值。在工作流中，在 [`eas/posthog_capture_event`](/eas/workflows/syntax#easposthog_capture_event) 上设置相同的名称：`eas/account`、`eas/project_id` 和 `eas/workflow_id` 来自 [`account`](/eas/workflows/syntax#account)、[`app`](/eas/workflows/syntax#app) 和 [`workflow`](/eas/workflows/syntax#workflow) 上下文，每个作业都可以读取。构建和更新字段来自构建或更新作业的输出。[配方](/guides/using-posthog/recipes)在上下文中展示了这一点。`eas/update_id` 在应用中是单个更新 ID，在工作流中是更新组 ID，一次发布会产生一组特定平台的更新。两者都会在 expo.dev 上打开该更新。

## 功能标志

provider 设置好之后，功能标志无需额外配置即可工作。参见 [PostHog 面向 React Native 的功能标志](https://posthog.com/docs/feature-flags/installation/react-native)和[引导](https://posthog.com/docs/feature-flags/bootstrapping)，以避免应用启动时的网络往返。

## 与 EAS Workflows 一起使用

[EAS Workflows](/eas/workflows/get-started) 可以从 CI 流水线与 PostHog 通信。你可以发送事件、创建注释、推出功能标志、用实时指标门控发布，以及把上传 source map 作为工作流步骤。这些步骤会自动读取 `connect` 设置的 `EXPO_PUBLIC_POSTHOG_*` 和 `POSTHOG_CLI_*` 环境变量。每个步骤的完整输入参考见 [EAS Workflows 语法参考中的 PostHog 函数](/eas/workflows/syntax#easposthog_capture_event)。

- [用 PostHog 渐进交付](/guides/using-posthog/recipes) —— 从标记部署到门控发布、自动熔断和需要批准的发布，并附有便于快速查阅的配方参考。

## 管理集成

以后用这些命令管理集成：

```sh
eas integrations:posthog:dashboard

eas integrations:posthog:disconnect
```

`dashboard` 打开已链接的 PostHog 项目。`disconnect` 只移除 Expo 一侧的链接。你的 PostHog 组织、项目和数据保持原样。

## 手动设置

`connect` 是标准 PostHog React Native 设置的快捷方式。要手动完成，遵循 [PostHog 的 React Native 安装指南](https://posthog.com/docs/libraries/react-native)，然后设置 `EXPO_PUBLIC_POSTHOG_API_KEY` 和 `EXPO_PUBLIC_POSTHOG_HOST`（以及用于 source map 的 `POSTHOG_CLI_*` 变量）。如[第 2 步](#用-posthogprovider-包裹应用)所示，用 `<PostHogProvider>` 包裹应用。关于 source map，参见 [Source map](#source-map)。

## 故障排除

<details>
<summary>没有事件到达</summary>

确认 `EXPO_PUBLIC_POSTHOG_API_KEY` 已在构建所用的环境 profile 中设置。请注意 `disabled: __DEV__` 会停止来自开发构建的事件，因此请在预览或生产构建中测试（或临时移除它）。如果 `connect` 写入环境变量时开发服务器已经在运行，请做一次完整重载（不是 Fast Refresh），以便应用读取新的 `EXPO_PUBLIC_*` 值。

</details>

<details>
<summary>会话回放不工作</summary>

会话回放需要开发构建，因为它不能与 Expo Go 一起工作。如果项目使用[持续原生生成](/workflow/continuous-native-generation)，可以在本地用 `npx expo run:android` 或 `npx expo run:ios` 创建一个，或用 `eas build --profile development`。

</details>

<details>
<summary>Source map 没有符号化</summary>

确认 **metro.config.js** 已用 `getPostHogExpoConfig` 包裹（参见 [Source map](#source-map)），并且设置了 `POSTHOG_CLI_*` 环境变量（启用错误跟踪时 `connect` 会添加它们）。对于 OTA 更新，请确保在 `eas update` 之后运行了 `posthog-cli hermes upload --directory dist`。

</details>

<details>
<summary>“你已经有一个 PostHog 账户”</summary>

如果你的邮箱已有 PostHog 账户，`connect` 会打开浏览器，让你批准把它关联到 Expo，然后继续。在它打开的浏览器标签页中批准请求。如果拒绝或关闭了标签页，重新运行 `connect`。

</details>

## 进一步了解

- [PostHog React Native 库](https://posthog.com/docs/libraries/react-native)
- [面向 React Native 的产品分析](https://posthog.com/docs/product-analytics/installation/react-native)
- [面向 React Native 的错误跟踪](https://posthog.com/docs/error-tracking/installation/react-native)
- [面向 React Native 的会话回放](https://posthog.com/docs/session-replay/installation/react-native)
- [为 React Native 上传 source map](https://posthog.com/docs/error-tracking/upload-source-maps/react-native)
- [面向 React Native 的功能标志](https://posthog.com/docs/feature-flags/installation/react-native)
