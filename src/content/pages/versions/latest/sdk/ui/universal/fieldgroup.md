---
title: FieldGroup 组件参考
description: 用于分组设置样式行的可滚动容器。
---

# FieldGroup 组件参考

> 支持平台：Android、iOS、Web、Expo Go。

用于分组设置样式行的可滚动容器，外观类似 iOS 设置屏幕。在其中组合 `FieldGroup.Section`（显式分组）、`FieldGroup.SectionHeader` 和 `FieldGroup.SectionFooter` 插槽。

:::note
`FieldGroup` 会滚动，自身没有高度。它会拉伸以填满父级，因此请给它一个尺寸明确的父级，例如 `<Host style={{ flex: 1 }}>` 或带明确高度的宿主。它不会出现在 `<Host matchContents>` 这类按内容撑开的容器里，因为没有可供该组填满的有界高度。
:::

**Android**

![Notifications 分区，包含 Push 和 Email 开关行](/static/images/expo-ui/fieldgroup/android-light.webp)

**iOS**

![Notifications 分区，包含 Push 和 Email 开关行](/static/images/expo-ui/fieldgroup/ios-light.webp)

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

### 分区表单

**Android**

![Notifications 分区中 Push 开启、Email 关闭，下方是 About 分区](/static/images/expo-ui/examples/universal-fieldgroup-basic-android-light.webp)

**iOS**

![Notifications 分区中 Push 开启、Email 关闭，下方是 About 分区](/static/images/expo-ui/examples/universal-fieldgroup-basic-ios-light.webp)

```tsx FieldGroupExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, FieldGroup, Switch, Text } from '@expo/ui';

export default function FieldGroupExample() {
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section title="Notifications">
          <Switch label="Push" value={notifications} onValueChange={setNotifications} />
          <Switch label="Email" value={analytics} onValueChange={setAnalytics} />
        </FieldGroup.Section>

        <FieldGroup.Section title="About">
          <Text textStyle={ink}>Version 1.0.0</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
```

### 自定义分区页眉和页脚

使用 `FieldGroup.SectionHeader` 和 `FieldGroup.SectionFooter` 渲染完全自定义样式的页眉/页脚插槽，以替代默认的 `title` 文本。

**Android**

![Privacy 分区，包含 Share usage 开关和下方脚注](/static/images/expo-ui/examples/universal-fieldgroup-slots-android-light.webp)

**iOS**

![Privacy 分区，包含 Share usage 开关和下方脚注](/static/images/expo-ui/examples/universal-fieldgroup-slots-ios-light.webp)

```tsx FieldGroupSlotsExample.tsx
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Host, FieldGroup, Switch, Text } from '@expo/ui';

export default function FieldGroupSlotsExample() {
  const [enabled, setEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const ink = { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' };

  return (
    <Host style={{ flex: 1 }}>
      <FieldGroup>
        <FieldGroup.Section>
          <FieldGroup.SectionHeader>
            <Text textStyle={{ ...ink, fontSize: 16, fontWeight: '700' }}>Privacy</Text>
          </FieldGroup.SectionHeader>

          <Switch label="Share usage" value={enabled} onValueChange={setEnabled} />

          <FieldGroup.SectionFooter>
            <Text textStyle={{ fontSize: 12, color: '#8E8E93' }}>
              Helps us improve the app. You can disable this at any time.
            </Text>
          </FieldGroup.SectionFooter>
        </FieldGroup.Section>
      </FieldGroup>
    </Host>
  );
}
```

## API

```tsx
import { FieldGroup } from '@expo/ui';
```
