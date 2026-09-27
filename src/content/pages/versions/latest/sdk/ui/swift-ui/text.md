---
title: Text 组件参考
description: 用于显示带样式文本、并支持嵌套文本的 SwiftUI Text 组件。
---

# Text 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`Text`](/versions/latest/sdk/ui/universal/text)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Text 与官方 SwiftUI [Text API](https://developer.apple.com/documentation/swiftui/text) 保持一致。

![以不同字号、字重和层级次要样式渲染的文本](/static/images/expo-ui/text/ios-light.webp)

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

### 基本文本

![默认系统字体的 Hello world](/static/images/expo-ui/examples/text-basic-ios-light.webp)

```tsx BasicTextExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';

export default function BasicTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Text>Hello world</Text>
    </Host>
  );
}
```

### 带修饰符的文本

使用修饰符为整段文本设置样式。

![大号粗体蓝色字体渲染的 Large Bold Blue Text](/static/images/expo-ui/examples/text-styled-ios-light.webp)

```tsx StyledTextExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function StyledTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Text
        modifiers={[
          font({ size: 24, weight: 'bold' }),
          foregroundStyle('blue'),
        ]}>
        Large Bold Blue Text
      </Text>
    </Host>
  );
}
```

### 嵌套文本（分段样式）

嵌套 `Text` 组件，为各个片段分别设置样式。适用于行内格式，例如句子中的粗体或彩色词语。

