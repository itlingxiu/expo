---
title: Menu 组件参考
description: 用于显示下拉菜单的 SwiftUI Menu 组件。
---

# Menu 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Menu 与官方 SwiftUI [Menu API](https://developer.apple.com/documentation/swiftui/menu) 保持一致，并可通过 [`buttonStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符设置样式。Menu 单击即可打开。长按交互请改用 [`ContextMenu`](/versions/latest/sdk/ui/swift-ui/contextmenu)。

![打开的菜单，显示 Settings、Profile 和破坏性的 Delete 项](/static/images/expo-ui/menu/ios-light.webp)

:::note
在 tvOS 上，Menu 需要 tvOS 17.0 或更高版本。
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

### 简单文本标签

![打开的菜单，列出 Option 1、Option 2 和 Option 3](/static/images/expo-ui/examples/menu-simple-ios-light.webp)

```tsx SimpleMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';

export default function SimpleMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="Options">
        <Button
          label="Option 1"
          onPress={() => console.log('Option 1')}
        />
        <Button
          label="Option 2"
          onPress={() => console.log('Option 2')}
        />
        <Button
          label="Option 3"
          onPress={() => console.log('Option 3')}
        />
      </Menu>
    </Host>
  );
}
```

### 带 SF Symbol 的文本标签

![打开的菜单，含 Settings 和 Profile 行、分隔线，以及红色 Delete 行](/static/images/expo-ui/examples/menu-with-icon-ios-light.webp)

```tsx MenuWithIconExample.tsx
import { Host, Menu, Button, Divider } from '@expo/ui/swift-ui';

export default function MenuWithIconExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="More" systemImage="ellipsis.circle">
        <Button
          label="Settings"
          systemImage="gear"
          onPress={() => console.log('Settings')}
        />
        <Button
          label="Profile"
          systemImage="person"
          onPress={() => console.log('Profile')}
        />
        <Divider />
        <Button
          label="Delete"
          role="destructive"
          systemImage="trash"
          onPress={() => console.log('Delete')}
        />
      </Menu>
    </Host>
  );
}
```

### 自定义标签

可以把 React 节点作为标签传入，以实现自定义样式。

![强调色的菜单触发器，标签为 Custom Label](/static/images/expo-ui/examples/menu-custom-label-ios-light.webp)

```tsx CustomLabelMenuExample.tsx
import { Host, Menu, Button, Text } from '@expo/ui/swift-ui';
import { foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function CustomLabelMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label={
          <Text modifiers={[foregroundStyle('accentColor')]}>
            Custom Label
          </Text>
        }>
        <Button
          label="Action 1"
          onPress={() => console.log('Action 1')}
        />
        <Button
          label="Action 2"
          onPress={() => console.log('Action 2')}
        />
      </Menu>
    </Host>
  );
}
```

### 用 React Native 组件作标签

把 React Native 视图（例如 `Pressable`）包在 [`RNHostView`](/versions/latest/sdk/ui/swift-ui/rnhostview) 里，就可以当作菜单标签。

![用作菜单触发器的紫色 React Native Pressable](/static/images/expo-ui/examples/menu-rn-label-ios-light.webp)

```tsx RNLabelMenuExample.tsx
import { Host, Menu, Button, RNHostView } from '@expo/ui/swift-ui';
import { Pressable, Text } from 'react-native';

export default function RNLabelMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label={
          <RNHostView matchContents>
            <Pressable
              onPress={() => console.log('RN trigger pressed')}
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
        }>
        <Button
          label="Item 1"
          onPress={() => console.log('Item 1')}
        />
        <Button
          label="Item 2"
          onPress={() => console.log('Item 2')}
        />
      </Menu>
    </Host>
  );
}
```

### 嵌套菜单

菜单可以嵌套以创建子菜单。

![打开的菜单，含 Item 1、带箭头的 Submenu 行和 Item 2](/static/images/expo-ui/examples/menu-nested-ios-light.webp)

```tsx NestedMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';

export default function NestedMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="Main Menu">
        <Button
          label="Item 1"
          onPress={() => console.log('Item 1')}
        />
        <Menu label="Submenu">
          <Button
            label="Sub Item 1"
            onPress={() => console.log('Sub Item 1')}
          />
          <Button
            label="Sub Item 2"
            onPress={() => console.log('Sub Item 2')}
          />
        </Menu>
        <Button
          label="Item 2"
          onPress={() => console.log('Item 2')}
        />
      </Menu>
    </Host>
  );
}
```

