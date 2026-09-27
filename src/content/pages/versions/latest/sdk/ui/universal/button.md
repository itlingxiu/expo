---
title: Button 组件参考
description: 具有多种视觉变体的可按按钮。
---

# Button 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

可按按钮，在 Android、iOS 和 Web 上表现一致。支持 `filled`、`outlined` 和 `text` 三种视觉变体。

**Android**

![填充、轮廓和文本按钮，展示 Material 3 的强调层级](/static/images/expo-ui/button/android-light.webp)

**iOS**

![两个 iOS 26 Liquid Glass 按钮：上方是 glassProminent 的 Get started，下方是 glass 的 Learn more](/static/images/expo-ui/button/ios-light.webp)

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

### 基本按钮

**Android**

![单个填充按钮](/static/images/expo-ui/examples/universal-button-basic-android-light.webp)

**iOS**

![单个填充按钮](/static/images/expo-ui/examples/universal-button-basic-ios-light.webp)

```tsx BasicButtonExample.tsx
import { Host, Button } from '@expo/ui';

export default function BasicButtonExample() {
  return (
    <Host matchContents>
      <Button label="Press me" onPress={() => alert('Pressed!')} />
    </Host>
  );
}
```

### 变体

用 [`variant`](#variant) 属性选择视觉变体。

**Android**

![垂直堆叠的填充、轮廓和文本按钮变体](/static/images/expo-ui/examples/universal-button-variants-android-light.webp)

**iOS**

![垂直堆叠的填充、轮廓和文本按钮变体](/static/images/expo-ui/examples/universal-button-variants-ios-light.webp)

```tsx ButtonVariantsExample.tsx
import { Host, Column, Button } from '@expo/ui';

export default function ButtonVariantsExample() {
  return (
    <Host matchContents>
      <Column spacing={8}>
        <Button variant="filled" label="Filled" onPress={() => {}} />
        <Button variant="outlined" label="Outlined" onPress={() => {}} />
        <Button variant="text" label="Text" onPress={() => {}} />
      </Column>
    </Host>
  );
}
```

### 自定义内容

传入 [`children`](#children) 可完全自定义按钮内容。提供 `children` 时会忽略 [`label`](#label) 属性。

**Android**

![带星形图标和 Favorite 标签的填充按钮](/static/images/expo-ui/examples/universal-button-custom-android-light.webp)

**iOS**

![带星形图标和 Favorite 标签的填充按钮](/static/images/expo-ui/examples/universal-button-custom-ios-light.webp)

```tsx CustomButtonExample.tsx
import { Host, Button, Row, Icon, Text } from '@expo/ui';

export default function CustomButtonExample() {
  return (
    <Host matchContents>
      <Button onPress={() => {}}>
        <Row spacing={6} alignment="center">
          <Icon
            name={Icon.select({
              ios: 'star.fill',
              android: require('@expo/material-symbols/star.xml'),
            })}
            size={16}
            color="#FFFFFF"
          />
          <Text textStyle={{ color: '#FFFFFF' }}>Favorite</Text>
        </Row>
      </Button>
    </Host>
  );
}
```

### 禁用

**Android**

![变淡的禁用按钮](/static/images/expo-ui/examples/universal-button-disabled-android-light.webp)

**iOS**

![变淡的禁用按钮](/static/images/expo-ui/examples/universal-button-disabled-ios-light.webp)

```tsx DisabledButtonExample.tsx
import { Host, Button } from '@expo/ui';

export default function DisabledButtonExample() {
  return (
    <Host matchContents>
      <Button label="Disabled" onPress={() => {}} disabled />
    </Host>
  );
}
```

## API

```tsx
import { Button } from '@expo/ui';
```
