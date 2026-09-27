---
title: 预编译 Expo Modules
description: 了解预编译 Expo Modules 如何缩短 Android 与 iOS 上的原生构建时间。
---

# 预编译 Expo Modules

原生构建时间会拖慢开发工作流。Expo 为其最复杂的模块提供预编译版本，让项目链接预编译二进制，而不是每次构建都从源码重新编译。在 Android 上，这些二进制以 **.aar** 文件的形式通过 Gradle 链接。在 iOS 上，它们以 `XCFrameworks` 的形式通过 CocoaPods 链接。两者都打包在常规的 Expo npm 包中；尚未预编译的包会自动回退到从源码构建 —— 预编译模块与源码构建模块可以在同一项目中共存。

**大多数项目什么都不用做** —— 在支持的 SDK 版本上，新建项目和已有项目都会自动启用预编译 Expo Modules。

- **Android**：自 SDK 53 起默认启用。
- **iOS**：在 SDK 56 及更高版本中默认启用。在 SDK 55 中，仅在 EAS Build 上默认启用 —— 在 shell 中设置 `EXPO_USE_PRECOMPILED_MODULES=1` 即可为本地构建启用。

<details>
<summary>在 iOS 上禁用</summary>

将 [`expo-build-properties`](/versions/latest/sdk/build-properties) 配置插件的 `ios.usePrecompiledModules` 属性设为 `false`，即可让每个 Expo Module 都从源码构建。这同时适用于本地构建和 EAS Build，并在下次运行 `npx expo prebuild` 时生效：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "usePrecompiledModules": false
          }
        }
      ]
    ]
  }
}
```

也可以直接用 `EXPO_USE_PRECOMPILED_MODULES` 环境变量控制，该变量在 `pod install` 期间读取。对于本地构建，在运行 `pod install`（或 `npx expo run:ios`）之前于 shell 中导出它：

```sh
export EXPO_USE_PRECOMPILED_MODULES=0
```

对于 EAS Build，创建一条 [EAS 环境变量](/eas/environment-variables/manage)：

```sh
eas env:set --name EXPO_USE_PRECOMPILED_MODULES --value 0 --visibility plaintext
```

CLI 会提示你选择该变量适用于哪些环境（`development`、`preview`、`production`）。

</details>

<details>
<summary>通过 Expo Autolinking 禁用特定模块</summary>

在 **package.json** 中用 `buildFromSource` 配置 Expo Autolinking。使用 `".*"` 可退出所有预编译模块，也可以列出具体包名。`android` 与 `ios` 都支持同一设置：

```json package.json
{
  "name": "your-app-name",
  "expo": {
    "autolinking": {
      "android": {
        "buildFromSource": [".*"]
      },
      "ios": {
        "buildFromSource": [".*"]
      }
    }
  }
}
```

通常只有在你自己修改模块源码，或使用会控制原生编译的配置插件选项时才需要这样做。预构建产物附带每个模块的默认构建选项，因此会添加或移除原生依赖的选项（例如 Android 上 `expo-camera` 的 [`barcodeScannerEnabled`](/versions/latest/sdk/camera#configuration-in-app-config)）只有在模块从源码构建时才会生效。

</details>

<details>
<summary>排查 EAS Build 问题</summary>

### iOS

在 EAS Build 上，`react-native-reanimated` 和 `react-native-worklets` 等第三方库会自动下载为预编译 XCFramework。本地 `pod install` 默认不会获取它们。这些包在本地从源码构建，并会自动应用任何 `staticFeatureFlags` 覆盖，因此标志与版本不匹配主要出现在 EAS Build 上。避免为本地构建启用第三方预编译下载，并把这条路径限定在 EAS。

#### `react-native-reanimated` 与 `react-native-worklets`

这两个包紧密耦合。`react-native-reanimated` 在原生层链接 `react-native-worklets`。

**一起退出两者。** 如果任一包需要源码构建（例如要应用补丁或修改原生代码），请在 `buildFromSource` 中同时列出两者。只对其中一个做源码构建会产生预编译与源码混合的链接，运行时无法解析匹配的 framework：

```json package.json
{
  "expo": {
    "autolinking": {
      "ios": {
        "buildFromSource": ["react-native-reanimated", "react-native-worklets"]
      }
    }
  }
}
```

**自定义功能标志需要源码构建。** 功能标志的值在构建时烘焙进预编译二进制，因此 **package.json** 中任何 `worklets.staticFeatureFlags` 或 `reanimated.staticFeatureFlags` 覆盖都会被忽略。要应用它们，请用 `EXPO_USE_PRECOMPILED_MODULES=0` 禁用预编译模块。

**何时查看这里。** 在 EAS Build 上（本地则没有）出现类似 `Unable to recognize flag: <NAME>` 的运行时错误，意味着预编译产物的标志列表与你锁定的包版本不匹配。请使用上面的 `buildFromSource`，并[在 GitHub 上提交 issue](https://github.com/expo/expo/issues)。

</details>
