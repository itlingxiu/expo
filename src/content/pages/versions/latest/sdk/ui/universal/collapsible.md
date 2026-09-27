---
title: Collapsible 组件参考
description: 带标签的可点击标题，用于切换其内容的可见性。
---

# Collapsible 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

`Collapsible` 是一个原语：点击带标签的标题即可显示或隐藏其内容。通过 [`isOpen`](#isopen) 和 [`onOpenChange`](#onopenchange) 控制——每个 `Collapsible` 管理各自独立的状态。

**Android**

![展开的 About 分区，带箭头和说明文本](/static/images/expo-ui/collapsible/android-light.webp)

**iOS**

![展开的 About 分区，带箭头和说明文本](/static/images/expo-ui/collapsible/ios-light.webp)

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

### 基本折叠

**Android**

![折叠的 About 行，带箭头](/static/images/expo-ui/examples/universal-collapsible-basic-android-light.webp)

**iOS**

![折叠的 About 行，带箭头](/static/images/expo-ui/examples/universal-collapsible-basic-ios-light.webp)

```tsx CollapsibleExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Collapsible, Text } from '@expo/ui';

export default function CollapsibleExample() {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} style={{ padding: 16 }}>
        <Collapsible isOpen={open} onOpenChange={setOpen} label="About">
          <Text textStyle={ink}>
            A primitive that toggles visibility of its content via a labelled tappable header.
          </Text>
        </Collapsible>
      </Column>
    </Host>
  );
}
```

### 手风琴（一次只展开一个分区）

把每个 `Collapsible` 的 `isOpen` 接到共享的父级值上。组件本身不强制互斥——如何组合由调用方决定。

**Android**

![三个分区，第一个展开并显示内容](/static/images/expo-ui/examples/universal-collapsible-accordion-android-light.webp)

**iOS**

![三个分区，第一个展开并显示内容](/static/images/expo-ui/examples/universal-collapsible-accordion-ios-light.webp)

```tsx CollapsibleAccordionExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, Column, Collapsible, Text } from '@expo/ui';

type Section = 'a' | 'b' | 'c' | null;

export default function CollapsibleAccordionExample() {
  const [openSection, setOpenSection] = useState<Section>('a');
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
      <Column spacing={8} style={{ padding: 16 }}>
        <Collapsible
          isOpen={openSection === 'a'}
          onOpenChange={open => setOpenSection(open ? 'a' : null)}
          label="Section A">
          <Text textStyle={ink}>Opening B or C closes this one.</Text>
        </Collapsible>
        <Collapsible
          isOpen={openSection === 'b'}
          onOpenChange={open => setOpenSection(open ? 'b' : null)}
          label="Section B">
          <Text textStyle={ink}>Opening A or C closes this one.</Text>
        </Collapsible>
        <Collapsible
          isOpen={openSection === 'c'}
          onOpenChange={open => setOpenSection(open ? 'c' : null)}
          label="Section C">
          <Text textStyle={ink}>Opening A or B closes this one.</Text>
        </Collapsible>
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { Collapsible } from '@expo/ui';
```
