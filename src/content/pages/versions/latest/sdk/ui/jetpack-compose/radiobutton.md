---
title: RadioButton 组件参考
description: 用于单选控件的 Jetpack Compose RadioButton 组件。
---

# RadioButton 组件参考

> 支持平台：Android、Expo Go。

用于从一组选项中选择单个选项的单选按钮组件。对应官方 Jetpack Compose [RadioButton](https://developer.android.com/develop/ui/compose/components/radio-button) API。

![选中和未选中的 Material 3 单选按钮](/static/images/expo-ui/radiobutton/android-light.webp)

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

### 基本单选按钮

带 `onClick` 处理函数的独立单选按钮。

![处于选中状态的单个单选按钮](/static/images/expo-ui/examples/radiobutton-basic-android-light.webp)

```tsx BasicRadioButton.tsx
import { useState } from 'react';
import { Host, RadioButton } from '@expo/ui/jetpack-compose';

export default function BasicRadioButton() {
  const [selected, setSelected] = useState(false);

  return (
    <Host matchContents>
      <RadioButton
        selected={selected}
        onClick={() => setSelected(!selected)}
      />
    </Host>
  );
}
```

### 单选组（推荐）

单选组的推荐模式遵循 [Compose 无障碍指南](https://developer.android.com/develop/ui/compose/components/radio-button)：

- 用带 `selectableGroup()` 修改器的 `Column` 包裹整组，让屏幕阅读器把这些选项视为一组。
- 在每个 `Row` 上应用 `selectable` 修改器并设置 `role: 'radioButton'`，使整行（包括标签）都可点击。
- 不要给 `RadioButton` 本身传入 `onClick`，由行来处理交互。这样触摸目标更大。

![三行单选，标签为 Calls、Missed 和 Friends，Calls 被选中](/static/images/expo-ui/examples/radiobutton-group-android-light.webp)

```tsx RadioGroup.tsx
import { useState } from 'react';
import {
  Host,
  Column,
  Row,
  RadioButton,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  selectable,
  selectableGroup,
  fillMaxWidth,
  height,
  padding,
} from '@expo/ui/jetpack-compose/modifiers';

export default function RadioGroup() {
  const colors = useMaterialColors();
  const [selectedOption, setSelectedOption] = useState('Calls');
  const options = ['Calls', 'Missed', 'Friends'];

  return (
    <Host matchContents>
      <Column modifiers={[selectableGroup()]}>
        {options.map(label => (
          <Row
            key={label}
            verticalAlignment="center"
            modifiers={[
              fillMaxWidth(),
              height(56),
              selectable(
                label === selectedOption,
                () => setSelectedOption(label),
                'radioButton'
              ),
              padding(16, 0, 16, 0),
            ]}>
            <RadioButton selected={label === selectedOption} />
            <Text
              color={colors.onBackground}
              modifiers={[padding(16, 0, 0, 0)]}>
              {label}
            </Text>
          </Row>
        ))}
      </Column>
    </Host>
  );
}
```

## API

```tsx
import { RadioButton } from '@expo/ui/jetpack-compose';
```
