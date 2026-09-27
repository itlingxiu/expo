---
title: 工具、工作流与扩展
description: 扩展开发构建的能力，实现更快的迭代、更好的团队工作流或自定义需求。
---

# 工具、工作流与扩展

通过以下工具、工作流与扩展，扩展开发构建的能力，实现更快的迭代、更好的团队工作流或自定义需求。

## 工具

### 隧道 URL

受限网络可能会阻断开发服务器的连接。`npx expo start` 可以把服务器暴露在一个公网 URL 上，让全世界都能穿过防火墙访问 —— 当默认的 LAN 方式不可用，或在开发过程中想征求反馈时很有用。用 `--tunnel` 标志启用（参见 [Expo CLI](/more/expo-cli) 中的隧道说明）。

### 已发布的更新

`eas update` 把当前的 JavaScript 与资源打包成一个优化过的"更新（update）"，由 Expo 托管。开发构建可以加载已发布的更新，而无需检出某个提交，也不必让开发机一直运行。

### 手动输入更新 URL

启动时，开发构建会显示界面让你加载开发服务器或"手动输入 URL"（Enter URL manually）。你可以在那里提供一个 URL 来启动特定分支：

```text
https://u.expo.dev/[your-project-id]?channel-name=[channel-name]

# 示例
https://u.expo.dev/F767ADF57-B487-4D8F-9522-85549C39F43F?channel-name=main
```

项目 ID 可以从应用配置的 `expo.updates.url` 字段获取；用 `eas channel:list` 列出频道（channel）。

### 深链接到更新 URL

在装有兼容自定义客户端构建的设备上，打开形如 `{scheme}://expo-development-client/?url={manifestUrl}` 的 URL。

| 参数 | 值 |
| --- | --- |
| `scheme` | 客户端的 URL scheme（默认为 `exp+{slug}`，`slug` 来自应用配置） |
| `manifestUrl` | 要加载的更新清单（manifest）的 URL 编码值；即 `https://u.expo.dev/[your-project-id]?channel-name=[channel-name]` |

示例：

```text
exp+app-slug://expo-development-client/?url=https%3A%2F%2Fu.expo.dev%2F767ADF57-B487-4D8F-9522-85549C39F43F%2F%3Fchannel-name%3Dmain
```

这里 `scheme` 是 `exp+app-slug`，清单的项目 ID 是 `F767ADF57-B487-4D8F-9522-85549C39F43F`，频道为 `main`。

#### 在自动化场景中使用更新深链接

在 CI/CD 或端到端测试中，可以使用这些查询参数。为获得跨平台一致的行为，把 `disableOnboarding=1` 追加到应用 URL 后再编码为 `url`；把 `disableFab=1` 和 `disableAutoLaunch=1` 放在开发客户端深链接本身、`url` 旁边。

| 参数 | 值 |
| --- | --- |
| `disableOnboarding=1` | 跳过安装后首次启动显示的引导页 |
| `disableFab=1` | 隐藏 Tools 按钮（打开开发菜单的悬浮按钮） |
| `disableAutoLaunch=1` | 应用启动时不自动打开开发菜单 |

`disableFab` 与 `disableAutoLaunch` 会更新已保存的开发菜单设置 —— 在真机上很有用，因为自动化无法从开发机更改设置。任一设置都可以从开发菜单重新开启。

#### 应用专属深链接

测试深链接（例如 Expo Router 的页面导航或 OAuth 重定向）时，像独立构建一样构造 URL，例如 `myscheme://path/to/screen`。项目必须已在开发构建中打开；目前不支持用应用专属深链接冷启动。应用专属深链接中不要包含 `expo-development-client` —— 那是加载更新 URL 的保留路径。

### 二维码

端点 `https://qr.expo.dev/development-client` 在给定查询参数时，返回一个可由开发构建加载的 SVG 二维码：

| 参数 | 值 |
| --- | --- |
| `appScheme` | 开发构建的深链接 scheme（URL 编码，默认为 `exp+{slug}`） |
| `url` | 要加载的更新清单 URL（URL 编码） |

示例：

```text
https://qr.expo.dev/development-client?appScheme=exp%2Bapps-slug&url=https%3A%2F%2Fu.expo.dev%2FF767ADF57-B487-4D8F-9522-85549C39F43F0%3Fchannel-name%3Dmain
```

## 示例工作流

以下是团队可参考的示例工作流；欢迎通过 PR 提交有用的补充。

### PR 预览

配置 CI，让每次拉取请求（pull request）变更时发布一个 EAS Update，并附带一个二维码，在兼容的开发构建中查看变更。参见[在拉取请求上发布应用预览](https://github.com/expo/expo/blob/main/.github/workflows/preview.yml)的说明（GitHub Actions 链接，可作为 CI 模板使用）。

## 扩展

扩展为开发客户端增加能力。

### 扩展开发菜单

用 `registerDevMenuItems` API 添加按钮：

```tsx
import { registerDevMenuItems } from 'expo-dev-menu';

const devMenuItems = [
  {
    name: 'My Custom Button',
    callback: () => console.log('Hello world!'),
  },
];

registerDevMenuItems(devMenuItems);
```

这会创建一个新的开发菜单区块，包含注册的按钮。

:::note
后续对 `registerDevMenuItems` 的调用会覆盖之前的所有条目。
:::

### EAS Update 扩展

EAS Update 扩展让你在开发客户端中查看并加载已发布的更新。用最新的 `expo-updates` 发布安装它：

```sh
# npm
npx expo install expo-dev-client expo-updates

# yarn
yarn expo install expo-dev-client expo-updates

# pnpm
pnpm expo install expo-dev-client expo-updates

# bun
bun expo install expo-dev-client expo-updates
```

#### 配置 EAS Update

如果还没有配置 EAS Updates，参见[开始使用 EAS Update](/eas-update/getting-started)中的附加说明。配置完成后，就可以通过 **Extensions** 面板查看并加载更新。

## 在应用配置中设置 runtimeVersion

开发构建为 JavaScript 或资源相关的改动提供了稳定的环境。直接在 **android**/**ios** 目录中做的修改，或通过安装的包/SDK 带来的修改，都需要新的构建。要在 JavaScript 与原生层之间强制一个 API 契约，可以在应用配置中设置 `runtimeVersion`（参见[运行时版本](/eas-update/runtime-versions)）：每个构建都内嵌该值，并且只加载版本相同的 bundle，开发与生产环境都是如此。
