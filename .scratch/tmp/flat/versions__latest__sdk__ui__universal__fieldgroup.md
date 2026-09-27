---
title: FieldGroup 组件参考
description: A scrollable container of grouped settings-style rows.
---

# FieldGroup 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

A scrollable container for grouped settings-style rows, mirroring the look of an iOS Settings screen. Compose `FieldGroup.Section` (for explicit groups), `FieldGroup.SectionHeader`, and `FieldGroup.SectionFooter` slots inside.

> **Note:** `FieldGroup` scrolls and has no height of its own. It stretches to fill its parent, so give it a parent with a definite size, such as a `<Host style={{ flex: 1 }}>` or a host with an explicit height. It will not appear inside a size-to-fit container like `<Host matchContents>`, because there is no bounded height for the group to fill.

**Android**

![A Notifications section with Push and Email switch rows](/static/images/expo-ui/fieldgroup/android-light.webp)

**iOS**

![A Notifications section with Push and Email switch rows](/static/images/expo-ui/fieldgroup/ios-light.webp)

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

### Sectioned form

**Android**

![A Notifications section with Push on and Email off, above an About section](/static/images/expo-ui/examples/universal-fieldgroup-basic-android-light.webp)

**iOS**

![A Notifications section with Push on and Email off, above an About section](/static/images/expo-ui/examples/universal-fieldgroup-basic-ios-light.webp)

```tsx FieldGroupExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, FieldGroup, Switch, Text } from '@expo/ui';

export default function FieldGroupExample() {
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Notifications">
          <Switch label="Push" value={notifications} onValueChange={setNotifications} />
          <Switch label="Email" value={analytics} onValueChange={setAnalytics} />
        </FieldGroup.Section>

        <FieldGroup.Section title="About">
          <Text textStyle={ink}>Version 1.0.0</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
```

### Custom section header and footer

Use `FieldGroup.SectionHeader` and `FieldGroup.SectionFooter` to render fully styled header/footer slots in place of the default `title` text.

**Android**

![A Privacy section with a Share usage switch and a footnote below it](/static/images/expo-ui/examples/universal-fieldgroup-slots-android-light.webp)

**iOS**

![A Privacy section with a Share usage switch and a footnote below it](/static/images/expo-ui/examples/universal-fieldgroup-slots-ios-light.webp)

```tsx FieldGroupSlotsExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, FieldGroup, Switch, Text } from '@expo/ui';

export default function FieldGroupSlotsExample() {
  const [enabled, setEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section>
          <FieldGroup.SectionHeader>
            <Text textStyle={{ ...ink, fontSize: 16, fontWeight: '700' }}>Privacy</Text>
          </FieldGroup.SectionHeader>

          <Switch label="Share usage" value={enabled} onValueChange={setEnabled} />

          <FieldGroup.SectionFooter>
            <Text textStyle={{ fontSize: 12, color: '#8E8E93' }}>
              Helps us improve the app. You can disable this at any time.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
```

## API

```tsx
import { FieldGroup } from '@expo/ui';
```
