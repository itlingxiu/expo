---
title: 为 iOS 模拟器创建并运行云构建
description: 学习如何使用 EAS Build 为 iOS 模拟器配置开发构建。
---

# 为 iOS 模拟器创建并运行云构建

在本章中，我们将用 EAS Build 创建一个可以在 iOS 模拟器上运行的开发构建。

面向 iOS 模拟器的开发构建以 **.app** 格式生成，这与 iOS 设备不同。

[观看视频：为 iOS 模拟器创建开发构建](https://www.youtube.com/watch?v=SgL97PFZctg) —— 学习如何在 eas.json 中创建模拟器构建 profile，并在 iOS 模拟器上运行开发构建。

---

## 在 eas.json 中创建模拟器构建 profile

在 **eas.json** 中添加一个名为 `ios-simulator` 的新构建 profile，并设置 [`ios.simulator`](/eas/json#simulator) 属性。把它的值设为 `true`：

```json eas.json
{
  "build": {
    "development": {},
    "ios-simulator": {
      "ios": {
        "simulator": true
      }
    }
  }
}
```

`simulator` 属性是 iOS 模拟器构建所必需的。

对于开发构建，profile 中必须定义 `developmentClient` 和 `distribution` 属性。为避免重复，可以扩展 `development` profile 的属性：

```json eas.json
{
  "ios-simulator": {
    "extends": "development",
    "ios": {
      "simulator": true
    }
  }
}
```

`extends` 关键字会继承 `development` profile 的属性。

## 面向 iOS 模拟器的开发构建

### 1. 创建

以 `ios` 为平台、`ios-simulator` 为构建 profile 运行 `eas build` 命令：

```sh
eas build --platform ios --profile ios-simulator
```

第一次创建构建时，这条命令会向我们提出以下问题：

- **What would you like your iOS bundle identifier to be?** 按 <kbd>Return</kbd> 选择该提示提供的默认值。这会在 **app.json** 中添加 [`ios.bundleIdentifier`](/versions/latest/config/app#bundleidentifier)。
- **iOS app only uses standard/exempt encryption?** 按 <kbd>Y</kbd> 选择该提示提供的默认值。由于我们的应用不使用加密，它会把 **Info.plist** 文件中的 `ITSAppUsesNonExemptEncryption` 设为 `NO`，并在你把应用发布到 TestFlight / Apple App Store 时处理相应的合规检查。当你发布自己的应用且它使用加密时，可以选择 `N`，以便下次跳过这个提示。

回答提示后，我们的 EAS Build 会进入队列，EAS CLI 会提供一个链接，用于在 EAS 仪表板上查看构建详情并跟踪进度：

![iOS 模拟器构建详情页](/static/images/tutorial/eas/ios-sim-build.png)

<details>
<summary>构建详情页包含什么？</summary>

构建详情页显示构建类型、profile、Expo SDK 版本、应用版本、构建号、最近一次提交哈希，以及发起构建的开发者或账户所有者的身份。

在上图中，**Build artifact** 的当前状态显示构建正在进行。完成后，这一节会提供下载构建的选项。**Logs** 列出了 EAS Build 上 iOS 构建过程中的每一步。为求简洁，这里不逐一展开。要了解更多，参见 [iOS 构建过程](/build-reference/ios-builds)。

</details>

<details>
<summary>什么是 iOS bundle identifier？</summary>

`ios.bundleIdentifier` 是我们应用的唯一名称。如果我们现在发布应用，Apple App Store 会用这个属性及其值在商店中识别我们的应用。

这种记法定义为 `host.owner.app-name`。例如，我们的示例应用是 `com.owner.stickersmash`，其中 `com.owner` 是域名，`stickersmash` 是应用名称。

</details>

### 2. 安装

在终端中，构建完成后，EAS CLI 会询问是否要在 iOS 模拟器上运行该构建。按 <kbd>Y</kbd>。

![EAS CLI 自动提供在 iOS 模拟器上运行构建的选项](/static/images/tutorial/eas/ios-sim-cli.png)

<details>
<summary>替代方案：使用 Expo Orbit</summary>

可以使用 [Expo Orbit](https://expo.dev/orbit) 安装开发构建。在 EAS 仪表板的 **Build artifact** 中，点击 **Open with Expo Orbit**，把开发构建安装到 iOS 模拟器。

</details>

### 3. 运行

在项目目录中运行 `npx expo start` 命令，启动开发服务器：

:::tabs
:::tab npm
```sh
npx expo start
```
:::
:::tab yarn
```sh
yarn expo start
```
:::
:::tab pnpm
```sh
pnpm expo start
```
:::
:::tab bun
```sh
bun expo start
```
:::
:::

在终端窗口中按 <kbd>I</kbd>，在 iOS 模拟器上打开项目。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
