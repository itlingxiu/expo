---
title: Text 组件参考
description: 用于显示带样式文本的 Jetpack Compose Text 组件。
---

# Text 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`Text`](/versions/latest/sdk/ui/universal/text)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 Text 与官方 Jetpack Compose [文本样式](https://developer.android.com/develop/ui/compose/text/style-text) API 保持一致，使用 Material 3 排版样式、自定义字体和文本格式选项显示文本。

![Material 3 排版层级：标题、题目、正文和标签](/static/images/expo-ui/text/android-light.webp)

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

![一行写着 Hello, world! 的文本](/static/images/expo-ui/examples/composetext-basic-android-light.webp)

```tsx BasicTextExample.tsx
import {
  Host,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function BasicTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Text color={colors.onBackground}>Hello, world!</Text>
    </Host>
  );
}
```

### 排版样式

使用带 `typography` 的 `style` 属性应用 Material 3 排版预设。

![四行分别展示 display large、headline medium、body small 和 label large 字号](/static/images/expo-ui/examples/composetext-typography-android-light.webp)

```tsx TypographyExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function TypographyExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ typography: 'displayLarge' }}>
          Display Large
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'headlineMedium' }}>
          Headline Medium
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'bodySmall' }}>
          Body Small
        </Text>
        <Text
          color={colors.onBackground}
          style={{ typography: 'labelLarge' }}>
          Label Large
        </Text>
      </Column>
    </Host>
  );
}
```

### 限制行数与溢出

用 `maxLines` 和 `overflow` 控制文本截断。

![段落被裁成两行，末尾为省略号](/static/images/expo-ui/examples/composetext-overflow-android-light.webp)

```tsx TextOverflowExample.tsx
import {
  Host,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { width } from '@expo/ui/jetpack-compose/modifiers';

export default function TextOverflowExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Text
        color={colors.onBackground}
        maxLines={2}
        overflow="ellipsis"
        modifiers={[width(200)]}>
        This is a long paragraph of text that will be truncated
        after two lines with an ellipsis at the end to indicate
        there is more content.
      </Text>
    </Host>
  );
}
```

### 带样式的文本

应用自定义文本样式，包括字重、样式、字号和装饰。

![五行分别展示粗体、斜体、下划线、字距和粉色居中文本](/static/images/expo-ui/examples/composetext-styled-android-light.webp)

```tsx StyledTextExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function StyledTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold', fontSize: 20 }}>
          Bold text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontStyle: 'italic' }}>
          Italic text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ textDecoration: 'underline' }}>
          Underlined text
        </Text>
        <Text
          color={colors.onBackground}
          style={{ letterSpacing: 4 }}>
          Spaced out text
        </Text>
        <Text
          color="#E91E63"
          style={{ fontSize: 18, textAlign: 'center' }}>
          Colored and centered
        </Text>
      </Column>
    </Host>
  );
}
```

### 嵌套文本

嵌套 `<Text>` 组件，对句子的一部分应用行内样式。子区间会继承父级样式。例如，粗体父级中的斜体子级会渲染为粗斜体。

![四句话带行内区间：斜体、粗体、下划线、蓝色和黄色高亮](/static/images/expo-ui/examples/composetext-nested-android-light.webp)

```tsx NestedTextExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function NestedTextExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>

        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold' }}>
          Hello <Text style={{ fontStyle: 'italic' }}>world</Text>!
        </Text>

        <Text color={colors.onBackground} style={{ fontSize: 16 }}>
          Normal,{' '}
          <Text style={{ fontStyle: 'italic' }}>italic</Text>,{' '}
          <Text style={{ fontWeight: 'bold' }}>bold</Text>, and{' '}
          <Text style={{ textDecoration: 'underline' }}>
            underlined
          </Text>
        </Text>

        <Text color={colors.onBackground} style={{ fontSize: 18 }}>
          Click{' '}
          <Text color="#007AFF" style={{ fontWeight: 'bold' }}>
            here
          </Text>{' '}
          or{' '}
          <Text style={{ background: '#FFEB3B' }}>highlighted</Text>
        </Text>

        <Text
          color={colors.onBackground}
          style={{ fontWeight: 'bold' }}>
          Bold{' '}
          <Text style={{ fontStyle: 'italic' }}>
            bold+italic{' '}
            <Text style={{ textDecoration: 'underline' }}>
              bold+italic+underline
            </Text>
          </Text>
        </Text>
      </Column>
    </Host>
  );
}
```

### 自定义字体

通过 [`expo-font`](/versions/latest/sdk/font) 加载字体后，把字体族名称传给 `style.fontFamily`。

![三行分别用系统衬线、系统等宽和 Inter Bold 字体渲染](/static/images/expo-ui/examples/composetext-font-android-light.webp)

```tsx CustomFontExample.tsx
import {
  Host,
  Text,
  Column,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function CustomFontExample() {
  const colors = useMaterialColors();

  return (
    <Host matchContents>
      <Column modifiers={[paddingAll(16)]}>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'serif', fontSize: 16 }}>
          System serif font
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'monospace', fontSize: 16 }}>
          System monospace font
        </Text>
        <Text
          color={colors.onBackground}
          style={{ fontFamily: 'Inter-Bold', fontSize: 16 }}>
          Custom Inter Bold font
        </Text>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Text } from '@expo/ui/jetpack-compose';
```
