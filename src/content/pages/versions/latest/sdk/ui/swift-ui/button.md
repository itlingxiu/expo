---
title: Button 组件参考
description: 用于显示原生按钮的 SwiftUI Button 组件。
---

# Button 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Button`](/versions/latest/sdk/ui/universal/button)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Button 与官方 SwiftUI [Button API](https://developer.apple.com/documentation/swiftui/button) 保持一致，并支持通过 [`buttonStyle`](/versions/latest/sdk/ui/swift-ui/modifiers)、[`controlSize`](/versions/latest/sdk/ui/swift-ui/modifiers) 及其他修饰符设置样式。

![两个 iOS 26 Liquid Glass 按钮——上方是 glassProminent 的 Get started，下方是 glass 的 Learn more](/static/images/expo-ui/button/ios-light.webp)

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

### 基本按钮

![蓝色的 Press me 按钮](/static/images/expo-ui/examples/button-basic-ios-light.webp)

```tsx BasicButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';

export default function BasicButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Press me" onPress={() => alert('Pressed!')} />
    </Host>
  );
}
```

### 带系统图像的按钮

![Download 按钮，标签前有向下箭头图标](/static/images/expo-ui/examples/button-with-image-ios-light.webp)

```tsx ButtonWithImageExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';

export default function ButtonWithImageExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Download"
        systemImage="arrow.down.circle"
        onPress={() => alert('Downloading...')}
      />
    </Host>
  );
}
```

### 仅图标按钮

使用 `labelStyle` 修饰符只显示图标，同时保留标签以供无障碍使用。

![齿轮图标按钮，没有可见标签](/static/images/expo-ui/examples/button-icon-only-ios-light.webp)

```tsx IconOnlyButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { labelStyle } from '@expo/ui/swift-ui/modifiers';

export default function IconOnlyButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Settings"
        systemImage="gear"
        modifiers={[labelStyle('iconOnly')]}
        onPress={() => alert('Settings')}
      />
    </Host>
  );
}
```

### 按钮样式

使用 `buttonStyle` 修饰符改变按钮外观。可用样式：`bordered`、`borderedProminent`、`borderless`、`plain`、`glass` 和 `glassProminent`。

:::note
`glass` 和 `glassProminent` 样式仅在使用 Xcode 26 构建的 iOS 26+ 上可用。
:::

![四个按钮分别展示 bordered、bordered prominent、borderless 和 plain 样式](/static/images/expo-ui/examples/button-styles-ios-light.webp)

```tsx ButtonStylesExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';
import { buttonStyle } from '@expo/ui/swift-ui/modifiers';

export default function ButtonStylesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button
          label="Bordered"
          modifiers={[buttonStyle('bordered')]}
        />
        <Button
          label="Bordered Prominent"
          modifiers={[buttonStyle('borderedProminent')]}
        />
        <Button
          label="Borderless"
          modifiers={[buttonStyle('borderless')]}
        />
        <Button label="Plain" modifiers={[buttonStyle('plain')]} />
      </VStack>
    </Host>
  );
}
```

### 按钮边框形状

使用 `buttonBorderShape` 修饰符改变带样式按钮的形状。可用形状：`automatic`、`capsule`、`roundedRectangle` 和 `circle`（iOS 17+）。

![圆形玻璃按钮，内含心形图标](/static/images/expo-ui/examples/button-border-shape-ios-light.webp)

```tsx ButtonBorderShapeExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  buttonBorderShape,
  labelStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function ButtonBorderShapeExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button
        label="Favorite"
        systemImage="heart.fill"
        modifiers={[
          buttonStyle('glass'),
          controlSize('extraLarge'),
          labelStyle('iconOnly'),
          buttonBorderShape('circle'),
        ]}
        onPress={() => alert('Favorited')}
      />
    </Host>
  );
}
```

### 控件尺寸

使用 `controlSize` 修饰符调整按钮尺寸。可用尺寸：`mini`、`small`、`regular`、`large` 和 `extraLarge`。

:::note
`extraLarge` 尺寸仅在 iOS 17+ 上可用。
:::

![四个 bordered 按钮，尺寸分别为 mini、small、regular 和 large](/static/images/expo-ui/examples/button-control-sizes-ios-light.webp)

```tsx ControlSizeExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
} from '@expo/ui/swift-ui/modifiers';

export default function ControlSizeExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button
          label="Mini"
          modifiers={[controlSize('mini'), buttonStyle('bordered')]}
        />
        <Button
          label="Small"
          modifiers={[
            controlSize('small'),
            buttonStyle('bordered'),
          ]}
        />
        <Button
          label="Regular"
          modifiers={[
            controlSize('regular'),
            buttonStyle('bordered'),
          ]}
        />
        <Button
          label="Large"
          modifiers={[
            controlSize('large'),
            buttonStyle('bordered'),
          ]}
        />
      </VStack>
    </Host>
  );
}
```

### 按钮角色

使用 `role` 属性表示按钮的语义角色。可用角色：`default`、`cancel` 和 `destructive`。

![三个按钮分别展示默认、取消和红色破坏性角色](/static/images/expo-ui/examples/button-roles-ios-light.webp)

```tsx ButtonRolesExample.tsx
import { Host, Button, VStack } from '@expo/ui/swift-ui';

export default function ButtonRolesExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Button label="Default" role="default" />
        <Button label="Cancel" role="cancel" />
        <Button label="Delete" role="destructive" />
      </VStack>
    </Host>
  );
}
```

### 着色按钮

使用 `tint` 修饰符改变按钮颜色。

![被番茄红着色的 Custom Color 按钮](/static/images/expo-ui/examples/button-tinted-ios-light.webp)

```tsx TintedButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Custom Color" modifiers={[tint('#FF6347')]} />
    </Host>
  );
}
```

### 禁用按钮

使用 `disabled` 修饰符禁用按钮。

![变灰的 Disabled 按钮](/static/images/expo-ui/examples/button-disabled-ios-light.webp)

```tsx DisabledButtonExample.tsx
import { Host, Button } from '@expo/ui/swift-ui';
import { disabled } from '@expo/ui/swift-ui/modifiers';

export default function DisabledButtonExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Disabled" modifiers={[disabled()]} />
    </Host>
  );
}
```

### 自定义标签内容

可以把自定义组件作为 `children` 传入，以构成更复杂的按钮标签内容。

![按钮中文件夹图标叠在 Folder 标签上方](/static/images/expo-ui/examples/button-custom-content-ios-light.webp)

```tsx CustomContentExample.tsx
import {
  Host,
  Button,
  VStack,
  Image,
  Text,
} from '@expo/ui/swift-ui';

export default function CustomContentExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Button onPress={() => console.log('Pressed!')}>
        <VStack spacing={4}>
          <Image systemName="folder" />
          <Text>Folder</Text>
        </VStack>
      </Button>
    </Host>
  );
}
```

## API

```tsx
import { Button } from '@expo/ui/swift-ui';
```
