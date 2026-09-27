---
title: Collapsible 组件参考
description: A labelled tappable header that toggles visibility of its content.
---

# Collapsible 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Collapsible` is a primitive that shows or hides its content with a tap on a labelled header. Controlled via [`isOpen`](#isopen) and [`onOpenChange`](#onopenchange) — each `Collapsible` manages independent state.

**Android**

![An expanded About section with a chevron and description text](/static/images/expo-ui/collapsible/android-light.webp)

**iOS**

![An expanded About section with a chevron and description text](/static/images/expo-ui/collapsible/ios-light.webp)

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

### Basic collapsible

**Android**

![A collapsed About row with a chevron](/static/images/expo-ui/examples/universal-collapsible-basic-android-light.webp)

**iOS**

![A collapsed About row with a chevron](/static/images/expo-ui/examples/universal-collapsible-basic-ios-light.webp)

```tsx CollapsibleExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Collapsible, Text } from '@expo/ui';

export default function CollapsibleExample() {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} style={{ padding: 16 }}>
        <Collapsible isOpen={open} onOpenChange={setOpen} label="About">
          <Text textStyle={ink}>
            A primitive that toggles visibility of its content via a labelled tappable header.
          </Text>
        </Collapsible>
      </Column>
    </Host>
  );
}
```

### Accordion (one section open at a time)

Wire each `Collapsible`'s `isOpen` to a shared parent value. The component doesn't enforce exclusivity — composition is up to the consumer.

**Android**

![Three sections with the first expanded to show its content](/static/images/expo-ui/examples/universal-collapsible-accordion-android-light.webp)

**iOS**

![Three sections with the first expanded to show its content](/static/images/expo-ui/examples/universal-collapsible-accordion-ios-light.webp)

```tsx CollapsibleAccordionExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Collapsible, Text } from '@expo/ui';

type Section = 'a' | 'b' | 'c' | null;

export default function CollapsibleAccordionExample() {
  const [openSection, setOpenSection] = useState<Section>('a');
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} style={{ padding: 16 }}>
        <Collapsible
          isOpen={openSection === 'a'}
          onOpenChange={open => setOpenSection(open ? 'a' : null)}
          label="Section A">
          <Text textStyle={ink}>Opening B or C closes this one.</Text>
        </Collapsible>
        <Collapsible
          isOpen={openSection === 'b'}
          onOpenChange={open => setOpenSection(open ? 'b' : null)}
          label="Section B">
          <Text textStyle={ink}>Opening A or C closes this one.</Text>
        </Collapsible>
        <Collapsible
          isOpen={openSection === 'c'}
          onOpenChange={open => setOpenSection(open ? 'c' : null)}
          label="Section C">
          <Text textStyle={ink}>Opening A or B closes this one.</Text>
        </Collapsible>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Collapsible } from '@expo/ui';
```
