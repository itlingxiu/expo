---
title: BottomSheet 组件参考
description: 从屏幕底部呈现内容的 SwiftUI BottomSheet 组件。
---

# BottomSheet 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`BottomSheet`](/versions/latest/sdk/ui/universal/bottomsheet)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 BottomSheet 与官方 SwiftUI [sheet API](https://developer.apple.com/documentation/swiftui/view/sheet(ispresented:ondismiss:content:)) 保持一致，从屏幕底部呈现内容。

![中等档位的 BottomSheet，显示 Sort By 列表且 Most Recent 被选中](/static/images/expo-ui/bottomsheet/ios-light.webp)

:::note
在 iOS 上，要在一个底部工作表之上再显示另一个，请把第二个 `BottomSheet` 嵌套在第一个工作表的内容里，而不是并排放置。这是底层 SwiftUI [`sheet`](https://developer.apple.com/documentation/swiftui/view/sheet(ispresented:ondismiss:content:)) 修饰符的限制。更多信息见[如何呈现多个工作表](https://www.hackingwithswift.com/quick-start/swiftui/how-to-present-multiple-sheets)。
:::

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

### 基本底部工作表

把打开工作表的控件作为 `anchor` 属性传入。子元素是工作表的内容。

![填满屏幕、居中显示 Hello, world! 的底部工作表](/static/images/expo-ui/examples/bottomsheet-basic-ios-light.webp)

```tsx BasicBottomSheetExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Text,
  VStack,
} from '@expo/ui/swift-ui';

export default function BasicBottomSheetExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Text>Hello, world!</Text>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 用 React Native 视图作为锚点

锚点可以是 React Native 视图。把它包在 [`RNHostView`](/versions/latest/sdk/ui/swift-ui/rnhostview) 中。

![蓝色 React Native 按钮上方是按内容尺寸的底部工作表](/static/images/expo-ui/examples/bottomsheet-rn-anchor-ios-light.webp)

```tsx BottomSheetRNAnchorExample.tsx
import { useState } from 'react';
import { Pressable, Text as RNText } from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  RNHostView,
  Text,
  VStack,
} from '@expo/ui/swift-ui';

export default function BottomSheetRNAnchorExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          fitToContents
          anchor={
            <RNHostView matchContents>
              <Pressable
                onPress={() => setIsPresented(true)}
                style={{
                  backgroundColor: '#007AFF',
                  padding: 12,
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <RNText
                  style={{ color: 'white', fontWeight: '600' }}>
                  Open sheet
                </RNText>
              </Pressable>
            </RNHostView>
          }>
          <VStack>
            <Text>Opened from a React Native anchor.</Text>
            <Button
              label="Close"
              onPress={() => setIsPresented(false)}
            />
          </VStack>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 适配内容的底部工作表

使用 [`fitToContents`](#fittocontents) 属性让工作表自动按内容调整大小。

![按一行文本和一个 Close 按钮调整大小的底部工作表](/static/images/expo-ui/examples/bottomsheet-fits-content-ios-light.webp)

```tsx BottomSheetFitsContentExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Text,
  VStack,
} from '@expo/ui/swift-ui';

export default function BottomSheetFitsContentExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          fitToContents
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <VStack>
            <Text>
              This sheet automatically sizes to fit its content.
            </Text>
            <Button
              label="Close"
              onPress={() => setIsPresented(false)}
            />
          </VStack>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 自定义背景

默认情况下，工作表使用系统的半透明材质背景（iOS 26 上为 Liquid Glass）。在 `Group` 上使用 [`presentationBackground`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符自行绘制工作表，这也会让工作表退出那种半透明材质。它接受任何 `ShapeStyle`：纯色、材质或渐变。

:::note
iOS 26 会把材质（例如 `{ type: 'material', material: 'ultraThin' }`）渲染为纯色，而不是半透明模糊。请选择在不透明时也清晰可读的背景。
:::

:::note
优先使用 `presentationBackground`，而不是在工作表内容上使用 `background` 修饰符。`background` 位于内容自身背景的后面，因此 `Form` 或 `List` 会盖住它，工作表在档位之间移动时颜色显示也不一致。`presentationBackground` 着色的是工作表表面本身，因此在每个档位都保持一致。内容是 `Form` 或 `List` 时，还要加上 [`scrollContentBackground('hidden')`](/versions/latest/sdk/ui/swift-ui/modifiers)，让工作表颜色透过分组背景显示出来。
:::

![中等档位、纯白背景的底部工作表](/static/images/expo-ui/examples/bottomsheet-background-color-ios-light.webp)

```tsx BottomSheetBackgroundColorExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  presentationBackground,
  presentationDetents,
  padding,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetBackgroundColorExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents(['medium', 'large']),
              presentationBackground('#ffffff'),
            ]}>
            <VStack modifiers={[padding({ all: 20 })]}>
              <Text modifiers={[foregroundStyle('#000000')]}>
                Solid white sheet background.
              </Text>
              <Button
                label="Close"
                onPress={() => setIsPresented(false)}
              />
            </VStack>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 带呈现档位的底部工作表

在 `Group` 上使用 [`presentationDetents`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符控制可用高度。可以使用：

- `'medium'`：系统中等高度（大约半屏）
- `'large'`：系统大高度（全屏）
- `{ fraction: number }`：屏幕高度的比例（0–1）
- `{ height: number }`：以点为单位的固定高度

![中等档位的底部工作表，文本说明可以吸附到多种高度](/static/images/expo-ui/examples/bottomsheet-detents-ios-light.webp)

```tsx BottomSheetWithDetentsExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { presentationDetents } from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithDetentsExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents([
                'medium',
                'large',
                { fraction: 0.3 },
                { height: 200 },
              ]),
            ]}>
            <Text>This sheet can snap to multiple heights.</Text>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 跟踪档位选择的底部工作表

向 [`presentationDetents`](/versions/latest/sdk/ui/swift-ui/modifiers) 传入 `selection` 和 `onSelectionChange` 选项，以编程方式控制工作表吸附到哪个档位。

![底部工作表列出档位选项，当前档位显示为 medium](/static/images/expo-ui/examples/bottomsheet-detent-selection-ios-light.webp)

```tsx BottomSheetWithDetentSelectionExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  List,
  Section,
  Text,
  VStack,
  Group,
} from '@expo/ui/swift-ui';
import {
  presentationDetents,
  presentationDragIndicator,
  foregroundStyle,
} from '@expo/ui/swift-ui/modifiers';
import type { PresentationDetent } from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithDetentSelectionExample() {
  const [isPresented, setIsPresented] = useState(false);
  const detents: PresentationDetent[] = [
    { height: 300 },
    { fraction: 0.3 },
    'medium',
    'large',
  ];
  const [selectedDetent, setSelectedDetent] =
    useState<PresentationDetent>('medium');

  const formatDetent = (detent: PresentationDetent): string => {
    if (typeof detent === 'string') return detent;
    if ('fraction' in detent) return `Fraction ${detent.fraction}`;
    return `Height ${detent.height}`;
  };

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Show sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents(detents, {
                selection: selectedDetent,
                onSelectionChange: setSelectedDetent,
              }),
              presentationDragIndicator('visible'),
            ]}>
            <List>
              <Section title="Change detent">
                <Button
                  label="Height 300"
                  onPress={() => setSelectedDetent({ height: 300 })}
                />
                <Button
                  label="Fraction 0.3"
                  onPress={() =>
                    setSelectedDetent({ fraction: 0.3 })
                  }
                />
                <Button
                  label="Medium"
                  onPress={() => setSelectedDetent('medium')}
                />
                <Button
                  label="Large"
                  onPress={() => setSelectedDetent('large')}
                />
              </Section>
              <Section title="Current">
                <Text
                  modifiers={[foregroundStyle('secondaryLabel')]}>
                  {formatDetent(selectedDetent)}
                </Text>
              </Section>
            </List>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 可与背景交互的底部工作表

使用 [`presentationBackgroundInteraction`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，允许与工作表后面的内容交互。

![中等档位的底部工作表叠在未变暗的背景上](/static/images/expo-ui/examples/bottomsheet-background-interaction-ios-light.webp)

```tsx BottomSheetWithBackgroundInteractionExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import {
  presentationDetents,
  presentationBackgroundInteraction,
} from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithBackgroundInteractionExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents(['medium', 'large']),
              presentationBackgroundInteraction({
                type: 'enabledUpThrough',
                detent: 'medium',
              }),
            ]}>
            <Text>
              Interact with content behind when at medium height.
            </Text>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 不可滑动关闭的底部工作表

使用 [`interactiveDismissDisabled`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符，阻止用户通过滑动关闭工作表。

![全高底部工作表，含文本和一个 Close 按钮](/static/images/expo-ui/examples/bottomsheet-non-dismissible-ios-light.webp)

```tsx NonDismissibleBottomSheetExample.tsx
import { useState } from 'react';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  Text,
  VStack,
} from '@expo/ui/swift-ui';
import { interactiveDismissDisabled } from '@expo/ui/swift-ui/modifiers';

export default function NonDismissibleBottomSheetExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group modifiers={[interactiveDismissDisabled()]}>
            <VStack>
              <Text>
                This sheet cannot be dismissed by swiping.
              </Text>
              <Button
                label="Close"
                onPress={() => setIsPresented(false)}
              />
            </VStack>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 包含 React Native 内容的底部工作表

使用 `RNHostView` 在底部工作表中嵌入 React Native 组件。设置 `matchContents` 让宿主视图自动按内容调整大小。

![底部工作表包含 React Native 文本、计数器以及 Increment 和 Close 按钮](/static/images/expo-ui/examples/bottomsheet-rn-content-ios-light.webp)

```tsx BottomSheetWithRNContentExample.tsx
import { useState } from 'react';
import {
  PlatformColor,
  Pressable,
  Text as RNText,
  View,
} from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  RNHostView,
  VStack,
} from '@expo/ui/swift-ui';
import { presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithRNContentExample() {
  const [isPresented, setIsPresented] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          fitToContents
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group modifiers={[presentationDragIndicator('visible')]}>
            <RNHostView matchContents>
              <View style={{ padding: 24 }}>
                <RNText
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: PlatformColor('label'),
                  }}>
                  React Native Content
                </RNText>
                <RNText style={{ color: '#666', marginBottom: 16 }}>
                  Counter: {counter}
                </RNText>
                <Pressable
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                  onPress={() => setCounter(counter + 1)}>
                  <RNText
                    style={{ color: 'white', fontWeight: '600' }}>
                    Increment
                  </RNText>
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: '#FF3B30',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={() => setIsPresented(false)}>
                  <RNText
                    style={{ color: 'white', fontWeight: '600' }}>
                    Close
                  </RNText>
                </Pressable>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 包含弹性 React Native 内容的底部工作表

React Native 内容使用 `flex: 1` 时，省略 `RNHostView` 上的 `matchContents` 属性，并用 [`presentationDetents`](/versions/latest/sdk/ui/swift-ui/modifiers) 控制工作表高度。

![中等档位被蓝色 React Native 视图填满的底部工作表](/static/images/expo-ui/examples/bottomsheet-flex-rn-content-ios-light.webp)

```tsx BottomSheetWithFlexRNContentExample.tsx
import { useState } from 'react';
import { Text as RNText, View } from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  RNHostView,
  VStack,
} from '@expo/ui/swift-ui';
import {
  presentationDetents,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithFlexRNContentExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents(['medium', 'large']),
              presentationDragIndicator('visible'),
            ]}>
            <RNHostView>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#007AFF',
                  padding: 24,
                }}>
                <RNText
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Flexible React Native Content
                </RNText>
                <RNText style={{ color: 'white', marginTop: 8 }}>
                  This content fills the available space in the
                  sheet.
                </RNText>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

### 可滚动的 React Native 内容

用 `RNHostView` 在工作表中嵌套可滚动的 React Native 列表，例如 `FlatList`、`ScrollView`，或 [FlashList](https://shopify.github.io/flash-list)、[Legend List](https://github.com/LegendApp/legend-list) 这类高性能列表。用 [`presentationDetents`](/versions/latest/sdk/ui/swift-ui/modifiers) 设定工作表尺寸，列表在该高度内滚动。

![中等档位的底部工作表列出 Item 1 到 Item 8](/static/images/expo-ui/examples/bottomsheet-scrollable-content-ios-light.webp)

```tsx BottomSheetWithScrollableContentExample.tsx
import { useState } from 'react';
import {
  FlatList,
  PlatformColor,
  Text as RNText,
  View,
} from 'react-native';
import {
  Host,
  BottomSheet,
  Button,
  Group,
  RNHostView,
  VStack,
} from '@expo/ui/swift-ui';
import {
  presentationDetents,
  presentationDragIndicator,
} from '@expo/ui/swift-ui/modifiers';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default function BottomSheetWithScrollableContentExample() {
  const [isPresented, setIsPresented] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <VStack>
        <BottomSheet
          isPresented={isPresented}
          onIsPresentedChange={setIsPresented}
          anchor={
            <Button
              label="Open sheet"
              onPress={() => setIsPresented(true)}
            />
          }>
          <Group
            modifiers={[
              presentationDetents(['medium', 'large']),
              presentationDragIndicator('visible'),
            ]}>
            <RNHostView>
              <View style={{ padding: 16 }}>
                <FlatList
                  data={DATA}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <RNText
                      style={{
                        paddingVertical: 16,
                        color: PlatformColor('label'),
                      }}>
                      {item}
                    </RNText>
                  )}
                />
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </VStack>
    </Host>
  );
}
```

## API

```tsx
import { BottomSheet } from '@expo/ui/swift-ui';
```
