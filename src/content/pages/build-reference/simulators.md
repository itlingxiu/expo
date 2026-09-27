---
title: 为 iOS 模拟器构建
description: 了解使用 EAS Build 时，如何配置并安装面向 iOS 模拟器的构建。
---

# 为 iOS 模拟器构建

在 iOS 模拟器上运行应用的构建很有用。你可以配置构建 profile，并自动把构建安装到模拟器上。这样得到的是独立于 Expo Go 的应用版本，无需部署到 TestFlight，甚至不需要 Apple Developer 账户。

## 配置用于模拟器的 profile

要把应用构建安装到 iOS 模拟器，请修改 [**eas.json**](/build/eas-json) 中的构建 profile，把 `ios.simulator` 设为 `true`：

```json eas.json
{
  "build": {
    "preview": {
      "ios": {
        "simulator": true
      }
    },
    "production": {}
  }
}
```

现在按下面的命令运行构建：

```sh
$ eas build -p ios --profile preview
```

profile 的名称可以随意取。上面的示例叫 `preview`。你也可以叫它 `local`、`simulator`，或任何最合适的名字。

## 把构建安装到模拟器

> 如果还没有安装或运行过 iOS 模拟器，请先阅读 [iOS 模拟器指南](/workflow/ios-simulator)再继续。

构建完成后，CLI 会提示你自动下载并安装到 iOS 模拟器。出现提示时，按 <kbd>Y</kbd> 即可直接安装到模拟器。

如果有多次构建，也可以随时运行 `eas build:run` 命令，下载某一次构建并自动安装到 iOS 模拟器：

```sh
$ eas build:run -p ios
```

该命令还会列出项目中可用的构建。你可以从列表中选择要安装到模拟器的构建。列表中的每次构建都包含构建 ID、自构建创建以来经过的时间、构建号、版本号和 git 提交信息。如果项目中有无效构建，列表也会显示它们。

例如，下图列出了某个项目此前的两次构建：

![运行 eas build:run 命令后，显示项目中可用构建的列表。](/static/images/eas-build/eas-build-run-on-ios.png)

构建安装完成后，它会出现在主屏幕上。如果这是开发构建，打开一个终端窗口，运行 `npx expo start` 启动开发服务器。

### 运行最新构建

向 `eas build:run` 命令传入 `--latest` 标志，即可把最新构建下载并安装到 iOS 模拟器：

```sh
$ eas build:run -p ios --latest
```
