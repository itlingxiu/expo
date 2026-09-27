---
title: Form 组件参考
description: 用于以结构化布局收集用户输入的 SwiftUI Form 组件。
---

# Form 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Form 与官方 SwiftUI [Form API](https://developer.apple.com/documentation/swiftui/form) 保持一致。它提供一个容器，用于分组数据录入控件，例如设置页或检查面板。

![Form 含两组 Toggle 的 Section，以及页脚说明](/static/images/expo-ui/form/ios-light.webp)

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

### 基本表单

![表单中只有一个 Enter your name 文本框](/static/images/expo-ui/examples/form-basic-ios-light.webp)

```tsx BasicFormExample.tsx
import { Host, Form, TextField } from '@expo/ui/swift-ui';

export default function BasicFormExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <TextField placeholder="Enter your name" />
      </Form>
    </Host>
  );
}
```

### 带分区的表单

使用 [`Section`](/versions/latest/sdk/ui/swift-ui/section) 组件在表单中分组相关控件。

![表单含 Profile 分区的两个字段、Preferences 分区的两个开关，以及 Save changes 按钮](/static/images/expo-ui/examples/form-with-sections-ios-light.webp)

```tsx FormWithSectionsExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  TextField,
  Toggle,
  Button,
} from '@expo/ui/swift-ui';

export default function FormWithSectionsExample() {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Profile">
          <TextField placeholder="Name" />
          <TextField placeholder="Email" />
        </Section>

        <Section title="Preferences">
          <Toggle
            label="Enable notifications"
            isOn={notifications}
            onIsOnChange={setNotifications}
          />
          <Toggle
            label="Dark mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
        </Section>

        <Section>
          <Button
            label="Save changes"
            onPress={() => console.log('Saved!')}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

### 自定义背景的表单

使用 `scrollContentBackground` 修饰符自定义或隐藏表单背景。

![浅灰背景的表单，后方是 Custom Background 分区](/static/images/expo-ui/examples/form-background-ios-light.webp)

```tsx FormBackgroundExample.tsx
import { Host, Form, Section, TextField } from '@expo/ui/swift-ui';
import {
  scrollContentBackground,
  background,
} from '@expo/ui/swift-ui/modifiers';

export default function FormBackgroundExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Form
        modifiers={[
          scrollContentBackground('hidden'),
          background('#F0F0F0'),
        ]}>
        <Section title="Custom Background">
          <TextField placeholder="Enter text" />
        </Section>
      </Form>
    </Host>
  );
}
```

### 不可滚动的表单

使用 [`scrollDisabled`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符阻止表单滚动。

:::note
`scrollDisabled` 修饰符仅在 iOS 16+ 和 tvOS 16+ 上可用。
:::

![表单含 Settings 分区，其中只有一个 Enable feature 开关](/static/images/expo-ui/examples/form-non-scrollable-ios-light.webp)

```tsx NonScrollableFormExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  TextField,
  Toggle,
} from '@expo/ui/swift-ui';
import { scrollDisabled } from '@expo/ui/swift-ui/modifiers';

export default function NonScrollableFormExample() {
  const [isOn, setIsOn] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[scrollDisabled()]}>
        <Section title="Settings">
          <Toggle
            label="Enable feature"
            isOn={isOn}
            onIsOnChange={setIsOn}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

### 可下拉刷新的表单

使用 `refreshable` 修饰符添加下拉刷新功能。

![表单含 Pull to refresh 分区，显示上次刷新时间](/static/images/expo-ui/examples/form-refreshable-ios-light.webp)

```tsx RefreshableFormExample.tsx
import { useState, useCallback } from 'react';
import { Host, Form, Section, Text } from '@expo/ui/swift-ui';
import { refreshable } from '@expo/ui/swift-ui/modifiers';

export default function RefreshableFormExample() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = useCallback(async () => {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastRefresh(new Date());
  }, []);

  return (
    <Host style={{ flex: 1 }}>
      <Form modifiers={[refreshable(handleRefresh)]}>
        <Section title="Pull to refresh">
          <Text>
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </Text>
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { Form } from '@expo/ui/swift-ui';
```
