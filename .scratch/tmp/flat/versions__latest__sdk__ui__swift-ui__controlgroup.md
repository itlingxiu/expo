---
title: ControlGroup 组件参考
description: A SwiftUI ControlGroup component for grouping interactive controls.
---

# ControlGroup 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI ControlGroup matches the official SwiftUI [ControlGroup API](https://developer.apple.com/documentation/swiftui/controlgroup). When placed inside a [`Menu`](menu), the children are rendered as a compact horizontal row of buttons.

![An open Menu showing a ControlGroup row of Add, Favorite, Share icon buttons above Rename and Delete entries](/static/images/expo-ui/controlgroup/ios-light.webp)

> **Note:** On tvOS, `ControlGroup` requires tvOS 17.0 or later.

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

### Basic control group

A control group inside a menu, these render as a horizontal row of icon buttons.

![An open menu with an Add, Favorite, and Share icon row above an Other Action entry](/static/images/expo-ui/examples/controlgroup-basic-ios-light.webp)

```tsx BasicControlGroupExample.tsx
import {
  Host,
  Menu,
  ControlGroup,
  Button,
} from '@expo/ui/swift-ui';

export default function BasicControlGroupExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="Options" systemImage="ellipsis.circle">
        <ControlGroup>
          <Button
            systemImage="plus"
            label="Add"
            onPress={() => console.log('Add')}
          />
          <Button
            systemImage="star"
            label="Favorite"
            onPress={() => console.log('Favorite')}
          />
          <Button
            systemImage="square.and.arrow.up"
            label="Share"
            onPress={() => console.log('Share')}
          />
        </ControlGroup>
        <Button
          label="Other Action"
          onPress={() => console.log('Other')}
        />
      </Menu>
    </Host>
  );
}
```

## API

```tsx
import { ControlGroup } from '@expo/ui/swift-ui';
```
