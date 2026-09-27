---
title: DisclosureGroup 组件参考
description: A SwiftUI DisclosureGroup component for displaying expandable content.
---

# DisclosureGroup 组件参考

> 支持平台：iOS、Expo Go。

Expo UI DisclosureGroup matches the official SwiftUI [DisclosureGroup API](https://developer.apple.com/documentation/swiftui/disclosuregroup) and displays a disclosure indicator that reveals or hides content.

![DisclosureGroup expanded inside a Form](/static/images/expo-ui/disclosuregroup/ios-light.webp)

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

### Basic disclosure group

`DisclosureGroup` is most commonly used inside a [`Form`](form) so it picks up the standard iOS list styling with a chevron indicator.

![An expanded Advanced settings group in a form, listing three settings rows](/static/images/expo-ui/examples/disclosuregroup-basic-ios-light.webp)

```tsx BasicDisclosureGroupExample.tsx
import { useState } from 'react';
import {
  DisclosureGroup,
  Form,
  Host,
  Section,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicDisclosureGroupExample() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <DisclosureGroup
            label="Advanced settings"
            isExpanded={isExpanded}
            onIsExpandedChange={setIsExpanded}>
            <Text>Auto-update apps</Text>
            <Text>App downloads</Text>
            <Text>Offload unused apps</Text>
          </DisclosureGroup>
        </Section>
      </Form>
    </Host>
  );
}
```

### Initially expanded

Set `isExpanded` to `true` initially to show the content by default.

![A Details group outside a form, expanded to show one line of content](/static/images/expo-ui/examples/disclosuregroup-initially-expanded-ios-light.webp)

```tsx InitiallyExpandedExample.tsx
import { useState } from 'react';
import { Host, DisclosureGroup, Text } from '@expo/ui/swift-ui';

export default function InitiallyExpandedExample() {
  const [isExpanded, setIsExpanded] = useState(true);

  // DisclosureGroup 会占满给定宽度，因此 `matchContents` 会把它压扁。
  return (
    <Host style={{ flex: 1 }}>
      <DisclosureGroup
        label="Details"
        isExpanded={isExpanded}
        onIsExpandedChange={setIsExpanded}>
        <Text>This content is visible by default.</Text>
      </DisclosureGroup>
    </Host>
  );
}
```

### Custom label

Use `DisclosureGroup.Label` when the label needs custom SwiftUI content or modifiers instead of the `label` string prop.

![A collapsed group in a form with a semibold teal Network options label](/static/images/expo-ui/examples/disclosuregroup-custom-label-ios-light.webp)

```tsx CustomLabelDisclosureGroupExample.tsx
import { useState } from 'react';
import {
  DisclosureGroup,
  Form,
  Host,
  Section,
  Text,
} from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function CustomLabelDisclosureGroupExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <DisclosureGroup
            isExpanded={isExpanded}
            onIsExpandedChange={setIsExpanded}>
            <DisclosureGroup.Label>
              <Text
                modifiers={[
                  font({ weight: 'semibold' }),
                  foregroundStyle('#0a7ea4'),
                ]}>
                Network options
              </Text>
            </DisclosureGroup.Label>
            <Text>Wi-Fi</Text>
            <Text>Bluetooth</Text>
            <Text>Cellular data</Text>
          </DisclosureGroup>
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { DisclosureGroup } from '@expo/ui/swift-ui';
```
