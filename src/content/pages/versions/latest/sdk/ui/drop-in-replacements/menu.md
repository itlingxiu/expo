---
title: Menu 包参考
description: 与 @react-native-menu/menu 兼容的菜单。
---

# Menu 包参考

> 支持平台：Android、iOS、Expo Go。

与 [`@react-native-menu/menu`](https://www.npmjs.com/package/@react-native-menu/menu) API 兼容的 `MenuView` 组件。支持单击（默认）和长按（`shouldOpenOnLongPress`）两种触发方式。

在底层，这个组件封装了平台专用的 `@expo/ui` 原语：

- **Android**：锚定到内部 `Pressable` 触发器的 [Jetpack Compose DropdownMenu](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu)。
- **iOS**：单击触发使用 [SwiftUI Menu](/versions/latest/sdk/ui/swift-ui/menu)，长按触发使用 [SwiftUI ContextMenu](/versions/latest/sdk/ui/swift-ui/contextmenu)。

如果需要更底层的控制，请直接使用这些原语。

![打开的菜单，包含编辑行和删除行（Android）](/static/images/expo-ui/community-menu/android-light.webp)

![打开的菜单，包含编辑行和红色删除行（iOS）](/static/images/expo-ui/community-menu/ios-light.webp)

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

## 从 `@react-native-menu/menu` 迁移

- 把导入从 `import { MenuView } from '@react-native-menu/menu'` 改为 `import { MenuView } from '@expo/ui/community/menu'`。
- Android 上的 `action.image` 与上游不同。`@react-native-menu/menu` 期望的是**drawable 资源名**字符串（例如 `'ic_menu_add'`），并在 `android/app/src/main/res/drawable/` 中解析。这个直接替代组件**不会**解析 drawable 资源名——请改为传入 `ImageSourcePropType`（例如 `require('@expo/material-symbols/edit.xml')`）。字符串值在 iOS 上会被当作 SF Symbol 名称。使用 [`Icon.select`](/versions/latest/sdk/ui/universal/icon) 在每个调用处同时定义两侧，这样未使用的一侧会按平台被 tree-shake 掉。
- `title` 只在 iOS 上渲染为分区标题；Android 的 Material `DropdownMenu` 没有标题槽位。
- 在 Android 上，`MenuView` 用自己的 `Pressable` 包裹触发器来打开菜单，因此你作为 `children` 传入的 `Pressable` 上的 `onPress`/`onLongPress` 处理函数不会触发——外层包装会抢走手势。请把该处理函数移到 `onPressAction` 的分支中，或者如果你需要在触发器上保留独立的点击和长按操作，请使用更底层的 [`DropdownMenu`](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu) 原语。
- 命令式 `ref.show()` API **仅 Android**。SwiftUI 的 `Menu`/`ContextMenu` 没有编程方式打开的 API，因此在 iOS 上该调用是空操作（并会有一次开发警告）。
- 不支持 `@react-native-menu/menu` 的以下属性：`themeVariant`、`hitSlop`、`isAnchoredToRight`、`subtitle`、`keepsMenuPresented`、`preferredElementSize` 和 `state: 'mixed'`。

## 基本用法

把任意视图作为触发器传入。`MenuView` 会自行附加点击或长按处理。

![打开的菜单，包含编辑行和删除行（Android）](/static/images/expo-ui/examples/community-menu-basic-android-light.webp)

![打开的菜单，包含编辑行和红色删除行（iOS）](/static/images/expo-ui/examples/community-menu-basic-ios-light.webp)

```tsx
import { Icon } from '@expo/ui';
import { MenuView } from '@expo/ui/community/menu';
import { Text, useColorScheme, View } from 'react-native';

const editIcon = Icon.select({
  ios: 'pencil',
  android: import('@expo/material-symbols/edit.xml'),
});

const deleteIcon = Icon.select({
  ios: 'trash',
  android: import('@expo/material-symbols/delete.xml'),
});

export default function MenuExample() {
  const colorScheme = useColorScheme();
  return (
    <MenuView
      actions={[
        { id: 'edit', title: 'Edit', image: editIcon },
        { id: 'delete', title: 'Delete', image: deleteIcon, attributes: { destructive: true } },
      ]}
      onPressAction={e => console.log(e.nativeEvent.event)}>
      <View>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Open menu</Text>
      </View>
    </MenuView>
  );
}
```

## 长按（上下文菜单）

设置 `shouldOpenOnLongPress` 即可渲染为上下文菜单。在 Android 上，同一个受控的 `DropdownMenu` 会由触发器上的长按而不是点击打开。在 iOS 上，这会使用 SwiftUI 的 `ContextMenu`，并把触发器显示为模糊预览。

![打开的菜单，包含复制和分享行（Android）](/static/images/expo-ui/examples/community-menu-long-press-android-light.webp)

![打开的上下文菜单，包含复制和分享行（iOS）](/static/images/expo-ui/examples/community-menu-long-press-ios-light.webp)

```tsx
import { Icon } from '@expo/ui';
import { MenuView } from '@expo/ui/community/menu';
import { Text, useColorScheme, View } from 'react-native';

const copyIcon = Icon.select({
  ios: 'doc.on.doc',
  android: import('@expo/material-symbols/content_copy.xml'),
});

const shareIcon = Icon.select({
  ios: 'square.and.arrow.up',
  android: import('@expo/material-symbols/share.xml'),
});

export default function LongPressMenuExample() {
  const colorScheme = useColorScheme();
  return (
    <MenuView
      shouldOpenOnLongPress
      actions={[
        { id: 'copy', title: 'Copy', image: copyIcon },
        { id: 'share', title: 'Share', image: shareIcon },
      ]}
      onPressAction={e => console.log(e.nativeEvent.event)}>
      <View style={{ padding: 8 }}>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Long-press me</Text>
      </View>
    </MenuView>
  );
}
```

## 子菜单与内联分区

`subactions` 默认把嵌套操作渲染为子菜单。在父项上设置 `displayInline: true`，可以把子项改为内联分区渲染，适合用来分组。在 Android 上只会出现分隔线（Material 的 `DropdownMenu` 没有分区原语）。在 iOS 上，父项的 `title` 会成为分区标题。

![打开的菜单，展开了「排序方式」子菜单（Android）](/static/images/expo-ui/examples/community-menu-submenu-android-light.webp)

![打开的菜单，展开了「排序方式」子菜单（iOS）](/static/images/expo-ui/examples/community-menu-submenu-ios-light.webp)

```tsx
import { MenuView } from '@expo/ui/community/menu';
import { Text, useColorScheme, View } from 'react-native';

export default function SubmenuExample() {
  const colorScheme = useColorScheme();
  return (
    <MenuView
      actions={[
        { id: 'rename', title: 'Rename' },
        {
          id: 'sort',
          title: 'Sort by',
          subactions: [
            { id: 'sort-name', title: 'Name' },
            { id: 'sort-date', title: 'Date' },
            { id: 'sort-size', title: 'Size' },
          ],
        },
        {
          id: 'share-section',
          title: 'Share',
          displayInline: true,
          subactions: [
            { id: 'share-airdrop', title: 'AirDrop' },
            { id: 'share-message', title: 'Message' },
          ],
        },
      ]}
      onPressAction={e => console.log(e.nativeEvent.event)}>
      <View>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Open menu</Text>
      </View>
    </MenuView>
  );
}
```

## 带勾选标记的开关项

把 `state` 设为 `'on'` 或 `'off'`，可以把操作渲染为可切换项，开启时前面会有勾选标记。选择该操作会触发 `onPressAction`，由调用方负责更新状态。

![打开的菜单，「置顶」旁边有勾选标记（Android）](/static/images/expo-ui/examples/community-menu-toggle-android-light.webp)

![打开的菜单，「置顶」旁边有勾选标记（iOS）](/static/images/expo-ui/examples/community-menu-toggle-ios-light.webp)

```tsx
import { MenuView } from '@expo/ui/community/menu';
import { useState } from 'react';
import { Text, useColorScheme, View } from 'react-native';

export default function ToggleMenuExample() {
  const colorScheme = useColorScheme();
  const [pinned, setPinned] = useState(false);
  return (
    <MenuView
      actions={[{ id: 'pin', title: 'Pin to top', state: pinned ? 'on' : 'off' }]}
      onPressAction={e => {
        if (e.nativeEvent.event === 'pin') setPinned(p => !p);
      }}>
      <View>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          {pinned ? 'Pinned' : 'Not pinned'}
        </Text>
      </View>
    </MenuView>
  );
}
```

## API

```tsx
import { MenuView } from '@expo/ui/community/menu';
```
