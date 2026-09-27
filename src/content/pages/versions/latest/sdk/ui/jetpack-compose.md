---
title: Jetpack Compose
description: 使用 @expo/ui 构建原生 Android 界面的 Jetpack Compose 组件。
---

# Jetpack Compose

> 支持平台：Android、Expo Go。

`@expo/ui/jetpack-compose` 中的 Jetpack Compose 组件允许你从 React Native 中使用 Jetpack Compose 构建完全原生的 Android 界面。

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

使用 `@expo/ui/jetpack-compose` 中的组件时，需要将其包裹在 [`Host`](/versions/latest/sdk/ui/jetpack-compose/host) 组件中。`Host` 是 Jetpack Compose 视图的容器。

```tsx
import { Host, Button } from '@expo/ui/jetpack-compose';

export function SaveButton() {
  return (
    <Host matchContents>
      <Button onClick={() => alert('Saved!')}>Save changes</Button>
    </Host>
  );
}
```

- [使用 Jetpack Compose 扩展](/versions/latest/sdk/ui/jetpack-compose/extending) — 创建与 Expo UI 集成的自定义 Jetpack Compose 组件和修改器。

## 可用组件

- [AlertDialog](/versions/latest/sdk/ui/jetpack-compose/alertdialog) — 用于显示原生警报对话框的 AlertDialog 组件。
- [Badge](/versions/latest/sdk/ui/jetpack-compose/badge) — 用于显示状态指示和计数的 Badge 组件。
- [BadgedBox](/versions/latest/sdk/ui/jetpack-compose/badgedbox) — 用于在内容上叠加徽章的 BadgedBox 组件。
- [BasicAlertDialog](/versions/latest/sdk/ui/jetpack-compose/basicalertdialog) — 用于显示包含自定义内容对话框的 BasicAlertDialog 组件。
- [Box](/versions/latest/sdk/ui/jetpack-compose/box) — 用于堆叠子元素的 Box 组件。
- [Button](/versions/latest/sdk/ui/jetpack-compose/button) — 用于显示原生 Material 3 按钮的 Button 组件。
- [Card](/versions/latest/sdk/ui/jetpack-compose/card) — 用于在样式化容器中显示内容的 Card 组件。
- [Carousel](/versions/latest/sdk/ui/jetpack-compose/carousel) — 用于显示可滚动项目集合的 Carousel 组件。
- [Checkbox](/versions/latest/sdk/ui/jetpack-compose/checkbox) — 用于选择控件的 Checkbox 组件。
- [Chip](/versions/latest/sdk/ui/jetpack-compose/chip) — 用于显示紧凑元素的 Chip 组件。
- [Column](/versions/latest/sdk/ui/jetpack-compose/column) — 用于垂直放置子元素的 Column 组件。
- [DateTimePicker](/versions/latest/sdk/ui/jetpack-compose/datetimepicker) — 用于选择日期和时间的 DateTimePicker 组件。
- [Divider](/versions/latest/sdk/ui/jetpack-compose/divider) — 用于创建视觉分隔线的 Divider 组件。
- [DockedSearchBar](/versions/latest/sdk/ui/jetpack-compose/dockedsearchbar) — 用于显示内联搜索输入框的 DockedSearchBar 组件。
- [DropdownMenu](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu) — 用于显示下拉菜单的 DropdownMenu 组件。
- [ExposedDropdownMenuBox](/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox) — 用于显示展开式下拉菜单的 ExposedDropdownMenuBox 组件。
- [FloatingActionButton](/versions/latest/sdk/ui/jetpack-compose/floatingactionbutton) — 用于显示原生悬浮操作按钮的 FloatingActionButton 组件。
- [FlowRow](/versions/latest/sdk/ui/jetpack-compose/flowrow) — 用于以流动布局放置子元素的 FlowRow 组件。
- [HorizontalFloatingToolbar](/versions/latest/sdk/ui/jetpack-compose/horizontalfloatingtoolbar) — 用于在内容上方显示悬浮工具栏的 HorizontalFloatingToolbar 组件。
- [HorizontalPager](/versions/latest/sdk/ui/jetpack-compose/horizontalpager) — 用于水平分页内容的 HorizontalPager 组件。
- [Host](/versions/latest/sdk/ui/jetpack-compose/host) — 在 React Native 中渲染 Jetpack Compose 视图的容器组件。
- [Icon](/versions/latest/sdk/ui/jetpack-compose/icon) — 用于显示图标的 Icon 组件。
- [IconButton](/versions/latest/sdk/ui/jetpack-compose/iconbutton) — 用于显示图标按钮的 IconButton 组件。
- [Image](/versions/latest/sdk/ui/jetpack-compose/image) — 用于显示图片的 Image 组件。
- [LazyColumn](/versions/latest/sdk/ui/jetpack-compose/lazycolumn) — 用于显示高效纵向滚动列表的 LazyColumn 组件。
- [LazyRow](/versions/latest/sdk/ui/jetpack-compose/lazyrow) — 用于显示高效横向滚动列表的 LazyRow 组件。
- [ListItem](/versions/latest/sdk/ui/jetpack-compose/listitem) — 用于显示列表项的 ListItem 组件。
- [LoadingIndicator](/versions/latest/sdk/ui/jetpack-compose/loadingindicator) — 用于显示加载动画的 LoadingIndicator 组件。
- [Material Colors](/versions/latest/sdk/ui/jetpack-compose/colors) — 用于访问 Material 3 调色板的工具。
- [ModalBottomSheet](/versions/latest/sdk/ui/jetpack-compose/bottomsheet) — 用于显示模态底部弹层的 ModalBottomSheet 组件。
- [Modifiers](/versions/latest/sdk/ui/jetpack-compose/modifiers) — 用于调整组件外观与布局的修改器。
- [NavigationBar](/versions/latest/sdk/ui/jetpack-compose/navigationbar) — 用于应用导航的 NavigationBar 组件。
- [Progress indicators](/versions/latest/sdk/ui/jetpack-compose/progress) — 用于显示进度的进度指示器组件。
- [PullToRefreshBox](/versions/latest/sdk/ui/jetpack-compose/pulltorefreshbox) — 用于下拉刷新手势的 PullToRefreshBox 组件。
- [RadioButton](/versions/latest/sdk/ui/jetpack-compose/radiobutton) — 用于单选控件的 RadioButton 组件。
- [RNHostView](/versions/latest/sdk/ui/jetpack-compose/rnhostview) — 在 Jetpack Compose 中嵌入 React Native 视图的组件。
- [Row](/versions/latest/sdk/ui/jetpack-compose/row) — 用于水平放置子元素的 Row 组件。
- [SearchBar](/versions/latest/sdk/ui/jetpack-compose/searchbar) — 用于搜索输入功能的 SearchBar 组件。
- [SegmentedButton](/versions/latest/sdk/ui/jetpack-compose/segmentedbutton) — 用于单项或多项选择的 Segmented Button 组件。
- [Shape](/versions/latest/sdk/ui/jetpack-compose/shape) — 用于绘制几何图形的 Shape 组件。
- [Slider](/versions/latest/sdk/ui/jetpack-compose/slider) — 用于从范围内选择数值的 Slider 组件。
- [Snackbar](/versions/latest/sdk/ui/jetpack-compose/snackbar) — 显示在屏幕底部、在不打断用户的情况下提供反馈的简短通知。
- [Spacer](/versions/latest/sdk/ui/jetpack-compose/spacer) — 用于在元素之间添加弹性空间的 Spacer 组件。
- [Surface](/versions/latest/sdk/ui/jetpack-compose/surface) — 用于样式化内容容器的 Surface 组件。
- [Switch](/versions/latest/sdk/ui/jetpack-compose/switch) — 用于开关控件的 Switch 组件。
- [Text](/versions/latest/sdk/ui/jetpack-compose/text) — 用于显示样式化文本的 Text 组件。
- [TextField](/versions/latest/sdk/ui/jetpack-compose/textfield) — 用于原生 Material 3 文本输入的 TextField 组件。
- [ToggleButton](/versions/latest/sdk/ui/jetpack-compose/togglebutton) — 用于显示原生 Material 3 切换按钮的 ToggleButton 组件。
- [Tooltip](/versions/latest/sdk/ui/jetpack-compose/tooltip) — 用于在长按时显示上下文信息的 Tooltip 组件。
- [useNativeState](/versions/latest/sdk/ui/jetpack-compose/usenativestate) — 创建在 JavaScript 与原生 Jetpack Compose 视图之间共享的可观察状态的 React Hook。