### 带主要操作

提供 `onPrimaryAction` 时，单击触发主要操作，长按则显示菜单。

![带播放图标、标签为 Tap or hold 的菜单触发器](/static/images/expo-ui/examples/menu-primary-action-ios-light.webp)

```tsx PrimaryActionMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';

export default function PrimaryActionMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="Tap or hold"
        systemImage="play.circle"
        onPrimaryAction={() =>
          console.log('Primary action triggered!')
        }>
        <Button
          label="Menu Item 1"
          onPress={() => console.log('Menu Item 1')}
        />
        <Button
          label="Menu Item 2"
          onPress={() => console.log('Menu Item 2')}
        />
        <Button
          label="Menu Item 3"
          onPress={() => console.log('Menu Item 3')}
        />
      </Menu>
    </Host>
  );
}
```

### 用修饰符设置样式

可以用 `buttonStyle` 修饰符改变菜单触发器的外观。

![渲染为填充蓝色按钮的菜单触发器](/static/images/expo-ui/examples/menu-styled-ios-light.webp)

```tsx StyledMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function StyledMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="Styled Menu"
        modifiers={[buttonStyle('borderedProminent')]}>
        <Button
          label="Styled Action 1"
          onPress={() => console.log('Styled 1')}
        />
        <Button
          label="Styled Action 2"
          onPress={() => console.log('Styled 2')}
        />
      </Menu>
    </Host>
  );
}
```

### Mac Catalyst 上的朴素触发器

在使用 Mac 习惯用法（Xcode 的 **Optimize Interface for Mac**）的 Mac Catalyst 构建中，SwiftUI 会把 `Menu` 渲染成 AppKit 下拉按钮：带边框的外观和展开箭头会取代自定义 `label`，下拉按钮自身的尺寸也会加宽触发器。组合 `menuStyle('button')`、`buttonStyle('plain')` 和 `menuIndicator('hidden')`，可以让标签成为整个触发器。

```tsx PlainTriggerMenuExample.tsx
import { Host, Menu, Button, Text } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  menuIndicator,
  menuStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function PlainTriggerMenuExample() {
  return (
    <Host matchContents>
      <Menu
        label={<Text>Custom Label</Text>}
        modifiers={[
          menuStyle('button'),
          buttonStyle('plain'),
          menuIndicator('hidden'),
        ]}>
        <Button
          label="Action 1"
          onPress={() => console.log('Action 1')}
        />
        <Button
          label="Action 2"
          onPress={() => console.log('Action 2')}
        />
      </Menu>
    </Host>
  );
}
```

### 玻璃菜单

要做出 iOS Liquid Glass 外观的菜单，在 Menu 组件上使用 `buttonStyle('glass')` 或 `buttonStyle('glassProminent')`。

:::warning
不要对 Menu 的标签视图使用 `glassEffect()` 修饰符来实现玻璃外观。这会造成视觉瑕疵：菜单关闭时，触发器后方会短暂出现矩形光晕。请始终改用 `buttonStyle`，它能正确配合菜单的关闭动画。
:::

![渲染为带省略号图标的玻璃胶囊的菜单触发器](/static/images/expo-ui/examples/menu-glass-ios-light.webp)

```tsx GlassMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function GlassMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="Glass Menu"
        systemImage="ellipsis.circle"
        modifiers={[buttonStyle('glass')]}>
        <Button
          label="Action 1"
          onPress={() => console.log('Action 1')}
        />
        <Button
          label="Action 2"
          onPress={() => console.log('Action 2')}
        />
      </Menu>
    </Host>
  );
}
```

更突出的玻璃效果请使用 `glassProminent`：

![渲染为带滑块图标的醒目蓝色玻璃胶囊的菜单触发器](/static/images/expo-ui/examples/menu-glass-prominent-ios-light.webp)

```tsx GlassProminentMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function GlassProminentMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="Glass Prominent Menu"
        systemImage="slider.horizontal.3"
        modifiers={[buttonStyle('glassProminent')]}>
        <Button
          label="Settings"
          systemImage="gear"
          onPress={() => console.log('Settings')}
        />
        <Button
          label="Filter"
          systemImage="line.3.horizontal.decrease"
          onPress={() => console.log('Filter')}
        />
      </Menu>
    </Host>
  );
}
```

