---
title: List 组件参考
description: 虚拟化的垂直行容器，配合可点击的 ListItem 原语。
---

# List 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`List` 提供虚拟化的垂直行容器，通常用 [`ListItem`](#listitem) 子项填充。它提供平台原生外观（分隔线、内缩样式、下拉刷新）。`ListItem` 是可点击的行，带有 `leading`、`trailing` 和 `supportingText` 插槽。

:::note
`List` 目前还不会惰性渲染行：React 会预先创建每一行，因此大型列表挂载可能较慢。我们正在改进这一点。大型列表建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
:::

## 原生实现

| 平台 | 底层组件 |
| --- | --- |
| Android | Jetpack Compose [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists#lazy)。提供 `onRefresh` 时，`List` 会用 [`PullToRefreshBox`](https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/package-summary#PullToRefreshBox(kotlin.Boolean,kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.Alignment,androidx.compose.material3.pulltorefresh.PullToRefreshState,androidx.compose.material3.ExperimentalMaterial3Api,kotlin.Function0)) 包裹它。 |
| iOS | SwiftUI [`List`](https://developer.apple.com/documentation/swiftui/list)。提供 `onRefresh` 时，`List` 会应用 [`refreshable`](https://developer.apple.com/documentation/swiftui/view/refreshable(action:)) 修饰符。 |
| Web | 带滚动溢出的 React Native [`View`](https://reactnative.dev/docs/view)。 |

**Android**

![列表含 Wi-Fi、Bluetooth 和 Cellular 行，每行带蓝色图标](/static/images/expo-ui/list/android-light.webp)

**iOS**

![List 含 Favorites 和 Recents 分区，每行显示彩色 SF Symbol 图标和标签](/static/images/expo-ui/list/ios-light.webp)

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

### 基本列表

**Android**

![Material 3 列表中的三项早餐](/static/images/expo-ui/examples/universal-list-basic-android-light.webp)

**iOS**

![分组 iOS 列表中的三项早餐](/static/images/expo-ui/examples/universal-list-basic-ios-light.webp)

```tsx ListExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, List, ListItem, Text } from '@expo/ui';

const ITEMS = [
  { id: 1, name: 'Avocado toast' },
  { id: 2, name: 'Bagel with cream cheese' },
  { id: 3, name: 'Cappuccino' },
];

export default function ListExample() {
  const [selected, setSelected] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <List>
        {ITEMS.map(item => (
          <ListItem key={item.id} onPress={() => setSelected(item.name)}>
            {item.name}
          </ListItem>
        ))}
      </List>
      {selected != null && <Text textStyle={ink}>{`Selected: ${selected}`}</Text>}
    </Host>
  );
}
```

### 带插槽的行

`ListItem` 接受 `leading`、`trailing` 和 `supportingText` 简写属性，用于常见情况。需要更丰富的内容时，可为其中任一属性传入 `ReactNode`。

**Android**

![Profile 行带辅助行和箭头，下方是 Settings 行](/static/images/expo-ui/examples/universal-list-slots-android-light.webp)

**iOS**

![Profile 行带辅助行和箭头，下方是 Settings 行](/static/images/expo-ui/examples/universal-list-slots-ios-light.webp)

```tsx ListItemSlotsExample.tsx
import { Host, Icon, List, ListItem } from '@expo/ui';

const CHEVRON = Icon.select({
  ios: 'chevron.right',
  android: require('@expo/material-symbols/chevron_right.xml'),
});

export default function ListItemSlotsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <ListItem
          onPress={() => {}}
          trailing={<Icon name={CHEVRON} size={14} color="gray" />}
          supportingText="Secondary line below the headline">
          Profile
        </ListItem>
        <ListItem onPress={() => {}} trailing={<Icon name={CHEVRON} size={14} color="gray" />}>
          Settings
        </ListItem>
      </List>
    </Host>
  );
}
```

### 复合插槽子元素

若要完全控制插槽内容，使用复合 API：`<ListItem.Leading>`、`<ListItem.Trailing>` 和 `<ListItem.Supporting>`。未被插槽包裹的内容会成为标题。

**Android**

![一行带星星图标、组合标题和辅助文本](/static/images/expo-ui/examples/universal-list-compound-android-light.webp)

**iOS**

![一行带星星图标、组合标题和辅助文本](/static/images/expo-ui/examples/universal-list-compound-ios-light.webp)

```tsx ListItemCompoundExample.tsx
import { useColorScheme } from 'react-native';
import { Host, Icon, List, ListItem, Row, Text } from '@expo/ui';

const STAR = Icon.select({
  ios: 'star.fill',
  android: require('@expo/material-symbols/star.xml'),
});

export default function ListItemCompoundExample() {
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <ListItem onPress={() => {}}>
          <ListItem.Leading>
            <Icon name={STAR} size={20} color="#FFD60A" />
          </ListItem.Leading>
          <Row spacing={0}>
            <Text textStyle={{ color: 'gray' }}>{`#42: `}</Text>
            <Text textStyle={ink}>Composite headline</Text>
          </Row>
          <ListItem.Supporting>Richer slot content</ListItem.Supporting>
        </ListItem>
      </List>
    </Host>
  );
}
```

### 下拉刷新

传入 `async` 的 `onRefresh` 处理函数。平台原生刷新指示器会保持可见，直到返回的 Promise 结束（兑现或拒绝）。

**Android**

![三项编号列表](/static/images/expo-ui/examples/universal-list-refresh-android-light.webp)

**iOS**

![三项编号列表](/static/images/expo-ui/examples/universal-list-refresh-ios-light.webp)

```tsx ListRefreshExample.tsx
import { useState } from 'react';
import { Host, List, ListItem } from '@expo/ui';

export default function ListRefreshExample() {
  const [items, setItems] = useState([1, 2, 3]);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setItems(prev => [Math.max(...prev) + 1, ...prev]);
  };

  return (
    <Host style={{ flex: 1 }}>
      <List onRefresh={handleRefresh}>
        {items.map(id => (
          <ListItem key={id}>{`Item #${id}`}</ListItem>
        ))}
      </List>
    </Host>
  );
}
```

> 下拉刷新尚未在 Web 上实现。为了 API 一致会接受该处理函数，但指示器只在 Android 和 iOS 上出现。

## API

```tsx
import { List, ListItem } from '@expo/ui';
```
