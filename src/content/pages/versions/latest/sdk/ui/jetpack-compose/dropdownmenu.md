---
title: DropdownMenu 组件参考
description: 用于显示下拉菜单的 Jetpack Compose DropdownMenu 组件。
---

# DropdownMenu 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 DropdownMenu 与官方 Jetpack Compose [Menu API](https://developer.android.com/develop/ui/compose/components/menu) 保持一致，在按下触发元素时显示下拉菜单。

![三点更多菜单打开后显示带前导图标的 Edit、Share 和 Delete 选项](/static/images/expo-ui/dropdownmenu/android-light.webp)

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

### 基本下拉菜单

![描边的 Show menu 按钮，下方打开的菜单含一项 Home 和房屋图标](/static/images/expo-ui/examples/dropdownmenu-basic-android-light.webp)

```tsx BasicDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
  Icon,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

const homeIcon = require('./assets/home.xml');

export default function BasicDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem
            onClick={() => {
              setIsExpanded(false);
              console.log('Home pressed');
            }}>
            <DropdownMenuItem.Text>
              <Text>Home</Text>
            </DropdownMenuItem.Text>
            <DropdownMenuItem.LeadingIcon>
              <Icon source={homeIcon} size={24} />
            </DropdownMenuItem.LeadingIcon>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### 用 React Native 组件作为触发器

可以把 React Native 视图（例如 `Pressable`）包在 [`RNHostView`](/versions/latest/sdk/ui/jetpack-compose/rnhostview) 中，作为下拉菜单的触发器。

![紫色 React Native 按钮，下方打开的菜单含 Item 1 和 Item 2](/static/images/expo-ui/examples/dropdownmenu-rn-trigger-android-light.webp)

```tsx RNTriggerDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text as ComposeText,
  RNHostView,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export default function RNTriggerDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <Pressable
              onPress={() => setIsExpanded(true)}
              style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#9B59B6',
              }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>
                RN Pressable Trigger
              </Text>
            </Pressable>
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <ComposeText>Item 1</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <ComposeText>Item 2</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### 长按触发

Jetpack Compose 没有专门的长按菜单原语——你可以用触发视图上的 [`combinedClickable`](/versions/latest/sdk/ui/jetpack-compose/modifiers) 修饰符，加上现有的受控 `DropdownMenu` 组合出一个。菜单会自动锚定到触发器。

![长按打开的菜单，含 Copy 和红色 Delete 项](/static/images/expo-ui/examples/dropdownmenu-long-press-android-light.webp)

```tsx LongPressDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  background,
  combinedClickable,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

export default function LongPressDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <Text
            modifiers={[
              background('#e0e0e0'),
              combinedClickable({
                onClick: () => console.log('Short tap'),
                onLongClick: () => setIsExpanded(true),
              }),
            ]}>
            Long-press me
          </Text>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Copy</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem
            elementColors={{ textColor: '#B3261E' }}
            onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Delete</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### 圆角

使用 `cornerRadius` 用自定义圆角半径（dp）覆盖默认的 Material 3 菜单形状。

![圆角菜单打开在 Show menu 按钮下方](/static/images/expo-ui/examples/dropdownmenu-rounded-android-light.webp)

```tsx RoundedDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function RoundedDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
        cornerRadius={16}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Item 1</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

### 阴影高度

使用 `shadowElevation` 以 dp 设置弹出层阴影高度。设为 `0` 可去掉阴影，省略则使用 Material 3 默认值。`DropdownMenu` 上的修饰符作用于触发器容器，因此阴影修饰符不会改变弹出层阴影。

![Show menu 按钮下方打开的下拉菜单，含一项和较低的阴影](/static/images/expo-ui/examples/dropdownmenu-shadow-android-light.webp)

```tsx ShadowDropdownMenuExample.tsx
import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  OutlinedButton,
  Text,
} from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function ShadowDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu
        expanded={isExpanded}
        onDismissRequest={() => setIsExpanded(false)}
        shadowElevation={1}>
        <DropdownMenu.Trigger>
          <OutlinedButton onClick={() => setIsExpanded(true)}>
            <Text>Show menu</Text>
          </OutlinedButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={() => setIsExpanded(false)}>
            <DropdownMenuItem.Text>
              <Text>Item 1</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}
```

## API

```tsx
import { DropdownMenu } from '@expo/ui/jetpack-compose';
```
