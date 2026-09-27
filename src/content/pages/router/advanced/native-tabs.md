---
title: 原生标签页
description: 了解如何在 Expo Router 中使用原生标签页布局。
---

# 原生标签页

> 视频：[用 Expo Router 实现 Liquid Glass 标签页](https://www.youtube.com/watch?v=QqNZXdGFl44)。了解如何用 Expo Router 的原生标签页在 iOS 上创建 Liquid Glass 标签页。

标签页是在应用不同部分之间导航的常见方式。在 Expo Router 中，可以根据需要使用不同的标签页布局。本指南介绍原生标签页。与[其他标签页布局](/router/advanced/tabs#多种标签页布局)不同，原生标签页使用系统原生标签栏。

示例使用 `expo-router/native-tabs`，在 SDK 58 及更高版本中可用。在 SDK 54 到 57 中，请改用 `expo-router/unstable-native-tabs`。

其他标签页布局见：

- [自定义标签页](/router/advanced/custom-tabs)：如果应用需要系统标签页无法实现的完全自定义设计，请参阅自定义标签页。
- [JavaScript 标签页](/router/advanced/tabs)：如果你已经使用 React Navigation 的标签页，请参阅 JavaScript 标签页。

## 入门

可以用基于文件的路由创建标签页布局。示例文件结构如下：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/settings.tsx
```

上面的文件结构会生成屏幕底部带标签栏的布局。标签栏有两个标签：**Home** 和 **Settings**。

此处有示例截图，展示包含 Home 和 Settings 两个标签的标签栏。

可以用 **src/app/\_layout.tsx** 文件用标签页定义应用的根布局。该文件是标签栏和每个标签的主布局文件。在其中可以控制标签栏和每个标签项的外观与行为。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gear" drawable="custom_settings_drawable" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

最后是构成标签内容的两个标签文件：**src/app/index.tsx** 和 **src/app/settings.tsx**。

```tsx src/app/index.tsx and src/app/settings.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

名为 **index.tsx** 的标签文件是应用加载时的默认标签。第二个标签文件 **settings.tsx** 展示如何向标签栏添加更多标签。

:::note
与 Stack 导航器不同，标签不会自动添加到标签栏。需要在布局文件中使用 `NativeTabs.Trigger` 显式添加它们。
:::

## 自定义标签栏项

当你想自定义标签栏项时，建议使用为此设计的组件 API。目前可以自定义：

- **图标**：标签栏项中显示的图标。
- **标签**：标签栏项中显示的标签。
- **徽章**：标签栏项中显示的徽章。

### 图标

:::note
`NativeTabs.Trigger.Icon` 在 SDK 55 及更高版本中可用。对于 SDK 54，使用从 `expo-router/unstable-native-tabs` 导入的 `Icon`。
:::

可以用 `Icon` 组件自定义标签栏项中显示的图标。`Icon` 组件接受用于 Android Material Symbols 的 `md` 属性、用于 Apple SF Symbols 图标的 `sf` 属性，或用于自定义图片的 `src` 属性。

也可以向 `sf`、`xcasset`、`drawable`、`md` 或 `src` 属性传入 `{default: ..., selected: ...}`，为默认状态和选中状态指定不同图标。

:::note
在 Android 上，不同的选中图标需要 SDK 56 或更高版本（由 `react-native-screens` 4.25+ 提供）。在 SDK 55 上，`src` 接受对象形式，但选中变体会被忽略，两种状态都使用默认图标。`drawable` 和 `md` 属性在 SDK 55 上只接受字符串，因此传入一个用于两种状态的图标名称。
:::

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon src={require('../../../assets/setting_icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 56–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon src={require('../../../assets/setting_icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon src={require('../../../assets/setting_icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Icon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="custom_home_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon src={require('../../../assets/setting_icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

iOS 上的 Liquid Glass 会根据背景颜色是浅色还是深色自动改变颜色。没有用于此的回调，因此需要使用 `PlatformColor` 或 `DynamicColorIOS` 来设置图标颜色。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { DynamicColorIOS } from 'react-native';
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // 用于文本颜色
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      // 用于选中图标的颜色
      tintColor={DynamicColorIOS({
        dark: 'white',
        light: 'black',
      })}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('../assets/setting_icon.png'),
            selected: require('../assets/selected_setting_icon.png'),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { DynamicColorIOS } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // 用于文本颜色
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      // 用于选中图标的颜色
      tintColor={DynamicColorIOS({
        dark: 'white',
        light: 'black',
      })}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('../assets/setting_icon.png'),
            selected: require('../assets/selected_setting_icon.png'),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { DynamicColorIOS } from 'react-native';
import { NativeTabs, Icon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // 用于文本颜色
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      // 用于选中图标的颜色
      tintColor={DynamicColorIOS({
        dark: 'white',
        light: 'black',
      })}>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} drawable="custom_home_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon
          src={{
            default: require('../assets/setting_icon.png'),
            selected: require('../assets/selected_setting_icon.png'),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

#### 图标渲染模式

:::warning
图标渲染模式在 SDK 55 及更高版本中可用。
:::

在 iOS 上使用 `src` 或 `xcasset` 属性提供自定义图片时，可以用 `renderingMode` 属性控制图标的渲染方式：

- **`template`（默认）**：图标作为模板图像渲染，允许 iOS 应用着色颜色。这适合应匹配应用配色方案的单色图标。
- **`original`**：图标以其原始颜色渲染。这对带渐变或多色的图标很有用。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* 保留原始颜色的图标（例如渐变或多色图标） */}
      <NativeTabs.Trigger name="colorful">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/colorful_icon.png')}
          renderingMode="original"
        />
      </NativeTabs.Trigger>
      {/* 作为模板渲染的图标（默认行为） */}
      <NativeTabs.Trigger name="simple">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/simple_icon.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* 保留原始颜色的图标（例如渐变或多色图标） */}
      <NativeTabs.Trigger name="colorful">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/colorful_icon.png')}
          renderingMode="original"
        />
      </NativeTabs.Trigger>
      {/* 作为模板渲染的图标（默认行为） */}
      <NativeTabs.Trigger name="simple">
        <NativeTabs.Trigger.Icon
          src={require('../../../assets/simple_icon.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Icon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      {/* 保留原始颜色的图标（例如渐变或多色图标） */}
      <NativeTabs.Trigger name="colorful">
        <Icon src={require('../../../assets/colorful_icon.png')} renderingMode="original" />
      </NativeTabs.Trigger>
      {/* 作为模板渲染的图标（默认行为） */}
      <NativeTabs.Trigger name="simple">
        <Icon src={require('../../../assets/simple_icon.png')} renderingMode="template" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

:::note
`renderingMode` 属性只影响 iOS。在 Android 上，所有图片图标都以其原始颜色渲染。
:::

#### 资源目录图标（iOS）

:::note
此功能在 SDK 55 及更高版本中可用。
:::

在 iOS 上，可以用 `xcasset` 属性把 Xcode 资源目录中的图片用作标签图标。当你想通过 Xcode 的资源目录管理图标，而不是打包图片文件时，这很有用。

传入带资源名称的字符串，为默认状态和选中状态使用同一图标：

```tsx app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon xcasset="home-icon" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

要为默认状态和选中状态使用不同图标，传入一个对象：

```tsx app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          xcasset={{
            default: 'home-outline',
            selected: 'home-filled',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::note
资源目录图标与 `src` 图标一样支持 `renderingMode` 属性。设置 `iconColor` 时，图标默认使用 `template` 渲染。否则默认使用 `original`。
:::

#### 矢量图标

可以把图标字体（例如 [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) 提供的那些）渲染为图标，方法是把图片源传给 `src` 属性。每个图标集都暴露 `getImageSourceSync` 方法，它把字形光栅化为可以直接传给 `src` 的图片源。

这在 Android 上很有用，因为内置的 `md` 属性只渲染轮廓 Material Symbols。像 Material Design Icons 这样的图标字体同时提供轮廓和填充字形（例如 `home-outline` 和 `home`），因此可以显示不同的默认图标和选中图标。

首先，安装想使用的图标集以及 `@react-native-vector-icons/get-image`，后者提供 `getImageSourceSync` 所依赖的原生模块。下面的示例使用 `@react-native-vector-icons/material-design-icons` 图标集：

:::tabs
:::tab npm
```sh
npx expo install @react-native-vector-icons/material-design-icons @react-native-vector-icons/get-image
```
:::
:::tab yarn
```sh
yarn expo install @react-native-vector-icons/material-design-icons @react-native-vector-icons/get-image
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-vector-icons/material-design-icons @react-native-vector-icons/get-image
```
:::
:::tab bun
```sh
bun expo install @react-native-vector-icons/material-design-icons @react-native-vector-icons/get-image
```
:::
:::

:::note
`getImageSourceSync` 需要开发构建。安装这些包之后重新构建应用，以便打包原生模块和图标字体。
:::

`getImageSourceSync` 是同步的，因此在模块作用域计算一次图片源，而不是在每次渲染时计算。把 `src` 与 `sf` 结合起来，在 Android 上使用矢量图标，在 iOS 上使用 SF Symbols。在 iOS 上，`sf` 优先于 `src`；在 Android 上，图标回退到 `src`。

```tsx src/app/_layout.tsx
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { NativeTabs } from 'expo-router/native-tabs';

const homeIcon = MaterialDesignIcons.getImageSourceSync('home', 24, 'black');
const starOutlineIcon = MaterialDesignIcons.getImageSourceSync('star-outline', 24, 'black');
const starIcon = MaterialDesignIcons.getImageSourceSync('star', 24, 'black');

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        {/* iOS 使用 sf，Android 使用 src（矢量图标）。 */}
        <NativeTabs.Trigger.Icon sf="house" src={homeIcon} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        {/* 未选中时为轮廓，选中时为填充。 */}
        <NativeTabs.Trigger.Icon
          sf={{ default: 'star', selected: 'star.fill' }}
          src={{ default: starOutlineIcon, selected: starIcon }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::note
Android 上 `src` 的不同选中图标需要 SDK 56 或更高版本。见[本节开头](#图标)的说明。
:::

### 标签

可以用 `Label` 组件自定义标签栏项中显示的标签。`Label` 组件接受作为子项传入的字符串标签。如果没有提供标签，标签栏项会使用路由名称作为标签。

如果不想显示标签，可以用 `hidden` 属性隐藏标签。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

### 徽章

可以用 `Badge` 组件自定义标签栏项显示的徽章。徽章是标签上方的附加标记，可用于显示通知或未读消息数量。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Badge />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Badge />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Badge } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages">
        <Badge>9+</Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Badge />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

此处有示例截图，展示 Messages 和 Settings 标签上带有徽章的标签栏。

## 自定义标签栏

由于原生标签布局的外观因平台而异，自定义选项也不同。全部自定义选项见 [`NativeTabs` API 参考](/versions/latest/sdk/router/native-tabs)。

## 高级

### 隐藏标签栏

:::note
`hidden` 属性在 SDK 55 及更高版本中可用。
:::

可以用 `NativeTabs` 组件上的 `hidden` 属性隐藏标签栏。要为特定屏幕隐藏标签栏，可以用 context API 动态设置 `hidden` 属性。

```tsx src/context/TabBarContext.tsx
import { createContext } from 'react';

export const TabBarContext = createContext<{
  setIsTabBarHidden: (hidden: boolean) => void;
}>({
  setIsTabBarHidden: () => {},
});
```

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';
import { useState } from 'react';

import { TabBarContext } from '@/context/TabBarContext';

export default function TabLayout() {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);
  return (
    <TabBarContext value={{ setIsTabBarHidden }}>
      <NativeTabs hidden={isTabBarHidden}>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </TabBarContext>
  );
}
```

```tsx src/app/index.tsx
import { useFocusEffect } from 'expo-router';
import { use } from 'react';

import { TabBarContext } from '@/context/TabBarContext';

export default function HomeScreen() {
  const { setIsTabBarHidden } = use(TabBarContext);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  return (
    // 屏幕内容
  );
}
```

### 按条件隐藏标签

:::warning
动态隐藏标签会重新挂载导航器并重置状态。只在导航器挂载之前，或它对用户不可见时，更改标签的可见性。
:::

如果想根据条件隐藏标签，可以移除 trigger，或把 `hidden` 属性传给 `NativeTabs.Trigger` 组件。

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  const shouldHideMessagesTab = true; // 替换为你的条件
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="messages" hidden={shouldHideMessagesTab} />
    </NativeTabs>
  );
}
```

:::note
把标签标记为 `hidden` 意味着无法以任何方式导航到它。
:::

### 关闭行为

:::note
关闭行为在 SDK 55 及更高版本的 Android 上可用。
:::

默认情况下，点击已经处于活动状态的标签会关闭该标签栈中的所有屏幕并返回根屏幕。可以在 `NativeTabs.Trigger` 组件上设置 `disablePopToTop` 属性来禁用此行为。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disablePopToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disablePopToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disablePopToTop>
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

### 滚动到顶部

:::note
滚动到顶部在 SDK 55 及更高版本的 Android 上可用。
:::

默认情况下，点击已经处于活动状态并显示其根屏幕的标签，会把内容滚动回顶部。可以在 `NativeTabs.Trigger` 组件上设置 `disableScrollToTop` 属性来禁用此行为。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableScrollToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableScrollToTop>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableScrollToTop>
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

### 禁用的标签

:::note
`disabled` 属性在 SDK 56 及更高版本中可用。
:::

可以在 `NativeTabs.Trigger` 组件上设置 `disabled` 属性，阻止原生选中某个标签。当为 `true` 时，在标签栏中点击该标签不会改变焦点标签。该标签仍然可见。如果想把它从标签栏中完全移除，请使用 `hidden`。

:::note
`disabled` 只抑制原生点击交互。它不是“受保护”或授权门槛。`router.push('/settings')` 或 `<Link href="/settings" />` 这样的 JavaScript 导航仍然会导航到该标签。
:::

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings" disabled>
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

也可以从屏幕内部动态切换 `disabled`。

```tsx src/app/checkout.tsx
import { NativeTabs } from 'expo-router/native-tabs';
import { View } from 'react-native';

export default function CheckoutScreen() {
  const isProcessing = useIsProcessing();
  return (
    <View>
      <NativeTabs.Trigger disabled={isProcessing} />
      {/* ... */}
    </View>
  );
}
```

### iOS 26 功能

:::note
要使用本节描述的功能，请用 Xcode 26 或更高版本编译应用。
:::

#### 独立搜索标签

此处有示例截图，展示带有独立搜索标签的标签栏。

要添加独立搜索标签，把 `role` 的值设为 `search`，赋给想单独显示的原生标签。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Label>Search</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

#### 标签栏搜索输入

此处有示例截图，展示标签栏搜索。

要向标签栏添加搜索字段，把屏幕包裹在 Stack 导航器中并配置 `headerSearchBarOptions`。

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/search/_layout.tsx
src/app/search/index.tsx
```

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

```tsx src/app/search/_layout.tsx
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return <Stack />;
}
```

```tsx src/app/search/index.tsx
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function SearchIndex() {
  return (
    <>
      <Stack.Title>Search</Stack.Title>
      <Stack.SearchBar placement="automatic" placeholder="Search" onChangeText={() => {}} />
      <ScrollView>{/* 屏幕内容 */}</ScrollView>
    </>
  );
}
```

#### 标签栏最小化行为

此处有示例动画，展示标签栏最小化行为。

要在标签栏上实现最小化行为，可以在 `NativeTabs` 上使用 [`minimizeBehavior`](/versions/latest/sdk/router/native-tabs#minimizebehavior) 属性。在下面的示例中，向下滚动时标签栏会最小化。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab-1">
        <NativeTabs.Trigger.Label>Tab 1</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab-1">
        <NativeTabs.Trigger.Label>Tab 1</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tab-1">
        <Label>Tab 1</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

#### 底部附件

:::note
此功能在 SDK 55 及更高版本中可用。
:::

底部附件是出现在标签栏上方的浮动视图，可用于显示持久控件，例如迷你音乐播放器。更多细节见 Apple 的 [`UITabBarController` bottomAccessory 文档](https://developer.apple.com/documentation/uikit/uitabbarcontroller/bottomaccessory)。

底部附件可以出现在两种放置位置：`'regular'`（标签栏上方的标准位置）或 `'inline'`（紧凑模式，与标签栏内联）。使用 `usePlacement` hook 根据当前放置位置调整 UI。

:::warning
必须使用属性、context 或外部状态管理把状态存储在附件组件之外。底部附件组件会同时渲染两个实例（每种放置位置一个），它们之间**不**共享状态。
:::

下面的示例演示一个把状态提升到父组件的迷你播放器：

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

function MiniPlayer({ isPlaying, onToggle }) {
  const placement = NativeTabs.BottomAccessory.usePlacement();

  if (placement === 'inline') {
    // 内联放置时的紧凑 UI
    return (
      <Pressable onPress={onToggle} style={styles.inlinePlayer}>
        <Text>{isPlaying ? '⏸' : '▶'}</Text>
      </Pressable>
    );
  }

  // 常规放置时的完整 UI
  return (
    <View style={styles.regularPlayer}>
      <Text>Now Playing: Song Title</Text>
      <Pressable onPress={onToggle}>
        <Text>{isPlaying ? 'Pause' : 'Play'}</Text>
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  // 状态必须存储在 BottomAccessory 之外
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <NativeTabs>
      <NativeTabs.BottomAccessory>
        <MiniPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />
      </NativeTabs.BottomAccessory>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const styles = StyleSheet.create({
  inlinePlayer: {
    padding: 8,
  },
  regularPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});
```

### Android 上的键盘避让

:::note
此功能在 SDK 56 及更高版本中可用。
:::

在 Android 上，键盘默认会覆盖原生标签栏。要让标签栏改为抬到键盘上方，请在 `NativeTabs` 上传入 `tabBarRespectsIMEInsets` 属性：

```tsx app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs tabBarRespectsIMEInsets>
      <NativeTabs.Trigger name="index" />
      <NativeTabs.Trigger name="profile" />
    </NativeTabs>
  );
}
```

:::note
需要 Android 11 或更高版本，并且应用配置字段 [`android.softwareKeyboardLayoutMode`](/versions/latest/config/app#softwarekeyboardlayoutmode) 设为 `"resize"`（Expo 的默认值）。键盘打开时切换此属性，只有在键盘关闭之后才会生效。
:::

### 安全区域处理

:::note
此功能在 SDK 55 及更高版本中可用。
:::

原生标签页会自动处理安全区域内边距，行为因平台而异：

- **Android**：屏幕内容会自动包裹在 `SafeAreaView` 中，它为标签栏应用**底部**内边距。其他内边距（顶部、左侧、右侧）必须手动处理。
- **iOS**：嵌套在原生标签页屏幕内的第一个 `ScrollView` 启用了[自动内容内边距调整](https://reactnative.dev/docs/scrollview#contentinsetadjustmentbehavior-ios)。这确保内容在标签栏后面正确滚动。

#### 禁用自动内容内边距

如果需要完全控制安全区域处理，可以在 `NativeTabs.Trigger` 上使用 `disableAutomaticContentInsets` 属性禁用自动内容内边距调整：

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <Label>Home</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

当 `disableAutomaticContentInsets` 设为 `true` 时，必须手动管理安全区域内边距。可以使用 `react-native-screens/experimental` 的 `SafeAreaView`：

```tsx src/app/index.tsx
import { SafeAreaView } from 'react-native-screens/experimental';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={{ bottom: true }} style={{ flex: 1 }}>
      {/* 屏幕内容 */}
    </SafeAreaView>
  );
}
```

### 惰性加载

原生标签页中的所有标签屏幕在导航器挂载时都会急切渲染。此行为无法更改，因为原生标签栏需要每个屏幕都可用于过渡。如果某个标签包含你想推迟到用户实际访问该标签时再渲染的昂贵内容，可以使用以下方法之一。

#### 仅在获得焦点时渲染内容

使用 `useIsFocused` 有条件地渲染内容。用户离开时内容会卸载，回来时重新渲染。这意味着每次切换标签时都会丢失任何本地状态（滚动位置、表单输入）。

```tsx app/(tabs)/search.tsx
import { useIsFocused } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';

export default function SearchScreen() {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Expensive content that only renders when this tab is focused</Text>
    </View>
  );
}
```

#### 首次获得焦点时加载一次

使用 `useFocusEffect` 和状态标志，在标签第一次获得焦点时加载内容，然后保持挂载。

```tsx app/(tabs)/search.tsx
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function SearchScreen() {
  const [hasActivated, setHasActivated] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setHasActivated(true);
    }, [])
  );

  if (!hasActivated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Content that loads once and stays mounted</Text>
    </View>
  );
}
```

### 自定义 Web 布局

原生标签页在 Android 和 iOS 上渲染平台专属标签栏，但 Web 上没有标准的系统标签栏。在 Web 上，原生标签页回退到大致基于 iPad 设计的基本实现。可以使用 `expo-router/ui` 的无头标签页提供自定义 Web 布局，同时在移动端保留原生标签页。有两种设置方式。

#### 平台专属布局文件

在 **\_layout.tsx** 旁边使用 **\_layout.web.tsx** 文件。Web 文件会完全替换 Web 上的布局，因此每个平台可以有完全不同的布局。

```text
app/_layout.tsx — Android 和 iOS 的原生标签页
app/_layout.web.tsx — Web 的无头标签页
```

```tsx app/_layout.web.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

export default function WebLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          Home
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" style={styles.tab}>
          Settings
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  tab: {
    padding: 8,
  },
});
```

#### 带平台扩展的共享组件

把标签 UI 提取到带平台专属扩展的组件中。单个 **\_layout.tsx** 处理共享逻辑（provider、包装器、分析），并导入会解析到正确平台文件的标签组件。

```text
app/_layout.tsx — 共享布局，导入 AppTabs
components/app-tabs.tsx — Android 和 iOS 的原生标签页
components/app-tabs.web.tsx — Web 的无头标签页
```

```tsx app/_layout.tsx
import { ThemeProvider, DefaultTheme } from 'expo-router';
import AppTabs from '@/components/app-tabs';

export default function Layout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AppTabs />
    </ThemeProvider>
  );
}
```

```tsx components/app-tabs.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

