---
title: Universal 组件参考
description: 用 @expo/ui 在 Android、iOS 和 Web 上构建共享界面的跨平台组件。
---

# Universal 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`@expo/ui` 中的通用组件是覆盖各平台原生界面工具包的单一 API 层。在 Android 上，它们委托给 [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose)。在 iOS 上，它们委托给 [`@expo/ui/swift-ui`](/versions/latest/sdk/ui/swift-ui)。在 Web 上，它们是使用 `react-dom` 或 `react-native-web` 的 JavaScript 实现，并按组件选择合适的控件。

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

通用组件仍然必须包在 [`Host`](/versions/latest/sdk/ui/universal/host) 中，但包括 `Host` 在内的一切都从包根导入。通用 `Host` 会在 Android 和 iOS 上分发到平台原生宿主，因此不必直接使用 [`@expo/ui/swift-ui`](/versions/latest/sdk/ui/swift-ui) 或 [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose)。

**Android**

![Hello world 标签位于填充式 Material 3 按钮上方](/static/images/expo-ui/examples/universal-index-basic-android-light.webp)

**iOS**

![Hello world 标签位于填充按钮上方](/static/images/expo-ui/examples/universal-index-basic-ios-light.webp)

```tsx UniversalExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Column, Button, Text } from '@expo/ui';

export default function UniversalExample() {
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

## 可用组件

> 官方页面用卡片列表展示全部通用组件。各组件参考如下：

- [BottomSheet](/versions/latest/sdk/ui/universal/bottomsheet)
- [Button](/versions/latest/sdk/ui/universal/button)
- [Checkbox](/versions/latest/sdk/ui/universal/checkbox)
- [Collapsible](/versions/latest/sdk/ui/universal/collapsible)
- [Column](/versions/latest/sdk/ui/universal/column)
- [FieldGroup](/versions/latest/sdk/ui/universal/fieldgroup)
- [Host](/versions/latest/sdk/ui/universal/host)
- [Icon](/versions/latest/sdk/ui/universal/icon)
- [List](/versions/latest/sdk/ui/universal/list)
- [Picker](/versions/latest/sdk/ui/universal/picker)
- [RNHostView](/versions/latest/sdk/ui/universal/rnhostview)
- [Row](/versions/latest/sdk/ui/universal/row)
- [ScrollView](/versions/latest/sdk/ui/universal/scrollview)
- [Slider](/versions/latest/sdk/ui/universal/slider)
- [Spacer](/versions/latest/sdk/ui/universal/spacer)
- [Switch](/versions/latest/sdk/ui/universal/switch)
- [Text](/versions/latest/sdk/ui/universal/text)
- [TextInput](/versions/latest/sdk/ui/universal/textinput)

## 何时使用它，而不是 `jetpack-compose` / `swift-ui`

- 当你希望同一棵组件树在 Android、iOS 和 Web 上不加修改地运行时，使用 **universal** 组件。Android 和 iOS 上仍保留平台原生的外观和感觉，因为这些组件在底层委托给 Jetpack Compose / SwiftUI。
- 当你需要通用 API 未暴露的平台特定控件、修改器或行为时，直接使用 **[`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose)** 或 **[`@expo/ui/swift-ui`](/versions/latest/sdk/ui/swift-ui)**。
