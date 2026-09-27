---
title: Chip 组件参考
description: 用于显示紧凑元素的 Jetpack Compose Chip 组件。
---

# Chip 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 Chip 与官方 Jetpack Compose [Chip API](https://developer.android.com/develop/ui/compose/components/chip) 保持一致。每种芯片都是独立组件：`AssistChip`、`FilterChip`、`InputChip` 和 `SuggestionChip`。

![过滤、辅助和建议 Material 3 芯片](/static/images/expo-ui/chip/android-light.webp)

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

### 辅助芯片

辅助芯片帮助用户采取行动或开始任务，例如预订航班或打开地图。它们常常作为临时界面元素，响应用户输入而出现。

![带飞机图标和标签 Book flight 的轮廓辅助芯片](/static/images/expo-ui/examples/chip-assist-android-light.webp)

```tsx AssistChipExample.tsx
import {
  Host,
  AssistChip,
  Icon,
  Text,
} from '@expo/ui/jetpack-compose';

export default function AssistChipExample() {
  return (
    <Host matchContents>
      <AssistChip
        onClick={() => console.log('Opening flight booking...')}>
        <AssistChip.Label>
          <Text>Book flight</Text>
        </AssistChip.Label>
        <AssistChip.LeadingIcon>
          <Icon source={require('./assets/flight.xml')} size={18} />
        </AssistChip.LeadingIcon>
      </AssistChip>
    </Host>
  );
}
```

### 过滤芯片

过滤芯片让用户从一组选项中筛选内容。它们支持选中状态，常用于搜索栏或内容过滤。

![标签为 Images、处于选中填充状态的过滤芯片](/static/images/expo-ui/examples/chip-filter-android-light.webp)

```tsx FilterChipExample.tsx
import { useState } from 'react';
import { Host, FilterChip, Text } from '@expo/ui/jetpack-compose';

export default function FilterChipExample() {
  const [selected, setSelected] = useState(false);

  return (
    <Host matchContents>
      <FilterChip
        selected={selected}
        onClick={() => setSelected(!selected)}>
        <FilterChip.Label>
          <Text>Images</Text>
        </FilterChip.Label>
      </FilterChip>
    </Host>
  );
}
```

### 输入芯片

输入芯片表示用户输入的离散信息，例如文本框中的标签。它们支持头像、后置图标，并且可以关闭。

![三个输入芯片，标签分别为 Work、Travel 和 News，每个都有关闭图标](/static/images/expo-ui/examples/chip-input-android-light.webp)

```tsx InputChipExample.tsx
import { useState } from 'react';
import {
  Host,
  InputChip,
  Icon,
  Text,
  FlowRow,
} from '@expo/ui/jetpack-compose';

export default function InputChipExample() {
  const [chips, setChips] = useState(['Work', 'Travel', 'News']);

  return (
    <Host matchContents>
      <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
        {chips.map(label => (
          <InputChip
            key={label}
            selected
            onClick={() =>
              setChips(prev => prev.filter(c => c !== label))
            }>
            <InputChip.Label>
              <Text>{label}</Text>
            </InputChip.Label>
            <InputChip.TrailingIcon>
              <Icon
                source={require('./assets/close.xml')}
                size={18}
              />
            </InputChip.TrailingIcon>
          </InputChip>
        ))}
      </FlowRow>
    </Host>
  );
}
```

### 建议芯片

建议芯片通过呈现动态生成的建议来缩小用户意图，例如聊天中的快速回复或搜索细化。

![标签为 Nearby 的轮廓建议芯片](/static/images/expo-ui/examples/chip-suggestion-android-light.webp)

```tsx SuggestionChipExample.tsx
import {
  Host,
  SuggestionChip,
  Text,
} from '@expo/ui/jetpack-compose';

export default function SuggestionChipExample() {
  return (
    <Host matchContents>
      <SuggestionChip
        onClick={() => console.log('Searching nearby...')}>
        <SuggestionChip.Label>
          <Text>Nearby</Text>
        </SuggestionChip.Label>
      </SuggestionChip>
    </Host>
  );
}
```

## API

```tsx
import {
  AssistChip,
  FilterChip,
  InputChip,
  SuggestionChip,
} from '@expo/ui/jetpack-compose';
```
