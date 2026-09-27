---
title: 自定义链接
description: 了解如何在使用 Expo Router 时，借助 +native-intent 进行链接重定向并利用第三方深层链接。
---

# 自定义链接

Expo Router 使用 Web 标准的扩展版本在应用中导航。不过，原生应用并不总是符合基于服务器的路由。与任何第三方服务集成时，这可能导致不一致。例如，应用可以用任意字符串或 intent 对象启动，而不是 URL。在两种常见场景中，你可能需要自定义链接：

- **应用已关闭**：应用未打开时，传入的深层链接 URL 可能需要改写，以确保导航顺畅。

- **应用已打开**：应用已经打开时，可能需要根据特定业务逻辑或用户交互自定义 URL。该逻辑可以是整个应用的全局逻辑，也可以局限在一组路由上。

## 设置链接

如何在应用中设置并测试链接，见[链接到你的应用](/linking/into-your-app)指南。

## 改写传入的原生深层链接

Expo Router 在求值 URL 时，始终假设该 URL 指向应用内的某个特定页面。但实际上，这些 URL 的性质可能各不相同：

- **来自第三方提供方的唯一/引荐 URL**：这些 URL 通常遵循特定模式，例如 `<my-scheme>://<provider-hostname>/<uuid>`，由外部来源生成，用于把用户导航到应用内的指定内容。
- **来自旧版本的过期 URL**：应用用户可能会遇到旧版本应用的 URL，它们可能指向过时或不存在的内容。处理这些 URL，使用户到达当前内容。

在这些场景中，需要改写 URL，使其正确指向某条路由。

为此，在项目 **src/app** 目录的顶层创建一个名为 **+native-intent.tsx** 的特殊文件。该文件导出专门用于处理 URL/路径的 [`redirectSystemPath`](/versions/latest/sdk/router#nativeintent) 方法。调用时，它会收到一个带有两个属性的 `options` 对象：`path` 和 `initial`。

```text
src/app/+native-intent.tsx
```

下面的示例展示了如何在 **+native-intent.tsx** 文件中使用 `redirectSystemPath`。按照此示例，可以确保应用 URL 处理功能的稳定与可靠，并降低意外错误和崩溃的风险。

```ts src/app/+native-intent.tsx
import ThirdPartyService from 'third-party-sdk';

export function redirectSystemPath({ path, initial }) {
  try {
    if (initial) {
      // 虽然参数名叫 `path`，但不能保证它是路径或有效 URL
      const url = new URL(path, 'myapp://app.home');
      // 第三方 URL 的检测方式会因提供方而异
      if (url.hostname === '<third-party-provider-hostname>') {
        return ThirdPartyService.processReferringUrl(url).catch(() => {
          // 出现了问题
          return '/unexpected-error';
        });
      }
      return path;
    }
    return path;
  } catch {
    // 不要在此函数内崩溃！而应把用户重定向到
    // 用于处理意外错误的自定义路由，让他们能够报告该事件
    return '/unexpected-error';
  }
}
```

## 改写传入的 Web 深层链接

在 Web 上处理深层链接与原生平台不同，因为初始路由过程的发生方式不一样。Expo Router 无法为 Web 提供与 `+native-intent` 直接对应的机制，因为 Web 路由在网站 JavaScript 执行之前就已经解析，并且会因部署输出和所选提供方而不同。

因此，你应该实现最符合需求的下列模式之一：

- **服务器重定向**：所有网站（包括静态页面）都托管在服务器上，可以考虑利用部署提供方提供的服务端重定向或中间件选项。此方法适合以 **server** 或 **static** 输出为目标的部署。
- **客户端重定向**：也可以在应用根 `_layout` 中管理 URL 重定向。此方法适合只有一种输出格式、以客户端渲染为目标的项目。

选择符合你的部署策略和技术要求的模式，以处理 Web 平台上传入的深层链接。

## 改写 URL

应用打开时，可以在 `_layout` 文件中用 `usePathname()` hook 响应 URL 变化。`_layout` 的位置决定了订阅的范围。

- **全局**：把逻辑添加到根 `_layout` 文件
- **局部**：向现有目录添加 `_layout` 文件（或创建新的[分组目录](/router/basics/notation#圆括号)）

```tsx src/app/_layout.tsx
import { Slot, Redirect } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();

  if (pathname && !isUserAllowed(pathname)) {
    return <Redirect href="/home" />;
  }

  return <Slot />;
}
```

### 使用 `redirectSystemPath`

在原生应用中，另一种改写 URL 的方式是在 [`redirectSystemPath`](#使用-redirectsystempath) 方法中处理。对某些用例来说这种方式更简单，但有一些缺点：

- **仅原生**：此方法在 Web 上不起作用，因为 `+native-intent` 只在原生应用中可用。
- **缺少上下文**：`+native-intent` 在应用上下文之外处理。这意味着你无法访问额外逻辑，例如用户认证状态或当前路由的状态。

## 向第三方服务发送导航事件

下面是一个基本示例，说明如何把导航事件发送到外部服务，例如分析或日志服务。具体说明请咨询你的提供方。

```tsx src/app/_layout.tsx
import ThirdPartyService from 'third-party-sdk';
import { Slot, usePathname } from 'expo-router';

const thirdParty = new ThirdPartyService();

export default function RootLayout() {
  const pathname = usePathname();

  // 执行服务初始化逻辑
  useEffect(() => {
    thirdParty.register();
    return () => {
      thirdParty.deregister();
    };
  }, [thirdParty]);

  // 把 pathname 变化发送给第三方
  useEffect(() => {
    thirdParty.sendEvent({ pathname });
  }, [pathname]);

  return <Slot />;
}
```

## 通用链接与多个域名

Expo Router 不需要为通用链接和多个域名做额外配置。提供给应用的所有 URL 都会被求值。要自定义应用的 URL scheme，应[在应用配置中自定义 `scheme` 值](/versions/latest/config/app#scheme)。

## 强制使用 Web 链接

如果希望某个 URL 最初由用户的浏览器求值，请把地址写成带 `http`/`https` scheme 的完全限定 URL（FQDN）。使用完整 URL 可以确保该链接被解释为 Web URL，并默认在用户的浏览器中打开。

此方法适合把用户引导到外部网站，或其他应用的通用链接。

```ts
<Link href="https://my-website.com/router/introduction" />
```

## `legacy_subscribe`

:::warning
`legacy_subscribe` 处于 [alpha](/more/release-statuses#alpha) 阶段，自 SDK 52 起可用。
:::

如果第三方提供方不支持 Expo Router，但通过 `Linking.subscribe` 函数支持现有项目中的 React Navigation，可以把 `legacy_subscribe` 用作替代 API。

不建议在新项目或新集成中使用此 API。它的用法与服务端路由和[静态渲染](/router/web/static-rendering)不兼容，并且在离线或网络连接较差的环境中难以管理。
