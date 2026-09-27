---
title: DevClient 包参考
description: 用于创建开发构建并包含实用开发工具的库。
---

# DevClient 包参考

`expo-dev-client` 为调试构建添加各种实用的开发工具：

- 可配置的启动器界面，因此你可以启动更新（例如来自 [PR 预览](/develop/development-builds/development-workflows#pr-previews)），并在开发服务器之间切换，而无需重新编译原生应用
- 改进的调试工具（例如支持[检查网络请求](/debugging/tools#inspecting-network-requests-expo-only)）
- [强大且可扩展的开发者菜单界面](/debugging/tools#developer-menu)

> 支持平台：Android、iOS、tvOS。

Expo 文档把包含 `expo-dev-client` 的调试构建称为[开发构建](/develop/development-builds/introduction)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-dev-client
```
:::
:::tab yarn
```sh
yarn expo install expo-dev-client
```
:::
:::tab pnpm
```sh
pnpm expo install expo-dev-client
```
:::
:::tab bun
```sh
bun expo install expo-dev-client
```
:::
:::

使用 EAS Build 创建构建时，在 **eas.json** 的某个构建 profile 上把 `developmentClient` 设为 `true`。否则，EAS Build 会生成不含开发工具的独立构建。例如：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

更多信息见 [eas.json 参考中的 `developmentClient` 属性](/eas/json#developmentclient)。

如果要安装到[已有的 React Native 应用](/bare/overview)，请先在项目中安装 [`expo`](/bare/installing-expo-modules)。然后按照[在已有 React Native 项目中安装 `expo-dev-client`](/bare/install-dev-builds-in-bare) 的说明操作。

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置开发客户端启动器。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-dev-client",
        {
          "launchMode": "most-recent",
          "defaultLaunchURL": "http://localhost:8081",
          "android": {
            "defaultLaunchURL": "http://10.0.2.2:8081"
          },
          "toolsButton": true,
          "skipOnboarding": false,
          "showMenuAtLaunch": true
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `launchMode` | `"most-recent"` | 决定是启动最近打开的项目，还是进入启动器界面。`most-recent`：尝试直接启动先前打开的项目，如果无法连接，则回退到启动器界面。`launcher`：打开启动器界面。 |
| `addGeneratedScheme` | `true` | 默认情况下，`expo-dev-client` 会注册一个自定义 URL scheme 来打开项目。将此属性设为 `false` 可禁用该 scheme。 |
| `defaultLaunchURL` |  | 直接启动到此 URL，而不是进入启动器界面。如果 `launchMode` 设为 `most-recent`，则启动器会把 `defaultLaunchURL` 用作回退。 |
| `toolsButton` | `true` | 是否默认显示浮动工具按钮。使用 `expo-dev-client` 的 `setToolsButtonVisible` 可在运行时更改。 |
| `skipOnboarding` | `false` | 跳过应用首次启动时在开发者菜单中显示的引导界面。 |
| `showMenuAtLaunch` | `true` | 应用启动后立即显示开发者菜单。 |

## TV 支持

- **Android TV**：支持所有操作，与 Android 手机类似。
- **Apple TV**：支持使用本地或隧道打包器的基本操作。尚不支持对 EAS 进行身份验证，以及列出 EAS 构建和更新。

## API

```js
import * as DevClient from 'expo-dev-client';
```
