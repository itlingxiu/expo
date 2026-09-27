---
title: Icon 组件参考
description: 平台原生图标：iOS 上为 SF Symbol，Android 上为 Material Symbol。
---

# Icon 组件参考

> 支持平台：Android、iOS、Expo Go。

平台原生图标。在 Android 上，它渲染 Material Symbol XML 矢量图（推荐来源：[`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols)）。在 iOS 上，它渲染 [SF Symbol](https://developer.apple.com/sf-symbols)。

:::note
`Icon` 不会在 Web 上渲染。
:::

**Android**

![用 Material 3 Icon 组件渲染的 Wi-Fi、蓝牙、邮件和人物图标](/static/images/expo-ui/icon/android-light.webp)

**iOS**

![用 SF Symbols 渲染的 Wi-Fi、无线电波、邮件和人物图标](/static/images/expo-ui/icon/ios-light.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

可选安装 [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols)，以便在 Android 上使用随包图标。若要不同样式或自定义轴，请参阅 [Jetpack Compose Icon 页面上的自定义样式](/versions/latest/sdk/ui/jetpack-compose/icon#通过-expomaterial-symbols-cli-使用自定义样式)，无需额外安装。

:::tabs
:::tab npm
```sh
npx expo install @expo/material-symbols
```
:::
:::tab yarn
```sh
yarn expo install @expo/material-symbols
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/material-symbols
```
:::
:::tab bun
```sh
bun expo install @expo/material-symbols
```
:::
:::

## 用法

### 使用 `Icon.select` 的跨平台图标

[`Icon.select`](#selectspec) 会为当前平台选择合适的资源。配合 [`@expo/ui/babel-plugin`](https://github.com/expo/expo/tree/main/packages/expo-ui/plugin)（由 `babel-preset-expo` 自动加载），Metro 可以按平台摇树移除未使用的一侧。

**Android**

![用 Material Symbol 绘制的大号橙色星星](/static/images/expo-ui/examples/universal-icon-select-android-light.webp)

**iOS**

![用 SF Symbol 绘制的大号橙色星星](/static/images/expo-ui/examples/universal-icon-select-ios-light.webp)

```tsx IconSelectExample.tsx
import { Host, Icon } from '@expo/ui';

export default function IconSelectExample() {
  return (
    <Host matchContents>
      <Icon
        name={Icon.select({
          ios: 'star.fill',
          android: import('@expo/material-symbols/star.xml'),
        })}
        size={32}
        color="orange"
      />
    </Host>
  );
}
```

### 提升后的 `Icon.select`

在多个调用点复用同一图标时，把 [`Icon.select`](#selectspec) 调用提升到组件外。

**Android**

![一行三颗用 Material Symbol 绘制的小金色星星](/static/images/expo-ui/examples/universal-icon-hoisted-android-light.webp)

**iOS**

![一行三颗用 SF Symbol 绘制的小金色星星](/static/images/expo-ui/examples/universal-icon-hoisted-ios-light.webp)

```tsx HoistedIconExample.tsx
import { Host, Row, Icon } from '@expo/ui';

const STAR = Icon.select({
  ios: 'star.fill',
  android: import('@expo/material-symbols/star.xml'),
});

export default function HoistedIconExample() {
  return (
    <Host matchContents>
      <Row spacing={4}>
        <Icon name={STAR} size={20} color="gold" />
        <Icon name={STAR} size={20} color="gold" />
        <Icon name={STAR} size={20} color="gold" />
      </Row>
    </Host>
  );
}
```

### 按平台拆分文件

在 **.android.tsx** 文件中直接导入 XML 资源。在 **.ios.tsx** 文件中把 SF Symbol 名称作为字符串传入。

```tsx Icon.android.tsx
import StarIcon from '@expo/material-symbols/star.xml';
import { Host, Icon } from '@expo/ui';

export default function StarRow() {
  return (
    <Host matchContents>
      <Icon name={StarIcon} size={24} />
    </Host>
  );
}
```

```tsx Icon.ios.tsx
import { Host, Icon } from '@expo/ui';

export default function StarRow() {
  return (
    <Host matchContents>
      <Icon name="star.fill" size={24} />
    </Host>
  );
}
```

## API

```tsx
import { Icon } from '@expo/ui';
```
