---
title: HorizontalFloatingToolbar 组件参考
description: 用于显示悬浮操作栏的 Jetpack Compose HorizontalFloatingToolbar 组件。
---

# HorizontalFloatingToolbar 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 HorizontalFloatingToolbar 封装了官方 Jetpack Compose 的 [`HorizontalFloatingToolbar`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-horizontal-floating-toolbar.html)，显示浮在内容上方、包含操作按钮的水平工具栏。

:::note
如果只需要一个悬浮按钮，请改用 [`FloatingActionButton`](/versions/latest/sdk/ui/jetpack-compose/floatingactionbutton)。
:::

![胶囊形悬浮工具栏，含三个图标按钮和一个独立的主 FAB](/static/images/expo-ui/horizontalfloatingtoolbar/android-light.webp)

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

### 可滚动内容上方的悬浮工具栏

把工具栏放在带 `floatingToolbarExitAlwaysScrollBehavior` 的 `Box` 中，即可获得随滚动隐藏/显示的行为。用 `align('bottomCenter')` 把工具栏放在屏幕底部。整个布局都留在 Compose 层内，不需要 React Native 的绝对定位。

![悬浮工具栏带编辑按钮和添加按钮，居中叠在可滚动列表上](/static/images/expo-ui/examples/toolbar-floating-android-light.webp)

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

### 带 FloatingActionButton 的工具栏

把 `IconButton` 作为直接子元素用作工具栏项，用 `HorizontalFloatingToolbar.FloatingActionButton` 作为主要操作。

![胶囊形工具栏包含编辑和分享按钮，旁边是独立的添加按钮](/static/images/expo-ui/examples/toolbar-with-fab-android-light.webp)

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
