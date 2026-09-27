---
title: SwipeActions 组件参考
description: A SwiftUI SwipeActions component for adding leading and trailing swipe actions to row content.
---

# SwipeActions 组件参考

> 支持平台：iOS、Expo Go。

Expo UI SwipeActions matches the official SwiftUI [swipeActions](<https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:)>) modifier and lets you attach leading or trailing actions to row content.

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

![A list row swiped part way open, showing its leading Pin action beside the label Message from Expo.](/static/images/expo-ui/examples/swipeactions-basic-ios-light.webp)

```tsx SwipeActionsExample.tsx
import {
  Button,
  Host,
  List,
  Section,
  SwipeActions,
  Text,
} from '@expo/ui/swift-ui';

export default function SwipeActionsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section>
          <SwipeActions>
            <Text>Message from Expo</Text>

            <SwipeActions.Actions
              edge="leading"
              allowsFullSwipe={false}>
              <Button
                label="Pin"
                systemImage="pin"
                onPress={() => {}}
              />
            </SwipeActions.Actions>

            <SwipeActions.Actions edge="trailing">
              <Button
                label="Delete"
                systemImage="trash"
                role="destructive"
                onPress={() => {}}
              />
            </SwipeActions.Actions>
          </SwipeActions>
        </Section>
      </List>
    </Host>
  );
}
```

## API

```tsx
import { SwipeActions } from '@expo/ui/swift-ui';
```
