---
title: Snackbar 组件参考
description: 显示在屏幕底部、在不打断用户的情况下提供反馈的简短通知。
---

# Snackbar 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供两个组件，对应 Jetpack Compose 的 [Snackbar](https://developer.android.com/develop/ui/compose/components/snackbar) API：

- [`SnackbarHost`](#snackbarhost) 对应 Compose 的 [SnackbarHost](https://developer.android.com/reference/kotlin/androidx/compose/material3/SnackbarHost.composable) 和 [SnackbarHostState](https://developer.android.com/reference/kotlin/androidx/compose/material3/SnackbarHostState)。在布局中放置一次，然后在 `ref` 上调用 `showSnackbar`。Snackbar 会按 `duration` 自动消失，也可以通过操作按钮或可选的关闭图标关闭。
- [`Snackbar`](#snackbar) 是 [`SnackbarHost`](#snackbarhost) 仅用于样式的子组件。传入一个即可覆盖颜色，或把操作放到新的一行。

![Material 3 snackbar，消息为 Item archived，带 Undo 操作](/static/images/expo-ui/snackbar/android-light.webp)

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

### 显示 snackbar

在布局中放置一次 [`SnackbarHost`](#snackbarhost)，并在其 ref 上调用 `showSnackbar` 来显示消息。返回的 Promise 会在 snackbar 消失后以 `'actionPerformed'` 或 `'dismissed'` 兑现。

![屏幕底部的 Material 3 snackbar，内容为 Item archived，带 Undo 操作](/static/images/expo-ui/examples/snackbar-basic-android-light.webp)

```tsx SnackbarExample.tsx
import { useRef } from 'react';
import {
  Box,
  Button,
  Column,
  Host,
  SnackbarHost,
  Text,
  type SnackbarHostRef,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  fillMaxWidth,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function SnackbarExample() {
  const hostRef = useRef<SnackbarHostRef>(null);

  const onArchive = async () => {
    const result = await hostRef.current?.showSnackbar({
      message: 'Item archived',
      actionLabel: 'Undo',
      duration: 'short',
    });
    if (result === 'actionPerformed') {
      // 用户点了撤销，恢复该项。
    }
  };

  return (
    <Host style={{ flex: 1 }}>
      <Box modifiers={[fillMaxSize()]}>
        <Column modifiers={[padding(16, 16, 16, 16)]}>
          <Button onClick={onArchive}>
            <Text>Archive</Text>
          </Button>
        </Column>

        <Box modifiers={[align('bottomCenter'), fillMaxWidth()]}>
          <SnackbarHost ref={hostRef} />
        </Box>
      </Box>
    </Host>
  );
}
```

### 自定义样式

向 [`SnackbarHost`](#snackbarhost) 传入 [`Snackbar`](#snackbar) 子组件，以覆盖颜色或把操作放到新的一行。[`Snackbar`](#snackbar) 本身不接收内容，消息和操作来自每次 `showSnackbar` 调用。

![深海军蓝容器的 snackbar，浅薰衣草色消息为 Saved，带 Undo 操作和关闭图标](/static/images/expo-ui/examples/snackbar-styled-android-light.webp)

```tsx StyledSnackbar.tsx
import { useRef } from 'react';
import {
  Box,
  Button,
  Column,
  Host,
  Snackbar,
  SnackbarHost,
  Text,
  type SnackbarHostRef,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  fillMaxWidth,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function StyledSnackbar() {
  const hostRef = useRef<SnackbarHostRef>(null);

  const onSave = () => {
    hostRef.current?.showSnackbar({
      message: 'Saved',
      actionLabel: 'Undo',
      withDismissAction: true,
    });
  };

  return (
    <Host style={{ flex: 1 }}>
      <Box modifiers={[fillMaxSize()]}>
        <Column modifiers={[padding(16, 16, 16, 16)]}>
          <Button onClick={onSave}>
            <Text>Save</Text>
          </Button>
        </Column>

        <Box modifiers={[align('bottomCenter'), fillMaxWidth()]}>
          <SnackbarHost ref={hostRef}>
            <Snackbar
              containerColor="#1E1E2E"
              contentColor="#CDD6F4"
              actionContentColor="#F38BA8"
              dismissActionContentColor="#CDD6F4"
            />
          </SnackbarHost>
        </Box>
      </Box>
    </Host>
  );
}
```

## API

```tsx
import { Snackbar, SnackbarHost } from '@expo/ui/jetpack-compose';
```
