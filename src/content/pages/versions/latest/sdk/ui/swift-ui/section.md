---
title: Section 组件参考
description: 用于在列表和表单中分组内容的 SwiftUI Section 组件。
---

# Section 组件参考

> 支持平台：iOS、tvOS、Expo Go。

Expo UI 的 Section 与官方 SwiftUI [Section API](https://developer.apple.com/documentation/swiftui/section) 保持一致，用于在 [`List`](/versions/latest/sdk/ui/swift-ui/list)、[`Form`](/versions/latest/sdk/ui/swift-ui/form) 或 [`Picker`](/versions/latest/sdk/ui/swift-ui/picker) 中把相关内容分组。

![Form 中的两个 Section，各自带标题和分组的 Toggle](/static/images/expo-ui/section/ios-light.webp)

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

### 带标题的基本分区

使用 `title` 属性创建带文本标题的简单分区。

![列表带 Settings 标题，下方是 General、Privacy 和 Notifications 行](/static/images/expo-ui/examples/section-basic-ios-light.webp)

```tsx BasicSectionExample.tsx
import { Host, List, Section, Text } from '@expo/ui/swift-ui';

export default function BasicSectionExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Settings">
          <Text>General</Text>
          <Text>Privacy</Text>
          <Text>Notifications</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### 自定义页眉和页脚的分区

使用 `header` 和 `footer` 属性提供自定义视图。只有在未提供 `title` 时才会使用这些属性。

![分区页眉带定位图标，中间是开关行，下方是页脚文本](/static/images/expo-ui/examples/section-header-footer-ios-light.webp)

```tsx CustomHeaderFooterExample.tsx
import {
  Host,
  List,
  Section,
  Toggle,
  Text,
  HStack,
  Image,
} from '@expo/ui/swift-ui';
import { useState } from 'react';

export default function CustomHeaderFooterExample() {
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section
          header={
            <HStack>
              <Image
                systemName="location.fill"
                color="blue"
                size={16}
              />
              <Text>Location Services</Text>
            </HStack>
          }
          footer={
            <Text>
              Enabling location services allows the app to provide
              personalized recommendations.
            </Text>
          }>
          <Toggle
            label="Enable location"
            isOn={locationEnabled}
            onIsOnChange={setLocationEnabled}
          />
        </Section>
      </List>
    </Host>
  );
}
```

### 可折叠分区

使用 `isExpanded` 属性控制分区是展开还是折叠。提供该属性后，分区变为可折叠。使用 `onIsExpandedChange` 处理状态变化。

:::note
可折叠分区需要 iOS 17+ 和 tvOS 17+，并且列表必须使用 `sidebar` 样式。可折叠分区不支持页脚。
:::

![两个折叠的分区 Favorites 和 Recents，各自带展开箭头](/static/images/expo-ui/examples/section-collapsible-ios-light.webp)

```tsx CollapsibleSectionExample.tsx
import { useState } from 'react';
import { Host, List, Section, Text } from '@expo/ui/swift-ui';
import { listStyle } from '@expo/ui/swift-ui/modifiers';

export default function CollapsibleSectionExample() {
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const [recentsExpanded, setRecentsExpanded] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle('sidebar')]}>
        <Section
          title="Favorites"
          isExpanded={favoritesExpanded}
          onIsExpandedChange={setFavoritesExpanded}>
          <Text>Home</Text>
          <Text>Work</Text>
          <Text>Gym</Text>
        </Section>
        <Section
          title="Recents"
          isExpanded={recentsExpanded}
          onIsExpandedChange={setRecentsExpanded}>
          <Text>Coffee Shop</Text>
          <Text>Library</Text>
          <Text>Park</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### 表单中的多个分区

分区可以放在 `Form` 组件中，把表单控件组织成逻辑分组。

![表单包含 Appearance、Notifications 和 Account 分区，里面有开关、选择器和红色的 Sign out 按钮](/static/images/expo-ui/examples/section-form-ios-light.webp)

```tsx FormSectionsExample.tsx
import { useState } from 'react';
import {
  Host,
  Form,
  Section,
  Toggle,
  Picker,
  Text,
  Button,
} from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

export default function FormSectionsExample() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState(0);
  const languages = ['English', 'Spanish', 'French', 'German'];

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Appearance">
          <Toggle
            label="Dark Mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
          <Picker
            label="Language"
            selection={language}
            onSelectionChange={setLanguage}
            modifiers={[pickerStyle('menu')]}>
            {languages.map((lang, index) => (
              <Text key={index} modifiers={[tag(index)]}>
                {lang}
              </Text>
            ))}
          </Picker>
        </Section>
        <Section title="Notifications">
          <Toggle
            label="Push Notifications"
            isOn={notifications}
            onIsOnChange={setNotifications}
          />
        </Section>
        <Section title="Account">
          <Button
            label="Sign out"
            role="destructive"
            onPress={() => alert('Signed out')}
          />
        </Section>
      </Form>
    </Host>
  );
}
```

## API

```tsx
import { Section } from '@expo/ui/swift-ui';
```
