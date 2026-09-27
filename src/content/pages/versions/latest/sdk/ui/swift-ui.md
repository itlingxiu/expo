---
title: SwiftUI 组件参考
description: 用于通过 @expo/ui 构建原生 iOS 界面的 SwiftUI 组件。
---

# SwiftUI 组件参考

> 支持平台：iOS、tvOS、Expo Go。

`@expo/ui/swift-ui` 中的 SwiftUI 组件允许你从 React Native 中使用 SwiftUI 构建完全原生的 iOS 界面。

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

Expo UI 提供了多个 SwiftUI 组件。你可以从 `@expo/ui/swift-ui` 导入它们并在应用中使用。但是，要从 React Native（UIKit）跨越到 SwiftUI，你需要使用 [`Host`](/versions/latest/sdk/ui/swift-ui/host) 组件。[`Host`](/versions/latest/sdk/ui/swift-ui/host) 是 SwiftUI 视图的容器。你可以把它想象成 DOM 中的 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg) 或 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 中的 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/)。在底层，它使用 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) 在 UIKit 中渲染 SwiftUI 视图。

```tsx
import { Host, Button } from '@expo/ui/swift-ui';

export function SaveButton() {
  return (
    <Host style={{ flex: 1 }}>
      <Button label="Save changes" />
    </Host>
  );
}
```

[**使用 SwiftUI 扩展**](/versions/latest/sdk/ui/swift-ui/extending)：创建与 Expo UI 集成的自定义 SwiftUI 组件和修改器。

