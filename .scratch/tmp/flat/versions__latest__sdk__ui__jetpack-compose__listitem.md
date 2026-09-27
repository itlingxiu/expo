---
title: ListItem 组件参考
description: A Jetpack Compose ListItem component for displaying structured list entries.
---

# ListItem 组件参考

> 支持平台：Android、Expo Go。

Expo UI ListItem matches the official Jetpack Compose [`ListItem`](<https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#ListItem(kotlin.Function0,androidx.compose.ui.Modifier,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,androidx.compose.material3.ListItemColors,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp)>) API for structured list entries with headline, supporting, overline, leading, and trailing content slots.

![Two Material 3 list items showing overline, headline, and supporting text](/static/images/expo-ui/listitem/android-light.webp)

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

### Basic list item

![A single list row with the headline Settings](/static/images/expo-ui/examples/listitem-basic-android-light.webp)

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

### With compound components

Use compound components for rich content in each position.

![A list row with a bell icon, an ACCOUNT overline, a Notifications headline, supporting text, and a trailing chevron](/static/images/expo-ui/examples/listitem-slots-android-light.webp)

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

### Clickable list item

Use the `clickable` modifier to handle tap interactions.

![A tappable list row with the headline Tap me](/static/images/expo-ui/examples/listitem-clickable-android-light.webp)

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

### Custom headline content

Use `ListItem.HeadlineContent` for composable headline content like rows with icons.

![A list row whose headline pairs the text Premium Feature with a star icon](/static/images/expo-ui/examples/listitem-custom-headline-android-light.webp)

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
