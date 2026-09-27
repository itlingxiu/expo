---
title: WebBrowser 包参考
description: 提供系统网页浏览器访问能力并支持处理重定向的库。
---

# WebBrowser 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-web-browser` 提供对系统网页浏览器的访问，并支持处理重定向。在 Android 上它使用 `ChromeCustomTabs`；在 iOS 上根据你调用的方法，使用 `SFSafariViewController` 或 `ASWebAuthenticationSession`。从 iOS 11 起，`SFSafariViewController` 不再与 Safari 共享 Cookie，因此如果用 `WebBrowser` 做身份验证，应使用 `WebBrowser.openAuthSessionAsync`；如果只是打开一个网页（例如应用隐私政策），则使用 `WebBrowser.openBrowserAsync`。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-web-browser
```
:::
:::tab yarn
```sh
yarn expo install expo-web-browser
```
:::
:::tab pnpm
```sh
pnpm expo install expo-web-browser
```
:::
:::tab bun
```sh
bun expo install expo-web-browser
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-web-browser`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制文件才会生效的属性。如果应用**不**使用 CNG，则需要手动配置该库。

## 用法

```jsx
import { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import Constants from 'expo-constants';

export default function App() {
  const [result, setResult] = useState(null);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://expo.dev');
    setResult(result);
  };
  return (
    <View style={styles.container}>
      <Button title="Open WebBrowser" onPress={_handlePressButtonAsync} />
      <Text>{result && JSON.stringify(result)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
```

### 处理来自 WebBrowser 的深层链接

:::tabs
:::tab 使用 Expo Router
如果项目使用 Expo Router，深层链接会自动处理。
:::
:::tab 不使用 Expo Router
如果使用 `WebBrowser` 窗口做身份验证，或希望通过深层链接把信息传回应用，请在打开浏览器之前用 `Linking.addEventListener` 添加处理函数。监听器触发时，应调用 [`dismissBrowser`](#webbrowserdismissbrowser)。处理深层链接时它不会自动关闭。除此之外，来自 `WebBrowser` 的重定向与其他深层链接的工作方式相同。更多内容见[链接](/linking/into-your-app#handle-urls)。
:::
:::

## API

```js
import * as WebBrowser from 'expo-web-browser';
```

## 错误代码

### `ERR_WEB_BROWSER_REDIRECT`

**仅 Web：** 窗口无法完成重定向请求，因为发起窗口没有对其父窗口的引用。父窗口被重新加载时可能出现这种情况。

### `ERR_WEB_BROWSER_BLOCKED`

**仅 Web：** 弹出窗口被浏览器拦截或未能打开。在移动浏览器上，如果 `window.open()` 在用户输入触发后过了太久才调用，就可能发生这种情况。

移动浏览器这样做是为了防止恶意网站在移动设备上打开大量不受欢迎的弹出窗口。

该方法仍可以在异步函数中运行，但在此之前不能有任何长时间运行的任务。可以使用 Hook 在其他流程加载完成之前禁用用户输入。

### `ERR_WEB_BROWSER_CRYPTO`

**仅 Web：** 当前环境不支持 crypto。请确保从安全来源（localhost / https）运行。
