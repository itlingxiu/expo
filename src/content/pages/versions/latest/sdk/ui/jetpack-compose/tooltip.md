---
title: Tooltip 组件参考
description: 用于在长按时显示上下文信息的 Jetpack Compose Tooltip 组件。
---

# Tooltip 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Tooltip 与官方 Jetpack Compose [Tooltip](https://developer.android.com/develop/ui/compose/components/tooltip) API 保持一致。`TooltipBox` 包裹锚点内容并显示工具提示。工具提示内容通过 `TooltipBox.PlainTooltip` 或 `TooltipBox.RichTooltip` 复合组件提供，分别对应 [`PlainTooltip`](https://developer.android.com/develop/ui/compose/components/tooltip#display-plain) 和 [`RichTooltip`](https://developer.android.com/develop/ui/compose/components/tooltip#display-rich)。工具提示可由长按触发，也可通过 `ref` 以编程方式显示。

![Material 3 富工具提示，含标题、正文、了解更多操作和锚点按钮](/static/images/expo-ui/tooltip/android-light.webp)

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

### 普通工具提示

长按锚点内容即可显示工具提示。

![普通工具提示写着 Add to favorites，位于 Favorite 按钮上方](/static/images/expo-ui/examples/tooltip-plain-android-light.webp)

```tsx PlainTooltipExample.tsx
import {
  Host,
  TooltipBox,
  Button,
  Text,
} from '@expo/ui/jetpack-compose';

export default function PlainTooltipExample() {
  return (
    <Host matchContents>
      <TooltipBox>
        <TooltipBox.PlainTooltip>
          <Text>Add to favorites</Text>
        </TooltipBox.PlainTooltip>
        <Button onClick={() => {}}>
          <Text>Favorite</Text>
        </Button>
      </TooltipBox>
    </Host>
  );
}
```

### 带标题和正文的富工具提示

使用 `TooltipBox.RichTooltip`，并采用 `Title` 与 `Text` 复合组件模式，以提供更详细的上下文信息。

![富工具提示，标题为 Camera，正文位于 Open Camera 按钮上方](/static/images/expo-ui/examples/tooltip-rich-android-light.webp)

```tsx RichTooltipExample.tsx
import {
  Host,
  TooltipBox,
  Button,
  Text,
} from '@expo/ui/jetpack-compose';

export default function RichTooltipExample() {
  return (
    <Host matchContents>
      <TooltipBox>
        <TooltipBox.RichTooltip>
          <TooltipBox.RichTooltip.Title>
            <Text>Camera</Text>
          </TooltipBox.RichTooltip.Title>
          <TooltipBox.RichTooltip.Text>
            <Text>
              Take photos and record videos with your device camera.
            </Text>
          </TooltipBox.RichTooltip.Text>
        </TooltipBox.RichTooltip>
        <Button onClick={() => {}}>
          <Text>Open Camera</Text>
        </Button>
      </TooltipBox>
    </Host>
  );
}
```

### 带操作的富工具提示

用 `TooltipBox.RichTooltip.Action` 添加可交互操作。使用 `isPersistent` 让工具提示保持可见，以便用户点击。存在操作插槽时会自动推导 `hasAction`。

![持久富工具提示，含标题、正文和 Learn more 操作，位于 Record video 按钮上方](/static/images/expo-ui/examples/tooltip-rich-action-android-light.webp)

```tsx RichTooltipActionExample.tsx
import {
  Host,
  TooltipBox,
  Button,
  TextButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function RichTooltipActionExample() {
  return (
    <Host matchContents>
      <TooltipBox isPersistent>
        <TooltipBox.RichTooltip>
          <TooltipBox.RichTooltip.Title>
            <Text>Permissions required</Text>
          </TooltipBox.RichTooltip.Title>
          <TooltipBox.RichTooltip.Text>
            <Text>
              This feature requires camera and microphone access.
            </Text>
          </TooltipBox.RichTooltip.Text>
          <TooltipBox.RichTooltip.Action>
            <TextButton onClick={() => {}}>
              <Text>Learn more</Text>
            </TextButton>
          </TooltipBox.RichTooltip.Action>
        </TooltipBox.RichTooltip>
        <Button onClick={() => {}}>
          <Text>Record video</Text>
        </Button>
      </TooltipBox>
    </Host>
  );
}
```

### 以编程方式显示和关闭

使用 `ref` 以命令方式 `show()` 或 `dismiss()` 工具提示，无需长按。

![工具提示写着 Shown programmatically，位于 Anchor 按钮上方，下方有 Show 和 Dismiss 按钮](/static/images/expo-ui/examples/tooltip-programmatic-android-light.webp)

```tsx ProgrammaticTooltipExample.tsx
import { useRef } from 'react';
import {
  Host,
  TooltipBox,
  type TooltipBoxRef,
  Button,
  Text,
  Column,
  Row,
} from '@expo/ui/jetpack-compose';

export default function ProgrammaticTooltipExample() {
  const tooltipRef = useRef<TooltipBoxRef>(null);

  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 8 }}>
        <TooltipBox ref={tooltipRef} isPersistent>
          <TooltipBox.PlainTooltip>
            <Text>Shown programmatically!</Text>
          </TooltipBox.PlainTooltip>
          <Button onClick={() => {}}>
            <Text>Anchor</Text>
          </Button>
        </TooltipBox>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <Button onClick={() => tooltipRef.current?.show()}>
            <Text>Show</Text>
          </Button>
          <Button onClick={() => tooltipRef.current?.dismiss()}>
            <Text>Dismiss</Text>
          </Button>
        </Row>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { TooltipBox } from '@expo/ui/jetpack-compose';
```
