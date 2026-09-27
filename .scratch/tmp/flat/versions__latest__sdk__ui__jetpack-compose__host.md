---
title: Host 组件参考
description: A Jetpack Compose Host component for bridging React Native and Jetpack Compose.
---

# Host 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Host`](/versions/latest/sdk/ui/universal/host) — it renders the appropriate native component per platform.

The `Host` component is the bridge between React Native and Jetpack Compose. Every Jetpack Compose component from `@expo/ui/jetpack-compose` must be wrapped in a `Host` to render correctly.

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

### Match contents

Use the `matchContents` prop to make the `Host` size itself to fit the content. You can pass a boolean or an object to control vertical and horizontal sizing independently.

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

> **Note:** Do not use `matchContents` on the same axis as a scrollable child (`LazyRow`, `LazyColumn`, `Carousel`, or anything using `Modifier.horizontalScroll`/`verticalScroll`). Scrollables require a finite max constraint on their scroll axis and `matchContents` propagates an unbounded one.

The following example crashes:

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

Either drop `matchContents` on the scroll axis or give the `Host` a finite size on that axis via `style`:

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

### With style

Apply standard React Native styles to the `Host` wrapper.

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
