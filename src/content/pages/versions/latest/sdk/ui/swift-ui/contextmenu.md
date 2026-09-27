---
title: ContextMenu 组件参考
description: 用于显示上下文菜单的 SwiftUI ContextMenu 组件。
---

# ContextMenu 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 ContextMenu 与官方 SwiftUI [contextMenu API](https://developer.apple.com/documentation/swiftui/view/contextmenu(menuitems:)) 保持一致，在长按时显示菜单。单击菜单交互请改用 [`Menu`](/versions/latest/sdk/ui/swift-ui/menu)。

![长按后放大预览的磁贴，下方是 Share、Favorite、Delete 菜单](/static/images/expo-ui/contextmenu/ios-light.webp)

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

### 基本上下文菜单

![上下文菜单在抬起的触发器下方打开，列出 Edit 和红色 Delete](/static/images/expo-ui/examples/contextmenu-basic-ios-light.webp)

```tsx BasicContextMenuExample.tsx
import { Host, ContextMenu, Button, Text } from '@expo/ui/swift-ui';

export default function BasicContextMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Edit"
            onPress={() => console.log('Edit')}
          />
          <Button
            label="Delete"
            role="destructive"
            onPress={() => console.log('Delete')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 带系统图像的上下文菜单

![上下文菜单列出 Share、Favorite 和红色 Delete，每一项都有 SF Symbol](/static/images/expo-ui/examples/contextmenu-with-images-ios-light.webp)

```tsx ContextMenuWithImagesExample.tsx
import { Host, ContextMenu, Button, Text } from '@expo/ui/swift-ui';

export default function ContextMenuWithImagesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Share"
            systemImage="square.and.arrow.up"
            onPress={() => console.log('Share')}
          />
          <Button
            label="Favorite"
            systemImage="heart"
            onPress={() => console.log('Favorite')}
          />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={() => console.log('Delete')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 带预览的上下文菜单

使用 `ContextMenu.Preview` 在菜单打开时于菜单上方显示自定义预览。

![上下文菜单在 Edit 和 Delete 项上方有一张 Preview 内容卡片](/static/images/expo-ui/examples/contextmenu-with-preview-ios-light.webp)

```tsx ContextMenuWithPreviewExample.tsx
import { View, Text as RNText } from 'react-native';
import {
  Host,
  ContextMenu,
  Button,
  RNHostView,
  Text,
} from '@expo/ui/swift-ui';

export default function ContextMenuWithPreviewExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Edit"
            onPress={() => console.log('Edit')}
          />
          <Button
            label="Delete"
            role="destructive"
            onPress={() => console.log('Delete')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Preview>
          <RNHostView matchContents>
            <View
              style={{
                width: 200,
                height: 100,
                backgroundColor: '#f0f0f0',
                padding: 16,
              }}>
              <RNText>Preview content</RNText>
            </View>
          </RNHostView>
        </ContextMenu.Preview>
      </ContextMenu>
    </Host>
  );
}
```

### 带选择器的上下文菜单

![上下文菜单列出 Action，以及带子菜单箭头的 Size 行](/static/images/expo-ui/examples/contextmenu-with-picker-ios-light.webp)

```tsx ContextMenuWithPickerExample.tsx
import { useState } from 'react';
import {
  Host,
  ContextMenu,
  Button,
  Text,
  Picker,
} from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

export default function ContextMenuWithPickerExample() {
  const [selectedIndex, setSelectedIndex] = useState<
    number | undefined
  >(0);

  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Action"
            onPress={() => console.log('Action')}
          />
          <Picker
            label="Size"
            modifiers={[pickerStyle('menu')]}
            selection={selectedIndex}
            onSelectionChange={setSelectedIndex}>
            {['Small', 'Medium', 'Large'].map((option, index) => (
              <Text key={index} modifiers={[tag(index)]}>
                {option}
              </Text>
            ))}
          </Picker>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 带分区的上下文菜单

使用 `Section` 和 `Divider` 组件组织菜单项。

![上下文菜单含 Actions 分区，其中有 Edit 和 Duplicate、一条分隔线以及 Delete](/static/images/expo-ui/examples/contextmenu-with-sections-ios-light.webp)

```tsx ContextMenuWithSectionsExample.tsx
import {
  Host,
  ContextMenu,
  Button,
  Text,
  Section,
  Divider,
} from '@expo/ui/swift-ui';

export default function ContextMenuWithSectionsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Section title="Actions">
            <Button
              label="Edit"
              onPress={() => console.log('Edit')}
            />
            <Button
              label="Duplicate"
              onPress={() => console.log('Duplicate')}
            />
          </Section>
          <Divider />
          <Button
            label="Delete"
            role="destructive"
            onPress={() => console.log('Delete')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 禁用项

在菜单 `Button` 上使用 [`disabled(true)`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，将其渲染为变灰且不可交互。

![上下文菜单列出 Edit，以及带锁图标、变灰的 Locked 项](/static/images/expo-ui/examples/contextmenu-disabled-item-ios-light.webp)

```tsx DisabledContextMenuItemExample.tsx
import { Host, ContextMenu, Button, Text } from '@expo/ui/swift-ui';
import { disabled } from '@expo/ui/swift-ui/modifiers';

export default function DisabledContextMenuItemExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Edit"
            onPress={() => console.log('Edit')}
          />
          <Button
            label="Locked"
            systemImage="lock"
            modifiers={[disabled(true)]}
            onPress={() => console.log('This never fires')}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 可选项（勾选标记）

`ContextMenu.Items` 内的 SwiftUI [`Toggle`](/versions/latest/sdk/ui/swift-ui/toggle) 在 `isOn` 为 `true` 时会自动渲染为带前导 SF Symbol 和尾随勾选标记的行。

![标签为 Pin 的上下文菜单行，带图钉图标和前导勾选标记](/static/images/expo-ui/examples/contextmenu-checkmark-item-ios-light.webp)

```tsx CheckmarkContextMenuItemExample.tsx
import { Host, ContextMenu, Toggle, Text } from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function CheckmarkContextMenuItemExample() {
  const [pinned, setPinned] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Toggle
            isOn={pinned}
            label="Pin"
            systemImage="pin"
            onIsOnChange={setPinned}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

### 嵌套上下文菜单

使用嵌套的 `ContextMenu` 组件创建子菜单。

![上下文菜单列出 Action 和 More Options](/static/images/expo-ui/examples/contextmenu-nested-ios-light.webp)

```tsx NestedContextMenuExample.tsx
import { Host, ContextMenu, Button, Text } from '@expo/ui/swift-ui';

export default function NestedContextMenuExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Action"
            onPress={() => console.log('Action')}
          />
          <ContextMenu>
            <ContextMenu.Items>
              <Button
                label="Sub Action 1"
                onPress={() => console.log('Sub 1')}
              />
              <Button
                label="Sub Action 2"
                onPress={() => console.log('Sub 2')}
              />
            </ContextMenu.Items>
            <ContextMenu.Trigger>
              <Button label="More Options" />
            </ContextMenu.Trigger>
          </ContextMenu>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Text>Long press me</Text>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
```

## API

```tsx
import { ContextMenu } from '@expo/ui/swift-ui';
```
