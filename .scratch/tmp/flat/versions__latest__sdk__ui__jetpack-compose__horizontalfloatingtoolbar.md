---
title: HorizontalFloatingToolbar 组件参考
description: A Jetpack Compose HorizontalFloatingToolbar component for displaying a floating action bar.
---

# HorizontalFloatingToolbar 组件参考

> 支持平台：Android、Expo Go。

Expo UI HorizontalFloatingToolbar wraps the official Jetpack Compose [`HorizontalFloatingToolbar`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-horizontal-floating-toolbar.html) and displays a horizontal toolbar that floats above content, containing action buttons.

> **Note:** If you only need a single floating button, use [`FloatingActionButton`](/versions/latest/sdk/ui/jetpack-compose/floatingactionbutton) instead.

![Pill-shaped floating toolbar with three icon buttons and a separate primary FAB](/static/images/expo-ui/horizontalfloatingtoolbar/android-light.webp)

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

### Floating toolbar over scrollable content

Place the toolbar inside a `Box` with `floatingToolbarExitAlwaysScrollBehavior` to get scroll-driven hide/show behavior. Use `align('bottomCenter')` to position the toolbar at the bottom of the screen. The entire layout stays within the Compose layer — no React Native absolute positioning needed.

![A floating toolbar with an edit button and an add button, centered over a scrollable list](/static/images/expo-ui/examples/toolbar-floating-android-light.webp)

```tsx FloatingToolbarExample.tsx
import {
  Box,
  HorizontalFloatingToolbar,
  Host,
  Icon,
  IconButton,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  offset,
} from '@expo/ui/jetpack-compose/modifiers';

const ITEMS = Array.from(
  { length: 20 },
  (_, index) => `Item ${index + 1}`
);

export default function FloatingToolbarExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Box
        modifiers={[fillMaxSize()]}
        floatingToolbarExitAlwaysScrollBehavior="bottom">
        <LazyColumn modifiers={[fillMaxSize()]}>
          {ITEMS.map(item => (
            <ListItem key={item}>
              <ListItem.HeadlineContent>
                <Text>{item}</Text>
              </ListItem.HeadlineContent>
            </ListItem>
          ))}
        </LazyColumn>

        <HorizontalFloatingToolbar
          variant="vibrant"
          modifiers={[align('bottomCenter'), offset(0, -16)]}>
          <IconButton onClick={() => console.log('Edit pressed')}>
            <Icon source={require('./assets/edit.xml')} />
          </IconButton>
          <HorizontalFloatingToolbar.FloatingActionButton
            onPress={() => console.log('Add pressed')}>
            <Icon source={require('./assets/add.xml')} />
          </HorizontalFloatingToolbar.FloatingActionButton>
        </HorizontalFloatingToolbar>
      </Box>
    </Host>
  );
}
```

### Toolbar with FloatingActionButton

Use `IconButton` as direct children for toolbar items, and `HorizontalFloatingToolbar.FloatingActionButton` for the primary action.

![A pill shaped toolbar holding edit and share buttons, beside a separate add button](/static/images/expo-ui/examples/toolbar-with-fab-android-light.webp)

```tsx ToolbarWithFABExample.tsx
import {
  Host,
  HorizontalFloatingToolbar,
  IconButton,
  Icon,
} from '@expo/ui/jetpack-compose';

export default function ToolbarWithFABExample() {
  return (
    <Host matchContents>
      <HorizontalFloatingToolbar>
        <IconButton onClick={() => console.log('Edit pressed')}>
          <Icon
            source={require('./assets/edit.xml')}
            contentDescription="Edit"
          />
        </IconButton>
        <IconButton onClick={() => console.log('Share pressed')}>
          <Icon
            source={require('./assets/share.xml')}
            contentDescription="Share"
          />
        </IconButton>
        <HorizontalFloatingToolbar.FloatingActionButton
          onPress={() => console.log('Add pressed')}>
          <Icon
            source={require('./assets/add.xml')}
            contentDescription="Add"
          />
        </HorizontalFloatingToolbar.FloatingActionButton>
      </HorizontalFloatingToolbar>
    </Host>
  );
}
```

## API

```tsx
import { HorizontalFloatingToolbar } from '@expo/ui/jetpack-compose';
```
