---
title: ControlGroup 组件参考
description: 用于把交互控件分组的 SwiftUI ControlGroup 组件。
---

# ControlGroup 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 ControlGroup 与官方 SwiftUI [ControlGroup API](https://developer.apple.com/documentation/swiftui/controlgroup) 保持一致。放在 [`Menu`](/versions/latest/sdk/ui/swift-ui/menu) 内时，子元素会渲染为一行紧凑的水平按钮。

![打开的 Menu，ControlGroup 行包含 Add、Favorite、Share 图标按钮，下方是 Rename 和 Delete 项](/static/images/expo-ui/controlgroup/ios-light.webp)

:::note
在 tvOS 上，`ControlGroup` 需要 tvOS 17.0 或更高版本。
:::

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

### 基本控件组

菜单中的控件组会渲染为一行水平的图标按钮。

![打开的菜单，Add、Favorite 和 Share 图标行位于 Other Action 项上方](/static/images/expo-ui/examples/controlgroup-basic-ios-light.webp)

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
