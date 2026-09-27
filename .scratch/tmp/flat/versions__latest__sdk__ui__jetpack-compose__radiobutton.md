---
title: RadioButton 组件参考
description: A Jetpack Compose RadioButton component for single-selection controls.
---

# RadioButton 组件参考

> 支持平台：Android、Expo Go。

A radio button component for selecting a single option from a set. Maps to the official Jetpack Compose [RadioButton](https://developer.android.com/develop/ui/compose/components/radio-button) API.

![Selected and unselected Material 3 radio buttons](/static/images/expo-ui/radiobutton/android-light.webp)

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

### Basic radio button

A standalone radio button with an `onClick` handler.

![A single radio button in its selected state](/static/images/expo-ui/examples/radiobutton-basic-android-light.webp)

```tsx BasicRadioButton.tsx
import { useState } from 'react';
import { Host, RadioButton } from '@expo/ui/jetpack-compose';

export default function BasicRadioButton() {
  const [selected, setSelected] = useState(false);

  return (
    <Host matchContents>
      <RadioButton
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    </Host>
  );
}
```

### Radio group (recommended)

The recommended pattern for a radio group follows the [Compose accessibility guidelines](https://developer.android.com/develop/ui/compose/components/radio-button):

- Wrap the group in a `Column` with the `selectableGroup()` modifier so screen readers treat the options as a group.
- Apply the `selectable` modifier with `role: 'radioButton'` on each `Row`, making the entire row (including the label) tappable.
- Pass no `onClick` to the `RadioButton` itself, the row handles the interaction. This provides a larger touch target.

![Three radio rows labelled Calls, Missed, and Friends, with Calls selected](/static/images/expo-ui/examples/radiobutton-group-android-light.webp)

```tsx RadioGroup.tsx
import { useState } from 'react';
import {
  Host,
  Column,
  Row,
  RadioButton,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  selectable,
  selectableGroup,
  fillMaxWidth,
  height,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RadioGroup() {
  const colors = useMaterialColors();
  const [selectedOption, setSelectedOption] = useState('Calls');
  const options = ['Calls', 'Missed', 'Friends'];

  return (
    <Host matchContents>
      <Column modifiers={[selectableGroup()]}>
        {options.map(label => (
          <Row
            key={label}
            verticalAlignment="center"
            modifiers={[
              fillMaxWidth(),
              height(56),
              selectable(
                label === selectedOption,
                () => setSelectedOption(label),
                'radioButton'
              ),
              padding(16, 0, 16, 0),
            ]}>
            <RadioButton selected={label === selectedOption} />
            <Text
              color={colors.onBackground}
              modifiers={[padding(16, 0, 0, 0)]}>
              {label}
            </Text>
          </Row>
        ))}
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { RadioButton } from '@expo/ui/jetpack-compose';
```
