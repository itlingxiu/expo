---
title: EAS Update 的 bundle 差异
description: 让项目在有可用补丁时接收 bundle 差异。
---

# EAS Update 的 bundle 差异

使用 bundle 差异时，EAS Update 会在可能的情况下下发 **bundle 补丁**。发布新更新时，EAS Update 可以生成一个更小的文件，其中只包含设备上当前正在运行的 bundle 与新 bundle 之间的差异。这通常能显著减小更新的下载体积。

- **Expo SDK 55 或更高版本**：应用必须使用 Expo SDK 55 或更高版本。

## 启用 bundle 差异

Bundle 差异在两种情况下生效。默认情况下，已经在运行已发布更新的设备，在有更新的更新可用时会收到补丁。选择启用（实验性）后，全新安装上的设备也可以在第一次检查更新时收到补丁，而不是下载完整的新 bundle。

### 更新之间的补丁

在 SDK 56 及更高版本中默认启用。在 SDK 55 上，在项目的[应用配置](/workflow/configuration)中将 `updates.enableBsdiffPatchSupport` 设为 `true` 以选择启用。

```json app.json
{
  "expo": {
    "updates": {
      "enableBsdiffPatchSupport": true
    }
  }
}
```

要在 SDK 56 及更高版本上禁用，将 `enableBsdiffPatchSupport` 设为 `false`。

### 来自嵌入式 bundle 的补丁

:::note
此模式为[实验性](/more/release-statuses#实验性)且需选择启用。标志与行为可能会变化。
:::

要启用，在 **eas.json** 的构建 profile 的 `env` 下设置环境变量 `EAS_UPDATE_EXPERIMENTAL_UPLOAD_EMBEDDED_BUNDLE`：

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "EAS_UPDATE_EXPERIMENTAL_UPLOAD_EMBEDDED_BUNDLE": "1"
      }
    }
  }
}
```

构建完成后，EAS 会上传嵌入式 bundle。之后发布到同一 channel 的更新就可以相对它以补丁形式提供。如果你不使用 EAS Build，可以自行上传嵌入式 bundle。将 `--bundle` 指向 JavaScript bundle，将 `--manifest` 指向原生构建生成的 **app.manifest**：

```sh
$ eas update:embedded:upload --platform [platform] --bundle [path] --manifest [path] --channel [name]
```

## 管理已上传的嵌入式 bundle

用 `eas update:embedded:list` 查找 id，再把它们传给查看或删除命令。

列出为项目注册的嵌入式 bundle：

```sh
$ eas update:embedded:list
```

查看单个嵌入式 bundle：

```sh
$ eas update:embedded:view [id]
```

删除一个嵌入式 bundle：

```sh
$ eas update:embedded:delete [id]
```

该命令可以安全地重试。

## 验证正在提供 bundle 差异

### Expo 网站

你可以在[更新详情](https://expo.dev/accounts/[account]/projects/[project]/updates)页确认正在提供 bundle 差异。打开你发布的 Update Group，然后选择要检查的平台。

![Bundle 差异下载](/static/images/eas-update/bundle-diffing.png)

### Updates API

你可以通过 `Updates.readLogEntriesAsync()` 检查更新日志，确认正在提供 bundle 差异。如果应用收到了补丁，你会看到一条表明补丁已成功应用的记录（例如 "patch successfully applied"）。

## 补丁的生成与提供

EAS Update 使用 [bsdiff 算法](https://en.wikipedia.org/wiki/Bsdiff)生成 bundle 补丁。

仅在以下情况才会提供补丁：

- **它明显小于完整 bundle。** 如果不是，EAS Update 会改为提供完整 bundle。
- **它可以高效计算。** 如果生成补丁过于消耗资源，EAS Update 会改为提供完整 bundle。

## 当前限制

- **全新安装在第一次更新时会收到完整 bundle，除非你选择启用[来自嵌入式 bundle 的补丁](#来自嵌入式-bundle-的补丁)。**
- **并不是每一对可能的更新都会立刻保证有补丁。** 发布更新时，EAS Update 只针对该 channel 上第二新的更新预先计算补丁。如果设备在运行另一个已发布更新时请求这个新更新，一开始会收到完整 bundle。针对该特定基础更新的补丁随后会按需生成，并提供给之后类似的请求。
- **补丁在发布后不久生成。** 从发布更新到补丁就绪可能需要几分钟。在此期间，设备可能会收到完整 bundle。
