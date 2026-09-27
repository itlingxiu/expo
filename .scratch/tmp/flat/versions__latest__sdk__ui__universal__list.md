---
title: List 组件参考
description: A virtualized vertical container of rows, paired with a tappable ListItem primitive.
---

# List 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`List` provides a virtualized vertical container of rows, typically populated with [`ListItem`](#listitem) children. It provides the platform-native chrome (separators, inset styling, pull-to-refresh). `ListItem` is a tappable row with `leading`/`trailing`/`supportingText` slots.

> **info** `List` does not lazily render rows yet: React creates every row up front, so large lists can be slow to mount. We are working on improving this. For large lists, we recommend [FlashList](https://shopify.github.io/flash-list) or [Legend List](https://github.com/LegendApp/legend-list).

## Native implementations

| Platform | Backing component                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android  | Jetpack Compose [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists#lazy). When you provide `onRefresh`, `List` wraps it in [`PullToRefreshBox`](<https://developer.android.com/reference/kotlin/androidx/compose/material3/pulltorefresh/package-summary#PullToRefreshBox(kotlin.Boolean,kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.Alignment,androidx.compose.material3.pulltorefresh.PullToRefreshState,androidx.compose.material3.ExperimentalMaterial3Api,kotlin.Function0)>). |
| iOS      | SwiftUI [`List`](https://developer.apple.com/documentation/swiftui/list). When you provide `onRefresh`, `List` applies the [`refreshable`](<https://developer.apple.com/documentation/swiftui/view/refreshable(action:)>) modifier.                                                                                                                                                                                                                                                                                          |
| Web      | React Native [`View`](https://reactnative.dev/docs/view) with scrolling overflow.                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**Android**

![A list with Wi-Fi, Bluetooth, and Cellular rows, each with a blue icon](/static/images/expo-ui/list/android-light.webp)

**iOS**

![A List with Favorites and Recents sections, each row showing a colored SF Symbol icon and a label](/static/images/expo-ui/list/ios-light.webp)

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

### Basic list

**Android**

![Three breakfast items in a Material 3 list](/static/images/expo-ui/examples/universal-list-basic-android-light.webp)

**iOS**

![Three breakfast items in a grouped iOS list](/static/images/expo-ui/examples/universal-list-basic-ios-light.webp)

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

### Rows with slots

`ListItem` accepts `leading`, `trailing`, and `supportingText` shorthand props for the common case. Pass a `ReactNode` for any of them when richer content is needed.

**Android**

![A Profile row with a supporting line and a chevron, above a Settings row](/static/images/expo-ui/examples/universal-list-slots-android-light.webp)

**iOS**

![A Profile row with a supporting line and a chevron, above a Settings row](/static/images/expo-ui/examples/universal-list-slots-ios-light.webp)

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

### Compound slot children

For full control over slot content, use the compound API: `<ListItem.Leading>`, `<ListItem.Trailing>`, and `<ListItem.Supporting>`. Anything not wrapped in a slot becomes the headline.

**Android**

![A row with a star icon, a composite headline, and supporting text](/static/images/expo-ui/examples/universal-list-compound-android-light.webp)

**iOS**

![A row with a star icon, a composite headline, and supporting text](/static/images/expo-ui/examples/universal-list-compound-ios-light.webp)

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

### Pull-to-refresh

Pass an `async` `onRefresh` handler. The platform-native refresh indicator stays visible until the returned promise settles (resolves or rejects).

**Android**

![A list of three numbered items](/static/images/expo-ui/examples/universal-list-refresh-android-light.webp)

**iOS**

![A list of three numbered items](/static/images/expo-ui/examples/universal-list-refresh-ios-light.webp)

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

> Pull-to-refresh is not implemented on web yet. The handler is accepted for API parity but the indicator only appears on Android and iOS.

## API

```tsx
import { List, ListItem } from '@expo/ui';
```
