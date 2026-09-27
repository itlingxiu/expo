---
title: TabView 组件参考
description: A SwiftUI TabView component for paged or tabbed content.
---

# TabView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI TabView matches the official SwiftUI [TabView API](https://developer.apple.com/documentation/swiftui/tabview) and switches between styles via the [`tabViewStyle`](modifiers#tabviewstyleconfig) modifier.

![A TabView with a bottom tab bar showing Home, Search, and Profile tabs in iOS 26 Liquid Glass style](/static/images/expo-ui/tabview/ios-light.webp)

> **Note:** For routed bottom-tab navigation across full-screen routes, use [`expo-router/native-tabs`](/router/advanced/native-tabs) instead.

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

Each page is a `<TabView.Tab>` child, identified by a `value` prop. `TabView` does not impose its own height — give it a frame, or place it inside a parent that does.

### Page style (swipeable pager)

Use `tabViewStyle({ type: 'page' })` for a horizontal pager with optional dot indicators. Pass `defaultSelection` to start the pager on a specific page without controlling it from React.

![A teal pager page labeled Page 2, with three dot indicators and the middle dot active](/static/images/expo-ui/examples/tabview-pager-ios-light.webp)

```tsx PagerExample.tsx
import {
  Host,
  Spacer,
  TabView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  font,
  foregroundStyle,
  frame,
  tabViewStyle,
} from '@expo/ui/swift-ui/modifiers';

const fillFrame = frame({
  maxWidth: Infinity,
  maxHeight: Infinity,
});
const pageFrame = frame({ minHeight: 320, maxHeight: 320 });

export default function PagerExample() {
  return (
    <Host style={{ flex: 1 }}>
      <TabView
        defaultSelection="1"
        modifiers={[pageFrame, tabViewStyle({ type: 'page' })]}>
        <TabView.Tab value="0">
          <Page label="Page 1" color="#6200EE" />
        </TabView.Tab>
        <TabView.Tab value="1">
          <Page label="Page 2" color="#03DAC5" />
        </TabView.Tab>
        <TabView.Tab value="2">
          <Page label="Page 3" color="#FF5722" />
        </TabView.Tab>
      </TabView>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <VStack
      alignment="center"
      modifiers={[fillFrame, background(color)]}>
      <Spacer />
      <Text
        modifiers={[
          font({ size: 28, weight: 'bold' }),
          foregroundStyle('#FFFFFF'),
        ]}>
        {label}
      </Text>
      <Spacer />
    </VStack>
  );
}
```

### Controlled selection

Pass `selection` and `onSelectionChange` to drive the active tab from React state. Each `<TabView.Tab>`'s `value` is matched against `selection`. Add the [`animation`](modifiers#animationanimationobject-animatedvalue) modifier to animate transitions when `selection` changes from JS.

![A Selected 0 readout and a Go to page 3 button above a purple pager page labeled Page 1](/static/images/expo-ui/examples/tabview-controlled-ios-light.webp)

```tsx ControlledTabViewExample.tsx
import { useState } from 'react';
import {
  Button,
  Host,
  Spacer,
  TabView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  animation,
  Animation,
  background,
  font,
  foregroundStyle,
  frame,
  tabViewStyle,
} from '@expo/ui/swift-ui/modifiers';

const fillFrame = frame({
  maxWidth: Infinity,
  maxHeight: Infinity,
});
const pageFrame = frame({ minHeight: 320, maxHeight: 320 });

export default function ControlledTabViewExample() {
  const [selected, setSelected] = useState('0');

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <Text>Selected: {selected}</Text>
        <Button
          label="Go to page 3"
          onPress={() => setSelected('2')}
        />
        <TabView
          selection={selected}
          onSelectionChange={setSelected}
          modifiers={[
            pageFrame,
            tabViewStyle({ type: 'page' }),
            animation(Animation.default, Number(selected)),
          ]}>
          <TabView.Tab value="0">
            <Page label="Page 1" color="#6200EE" />
          </TabView.Tab>
          <TabView.Tab value="1">
            <Page label="Page 2" color="#03DAC5" />
          </TabView.Tab>
          <TabView.Tab value="2">
            <Page label="Page 3" color="#FF5722" />
          </TabView.Tab>
        </TabView>
      </VStack>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <VStack
      alignment="center"
      modifiers={[fillFrame, background(color)]}>
      <Spacer />
      <Text
        modifiers={[
          font({ size: 28, weight: 'bold' }),
          foregroundStyle('#FFFFFF'),
        ]}>
        {label}
      </Text>
      <Spacer />
    </VStack>
  );
}
```

