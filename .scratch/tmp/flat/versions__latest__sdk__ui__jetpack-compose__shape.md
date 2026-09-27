---
title: Shape 组件参考
description: A Jetpack Compose Shape component for drawing geometric shapes.
---

# Shape 组件参考

> 支持平台：Android、Expo Go。

Expo UI Shape matches the official Jetpack Compose [Shapes](https://developer.android.com/develop/ui/compose/graphics/draw/shapes) API and provides a set of sub-components for drawing geometric shapes such as stars, circles, rectangles, pills, and polygons.

![Four geometric shapes: hexagon, circle, rounded rectangle, and pill](/static/images/expo-ui/shape/android-light.webp)

## Installation

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

## Usage

### Basic shapes

Render common shapes using the `Shape` sub-components.

![A gold star, blue circle, green square, and red pill in a row](/static/images/expo-ui/examples/shape-basic-android-light.webp)

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

### Shapes with rounded corners

Use `cornerRounding` and `smoothing` to customize the appearance of shapes.

![A purple rectangle with rounded corners next to an orange rectangle rounded only at the top](/static/images/expo-ui/examples/shape-rounded-android-light.webp)

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

### Polygon and star variants

Use `verticesCount` and `innerRadius` to control the shape geometry.

![A cyan hexagon, an orange eight-pointed star, and a pink six-pointed pill star](/static/images/expo-ui/examples/shape-polygon-android-light.webp)

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
