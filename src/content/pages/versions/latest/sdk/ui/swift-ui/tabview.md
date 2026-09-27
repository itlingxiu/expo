---
title: TabView 组件参考
description: 用于分页或标签内容的 SwiftUI TabView 组件。
---

# TabView 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 TabView 与官方 SwiftUI [TabView API](https://developer.apple.com/documentation/swiftui/tabview) 保持一致，并通过 [`tabViewStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符在样式之间切换。

![底部标签栏的 TabView，以 iOS 26 Liquid Glass 样式显示 Home、Search 和 Profile 标签](/static/images/expo-ui/tabview/ios-light.webp)

:::note
若要在全屏路由之间做带路由的底部标签导航，请改用 [`expo-router/native-tabs`](/router/advanced/native-tabs)。
:::

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

每一页都是 `<TabView.Tab>` 子元素，由 `value` 属性标识。`TabView` 不会自己决定高度——给它一个 frame，或把它放在会决定高度的父级中。

### 页面样式（可滑动分页器）

使用 `tabViewStyle({ type: 'page' })` 获得带可选圆点指示器的水平分页器。传入 `defaultSelection` 可在不从 React 控制的情况下从指定页开始。

![青色分页页标签为 Page 2，三个圆点指示器，中间圆点处于活动状态](/static/images/expo-ui/examples/tabview-pager-ios-light.webp)

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

### 受控选择

传入 `selection` 和 `onSelectionChange`，用 React 状态驱动活动标签。每个 `<TabView.Tab>` 的 `value` 会与 `selection` 匹配。加上 [`animation`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，可在 `selection` 从 JS 变化时为过渡添加动画。

![Selected 0 读数和 Go to page 3 按钮，位于标签为 Page 1 的紫色分页页上方](/static/images/expo-ui/examples/tabview-controlled-ios-light.webp)

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

### 页面指示圆点

把 [`indexViewStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符与 `tabViewStyle({ type: 'page' })` 一起使用，以控制圆点指示器。将 `indexDisplayMode` 设为 `'always'`、`'never'` 或 `'automatic'`，并用 `backgroundDisplayMode` 在圆点后方渲染半透明胶囊。

![蓝色分页页标签为 Page 1，三个圆点位于半透明胶囊内](/static/images/expo-ui/examples/tabview-page-indicator-ios-light.webp)

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

### 底部标签栏

使用 `tabViewStyle({ type: 'automatic' })` 获得 SwiftUI 默认标签栏。每个标签的 `label` 和 `systemImage` 会填充栏项。在标签上使用 [`badge`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符为其栏项附加徽章。

:::note
若要在全屏路由之间做带路由的底部标签导航，请改用 [`expo-router/native-tabs`](/router/advanced/native-tabs)。
:::

![蓝色 Inbox 页面位于标签栏上方，标签为 Inbox、Sent 和 Drafts，Inbox 带红色徽章 3](/static/images/expo-ui/examples/tabview-bottom-tabs-ios-light.webp)

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