### Page indicator dots

Use the [`indexViewStyle`](modifiers#indexviewstyleconfig) modifier together with `tabViewStyle({ type: 'page' })` to control the dot indicators. Set `indexDisplayMode` to `'always'`, `'never'`, or `'automatic'`, and `backgroundDisplayMode` to render a translucent pill behind the dots.

![A blue pager page labeled Page 1 with three dots inside a translucent pill](/static/images/expo-ui/examples/tabview-page-indicator-ios-light.webp)

```tsx PageIndicatorExample.tsx
import {
  Host,
  Spacer,
  TabView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  font,
  foregroundStyle,
  frame,
  indexViewStyle,
  tabViewStyle,
} from '@expo/ui/swift-ui/modifiers';

const fillFrame = frame({
  maxWidth: Infinity,
  maxHeight: Infinity,
});
const pageFrame = frame({ minHeight: 320, maxHeight: 320 });

export default function PageIndicatorExample() {
  return (
    <Host style={{ flex: 1 }}>
      <TabView
        modifiers={[
          pageFrame,
          tabViewStyle({
            type: 'page',
            indexDisplayMode: 'always',
          }),
          indexViewStyle({ backgroundDisplayMode: 'always' }),
        ]}>
        <TabView.Tab value="0">
          <Page label="Page 1" color="#4F8DF6" />
        </TabView.Tab>
        <TabView.Tab value="1">
          <Page label="Page 2" color="#34C759" />
        </TabView.Tab>
        <TabView.Tab value="2">
          <Page label="Page 3" color="#FF9F0A" />
        </TabView.Tab>
      </TabView>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <VStack
      alignment="center"
      modifiers={[fillFrame, background(color)]}>
      <Spacer />
      <Text
        modifiers={[
          font({ size: 28, weight: 'bold' }),
          foregroundStyle('#FFFFFF'),
        ]}>
        {label}
      </Text>
      <Spacer />
    </VStack>
  );
}
```

### Bottom tab bar

Use `tabViewStyle({ type: 'automatic' })` for the SwiftUI default tab bar. Each tab's `label` and `systemImage` populate the bar item. Use the [`badge`](modifiers#badgevalue) modifier on a tab to attach a badge to its bar item.

> **Note:** For routed bottom-tab navigation across full-screen routes, use [`expo-router/native-tabs`](/router/advanced/native-tabs) instead.

![A blue Inbox page above a tab bar with Inbox, Sent, and Drafts, where Inbox carries a red badge reading 3](/static/images/expo-ui/examples/tabview-bottom-tabs-ios-light.webp)

```tsx BottomTabsExample.tsx
import { useState } from 'react';
import {
  Host,
  Spacer,
  TabView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  background,
  badge,
  font,
  foregroundStyle,
  frame,
  tabViewStyle,
} from '@expo/ui/swift-ui/modifiers';

const fillFrame = frame({
  maxWidth: Infinity,
  maxHeight: Infinity,
});

export default function BottomTabsExample() {
  const [selected, setSelected] = useState('inbox');

  return (
    <Host style={{ flex: 1 }}>
      <TabView
        selection={selected}
        onSelectionChange={setSelected}
        modifiers={[tabViewStyle({ type: 'automatic' })]}>
        <TabView.Tab
          value="inbox"
          label="Inbox"
          systemImage="tray.fill"
          modifiers={[badge('3')]}>
          <Page label="Inbox" color="#4F8DF6" />
        </TabView.Tab>
        <TabView.Tab
          value="sent"
          label="Sent"
          systemImage="paperplane.fill">
          <Page label="Sent" color="#34C759" />
        </TabView.Tab>
        <TabView.Tab
          value="drafts"
          label="Drafts"
          systemImage="square.and.pencil">
          <Page label="Drafts" color="#FF9F0A" />
        </TabView.Tab>
      </TabView>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <VStack
      alignment="center"
      modifiers={[fillFrame, background(color)]}>
      <Spacer />
      <Text
        modifiers={[
          font({ size: 28, weight: 'bold' }),
          foregroundStyle('#FFFFFF'),
        ]}>
        {label}
      </Text>
      <Spacer />
    </VStack>
  );
}
```

## API

```tsx
import { TabView } from '@expo/ui/swift-ui';
```
