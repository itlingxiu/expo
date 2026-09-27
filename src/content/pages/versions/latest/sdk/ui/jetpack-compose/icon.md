---
title: Icon 组件参考
description: 用于显示图标的 Jetpack Compose Icon 组件。
---

# Icon 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Icon`](/versions/latest/sdk/ui/universal/icon)——它会按平台渲染对应的原生组件。
:::

用于在 Jetpack Compose 中渲染 Material Symbol XML 矢量图的图标组件。推荐来源是 [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols)——它把 Google 的 [Material Symbols](https://fonts.google.com/icons) 作为单独的资源子路径发布，因此 Metro 只打包你实际导入的图标。其他样式（圆角、锐利、填充）或自定义轴，可通过该包的 [CLI](#通过-expomaterial-symbols-cli-使用自定义样式) 把任意变体直接下载到项目中。

![用 Material 3 Icon 组件渲染的 Wi-Fi、蓝牙、邮件和人物图标](/static/images/expo-ui/icon/android-light.webp)

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

可选安装 [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols) 以使用随包图标。若要不同样式或自定义轴，请参阅[自定义样式](#通过-expomaterial-symbols-cli-使用自定义样式)，无需额外安装。

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

### 基本图标

从 `@expo/material-symbols` 各自的子路径直接导入任意图标——每个图标都解析为 Metro 资源，`Icon` 可以原生渲染。对于你添加到项目中的本地 XML 文件，请改用 `require()`（见下方[自定义样式](#通过-expomaterial-symbols-cli-使用自定义样式)）。

![默认尺寸的房屋轮廓图标](/static/images/expo-ui/examples/icon-basic-android-light.webp)

```tsx BasicIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import Home from '@expo/material-symbols/home.xml';

export default function BasicIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={Home}
        tint={colors.onBackground}
        contentDescription="Home"
      />
    </Host>
  );
}
```

### 带着色的图标

使用 `tint` 属性为图标应用颜色叠加。

![紫色绘制的心形轮廓图标](/static/images/expo-ui/examples/icon-tinted-android-light.webp)

```tsx TintedIcon.tsx
import { Host, Icon } from '@expo/ui/jetpack-compose';
import Favorite from '@expo/material-symbols/favorite.xml';

export default function TintedIcon() {
  return (
    <Host matchContents>
      <Icon
        source={Favorite}
        tint="#6200ee"
        contentDescription="Favorite"
      />
    </Host>
  );
}
```

### 指定尺寸的图标

使用 `size` 属性以 dp 指定自定义尺寸。

![以 48 密度独立像素绘制的齿轮图标](/static/images/expo-ui/examples/icon-sized-android-light.webp)

```tsx SizedIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import Settings from '@expo/material-symbols/settings.xml';

export default function SizedIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={Settings}
        size={48}
        tint={colors.onBackground}
        contentDescription="Settings"
      />
    </Host>
  );
}
```

### 通过 @expo/material-symbols CLI 使用自定义样式

`@expo/material-symbols` 随包提供默认轴的 **outlined** 样式。需要不同样式（`rounded`、`sharp`）、填充变体，或自定义字重、等级、光学尺寸时，使用其 CLI 直接从 Google Fonts 把指定可绘制资源取到项目中。

```sh
# 按名称下载图标（默认：outlined、字重 400、24px）
npx @expo/material-symbols star home

# 圆角样式
npx @expo/material-symbols --style rounded star home

# 锐利 + 填充
npx @expo/material-symbols --style sharp --fill favorite

# 粘贴 fonts.google.com/icons 的 URL，以保留你在那里选择的轴
npx @expo/material-symbols "https://fonts.google.com/icons?selected=Material+Symbols+Outlined:check_box:FILL@1;wght@300;GRAD@0;opsz@24"
```

| 选项 | 说明 | 默认值 |
| --- | --- | --- |
| `-o, --output <dir>` | 输出目录 | `./assets` |
| `-s, --style <style>` | 图标样式：`outlined`、`rounded`、`sharp` | `outlined` |
| `-f, --fill` | 使用填充变体 | |
| `-w, --weight <wght>` | 字重：`100`–`700` | `400` |
| `-g, --grade <grad>` | 等级：`-25`、`0`、`200` | `0` |
| `--opsz <size>` | 光学尺寸：`20`、`24`、`40`、`48` | `24` |

CLI 会把可直接使用的 XML 矢量图写入项目。用 `require()` 加载并传给 `Icon`。

![用 material symbols 命令行工具下载的圆角星星轮廓图标](/static/images/expo-ui/examples/icon-custom-android-light.webp)

```tsx CustomIcon.tsx
import {
  Host,
  Icon,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function CustomIcon() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Icon
        source={require('./assets/star_rounded.xml')}
        size={32}
        tint={colors.onBackground}
        contentDescription="Star"
      />
    </Host>
  );
}
```

## API

```tsx
import { Icon } from '@expo/ui/jetpack-compose';
```