```tsx components/app-tabs.web.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="index" href="/" style={styles.tab}>
          Home
        </TabTrigger>
        <TabTrigger name="settings" href="/settings" style={styles.tab}>
          Settings
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  tab: {
    padding: 8,
  },
});
```

- [自定义标签页](/router/advanced/custom-tabs)：进一步了解如何自定义来自 `expo-router/ui` 的无头标签页。
- [平台特定扩展](/router/advanced/platform-specific-modules)：了解 Expo Router 中 **.web.tsx** 这样的平台专属文件扩展如何工作。

## 将原生标签页从 SDK 54 迁移到 55

SDK 55 改变了访问标签栏项组件的方式。不要单独导入 `Icon`、`Label` 和 `Badge`，而应使用复合组件 API：`NativeTabs.Trigger.Icon`、`NativeTabs.Trigger.Label` 和 `NativeTabs.Trigger.Badge`。对于 Android 图标，`md` 属性是使用 Material Symbols 的新推荐方式。

```diff
diff --git a/app/_layout.tsx b/app/_layout.tsx
index 0000000..1111111 100644
--- a/app/_layout.tsx
+++ b/app/_layout.tsx
@@ -1,14 +1,10 @@
-import MIcons from '@expo/vector-icons/MaterialIcons';
-import { NativeTabs, Icon, Label, Badge, VectorIcon } from 'expo-router/unstable-native-tabs';
+import { NativeTabs } from 'expo-router/unstable-native-tabs';

 export default function TabLayout() {
   return (
     <NativeTabs>
       <NativeTabs.Trigger name="index">
-        <Label>Home</Label>
+        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
-        <Icon
-          sf="house.fill"
-          androidSrc={<VectorIcon family={MIcons} name="home" />}
-        />
+        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
-        <Badge>9+</Badge>
+        <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
       </NativeTabs.Trigger>
     </NativeTabs>
   );
```

