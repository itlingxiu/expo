---
title: Clipboard 包参考
description: 用于获取和设置剪贴板内容的通用库。
---

# Clipboard 包参考

`expo-clipboard` 提供在 Android、iOS 和 Web 上获取与设置剪贴板内容的接口。

> 支持平台：Android、iOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-clipboard
```
:::
:::tab yarn
```sh
yarn expo install expo-clipboard
```
:::
:::tab pnpm
```sh
pnpm expo install expo-clipboard
```
:::
:::tab bun
```sh
bun expo install expo-clipboard
```
:::
:::

## 用法

```tsx
import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    // 将文本复制到剪贴板
    await Clipboard.setStringAsync('hello world');
  };

  const fetchCopiedText = async () => {
    // 从剪贴板粘贴文本
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  return (
    <View style={styles.container}>
      <Button title="Click here to copy to Clipboard" onPress={copyToClipboard} />
      <Button title="View copied text" onPress={fetchCopiedText} />
      <Text style={styles.copiedText}>{copiedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});
```

## 将剪贴板内容标记为敏感（Android）

当你复制密码、一次性密码（OTP）、访问令牌、支付信息或个人身份信息（PII）等敏感数据时，请在 `setStringAsync` 和 `setImageAsync` 中设置 `android.isSensitive`。

将 `android.isSensitive` 设为 `true` 会把剪贴板内容标记为敏感，依据是 Android 关于[安全处理剪贴板](https://developer.android.com/privacy-and-security/risks/secure-clipboard-handling#flag-sensitive-data)的指引。这有助于：

- 模糊键盘显示的剪贴板预览
- 在 Android 13 及更高版本上隐藏剪贴板预览浮层
- 降低因肩窥而意外泄露的风险

```ts
import * as Clipboard from 'expo-clipboard';

// 敏感文本
await Clipboard.setStringAsync('my-secret-token', {
  android: { isSensitive: true },
});

// 敏感图片
await Clipboard.setImageAsync(base64Image, {
  android: { isSensitive: true },
});
```

## API

```ts
import * as Clipboard from 'expo-clipboard';
```

:::warning
在 Web 上，此模块使用 [`AsyncClipboard` API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)，其行为可能因浏览器而异，或未得到完整支持。尤其在 WebKit 上，有一个问题会使此 API 无法在异步代码中使用。[点击此处查看详情](https://bugs.webkit.org/show_bug.cgi?id=222262)。
:::
