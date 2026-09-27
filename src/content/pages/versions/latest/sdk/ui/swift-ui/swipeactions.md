---
title: SwipeActions 组件参考
description: 用于为行内容添加前置和后置滑动操作的 SwiftUI SwipeActions 组件。
---

# SwipeActions 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 SwipeActions 与官方 SwiftUI [swipeActions](https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:)) 修改器保持一致，可为行内容附加前置或后置操作。

## 安装

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

## 用法

![列表行被滑开一部分，标签 Message from Expo 旁边显示前置的 Pin 操作。](/static/images/expo-ui/examples/swipeactions-basic-ios-light.webp)

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
