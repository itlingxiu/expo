---
title: react-native-svg 包参考
description: 允许在应用中使用 SVG 的库。
---

# react-native-svg 包参考

> 支持平台：Android、iOS、macOS、Web、tvOS、Expo Go。

`react-native-svg` 允许你在应用中使用 SVG，并支持交互和动画。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-svg
```
:::
:::tab yarn
```sh
yarn expo install react-native-svg
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-svg
```
:::
:::tab bun
```sh
bun expo install react-native-svg
```
:::
:::

## API

```js
import * as Svg from 'react-native-svg';
```

### `Svg`

一组绘图原语，例如 `Circle`、`Rect`、`Path`、`ClipPath` 和 `Polygon`。它支持大多数 SVG 元素和属性。实现由 [react-native-svg](https://github.com/react-native-community/react-native-svg) 提供，文档也在该仓库中。

```tsx
import Svg, { Circle, Rect, SvgProps } from 'react-native-svg';

export default function SvgComponent(props: SvgProps) {
  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
      <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
    </Svg>
  );
}
```

### 提示

下面这些链接可以帮助你尽快上手：

- 在找 SVG？试试 [Lucide](https://lucide.dev/)。
- 使用 [Figma](https://www.figma.com/) 免费创建或修改自己的 SVG。
- 用 [SVGOMG](https://jakearchibald.github.io/svgomg/) 优化 SVG。这会让代码更小、更容易处理。为了在 Android 上获得最佳效果，注意不要去掉 `viewbox`。
- 在浏览器中用 [SVGR](https://react-svgr.com/playground/?native=true&typescript=true) 把 SVG 转换成 Expo 组件。

## 了解更多

- [查看官方文档](https://github.com/software-mansion/react-native-svg)：获取 API 及其用法的完整信息。
