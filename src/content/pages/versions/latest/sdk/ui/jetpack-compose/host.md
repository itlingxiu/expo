---
title: Host 组件参考
description: 用于衔接 React Native 与 Jetpack Compose 的 Host 组件。
---

# Host 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Host`](/versions/latest/sdk/ui/universal/host)——它会按平台渲染对应的原生组件。
:::

`Host` 组件是 React Native 与 Jetpack Compose 之间的桥梁。来自 `@expo/ui/jetpack-compose` 的每个 Jetpack Compose 组件都必须包在 `Host` 中才能正确渲染。

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

### 匹配内容尺寸

使用 `matchContents` 属性让 `Host` 按内容调整自身大小。可以传入布尔值，或传入对象分别控制垂直和水平方向的尺寸。

```tsx MatchContents.tsx
import { Host, Button } from '@expo/ui/jetpack-compose';

export default function MatchContents() {
  return (
    <Host matchContents>
      <Button onClick={() => console.log('Pressed')}>
        Sized to content
      </Button>
    </Host>
  );
}
```

:::note
不要在与可滚动子元素相同的轴上使用 `matchContents`（`LazyRow`、`LazyColumn`、`Carousel`，或任何使用 `Modifier.horizontalScroll` / `verticalScroll` 的内容）。可滚动组件在滚动轴上需要有限的最大约束，而 `matchContents` 会传递一个无界约束。
:::

下面的示例会崩溃：

```tsx MatchContentsCrash.tsx
import { Host, LazyRow, Text } from '@expo/ui/jetpack-compose';

export default function MatchContentsCrash() {
  return (
    <Host matchContents>
      <LazyRow>
        {Array.from({ length: 5 }).map((_, i) => (
          <Text key={i}>Item {i}</Text>
        ))}
      </LazyRow>
    </Host>
  );
}
```

要么去掉滚动轴上的 `matchContents`，要么通过 `style` 在该轴上给 `Host` 一个有限尺寸：

```tsx MatchContentsFix.tsx
import { Host, LazyRow, Text } from '@expo/ui/jetpack-compose';

export default function MatchContentsFix() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <LazyRow>
        {Array.from({ length: 5 }).map((_, i) => (
          <Text key={i}>Item {i}</Text>
        ))}
      </LazyRow>
    </Host>
  );
}
```

### 使用样式

对 `Host` 包装器应用标准的 React Native 样式。

```tsx HostWithStyle.tsx
import { Host, Button } from '@expo/ui/jetpack-compose';

export default function HostWithStyle() {
  return (
    <Host
      style={{
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
      }}>
      <Button onClick={() => console.log('Pressed')}>
        Styled host
      </Button>
    </Host>
  );
}
```

## API

```tsx
import { Host } from '@expo/ui/jetpack-compose';
```