## 示例

### 修改器

修改器通过 `modifiers` 属性按数组顺序应用。把 `background` 放在 `paddingAll` 之前，这样内边距位于背景内部而不是外部。

![一个紫色填充标签位于浅紫色边框标签上方，两者都有内边距且占满宽度](/static/images/expo-ui/examples/jetpack-compose-index-modifiers-android-light.webp)

```tsx ComposeModifiersExample.tsx
import { Column, Host, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  border,
  fillMaxWidth,
  paddingAll,
  shadow,
} from '@expo/ui/jetpack-compose/modifiers';

export default function ComposeModifiersExample() {
  return (
    <Host style={{ flex: 1 }}>
      <Column
        verticalArrangement={{ spacedBy: 16 }}
        modifiers={[paddingAll(16)]}>
        <Text
          color="#FFFFFF"
          modifiers={[
            fillMaxWidth(),
            shadow(4),
            background('#6750A4'),
            paddingAll(16),
          ]}>
          Background, shadow and padding
        </Text>
        <Text
          color="#1D192B"
          modifiers={[
            fillMaxWidth(),
            background('#E8DEF8'),
            border(2, '#6750A4'),
            paddingAll(16),
          ]}>
          Background, border and padding
        </Text>
      </Column>
    </Host>
  );
}
```

