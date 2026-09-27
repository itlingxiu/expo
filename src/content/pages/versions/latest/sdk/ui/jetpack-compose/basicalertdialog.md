---
title: BasicAlertDialog 组件参考
description: 用于显示包含自定义内容对话框的 Jetpack Compose BasicAlertDialog 组件。
---

# BasicAlertDialog 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 BasicAlertDialog 与官方 Jetpack Compose [BasicAlertDialog](https://developer.android.com/develop/ui/compose/components/dialog) API 保持一致，它显示一个接受自定义子元素作为内容的最小化对话框，让你可以完全控制对话框的布局。

![带自定义内容的 Material 3 基础警报对话框](/static/images/expo-ui/basicalertdialog/android-light.webp)

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

### 带自定义内容的基础对话框

![一个包含自定义内容的对话框：辅助文本，末尾边缘有一个 Confirm 按钮](/static/images/expo-ui/examples/basicalertdialog-custom-content-android-light.webp)

```tsx BasicAlertDialogExample.tsx
import { useState } from 'react';
import {
  Host,
  BasicAlertDialog,
  Button,
  TextButton,
  Text,
  Surface,
  Column,
  Spacer,
} from '@expo/ui/jetpack-compose';
import {
  padding,
  wrapContentWidth,
  wrapContentHeight,
  clip,
  height,
  align,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

export default function BasicAlertDialogExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open dialog</Text>
      </Button>
      {visible && (
        <BasicAlertDialog
          onDismissRequest={() => setVisible(false)}>
          <Surface
            tonalElevation={6}
            modifiers={[
              wrapContentWidth(),
              wrapContentHeight(),
              clip(Shapes.RoundedCorner(28)),
            ]}>
            <Column modifiers={[padding(16, 16, 16, 16)]}>
              <Text>
                This area typically contains the supportive text
                which presents the details regarding the Dialog's
                purpose.
              </Text>
              <Spacer modifiers={[height(24)]} />
              <TextButton
                onClick={() => setVisible(false)}
                modifiers={[align('end')]}>
                <Text>Confirm</Text>
              </TextButton>
            </Column>
          </Surface>
        </BasicAlertDialog>
      )}
    </Host>
  );
}
```

## API

```tsx
import { BasicAlertDialog } from '@expo/ui/jetpack-compose';
```
