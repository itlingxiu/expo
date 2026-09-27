---
title: ModalBottomSheet 组件参考
description: 从屏幕底部呈现内容的 Jetpack Compose ModalBottomSheet 组件。
---

# ModalBottomSheet 组件参考

> 支持平台：Android、Expo Go。

:::note
跨平台用法请参阅通用 [`BottomSheet`](/versions/latest/sdk/ui/universal/bottomsheet)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 ModalBottomSheet 与官方 Jetpack Compose [Bottom Sheet API](https://developer.android.com/develop/ui/compose/components/bottom-sheets) 保持一致，在从底部滑出的模态工作表中显示内容。

![带标题、说明和操作按钮的模态底部工作表](/static/images/expo-ui/bottomsheet/android-light.webp)

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

使用 `ref.hide()` 在卸载工作表之前以动画方式以编程关闭它。

![停在部分高度的底部工作表，含两行文本和一个 Close 按钮](/static/images/expo-ui/examples/composesheet-basic-android-light.webp)

```tsx BasicBottomSheetExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function BasicBottomSheetExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}>
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}>
            <Text>Hello from bottom sheet!</Text>
            <Text>You can add more content here.</Text>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 跳过部分展开状态

设置 `skipPartiallyExpanded` 后，工作表会直接以完全展开状态打开，而不会先停在半高位置。

![直接打开到完全展开高度的底部工作表](/static/images/expo-ui/examples/composesheet-skip-partial-android-light.webp)

```tsx SkipPartiallyExpandedExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import {
  paddingAll,
  height,
} from '@expo/ui/jetpack-compose/modifiers';

export default function SkipPartiallyExpandedExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          skipPartiallyExpanded>
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24), height(600)]}>
            <Text>
              This sheet skips the partially expanded state.
            </Text>
            <Text>
              It opens directly in the fully expanded position.
            </Text>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 初始完全展开状态

当 `initialFullyExpanded` 为 `true` 时，工作表在首次组合时直接以完全展开状态打开，同时部分展开状态仍然可达。与 `skipPartiallyExpanded` 不同，用户仍可向下拖到部分展开状态。`partialExpand()` 方法也继续有效。

![完全展开的底部工作表，带 Collapse to partial 和 Close 按钮](/static/images/expo-ui/examples/composesheet-initial-expanded-android-light.webp)

```tsx InitialFullyExpandedExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function InitialFullyExpandedExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          initialFullyExpanded>
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}>
            <Text>This sheet opened fully expanded.</Text>
            <Text>
              You can still drag it down to the partial state.
            </Text>
            <Button
              onClick={() => sheetRef.current?.partialExpand()}>
              <Text>Collapse to partial</Text>
            </Button>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 自定义颜色

使用 `containerColor`、`contentColor` 和 `scrimColor` 自定义工作表外观。

![紫色遮罩后的深色底部工作表](/static/images/expo-ui/examples/composesheet-custom-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function CustomColorsExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open colored sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          containerColor="#1a1a2e"
          contentColor="#e0e0e0"
          scrimColor="#6200EE80">
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}>
            <Text>Custom styled bottom sheet.</Text>
            <Text>Dark container with a purple scrim overlay.</Text>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 自定义拖动手柄

使用 `ModalBottomSheet.DragHandle` 插槽提供自定义拖动手柄，或设置 `showDragHandle={false}` 将其完全隐藏。

![底部工作表用宽紫色拖动手柄替换默认手柄](/static/images/expo-ui/examples/composesheet-drag-handle-android-light.webp)

```tsx CustomDragHandleExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Box,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxWidth,
  height,
  padding,
  Shapes,
  width,
} from '@expo/ui/jetpack-compose/modifiers';

export default function CustomDragHandleExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open custom handle sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}>
          <ModalBottomSheet.DragHandle>
            <Column
              horizontalAlignment="center"
              modifiers={[fillMaxWidth(), padding(0, 12, 0, 8)]}>
              <Box
                modifiers={[
                  width(60),
                  height(6),
                  clip(Shapes.Circle),
                  background('#6200EE'),
                ]}
              />
            </Column>
          </ModalBottomSheet.DragHandle>
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[padding(16, 16, 16, 16)]}>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 底部工作表中的 React Native 内容

使用 `RNHostView` 在 Compose 底部工作表中嵌入可交互的 React Native 视图。这样可以把 Compose 布局与 `Pressable`、`Text` 等 RN 组件混合使用。

