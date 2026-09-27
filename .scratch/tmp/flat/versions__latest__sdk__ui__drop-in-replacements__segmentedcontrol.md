---
title: SegmentedControl 组件参考
description: A segmented control compatible with @react-native-segmented-control/segmented-control.
---

# SegmentedControl 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A `SegmentedControl` component with an API compatible with `@react-native-segmented-control/segmented-control`. It uses Jetpack Compose `SingleChoiceSegmentedButtonRow` on Android and SwiftUI `Picker` with segmented style on iOS.

Under the hood this component wraps the platform-specific `@expo/ui` primitives:

- **Android**: [Jetpack Compose SegmentedButton](/versions/latest/sdk/ui/jetpack-compose/segmentedbutton)
- **iOS**: [SwiftUI Picker](/versions/latest/sdk/ui/swift-ui/picker) with `pickerStyle('segmented')`

If you need lower-level control (custom modifiers, styles, or layouts), use those primitives directly.

**Android**

![A Material 3 segmented button row with One selected](/static/images/expo-ui/community-segmentedcontrol/android-light.webp)

**iOS**

![A segmented control with One selected](/static/images/expo-ui/community-segmentedcontrol/ios-light.webp)

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

## Migrating from `@react-native-segmented-control/segmented-control`

- Update the import from `import SegmentedControl from '@react-native-segmented-control/segmented-control'` to `import SegmentedControl from '@expo/ui/community/segmented-control'`.
- Image values in the `values` array are not supported, only strings.
- `momentary`, `backgroundColor`, `fontStyle`, and `activeFontStyle` props are not supported.
- `tintColor` only works on Android (sets the active segment container color). On iOS, it has no effect.

## Basic usage

**Android**

![A Material 3 segmented button row with One selected](/static/images/expo-ui/examples/community-segmentedcontrol-basic-android-light.webp)

**iOS**

![A segmented control with One selected](/static/images/expo-ui/examples/community-segmentedcontrol-basic-ios-light.webp)

```tsx SegmentedControlExample.tsx
import { useState } from 'react';
import SegmentedControl from '@expo/ui/community/segmented-control';

export default function SegmentedControlExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SegmentedControl
      values={['One', 'Two', 'Three']}
      selectedIndex={selectedIndex}
      onChange={event => {
        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
}
```

## API

```tsx
import SegmentedControl from '@expo/ui/community/segmented-control';
```
