---
title: Sharing 包参考
description: 提供与其他应用分享和接收数据功能的库。
---

# Sharing 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-sharing` 让你把文件直接分享给其他兼容应用，并接收其他应用分享过来的兼容数据。

<video src="/static/videos/sdk/sharing.mp4" controls></video>

#### Web 上的分享限制

- Web 上的 `expo-sharing` 基于 Web Share API，而该 API 的[浏览器支持仍然非常有限](https://caniuse.com/#feat=web-share)。调用之前请用 `Sharing.isAvailableAsync()` 确认 API 可用。
- **Web 上需要 HTTPS**：只有页面通过 https 提供时，Web Share API 才可用。用 `npx expo start --tunnel` 运行应用即可启用。
- **Web 上不能分享本地文件**：通过 URI 分享本地文件在 Android 和 iOS 上可用，但在 Web 上不行。不能通过 URI 在 Web 上分享本地文件——需要先把它们上传到某处，再分享那个 URI。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-sharing
```
:::
:::tab yarn
```sh
yarn expo install expo-sharing
```
:::
:::tab pnpm
```sh
pnpm expo install expo-sharing
```
:::
:::tab bun
```sh
bun expo install expo-sharing
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-sharing`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

下面的示例展示了允许在 Android 和 iOS 上分享一张或多张图片的配置：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sharing",
        {
          "ios": {
            "enabled": true,
            "activationRule": {
              "supportsImageWithMaxCount": 5
            }
          },
          "android": {
            "enabled": true,
            "singleShareMimeTypes": ["image/*"],
            "multipleShareMimeTypes": ["image/*"]
          }
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `ios.enabled` | `false` | 是否启用 iOS 分享扩展的布尔值。为 `true` 时，会向项目添加一个分享扩展 target。 |
| `ios.extensionBundleIdentifier` | `{appBundleIdentifier}.ShareExtension` | iOS 分享扩展的 Bundle Identifier。 |
| `ios.appGroupId` | `group.{appBundleIdentifier}` | 用于在应用和扩展之间共享数据的 App Group ID。 |
| `ios.activationRule` | `{}` | **Info.plist** 中 `NSExtensionActivationRule` 的配置。可以是符合 [`ActivationRuleOptions`](#activationruleoptions) 类型的对象，用来生成标准谓词；也可以是原始字符串，直接指定自定义谓词（例如 `SUBQUERY(...)`）。 |
| `android.enabled` | `false` | 是否启用 Android 分享 intent 处理的布尔值。为 `true` 时，会向 **AndroidManifest.xml** 添加必要的 `intent-filter`。 |
| `android.singleShareMimeTypes` | `[]` | 接受单文件分享（使用 `ACTION_SEND` intent）的 MIME 类型数组。 |
| `android.multipleShareMimeTypes` | `[]` | 接受多文件分享（使用 `ACTION_SEND_MULTIPLE` intent）的 MIME 类型数组。 |

## 从其他应用分享到你的应用

:::warning
**注意**：此功能目前处于[实验阶段](/more/release-statuses#experimental)。在 iOS 上，分享扩展会打开主 target，而不是在分享 `ViewController` 中处理分享。Apple 并未官方支持这种做法，未来的 iOS 版本中可能会失效。
:::

当应用用户把内容分享给你的应用时，操作系统会启动你的应用（也就是把它带到前台的过程）。要处理这个操作，需要配置导航来处理传入的深层链接。

### Expo Router

如果使用 [Expo Router](/router/introduction)，可以用 [**+native-intent.ts**](/router/advanced/native-intent) 文件处理传入的分享 intent。这样可以检查传入路径并重定向到特定路由。

```tsx
import { getSharedPayloads } from 'expo-sharing';

export async function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  try {
    // 检查 URL 是否来自分享扩展或 intent
    if (new URL(path).hostname === 'expo-sharing') {
      return '/handle-share';
    }
    return path;
  } catch {
    // 出错时回退到根路径
    return '/';
  }
}
```

### React Navigation

如果使用 [React Navigation](https://reactnavigation.org/)，可以用 `linking` 属性拦截深层链接。应检查传入 URL 的主机名是否匹配 `expo-sharing` scheme，并把用户重定向到特定的处理屏幕。

```tsx
import * as Linking from 'expo-linking';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HandleShare from './HandleShare';

const RootStack = createNativeStackNavigator({
  screens: {
    // 其他屏幕
    HandleShare: {
      screen: HandleShare,
      linking: {
        path: '/handle-share',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function processUrl(url: string | null) {
  if (!url) return null;

  // 分享处理屏幕的路径
  const handlerUrl = Linking.createURL('/handle-share');

  // 检查 URL 是否来自分享扩展或 intent
  if (new URL(url).hostname === 'expo-sharing') {
    return handlerUrl;
  }
  return url;
}

export default function App() {
  return (
    <Navigation
      // 其余导航配置
      linking={{
        prefixes: [Linking.createURL('/')],
        async getInitialURL() {
          const initialUrl = await Linking.getInitialURL();
          return processUrl(initialUrl);
        },
        subscribe(listener) {
          const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
            const processedUrl = processUrl(url) ?? url;
            listener(processedUrl);
          });

          return () => {
            linkingSubscription.remove();
          };
        },
      }}
    />
  );
}
```

### 不使用导航库

如果在创建不使用导航库的基础应用，主屏幕就是处理屏幕。可以直接进入下一节。

## 显示分享的内容

把用户重定向到处理屏幕之后，可以用 `useIncomingShare` hook 访问并显示分享的数据。

下面的示例展示一个显示分享图片的屏幕：

```tsx
import { Image } from 'expo-image';
import { useIncomingShare } from 'expo-sharing';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function ShareReceived() {
  const { resolvedSharedPayloads, isResolving } = useIncomingShare();

  if (isResolving) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {resolvedSharedPayloads.map((payload, index) => {
        if (payload.contentType === 'image') {
          return <Image source={{ uri: payload.contentUri }} style={styles.image} key={index} />;
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
});
```

## API

```js
import * as Sharing from 'expo-sharing';
```
