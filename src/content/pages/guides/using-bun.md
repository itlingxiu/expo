---
title: 使用 Bun
description: 在 Expo 与 EAS 中使用 Bun 的指南。
---

# 使用 Bun

[Bun](https://bun.sh/) 是一个 JavaScript 运行时，也是 [Node.js](https://nodejs.org/en) 的直接替代方案。在 Expo 项目中，Bun 可以用来安装 npm 包和运行 Node.js 脚本。使用 Bun 的好处是包安装比 npm、pnpm 或 Yarn 更快，并且[启动时间至少比 Node.js 快 4 倍](https://bun.sh/docs#design-goals)，能大幅提升本地开发体验。

## 前置条件

- **机器上已安装 Bun** —— [安装 Bun](https://bun.sh/docs/installation#installing) 以创建新应用。
- **Node.js（LTS）** —— `bun create expo` 与 `bun expo prebuild` 命令仍需要 [Node.js（LTS）版本](https://nodejs.org/)，它们使用 `npm pack` 下载项目模板。

## 用 Bun 开始一个新的 Expo 项目

要创建新项目，运行以下命令：

```sh
bun create expo-app my-app
```

也可以用 `bun run` 运行任何 **package.json** 脚本：

```sh
bun run ios
```

要安装任何 Expo 库，可以使用 `bun expo install`：

```sh
bun expo install expo-audio
```

## 在 EAS 构建中使用 Bun

EAS 根据代码库中的 lockfile 决定使用哪个包管理器。如果希望 EAS 使用 Bun，请在代码库中运行 `bun install`。这会创建 Bun lockfile：Bun 1.2 及更新版本为 **bun.lock**，较旧的 Bun 则为 **bun.lockb**。只要代码库中存在其中一种 lockfile，构建就会使用 Bun 作为包管理器。请务必删除其他包管理器生成的 lockfile。

### 在 EAS 上自定义 Bun 版本

使用 EAS 时默认会安装 Bun。参见 [Android 服务器镜像](/build-reference/infrastructure#android-server-images)和 [iOS 服务器镜像](/build-reference/infrastructure#ios-server-images)，了解构建镜像使用的 Bun 版本。

要在 EAS 上使用[确切的 Bun 版本](/eas/json#bun)，请在 **eas.json** 的构建 profile 配置中添加版本号。例如，下面的配置为 `development` 构建 profile 指定 Bun 版本 `1.0.0`：

```json eas.json
{
  "build": {
    "development": {
      /* @info 在 eas.json 中使用 `bun` 属性指定确切版本。 */
      "bun": "1.0.0"
      /* @end */
      /* @hide 省略 ... */ /* @end */
    }
    /* @hide 省略 ... */ /* @end */
  }
}
```

## 受信任的依赖

与其他包管理器不同，Bun 不会自动执行已安装库的生命周期脚本，因为这被视为安全风险。不过，如果正在安装的包有你希望运行的 `postinstall` 脚本，就必须在 **package.json** 的 [`trustedDependencies`](https://bun.sh/guides/install/trusted) 数组中明确包含该库。

例如，如果你安装了 `packageA`，它依赖 `packageB`，而 `packageB` 有 `postinstall` 脚本，就必须把 `packageB` 加入 `trustedDependencies`。

要在 **package.json** 中添加受信任依赖，请添加：

```json package.json
"trustedDependencies": ["your-dependency"]
```

然后删除 lockfile 并重新安装依赖：

```sh
rm -rf node_modules
rm bun.lock bun.lockb
bun install
```

## 常见错误

### 使用 Sentry 与 Bun 时 EAS Build 失败

如果你使用 `sentry-expo` 或 `@sentry/react-native`，它们依赖 `@sentry/cli`，后者会在构建期间把 source map 更新到 Sentry。`@sentry/cli` 包有一个 `postinstall` 脚本，必须运行后，“上传 source map”脚本才可用。

要修复此问题，把 `@sentry/cli` 添加到 **package.json** 的[受信任依赖](#受信任的依赖)数组中：

```json package.json
"trustedDependencies": ["@sentry/cli"]
```