![底部工作表混合了 Compose 标签、React Native 标题和蓝色 Close 按钮](/static/images/expo-ui/examples/composesheet-rn-content-android-light.webp)

```tsx RNContentBottomSheetExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  RNHostView,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { padding } from '@expo/ui/jetpack-compose/modifiers';
import { Pressable, Text as RNText, View } from 'react-native';

export default function RNContentBottomSheetExample() {
  const colors = useMaterialColors();
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open RN content sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          skipPartiallyExpanded={false}>
          <Column
            verticalArrangement={{ spacedBy: 16 }}
            modifiers={[padding(16, 16, 16, 16)]}>
            <Text>Mixing Compose + RN in a Bottom Sheet</Text>
            <RNHostView>
              <View>
                <RNText
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    color: colors.onSurface,
                  }}>
                  React Native Content
                </RNText>
                <Pressable
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={hideSheet}>
                  <RNText
                    style={{ color: 'white', fontWeight: '600' }}>
                    Close
                  </RNText>
                </Pressable>
              </View>
            </RNHostView>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 使用 flex 的 React Native 内容

不使用 `matchContents` 的 `RNHostView` 可让 RN 视图填满工作表内的剩余空间。在父级 `Column` 上配合固定的 `height` 修饰符以控制工作表尺寸。

![底部工作表被延伸到工作表高度的紫色 React Native 视图填满](/static/images/expo-ui/examples/composesheet-flex-rn-android-light.webp)

```tsx FlexRNContentExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  RNHostView,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import {
  height,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';
import { Text as RNText, View } from 'react-native';

export default function FlexRNContentExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open flex content sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          skipPartiallyExpanded>
          <Column
            modifiers={[height(400), padding(16, 16, 16, 16)]}>
            <Text>RN View with flex: 1</Text>
            <RNHostView>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#9B59B6',
                  borderRadius: 10,
                }}>
                <RNText
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                    padding: 16,
                  }}>
                  React Native Content (flex: 1)
                </RNText>
              </View>
            </RNHostView>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 可滚动的 React Native 内容

用 `RNHostView` 在工作表中嵌套可滚动的 React Native 列表，例如 `FlatList`、`ScrollView`，或 [FlashList](https://shopify.github.io/flash-list)、[Legend List](https://github.com/LegendApp/legend-list) 这类高性能列表。在可滚动组件上设置 `nestedScrollEnabled`，使其先滚动自身内容。到达顶部边缘后，剩余的拖动手势会移动工作表。没有 `nestedScrollEnabled` 时，列表会消耗手势，工作表保持不动。

![底部工作表中是可滚动的 React Native 项目列表](/static/images/expo-ui/examples/composesheet-scrollable-android-light.webp)

```tsx ScrollableContentBottomSheetExample.tsx
import { useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  RNHostView,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  fillMaxHeight,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';
import { FlatList, Text as RNText } from 'react-native';

const DATA = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

export default function ScrollableContentBottomSheetExample() {
  const colors = useMaterialColors();
  const [visible, setVisible] = useState(false);

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open scrollable sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          onDismissRequest={() => setVisible(false)}>
          <Column
            modifiers={[fillMaxHeight(), padding(16, 16, 16, 16)]}>
            <RNHostView>
              <FlatList
                nestedScrollEnabled
                style={{ flex: 1 }}
                data={DATA}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <RNText
                    style={{
                      paddingVertical: 16,
                      color: colors.onSurface,
                    }}>
                    {item}
                  </RNText>
                )}
              />
            </RNHostView>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

### 不可关闭的工作表

组合 `properties` 和 `sheetGesturesEnabled`，创建只能以编程方式关闭的工作表。

![只能通过自身 Close 按钮关闭的底部工作表](/static/images/expo-ui/examples/composesheet-non-dismissible-android-light.webp)

```tsx NonDismissibleExample.tsx
import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export default function NonDismissibleExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open Non-Dismissible Sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
          sheetGesturesEnabled={false}
          properties={{
            shouldDismissOnBackPress: false,
            shouldDismissOnClickOutside: false,
          }}>
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}>
            <Text>
              This sheet cannot be dismissed by swiping, back press,
              or tapping outside.
            </Text>
            <Text>Only the button below will close it.</Text>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
```

## API

```tsx
import { ModalBottomSheet } from '@expo/ui/jetpack-compose';
```