> 视频教程：[Expo UI iOS Liquid Glass 教程](https://www.youtube.com/watch?v=2wXYLWz3YEQ)：了解如何使用全新的 Expo UI 在 React Native 应用中构建真正的 SwiftUI 视图。

## 可用组件

以下组件均可从 `@expo/ui/swift-ui` 导入：

- [AccessoryWidgetBackground](/versions/latest/sdk/ui/swift-ui/accessorywidgetbackground)
- [Alert](/versions/latest/sdk/ui/swift-ui/alert)
- [BottomSheet](/versions/latest/sdk/ui/swift-ui/bottomsheet)
- [Button](/versions/latest/sdk/ui/swift-ui/button)
- [ColorPicker](/versions/latest/sdk/ui/swift-ui/colorpicker)
- [ConfirmationDialog](/versions/latest/sdk/ui/swift-ui/confirmationdialog)
- [ContextMenu](/versions/latest/sdk/ui/swift-ui/contextmenu)
- [ControlGroup](/versions/latest/sdk/ui/swift-ui/controlgroup)
- [DatePicker](/versions/latest/sdk/ui/swift-ui/datepicker)
- [DisclosureGroup](/versions/latest/sdk/ui/swift-ui/disclosuregroup)
- [Divider](/versions/latest/sdk/ui/swift-ui/divider)
- [Form](/versions/latest/sdk/ui/swift-ui/form)
- [Gauge](/versions/latest/sdk/ui/swift-ui/gauge)
- [Group](/versions/latest/sdk/ui/swift-ui/group)
- [Host](/versions/latest/sdk/ui/swift-ui/host)
- [HStack](/versions/latest/sdk/ui/swift-ui/hstack)
- [Image](/versions/latest/sdk/ui/swift-ui/image)
- [Label](/versions/latest/sdk/ui/swift-ui/label)
- [LazyHStack](/versions/latest/sdk/ui/swift-ui/lazyhstack)
- [LazyVStack](/versions/latest/sdk/ui/swift-ui/lazyvstack)
- [Link](/versions/latest/sdk/ui/swift-ui/link)
- [List](/versions/latest/sdk/ui/swift-ui/list)
- [Menu](/versions/latest/sdk/ui/swift-ui/menu)
- [Modifiers](/versions/latest/sdk/ui/swift-ui/modifiers)
- [Namespace](/versions/latest/sdk/ui/swift-ui/namespace)
- [Overlay](/versions/latest/sdk/ui/swift-ui/overlay)
- [Picker](/versions/latest/sdk/ui/swift-ui/picker)
- [Popover](/versions/latest/sdk/ui/swift-ui/popover)
- [ProgressView](/versions/latest/sdk/ui/swift-ui/progressview)
- [RNHostView](/versions/latest/sdk/ui/swift-ui/rnhostview)
- [ScrollView](/versions/latest/sdk/ui/swift-ui/scrollview)
- [Section](/versions/latest/sdk/ui/swift-ui/section)
- [SecureField](/versions/latest/sdk/ui/swift-ui/securefield)
- [Slider](/versions/latest/sdk/ui/swift-ui/slider)
- [Spacer](/versions/latest/sdk/ui/swift-ui/spacer)
- [SwipeActions](/versions/latest/sdk/ui/swift-ui/swipeactions)
- [TabView](/versions/latest/sdk/ui/swift-ui/tabview)
- [Text](/versions/latest/sdk/ui/swift-ui/text)
- [TextField](/versions/latest/sdk/ui/swift-ui/textfield)
- [Toggle](/versions/latest/sdk/ui/swift-ui/toggle)
- [UseNativeState](/versions/latest/sdk/ui/swift-ui/usenativestate)
- [VStack](/versions/latest/sdk/ui/swift-ui/vstack)
- [ZStack](/versions/latest/sdk/ui/swift-ui/zstack)

## 示例

### 修改器

[SwiftUI 修改器](<https://developer.apple.com/documentation/swiftui/view/modifier(_:)>)用于自定义 SwiftUI 组件的外观和行为。Expo UI 也为 SwiftUI 组件提供了修改器。你可以从 `@expo/ui/swift-ui/modifiers` 导入修改器，并将它们作为数组传给 `modifiers` 属性。在下面的示例中，[`expo-mesh-gradient`](/versions/latest/sdk/mesh-gradient) 与 `glassEffect` 修改器结合使用，创建出 Liquid Glass 文字效果。

:::note
`glassEffect` 修改器需要 Xcode 26+ 和 iOS 26+。
:::

![大号玻璃效果文字位于半透明胶囊中，背景是彩虹网格渐变](/static/images/expo-ui/examples/swift-ui-index-glass-effect-ios-light.webp)

```tsx GlassEffectExample.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import {
  font,
  glassEffect,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { MeshGradientView } from 'expo-mesh-gradient';
import { View } from 'react-native';

export default function GlassEffectExample() {
  return (
    <View style={{ flex: 1 }}>
      <MeshGradientView
        style={{ flex: 1 }}
        columns={3}
        rows={3}
        colors={[
          'red',
          'purple',
          'indigo',
          'orange',
          'white',
          'blue',
          'yellow',
          'green',
          'cyan',
        ]}
        points={[
          [0.0, 0.0],
          [0.5, 0.0],
          [1.0, 0.0],
          [0.0, 0.5],
          [0.5, 0.5],
          [1.0, 0.5],
          [0.0, 1.0],
          [0.5, 1.0],
          [1.0, 1.0],
        ]}
      />
      <Host
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}>
        <Text
          modifiers={[
            font({ size: 32 }),
            padding({
              all: 16,
            }),
            glassEffect({
              glass: {
                variant: 'clear',
              },
            }),
          ]}>
          Glass effect text
        </Text>
      </Host>
    </View>
  );
}
```

### iOS 设置应用

结合使用 Expo UI 的组件和修改器，你可以构建出类似 iOS 设置应用的界面。

![一个带绿色开关的飞行模式行，其下方是带展开箭头的 Wi-Fi 行](/static/images/expo-ui/examples/swift-ui-index-settings-form-ios-light.webp)

```tsx SettingsFormExample.tsx
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Toggle,
  Text,
} from '@expo/ui/swift-ui';
import {
  background,
  buttonStyle,
  foregroundStyle,
  clipShape,
  frame,
} from '@expo/ui/swift-ui/modifiers';
import { Link } from 'expo-router';
import { useState } from 'react';

export default function SettingsFormExample() {
  const [isAirplaneMode, setIsAirplaneMode] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <HStack spacing={8}>
            <Image
              systemName="airplane"
              color="white"
              size={18}
              modifiers={[
                frame({ width: 28, height: 28 }),
                background('#ffa500'),
                clipShape('roundedRectangle'),
              ]}
            />
            <Text>Airplane Mode</Text>
            <Spacer />
            <Toggle
              isOn={isAirplaneMode}
              onIsOnChange={setIsAirplaneMode}
            />
          </HStack>

          <Link href="/wifi" asChild>
            {/* 使用 buttonStyle('plain') 防止默认的蓝色按钮样式 */}
            <Button modifiers={[buttonStyle('plain')]}>
              <HStack spacing={8}>
                <Image
                  systemName="wifi"
                  color="white"
                  size={18}
                  modifiers={[
                    frame({ width: 28, height: 28 }),
                    background('#007aff'),
                    clipShape('roundedRectangle'),
                  ]}
                />
                {/* Link 中的 Text 需要显式指定颜色。层级样式可以自动适配浅色与深色模式。 */}
                <Text
                  modifiers={[
                    foregroundStyle({
                      type: 'color',
                      color: 'primary',
                    }),
                  ]}>
                  Wi-Fi
                </Text>
                <Spacer />
                <Image
                  systemName="chevron.right"
                  size={14}
                  color="secondary"
                />
              </HStack>
            </Button>
          </Link>
        </Section>
      </Form>
    </Host>
  );
}
```

### 次级文本样式

使用 `foregroundStyle` 应用[层级样式](/versions/latest/sdk/ui/swift-ui/modifiers#foregroundstylestyle)，让文本看起来更浅、更柔和。

![一个夜览行，其时间表以较浅的次级文本显示，下方是一段次级样式的页脚段落](/static/images/expo-ui/examples/swift-ui-index-secondary-text-ios-light.webp)

```tsx SecondaryTextExample.tsx
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  font,
  foregroundStyle,
  padding,
} from '@expo/ui/swift-ui/modifiers';

export default function SecondaryTextExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <List>
            <Button
              onPress={() => console.log('Navigate')}
              modifiers={[buttonStyle('plain')]}>
              <HStack>
                <Text>Night Shift</Text>
                <Spacer />
                <Text
                  modifiers={[
                    foregroundStyle({
                      type: 'hierarchical',
                      style: 'secondary',
                    }),
                    padding({ trailing: 8 }),
                  ]}>
                  22:00 to 07:00
                </Text>
                <Image
                  systemName="chevron.right"
                  size={14}
                  color="#C7C7CC"
                />
              </HStack>
            </Button>
          </List>
          <List>
            <Text
              modifiers={[
                foregroundStyle({
                  type: 'hierarchical',
                  style: 'secondary',
                }),
                font({ size: 14 }),
              ]}>
              Save up to 280.7 MB. This will permanently delete all
              photos and videos kept in the "Recently Deleted"
              album.
            </Text>
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```

### 带图标的滑块

亮度或音量控件的一种常见模式是在 `Slider` 两侧放置图标。

![一个亮度滑块，两侧分别排列着小号和大号太阳图标，其上方是一个原彩显示开关](/static/images/expo-ui/examples/swift-ui-index-slider-with-icons-ios-light.webp)

```tsx SliderWithIconsExample.tsx
import { useState } from 'react';
import {
  Form,
  Host,
  HStack,
  Image,
  List,
  Section,
  Slider,
  Spacer,
  Text,
  Toggle,
} from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';

export default function SliderWithIconsExample() {
  const [brightness, setBrightness] = useState(0.5);
  const [trueToneEnabled, setTrueToneEnabled] = useState(true);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section
          header={<Text>Brightness</Text>}
          footer={
            <Text>
              Automatically adapt iPhone display based on ambient
              lighting conditions to make colors appear consistent
              in different environments.
            </Text>
          }>
          <List>
            <HStack modifiers={[padding({ vertical: 6 })]}>
              <Image
                systemName="sun.min.fill"
                size={22}
                color="#8E8E93"
              />
              <Spacer />
              <Slider
                value={brightness}
                onValueChange={setBrightness}
              />
              <Spacer />
              <Image
                systemName="sun.max.fill"
                size={22}
                color="#8E8E93"
              />
            </HStack>
            <Toggle
              label="True Tone"
              isOn={trueToneEnabled}
              onIsOnChange={setTrueToneEnabled}
            />
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```

### 多行列表项

对于带标题和副标题的列表项，使用 `alignment="leading"` 的 `VStack`。

![一个 Chrome 行，副标题为"上次使用：今天"，右侧显示 1.57 GB](/static/images/expo-ui/examples/swift-ui-index-multi-line-list-ios-light.webp)

```tsx MultiLineListItemExample.tsx
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  font,
  foregroundStyle,
  padding,
} from '@expo/ui/swift-ui/modifiers';

export default function MultiLineListItemExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <List>
            <HStack>
              <Image
                systemName="safari"
                size={22}
                modifiers={[padding({ trailing: 6 })]}
              />
              <Spacer />
              <Button
                onPress={() => console.log('Navigate')}
                modifiers={[
                  buttonStyle('plain'),
                  padding({ vertical: 6 }),
                ]}>
                <VStack spacing={4} alignment="leading">
                  <Text>Chrome</Text>
                  <Text
                    modifiers={[
                      foregroundStyle({
                        type: 'hierarchical',
                        style: 'secondary',
                      }),
                      font({ size: 14 }),
                    ]}>
                    Last used: Today
                  </Text>
                </VStack>
                <Spacer />
                <Text
                  modifiers={[
                    foregroundStyle({
                      type: 'hierarchical',
                      style: 'secondary',
                    }),
                    font({ size: 16 }),
                  ]}>
                  1.57 GB
                </Text>
                <Image
                  systemName="chevron.right"
                  size={14}
                  color="#C7C7CC"
                />
              </Button>
            </HStack>
          </List>
        </Section>
      </Form>
    </Host>
  );
}
```
