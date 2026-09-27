---
title: ModalBottomSheet 组件参考
description: A Jetpack Compose ModalBottomSheet component that presents content from the bottom of the screen.
---

# ModalBottomSheet 组件参考

> 支持平台：Android、Expo Go。

> **info** For cross-platform usage, see the universal [`BottomSheet`](/versions/latest/sdk/ui/universal/bottomsheet) — it renders the appropriate native component per platform.

Expo UI ModalBottomSheet matches the official Jetpack Compose [Bottom Sheet API](https://developer.android.com/develop/ui/compose/components/bottom-sheets) and displays content in a modal sheet that slides up from the bottom.

![Modal bottom sheet with title, description, and action buttons](/static/images/expo-ui/bottomsheet/android-light.webp)

## Installation

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

## Usage

### Basic bottom sheet

Use `ref.hide()` to programmatically dismiss the sheet with an animation before unmounting it.

![A bottom sheet resting at its partial height with two lines of text and a Close button](/static/images/expo-ui/examples/composesheet-basic-android-light.webp)

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

### Skip partially expanded state

When `skipPartiallyExpanded` is set, the sheet opens directly in the fully expanded state instead of stopping at the half-height position first.

![A bottom sheet opened straight to its fully expanded height](/static/images/expo-ui/examples/composesheet-skip-partial-android-light.webp)

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

### Initial fully expanded state

When `initialFullyExpanded` is `true`, the sheet opens directly in the fully expanded state on first composition while leaving the partial state reachable. Unlike `skipPartiallyExpanded`, the user can still drag down to the partial state. The `partialExpand()` method also continues to work.

![A fully expanded bottom sheet with Collapse to partial and Close buttons](/static/images/expo-ui/examples/composesheet-initial-expanded-android-light.webp)

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

### Custom colors

Use `containerColor`, `contentColor`, and `scrimColor` to customize the sheet's appearance.

![A dark bottom sheet behind a purple scrim overlay](/static/images/expo-ui/examples/composesheet-custom-colors-android-light.webp)

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

### Custom drag handle

Use `ModalBottomSheet.DragHandle` slot to provide a custom drag handle, or set `showDragHandle={false}` to hide it entirely.

![A bottom sheet with a wide purple drag handle in place of the default one](/static/images/expo-ui/examples/composesheet-drag-handle-android-light.webp)

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

### React Native content inside a bottom sheet

Use `RNHostView` to embed interactive React Native views inside a Compose bottom sheet. This lets you mix Compose layout with RN components like `Pressable` and `Text`.

![A bottom sheet mixing a Compose label with a React Native heading and blue Close button](/static/images/expo-ui/examples/composesheet-rn-content-android-light.webp)

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

### React Native content with flex

Use `RNHostView` without `matchContents` to let the RN view fill the remaining space inside the sheet. Combine with a fixed `height` modifier on the parent `Column` to control the sheet size.

![A bottom sheet filled by a purple React Native view that stretches to the sheet height](/static/images/expo-ui/examples/composesheet-flex-rn-android-light.webp)

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

### Scrollable React Native content

Nest a scrollable React Native list such as `FlatList`, `ScrollView`, or a high-performance list like [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list) inside the sheet with `RNHostView`. Set `nestedScrollEnabled` on the scrollable so it scrolls its own content first. Once it reaches the top edge, the remaining drag moves the sheet. Without `nestedScrollEnabled` the list consumes the gesture and the sheet stays put.

![A bottom sheet holding a scrollable React Native list of items](/static/images/expo-ui/examples/composesheet-scrollable-android-light.webp)

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

### Non-dismissible sheet

Combine `properties`, `sheetGesturesEnabled` to create a sheet that can only be closed programmatically.

![A bottom sheet that can only be closed by its own Close button](/static/images/expo-ui/examples/composesheet-non-dismissible-android-light.webp)

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