### 带控件组

在菜单中使用 [`ControlGroup`](/versions/latest/sdk/ui/swift-ui/controlgroup)，渲染一行横向图标按钮，类似 Apple Music 或 Safari 菜单中的快捷操作行。

![打开的菜单，Add、Favorite 和 Share 行位于两段列表项上方](/static/images/expo-ui/examples/menu-control-group-ios-light.webp)

```tsx MenuWithControlGroupExample.tsx
import {
  Host,
  Menu,
  ControlGroup,
  Button,
  Section,
  Divider,
} from '@expo/ui/swift-ui';

export default function MenuWithControlGroupExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="Song Options" systemImage="ellipsis.circle">
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
        <Section>
          <Button
            systemImage="text.badge.plus"
            label="Add to a playlist"
            onPress={() => console.log('Add to playlist')}
          />
          <Button
            systemImage="antenna.radiowaves.left.and.right"
            label="Create station"
            onPress={() => console.log('Create station')}
          />
        </Section>
        <Divider />
        <Button
          systemImage="hand.thumbsdown"
          label="Suggest less"
          onPress={() => console.log('Suggest less')}
        />
      </Menu>
    </Host>
  );
}
```

### 禁用项

在菜单 `Button` 上使用 [`disabled(true)`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，把它渲染成灰色且不可交互。按钮仍会出现在菜单中，但不会触发 `onPress`。

![打开的菜单，含 Available 行和灰色的 Locked 行](/static/images/expo-ui/examples/menu-disabled-item-ios-light.webp)

```tsx DisabledMenuItemExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';
import { disabled } from '@expo/ui/swift-ui/modifiers';

export default function DisabledMenuItemExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu label="Options">
        <Button
          label="Available"
          onPress={() => console.log('Available')}
        />
        <Button
          label="Locked"
          systemImage="lock"
          modifiers={[disabled(true)]}
          onPress={() => console.log('This never fires')}
        />
      </Menu>
    </Host>
  );
}
```

### 可选项（勾选标记）

放在 `Menu` 里的 SwiftUI [`Toggle`](/versions/latest/sdk/ui/swift-ui/toggle) 会自动渲染成一行：在设置了 `systemImage` 时显示其 SF Symbol，且当 `isOn` 为 `true` 时在该符号前显示勾选标记。请使用这一模式，不要自行发明自定义勾选项。

![打开的菜单，Show completed 带勾选标记，Show archived 没有](/static/images/expo-ui/examples/menu-checkmarks-ios-light.webp)

```tsx CheckmarkMenuItemExample.tsx
import { Host, Menu, Button, Toggle } from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function CheckmarkMenuItemExample() {
  const [showCompleted, setShowCompleted] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="Filter"
        systemImage="line.3.horizontal.decrease.circle">
        <Toggle
          isOn={showCompleted}
          label="Show completed"
          systemImage="checkmark.circle"
          onIsOnChange={setShowCompleted}
        />
        <Toggle
          isOn={showArchived}
          label="Show archived"
          systemImage="archivebox"
          onIsOnChange={setShowArchived}
        />
        <Button
          label="Clear filters"
          onPress={() => console.log('Clear')}
        />
      </Menu>
    </Host>
  );
}
```

### 仅图标的菜单按钮

使用 `labelStyle('iconOnly')` 修饰符只显示图标、不显示标签文字。为无障碍起见，仍应提供 `label` 属性。

![只显示圆圈省略号图标的菜单触发器](/static/images/expo-ui/examples/menu-icon-only-ios-light.webp)

```tsx IconOnlyMenuExample.tsx
import { Host, Menu, Button } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';

export default function IconOnlyMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Menu
        label="More options"
        systemImage="ellipsis.circle"
        modifiers={[labelStyle('iconOnly')]}>
        <Button
          label="Menu Item 1"
          onPress={() => console.log('Menu Item 1')}
        />
        <Button
          label="Menu Item 2"
          onPress={() => console.log('Menu Item 2')}
        />
        <Button
          label="Menu Item 3"
          onPress={() => console.log('Menu Item 3')}
        />
      </Menu>
    </Host>
  );
}
```

## API

```tsx
import { Menu } from '@expo/ui/swift-ui';
```
