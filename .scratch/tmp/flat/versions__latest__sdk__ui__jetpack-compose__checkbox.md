---
title: Checkbox 组件参考
description: A Jetpack Compose Checkbox component for selection controls.
---

# Checkbox 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`Checkbox`](/versions/latest/sdk/ui/universal/checkbox) — it renders the appropriate native component per platform.

Expo UI Checkbox matches the official Jetpack Compose [Checkbox](https://developer.android.com/develop/ui/compose/components/checkbox) API.

![Checked and unchecked Material 3 checkboxes](/static/images/expo-ui/checkbox/android-light.webp)

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

### Basic checkbox

![A checked Material 3 checkbox](/static/images/expo-ui/examples/checkbox-basic-android-light.webp)

```tsx CheckboxExample.tsx
import { useState } from 'react';
import { Host, Checkbox } from '@expo/ui/jetpack-compose';

export default function CheckboxExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Checkbox value={checked} onCheckedChange={setChecked} />
    </Host>
  );
}
```

### Custom colors

![A checked checkbox filled purple with a white checkmark](/static/images/expo-ui/examples/checkbox-custom-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import { Host, Checkbox } from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [checked, setChecked] = useState(false);

  return (
    <Host matchContents>
      <Checkbox
        value={checked}
        onCheckedChange={setChecked}
        colors={{
          checkedColor: '#6200EE',
          checkmarkColor: '#FFFFFF',
        }}
      />
    </Host>
  );
}
```

### Select all (TriStateCheckbox)

Use `TriStateCheckbox` for a parent checkbox that reflects the state of its children. It supports three states: `'on'`, `'off'`, and `'indeterminate'`.

Apply the `toggleable` modifier to each `Row` to make the entire row (checkbox + label) tappable with correct accessibility semantics. When using `toggleable` on the row, omit `onCheckedChange`/`onClick` from the checkbox itself to avoid double-handling.

![A Select all row showing the indeterminate dash above one checked and two unchecked options](/static/images/expo-ui/examples/checkbox-select-all-android-light.webp)

```tsx SelectAllExample.tsx
import { useState } from 'react';
import {
  Host,
  Checkbox,
  TriStateCheckbox,
  Row,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import { toggleable } from '@expo/ui/jetpack-compose/modifiers';

export default function SelectAllExample() {
  const [child1, setChild1] = useState(false);
  const [child2, setChild2] = useState(false);
  const [child3, setChild3] = useState(false);

  const parentState =
    child1 && child2 && child3
      ? 'on'
      : !child1 && !child2 && !child3
        ? 'off'
        : 'indeterminate';

  return (
    <Host matchContents>
      <Column>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(
              parentState === 'on',
              () => {
                const newState = parentState !== 'on';
                setChild1(newState);
                setChild2(newState);
                setChild3(newState);
              },
              { role: 'checkbox' }
            ),
          ]}>
          <TriStateCheckbox state={parentState} />
          <Text>Select all</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child1, () => setChild1(!child1), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child1} />
          <Text>Option 1</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child2, () => setChild2(!child2), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child2} />
          <Text>Option 2</Text>
        </Row>
        <Row
          verticalAlignment="center"
          modifiers={[
            toggleable(child3, () => setChild3(!child3), {
              role: 'checkbox',
            }),
          ]}>
          <Checkbox value={child3} />
          <Text>Option 3</Text>
        </Row>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import {
  Checkbox,
  TriStateCheckbox,
} from '@expo/ui/jetpack-compose';
```
