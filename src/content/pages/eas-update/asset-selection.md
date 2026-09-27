---
title: 资源选择与排除
description: 了解如何使用资源选择功能，并验证更新包含应用所需的全部资源。
---

# 资源选择与排除

实验性的**资源选择功能**允许开发者指定更新中只应包含某些资源。这可以大幅减少需要上传到更新服务器以及从更新服务器下载的资源数量。该功能适用于 EAS Update 服务器，或任何符合 [`expo-updates` 协议](/technical-specs/expo-updates-1)的自定义服务器。

SDK 52 将该功能推向正式可用。

## 使用资源选择

要在低于 52 的 SDK 版本中使用资源选择，请在应用配置中加入属性 `extra.updates.assetPatternsToBeBundled`。它应定义一个或多个文件匹配模式（正则表达式）。例如，**app.json** 文件按如下方式定义这些模式：

```json app.json
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "extra": {
      "updates": {
        "assetPatternsToBeBundled": [
          "app/images/**/*.png"
        ]
      }
    }
  }
```

要在 SDK 52 及更高版本中使用资源选择，请在应用配置中加入属性 `updates.assetPatternsToBeBundled`。它应定义一个或多个文件匹配模式（正则表达式）。例如，**app.json** 文件按如下方式定义这些模式：

```json app.json
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "updates": {
      "assetPatternsToBeBundled": [
        "app/images/**/*.png"
      ]
    }
  }
```

添加此配置后，**app/images** 所有子目录中的全部 **.png** 文件都会包含在更新中。你还需要确保这些资源在 JavaScript 代码中被 require。

如果应用配置中没有 `assetPatternsToBeBundled`，打包器解析到的所有资源都会包含在更新中（与 SDK 49 及更早版本的行为一致）。

:::note
资源选择控制哪些资源有资格进行 OTA 更新。它不会改变打包进原生二进制文件的资源，因此不会缩短应用启动时间。
:::

## 验证更新包含应用所需的全部资源

使用资源选择时，不匹配任何文件模式的资源仍会在 Metro 打包器中解析。但这些资源不会上传到更新服务器。你必须确认未包含在更新中的资源已经构建进应用的原生构建。

如果你在本地构建应用，或者能够访问用于发布更新的正确构建（具有相同的[运行时版本](/eas-update/runtime-versions)），可以使用 `npx expo-updates assets:verify` 命令。它让你检查发布更新时是否会包含所有必需资源：

```sh
$ npx expo-updates assets:verify <dir>
```

:::note
这条新命令属于 `expo-updates` CLI，该 CLI 也支持 [EAS Update 代码签名](/eas-update/code-signing)。它不属于 [Expo CLI](/more/expo-cli) 或 [EAS CLI](https://github.com/expo/eas-cli)。仅适用于（[`expo-updates`](/versions/latest/sdk/updates) >= 0.24.10）。
:::

你也可以对该命令使用 `--help` 选项查看可用选项：

| 选项 | 描述 |
| --- | --- |
| `<dir>` | Expo 项目目录。默认值：当前工作目录。 |
| `-a, --asset-map-path <path>` | 由命令 `npx expo export --dump-assetmap` 生成的导出结果中 **assetmap.json** 的路径。 |
| `-e, --exported-manifest-path <path>` | 由命令 `npx expo export --dump-assetmap` 生成的导出结果中 **metadata.json** 的路径。 |
| `-b, --build-manifest-path <path>` | Expo 应用构建（**android** 或 **ios**）中由 `expo-updates` 创建的 **app.manifest** 文件路径。 |
| `-p, --platform <platform>` | 可选值：["android", "ios"] |
| `-h, --help` | 用法信息。 |

## 示例

- [工作示例](https://github.com/expo/UpdatesAPIDemo)：查看使用资源选择、`assets:verify` 命令以及其他 EAS Update 功能的可运行示例。
