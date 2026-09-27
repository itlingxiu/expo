---
title: Material Colors
description: 从 JavaScript 读取 Material 3 调色板（包括 Material 3 动态颜色）。
---

# Material Colors

> 支持平台：Android、Expo Go。

Expo UI Jetpack Compose 暴露了 Jetpack Compose 使用的 [Material 3 调色板](https://m3.material.io/styles/color/system/overview)，你可以选择调色板来源，并让 [`<Host>`](/versions/latest/sdk/ui/jetpack-compose/host) 下的每个组件都按它一致地应用主题。

调色板来源取决于你传入的选项：

- **来自壁纸：** Android 12+ 上未提供 `seedColor` 时的默认行为。使用 [Material 3 动态颜色](https://m3.material.io/styles/color/dynamic-color/overview)（Material You）。
- **静态 [Material 3 基线](https://m3.material.io/styles/color/roles)：** Android 11 及更低版本上未提供 `seedColor` 时的默认回退。
- **由一种颜色生成：** 传入 `seedColor` 时，完整调色板使用与 Material 3 动态颜色为壁纸色所用的同一算法推导。适用于所有 Android API 级别，且与壁纸无关。

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

## 用法

### 用种子色为主题化 `<Host>`

[`Host`](/versions/latest/sdk/ui/jetpack-compose/host) 直接接受 `seedColor` 和 `colorScheme` 属性。这是为主题化 Compose 子树推荐的方式。该 `Host` 下的原生 Compose 组件会用种子调色板渲染，任何不带参数调用 [`useMaterialColors()`](#usematerialcolorsoptions) 的后代都会从 Host 上下文收到同一调色板。

![浅紫色容器中的按钮，深紫色文本，由种子色生成主题](/static/images/expo-ui/examples/colors-branded-host-android-light.webp)

```tsx BrandedHostExample.tsx
import { Button, Host, Text } from '@expo/ui/jetpack-compose';

export default function BrandedHostExample() {
  return (
    <Host seedColor="#8E24AA" colorScheme="dark" matchContents>
      <Button onClick={() => {}}>
        <Text>Themed from the seed</Text>
      </Button>
    </Host>
  );
}
```

### 在 Host 内读取当前调色板

在 [`<Host>`](/versions/latest/sdk/ui/jetpack-compose/host) 内不带参数调用 [`useMaterialColors()`](#usematerialcolorsoptions)，即可读取 Host 的当前调色板。该 Hook 返回引用稳定的 [`MaterialColors`](#materialcolors) 对象，重新渲染时不会跨越原生桥。

![表面面板打印当前 primary 和 surface 的十六进制值](/static/images/expo-ui/examples/colors-palette-android-light.webp)

```tsx MaterialColorsExample.tsx
import {
  Column,
  Host,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function MaterialColorsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Surface>
        <PaletteInspector />
      </Surface>
    </Host>
  );
}

function PaletteInspector() {
  const colors = useMaterialColors();
  return (
    <Column
      modifiers={[padding(16, 16, 16, 16)]}
      verticalArrangement={{ spacedBy: 8 }}>
      <Text>Primary: {colors.primary}</Text>
      <Text>Surface: {colors.surface}</Text>
    </Column>
  );
}
```

### 用参数计算特定调色板

向 [`useMaterialColors()`](#usematerialcolorsoptions) 传入参数，即可按需计算调色板，即使在 `<Host>` 之外也可以。`colorScheme` 接受 `'light'` 或 `'dark'`，省略则跟随系统。

![表面面板打印深色、品牌色和品牌深色三套调色板的 primary 十六进制值](/static/images/expo-ui/examples/colors-use-material-colors-android-light.webp)

```tsx UseMaterialColorsExample.tsx
import {
  Column,
  Host,
  Surface,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';

export default function UseMaterialColorsExample() {
  const dark = useMaterialColors({ colorScheme: 'dark' });
  const brand = useMaterialColors({ seedColor: '#8E24AA' });
  const brandedDark = useMaterialColors({
    colorScheme: 'dark',
    seedColor: '#8E24AA',
  });

  return (
    <Host style={{ flex: 1 }}>
      <Surface>
        <Column
          modifiers={[padding(16, 16, 16, 16)]}
          verticalArrangement={{ spacedBy: 8 }}>
          <Text>Dark primary: {dark.primary}</Text>
          <Text>Brand primary: {brand.primary}</Text>
          <Text>Branded dark primary: {brandedDark.primary}</Text>
        </Column>
      </Surface>
    </Host>
  );
}
```

### 在 React 组件之外读取颜色

```tsx GetMaterialColorsExample.tsx
import {
  getMaterialColors,
  isDynamicColorAvailable,
} from '@expo/ui/jetpack-compose';

const palette = getMaterialColors({ seedColor: '#8E24AA' });
console.log(
  'available:',
  isDynamicColorAvailable,
  'primary:',
  palette.primary
);
```

## API
