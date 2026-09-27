---
title: FloatingActionButton 组件参考
description: 遵循 Material Design 3 的 Jetpack Compose FloatingActionButton 组件。
---

# FloatingActionButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供四个与 Material Design 3 [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab) API 一致的变体：

- `SmallFloatingActionButton` — 紧凑的 FAB
- `FloatingActionButton` — 标准 FAB（默认尺寸）
- `LargeFloatingActionButton` — 更大的 FAB
- `ExtendedFloatingActionButton` — 带图标和文本标签的 FAB，支持展开/收起动画

每个组件使用基于插槽的子元素（`.Icon`，以及 `ExtendedFloatingActionButton` 的 `.Text`）来组合内容。

:::note
如果需要在悬浮工具栏中放置多个操作按钮，请改用 [`HorizontalFloatingToolbar`](/versions/latest/sdk/ui/jetpack-compose/horizontalfloatingtoolbar)。
:::

![小号、常规和大号 Material 3 悬浮操作按钮](/static/images/expo-ui/floatingactionbutton/android-light.webp)

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

### 标准 FloatingActionButton

![带加号图标的标准悬浮操作按钮](/static/images/expo-ui/examples/fab-standard-android-light.webp)

```tsx StandardFABExample.tsx
import {
  FloatingActionButton,
  Host,
  Icon,
} from '@expo/ui/jetpack-compose';

export default function StandardFABExample() {
  return (
    <Host matchContents>
      <FloatingActionButton
        onClick={() => console.log('FAB pressed')}>
        <FloatingActionButton.Icon>
          <Icon source={require('./assets/add.xml')} />
        </FloatingActionButton.Icon>
      </FloatingActionButton>
    </Host>
  );
}
```

### FAB 变体

![小号、标准和大型悬浮操作按钮并排，各自带加号图标](/static/images/expo-ui/examples/fab-variants-android-light.webp)

```tsx FABVariantsExample.tsx
import {
  FloatingActionButton,
  Host,
  Icon,
  LargeFloatingActionButton,
  SmallFloatingActionButton,
} from '@expo/ui/jetpack-compose';
import { View } from 'react-native';

export default function FABVariantsExample() {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Host matchContents>
        <SmallFloatingActionButton onClick={() => {}}>
          <SmallFloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </SmallFloatingActionButton.Icon>
        </SmallFloatingActionButton>
      </Host>
      <Host matchContents>
        <FloatingActionButton onClick={() => {}}>
          <FloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </Host>
      <Host matchContents>
        <LargeFloatingActionButton onClick={() => {}}>
          <LargeFloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </LargeFloatingActionButton.Icon>
        </LargeFloatingActionButton>
      </Host>
    </View>
  );
}
```

### ExtendedFloatingActionButton

![扩展悬浮操作按钮，带铅笔图标和 Edit 标签](/static/images/expo-ui/examples/fab-extended-android-light.webp)

```tsx ExtendedFABExample.tsx
import {
  ExtendedFloatingActionButton,
  Host,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function ExtendedFABExample() {
  const [expanded, setExpanded] = useState(true);

  return (
    <Host matchContents>
      <ExtendedFloatingActionButton
        expanded={expanded}
        onClick={() => setExpanded(v => !v)}>
        <ExtendedFloatingActionButton.Icon>
          <Icon source={require('./assets/edit.xml')} />
        </ExtendedFloatingActionButton.Icon>
        <ExtendedFloatingActionButton.Text>
          <Text>Edit</Text>
        </ExtendedFloatingActionButton.Text>
      </ExtendedFloatingActionButton>
    </Host>
  );
}
```

### 浮在内容上方

使用带 `align('bottomEnd')` 的 Compose `Box`，把 FAB 放在可滚动内容上方，整个布局都留在 Compose 层内。

![可滚动项目列表右下角的悬浮操作按钮](/static/images/expo-ui/examples/fab-floating-android-light.webp)

```tsx FloatingFABExample.tsx
import {
  Box,
  FloatingActionButton,
  Host,
  Icon,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  offset,
} from '@expo/ui/jetpack-compose/modifiers';

const ITEMS = Array.from(
  { length: 20 },
  (_, index) => `Item ${index + 1}`
);

export default function FloatingFABExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Box modifiers={[fillMaxSize()]}>
        <LazyColumn modifiers={[fillMaxSize()]}>
          {ITEMS.map(item => (
            <ListItem key={item}>
              <ListItem.HeadlineContent>
                <Text>{item}</Text>
              </ListItem.HeadlineContent>
            </ListItem>
          ))}
        </LazyColumn>

        <FloatingActionButton
          modifiers={[align('bottomEnd'), offset(-16, -16)]}
          onClick={() => console.log('pressed')}>
          <FloatingActionButton.Icon>
            <Icon source={require('./assets/add.xml')} />
          </FloatingActionButton.Icon>
        </FloatingActionButton>
      </Box>
    </Host>
  );
}
```

### 自定义颜色

![扩展悬浮操作按钮，浅紫容器，标签为 New item](/static/images/expo-ui/examples/fab-custom-color-android-light.webp)

```tsx FABCustomColorExample.tsx
import {
  ExtendedFloatingActionButton,
  Host,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';

export default function FABCustomColorExample() {
  return (
    <Host matchContents>
      <ExtendedFloatingActionButton
        containerColor="#E8DEF8"
        onClick={() => console.log('pressed')}>
        <ExtendedFloatingActionButton.Icon>
          <Icon source={require('./assets/add.xml')} />
        </ExtendedFloatingActionButton.Icon>
        <ExtendedFloatingActionButton.Text>
          <Text>New item</Text>
        </ExtendedFloatingActionButton.Text>
      </ExtendedFloatingActionButton>
    </Host>
  );
}
```

## API

```tsx
import {
  SmallFloatingActionButton,
  FloatingActionButton,
  LargeFloatingActionButton,
  ExtendedFloatingActionButton,
} from '@expo/ui/jetpack-compose';
```
