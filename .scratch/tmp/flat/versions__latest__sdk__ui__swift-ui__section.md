---
title: Section 组件参考
description: A SwiftUI Section component for grouping content within lists and forms.
---

# Section 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI Section matches the official SwiftUI [Section API](https://developer.apple.com/documentation/swiftui/section) and is used to group related content within [`List`](list), [`Form`](form) or [`Picker`](picker) components.

![Two Sections within a Form, each with a header and grouped Toggles](/static/images/expo-ui/section/ios-light.webp)

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

### Basic section with title

Use the `title` prop for simple sections with a text header.

![A list with a Settings header above General, Privacy, and Notifications rows](/static/images/expo-ui/examples/section-basic-ios-light.webp)

```tsx BasicSectionExample.tsx
import { Host, List, Section, Text } from '@expo/ui/swift-ui';

export default function BasicSectionExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Settings">
          <Text>General</Text>
          <Text>Privacy</Text>
          <Text>Notifications</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### Section with custom header and footer

Use the `header` and `footer` props for custom views. These props are only used when `title` is not provided.

![A section with a location icon in its header, a toggle row, and footer text below](/static/images/expo-ui/examples/section-header-footer-ios-light.webp)

```tsx CustomHeaderFooterExample.tsx
import {
  Host,
  List,
  Section,
  Toggle,
  Text,
  HStack,
  Image,
} from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function CustomHeaderFooterExample() {
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section
          header={
            <HStack>
              <Image
                systemName="location.fill"
                color="blue"
                size={16}
              />
              <Text>Location Services</Text>
            </HStack>
          }
          footer={
            <Text>
              Enabling location services allows the app to provide
              personalized recommendations.
            </Text>
          }>
          <Toggle
            label="Enable location"
            isOn={locationEnabled}
            onIsOnChange={setLocationEnabled}
          />
        </Section>
      </List>
    </Host>
  );
}
```

### Collapsible section

Use the `isExpanded` prop to control whether the section is expanded or collapsed. When provided, the section becomes collapsible. Use `onIsExpandedChange` to handle state changes.

> **Note:** Collapsible sections require iOS 17+ and tvOS 17+, and the list must use the `sidebar` style. Footer is not supported for collapsible sections.

![Two collapsed sections, Favorites and Recents, each with a disclosure chevron](/static/images/expo-ui/examples/section-collapsible-ios-light.webp)

```tsx CollapsibleSectionExample.tsx
import { useState } from 'react';
import { Host, List, Section, Text } from '@expo/ui/swift-ui';
import { listStyle } from '@expo/ui/swift-ui/modifiers';

export default function CollapsibleSectionExample() {
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const [recentsExpanded, setRecentsExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('sidebar')]}>
        <Section
          title="Favorites"
          isExpanded={favoritesExpanded}
          onIsExpandedChange={setFavoritesExpanded}>
          <Text>Home</Text>
          <Text>Work</Text>
          <Text>Gym</Text>
        </Section>
        <Section
          title="Recents"
          isExpanded={recentsExpanded}
          onIsExpandedChange={setRecentsExpanded}>
          <Text>Coffee Shop</Text>
          <Text>Library</Text>
          <Text>Park</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### Multiple sections in a form

Sections work within `Form` components to organize form controls into logical groups.

![A form with Appearance, Notifications, and Account sections holding toggles, a picker, and a red Sign out button](/static/images/expo-ui/examples/section-form-ios-light.webp)

```tsx FormSectionsExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  Toggle,
  Picker,
  Text,
  Button,
} from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

export default function FormSectionsExample() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState(0);
  const languages = ['English', 'Spanish', 'French', 'German'];

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Appearance">
          <Toggle
            label="Dark Mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
          <Picker
            label="Language"
            selection={language}
            onSelectionChange={setLanguage}
            modifiers={[pickerStyle('menu')]}>
            {languages.map((lang, index) => (
              <Text key={index} modifiers={[tag(index)]}>
                {lang}
              </Text>
            ))}
          </Picker>
        </Section>
        <Section title="Notifications">
          <Toggle
            label="Push Notifications"
            isOn={notifications}
            onIsOnChange={setNotifications}
          />
        </Section>
        <Section title="Account">
          <Button
            label="Sign out"
            role="destructive"
            onPress={() => alert('Signed out')}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { Section } from '@expo/ui/swift-ui';
```
