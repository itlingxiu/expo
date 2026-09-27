---
title: SegmentedControl 组件参考
description: 与 @react-native-segmented-control/segmented-control 兼容的分段控件。
---

# SegmentedControl 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`SegmentedControl` 组件的 API 与 `@react-native-segmented-control/segmented-control` 兼容。它在 Android 上使用 Jetpack Compose 的 `SingleChoiceSegmentedButtonRow`，在 iOS 上使用分段样式的 SwiftUI `Picker`。

该组件在底层封装了各平台的 `@expo/ui` 原语：

- **Android**：[Jetpack Compose SegmentedButton](/versions/latest/sdk/ui/jetpack-compose/segmentedbutton)
- **iOS**：使用 `pickerStyle('segmented')` 的 [SwiftUI Picker](/versions/latest/sdk/ui/swift-ui/picker)

如果需要更底层的控制（自定义修改器、样式或布局），请直接使用这些原语。

**Android**

![选中 One 的 Material 3 分段按钮行](/static/images/expo-ui/community-segmentedcontrol/android-light.webp)

**iOS**

![选中 One 的分段控件](/static/images/expo-ui/community-segmentedcontrol/ios-light.webp)

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

## 从 `@react-native-segmented-control/segmented-control` 迁移

- 将导入从 `import SegmentedControl from '@react-native-segmented-control/segmented-control'` 改为 `import SegmentedControl from '@expo/ui/community/segmented-control'`。
- `values` 数组中的图片值不受支持，仅支持字符串。
- 不支持 `momentary`、`backgroundColor`、`fontStyle` 和 `activeFontStyle` 属性。
- `tintColor` 仅在 Android 上生效（设置当前分段容器的颜色）。在 iOS 上没有效果。

## 基本用法

**Android**

![选中 One 的 Material 3 分段按钮行](/static/images/expo-ui/examples/community-segmentedcontrol-basic-android-light.webp)

**iOS**

![选中 One 的分段控件](/static/images/expo-ui/examples/community-segmentedcontrol-basic-ios-light.webp)

```tsx SegmentedControlExample.tsx
import { useState } from 'react';
import SegmentedControl from '@expo/ui/community/segmented-control';

export default function SegmentedControlExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <SegmentedControl
      values={['One', 'Two', 'Three']}
      selectedIndex={selectedIndex}
      onChange={event => {
        setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
}
```

## API

```tsx
import SegmentedControl from '@expo/ui/community/segmented-control';
```
