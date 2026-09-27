---
title: DropdownMenu 组件参考
description: A Jetpack Compose DropdownMenu component for displaying dropdown menus.
---

# DropdownMenu 组件参考

> 支持平台：Android、Expo Go。

Expo UI DropdownMenu matches the official Jetpack Compose [Menu API](https://developer.android.com/develop/ui/compose/components/menu) and displays a dropdown menu when a trigger element is pressed.

![Three-dot more menu opened to show Edit, Share, and Delete options with leading icons](/static/images/expo-ui/dropdownmenu/android-light.webp)

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

### Basic dropdown menu

![An outlined Show menu button with an open menu below it holding one Home item and a house icon](/static/images/expo-ui/examples/dropdownmenu-basic-android-light.webp)

```tsx BasicDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
  Icon,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

const homeIcon = require('./assets/home.xml');

export default function BasicDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem
            onClick={() => {
              setIsExpanded(false);
              console.log('Home pressed');
            }}>
            <DropdownMenuItem.Text>
              <Text>Home</Text>
            </DropdownMenuItem.Text>
            <DropdownMenuItem.LeadingIcon>
              <Icon source={homeIcon} size={24} />
            </DropdownMenuItem.LeadingIcon>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### React Native components as trigger

You can use a React Native view (such as `Pressable`) as the dropdown's trigger by wrapping it in [`RNHostView`](rnhostview).

![A purple React Native button with an open menu below it holding Item 1 and Item 2](/static/images/expo-ui/examples/dropdownmenu-rn-trigger-android-light.webp)

```tsx RNTriggerDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text as ComposeText,
  RNHostView,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export default function RNTriggerDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <Pressable
              onPress={() => setIsExpanded(true)}
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#9B59B6',
              }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>
                RN Pressable Trigger
              </Text>
            </Pressable>
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <ComposeText>Item 1</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <ComposeText>Item 2</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### Long-press trigger

Jetpack Compose has no dedicated long-press menu primitive — you compose one from a [`combinedClickable`](/versions/latest/sdk/ui/jetpack-compose/modifiers) modifier on the trigger view plus the existing controlled `DropdownMenu`. The menu anchors to the trigger automatically.

![A menu opened by long press, holding Copy and a red Delete item](/static/images/expo-ui/examples/dropdownmenu-long-press-android-light.webp)

```tsx LongPressDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  background,
  combinedClickable,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

export default function LongPressDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <Text
            modifiers={[
              background('#e0e0e0'),
              combinedClickable({
                onClick: () => console.log('Short tap'),
                onLongClick: () => setIsExpanded(true),
              }),
            ]}>
            Long-press me
          </Text>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Copy</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem
            elementColors={{ textColor: '#B3261E' }}
            onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Delete</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### Rounded corners

Use `cornerRadius` to override the default Material3 menu shape with a custom corner radius (in dp).

![A menu with rounded corners opened below a Show menu button](/static/images/expo-ui/examples/dropdownmenu-rounded-android-light.webp)

```tsx RoundedDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function RoundedDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
        cornerRadius={16}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Item 1</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### Shadow elevation

Use `shadowElevation` to set the popup shadow elevation in dp. Set it to `0` to remove the shadow, or omit it to use Material 3's default. Modifiers on `DropdownMenu` apply to the trigger container, so shadow modifiers do not change the popup shadow.

![A dropdown menu open below a Show menu button with one item and a low elevation shadow](/static/images/expo-ui/examples/dropdownmenu-shadow-android-light.webp)

```tsx ShadowDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function ShadowDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
        shadowElevation={1}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Item 1</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

## API

```tsx
import { DropdownMenu } from '@expo/ui/jetpack-compose';
```
