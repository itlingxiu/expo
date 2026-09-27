---
title: Tooltip 组件参考
description: Jetpack Compose Tooltip components for displaying contextual information on long-press.
---

# Tooltip 组件参考

> 支持平台：Android、Expo Go。

Expo UI Tooltip matches the official Jetpack Compose [Tooltip](https://developer.android.com/develop/ui/compose/components/tooltip) API. `TooltipBox` wraps anchor content and displays a tooltip. The tooltip content is provided via the `TooltipBox.PlainTooltip` or `TooltipBox.RichTooltip` compound components, which match [`PlainTooltip`](https://developer.android.com/develop/ui/compose/components/tooltip#display-plain) and [`RichTooltip`](https://developer.android.com/develop/ui/compose/components/tooltip#display-rich) respectively. Tooltips can be triggered by long-press or shown programmatically via `ref`.

![Material 3 rich tooltip with title, body, learn more action, and anchor button](/static/images/expo-ui/tooltip/android-light.webp)

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

### Plain tooltip

Long-press the anchor content to display the tooltip.

![A plain tooltip reading Add to favorites above a Favorite button](/static/images/expo-ui/examples/tooltip-plain-android-light.webp)

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

### Rich tooltip with title and body

Use `TooltipBox.RichTooltip` with `Title` and `Text` compound component pattern for more detailed contextual information.

![A rich tooltip with a Camera title and body text above an Open Camera button](/static/images/expo-ui/examples/tooltip-rich-android-light.webp)

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

### Rich tooltip with action

Add an interactive action with `TooltipBox.RichTooltip.Action`. Use `isPersistent` so the tooltip stays visible for the user to tap it. `hasAction` is automatically derived when an action slot is present.

![A persistent rich tooltip with a title, body text, and a Learn more action above a Record video button](/static/images/expo-ui/examples/tooltip-rich-action-android-light.webp)

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

### Programmatic show and dismiss

Use a `ref` to imperatively `show()` or `dismiss()` the tooltip without requiring a long-press.

![A tooltip reading Shown programmatically above an Anchor button, with Show and Dismiss buttons below](/static/images/expo-ui/examples/tooltip-programmatic-android-light.webp)

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
