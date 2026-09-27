---
title: Host 组件参考
description: A cross-platform Host component that wraps universal @expo/ui content.
---

# Host 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A container for universal `@expo/ui` content. On Android and iOS it re-exports the platform-native [`Host` for Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[`Host` for SwiftUI](/versions/latest/sdk/ui/swift-ui/host), so Jetpack Compose/SwiftUI children render exactly as they would in the platform-specific packages. On web, it falls back to a React Native [`View`](https://reactnative.dev/docs/view). Use `Host` as the root of any universal subtree so the same component tree works across all three platforms.

**Android**

![A Hello world label above a filled button](/static/images/expo-ui/host/android-light.webp)

**iOS**

![A Hello world label above a filled button](/static/images/expo-ui/host/ios-light.webp)

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

### Basic usage

**Android**

![A Hello world label above a filled Material 3 button](/static/images/expo-ui/examples/universal-host-basic-android-light.webp)

**iOS**

![A Hello world label above a filled button](/static/images/expo-ui/examples/universal-host-basic-ios-light.webp)

```tsx HostExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text, Button } from '@expo/ui';

export default function HostExample() {
  const colorScheme = useColorScheme();

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={12} alignment="center">
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Hello, world!
        </Text>
        <Button label="Press me" onPress={() => alert('Pressed')} />
      </Column>
    </Host>
  );
}
```

### Placing components inside React Native views

`Host` renders its universal children with Jetpack Compose on Android and SwiftUI on iOS. A React Native view inside `Host`, such as `View` or `ScrollView`, switches back to React Native rendering. To use a universal component inside that view, wrap the component in a new `Host`. Do this even when a `Host` higher in the tree wraps the view.

**Android**

![A row labeled Notifications with a Material 3 switch turned off at the trailing edge](/static/images/expo-ui/examples/universal-host-react-native-views-android-light.webp)

**iOS**

![A row labeled Notifications with a switch turned off at the trailing edge](/static/images/expo-ui/examples/universal-host-react-native-views-ios-light.webp)

```tsx ReactNativeLayoutExample.tsx
import { useState } from 'react';
import { ScrollView, Text, View, useColorScheme } from 'react-native';
import { Host, Switch } from '@expo/ui';

export default function ReactNativeLayoutExample() {
  const colorScheme = useColorScheme();
  const [enabled, setEnabled] = useState(false);

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Notifications</Text>
        <Host matchContents>
          <Switch value={enabled} onValueChange={setEnabled} />
        </Host>
      </View>
    </ScrollView>
  );
}
```

To place React Native views inside a universal layout, use [`RNHostView`](rnhostview).

### Match contents sizing

Use `matchContents` to let `Host` size itself to fit its content. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, it applies `alignSelf: 'flex-start'` to the underlying `View` so the host shrinks to fit its children instead of being stretched by its parent.

> **Note:** On web, the per-axis form (`{ horizontal: true }` / `{ vertical: true }`) behaves the same as the boolean form, since `alignSelf` only controls stretching on the parent's cross axis. Components that rely on independent per-axis sizing should expect the same shrink-to-fit behavior on web regardless of which axis is opted in.

**Android**

![A Material 3 button sized to fit its label](/static/images/expo-ui/examples/universal-host-match-contents-android-light.webp)

**iOS**

![A button sized to fit its label](/static/images/expo-ui/examples/universal-host-match-contents-ios-light.webp)

```tsx MatchContentsExample.tsx
import { Host, Button } from '@expo/ui';

export default function MatchContentsExample() {
  return (
    <Host matchContents>
      <Button label="Sized to content" onPress={() => {}} />
    </Host>
  );
}
```

### Layout direction

Use `layoutDirection` to render the subtree as left-to-right or right-to-left. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, it sets the `dir` attribute on the underlying `View` so descendants inherit the chosen direction.

**Android**

![Two labels laid out right to left, with Second before First](/static/images/expo-ui/examples/universal-host-layout-direction-android-light.webp)

**iOS**

![Two labels laid out right to left, with Second before First](/static/images/expo-ui/examples/universal-host-layout-direction-ios-light.webp)

```tsx LayoutDirectionExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function LayoutDirectionExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host
      layoutDirection="rightToLeft"
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row spacing={8}>
        <Text textStyle={ink}>First</Text>
        <Text textStyle={ink}>Second</Text>
      </Row>
    </Host>
  );
}
```

### Reacting to content layout

Use `onLayoutContent` to be notified of the current dimensions of the host's content. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, it is derived from the underlying `View`'s `onLayout` callback.

**Android**

![A Hello world label sized to its own content](/static/images/expo-ui/examples/universal-host-on-layout-content-android-light.webp)

**iOS**

