---
title: ListItem 组件参考
description: 用于显示结构化列表项的 Jetpack Compose ListItem 组件。
---

# ListItem 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 ListItem 与官方 Jetpack Compose [`ListItem`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#ListItem(kotlin.Function0,androidx.compose.ui.Modifier,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,androidx.compose.material3.ListItemColors,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp)) API 保持一致，用于带标题、辅助文本、上标、前导和尾随内容插槽的结构化列表项。

![两条 Material 3 列表项，显示上标、标题和辅助文本](/static/images/expo-ui/listitem/android-light.webp)

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

### 基本列表项

![单行列表，标题为 Settings](/static/images/expo-ui/examples/listitem-basic-android-light.webp)

```tsx BasicListItem.tsx
import { Host, ListItem, Text } from '@expo/ui/jetpack-compose';

export default function BasicListItem() {
  return (
    <Host matchContents>
      <ListItem>
        <ListItem.HeadlineContent>
          <Text>Settings</Text>
        </ListItem.HeadlineContent>
      </ListItem>
    </Host>
  );
}
```

### 使用复合组件

用复合组件为各个位置提供丰富内容。

![列表行带铃铛图标、ACCOUNT 上标、Notifications 标题、辅助文本和尾随箭头](/static/images/expo-ui/examples/listitem-slots-android-light.webp)

```tsx ListItemWithCompoundComponent.tsx
import {
  Host,
  ListItem,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';

export default function ListItemWithSlots() {
  return (
    <Host matchContents>
      <ListItem>
        <ListItem.HeadlineContent>
          <Text>Notifications</Text>
        </ListItem.HeadlineContent>
        <ListItem.OverlineContent>
          <Text>ACCOUNT</Text>
        </ListItem.OverlineContent>
        <ListItem.SupportingContent>
          <Text>Manage notification preferences</Text>
        </ListItem.SupportingContent>
        <ListItem.LeadingContent>
          <Icon source={require('./assets/notifications.xml')} />
        </ListItem.LeadingContent>
        <ListItem.TrailingContent>
          <Icon source={require('./assets/chevron.xml')} />
        </ListItem.TrailingContent>
      </ListItem>
    </Host>
  );
}
```

### 可点击的列表项

使用 `clickable` 修饰符处理点击交互。

![可点击的列表行，标题为 Tap me](/static/images/expo-ui/examples/listitem-clickable-android-light.webp)

```tsx ClickableListItem.tsx
import { Host, ListItem, Text } from '@expo/ui/jetpack-compose';
import { clickable } from '@expo/ui/jetpack-compose/modifiers';

export default function ClickableListItem() {
  return (
    <Host matchContents>
      <ListItem
        modifiers={[clickable(() => console.log('Tapped!'))]}>
        <ListItem.HeadlineContent>
          <Text>Tap me</Text>
        </ListItem.HeadlineContent>
      </ListItem>
    </Host>
  );
}
```

### 自定义标题内容

用 `ListItem.HeadlineContent` 放置可组合的标题内容，例如带图标的行。

![列表行的标题把文本 Premium Feature 与星星图标并排](/static/images/expo-ui/examples/listitem-custom-headline-android-light.webp)

```tsx ListItemCustomHeadline.tsx
import {
  Host,
  ListItem,
  Text,
  Row,
  Icon,
} from '@expo/ui/jetpack-compose';

export default function ListItemCustomHeadline() {
  return (
    <Host matchContents>
      <ListItem>
        <ListItem.HeadlineContent>
          <Row
            horizontalArrangement={{ spacedBy: 8 }}
            verticalAlignment="center">
            <Text>Premium Feature</Text>
            <Icon source={require('./assets/star.xml')} size={16} />
          </Row>
        </ListItem.HeadlineContent>
      </ListItem>
    </Host>
  );
}
```

## API

```tsx
import { ListItem } from '@expo/ui/jetpack-compose';
```
