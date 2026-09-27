---
title: Host 组件参考
description: 包裹通用 @expo/ui 内容的跨平台 Host 组件。
---

# Host 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

通用 `@expo/ui` 内容的容器。在 Android 和 iOS 上，它重新导出平台原生的 [Jetpack Compose 版 `Host`](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI 版 `Host`](/versions/latest/sdk/ui/swift-ui/host)，因此 Jetpack Compose/SwiftUI 子节点的渲染方式与平台专属包中完全相同。在 Web 上，它回退为 React Native [`View`](https://reactnative.dev/docs/view)。把 `Host` 用作任意通用子树的根，同一棵组件树就能在三个平台上工作。

**Android**

![填充按钮上方的 Hello world 标签](/static/images/expo-ui/host/android-light.webp)

**iOS**

![填充按钮上方的 Hello world 标签](/static/images/expo-ui/host/ios-light.webp)

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

### 基本用法

**Android**

![填充的 Material 3 按钮上方的 Hello world 标签](/static/images/expo-ui/examples/universal-host-basic-android-light.webp)

**iOS**

![填充按钮上方的 Hello world 标签](/static/images/expo-ui/examples/universal-host-basic-ios-light.webp)

```tsx HostExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text, Button } from '@expo/ui';

export default function HostExample() {
  const colorScheme = useColorScheme();

  return (
    <Host style={{ flex: 1 }}>
      <Column spacing={12} alignment="center">
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Hello, world!
        </Text>
        <Button label="Press me" onPress={() => alert('Pressed')} />
      </Column>
    </Host>
  );
}
```

### 把组件放进 React Native 视图

`Host` 在 Android 上用 Jetpack Compose、在 iOS 上用 SwiftUI 渲染通用子节点。`Host` 内部的 React Native 视图（例如 `View` 或 `ScrollView`）会切回 React Native 渲染。要在该视图里使用通用组件，请把组件再包进一个新的 `Host`。即使树的更高层已经有 `Host` 包着这个视图，也要这样做。

**Android**

![标签为 Notifications 的一行，尾部是关闭的 Material 3 开关](/static/images/expo-ui/examples/universal-host-react-native-views-android-light.webp)

**iOS**

![标签为 Notifications 的一行，尾部是关闭的开关](/static/images/expo-ui/examples/universal-host-react-native-views-ios-light.webp)

```tsx ReactNativeLayoutExample.tsx
import { useState } from 'react';
import { ScrollView, Text, View, useColorScheme } from 'react-native';
import { Host, Switch } from '@expo/ui';

export default function ReactNativeLayoutExample() {
  const colorScheme = useColorScheme();
  const [enabled, setEnabled] = useState(false);

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
        }}>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>Notifications</Text>
        <Host matchContents>
          <Switch value={enabled} onValueChange={setEnabled} />
        </Host>
      </View>
    </ScrollView>
  );
}
```

要把 React Native 视图放进通用布局，请使用 [`RNHostView`](/versions/latest/sdk/ui/universal/rnhostview)。

### 匹配内容尺寸

使用 `matchContents` 让 `Host` 按内容自适应尺寸。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，它会给底层 `View` 设置 `alignSelf: 'flex-start'`，使宿主收缩以贴合子节点，而不会被父级拉伸。

:::note
在 Web 上，按轴形式（`{ horizontal: true }` / `{ vertical: true }`）与布尔形式行为相同，因为 `alignSelf` 只控制父级交叉轴上的拉伸。依赖独立按轴尺寸的组件在 Web 上应预期同样的收缩贴合行为，无论选择了哪一条轴。
:::

**Android**

![按标签尺寸收缩的 Material 3 按钮](/static/images/expo-ui/examples/universal-host-match-contents-android-light.webp)

**iOS**

![按标签尺寸收缩的按钮](/static/images/expo-ui/examples/universal-host-match-contents-ios-light.webp)

```tsx MatchContentsExample.tsx
import { Host, Button } from '@expo/ui';

export default function MatchContentsExample() {
  return (
    <Host matchContents>
      <Button label="Sized to content" onPress={() => {}} />
    </Host>
  );
}
```

### 布局方向

使用 `layoutDirection` 把子树渲染为从左到右或从右到左。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，它会在底层 `View` 上设置 `dir` 属性，使后代继承所选方向。

**Android**

![两个标签从右向左排列，Second 在 First 之前](/static/images/expo-ui/examples/universal-host-layout-direction-android-light.webp)

**iOS**

![两个标签从右向左排列，Second 在 First 之前](/static/images/expo-ui/examples/universal-host-layout-direction-ios-light.webp)

```tsx LayoutDirectionExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Row, Text } from '@expo/ui';

export default function LayoutDirectionExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host
      layoutDirection="rightToLeft"
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Row spacing={8}>
        <Text textStyle={ink}>First</Text>
        <Text textStyle={ink}>Second</Text>
      </Row>
    </Host>
  );
}
```

### 响应内容布局

使用 `onLayoutContent` 获取宿主内容的当前尺寸。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，它来自底层 `View` 的 `onLayout` 回调。

**Android**

![按自身内容收缩的 Hello world 标签](/static/images/expo-ui/examples/universal-host-on-layout-content-android-light.webp)

**iOS**

![按自身内容收缩的 Hello world 标签](/static/images/expo-ui/examples/universal-host-on-layout-content-ios-light.webp)

```tsx OnLayoutContentExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Text } from '@expo/ui';

export default function OnLayoutContentExample() {
  const colorScheme = useColorScheme();

  return (
    <Host
      matchContents
      onLayoutContent={({ nativeEvent: { width, height } }) =>
        console.log(`content size: ${width}x${height}`)
      }>
      <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
        Hello, world!
      </Text>
    </Host>
  );
}
```

### 填满视口

内容需要按可用视口空间调整尺寸时，使用 `useViewportSizeMeasurement`。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，宿主底层 `View` 会获得当前窗口的宽高；你传入的显式 `style` 仍然优先。

**Android**

![屏幕中央的 Fills the viewport 标签](/static/images/expo-ui/examples/universal-host-viewport-android-light.webp)

**iOS**

![屏幕中央的 Fills the viewport 标签](/static/images/expo-ui/examples/universal-host-viewport-ios-light.webp)

```tsx UseViewportSizeMeasurementExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Text } from '@expo/ui';

export default function UseViewportSizeMeasurementExample() {
  const colorScheme = useColorScheme();

  return (
    <Host useViewportSizeMeasurement>
      <Column spacing={12} alignment="center">
        <Text textStyle={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Fills the viewport
        </Text>
      </Column>
    </Host>
  );
}
```

### 忽略安全区域

默认情况下，`Host` 会遵守设备安全区域边距（刘海、Home 指示条等）。使用 `ignoreSafeArea="all"` 让内容延伸到边缘，或使用 `ignoreSafeArea="keyboard"` 保留安全区域内边距但忽略键盘边距。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，它通过 CSS `env(safe-area-inset-*)` 作为底层 `View` 的内边距实现；默认还会纳入 `env(keyboard-inset-*)`，供选择启用 [VirtualKeyboard API](https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API) 的页面使用。

**Android**

![绘制在状态栏和导航栏下方的标签](/static/images/expo-ui/examples/universal-host-ignore-safe-area-android-light.webp)

**iOS**

![绘制在灵动岛和 Home 指示条下方的标签](/static/images/expo-ui/examples/universal-host-ignore-safe-area-ios-light.webp)

```tsx IgnoreSafeAreaExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Spacer, Text } from '@expo/ui';

export default function IgnoreSafeAreaExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host ignoreSafeArea="all" style={{ flex: 1 }}>
      <Column alignment="center">
        <Text textStyle={ink}>Behind the status bar</Text>
        <Spacer flexible />
        <Text textStyle={ink}>Behind the home indicator</Text>
      </Column>
    </Host>
  );
}
```

### 强制配色方案

使用 `colorScheme` 覆盖子树的外观。传入 `'light'` 或 `'dark'` 强制其一，或省略以跟随设备设置。在 Android 和 iOS 上，这会转发给平台原生的 `Host`（确切的平台语义见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/host)/[SwiftUI](/versions/latest/sdk/ui/swift-ui/host)）。在 Web 上，它会在底层 `View` 上设置 `data-theme`，使设计令牌 CSS 变量解析为强制方案，不受 `prefers-color-scheme` 影响。