![A Hello world label sized to its own content](/static/images/expo-ui/examples/universal-host-on-layout-content-ios-light.webp)

```tsx OnLayoutContentExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function OnLayoutContentExample() {
  const colorScheme = useColorScheme();

  return (
    <Host
      matchContents
      onLayoutContent={({ nativeEvent: { width, height } }) =>
        console.log(`content size: ${width}x${height}`)
      }>
      <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Hello, world!
      </Text>
    </Host>
  );
}
```

### Filling the viewport

Use `useViewportSizeMeasurement` for content that should size to the available viewport space. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, the host's underlying `View` is given the current window's width and height; any explicit `style` you pass still wins.

**Android**

![A Fills the viewport label centered on the screen](/static/images/expo-ui/examples/universal-host-viewport-android-light.webp)

**iOS**

![A Fills the viewport label centered on the screen](/static/images/expo-ui/examples/universal-host-viewport-ios-light.webp)

```tsx UseViewportSizeMeasurementExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text } from '@expo/ui';

export default function UseViewportSizeMeasurementExample() {
  const colorScheme = useColorScheme();

  return (
    <Host useViewportSizeMeasurement>
      <Column spacing={12} alignment="center">
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Fills the viewport
        </Text>
      </Column>
    </Host>
  );
}
```

### Ignoring safe areas

By default, `Host` respects the device safe area insets (notch, home indicator, and so on). Use `ignoreSafeArea="all"` to let content extend edge-to-edge, or `ignoreSafeArea="keyboard"` to keep safe-area padding but ignore the keyboard inset. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, it is implemented via the CSS `env(safe-area-inset-*)` values applied as padding on the underlying `View`; the default also folds in `env(keyboard-inset-*)` for pages that opt in to the [VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API).

**Android**

![Labels drawn under the status bar and the navigation bar](/static/images/expo-ui/examples/universal-host-ignore-safe-area-android-light.webp)

**iOS**

![Labels drawn under the Dynamic Island and the home indicator](/static/images/expo-ui/examples/universal-host-ignore-safe-area-ios-light.webp)

```tsx IgnoreSafeAreaExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Spacer, Text } from '@expo/ui';

export default function IgnoreSafeAreaExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host ignoreSafeArea="all" style={{ flex: 1 }}>
      <Column alignment="center">
        <Text textStyle={ink}>Behind the status bar</Text>
        <Spacer flexible />
        <Text textStyle={ink}>Behind the home indicator</Text>
      </Column>
    </Host>
  );
}
```

### Forcing a color scheme

Use `colorScheme` to override the appearance of the subtree. Pass `'light'` or `'dark'` to force one, or omit it to follow the device setting. On Android and iOS, this is forwarded to the platform-native `Host` (see [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host) for the exact platform semantics). On web, it sets `data-theme` on the underlying `View` so the design-token CSS variables resolve to the forced scheme regardless of `prefers-color-scheme`.

**Android**

![A button in dark theme colors on an otherwise light screen](/static/images/expo-ui/examples/universal-host-color-scheme-android-light.webp)

**iOS**

![A button in dark theme colors on an otherwise light screen](/static/images/expo-ui/examples/universal-host-color-scheme-ios-light.webp)

```tsx HostColorSchemeExample.tsx
import { Host, Button } from '@expo/ui';

export default function HostColorSchemeExample() {
  return (
    <Host colorScheme="dark" matchContents>
      <Button label="Always dark" onPress={() => {}} />
    </Host>
  );
}
```

### Seeding the color theme

Use `seedColor` to derive the theme applied to the subtree from a single base color. Each platform interprets it natively. On Android, it generates a full Material 3 palette (`SchemeTonalSpot`, the same algorithm as Material You) that themes Compose children and is exposed to descendants via [`useMaterialColors`](/versions/latest/sdk/ui/jetpack-compose/colors#usematerialcolorsoptions). On iOS, it is applied as the SwiftUI tint, propagating through the environment to theme interactive controls such as buttons, switches, and sliders. On web, it generates a primary color scale exposed as CSS variables to the underlying `View`. When omitted, each platform falls back to its default theme.

**Android**

![A green Material 3 button above a green switch](/static/images/expo-ui/examples/universal-host-seed-color-android-light.webp)

**iOS**

![A green button above a green switch](/static/images/expo-ui/examples/universal-host-seed-color-ios-light.webp)

```tsx HostSeedColorExample.tsx
import { Host, Column, Button, Switch } from '@expo/ui';

export default function HostSeedColorExample() {
  return (
    <Host seedColor="#00bc7d" style={{ flex: 1 }}>
      <Column spacing={12} alignment="center">
        <Button label="Themed button" onPress={() => {}} />
        <Switch value onValueChange={() => {}} />
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Host } from '@expo/ui';
```
