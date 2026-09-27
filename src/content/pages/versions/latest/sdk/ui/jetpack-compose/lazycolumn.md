---
title: LazyColumn 组件参考
description: 用于显示可滚动列表的 Jetpack Compose LazyColumn 组件。
---

# LazyColumn 组件参考

> 支持平台：Android、Expo Go。

惰性加载的垂直列表组件，只渲染可见项，以便高效滚动。更多信息请参阅 [Jetpack Compose 官方文档](https://developer.android.com/develop/ui/compose/lists)。

:::note
`LazyColumn` 目前还不是真正的惰性：原生侧只组合可见项，但 React 仍会预先创建每一个子节点，因此大型列表挂载可能较慢。我们正在改进这一点。大型列表建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
:::

![LazyColumn 渲染由五项 Material 3 列表项组成的设置列表](/static/images/expo-ui/lazycolumn/android-light.webp)

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

### 基本惰性列

![可滚动列表，显示一百项中的前七项](/static/images/expo-ui/examples/lazycolumn-basic-android-light.webp)

```tsx BasicLazyColumn.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

const items = Array.from(
  { length: 100 },
  (_, i) => `Item ${i + 1}`
);

export default function BasicLazyColumn() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn>
        {items.map(item => (
          <ListItem key={item}>
            <ListItem.HeadlineContent>
              <Text>{item}</Text>
            </ListItem.HeadlineContent>
          </ListItem>
        ))}
      </LazyColumn>
    </Host>
  );
}
```

### 排列方式

使用 `verticalArrangement` 属性控制列表中各项的间距。可传入 `'spaceBetween'` 这类字符串，或 `{ spacedBy: 8 }` 这类对象以使用固定的 dp 间距。

![三项列表项之间有 8 密度独立像素的间隙](/static/images/expo-ui/examples/lazycolumn-arrangement-android-light.webp)

```tsx LazyColumnArrangement.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function LazyColumnArrangement() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn
        verticalArrangement={{ spacedBy: 8 }}
        horizontalAlignment="center">
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 1</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 2</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Spaced Item 3</Text>
          </ListItem.HeadlineContent>
        </ListItem>
      </LazyColumn>
    </Host>
  );
}
```

### 内容内边距

使用 `contentPadding` 属性为列表内容添加以 dp 为单位的内边距。

![三项列表项因内容内边距而从列表边缘向内缩进](/static/images/expo-ui/examples/lazycolumn-padding-android-light.webp)

```tsx LazyColumnPadding.tsx
import {
  Host,
  LazyColumn,
  ListItem,
  Text,
} from '@expo/ui/jetpack-compose';

export default function LazyColumnPadding() {
  return (
    <Host style={{ height: 400 }}>
      <LazyColumn
        contentPadding={{ start: 16, top: 8, end: 16, bottom: 8 }}>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 1</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 2</Text>
          </ListItem.HeadlineContent>
        </ListItem>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Padded item 3</Text>
          </ListItem.HeadlineContent>
        </ListItem>
      </LazyColumn>
    </Host>
  );
}
```

## API

```tsx
import { LazyColumn } from '@expo/ui/jetpack-compose';
```
