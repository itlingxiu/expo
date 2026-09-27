---
title: Button 组件参考
description: A SwiftUI Button component for displaying native buttons.
---

# Button 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`Button`](/versions/latest/sdk/ui/universal/button) — it renders the appropriate native component per platform.

Expo UI Button matches the official SwiftUI [Button API](https://developer.apple.com/documentation/swiftui/button) and supports styling via the [`buttonStyle`](modifiers#buttonstylestyle), [`controlSize`](modifiers#controlsizesize), and other modifiers.

![Two iOS 26 Liquid Glass buttons — a glassProminent Get started above a glass Learn more](/static/images/expo-ui/button/ios-light.webp)

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

### Basic button

![A blue Press me button](/static/images/expo-ui/examples/button-basic-ios-light.webp)

```tsx BasicButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';

export default function BasicButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Press me" onPress={() => alert('Pressed!')} />
    </Host>
  );
}
```

### Button with system image

![A Download button with a downward arrow icon before the label](/static/images/expo-ui/examples/button-with-image-ios-light.webp)

```tsx ButtonWithImageExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';

export default function ButtonWithImageExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Download"
        systemImage="arrow.down.circle"
        onPress={() => alert('Downloading...')}
      />
    </Host>
  );
}
```

### Icon-only button

Use the `labelStyle` modifier to show only the icon while keeping the label for accessibility.

![A gear icon button with no visible label](/static/images/expo-ui/examples/button-icon-only-ios-light.webp)

```tsx IconOnlyButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';

export default function IconOnlyButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Settings"
        systemImage="gear"
        modifiers={[labelStyle('iconOnly')]}
        onPress={() => alert('Settings')}
      />
    </Host>
  );
}
```

### Button styles

Use the `buttonStyle` modifier to change the button's appearance. Available styles are: `bordered`, `borderedProminent`, `borderless`, `plain`, `glass`, and `glassProminent`.

> **Note:** The `glass` and `glassProminent` styles are only available on iOS 26+ when built with Xcode 26.

![Four buttons showing the bordered, bordered prominent, borderless, and plain styles](/static/images/expo-ui/examples/button-styles-ios-light.webp)

```tsx ButtonStylesExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function ButtonStylesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button
          label="Bordered"
          modifiers={[buttonStyle('bordered')]}
        />
        <Button
          label="Bordered Prominent"
          modifiers={[buttonStyle('borderedProminent')]}
        />
        <Button
          label="Borderless"
          modifiers={[buttonStyle('borderless')]}
        />
        <Button label="Plain" modifiers={[buttonStyle('plain')]} />
      </VStack>
    </Host>
  );
}
```

### Button border shape

Use the `buttonBorderShape` modifier to change the shape of a styled button. Available shapes are: `automatic`, `capsule`, `roundedRectangle`, and `circle` (iOS 17+).

![A circular glass button holding a heart icon](/static/images/expo-ui/examples/button-border-shape-ios-light.webp)

```tsx ButtonBorderShapeExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  buttonBorderShape,
  labelStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ButtonBorderShapeExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Favorite"
        systemImage="heart.fill"
        modifiers={[
          buttonStyle('glass'),
          controlSize('extraLarge'),
          labelStyle('iconOnly'),
          buttonBorderShape('circle'),
        ]}
        onPress={() => alert('Favorited')}
      />
    </Host>
  );
}
```

### Control sizes

Use the `controlSize` modifier to adjust the button size. Available sizes are: `mini`, `small`, `regular`, `large`, and `extraLarge`.

> **Note:** The `extraLarge` size is only available on iOS 17+.

![Four bordered buttons at the mini, small, regular, and large sizes](/static/images/expo-ui/examples/button-control-sizes-ios-light.webp)

```tsx ControlSizeExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
} from '@expo/ui/swift-ui/modifiers';

export default function ControlSizeExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button
          label="Mini"
          modifiers={[controlSize('mini'), buttonStyle('bordered')]}
        />
        <Button
          label="Small"
          modifiers={[
            controlSize('small'),
            buttonStyle('bordered'),
          ]}
        />
        <Button
          label="Regular"
          modifiers={[
            controlSize('regular'),
            buttonStyle('bordered'),
          ]}
        />
        <Button
          label="Large"
          modifiers={[
            controlSize('large'),
            buttonStyle('bordered'),
          ]}
        />
      </VStack>
    </Host>
  );
}
```

### Button roles

Use the `role` prop to indicate the semantic role of the button. Available roles are: `default`, `cancel`, and `destructive`.

![Three buttons showing the default, cancel, and red destructive roles](/static/images/expo-ui/examples/button-roles-ios-light.webp)

```tsx ButtonRolesExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';

export default function ButtonRolesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button label="Default" role="default" />
        <Button label="Cancel" role="cancel" />
        <Button label="Delete" role="destructive" />
      </VStack>
    </Host>
  );
}
```

### Tinted button

Use the `tint` modifier to change the button's color.

![A Custom Color button tinted tomato red](/static/images/expo-ui/examples/button-tinted-ios-light.webp)

```tsx TintedButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Custom Color" modifiers={[tint('#FF6347')]} />
    </Host>
  );
}
```

### Disabled button

Use the `disabled` modifier to disable the button.

![A grayed out Disabled button](/static/images/expo-ui/examples/button-disabled-ios-light.webp)

```tsx DisabledButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { disabled } from '@expo/ui/swift-ui/modifiers';

export default function DisabledButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Disabled" modifiers={[disabled()]} />
    </Host>
  );
}
```

### Custom label content

You can pass custom components as `children` for more complex button label content.

![A button with a folder icon stacked above the label Folder](/static/images/expo-ui/examples/button-custom-content-ios-light.webp)

```tsx CustomContentExample.tsx
import {
  Host,
  Button,
  VStack,
  Image,
  Text,
} from '@expo/ui/swift-ui';

export default function CustomContentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button onPress={() => console.log('Pressed!')}>
        <VStack spacing={4}>
          <Image systemName="folder" />
          <Text>Folder</Text>
        </VStack>
      </Button>
    </Host>
  );
}
```

## API

```tsx
import { Button } from '@expo/ui/swift-ui';
```
