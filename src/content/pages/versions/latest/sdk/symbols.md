---
title: Symbols 包参考
description: 允许访问原生符号的库。
---

# Symbols 包参考

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-symbols` 提供跨平台访问原生符号库的能力。在 iOS 和 tvOS 上，它使用 [SF Symbols](https://developer.apple.com/sf-symbols/)。在 Android 和 Web 上，它使用 [Material Symbols](https://fonts.google.com/icons)。

![iOS 设备上展示的一组 Expo Symbols 符号。](/static/images/symbols.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-symbols
```
:::
:::tab yarn
```sh
yarn expo install expo-symbols
```
:::
:::tab pnpm
```sh
pnpm expo install expo-symbols
```
:::
:::tab bun
```sh
bun expo install expo-symbols
```
:::
:::

## 用法

### 跨平台符号

传入一个包含各平台符号名称的对象，即可在所有平台上渲染符号。可在 [Apple SF Symbols 应用](https://developer.apple.com/sf-symbols/)中浏览可用的 iOS 符号，在 [Google Material Symbols](https://fonts.google.com/icons) 中浏览 Android 和 Web 符号。

```jsx
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SymbolView
        name={{ ios: 'info.circle', android: 'info', web: 'info' }}
        tintColor="#007AFF"
        size={35}
      />
      <SymbolView
        name={{
          ios: 'pencil.tip.crop.circle.badge.plus',
          android: 'home_and_garden',
          web: 'home_and_garden',
        }}
        style={styles.symbol}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    width: 35,
    height: 35,
    margin: 5,
  },
});
```

如果只传入字符串，它会被当作 SF Symbol 名称，并且只在 iOS 上渲染。在 Android 和 Web 上，除非提供 `fallback`，否则不会渲染任何内容：

```jsx
{
  /* 仅 iOS：直接传入 SF Symbol 名称 */
}
<SymbolView name="airpods.chargingcase" style={styles.symbol} type="hierarchical" />;

{
  /* 在未定义该符号的平台上使用 fallback */
}
<SymbolView name={{}} fallback={<Text>?</Text>} />;
```

### 字重

在 iOS 上，直接传入字重字符串。在 Android 上，从 `expo-symbols/androidWeights` 导入字重对象：

```jsx
import bold from 'expo-symbols/androidWeights/bold';

<SymbolView
  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
  weight={{ ios: 'bold', android: bold }}
  tintColor="gold"
  size={35}
/>;
```

可用的字重导入：`bold`、`semiBold`、`medium`、`regular`、`light`、`extraLight`、`thin`。

## API

```js
import { SymbolView } from 'expo-symbols';
```