**Android**

![浅色屏幕上使用深色主题颜色的按钮](/static/images/expo-ui/examples/universal-host-color-scheme-android-light.webp)

**iOS**

![浅色屏幕上使用深色主题颜色的按钮](/static/images/expo-ui/examples/universal-host-color-scheme-ios-light.webp)

```tsx HostColorSchemeExample.tsx
import { Host, Button } from '@expo/ui';

export default function HostColorSchemeExample() {
  return (
    <Host colorScheme="dark" matchContents>
      <Button label="Always dark" onPress={() => {}} />
    </Host>
  );
}
```

### 用种子色生成主题

使用 `seedColor` 从单一基色派生应用于子树的主题。各平台按原生方式解释它。在 Android 上，它会生成完整的 Material 3 调色板（`SchemeTonalSpot`，与 Material You 相同的算法），用于为 Compose 子节点配色，并通过 [`useMaterialColors`](/versions/latest/sdk/ui/jetpack-compose/colors#usematerialcolorsoptions) 暴露给后代。在 iOS 上，它作为 SwiftUI 色调应用，经环境传播，为按钮、开关和滑块等交互控件配色。在 Web 上，它会生成主色阶，并以 CSS 变量暴露给底层 `View`。省略时，各平台回退到默认主题。

**Android**

![绿色开关上方的绿色 Material 3 按钮](/static/images/expo-ui/examples/universal-host-seed-color-android-light.webp)

**iOS**

![绿色开关上方的绿色按钮](/static/images/expo-ui/examples/universal-host-seed-color-ios-light.webp)

```tsx HostSeedColorExample.tsx
import { Host, Column, Button, Switch } from '@expo/ui';

export default function HostSeedColorExample() {
  return (
    <Host seedColor="#00bc7d" style={{ flex: 1 }}>
      <Column spacing={12} alignment="center">
        <Button label="Themed button" onPress={() => {}} />
        <Switch value onValueChange={() => {}} />
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Host } from '@expo/ui';
```
