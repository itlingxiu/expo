---
title: Shape 组件参考
description: 用于绘制几何图形的 Jetpack Compose Shape 组件。
---

# Shape 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Shape 与官方 Jetpack Compose [Shapes](https://developer.android.com/develop/ui/compose/graphics/draw/shapes) API 保持一致，并提供一组子组件，用于绘制星形、圆形、矩形、胶囊和多边形等几何图形。

![四种几何图形：六边形、圆形、圆角矩形和胶囊](/static/images/expo-ui/shape/android-light.webp)

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

### 基本图形

使用 `Shape` 子组件渲染常见图形。

![一行中的金色星形、蓝色圆形、绿色正方形和红色胶囊](/static/images/expo-ui/examples/shape-basic-android-light.webp)

```tsx BasicShapesExample.tsx
import { Host, Shape, Row } from '@expo/ui/jetpack-compose';
import { size } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicShapesExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row
        horizontalArrangement={{ spacedBy: 16 }}
        verticalAlignment="center">
        <Shape.Star
          radius={1}
          innerRadius={0.5}
          color="#FFD700"
          modifiers={[size(80, 80)]}
        />
        <Shape.Circle
          radius={1}
          color="#4285F4"
          modifiers={[size(80, 80)]}
        />
        <Shape.Rectangle
          color="#34A853"
          modifiers={[size(80, 80)]}
        />
        <Shape.Pill color="#EA4335" modifiers={[size(100, 50)]} />
      </Row>
    </Host>
  );
}
```

### 圆角图形

使用 `cornerRounding` 和 `smoothing` 自定义图形外观。

![紫色圆角矩形旁边是只在顶部圆角的橙色矩形](/static/images/expo-ui/examples/shape-rounded-android-light.webp)

```tsx RoundedShapesExample.tsx
import { Host, Shape, Row } from '@expo/ui/jetpack-compose';
import { size } from '@expo/ui/jetpack-compose/modifiers';

export default function RoundedShapesExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row
        horizontalArrangement={{ spacedBy: 16 }}
        verticalAlignment="center">
        <Shape.Rectangle
          cornerRounding={0.2}
          smoothing={0.5}
          color="#9C27B0"
          modifiers={[size(100, 80)]}
        />
        <Shape.RoundedCorner
          cornerRadii={{
            topStart: 20,
            topEnd: 20,
            bottomStart: 0,
            bottomEnd: 0,
          }}
          color="#FF5722"
          modifiers={[size(100, 80)]}
        />
      </Row>
    </Host>
  );
}
```

### 多边形与星形变体

使用 `verticesCount` 和 `innerRadius` 控制图形几何。

![青色六边形、橙色八角星和粉色六角胶囊星](/static/images/expo-ui/examples/shape-polygon-android-light.webp)

```tsx PolygonShapesExample.tsx
import { Host, Shape, Row } from '@expo/ui/jetpack-compose';
import { size } from '@expo/ui/jetpack-compose/modifiers';

export default function PolygonShapesExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row
        horizontalArrangement={{ spacedBy: 16 }}
        verticalAlignment="center">
        <Shape.Polygon
          verticesCount={6}
          cornerRounding={0.05}
          color="#00BCD4"
          modifiers={[size(80, 80)]}
        />
        <Shape.Star
          verticesCount={8}
          radius={1}
          innerRadius={0.4}
          cornerRounding={0.025}
          color="#FF9800"
          modifiers={[size(80, 80)]}
        />
        <Shape.PillStar
          verticesCount={6}
          innerRadius={0.5}
          color="#E91E63"
          modifiers={[size(80, 80)]}
        />
      </Row>
    </Host>
  );
}
```

## API

```tsx
import { Shape } from '@expo/ui/jetpack-compose';
```
