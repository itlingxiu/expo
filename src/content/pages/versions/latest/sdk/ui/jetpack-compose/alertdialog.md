---
title: AlertDialog 组件参考
description: 用于显示原生警报对话框的 Jetpack Compose AlertDialog 组件。
---

# AlertDialog 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 AlertDialog 与官方 Jetpack Compose [AlertDialog](https://developer.android.com/develop/ui/compose/components/dialog) API 保持一致。内容通过插槽子组件（`AlertDialog.Title`、`AlertDialog.Text`、`AlertDialog.ConfirmButton`、`AlertDialog.DismissButton`、`AlertDialog.Icon`）提供，它们直接映射到 Compose 的插槽参数。

![Material 3 警报对话框，包含标题、辅助文本以及取消/放弃按钮](/static/images/expo-ui/alertdialog/android-light.webp)

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

### 基本警报对话框

![标题为 Confirm action 的 Material 3 警报对话框，包含辅助文本以及取消和确认按钮](/static/images/expo-ui/examples/alertdialog-basic-android-light.webp)

```tsx BasicAlertDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  AlertDialog,
  Button,
  TextButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function BasicAlertDialogExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Show alert</Text>
      </Button>
      {visible && (
        <AlertDialog onDismissRequest={() => setVisible(false)}>
          <AlertDialog.Title>
            <Text>Confirm action</Text>
          </AlertDialog.Title>
          <AlertDialog.Text>
            <Text>Are you sure you want to proceed?</Text>
          </AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <TextButton onClick={() => setVisible(false)}>
              <Text>Confirm</Text>
            </TextButton>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <TextButton onClick={() => setVisible(false)}>
              <Text>Cancel</Text>
            </TextButton>
          </AlertDialog.DismissButton>
        </AlertDialog>
      )}
    </Host>
  );
}
```

### 自定义颜色

![一个警报对话框，深藏青色容器配浅色文本，覆盖了主题颜色](/static/images/expo-ui/examples/alertdialog-custom-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import {
  Host,
  AlertDialog,
  Button,
  TextButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Show alert</Text>
      </Button>
      {visible && (
        <AlertDialog
          onDismissRequest={() => setVisible(false)}
          colors={{
            containerColor: '#1E1E2E',
            titleContentColor: '#CDD6F4',
            textContentColor: '#BAC2DE',
          }}>
          <AlertDialog.Title>
            <Text>Custom Dialog</Text>
          </AlertDialog.Title>
          <AlertDialog.Text>
            <Text>This dialog uses custom colors.</Text>
          </AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <TextButton onClick={() => setVisible(false)}>
              <Text>OK</Text>
            </TextButton>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <TextButton onClick={() => setVisible(false)}>
              <Text>Cancel</Text>
            </TextButton>
          </AlertDialog.DismissButton>
        </AlertDialog>
      )}
    </Host>
  );
}
```

### 带图标

![一个警报对话框，信息图标居中位于标题 Dialog with Icon 上方](/static/images/expo-ui/examples/alertdialog-icon-android-light.webp)

```tsx IconDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  AlertDialog,
  Button,
  TextButton,
  Text,
  Icon,
} from '@expo/ui/jetpack-compose';

export default function IconDialogExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Show alert</Text>
      </Button>
      {visible && (
        <AlertDialog onDismissRequest={() => setVisible(false)}>
          <AlertDialog.Icon>
            {/* 替换为你自己的图标资源 */}
            <Icon source={require('./info-icon.xml')} />
          </AlertDialog.Icon>
          <AlertDialog.Title>
            <Text>Dialog with Icon</Text>
          </AlertDialog.Title>
          <AlertDialog.Text>
            <Text>This dialog has an icon above the title.</Text>
          </AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <TextButton onClick={() => setVisible(false)}>
              <Text>OK</Text>
            </TextButton>
          </AlertDialog.ConfirmButton>
        </AlertDialog>
      )}
    </Host>
  );
}
```

## API

```tsx
import { AlertDialog } from '@expo/ui/jetpack-compose';
```
