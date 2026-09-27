---
title: React Native 新架构
description: 了解 React Native 的"新架构"，以及为什么、如何迁移到它。
---

# React Native 新架构

:::note
SDK 55 及以后完全运行在新架构（New Architecture）上。它始终启用，无法禁用。要使用旧架构，请使用 SDK 54 或更早版本。
:::

新架构是 Expo 对 React Native 一次全面内部重构的称呼，它也解决了 Meta 及其他公司在生产使用中观察到的原架构的局限性。

**延伸阅读：**

- [新架构来了](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here) —— Meta React Native 团队对特性与动机的概述。
- [React Native 0.82 —— 一个新时代](https://reactnative.dev/blog/2025/10/08/react-native-0.82) —— 第一个完全运行在新架构上的版本。SDK 55 使用 React Native 0.83，继承了这一点。

## 为什么要迁移到新架构？

- 它是"React Native 的现在与未来"。从 RN 0.82 起它始终启用、无法关闭；SDK 55 使用 RN 0.83。[旧架构已于 2025 年 6 月冻结](https://github.com/reactwg/react-native-new-architecture/discussions/290) —— 不再有新特性或错误修复。
- 新的 React/React Native 特性只在新架构上落地，例如[完整的 Suspense 支持](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here#full-support-for-suspense)与[新的样式能力](https://reactnative.dev/blog/2025/01/21/version-0.77#new-css-features-for-better-layouts-sizing-and-blending)，旧架构中并未实现。许多流行库现在只支持新架构。
- 在 SDK 54 或更早版本上，你仍然可以把 `newArchEnabled` 设为 `false`，但在升级到 SDK 55+ 之前必须完成迁移。

## Expo 工具与新架构

自 SDK 53 起，[Expo SDK](/versions/latest) 中所有 `expo-*` 包都支持新架构，包括 [bridgeless](https://github.com/reactwg/react-native-new-architecture/discussions/154)。参见[Expo 库中的已知问题](/guides/new-architecture#known-issues-in-expo-libraries)。使用 [Expo Modules API](/modules/overview) 构建的模块默认支持，因此你自己的原生模块无需额外工作。截至 2026 年 1 月，使用 [EAS Build](/build/introduction) 构建的 SDK 54 项目中约有 83% 使用新架构。

## 第三方库与新架构

流行库的兼容性在 [React Native Directory](https://reactnative.directory/) 上跟踪（参见[第三方库中的已知问题](/guides/new-architecture#known-issues-in-third-party-libraries)）。Expo Doctor 与 React Native Directory 集成以校验依赖 —— 识别未维护的库，以及不兼容或未经测试的库。

### 用 React Native Directory 校验你的依赖

运行 `npx expo-doctor`，根据 React Native Directory 数据检查依赖：

```sh
# npm
npx expo-doctor@latest

# yarn
yarn dlx expo-doctor@latest

# pnpm
pnpm dlx expo-doctor@latest

# bun
bunx expo-doctor@latest
```

在 **package.json** 中配置该检查；示例 —— 排除某个包：

```json package.json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "exclude": ["react-redux"]
      }
    }
  }
}
```

#### 查看所有可用选项

- **enabled**：为 `true` 时，如果包缺失于 React Native Directory 则警告；`false` 则禁用。SDK 52+ 默认为 `true`，否则为 `false`。可用 `EXPO_DOCTOR_ENABLE_DIRECTORY_CHECK` 环境变量覆盖（0 = false，1 = true）。
- **exclude**：要跳过的包；支持精确名称与正则表达式模式，例如 `["exact-package", "/or-a-regex-.*/"]`。
- **listUnknownPackages**：默认对缺失于 React Native Directory 的包发出警告；设为 false 可禁用。

## 初始化一个启用新架构的新项目

从 SDK 52 起，所有新项目默认启用：

```sh
# npm
npx create-expo-app@latest

# yarn
yarn create expo-app

# pnpm
pnpm create expo-app

# bun
bun create expo
```

## 在现有项目中启用新架构

#### SDK 55 及以后

始终启用；没有禁用选项。SDK 55 使用 RN 0.83。"[React Native 0.82 是第一个移除禁用新架构选项的版本](https://reactnative.dev/blog/2025/10/08/react-native-0.82)"，之后的版本同样如此。之前的 `newArchEnabled: false` 会被忽略 —— 删除它以避免混淆。

#### SDK 53 与 SDK 54

默认启用。如果你显式禁用了它，删除该配置即可启用。

:::note
SDK 54 是最后一个可以禁用新架构的 SDK 版本。
:::

#### SDK 52

建议升级到 SDK 53，以获得库与 React Native 本身最新的新架构修复。要现在就在 SDK 52 上试用：

通过应用配置中 `expo` 对象根部的 `newArchEnabled` 在双平台启用；也可以只为单个平台启用，例如 `"android": { "newArchEnabled": true }`。

```json app.json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

创建一个新构建：

#### Android

```sh
# npm
# Run a clean prebuild and start a local build, if you like
npx expo prebuild --clean && npx expo run:android
# Run a build with EAS if you prefer
eas build -p android

# yarn
# Run a clean prebuild and start a local build, if you like
yarn expo prebuild --clean && yarn expo run:android
# Run a build with EAS if you prefer
eas build -p android

# pnpm
# Run a clean prebuild and start a local build, if you like
pnpm expo prebuild --clean && pnpm expo run:android
# Run a build with EAS if you prefer
eas build -p android

# bun
# Run a clean prebuild and start a local build, if you like
bun expo prebuild --clean && bun expo run:android
# Run a build with EAS if you prefer
eas build -p android
```

#### iOS

```sh
# npm
# Run a clean prebuild and start a local build, if you like
npx expo prebuild --clean && npx expo run:ios
# Run a build with EAS if you prefer
eas build -p ios

# yarn
# Run a clean prebuild and start a local build, if you like
yarn expo prebuild --clean && yarn expo run:ios
# Run a build with EAS if you prefer
eas build -p ios

# pnpm
# Run a clean prebuild and start a local build, if you like
pnpm expo prebuild --clean && pnpm expo run:ios
# Run a build with EAS if you prefer
eas build -p ios

# bun
# Run a clean prebuild and start a local build, if you like
bun expo prebuild --clean && bun expo run:ios
# Run a build with EAS if you prefer
eas build -p ios
```

构建成功意味着应用运行在新架构上；取决于原生模块，它可能立即就能工作。测试应用 —— 非平凡的应用很可能会遇到问题，例如某些原生视图还没有为新架构实现。许多问题都可以通过配置或代码修改解决；参见[故障排查](/guides/new-architecture#troubleshooting)。

#### SDK 51 及更早

建议升级到 SDK 54 或 55；SDK 51 已经明显过时，且旧架构已冻结（没有新特性或错误修复）。在 SDK 51 上启用是可能的，但很可能遇到在较新版本中已解决的问题。你必须[安装 `expo-build-properties` 插件](/versions/latest/sdk/build-properties#installation)并按平台设置 `newArchEnabled`。

#### 你是在现有 React Native 项目中启用新架构吗？

在 Expo SDK 53+ 上，它默认启用；在 SDK 55+ 上始终启用且无法禁用。以下适用于 SDK 52 及更早：

- **Android**：在 **gradle.properties** 中设置 `newArchEnabled=true`。
- **iOS**：如果项目有 **Podfile.properties.json**（由 `npx create-expo-app` 或 `npx expo prebuild` 创建），把 `newArchEnabled` 属性设为 `"true"`。否则参见 React Native 新架构工作组的["为新架构启用应用"](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md)一节。

## 在现有项目中禁用新架构

:::warning
SDK 55 及以后不支持禁用。SDK 55 使用 RN 0.83，而从 [React Native 0.82 起禁用的选项已被移除](https://reactnative.dev/blog/2025/10/08/react-native-0.82)；设置 `newArchEnabled` 为 `false` 没有效果。要使用旧架构，请使用 SDK 54 或更早版本。
:::

:::warning
Expo Go 仅支持新架构。
:::

在 **SDK 54 及更早**上，在应用配置中把 `newArchEnabled` 设为 `false` 并创建一个[开发构建](/develop/development-builds/introduction)即可退出。

```json app.json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

#### 你是在现有 React Native 项目中禁用新架构吗（SDK 54 及更早）？

- **Android**：在 **gradle.properties** 中设置 `newArchEnabled=false`。
- **iOS**：如果有 **Podfile.properties.json**，把 `newArchEnabled` 属性设为 `"false"`。否则参考工作组的["为新架构启用应用"](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md)一节。

## 故障排查

Meta 与 Expo 的目标是让新架构成为新应用的默认选择并易于迁移。但 React Native 的大量内部实现被重新设计、重建，启用它时可能会出现一些问题。以下是一些建议。

#### 即使我使用的一些库不受支持，我仍然可以试用新架构吗？

有可能，通过暂时移除不受支持的库。创建一个新分支，移除不兼容的库直到应用能运行 —— 这会揭示完整迁移前还有哪些工作要做。在这些库的仓库提交 issue 或 PR，或切换到兼容的替代方案。使用 [React Native Directory](https://reactnative.directory/) 寻找兼容的库。

#### React Native 中的已知问题

参见 [React Native GitHub 仓库上标记为 "Type: New Architecture" 的 issue](https://github.com/facebook/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22Type%3A+New+Architecture%22)。

#### Expo 库中的已知问题

Expo 库中没有新架构特有的已知问题。

#### 第三方库中的已知问题

自 RN 0.74 起，各种互操作层（Interop Layers）默认启用，让许多旧架构库无需修改即可在新架构上工作。互操作并不完美，因此一些库需要更新 —— 最可能是那些附带或依赖第三方原生代码的库。[了解更多关于库支持的信息](https://github.com/reactwg/react-native-new-architecture/discussions/167)。

[React Native Directory](https://reactnative.directory/) 有更完整的兼容性列表。Expo 应用常用且已知不兼容的库：

- **react-native-maps**：1.20.x（SDK 53 的默认版本）通过互操作层支持新架构，大多数功能工作良好。新架构优先的版本（1.21.0）仍在稳定中；鼓励测试与报告 issue，你可以[关注 GitHub 讨论](https://github.com/react-native-maps/react-native-maps/discussions/5355)。另一种方式 —— 依赖[互操作层](https://github.com/reactwg/react-native-new-architecture/discussions/175)而不是重写 —— 正在调研中。如果应用可以要求 iOS 17 最低版本，或者不需要 iOS 地图，考虑使用 [`expo-maps`](/versions/latest/sdk/maps)。
- **@stripe/react-native**：从 0.45.0 版本开始支持新架构，这是 SDK 53 的默认版本。
- **@react-native-community/masked-view**：改用 `@react-native-masked-view/masked-view`。
- **@react-native-community/clipboard**：改用 `@react-native-clipboard/clipboard`。
- **rn-fetch-blob**：改用 `react-native-blob-util`。
- **react-native-fs**：改用 `expo-file-system` 或 [react-native-fs 的一个 fork](https://github.com/birdofpreyru/react-native-fs)。
- **react-native-geolocation-service**：改用 `expo-location`。
- **react-native-datepicker**：改用 `react-native-date-picker` 或 `@react-native-community/datetimepicker`。

#### 启用新架构后我的构建失败了

这不完全出乎意料 —— 并非所有库都兼容，而且一些库最近才获得兼容性，所以把库更新到最新版本。阅读日志找出不兼容的库，并运行 `npx expo-doctor@latest` 根据 React Native Directory 数据检查依赖。如果最新版本的库仍然不兼容，带着[最小可复现示例](https://stackoverflow.com/help/minimal-reproducible-example)向相应的 GitHub 仓库报告问题。如果问题似乎源于 React Native 本身，同样带着最小可复现示例向 React Native 团队报告。
