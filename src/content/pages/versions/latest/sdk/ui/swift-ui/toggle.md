---
title: Toggle 组件参考
description: 用于显示原生开关的 SwiftUI Toggle 组件。
---

# Toggle 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Switch`](/versions/latest/sdk/ui/universal/switch)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Toggle 与官方 SwiftUI [Toggle API](https://developer.apple.com/documentation/swiftui/toggle) 保持一致，并可通过 [`toggleStyle`](/versions/latest/sdk/ui/swift-ui/modifiers#togglestylestyle) 修改器设置样式。

![Form 中的 Toggle 行](/static/images/expo-ui/toggle/ios-light.webp)

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

### 基本开关

![标签为 Enable feature 的行，末端开关处于关闭状态](/static/images/expo-ui/examples/toggle-basic-ios-light.webp)

```tsx BasicToggleExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';

export default function BasicToggleExample() {
  const [isOn, setIsOn] = useState(false);

  // 开关行会拉伸到给定宽度，因此请给宿主指定尺寸。
  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Enable feature"
      />
    </Host>
  );
}
```

### 带系统图标的开关

![带飞机图标、标签为 Airplane Mode、开关关闭的一行](/static/images/expo-ui/examples/toggle-system-image-ios-light.webp)

```tsx ToggleWithImageExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';

export default function ToggleWithImageExample() {
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={airplaneMode}
        onIsOnChange={setAirplaneMode}
        label="Airplane Mode"
        systemImage="airplane"
      />
    </Host>
  );
}
```

### 开关样式

使用 `toggleStyle` 修改器改变开关外观。可用样式为：`automatic`、`switch` 和 `button`。

:::note
`button` 样式在 tvOS 上不可用。
:::

![Switch Style 行的开关已打开，下方是处于选中填充状态的 Button Style 开关](/static/images/expo-ui/examples/toggle-styles-ios-light.webp)

```tsx ToggleStylesExample.tsx
import { useState } from 'react';
import { Host, Toggle, VStack } from '@expo/ui/swift-ui';
import { toggleStyle } from '@expo/ui/swift-ui/modifiers';

export default function ToggleStylesExample() {
  const [isOn, setIsOn] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={8}>
        <Toggle
          isOn={isOn}
          onIsOnChange={setIsOn}
          label="Switch Style"
          modifiers={[toggleStyle('switch')]}
        />
        <Toggle
          isOn={isOn}
          onIsOnChange={setIsOn}
          label="Button Style"
          modifiers={[toggleStyle('button')]}
        />
      </VStack>
    </Host>
  );
}
```

### 着色开关

使用 `tint` 修改器改变开关颜色。

![标签为 Custom Color 的行，开关已打开并着橙色](/static/images/expo-ui/examples/toggle-tinted-ios-light.webp)

```tsx TintedToggleExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';
import { tint } from '@expo/ui/swift-ui/modifiers';

export default function TintedToggleExample() {
  const [isOn, setIsOn] = useState(true);

  return (
    <Host matchContents>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Custom Color"
        modifiers={[tint('#FF9500')]}
      />
    </Host>
  );
}
```

### 自定义标签内容

可以把自定义组件作为 `children` 传入，组成更复杂的开关标签。使用多个 `Text` 时，第一个表示标题，第二个表示副标题。

![开关行标题为 Vibrate on ring，下方有一行灰色副标题](/static/images/expo-ui/examples/toggle-custom-label-ios-light.webp)

```tsx CustomLabelExample.tsx
import { useState } from 'react';
import { Host, Toggle, Text } from '@expo/ui/swift-ui';

export default function CustomLabelExample() {
  const [vibrateOnRing, setVibrateOnRing] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle isOn={vibrateOnRing} onIsOnChange={setVibrateOnRing}>
        <Text>Vibrate on ring</Text>
        <Text>Enable vibration when the phone rings</Text>
      </Toggle>
    </Host>
  );
}
```

### 隐藏标签

使用 [`labelsHidden`](/versions/latest/sdk/ui/swift-ui/modifiers#labelshidden) 修改器隐藏标签，同时保留它以支持无障碍。

![单独一个开关，没有可见的标签文本](/static/images/expo-ui/examples/toggle-hidden-label-ios-light.webp)

```tsx HiddenLabelExample.tsx
import { useState } from 'react';
import { Host, Toggle } from '@expo/ui/swift-ui';
import { labelsHidden } from '@expo/ui/swift-ui/modifiers';

export default function HiddenLabelExample() {
  const [isOn, setIsOn] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Toggle
        isOn={isOn}
        onIsOnChange={setIsOn}
        label="Hidden Label"
        modifiers={[labelsHidden()]}
      />
    </Host>
  );
}
```

## API

```tsx
import { Toggle } from '@expo/ui/swift-ui';
```
