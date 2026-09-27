---
title: 链接到你的应用
description: 了解如何通过创建深层链接，在 React Native 和 Expo 应用中处理传入的 URL。
---

# 链接到你的应用

了解如何通过创建深层链接（Deep Link），在 React Native 和 Expo 应用中处理传入的 URL。

本指南介绍了通过添加自定义 scheme 在项目中配置标准**深层链接**的步骤。

:::note
对于大多数应用，你可能更想设置 [Android 应用链接 / iOS 通用链接](/linking/overview#universal-linking)，而不是本指南介绍的深层链接；也可以两者都设置。
:::

## 在应用配置中添加自定义 scheme

要为你的应用提供链接，请在[应用配置（app config）](/workflow/configuration)的 [`scheme`](/versions/latest/config/app#scheme) 属性中添加一个自定义字符串：

```json app.json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

为应用添加自定义 scheme 后，你需要[创建一个新的开发构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。应用安装到设备上之后，就可以使用 `myapp://` 在应用内打开链接。

如果**没有定义自定义 scheme**，应用会在开发和生产构建中使用 `android.package` 和 `ios.bundleIdentifier` 作为默认 scheme。这是因为 [Expo Prebuild](/more/glossary-of-terms#prebuild) 会自动将这些属性添加为 Android 和 iOS 的自定义 scheme。

## 测试深层链接

你可以使用 [`npx uri-scheme`](https://github.com/expo/expo/tree/main/packages/uri-scheme#readme) 测试打开应用的链接，它是一个用于交互和测试 URI scheme 的命令行工具。

例如，你的应用有一个 `/details` 页面，你希望用户点击链接（无论是通过其他应用还是 Web 浏览器）时打开它，可以运行以下命令来测试这个行为：

```sh
# npm
# If you have `android.package` or `ios.bundleIdentifier` defined in your app.json
npx uri-scheme open com.example.app://somepath/details --android

# If you have a `scheme` defined in your app.json
npx uri-scheme open myapp://somepath/details --ios

# yarn
# If you have `android.package` or `ios.bundleIdentifier` defined in your app.json
yarn dlx uri-scheme open com.example.app://somepath/details --android

# If you have a `scheme` defined in your app.json
yarn dlx uri-scheme open myapp://somepath/details --ios

# pnpm
# If you have `android.package` or `ios.bundleIdentifier` defined in your app.json
pnpm dlx uri-scheme open com.example.app://somepath/details --android

# If you have a `scheme` defined in your app.json
pnpm dlx uri-scheme open myapp://somepath/details --ios

# bun
# If you have `android.package` or `ios.bundleIdentifier` defined in your app.json
bunx uri-scheme open com.example.app://somepath/details --android

# If you have a `scheme` defined in your app.json
bunx uri-scheme open myapp://somepath/details --ios
```

运行上述命令后：

- 会打开应用的 `/details` 页面
- `android` 或 `ios` 选项用于指定链接应该在 Android 还是 iOS 上打开
- 你也可以尝试在设备的 Web 浏览器中点击 `<a href="scheme://">Click me</a>` 这样的链接来打开它。注意，在地址栏中直接输入链接可能无法达到预期效果；要实现这种能力，可以使用[通用链接](/linking/overview#universal-linking)。

#### 使用 Expo Go 测试链接

默认情况下，[Expo Go](https://expo.dev/go) 使用 `exp://` scheme。如果你链接到 `exp://` 且后面没有指定 URL 地址，应用会打开到主页。在开发中，应用的完整 URL 形如 `exp://127.0.0.1:8081`。

在 Expo Go 上测试时，要打开 `/details` 页面，可以使用 `npx uri-scheme`：

```sh
# npm
npx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios

# yarn
yarn dlx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios

# pnpm
pnpm dlx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios

# bun
bunx uri-scheme open exp://127.0.0.1:8081/--/somepath/into/app?hello=world --ios
```

在 Expo Go 中，指定路径时 URL 中会加入 `/--/`。这告诉 Expo Go，它后面的子字符串对应的是深层链接路径，而不是应用本身的路径。

默认情况下，在 Expo Go 中打开 URL 时，`exp://` 会被替换为 `http://`。你也可以使用 `exps://` 打开 `https://` URL。不过，`exps://` 目前不支持加载 TLS 证书不安全的站点。

## 处理 URL

:::note
如果你使用的是 [Expo Router](/linking/overview#use-expo-router-to-handle-deep-linking)，可以跳过本节。
:::

你可以使用 [`expo-linking`](/versions/latest/sdk/linking) 提供的 [`Linking.useLinkingURL()`](/versions/latest/sdk/linking#uselinkingurl) hook 来观察启动应用的链接。

```tsx index.tsx
import * as Linking from 'expo-linking';

export default function Home() {
  const url = Linking.useLinkingURL();

  return <Text>URL: {url}</Text>;
}
```

`Linking.useLinkingURL()` hook 在底层遵循以下命令式方法工作：

- 启动应用的链接最初通过 [`Linking.getInitialURL()`](/versions/latest/sdk/linking#linkinggetinitialurl) 返回
- 应用已处于打开状态时触发的任何新链接，通过 [`Linking.addEventListener('url', callback)`](/versions/latest/sdk/linking#linkingaddeventlistenertype-handler) 来观察

## 解析 URL

你可以使用 [`Linking.parse()`](/versions/latest/sdk/linking#linkingparseurl) 方法从 URL 中解析出**路径（path）**、**主机名（hostname）**和**查询参数（query parameters）**。这个方法会提取深层链接信息，并考虑非标准的实现。

```tsx index.tsx
import * as Linking from 'expo-linking';

export default function Home() {
  const url = Linking.useLinkingURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }

  return (
    Your React component here. 
  )
}
```

## 局限性

如果用户没有安装你的应用，指向你应用的深层链接将无法生效。像 [Branch](https://www.branch.io/deep-linking/) 这样的归因服务提供了条件链接到你的应用或网页的解决方案。

Android 应用链接 / iOS 通用链接是处理这类情况的另一种方案。这种链接类型让应用在用户点击指向你 Web 域名的 HTTP(S) 链接时打开；如果用户没有安装你的应用，链接会将他们带到你的网站。更多详情，请参阅[通用链接](/linking/overview#universal-linking)。
