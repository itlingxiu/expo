---
title: MeshGradient
description: A module that exposes MeshGradient view from SwiftUI to React Native.
packageName: expo-mesh-gradient
---

# MeshGradient

> 支持平台：Android、iOS、tvOS、Expo Go。

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-mesh-gradient
```
:::
:::tab yarn
```sh
yarn expo install expo-mesh-gradient
```
:::
:::tab pnpm
```sh
pnpm expo install expo-mesh-gradient
```
:::
:::tab bun
```sh
bun expo install expo-mesh-gradient
```
:::
:::

## API

```tsx
import { MeshGradientView } from 'expo-mesh-gradient';

function App() {
  return (
    <MeshGradientView
      style={{ flex: 1 }}
      columns={3}
      rows={3}
      colors={['red', 'purple', 'indigo', 'orange', 'white', 'blue', 'yellow', 'green', 'cyan']}
      points={[
        [0.0, 0.0],
        [0.5, 0.0],
        [1.0, 0.0],
        [0.0, 0.5],
        [0.5, 0.5],
        [1.0, 0.5],
        [0.0, 1.0],
        [0.5, 1.0],
        [1.0, 1.0],
      ]}
    />
  );
}
```