## 从 JavaScript 标签页迁移

原生标签页并不是为了作为 [JavaScript 标签页](/router/advanced/tabs) 的直接替代而设计的。原生标签页受限于原生平台行为，而 JavaScript 标签页可以更自由地自定义。如果你对原生平台行为不感兴趣，可以继续使用 JavaScript 标签页。

### 使用 `Trigger` 而不是 `Screen`

`NativeTabs` 引入了 `Trigger` 的概念，用于向布局添加路由。与为自动添加的路由设置样式的 `Screen` 不同，`Trigger` 系统让你能更好地控制从标签栏隐藏和移除标签。

### 使用 React 组件而不是属性

`NativeTabs` 有一套 React 优先的 API，它选择用组件而不是属性对象来定义 UI。

```diff
diff --git a/app/_layout.tsx b/app/_layout.tsx
index 0000000..1111111 100644
--- a/app/_layout.tsx
+++ b/app/_layout.tsx
@@ -1,5 +1,3 @@
- <NativeTabs.Trigger name="index" options={{
-   tabBarIcon: ({ color, size }) => (
-     <Icon name="home" color={color} size={size} />
-   ),
- }}>
+ <NativeTabs.Trigger name="index">
+   <Icon sf="house" drawable="home_drawable" />
+ </NativeTabs.Trigger>
```

