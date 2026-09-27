---
title: BadgedBox 组件参考
description: 用于在内容上叠加徽章的 Jetpack Compose BadgedBox 组件。
---

# BadgedBox 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 BadgedBox 与官方 Jetpack Compose [`BadgedBox`](https://developer.android.com/develop/ui/compose/components/badges) API 保持一致。它在图标等内容之上叠加一个徽章。

![邮件图标带计数徽章 5，Wi-Fi 图标带小圆点徽章](/static/images/expo-ui/badgedbox/android-light.webp)

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

### 带徽章计数的图标

![一个邮件图标，右上角带显示计数 5 的红色徽章](/static/images/expo-ui/examples/badgedbox-icon-android-light.webp)

```tsx IconWithBadge.tsx
import {
  Host,
  Badge,
  BadgedBox,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';

// 替换为你自己的矢量可绘制资源
const mailIcon = require('./assets/mail.xml');

export default function IconWithBadge() {
  return (
    <Host matchContents>
      <BadgedBox>
        <BadgedBox.Badge>
          <Badge>
            <Text>5</Text>
          </Badge>
        </BadgedBox.Badge>
        <Icon source={mailIcon} size={24} />
      </BadgedBox>
    </Host>
  );
}
```

### 交互式计数器

![一个购物车图标带计数 3 的徽章，下方是 Add item 按钮](/static/images/expo-ui/examples/badgedbox-interactive-android-light.webp)

```tsx InteractiveBadge.tsx
import { useState } from 'react';
import {
  Host,
  Badge,
  BadgedBox,
  Icon,
  Button,
  Text,
  Column,
} from '@expo/ui/jetpack-compose';

// 替换为你自己的矢量可绘制资源
const cartIcon = require('./assets/cart.xml');

export default function InteractiveBadge() {
  const [count, setCount] = useState(0);

  return (
    <Host matchContents>
      <Column>
        <BadgedBox>
          <BadgedBox.Badge>
            {count > 0 ? (
              <Badge>
                <Text>{String(count)}</Text>
              </Badge>
            ) : null}
          </BadgedBox.Badge>
          <Icon source={cartIcon} size={24} />
        </BadgedBox>
        <Button onClick={() => setCount(c => c + 1)}>
          <Text>Add item</Text>
        </Button>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { BadgedBox } from '@expo/ui/jetpack-compose';
```