### 设置界面

将 `ListItem` 的各个插槽与 `Switch` 和 `Icon` 组合，即可构建 Material 3 风格的设置界面。

![一个带开关的飞行模式行，上方是显示 Expo Guest 和箭头的 Wi-Fi 行](/static/images/expo-ui/examples/jetpack-compose-index-settings-screen-android-light.webp)

```tsx ComposeSettingsScreenExample.tsx
import {
  Column,
  Host,
  Icon,
  ListItem,
  Switch,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import ChevronRight from '@expo/material-symbols/chevron_right.xml';
import Flight from '@expo/material-symbols/flight.xml';
import Wifi from '@expo/material-symbols/wifi.xml';
import { useState } from 'react';

export default function ComposeSettingsScreenExample() {
  const [airplaneMode, setAirplaneMode] = useState(true);
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <ListItem>
          <ListItem.LeadingContent>
            <Icon
              source={Flight}
              tint={colors.onSurfaceVariant}
              contentDescription="Airplane mode"
            />
          </ListItem.LeadingContent>
          <ListItem.HeadlineContent>
            <Text>Airplane mode</Text>
          </ListItem.HeadlineContent>
          <ListItem.TrailingContent>
            <Switch
              value={airplaneMode}
              onCheckedChange={setAirplaneMode}
            />
          </ListItem.TrailingContent>
        </ListItem>
        <ListItem>
          <ListItem.LeadingContent>
            <Icon
              source={Wifi}
              tint={colors.onSurfaceVariant}
              contentDescription="Wi-Fi"
            />
          </ListItem.LeadingContent>
          <ListItem.HeadlineContent>
            <Text>Wi-Fi</Text>
          </ListItem.HeadlineContent>
          <ListItem.SupportingContent>
            <Text>Expo Guest</Text>
          </ListItem.SupportingContent>
          <ListItem.TrailingContent>
            <Icon
              source={ChevronRight}
              tint={colors.onSurfaceVariant}
              contentDescription="Open"
            />
          </ListItem.TrailingContent>
        </ListItem>
      </Column>
    </Host>
  );
}
```

### 亮度行

亮度或音量控件的一种常见模式是用图标夹住 `Slider`。给 `Slider` 一个 `weight` 修改器，让它占据图标剩下的空间。

![一个亮度滑块位于暗色和亮色背光图标之间](/static/images/expo-ui/examples/jetpack-compose-index-brightness-row-android-light.webp)

```tsx ComposeBrightnessRowExample.tsx
import {
  Host,
  Icon,
  Row,
  Slider,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  paddingAll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import BacklightHigh from '@expo/material-symbols/backlight_high.xml';
import BacklightLow from '@expo/material-symbols/backlight_low.xml';
import { useState } from 'react';

export default function ComposeBrightnessRowExample() {
  const [brightness, setBrightness] = useState(0.5);
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Row
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 12 }}
        modifiers={[paddingAll(16)]}>
        <Icon
          source={BacklightLow}
          tint={colors.onSurfaceVariant}
          contentDescription="Dimmer"
        />
        <Slider
          value={brightness}
          onValueChange={setBrightness}
          modifiers={[weight(1)]}
        />
        <Icon
          source={BacklightHigh}
          tint={colors.onSurfaceVariant}
          contentDescription="Brighter"
        />
      </Row>
    </Host>
  );
}
```

### 次要文本

第二行文本使用 `ListItem.SupportingContent`，并使用 `useMaterialColors` 获取跟随浅色和深色主题的文本颜色。

![一个 Chrome 行，灰色的次要文本显示 Last used Today，右侧显示 1.57 GB](/static/images/expo-ui/examples/jetpack-compose-index-secondary-text-android-light.webp)

```tsx ComposeSecondaryTextExample.tsx
import {
  Column,
  Host,
  ListItem,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';

export default function ComposeSecondaryTextExample() {
  const colors = useMaterialColors();

  return (
    <Host style={{ flex: 1 }}>
      <Column>
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>Chrome</Text>
          </ListItem.HeadlineContent>
          <ListItem.SupportingContent>
            <Text color={colors.onSurfaceVariant}>
              Last used: Today
            </Text>
          </ListItem.SupportingContent>
          <ListItem.TrailingContent>
            <Text color={colors.onSurfaceVariant}>1.57 GB</Text>
          </ListItem.TrailingContent>
        </ListItem>
      </Column>
    </Host>
  );
}
```