### 在标签页中使用 Stack

JavaScript `<Tabs />` 有一个模拟的栈标题栏，原生标签页中没有。你应该在原生标签页内嵌套原生 `<Stack />` 布局，以同时支持标题栏和压入屏幕。

## 常见问题

<details>
<summary>iOS 18 及更早版本上标签栏是透明的</summary>

在 iOS 18 及更早版本上，滚动到可滚动内容末尾时，原生标签栏会变为透明。这意味着滚动到 `ScrollView` 末尾时，或渲染静态 `View` 时，它会变为透明。

可以使用 [`disableTransparentOnScrollEdge`](/versions/latest/sdk/router/native-tabs#disabletransparentonscrolledge) 属性禁用此行为。

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

使用 `ScrollView` 且标签栏从一开始就是透明的时，请确保 `ScrollView` 是屏幕组件的第一个子项。如果用另一个组件包裹它，请确保在包装器组件上把 `collapsable` 设为 `false`。

```tsx src/app/index.tsx
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      <ScrollView>{/* 屏幕内容 */}</ScrollView>
    </View>
  );
}
```

</details>

<details>
<summary>在 iOS 26 上切换标签页时闪现白色背景</summary>

这是因为默认主题使用白色背景色。要修复，用合适的主题把应用包裹在 Expo Router 的 `ThemeProvider` 中。

:::note
`ThemeProvider`、`DarkTheme` 和 `DefaultTheme` 在 SDK 56 及更高版本中从 `expo-router` 导出。对于 SDK 55，请改从 `@react-navigation/native` 导入它们。
:::

**对于同时支持浅色和深色模式的应用：**

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
```

**对于仅深色模式的应用：**

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <NativeTabs>{/* 标签页 */}</NativeTabs>
    </ThemeProvider>
  );
}
```

**特定背景颜色的替代方案：**

如果需要与默认主题不匹配的特定背景颜色，可以在 `NativeTabs.Trigger` 上使用 [`contentStyle`](/versions/latest/sdk/router/native-tabs#contentstyle) 属性：

```tsx
<NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: '#1a1a2e' }}>
```

</details>

<details>
<summary>iOS 26 上标签栏背景属性没有效果</summary>

在 iOS 26 及更高版本上，系统用 Liquid Glass 绘制标签栏，并根据其背后的内容派生背景。`backgroundColor`、`blurEffect`、`shadowColor` 和 `disableTransparentOnScrollEdge` 属性只在 iOS 18 及更早版本上影响 iOS 标签栏。

这也意味着标签栏不会遵循只存在于 JavaScript 中的配色方案。用 [`Appearance.setColorScheme`](https://reactnative.dev/docs/appearance#setcolorscheme) 设置配色方案会改变其他原生视图所解析的界面样式，但也不会改变标签栏背景。

要让标签栏在 iOS 26 上匹配深色 UI，请让标签栏背后的内容变深，如[在 iOS 26 上切换标签页时闪现白色背景](#在-ios-26-上切换标签页时闪现白色背景)所述。

</details>

<details>
<summary>点击标签时滚动到顶部不起作用</summary>

点击活动标签应该把内容滚动到顶部，但如果 `ScrollView` 不是屏幕组件的第一个子项，这可能不起作用。

确保 `ScrollView` 是屏幕组件的直接第一个子项。如果用另一个组件包裹它，请确保在包装器组件上把 `collapsable` 设为 `false`。

```tsx src/app/index.tsx
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      <ScrollView>{/* 屏幕内容 */}</ScrollView>
    </View>
  );
}
```

</details>

<details>
<summary>iOS 26 深色模式下 Liquid Glass 标题按钮闪烁</summary>

带有 Liquid Glass 样式的标题按钮在 iOS 26 深色模式下切换标签时可能会闪烁或闪现背景。这是因为默认主题与系统深色模式不匹配，导致 Liquid Glass 渲染出现视觉伪影。

修复方法与白色背景闪烁问题相同：用合适的主题，用 `expo-router` 的 `<ThemeProvider>` 包裹布局。

:::note
`ThemeProvider`、`DarkTheme` 和 `DefaultTheme` 在 SDK 56 及更高版本中从 `expo-router` 导出。对于 SDK 55，请改从 `@react-navigation/native` 导入它们。
:::

**对于同时支持浅色和深色模式的应用：**

```tsx app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
```

**对于仅深色模式的应用：**

```tsx app/_layout.tsx
import { ThemeProvider, DarkTheme } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <NativeTabs>{/* 标签页 */}</NativeTabs>
    </ThemeProvider>
  );
}
```

</details>

## 已知限制

<details>
<summary>iOS 上默认图标和选中图标共享一种渲染模式</summary>

在 iOS 上，标签的默认图片图标和选中图片图标必须使用相同的[渲染模式](#图标渲染模式)。当它们解析为不同模式时，两个图标都使用默认图标的模式，并且 Expo Router 会在开发环境中记录警告。

当图标颜色只应用于其中一种状态时，模式会不一致。设置 `tintColor`、`iconColor={{ selected }}` 或 `Icon` 的 `selectedColor` 属性，却没有同时为默认状态设置颜色时，就会发生这种情况。颜色意味着 `'template'` 渲染，而未着色的图标默认为 `'original'`。只为一种状态设置 `renderingMode` 有相同效果。

要以相同方式渲染两个图标，请为两种状态都设置颜色，或在 `Icon` 上设置 `renderingMode`：

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    // iconColor 应用于两种状态，因此两个图标都作为模板渲染
    <NativeTabs iconColor={{ default: 'gray', selected: 'black' }}>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          src={{
            default: require('../assets/setting_icon.png'),
            selected: require('../assets/selected_setting_icon.png'),
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

此限制不适用于 SF Symbols，系统始终会对它们着色。

</details>

<details>
<summary>Android 上最多 5 个标签</summary>

在 Android 上，标签栏最多有 5 个标签的限制。此限制来自平台的 Material Tabs 组件。

</details>

<details>
<summary>无法测量标签栏高度</summary>

标签会移动位置：在 iPad 上渲染时有时在屏幕顶部，在 Apple Vision Pro 上运行时有时在屏幕侧面，等等。我们正在开发布局函数，以便将来提供更详细的布局信息。

</details>

<details>
<summary>不支持嵌套原生标签页</summary>

原生标签页不能嵌套在其他原生标签页内。仍然可以在原生标签页内嵌套 [JavaScript 标签页](/router/advanced/tabs)。

</details>

<details>
<summary>对 FlatList 的支持有限</summary>

[FlatList](https://reactnative.dev/docs/flatlist) 与原生标签页的集成有限制。滚动到顶部和滚动时最小化等功能不受支持。此外，检测滚动边缘可能会失败，导致标签栏显示为透明。要修复，请使用 [`disableTransparentOnScrollEdge`](/versions/latest/sdk/router/native-tabs#disabletransparentonscrolledge) 属性。

:::tabs
:::tab SDK 58 及更高版本

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 55–57

```tsx src/app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::tab SDK 54

```tsx app/_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

:::
:::

</details>

<details>
<summary>不支持动态添加或移除标签</summary>

运行时动态添加或移除标签不受支持。标签应在布局文件中静态定义，并在应用的整个生命周期中保持一致。这符合 [Apple 人机界面指南](https://developer.apple.com/design/human-interface-guidelines/tab-bars#Best-practices)的平台指南，它建议保持标签栏内容稳定，以帮助用户建立应用导航结构的心智模型。如果动态添加或移除标签，内容会被重新挂载，状态会丢失。

</details>

