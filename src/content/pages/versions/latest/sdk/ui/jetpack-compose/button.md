---
title: Button 组件参考
description: 用于显示原生 Material 3 按钮的 Jetpack Compose Button 组件。
---

# Button 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Button`](/versions/latest/sdk/ui/universal/button)——它会按平台渲染对应的原生组件。
:::

Expo UI 提供五个与官方 Jetpack Compose [Button API](https://developer.android.com/develop/ui/compose/components/button) 一致的按钮组件：`Button`（填充）、`FilledTonalButton`、`OutlinedButton`、`ElevatedButton` 和 `TextButton`。所有变体共享相同的属性，并接受可组合的子元素作为内容。

![填充、轮廓和文本按钮，展示 Material 3 的强调层级](/static/images/expo-ui/button/android-light.webp)

| 类型 | 外观 | 用途 |
| --- | --- | --- |
| 填充（Filled） | 实心背景，搭配对比色文本。 | 高强调按钮，用于「提交」「保存」等主要操作。 |
| 填充色调（Filled tonal） | 背景色随表面变化。 | 同样用于主要或重要操作。填充色调按钮视觉重量更大，适合「加入购物车」「登录」等功能。 |
| 抬升（Elevated） | 通过阴影凸显。 | 用途与色调按钮类似。提高海拔可使按钮更加突出。 |
| 轮廓（Outlined） | 有边框、无填充。 | 中等强调按钮，包含重要但非主要的操作。它们与其他按钮搭配良好，用来表示「取消」或「返回」等替代性的次要操作。 |
| 文本（Text） | 只显示文本，没有背景或边框。 | 低强调按钮，适合不太关键的操作，例如导航链接，或「了解更多」「查看详情」等次要功能。 |

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

填充按钮是默认的高强调按钮，用于主要操作。

![标签为 Press me 的填充式 Material 3 按钮](/static/images/expo-ui/examples/compose-button-basic-android-light.webp)

```tsx BasicButtonExample.tsx
import { Host, Button, Text } from '@expo/ui/jetpack-compose';

export default function BasicButtonExample() {
  return (
    <Host matchContents>
      <Button onClick={() => alert('Pressed!')}>
        <Text>Press me</Text>
      </Button>
    </Host>
  );
}
```

### 按钮变体

使用不同的按钮组件来表达不同程度的强调。

![在列中堆叠的填充、填充色调、轮廓、抬升和文本按钮](/static/images/expo-ui/examples/compose-button-variants-android-light.webp)

```tsx ButtonVariantsExample.tsx
import {
  Host,
  Button,
  FilledTonalButton,
  OutlinedButton,
  ElevatedButton,
  TextButton,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';

export default function ButtonVariantsExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 8 }}>
        <Button onClick={() => {}}>
          <Text>Filled</Text>
        </Button>
        <FilledTonalButton onClick={() => {}}>
          <Text>Filled Tonal</Text>
        </FilledTonalButton>
        <OutlinedButton onClick={() => {}}>
          <Text>Outlined</Text>
        </OutlinedButton>
        <ElevatedButton onClick={() => {}}>
          <Text>Elevated</Text>
        </ElevatedButton>
        <TextButton onClick={() => {}}>
          <Text>Text</Text>
        </TextButton>
      </Column>
    </Host>
  );
}
```

### 带图标的按钮

按钮接受可组合的子元素，因此可以用 `Icon` 组件添加前置和后置图标。这遵循 [Material 3 带图标按钮](https://m3.material.io/components/buttons/guidelines) 的模式（[官方示例](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/material3/material3/samples/src/main/java/androidx/compose/material3/samples/ButtonSamples.kt;l=179?q=ButtonWithIconSample)）：图标尺寸为 18dp，图标与标签之间间距为 8dp。

![三个按钮，分别展示前置图标、后置图标，以及同时包含两者](/static/images/expo-ui/examples/compose-button-icons-android-light.webp)

```tsx ButtonWithIconsExample.tsx
import {
  Host,
  Button,
  OutlinedButton,
  FilledTonalButton,
  Column,
  Icon,
  Spacer,
  Text,
} from '@expo/ui/jetpack-compose';
import { width } from '@expo/ui/jetpack-compose/modifiers';

const addIcon = require('./assets/add.png');
const sendIcon = require('./assets/send.png');

export default function ButtonWithIconsExample() {
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 8 }}>
        {/* 前置图标 */}
        <Button onClick={() => {}}>
          <Icon source={addIcon} size={18} tint="#FFFFFF" />
          <Spacer modifiers={[width(8)]} />
          <Text>Add item</Text>
        </Button>

        {/* 后置图标 */}
        <OutlinedButton onClick={() => {}}>
          <Text>Send</Text>
          <Spacer modifiers={[width(8)]} />
          <Icon source={sendIcon} size={18} />
        </OutlinedButton>

        {/* 同时包含前置和后置图标 */}
        <FilledTonalButton onClick={() => {}}>
          <Icon source={addIcon} size={18} />
          <Spacer modifiers={[width(8)]} />
          <Text>Create & Send</Text>
          <Spacer modifiers={[width(8)]} />
          <Icon source={sendIcon} size={18} />
        </FilledTonalButton>
      </Column>
    </Host>
  );
}
```

### 自定义颜色

使用 `colors` 属性覆盖容器颜色和内容颜色。

![紫色按钮配白色文本，覆盖了主题的容器色和内容色](/static/images/expo-ui/examples/compose-button-custom-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { Host, Button, Text } from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  return (
    <Host matchContents>
      <Button
        onClick={() => {}}
        colors={{
          containerColor: '#6200EE',
          contentColor: '#FFFFFF',
        }}>
        <Text>Purple Button</Text>
      </Button>
    </Host>
  );
}
```

### 自定义形状

![按钮的左上角和右下角为圆角，对角为直角](/static/images/expo-ui/examples/compose-button-custom-shape-android-light.webp)

```tsx CustomShapeExample.tsx
import {
  Host,
  Button,
  Shape,
  Text,
} from '@expo/ui/jetpack-compose';

export default function CustomShapeExample() {
  return (
    <Host matchContents>
      <Button
        onClick={() => {}}
        shape={Shape.RoundedCorner({
          cornerRadii: { topStart: 16, bottomEnd: 16 },
        })}>
        <Text>Custom Shape</Text>
      </Button>
    </Host>
  );
}
```

## API

```tsx
import {
  Button,
  FilledTonalButton,
  OutlinedButton,
  ElevatedButton,
  TextButton,
} from '@expo/ui/jetpack-compose';
```
