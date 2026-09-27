---
title: 链接到其他应用
description: 了解如何基于其他应用的 URL scheme，从你的应用中处理并打开 URL。
---

# 链接到其他应用

从你的应用链接到其他应用，是通过使用目标应用的 URL 来实现的。你可以使用以下两种方法从应用中打开这类 URL：

- 使用 [`expo-linking`](/versions/latest/sdk/linking) API
- 使用 Expo Router 的 [`Link` 组件](/develop/app-navigation)

## 使用 expo-linking API

[`expo-linking`](/versions/latest/sdk/linking) API 提供了对原生链接 API（例如 Web 上的 `window.history`）的通用抽象，并提供了让你的应用与其他已安装应用进行交互的实用工具。

下面的示例使用 [`Linking.openURL`](/versions/latest/sdk/linking#linkingopenurlurl) 在操作系统默认浏览器中打开一个[常用 URL scheme](#常用-url-scheme)：

```tsx index.tsx
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

export default function Home() {
  return (
    <View style={styles.container}>
      <Button title="Open a URL" onPress={() => Linking.openURL('https://expo.dev/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## 使用 Expo Router 的 Link 组件

如果你的项目使用 [Expo Router](/router/introduction)，可以使用 `Link` 组件打开 URL。它在原生平台包装一个 `<Text>` 组件，在 Web 上包装一个 `<a>` 元素。它同样使用 `expo-linking` API 来处理 URL scheme。

下面的示例在操作系统默认浏览器中打开一个[常用 URL scheme](#常用-url-scheme)（HTTPS）：

```tsx index.tsx
import { Button, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Link href="https://expo.dev">Open a URL</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## 常用 URL scheme

有一些内置的 URL scheme，可以在所有平台上访问核心功能。下面是常用 scheme 的列表：

| Scheme | 描述 | 示例 |
| --- | --- | --- |
| `https` / `http` | 打开 Web 浏览器应用。 | `https://expo.dev` |
| `mailto` | 打开邮件应用。 | `mailto:support@expo.dev` |
| `tel` | 打开电话应用。 | `tel:+123456789` |
| `sms` | 打开短信应用。 | `sms:+123456789` |

<details>
<summary>指定 Android intent 以处理常用 URL scheme</summary>

对于 Android 11（API level 30）及以上版本，你必须在 **AndroidManifest.xml** 文件中指定应用要处理的 intent。你可以通过[创建配置插件](/config-plugins/plugins#创建配置插件)来实现。

下面的配置插件示例通过定义 intent，启用了到邮件和电话应用的链接：

```ts my-plugin.ts
import { withAndroidManifest, ConfigPlugin } from 'expo/config-plugins';

const withAndroidQueries: ConfigPlugin = config => {
  return withAndroidManifest(config, config => {
    config.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.SENDTO' } }],
            data: [{ $: { 'android:scheme': 'mailto' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.DIAL' } }],
          },
        ],
      },
    ];

    return config;
  });
};

module.exports = withAndroidQueries;
```

创建配置插件后，在 `plugins` 属性下[导入该自定义配置插件](/config-plugins/plugins#从动态应用配置调用配置插件)：

```json app.json
{
  "expo": {
    "plugins": [
      "./my-plugin.ts"
      /* @hide ... */ /* @end */
    ]
  }
}
```

:::note
提示：在 Android 上，你可以使用 `expo-intent-launcher` 打开设备上**特定的设置屏幕**。参见 [`expo-intent-launcher` API 参考](/versions/latest/sdk/intent-launcher#enums)查看可用 intent 的列表。
:::

</details>

## 自定义 URL scheme

> 如果你知道要打开的应用的自定义 scheme，可以使用以下任一方法链接到它：[使用 `expo-linking` API](#使用-expo-linking-api)或[使用 Expo Router 的 `Link`](#使用-expo-router-的-link-组件)。

一些服务提供了关于如何使用其应用自定义 URL scheme 的文档。例如，[Uber 的深层链接文档](https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction#standard-deep-links)描述了如何直接链接到特定的上车地点和目的地：

```shell
uber://?client_id=<CLIENT_ID>&action=setPickup&pickup[latitude]=37.775818&pickup[longitude]=-122.418028&pickup[nickname]=UberHQ&pickup[formatted_address]=1455%20Market%20St%2C%20San%20Francisco%2C%20CA%2094103&dropoff[latitude]=37.802374&dropoff[longitude]=-122.405818&dropoff[nickname]=Coit%20Tower&dropoff[formatted_address]=1%20Telegraph%20Hill%20Blvd%2C%20San%20Francisco%2C%20CA%2094133&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383
```

在上面的示例中，如果用户的设备上没有安装 Uber 应用，你的应用可以引导他们到 Google Play Store 或 Apple App Store 进行安装。我们推荐使用 [`react-native-app-link`](https://github.com/FiberJW/react-native-app-link) 库来处理这类场景。

<details>
<summary>为 iOS 指定自定义 scheme</summary>

在 iOS 上，使用 [`Linking.canOpenURL`](/versions/latest/sdk/linking#linkingcanopenurlurl)查询其他应用的链接 scheme 需要在 **InfoPlist** 中进行额外配置。你可以使用应用配置中的 [`ios.infoPlist`](/versions/latest/config/app#infoplist) 属性来指定你的应用允许查询的 scheme 列表。例如：

```json app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["uber"]
      }
    }
  }
}
```

如果不指定这个列表，即使设备上安装了目标应用，`Linking.canOpenURL` 也可能返回 `false`。

:::note
提示：要在 iOS 设备上测试上述配置，请[使用开发构建](/develop/development-builds/introduction)。它无法用 Expo Go 测试。
:::

</details>

## 创建 URL

你可以使用 [`Linking.createURL`](/versions/latest/sdk/linking#linkingcreateurlpath-namedparameters)来创建一个 URL，用于打开或重定向回你的应用。该方法根据环境解析为以下结果：

- **生产构建和开发构建**：`myapp://`，其中 `myapp` 是应用配置中定义的[自定义 scheme](/linking/into-your-app#在应用配置中添加自定义-scheme)
- **在 Expo Go 中开发**：`exp://127.0.0.1:8081`

使用 `Linking.createURL` 可以帮助你避免硬编码 URL。你可以通过向该方法传入可选参数来修改返回的 URL。

要向应用传递数据，可以将其作为路径或查询字符串附加到 URL 上。`Linking.createURL` 会自动构造一个可用的 URL。例如：

```tsx 示例
const redirectUrl = Linking.createURL('path/into/app', {
  queryParams: { hello: 'world' },
});
```

根据环境的不同，这会解析为以下结果：

- **生产构建和开发构建**：`myapp://path/into/app?hello=world`
- **在 Expo Go 中开发**：`exp://127.0.0.1:8081/--/path/into/app?hello=world`

<details>
<summary>使用 Expo Go 进行测试？</summary>

对于需要稳定 URL 的应用（例如认证提供方的重定向），请使用带自定义 scheme 的开发构建，而不是 Expo Go。有关如何创建和测试自定义 scheme 的更多详情，请参见[链接到你的应用](/linking/into-your-app)。

</details>

## 应用内浏览器

`expo-linking` API 允许你使用操作系统默认的 Web 浏览器应用打开 URL。你可以使用 [`expo-web-browser`](/versions/latest/sdk/webbrowser) 库在应用内浏览器中打开 URL。例如，应用内浏览器对于安全的[认证](/guides/authentication)非常有用。

<details>
<summary>在应用内浏览器中打开 URL 的示例</summary>

下面的示例模拟了两种打开 URL 的行为：使用 `expo-web-browser` 在应用内浏览器中打开，以及使用 `expo-linking` 在默认或首选 Web 浏览器中打开：

```tsx
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export default function Home() {
  return (
    <View style={styles.container}>
      <Button
        title="Open URL with the system browser"
        onPress={() => Linking.openURL('https://expo.dev')}
        style={styles.button}
      />
      <Button
        title="Open URL with an in-app browser"
        onPress={() => WebBrowser.openBrowserAsync('https://expo.dev')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 10,
  },
});
```

</details>

## Web 上的其他链接功能

要在 Web 上提供额外的链接功能，例如右键复制或悬停预览，你可以使用 [`expo-router`](/router/introduction) 库中的 `Link` 组件：

```tsx index.tsx
import { Link } from 'expo-router';

export default function Home() {
  return <Link href="https://expo.dev">Go to Expo</Link>;
}
```

或者，你可以使用 [`@expo/html-elements`](https://www.npmjs.com/package/@expo/html-elements) 库来使用通用的 `<A>` 元素：

```tsx index.tsx
import { A } from '@expo/html-elements';

export default function Home() {
  return <A href="https://expo.dev">Go to Expo</A>;
}
```

`<A>` 组件在 Web 上渲染为 `<a>` 元素，在原生平台渲染为使用 `expo-linking` API 的可交互 `<Text>`。
