---
title: 'expo-print 包参考'
description: 为 Android 和 iOS（AirPrint）提供打印功能的库。
---

# expo-print 包参考

> 支持平台：Android、iOS、Web、Expo Go。

`expo-print` 为 Android 和 iOS（AirPrint）提供打印功能的 API。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-print
```
:::
:::tab yarn
```sh
yarn expo install expo-print
```
:::
:::tab pnpm
```sh
pnpm expo install expo-print
```
:::
:::tab bun
```sh
bun expo install expo-print
```
:::
:::

## 用法

```jsx
import { useState } from 'react';
import { View, StyleSheet, Button, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://docs.expo.dev/static/images/expo-logo.svg"
      style="width: 90vw;" />
  </body>
</html>
`;

export default function App() {
  const [selectedPrinter, setSelectedPrinter] = useState();

  const print = async () => {
    // 在 iOS/Android 上打印给定的 HTML。在 Web 上打印当前页面的 HTML。
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // 仅 iOS
    });
  };

  const printToFile = async () => {
    // 在 iOS/Android 上打印给定的 HTML。在 Web 上打印当前页面的 HTML。
    const { uri } = await Print.printToFileAsync({ html });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // 仅 iOS
    setSelectedPrinter(printer);
  };

  return (
    <View style={styles.container}>
      <Button title="Print" onPress={print} />
      <View style={styles.spacer} />
      <Button title="Print to PDF file" onPress={printToFile} />
      {Platform.OS === 'ios' && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flexDirection: 'column',
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: 'center',
  },
});
```

## API

```js
import * as Print from 'expo-print';
```

## 本地图片

在 iOS 上，从 HTML 源打印不支持本地资源 URL（受 `WKWebView` 限制）。相反，需要将图片转换为 base64 并内联到 HTML 中。

```tsx 示例
import { Asset } from 'expo-asset';
import { useImageManipulator } from 'expo-image-manipulator';
import { printAsync } from 'expo-print';
import { useEffect } from 'react';

const IMAGE = Asset.fromModule(require('@/assets/images/icon.png'));

export function ImageManipulatorExample() {
  const context = useImageManipulator(IMAGE.uri);

  useEffect(() => {
    async function generateAndPrint() {
      try {
        await IMAGE.downloadAsync();
        const manipulatedImage = await context.renderAsync();
        const result = await manipulatedImage.saveAsync({ base64: true });

        const html = `
          <html>
            <img
              src="data:image/png;base64,${result.base64}"
              style="width: 90vw;" />
          </html>
        `;

        await printAsync({ html });
      } catch (error) {
        console.error('Error:', error);
      }
    }

    generateAndPrint();
  }, [context]);

  return <>{/* 渲染 UI */}</>;
}
```

## 页边距

**在 iOS 上**，可以使用 `margins` 选项设置页边距：

```js
const { uri } = await Print.printToFileAsync({
  html: 'This page is printed with margins',
  margins: {
    left: 20,
    top: 50,
    right: 20,
    bottom: 100,
  },
});
```

如果 `useMarkupFormatter` 设置为 `true`，设置页边距可能会导致打印输出的末尾出现空白页。为防止这种情况，请确保 HTML 字符串是格式良好的文档，并在字符串开头包含 `<!DOCTYPE html>`。

**在 Android 上**，如果在 `printAsync` 或 `printToFileAsync` 中使用 `html` 选项，打印结果可能包含页边距（取决于 WebView 引擎）。它们由 `@page` 样式块设置，你可以在 HTML 代码中覆盖：

```html
<style>
  @page {
    margin: 20px;
  }
</style>
```

更多详情请参阅 [MDN 上的 `@page` 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)。
