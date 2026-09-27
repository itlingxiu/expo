---
title: Label 组件参考
description: A SwiftUI Label component for displaying text with an icon.
---

# Label 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Label matches the official SwiftUI [Label API](https://developer.apple.com/documentation/swiftui/label) and displays a title alongside an icon.

![Three Label rows with SF Symbols inside a Form](/static/images/expo-ui/label/ios-light.webp)

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

### Basic label with SF Symbol

![A star SF Symbol next to the title Favorites](/static/images/expo-ui/examples/label-basic-ios-light.webp)

```tsx BasicLabelExample.tsx
import { Host, Label } from '@expo/ui/swift-ui';

export default function BasicLabelExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Label title="Favorites" systemImage="star.fill" />
    </Host>
  );
}
```

### With custom icon

Use the `icon` prop to provide a custom React node as the icon instead of an SF Symbol.

![A purple sparkles SF Symbol next to the title Custom Icon](/static/images/expo-ui/examples/label-custom-icon-ios-light.webp)

```tsx LabelCustomIconExample.tsx
import { Host, Label, Image } from '@expo/ui/swift-ui';

export default function LabelCustomIconExample() {
  return (
    <Host matchContents>
      <Label
        title="Custom Icon"
        icon={
          <Image systemName="sparkles" size={20} color="purple" />
        }
      />
    </Host>
  );
}
```

### Icon only

Use the [`labelStyle`](modifiers#labelstylestyle) modifier with `iconOnly` to display only the icon. Always provide a `title` for accessibility even though it won't be visible.

![A gear SF Symbol shown alone, with no visible title text](/static/images/expo-ui/examples/label-icon-only-ios-light.webp)

```tsx LabelIconOnlyExample.tsx
import { Host, Label } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';

export default function LabelIconOnlyExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Label
        title="Settings"
        systemImage="gear"
        modifiers={[labelStyle('iconOnly')]}
      />
    </Host>
  );
}
```

## API

```tsx
import { Label } from '@expo/ui/swift-ui';
```
