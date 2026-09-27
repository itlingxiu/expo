---
title: 升级 Expo SDK
description: 了解如何在项目中逐级升级 Expo SDK 版本。
---

# 升级 Expo SDK

:::note
我们建议逐个 SDK 版本增量升级。这样做有助于你定位升级过程中出现的破坏和问题。
:::

新的 SDK 发布后，最新版本会进入当前发布状态。这对 Expo Go 同样适用，因为它只支持最新 SDK 版本，更早的版本不再受支持。我们建议生产应用使用[开发构建](/develop/development-builds/introduction)，因为 EAS 服务对较旧 SDK 版本的向后兼容往往长得多，但并非永远。

如果你想在 Android 设备、Android 模拟器或 iOS 模拟器上安装特定版本的 Expo Go，请访问 [expo.dev/go](https://expo.dev/go)，或使用 [`expo-go` CLI](/develop/tools#expo-go-cli)。更多信息参见[排查 Expo Go 版本不匹配](/troubleshooting/expo-go-version-mismatch)。

## 如何升级到最新 SDK 版本

### 用 AI 编码代理升级

如果你使用 AI 编码代理，安装 [Expo Skills](/skills) 并使用 [`expo-upgrade` 技能](/skills#可用的-expo-skills)。该技能提供升级 Expo SDK 版本和修复依赖问题的指南。审查任何建议的更改，并查看 SDK 更新日志中针对特定版本的说明。

相关技能：`expo-upgrade`。

### 手动升级

#### 升级 Expo SDK

安装新版本的 Expo 包：

:::tabs
:::tab npm
```sh
$ npm install expo@^57.0.0
```
:::
:::tab yarn
```sh
$ yarn add expo@^57.0.0
```
:::
:::tab pnpm
```sh
$ pnpm add expo@^57.0.0
```
:::
:::tab bun
```sh
$ bun install expo@^57.0.0
```
:::
:::

根据你要升级到的 SDK，把 `expo@^57.0.0` 替换为目标 Expo SDK 版本的版本范围。例如，`expo@^57.0.0` 表示 SDK 57。

#### 升级依赖

把所有依赖升级到与已安装 SDK 版本匹配。然后运行 [`expo-doctor`](/develop/tools#expo-doctor) 命令检查常见问题。

```sh
$ npx expo install --fix

$ npx expo-doctor
```

#### 更新原生项目

- **如果你使用[持续原生生成](/workflow/continuous-native-generation)**：如果曾为先前的 SDK 版本在本地项目目录中生成过 **android** 和 **ios** 目录，请删除它们。下次运行构建时会重新生成，无论是 `npx expo run:ios`、`npx expo prebuild`，还是 EAS Build。
- **如果你不使用[持续原生生成](/workflow/continuous-native-generation)**：如果有 **ios** 目录，运行 `npx pod-install`。应用[原生项目升级助手](/bare/upgrade)中的任何相关更改。你也可以考虑[采用预构建](/guides/adopting-prebuild)，以便将来更容易升级。

#### 遵循发布说明中的其他指示

阅读你要升级到的 SDK 版本的 [SDK 更新日志](#sdk-更新日志)。其中包含可能影响你应用的破坏性变更、弃用和其他更改的重要信息。发布说明页面底部的 "Upgrading your app" 部分有任何额外说明。

## SDK 更新日志

每篇 SDK 公告的发布说明都包含关于弃用、破坏性变更，以及该特定 SDK 版本可能独有的其他内容。升级时务必查看它们，以免遗漏。

- **SDK 57**：[发布说明](https://expo.dev/changelog/sdk-57)
- **SDK 56**：[发布说明](https://expo.dev/changelog/sdk-56)
- **SDK 55**：[发布说明](https://expo.dev/changelog/sdk-55)
- **SDK 54**：[发布说明](https://expo.dev/changelog/sdk-54)

### 已弃用 SDK 版本的更新日志

以下博客文章可能包含过时信息，但如果你在 SDK 升级上落后很多，它们仍可作为参考。

<details>
<summary>查看已弃用 SDK 发布更新日志的完整列表</summary>

- **SDK 53**：[发布说明](https://expo.dev/changelog/sdk-53)
- **SDK 52**：[发布说明](https://expo.dev/changelog/2024-11-12-sdk-52)
  - **React Native 0.77 可与 Expo SDK 52 一起使用**。要升级，参见这些[发布说明](https://expo.dev/changelog/2025-01-21-react-native-0.77)。
- **SDK 51**：[发布说明](https://expo.dev/changelog/2024-05-07-sdk-51)
- **SDK 50**：[发布说明](https://expo.dev/changelog/2024-01-18-sdk-50)
- **SDK 49**：[发布说明](https://blog.expo.dev/expo-sdk-49-c6d398cdf740)
- **SDK 48**：[发布说明](https://blog.expo.dev/expo-sdk-48-ccb8302e231)
- **SDK 47**：[发布说明](https://blog.expo.dev/expo-sdk-47-a0f6f5c038af)
- **SDK 46**：[发布说明](https://blog.expo.dev/expo-sdk-46-c2a1655f63f7)
- **SDK 45**：[发布说明](https://blog.expo.dev/expo-sdk-45-f4e332954a68)
- **SDK 44**：[发布说明](https://blog.expo.dev/expo-sdk-44-4c4b8306584a)
- **SDK 43**：[发布说明](https://blog.expo.dev/expo-sdk-43-aa9b3c7d5541)
- **SDK 42**：[发布说明](https://blog.expo.dev/expo-sdk-42-579aee2348b6)
- **SDK 41**：[发布说明](https://blog.expo.dev/expo-sdk-41-12cc5232f2ef)
- **SDK 40**：[发布说明](https://dev.to/expo/expo-sdk-40-is-now-available-1in0)
- **SDK 39**：[发布说明](https://dev.to/expo/expo-sdk-39-is-now-available-1lm8)
- **SDK 38**：[发布说明](https://dev.to/expo/expo-sdk-38-is-now-available-5aa0)
- **SDK 37**：[发布说明](https://dev.to/expo/expo-sdk-37-is-now-available-69g)
- **SDK 36**：[发布说明](https://blog.expo.dev/expo-sdk-36-is-now-available-b91897b437fe)
- **SDK 35**：[发布说明](https://blog.expo.dev/expo-sdk-35-is-now-available-beee0dfafbf4)

</details>
