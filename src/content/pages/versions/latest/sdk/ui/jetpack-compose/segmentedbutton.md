---
title: SegmentedButton 组件参考
description: 用于单选或多选的 Jetpack Compose Segmented Button 组件。
---

# SegmentedButton 组件参考

> 支持平台：Android、Expo Go。

分段按钮让应用用户从并排显示在一行中的一小套选项里进行选择。它们对应官方 Jetpack Compose [Segmented Button](https://developer.android.com/develop/ui/compose/components/segmented-button) API。

有两种容器类型：

- **`SingleChoiceSegmentedButtonRow`**：一次只能选中一个按钮（类似单选按钮）。
- **`MultiChoiceSegmentedButtonRow`**：多个按钮可以独立切换（类似复选框）。

![单选分段按钮行，选项为 Day、Week 和 Month](/static/images/expo-ui/segmentedbutton/android-light.webp)

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

### 单选分段按钮

一次只能有一个选项处于活动状态时，使用 `SingleChoiceSegmentedButtonRow`。每个 `SegmentedButton` 接受 `selected` 和 `onClick` 属性。

![单选分段行，含 Day、Week、Month 和 Year，其中 Day 被选中](/static/images/expo-ui/examples/segmentedbutton-single-android-light.webp)

```tsx SingleChoiceExample.tsx
import { useState } from 'react';
import {
  Host,
  SingleChoiceSegmentedButtonRow,
  SegmentedButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function SingleChoiceExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ['Day', 'Week', 'Month', 'Year'];

  return (
    <Host matchContents>
      <SingleChoiceSegmentedButtonRow>
        {options.map((label, index) => (
          <SegmentedButton
            key={label}
            selected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}>
            <SegmentedButton.Label>
              <Text>{label}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Host>
  );
}
```

### 多选分段按钮

多个选项可以独立切换时，使用 `MultiChoiceSegmentedButtonRow`。每个 `SegmentedButton` 接受 `checked` 和 `onCheckedChange` 属性。

![多选分段行，Wi-Fi 和 NFC 已选中，Bluetooth 和 GPS 未选中](/static/images/expo-ui/examples/segmentedbutton-multi-android-light.webp)

```tsx MultiChoiceExample.tsx
import { useState } from 'react';
import {
  Host,
  MultiChoiceSegmentedButtonRow,
  SegmentedButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function MultiChoiceExample() {
  const [checkedItems, setCheckedItems] = useState([
    false,
    false,
    false,
    false,
  ]);
  const options = ['Wi-Fi', 'Bluetooth', 'NFC', 'GPS'];

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <MultiChoiceSegmentedButtonRow>
        {options.map((label, index) => (
          <SegmentedButton
            key={label}
            checked={checkedItems[index]}
            onCheckedChange={checked => {
              setCheckedItems(prev => {
                const next = [...prev];
                next[index] = checked;
                return next;
              });
            }}>
            <SegmentedButton.Label>
              <Text>{label}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </MultiChoiceSegmentedButtonRow>
    </Host>
  );
}
```

### 自定义颜色

在 `SegmentedButton` 上使用 `colors` 属性，自定义活动、非活动和禁用状态下的外观。

![价格档位分段行，选中段填充为紫色](/static/images/expo-ui/examples/segmentedbutton-colors-android-light.webp)

```tsx CustomColorsExample.tsx
import { useState } from 'react';
import {
  Host,
  SingleChoiceSegmentedButtonRow,
  SegmentedButton,
  Text,
} from '@expo/ui/jetpack-compose';

export default function CustomColorsExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = ['$', '$$', '$$$', '$$$$'];

  return (
    <Host matchContents>
      <SingleChoiceSegmentedButtonRow>
        {options.map((label, index) => (
          <SegmentedButton
            key={label}
            selected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
            colors={{
              activeContainerColor: '#6200EE',
              activeContentColor: '#FFFFFF',
            }}>
            <SegmentedButton.Label>
              <Text>{label}</Text>
            </SegmentedButton.Label>
          </SegmentedButton>
        ))}
      </SingleChoiceSegmentedButtonRow>
    </Host>
  );
}
```

## API

```tsx
import {
  SingleChoiceSegmentedButtonRow,
  MultiChoiceSegmentedButtonRow,
  SegmentedButton,
} from '@expo/ui/jetpack-compose';
```
