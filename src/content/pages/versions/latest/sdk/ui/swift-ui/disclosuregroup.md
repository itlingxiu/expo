---
title: DisclosureGroup 组件参考
description: 用于显示可展开内容的 SwiftUI DisclosureGroup 组件。
---

# DisclosureGroup 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 DisclosureGroup 与官方 SwiftUI [DisclosureGroup API](https://developer.apple.com/documentation/swiftui/disclosuregroup) 保持一致，显示一个展开指示器，用来显示或隐藏内容。

![在 Form 中展开的 DisclosureGroup](/static/images/expo-ui/disclosuregroup/ios-light.webp)

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

### 基本展开组

`DisclosureGroup` 最常放在 [`Form`](/versions/latest/sdk/ui/swift-ui/form) 内，从而获得带箭头指示器的标准 iOS 列表样式。

![表单中展开的 Advanced settings 组，列出三行设置](/static/images/expo-ui/examples/disclosuregroup-basic-ios-light.webp)

```tsx BasicDisclosureGroupExample.tsx
import { useState } from 'react';
import {
  DisclosureGroup,
  Form,
  Host,
  Section,
  Text,
} from '@expo/ui/swift-ui';

export default function BasicDisclosureGroupExample() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <DisclosureGroup
            label="Advanced settings"
            isExpanded={isExpanded}
            onIsExpandedChange={setIsExpanded}>
            <Text>Auto-update apps</Text>
            <Text>App downloads</Text>
            <Text>Offload unused apps</Text>
          </DisclosureGroup>
        </Section>
      </Form>
    </Host>
  );
}
```

### 初始展开

把 `isExpanded` 的初始值设为 `true`，即可默认显示内容。

![表单外的 Details 组，展开后显示一行内容](/static/images/expo-ui/examples/disclosuregroup-initially-expanded-ios-light.webp)

```tsx InitiallyExpandedExample.tsx
import { useState } from 'react';
import { Host, DisclosureGroup, Text } from '@expo/ui/swift-ui';

export default function InitiallyExpandedExample() {
  const [isExpanded, setIsExpanded] = useState(true);

  // DisclosureGroup 会占满给定宽度，因此 `matchContents` 会把它压扁。
  return (
    <Host style={{ flex: 1 }}>
      <DisclosureGroup
        label="Details"
        isExpanded={isExpanded}
        onIsExpandedChange={setIsExpanded}>
        <Text>This content is visible by default.</Text>
      </DisclosureGroup>
    </Host>
  );
}
```

### 自定义标签

当标签需要自定义 SwiftUI 内容或修改器，而不是 `label` 字符串属性时，使用 `DisclosureGroup.Label`。

![表单中折叠的组，标签 Network options 为半粗体青色](/static/images/expo-ui/examples/disclosuregroup-custom-label-ios-light.webp)

```tsx CustomLabelDisclosureGroupExample.tsx
import { useState } from 'react';
import {
  DisclosureGroup,
  Form,
  Host,
  Section,
  Text,
} from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export default function CustomLabelDisclosureGroupExample() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <DisclosureGroup
            isExpanded={isExpanded}
            onIsExpandedChange={setIsExpanded}>
            <DisclosureGroup.Label>
              <Text
                modifiers={[
                  font({ weight: 'semibold' }),
                  foregroundStyle('#0a7ea4'),
                ]}>
                Network options
              </Text>
            </DisclosureGroup.Label>
            <Text>Wi-Fi</Text>
            <Text>Bluetooth</Text>
            <Text>Cellular data</Text>
          </DisclosureGroup>
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { DisclosureGroup } from '@expo/ui/swift-ui';
```