:::note
嵌套文本使用 SwiftUI 的 [Text 拼接](https://developer.apple.com/documentation/swiftui/text)，因此只有返回 `Text` 的修饰符（例如 `bold`、`italic`、`font`、`foregroundColor`，以及带颜色的 `foregroundStyle`）才会作用于嵌套片段。
:::

![句子 Hello world!，其中 world 为粗体红色](/static/images/expo-ui/examples/text-nested-ios-light.webp)

```tsx NestedTextExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import {
  bold,
  italic,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function NestedTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Text>
        Hello{' '}
        <Text modifiers={[bold(), foregroundStyle('red')]}>
          world
        </Text>
        !
      </Text>
    </Host>
  );
}
```

### 混合行内样式

组合多个带样式的片段，实现富文本格式。

![句子中 bold 为粗体、italic 为斜体、colored 为橙色](/static/images/expo-ui/examples/text-mixed-styles-ios-light.webp)

```tsx MixedStylesExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import {
  bold,
  italic,
  foregroundStyle,
  font,
} from '@expo/ui/swift-ui/modifiers';

export default function MixedStylesExample() {
  return (
    <Host matchContents>
      <Text>
        This is <Text modifiers={[bold()]}>bold</Text>,{' '}
        <Text modifiers={[italic()]}>italic</Text>, and{' '}
        <Text modifiers={[foregroundStyle('orange')]}>colored</Text>{' '}
        text.
      </Text>
    </Host>
  );
}
```

### 字重

使用 `font` 修饰符应用不同字重。

![八行叠放，展示从 Ultra Light 到 Black 的字重](/static/images/expo-ui/examples/text-font-weights-ios-light.webp)

```tsx FontWeightsExample.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';
import { font } from '@expo/ui/swift-ui/modifiers';

export default function FontWeightsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={4}>
        <Text modifiers={[font({ weight: 'ultraLight' })]}>
          Ultra Light
        </Text>
        <Text modifiers={[font({ weight: 'light' })]}>Light</Text>
        <Text modifiers={[font({ weight: 'regular' })]}>
          Regular
        </Text>
        <Text modifiers={[font({ weight: 'medium' })]}>Medium</Text>
        <Text modifiers={[font({ weight: 'semibold' })]}>
          Semibold
        </Text>
        <Text modifiers={[font({ weight: 'bold' })]}>Bold</Text>
        <Text modifiers={[font({ weight: 'heavy' })]}>Heavy</Text>
        <Text modifiers={[font({ weight: 'black' })]}>Black</Text>
      </VStack>
    </Host>
  );
}
```

### 字体设计

使用 `font` 修饰符应用不同字体设计。

![四行叠放，展示默认、圆角、衬线和等宽设计](/static/images/expo-ui/examples/text-font-designs-ios-light.webp)

```tsx FontDesignsExample.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';
import { font } from '@expo/ui/swift-ui/modifiers';

export default function FontDesignsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={4}>
        <Text modifiers={[font({ design: 'default', size: 18 })]}>
          Default Design
        </Text>
        <Text modifiers={[font({ design: 'rounded', size: 18 })]}>
          Rounded Design
        </Text>
        <Text modifiers={[font({ design: 'serif', size: 18 })]}>
          Serif Design
        </Text>
        <Text
          modifiers={[font({ design: 'monospaced', size: 18 })]}>
          Monospaced Design
        </Text>
      </VStack>
    </Host>
  );
}
```

### 自定义字体

使用带 `family` 参数的 `font` 修饰符来使用自定义字体。可以用 [`expo-font`](/versions/latest/sdk/font) 库加载自定义字体。

![两行文本，Inter Bold 在 Inter Regular 上方。](/static/images/expo-ui/examples/text-custom-font-ios-light.webp)

```tsx CustomFontExample.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';
import { font } from '@expo/ui/swift-ui/modifiers';

export default function CustomFontExample() {
  return (
    <Host matchContents style={{ alignSelf: 'center' }}>
      <VStack spacing={4}>
        <Text
          modifiers={[font({ family: 'Inter-Bold', size: 18 })]}>
          Inter Bold
        </Text>
        <Text
          modifiers={[font({ family: 'Inter-Regular', size: 18 })]}>
          Inter Regular
        </Text>
      </VStack>
    </Host>
  );
}
```

### 限制行数的文本

使用 `lineLimit` 修饰符在一定行数后截断文本。

![长段落在两行后截断，末尾带省略号](/static/images/expo-ui/examples/text-line-limit-ios-light.webp)

```tsx LineLimitExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import { lineLimit } from '@expo/ui/swift-ui/modifiers';

export default function LineLimitExample() {
  const longText =
    'This is a very long text that will be truncated after two lines. '.repeat(
      5
    );

  return (
    <Host style={{ flex: 1 }}>
      <Text modifiers={[lineLimit(2)]}>{longText}</Text>
    </Host>
  );
}
```

### Markdown

使用 `markdownEnabled` 属性为文本内容启用 Markdown 格式。

![五行分别展示粗体、斜体、删除线和等宽文本，以及蓝色链接](/static/images/expo-ui/examples/text-markdown-ios-light.webp)

```tsx MarkdownTextExample.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';

export default function MarkdownTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack spacing={4}>
        <Text markdownEnabled>Regular text.</Text>
        <Text markdownEnabled>
          This is **bold text**, *italic text* and ***text in both
          bold and italic***.
        </Text>
        <Text markdownEnabled>~~Strikethrough text~~</Text>
        <Text markdownEnabled>`This is monospaced text`</Text>
        <Text markdownEnabled>
          Visit the [Expo
          Docs](/versions/latest/sdk/ui) to
          learn more about Expo UI
        </Text>
      </VStack>
    </Host>
  );
}
```

### 自动更新的日期

使用 `date` 和 `dateStyle` 属性显示随时间自动更新的日期。这在小组件和 Live Activities 中特别有用。

![倒计时显示 4 分 53 秒](/static/images/expo-ui/examples/text-date-ios-light.webp)

```tsx DateTextExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';

export default function DateTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Text
        date={new Date(Date.now() + 300000)}
        dateStyle="timer"
      />
    </Host>
  );
}
```

### 计时区间

使用 `timerInterval` 显示实时倒计时或正计时。需要 iOS/tvOS 16+。

![倒计时显示 9 分 54 秒](/static/images/expo-ui/examples/text-timer-interval-ios-light.webp)

```tsx TimerIntervalExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';

export default function TimerIntervalExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Text
        timerInterval={{
          lower: new Date(),
          upper: new Date(Date.now() + 600000),
        }}
        countsDown
      />
    </Host>
  );
}
```

:::note
`timerInterval`、`countsDown` 和 `pauseTime` 需要 iOS 16.0+ / tvOS 16.0+。在更早的版本上，计时区间不会渲染。
:::

## API

```tsx
import { Text } from '@expo/ui/swift-ui';
```
