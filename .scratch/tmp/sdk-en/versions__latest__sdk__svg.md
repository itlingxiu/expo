---
title: react-native-svg
description: A library that allows using SVGs in your app.
packageName: react-native-svg
---

# react-native-svg

> 支持平台：Android、iOS、macOS、Web、tvOS、Expo Go。

`react-native-svg` allows you to use SVGs in your app, with support for interactivity and animation.

## Installation

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

A set of drawing primitives such as `Circle`, `Rect`, `Path`,
`ClipPath`, and `Polygon`. It supports most SVG elements and properties.
The implementation is provided by [react-native-svg](https://github.com/react-native-community/react-native-svg), and documentation is provided in that repository.

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

### Tips

Here are some helpful links that will get you moving fast!

- Looking for SVGs? Try [Lucide](https://lucide.dev/).
- Create or modify your own SVGs for free using [Figma](https://www.figma.com/).
- Optimize your SVG with [SVGOMG](https://jakearchibald.github.io/svgomg/). This will make the code smaller and easier to work with. Be sure not to remove the `viewbox` for best results on Android.
- Convert your SVG to an Expo component in the browser using [SVGR](https://react-svgr.com/playground/?native=true&typescript=true).

## Learn more

- [Visit official documentation](https://github.com/software-mansion/react-native-svg)：Get full information on API and its usage.

