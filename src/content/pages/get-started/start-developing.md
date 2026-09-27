---
title: 开始开发
description: 了解如何启动开发服务器、在设备上打开应用并做出第一个修改。
---

# 开始开发

创建项目之后，就可以开始开发了。本页介绍如何启动开发服务器（Development Server）、在设备上打开应用，并对项目做出你的第一个修改。

## 启动开发服务器

使用你的包管理器运行 start 命令：

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

## 在设备上打开应用

终端中会显示一个二维码，扫描它即可打开应用。在模拟器/仿真器上，按 `A`（Android）或 `I`（iOS）打开应用。

:::note
在 iOS 真机上，Expo Go 仅在 Expo CLI 与 Expo Go 登录同一 Expo 账户时才会打开你的项目。运行 `npx expo login`，然后在 Expo Go 中用该账户登录。
:::

### 疑难排查

- 确认电脑和设备连接到同一个 Wi-Fi 网络。
- 在 iOS 真机上遇到账户相关错误：按提示信息修复 —— 在电脑上运行 `npx expo login` 登录，在 Expo Go 中点击账户图标登录同一账户，然后点击「Try Again」。
- 如果仍然失败（常见于公共网络，因路由器配置导致），改用隧道（Tunnel）连接：

  ```sh
  npx expo start --tunnel
  ```

  :::warning
  隧道模式下的重载速度明显慢于 LAN 或 Local 模式，尽量避免使用；确需隧道时，使用模拟器/仿真器是更快的选择。
  :::

## 做出你的第一个修改

打开 **src/app/index.tsx**，把标题文字 `Welcome to Expo` 替换为 `Hello World!`：

```diff
        <ThemedView style={styles.titleContainer}>
-          <ThemedText type="title">Welcome to Expo</ThemedText>
+          <ThemedText type="title">Hello World!</ThemedText>
        </ThemedView>
```

### 修改没有生效？

默认情况下，Expo Go 会在文件变更时自动重载。如果没有生效：

1. 确认处于开发模式。
2. 关闭并重新打开 Expo 应用。
3. 摇一摇设备打开开发者菜单（Developer Menu，模拟器上按 `Cmd ⌘ + D`）。
4. 检查热重载（Fast Refresh）是否开启；如果菜单中显示的是「Disable Fast Refresh」，说明已开启 —— 关掉菜单再试一次修改。

## 文件结构

**app** 目录用于文件式导航（file-based navigation）：

- **src/app/index.tsx** 与 **src/app/explore.tsx** 定义了两个路由；
- **src/app/_layout.tsx** 通过平台相关的 **AppTabs** 组件设置了标签导航器（tab navigator）。

## 特性

默认模板的亮点是文件式路由（file-based routing）：两个页面（`index.tsx`、`explore.tsx`）的导航在 `_layout.tsx` 中通过 **AppTabs** 配置 —— 在 Android 和 iOS 上使用原生标签（native tabs），在 Web 上使用 Expo Router UI 标签。
