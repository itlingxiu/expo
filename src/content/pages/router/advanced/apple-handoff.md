---
title: Apple Handoff
description: 了解如何借助 Expo Router 与 Apple Handoff 在 Apple 设备之间无缝接续应用导航。
---

# Apple Handoff

> 支持平台：iOS、Web。

Apple Handoff 是一项让用户能够在另一台设备上继续浏览你的应用或网站的功能。Expo Router 会自动处理该功能的所有运行时路由逻辑，但一次性配置仍需手动完成。

在 Expo Router 中，底层 iOS API（`NSUserActivity`）需要一个 `webpageUrl`，操作系统建议将其设置为切换到你的应用时的当前 URL。`expo-router/head` 组件自带一个可选的原生模块，可以自动把 `webpageUrl` 设置为 Expo Router 中当前聚焦的路由。

## 设置

以下限制与注意事项非常重要：

- Handoff 仅支持 Apple 平台。
- Handoff 无法在 Expo Go 应用中使用，因为它需要构建时配置。
- Handoff 需要配置[通用链接](/linking/into-your-app)，至少在 iOS 上如此，并且要包含 `activitycontinuation` 对象。
- Handoff 要求在你希望支持的每个页面中都使用 `expo-router/head` 组件；如果希望所有页面都能接续，也可以在根布局中使用。

为确保 **public/.well-known/apple-app-site-association** 文件配置正确，它必须包含 `activitycontinuation` 键，其中的 `apps` 数组需包含应用的 Bundle ID 与 Team ID，格式为 `<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>`。例如 `QQ57RJ5UTD.app.expo.acme`，其中 `QQ57RJ5UTD` 是 Team ID，`app.expo.acme` 是 Bundle ID。

```json public/.well-known/apple-app-site-association
{
  "applinks": {
    "details": [
      {
        "appIDs": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"],
        "components": [
          {
            "/": "*",
            "comment": "匹配所有路由"
          }
        ]
      }
    ]
  },
  "activitycontinuation": {
    "apps": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"]
  },
  "webcredentials": {
    "apps": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"]
  }
}
```

> `webcredentials` 对象是可选的，但建议添加。

你可以根据[应用配置](/versions/latest/config/app)使用以下命令生成 **apple-app-site-association** 文件：

:::tabs
:::tab npm
```sh
npx setup-safari
```
:::
:::tab yarn
```sh
yarn dlx setup-safari
```
:::
:::tab pnpm
```sh
pnpm dlx setup-safari
```
:::
:::tab bun
```sh
bunx setup-safari
```
:::
:::

请参阅[测试深层链接](/linking/into-your-app#测试深层链接)指南，在开发环境中测试 Handoff。

### Expo Head 设置

确保在 `app.config.tsx` 文件中使用 `expo-router` 配置插件设置 Handoff 的来源。当用户切换到你的应用时，该 URL 将被用作 `webpageUrl`。

```tsx app.config.tsx
// 请务必将其改为你项目独有的值。
process.env.EXPO_TUNNEL_SUBDOMAIN = 'bacon-router-sandbox';

const ngrokUrl = `${process.env.EXPO_TUNNEL_SUBDOMAIN}.ngrok.io`;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  // ...
  ios: {
    associatedDomains: [
      `applinks:${ngrokUrl}`,
      `activitycontinuation:${ngrokUrl}`,
      `webcredentials:${ngrokUrl}`,
      // 在此添加其他生产环境 URL。
      // `applinks:example.com`,
      // `activitycontinuation:example.com`,
      // `webcredentials:example.com`,
    ],
  },

  plugins: [
    [
      'expo-router',
      {
        // 注意：headOrigin 中的 URL 必须以 "https://" 开头
        headOrigin:
          process.env.NODE_ENV === 'development'
            ? `https://${ngrokUrl}`
            : 'https://my-website-example.com',
      },
    ],
  ],
};
```

> 测试向原生应用的 Handoff 时，请勿使用仅限开发环境的 `?mode=developer` 后缀。

配置好应用配置后，使用以下命令重新生成原生项目：

:::tabs
:::tab npm
```sh
npx expo prebuild -p ios
```
:::
:::tab yarn
```sh
yarn expo prebuild -p ios
```
:::
:::tab pnpm
```sh
pnpm expo prebuild -p ios
```
:::
:::tab bun
```sh
bun expo prebuild -p ios
```
:::
:::

在开发环境中，你必须**在设备上安装应用之前先启动网站**。这是因为当你安装应用时，操作系统会触发 Apple 的服务器来 ping 你的网站以获取 **.well-known/apple-app-site-association** 文件。如果网站没有运行，操作系统将无法找到该文件，Handoff 也就无法工作。如果出现这种情况，请使用 `npx expo run:ios -d` 重新构建原生应用。

## 使用

在任何希望支持 Handoff 的路由中，使用来自 `expo-router/head` 的 `Head` 组件：

```tsx src/app/index.tsx
import Head from 'expo-router/head';
import { Text } from 'react-native';

export default function App() {
  return (
    <>
      <Head>
        <meta property="expo:handoff" content="true" />
      </Head>
      <Text>Hello World</Text>
    </>
  );
}
```

### Meta 标签

`expo-router/head` 组件支持以下 Meta 标签：

| Meta 标签 | 描述 |
| --- | --- |
| `expo:handoff` | 设为 `true` 可为当前路由启用 Handoff，默认值为 `false`。（仅 iOS） |
| `og:title` 与 `<title>` | 设置 `NSUserActivity` 的标题，Handoff 不使用此字段。 |
| `og:description` | 设置 `NSUserActivity` 的描述，Handoff 不使用此字段。 |
| `og:url` | 设置用户切换到你的应用时应打开的 URL。默认以 `expo-router` 配置插件中的 `headOrigin` 属性作为 baseURL，使用应用内当前 URL。传入相对路径时，会把该路径拼接到 `headOrigin` 之后。 |

你可能需要在不同平台之间切换这些值，此时可以使用 **Platform.select**：

```tsx src/app/index.tsx
import Head from 'expo-router/head';

