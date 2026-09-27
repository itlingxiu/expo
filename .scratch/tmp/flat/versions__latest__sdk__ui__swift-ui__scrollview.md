---
title: ScrollView 组件参考
description: A SwiftUI ScrollView component for scrollable content.
---

# ScrollView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

> **info** For cross-platform usage, see the universal [`ScrollView`](/versions/latest/sdk/ui/universal/scrollview) — it renders the appropriate native component per platform.

Expo UI ScrollView matches the official SwiftUI [ScrollView API](https://developer.apple.com/documentation/swiftui/scrollview) and provides a scrollable container for its children.

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

### Basic vertical scroll view

A simple vertically scrollable list of text items.

![A vertical scroll view listing items one to twenty-nine.](/static/images/expo-ui/examples/scrollview-vertical-ios-light.webp)

```tsx ScrollViewVerticalExample.tsx
import { Host, ScrollView, VStack, Text } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewVerticalExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView>
        <VStack spacing={8}>
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i} modifiers={[padding({ horizontal: 16 })]}>
              {`Item ${i + 1}`}
            </Text>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
```

### Horizontal scroll view

Use the `axes` prop to scroll horizontally.

![A horizontal row of rounded squares shading from red through orange to yellow.](/static/images/expo-ui/examples/scrollview-horizontal-ios-light.webp)

```tsx ScrollViewHorizontalExample.tsx
import {
  Host,
  ScrollView,
  HStack,
  RoundedRectangle,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewHorizontalExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView axes="horizontal">
        <HStack spacing={8}>
          {Array.from({ length: 20 }, (_, i) => (
            <RoundedRectangle
              key={i}
              cornerRadius={12}
              modifiers={[
                frame({ width: 100, height: 100 }),
                foregroundStyle(`hsl(${i * 18}, 70%, 50%)`),
              ]}
            />
          ))}
        </HStack>
      </ScrollView>
    </Host>
  );
}
```

### Hidden scroll indicators

Set `showsIndicators` to `false` to hide the scroll bars.

![A vertical list of numbered items with no scroll indicator on the right edge](/static/images/expo-ui/examples/scrollview-hidden-indicators-ios-light.webp)

```tsx ScrollViewHiddenIndicatorsExample.tsx
import { Host, ScrollView, VStack, Text } from '@expo/ui/swift-ui';

export default function ScrollViewHiddenIndicatorsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView showsIndicators={false}>
        <VStack spacing={8}>
          {Array.from({ length: 30 }, (_, i) => (
            <Text key={i}>{`Item ${i + 1}`}</Text>
          ))}
        </VStack>
      </ScrollView>
    </Host>
  );
}
```

### Shared scroll position

> **info** Requires iOS 17 or later. On older versions, the modifier is a no-op.

Track the leading scroll target id from JavaScript and scroll to a target by writing to the state. Mark each scroll target with the `id` modifier, wrap the content container in `scrollTargetLayout`, and apply the `scrollPosition` modifier to the `ScrollView`. The optional `onChange` callback fires on the JS thread when the leading target changes.

The `scrollPosition` modifier also works on other scrollable containers like `LazyVStack` and `LazyHStack`.

> **warning** Writes to `state.value` must run on the UI runtime. Wrap the write in `scheduleOnUI` from `react-native-worklets`, or call them from inside a `'worklet'` function. Writes from the JS runtime trip Main Thread Checker, Xcode's runtime tool that flags UIKit calls made from a background thread.

![A scrollable list of items above a button labelled Scroll to item 10 from worklet.](/static/images/expo-ui/examples/scrollview-shared-position-ios-light.webp)

```tsx ScrollViewSharedPositionExample.tsx
import {
  Button,
  Host,
  ScrollView,
  Text,
  VStack,
  useNativeState,
} from '@expo/ui/swift-ui';
import {
  id,
  padding,
  scrollPosition,
  scrollTargetLayout,
} from '@expo/ui/swift-ui/modifiers';
import { scheduleOnUI } from 'react-native-worklets';

export default function ScrollViewSharedPositionExample() {
  const activeID = useNativeState<string | null>(null);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={12}>
        <ScrollView
          modifiers={[
            scrollPosition(activeID, {
              onChange: newID => {
                console.log('[JS thread] leading target:', newID);
              },
            }),
          ]}>
          <VStack modifiers={[scrollTargetLayout()]}>
            {Array.from({ length: 30 }, (_, i) => (
              <Text
                key={`item-${i}`}
                modifiers={[
                  id(`item-${i}`),
                  padding({ horizontal: 16, vertical: 12 }),
                ]}>
                {`Item ${i}`}
              </Text>
            ))}
          </VStack>
        </ScrollView>
        <Button
          label="Scroll to item 10 from worklet"
          onPress={() => {
            scheduleOnUI(() => {
              'worklet';
              activeID.value = 'item-10';
            });
          }}
        />
      </VStack>
    </Host>
  );
}
```

### Unclipped scroll content

> **info** Requires iOS 17 or later. On older versions, the modifier is a no-op.

A scroll view clips its content to its own bounds, which cuts off anything drawn past them, such as a shadow or a card scaled up beyond the edge. Apply the [`scrollClipDisabled`](modifiers#scrollclipdisableddisabled) modifier to keep that content visible.

![A horizontal row of coloured squares whose shadows extend past the scroll bounds](/static/images/expo-ui/examples/scrollview-unclipped-ios-light.webp)

```tsx ScrollViewUnclippedExample.tsx
import {
  Host,
  HStack,
  RoundedRectangle,
  ScrollView,
} from '@expo/ui/swift-ui';
import {
  frame,
  foregroundStyle,
  scrollClipDisabled,
  shadow,
} from '@expo/ui/swift-ui/modifiers';

export default function ScrollViewUnclippedExample() {
  return (
    <Host style={{ flex: 1 }}>
      <ScrollView
        axes="horizontal"
        modifiers={[scrollClipDisabled()]}>
        <HStack>
          {Array.from({ length: 20 }, (_, i) => (
            <RoundedRectangle
              key={i}
              cornerRadius={12}
              modifiers={[
                frame({ width: 100, height: 100 }),
                foregroundStyle(`hsl(${i * 18}, 70%, 50%)`),
                shadow({ radius: 10, color: 'secondary' }),
              ]}
            />
          ))}
        </HStack>
      </ScrollView>
    </Host>
  );
}
```

## API

```tsx
import { ScrollView } from '@expo/ui/swift-ui';
```
