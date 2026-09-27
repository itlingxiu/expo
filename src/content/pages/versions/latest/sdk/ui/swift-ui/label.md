---
title: Label 组件参考
description: 用于同时显示文本和图标的 SwiftUI Label 组件。
---

# Label 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Label 与官方 SwiftUI [Label API](https://developer.apple.com/documentation/swiftui/label) 保持一致，在标题旁显示图标。

![Form 中三行带 SF Symbol 的 Label](/static/images/expo-ui/label/ios-light.webp)

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

### 带 SF Symbol 的基本标签

![星形 SF Symbol 旁边是标题 Favorites](/static/images/expo-ui/examples/label-basic-ios-light.webp)

```tsx BasicLabelExample.tsx
import { Host, Label } from '@expo/ui/swift-ui';

export default function BasicLabelExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Label title="Favorites" systemImage="star.fill" />
    </Host>
  );
}
```

### 自定义图标

使用 `icon` 属性提供自定义 React 节点作为图标，而不是 SF Symbol。

![紫色 sparkles SF Symbol 旁边是标题 Custom Icon](/static/images/expo-ui/examples/label-custom-icon-ios-light.webp)

```tsx LabelCustomIconExample.tsx
import { Host, Label, Image } from '@expo/ui/swift-ui';

export default function LabelCustomIconExample() {
  return (
    <Host matchContents>
      <Label
        title="Custom Icon"
        icon={
          <Image systemName="sparkles" size={20} color="purple" />
        }
      />
    </Host>
  );
}
```

### 仅图标

使用 [`labelStyle`](/versions/latest/sdk/ui/swift-ui/modifiers#labelstylestyle) 修改器并传入 `iconOnly`，只显示图标。即使标题不可见，也始终提供 `title` 以支持无障碍。

![单独显示的齿轮 SF Symbol，没有可见的标题文本](/static/images/expo-ui/examples/label-icon-only-ios-light.webp)

```tsx LabelIconOnlyExample.tsx
import { Host, Label } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';

export default function LabelIconOnlyExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Label
        title="Settings"
        systemImage="gear"
        modifiers={[labelStyle('iconOnly')]}
      />
    </Host>
  );
}
```

## API

```tsx
import { Label } from '@expo/ui/swift-ui';
```