export default function App() {
  return (
    <Head>
      <meta
        property="og:url"
        content={Platform.select({ web: 'https://expo.dev', default: null })}
      />
    </Head>
  );
}
```

## 调试

确保你的 Apple 设备已[开启 Handoff](https://support.apple.com/en-us/HT209455)。你可以按照以下步骤进行测试，只需把你的应用换成 Safari 即可。

1. 在设备上打开你的原生应用。
2. 导航到应用中支持 Handoff 且正在渲染 Expo Router 的 `<Head />` 组件的路由。
3. 切换到你的 Mac，然后点击 Dock 中应用的 Handoff 图标。
4. 切换到你的 iPhone 或 iPad 时，打开应用切换器，然后点击屏幕底部的应用横幅。

如果你在 iPhone 的应用切换器中只看到 Safari 图标，说明 Handoff 没有生效。

## 故障排查

你可以使用校验工具（例如 [AASA Validator](https://branch.io/resources/aasa-validator/)）来测试 Apple App Site Association 文件（**public/.well-known/apple-app-site-association**）。

如果遇到问题，最好的办法是在应用中启用最激进的 Handoff 设置。这样可以确保任何可能的路由都可以被链接。你可以通过确保 **public/.well-known/apple-app-site-association** 文件匹配所有路由来实现：

```json public/.well-known/apple-app-site-association
{
  "applinks": {
    "details": [
      {
        "appIDs": ["<APPLE_TEAM_ID>.<IOS_BUNDLE_ID>"],
        "components": [
          {
            "/": "*",
            "comment": "匹配所有路由"
          }
        ]
      }
    ]
  }
}
```

在应用中，请确保你没有条件性地渲染 `<Head />` 组件（例如放在 `if/else` 块中），它必须渲染在每一个你希望支持 Handoff 的页面上。在调试期间，我们建议将其添加到[根布局](/router/basics/navigation-layouts#根布局)组件中，以确保每条路由都可以被链接。

在设备上安装应用之前，请确保你可以访问 Ngrok URL（例如通过浏览器）。如果你无法访问该 URL，操作系统将无法找到该文件，Handoff 也就无法工作。

当关联域名配置好后，`npx expo run:ios` 和 Xcode 都会为你的应用进行代码签名，这是 Handoff 和通用链接正常工作的必要条件。

Expo Go 应用不支持 Mac 与 iPhone/iPad 之间的 Handoff。你必须构建应用并安装到设备上。

**如果你在 iPhone 的应用切换器中看到 Safari 图标**，说明 Handoff 没有生效。

- 请确保在测试向原生应用的 Handoff 时没有使用 `?mode=developer` 后缀。
- 另外请确保你没有使用本地开发服务器 URL。例如 `http://localhost:8081` 不能作为有效的应用站点关联链接，请在浏览器中打开正在运行的 Ngrok URL 进行测试。
- 确保你的 **public/.well-known/apple-app-site-association** 文件包含 `activitycontinuation` 字段。
- 我们观察到，在 iOS 16.3.1 和 macOS 13.0（Ventura）中，以 `app.` 和 `io.` 开头的 Bundle ID 有时不会触发原生应用出现在 iOS 任务切换器中。请使用 `com.` 作为 Bundle ID 的第一部分。

你的 **public/.well-known/apple-app-site-association** 必须通过安全 URL（HTTPS）提供服务。如果你使用开发隧道，则必须使用 `EXPO_TUNNEL_SUBDOMAIN` 环境变量来配置开发隧道的子域名。在开发环境中测试时必须使用隧道，因为使用通用链接需要 SSL，Expo CLI 通过运行 `npx expo start --tunnel` 提供了内置支持。

检查你的 **ios/project/project.entitlements** 文件中的 `com.apple.developer.associated-domains` 键。它应该包含与你的 Web 服务器/网站相同的域名。URL 不能包含协议（`https://`）或额外的路径、查询参数和片段。

### 仍然无法解决

> 这是一项重要但配置难度很高的功能。Expo Router 自动化了许多环节，Expo CLI 自动化了大部分配置和托管工作。然而，硬件层面的设置仍可能出现配置错误。

如果以上方法都无效，你可以按照 [Apple 官方文档](https://developer.apple.com/documentation/foundation/task_management/implementing_handoff_in_your_app)中的步骤来调试问题。请注意：

- “将用户活动表示为 `NSUserActivity` 实例。”由 Expo Head 原生模块完成。
- “在用户于应用中执行操作时更新活动实例。”通过挂载/渲染 `<Head />` 组件并在其中放置 Meta 标签 `<meta property="expo:handoff" content="true" />` 来完成。
- “在其他设备的应用中接收来自 Handoff 的活动。”由 Expo Head 原生模块中的 [App Delegate 订阅者](/modules/appdelegate-subscribers)完成。它用于在你 Handoff 到原生应用时将你重定向到正确的路由。

## 已知问题

从 Web 到原生的 Handoff 不支持客户端路由。这意味着应用切换器中显示的 URL 将是你点击链接或刷新页面时所处页面的 URL。这是 Web 平台的限制，Expo Router 无法修复。
