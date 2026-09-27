---
title: Progress 组件参考
description: 用于显示操作状态的 Jetpack Compose 进度指示器组件。
---

# Progress 组件参考

> 支持平台：Android、Expo Go。

Expo UI 进度指示器与官方 Jetpack Compose [Progress Indicator API](https://developer.android.com/develop/ui/compose/components/progress) 保持一致。

![不确定的圆形进度指示器，以及两条分别在 30% 和 75% 的确定线性进度条](/static/images/expo-ui/progress/android-light.webp)

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

### 线性进度

水平条填充以表示进度。提供介于 `0` 和 `1` 之间的 `progress` 值即可使用确定模式。

![水平进度条填充到轨道的一半](/static/images/expo-ui/examples/progress-linear-android-light.webp)

```tsx LinearExample.tsx
import {
  Host,
  LinearProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function LinearExample() {
  return (
    <Host matchContents>
      <LinearProgressIndicator progress={0.5} />
    </Host>
  );
}
```

### 圆形进度

旋转的圆，描边增长以表示进度。

![圆形进度环画到大约四分之三](/static/images/expo-ui/examples/progress-circular-android-light.webp)

```tsx CircularExample.tsx
import {
  Host,
  CircularProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function CircularExample() {
  return (
    <Host matchContents>
      <CircularProgressIndicator progress={0.75} />
    </Host>
  );
}
```

### 不确定模式

省略 `progress` 属性即可持续动画，而不表示具体完成程度。

![线性、圆形、波浪圆形和波浪线性指示器在未设定数值时动画](/static/images/expo-ui/examples/progress-indeterminate-android-light.webp)

```tsx IndeterminateExample.tsx
import {
  CircularProgressIndicator,
  CircularWavyProgressIndicator,
  Column,
  Host,
  LinearProgressIndicator,
  LinearWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function IndeterminateExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 16 }}>
        <LinearProgressIndicator />
        <CircularProgressIndicator />
        <CircularWavyProgressIndicator />
        <LinearWavyProgressIndicator />
      </Column>
    </Host>
  );
}
```

### 自定义颜色

用 `color` 设置指示器颜色，用 `trackColor` 设置背景轨道颜色。

![红色圆形进度环画在灰色轨道上](/static/images/expo-ui/examples/progress-colors-android-light.webp)

```tsx ColorsExample.tsx
import {
  Host,
  CircularProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function ColorsExample() {
  return (
    <Host matchContents>
      <CircularProgressIndicator
        progress={0.6}
        color="red"
        trackColor="#cccccc"
      />
    </Host>
  );
}
```

### 波浪变体

`LinearWavyProgressIndicator` 和 `CircularWavyProgressIndicator` 加入了 Material 3 Expressive 的表现力波浪动画。

![波浪线性条和波浪圆形环，各自位于百分之六十](/static/images/expo-ui/examples/progress-wavy-android-light.webp)

```tsx WavyExample.tsx
import {
  Host,
  LinearWavyProgressIndicator,
  CircularWavyProgressIndicator,
  Column,
} from '@expo/ui/jetpack-compose';

export default function WavyExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 16 }}>
        <LinearWavyProgressIndicator progress={0.6} />
        <CircularWavyProgressIndicator progress={0.6} />
      </Column>
    </Host>
  );
}
```

### 波浪配置

用 `amplitude` 设置波高，`0` 为平线，`1` 为全高。用 `wavelength` 设置单个波的长度（dp），用 `waveSpeed` 设置波浪移动速度（dp/秒）。`waveSpeed` 默认等于 `wavelength`。设置 `waveSpeed={0}` 可渲染静态波。

![波浪进度指示器填充到 60%，其后是平坦轨道](/static/images/expo-ui/examples/progress-wave-config-android-light.webp)

```tsx WaveConfigExample.tsx
import {
  Host,
  LinearWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';

export default function WaveConfigExample() {
  return (
    <Host matchContents>
      <LinearWavyProgressIndicator
        progress={0.6}
        amplitude={0.4}
        wavelength={24}
        waveSpeed={18}
      />
    </Host>
  );
}
```

## API

```tsx
import {
  LinearProgressIndicator,
  CircularProgressIndicator,
  LinearWavyProgressIndicator,
  CircularWavyProgressIndicator,
} from '@expo/ui/jetpack-compose';
```
