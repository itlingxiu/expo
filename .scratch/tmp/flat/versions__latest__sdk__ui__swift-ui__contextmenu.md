---
title: ContextMenu 组件参考
description: A SwiftUI ContextMenu component for displaying context menus.
---

# ContextMenu 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI ContextMenu matches the official SwiftUI [contextMenu API](<https://developer.apple.com/documentation/swiftui/view/contextmenu(menuitems:)>) and displays a menu when long-pressed. For single-tap menu interactions, use [`Menu`](menu) instead.

![A long-pressed tile shown as an enlarged preview with a Share, Favorite, Delete menu beneath it](/static/images/expo-ui/contextmenu/ios-light.webp)

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

### Basic context menu

![A context menu open under the lifted trigger, listing Edit and a red Delete](/static/images/expo-ui/examples/contextmenu-basic-ios-light.webp)

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

### Context menu with system images

![A context menu listing Share, Favorite, and a red Delete, each with an SF Symbol](/static/images/expo-ui/examples/contextmenu-with-images-ios-light.webp)

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

### Context menu with preview

Use `ContextMenu.Preview` to show a custom preview above the menu when opened.

![A context menu with a Preview content card above the Edit and Delete items](/static/images/expo-ui/examples/contextmenu-with-preview-ios-light.webp)

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

### Context menu with picker

![A context menu listing Action and a Size row with a submenu chevron](/static/images/expo-ui/examples/contextmenu-with-picker-ios-light.webp)

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

### Context menu with sections

Use `Section` and `Divider` components to organize menu items.

![A context menu with an Actions section holding Edit and Duplicate, a divider, and Delete](/static/images/expo-ui/examples/contextmenu-with-sections-ios-light.webp)

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

### Disabled items

Use the [`disabled(true)`](modifiers#disableddisabled) modifier on a menu `Button` to render it greyed-out and non-interactive.

![A context menu listing Edit and a greyed out Locked item with a lock icon](/static/images/expo-ui/examples/contextmenu-disabled-item-ios-light.webp)

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

### Selectable items (checkmarks)

A SwiftUI [`Toggle`](toggle) inside `ContextMenu.Items` automatically renders as a row with a leading SF Symbol and a trailing checkmark when `isOn` is `true`.

![A context menu row labelled Pin with a pin icon and a leading checkmark](/static/images/expo-ui/examples/contextmenu-checkmark-item-ios-light.webp)

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

### Nested context menus

Use nested `ContextMenu` components to create submenus.

![A context menu listing Action and More Options](/static/images/expo-ui/examples/contextmenu-nested-ios-light.webp)

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
