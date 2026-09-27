---
title: IconButton 组件参考
description: 用于显示原生 Material 3 图标按钮的 Jetpack Compose IconButton 组件。
---

# IconButton 组件参考

> 支持平台：Android、Expo Go。

Expo UI 提供四个与官方 Jetpack Compose [IconButton API](https://developer.android.com/develop/ui/compose/components/icon-button) 一致的图标按钮组件：`IconButton`、`FilledIconButton`、`FilledTonalIconButton` 和 `OutlinedIconButton`。所有变体共享相同的属性，并接受可组合的子元素作为内容。

![填充、填充色调和标准 Material 3 图标按钮](/static/images/expo-ui/iconbutton/android-light.webp)

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

### 基本图标按钮

没有背景的标准图标按钮，通常用于工具栏操作。

![没有背景的齿轮图标按钮](/static/images/expo-ui/examples/iconbutton-basic-android-light.webp)

```tsx BasicIconButtonExample.tsx
import {
  Host,
  IconButton,
  Icon,
  Surface,
} from '@expo/ui/jetpack-compose';

export default function BasicIconButtonExample() {
  return (
    <Host matchContents>
      <Surface>
        <IconButton onClick={() => alert('Pressed!')}>
          <Icon
            source={require('./assets/settings.xml')}
            size={24}
          />
        </IconButton>
      </Surface>
    </Host>
  );
}
```

### 图标按钮变体

使用不同的图标按钮组件来表达不同程度的强调。

![一行四个星形图标按钮：普通、填充、填充色调和轮廓](/static/images/expo-ui/examples/iconbutton-variants-android-light.webp)

```tsx IconButtonVariantsExample.tsx
import {
  Host,
  IconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
  Icon,
  Row,
  Surface,
} from '@expo/ui/jetpack-compose';

export default function IconButtonVariantsExample() {
  return (
    <Host matchContents>
      <Surface>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <IconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </IconButton>
          <FilledIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </FilledIconButton>
          <FilledTonalIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </FilledTonalIconButton>
          <OutlinedIconButton onClick={() => {}}>
            <Icon source={require('./assets/star.xml')} size={24} />
          </OutlinedIconButton>
        </Row>
      </Surface>
    </Host>
  );
}
```

## API

```tsx
import {
  IconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
} from '@expo/ui/jetpack-compose';
```
