---
title: Form 组件参考
description: A SwiftUI Form component for collecting user input in a structured layout.
---

# Form 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Form matches the official SwiftUI [Form API](https://developer.apple.com/documentation/swiftui/form). It provides a container for grouping controls used for data entry, such as in settings or inspection panes.

![A Form with two grouped Sections of Toggles and a footer caption](/static/images/expo-ui/form/ios-light.webp)

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

### Basic form

![A form holding a single Enter your name text field](/static/images/expo-ui/examples/form-basic-ios-light.webp)

```tsx BasicFormExample.tsx
import { Host, Form, TextField } from '@expo/ui/swift-ui';

export default function BasicFormExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <TextField placeholder="Enter your name" />
      </Form>
    </Host>
  );
}
```

### Form with sections

Use the [`Section`](section) component to group related controls within a form.

![A form with a Profile section of two fields, a Preferences section of two toggles, and a Save changes button](/static/images/expo-ui/examples/form-with-sections-ios-light.webp)

```tsx FormWithSectionsExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  TextField,
  Toggle,
  Button,
} from '@expo/ui/swift-ui';

export default function FormWithSectionsExample() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Profile">
          <TextField placeholder="Name" />
          <TextField placeholder="Email" />
        </Section>

        <Section title="Preferences">
          <Toggle
            label="Enable notifications"
            isOn={notifications}
            onIsOnChange={setNotifications}
          />
          <Toggle
            label="Dark mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
        </Section>

        <Section>
          <Button
            label="Save changes"
            onPress={() => console.log('Saved!')}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

### Form with custom background

Use the `scrollContentBackground` modifier to customize or hide the form's background.

![A form with a light grey background behind a Custom Background section](/static/images/expo-ui/examples/form-background-ios-light.webp)

```tsx FormBackgroundExample.tsx
import { Host, Form, Section, TextField } from '@expo/ui/swift-ui';
import {
  scrollContentBackground,
  background,
} from '@expo/ui/swift-ui/modifiers';

export default function FormBackgroundExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form
        modifiers={[
          scrollContentBackground('hidden'),
          background('#F0F0F0'),
        ]}>
        <Section title="Custom Background">
          <TextField placeholder="Enter text" />
        </Section>
      </Form>
    </Host>
  );
}
```

### Non-scrollable form

Use the [`scrollDisabled`](modifiers#scrolldisableddisabled) modifier to prevent the form from scrolling.

> **Note:** The `scrollDisabled` modifier is only available on iOS 16+ and tvOS 16+.

![A form with a Settings section holding one Enable feature toggle](/static/images/expo-ui/examples/form-non-scrollable-ios-light.webp)

```tsx NonScrollableFormExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  TextField,
  Toggle,
} from '@expo/ui/swift-ui';
import { scrollDisabled } from '@expo/ui/swift-ui/modifiers';

export default function NonScrollableFormExample() {
  const [isOn, setIsOn] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[scrollDisabled()]}>
        <Section title="Settings">
          <Toggle
            label="Enable feature"
            isOn={isOn}
            onIsOnChange={setIsOn}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

### Pull-to-refresh form

Use the `refreshable` modifier to add pull-to-refresh functionality.

![A form with a Pull to refresh section showing the last refresh time](/static/images/expo-ui/examples/form-refreshable-ios-light.webp)

```tsx RefreshableFormExample.tsx
import { useState, useCallback } from 'react';
import { Host, Form, Section, Text } from '@expo/ui/swift-ui';
import { refreshable } from '@expo/ui/swift-ui/modifiers';

export default function RefreshableFormExample() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = useCallback(async () => {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastRefresh(new Date());
  }, []);

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[refreshable(handleRefresh)]}>
        <Section title="Pull to refresh">
          <Text>
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </Text>
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { Form } from '@expo/ui/swift-ui';
```
