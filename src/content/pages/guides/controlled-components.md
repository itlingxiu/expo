---
title: 受控组件
description: 了解如何在 React Native 中使用受控组件来控制 TextInput、在用户输入时格式化文本、限制输入，并保持光标稳定。
---

# 受控组件

每个输入都有当前值，例如输入框中的文本、开关的位置，或选择器中的选中项。**受控组件**把这个值保存在你管理的状态中。输入显示状态所持有的内容，用户的每次更改都会更新该状态。这个状态是唯一的事实来源。

受控组件把设置值的 prop 与报告更改的回调配对。本页聚焦 [`TextInput`](https://reactnative.dev/docs/textinput)，即 React Native 用于输入文本的组件，因为文本输入是控制值最有用、也最难做对的地方。关于 `Switch`、`Checkbox` 和 `Picker`，参见[控制其他组件](#控制其他组件)。

## 控制文本输入

React Native 的 `TextInput` 组件默认是非受控的。它在内部保存文本，没有 [`value`](https://reactnative.dev/docs/textinput#value) prop 也能工作。传入 `value` 会让它变为受控。从那时起，React 会强制原生输入框与该 prop 一致。

下面的示例把名字保存在状态中。`value` 显示状态，[`onChangeText`](https://reactnative.dev/docs/textinput#onchangetext) 在每次按键时更新它：

```tsx
import { useState } from 'react';
import { TextInput } from 'react-native';

export default function NameInput() {
  const [name, setName] = useState('');

  return <TextInput value={name} onChangeText={setName} placeholder="Name" />;
}
```

在 React Native 中，这个更新循环是异步的：每次更新都要往返经过 JavaScript 线程。一次按键先更新原生输入框，然后触发 `onChangeText`。你的状态更新会触发重新渲染，新值再传回原生输入框。在 Web 上，React 针对 DOM 同步协调输入。大多数受控输入问题都源于这次往返。

下面的示意图展示一次按键如何经过更新循环：

> 本页包含一张交互式示意图，展示一次按键如何经过更新循环：原生输入框先更新，再触发 `onChangeText`，状态更新后重新渲染，新值传回原生输入框。

<details>
<summary>与 Web 上受控输入的差异</summary>

如果你写过[面向 Web 的受控输入](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)，在 React Native 中有三处变化：

- 常用的更改处理函数是 `onChangeText`，它直接接收新文本，而不是事件对象。
- React Native 没有 [`preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)，因此你不能在按键出现之前阻止它。请改为在 `onChangeText` 中清理文本，并通过 `value` 把结果传回去。
- 更新是异步的，因此输入框会在一次往返之后才反映你的状态。

下面的示例展示两个平台上的同一输入：

```tsx
// Web（react-dom）
<input value={text} onChange={event => setText(event.target.value)} />

// React Native
<TextInput value={text} onChangeText={setText} />
```

</details>

## 在受控与非受控输入之间选择

当某些东西必须对每次按键做出反应时，受控输入很有用：实时校验、统计字符、仅在字段有效后启用提交按钮，或在用户输入时格式化输入。

当你只需要交互结束时的值（例如用户提交搜索）时，非受控输入很有用。它也避免每次按键都重新渲染。要构建一个，用 [`defaultValue`](https://reactnative.dev/docs/textinput#defaultvalue) prop 设置初始文本，并用 [`onSubmitEditing`](https://reactnative.dev/docs/textinput#onsubmitediting) prop 读取最终值：

```tsx
import { TextInput } from 'react-native';

export default function SearchInput({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <TextInput
      defaultValue=""
      onSubmitEditing={event => onSearch(event.nativeEvent.text)}
      placeholder="Search"
      returnKeyType="search"
    />
  );
}
```

下表比较受控与非受控输入：

| | 受控 | 非受控 |
| --- | --- | --- |
| 值位于 | React 状态 | 原生输入 |
| 用什么设置 | `value` 和 `onChangeText` | `defaultValue` |
| 用什么读取 | React 状态 | `onChangeText`、`onSubmitEditing`、[`onEndEditing`](https://reactnative.dev/docs/textinput#onendediting) |
| 每次按键是否重新渲染 | 是 | 否 |
| 何时使用 | 实时校验、格式化、依赖该值的 UI | 搜索框、提交时才读取的表单 |

### 在用户输入时格式化

要在用户输入时把电话号码、货币金额或日期等文本格式化，请在 `onChangeText` 内转换字符串，并把格式化后的结果存回状态。

下面的示例在用户输入时格式化电话号码：

```tsx
import { useState } from 'react';
import { TextInput } from 'react-native';

function formatPhone(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PhoneInput() {
  const [phone, setPhone] = useState('');

  return (
    <TextInput
      value={phone}
      onChangeText={text => setPhone(formatPhone(text))}
      keyboardType="phone-pad"
      placeholder="(555) 123-4567"
    />
  );
}
```

因为格式化后的字符串与用户输入的不同，在上图步骤 2 和 5 之间的间隙中，输入框会短暂显示原始文本。

### 限制用户可以输入的内容

格式化会重写整个字符串。限制输入则是移除字符，接线方式相同。让 `onChangeText` 触发，去掉不需要的字符，再通过 `value` 把干净的值推回去。

下面的示例让字段中只保留数字：

```tsx
<TextInput
  value={amount}
  onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))}
  keyboardType="number-pad"
/>
```

对于长度限制和只读字段，优先使用 [`maxLength`](https://reactnative.dev/docs/textinput#maxlength) 和 [`editable`](https://reactnative.dev/docs/textinput#editable) prop。它们在原生侧生效，不会闪烁：

```tsx
// 限制长度
<TextInput value={code} onChangeText={setCode} maxLength={6} />

// 禁止一切编辑
<TextInput value={value} editable={false} />
```

设置 [`keyboardType`](https://reactnative.dev/docs/textinput#keyboardtype)（例如 `number-pad`、`decimal-pad` 或 `phone-pad`）会显示匹配的键盘，但不会强制任何内容：硬件键盘和粘贴的文本仍可以插入其他字符，因此请保留 `onChangeText` 过滤器。

### 强制大写输入

强制大写与格式化是同一模式。把转换与 [`autoCapitalize`](https://reactnative.dev/docs/textinput#autocapitalize) 配对，这样屏幕键盘从一开始就产生大写字母。

下面的示例以大写形式存储优惠码：

```tsx
<TextInput
  value={code}
  onChangeText={text => setCode(text.toUpperCase())}
  autoCapitalize="characters"
  placeholder="COUPON"
/>
```

### 格式化时保持光标位置

在 React Native 的[新架构](/guides/new-architecture)之前，在 `onChangeText` 内重新格式化值会把光标吸到字段末尾，这使得在输入中间编辑变得困难。

在使用新架构的 React Native 和 Expo 应用中，只要 `onChangeText` 原样传回文本，在字段中间输入就会保持光标位置。当它返回转换后的文本时，原生输入框必须把旧光标位置映射到新字符串上，而在转换插入或删除字符时，这种映射可能会出错。

要在格式化时保持光标稳定：

- 优先使用 `maxLength` 和 `editable` 等原生 prop，而不是在 JavaScript 中重新实现它们。参见[限制用户可以输入的内容](#限制用户可以输入的内容)。
- 使用为你处理光标计算的掩码库。参见[何时使用库](#何时使用库)。
- 把格式化移到 UI 线程。参见[用 worklet 消除格式化闪烁](#用-worklet-消除格式化闪烁)。

### 用 worklet 消除格式化闪烁

在 JavaScript 中格式化会经过状态和一次重新渲染，然后原生输入框才更新，因此字段可能在格式化值替换之前短暂显示原始文本。来自 [`@expo/ui`](/versions/latest/sdk/ui) 的通用 [`TextInput`](/versions/latest/sdk/ui/universal/textinput) 去掉了这次往返。它的 `value` 是用 `useNativeState` 创建的可观察状态对象，`onChangeText` 可以是在 UI 线程上同步运行的 worklet。格式化后的值与按键落在同一帧。

下面的示意图展示同一次按键在 worklet 路径上的流程：

> 本页包含一张交互式示意图，展示同一次按键在 worklet 路径上的流程：格式化在 UI 线程上同步完成，不必往返 JavaScript。

下面的示例在用户输入时于 UI 线程上格式化电话号码。它需要：

- `@expo/ui`：通用 `TextInput` 在 SDK 56 及更高版本中可用。参见[安装说明](/versions/latest/sdk/ui/universal/textinput#installation)。
- [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/)：worklet 函数需要它的运行时。

```tsx
import { Host, TextInput, useNativeState } from '@expo/ui';
import { useCallback } from 'react';

function formatPhone(input: string) {
  'worklet';
  const digits = input.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function PhoneMaskExample() {
  const phone = useNativeState('');
  const selection = useNativeState({ start: 0, end: 0 });

  const handleChangeText = useCallback(
    (value: string) => {
      'worklet';
      const formatted = formatPhone(value);
      if (formatted !== value) {
        phone.value = formatted;
        // 演示时吸到末尾。真正的掩码需要更聪明的光标处理。
        selection.value = { start: formatted.length, end: formatted.length };
      }
    },
    [phone, selection]
  );

  return (
    <Host matchContents={{ vertical: true }}>
      <TextInput
        value={phone}
        selection={selection}
        keyboardType="phone-pad"
        placeholder="(555) 123-4567"
        onChangeText={handleChangeText}
      />
    </Host>
  );
}
```

当格式化没有改变文本时，`formatted !== value` 检查会跳过重写。当掩码确实重写字符串时，要把 `selection.value` 与 `phone.value` 一起写入。否则光标会与重写后的文本失步，快速输入会把字符落到错误位置。当用户在字段末尾输入时，把光标移到末尾是最简单的正确行为。支持在字符串中间编辑的生产级掩码需要更聪明的光标处理。

`@expo/ui` 中特定平台的文本字段支持相同的受控与 worklet 模式。参见 [Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose/textfield#controlled-text-field) 和 [SwiftUI](/versions/latest/sdk/ui/swift-ui/textfield#controlled-text-field) 的受控文本字段示例，以及通用 `TextInput` 的 [worklet 掩码示例](/versions/latest/sdk/ui/universal/textinput#worklet-masking)。

## 何时使用库

手写格式化适用于一两个字段。库会为国际电话号码、货币分隔符、信用卡号和日期等边界情况处理光标计算与区域规则：

- 掩码：[`react-native-mask-input`](https://github.com/CaioQuirinoMedeiros/react-native-mask-input) 或 [`react-native-mask-text`](https://github.com/akinncar/react-native-mask-text)。
- 跨多个字段的表单状态与校验：[React Hook Form](https://react-hook-form.com/) 或 [Formik](https://formik.org/docs/guides/react-native)。使用 React Hook Form 时，把 `TextInput` 包在它的 `Controller` 组件中，因为 `register` 不会绑定到原生输入。

## 控制其他组件

受控模式不限于文本输入。任何把值 prop 与更改回调配对的组件都遵循与 `TextInput` 相同的模式。

[`Switch`](https://reactnative.dev/docs/switch) 是最严格的例子。`TextInput` 在你传入 `value` 时才进入受控模式，但 `Switch` 始终是受控的。除非 `onValueChange` 更新 `value` prop，否则开关会回到你传入的值。你可以把状态传给 `value`，并从 `onValueChange` 更新它，后者报告的是布尔值而不是字符串：

```tsx
import { useState } from 'react';
import { Switch } from 'react-native';

export default function NotificationsToggle() {
  const [enabled, setEnabled] = useState(false);

  return <Switch value={enabled} onValueChange={setEnabled} />;
}
```

其他组件中也出现同样的模式：

- [`RefreshControl`](https://reactnative.dev/docs/refreshcontrol) 把 `refreshing` 视为受控 prop。在 `onRefresh` 内把它设为 `true`，刷新完成后再设回 `false`。如果它从不变化，指示器会立刻停止。
- 来自 `expo-checkbox` 的 [`Checkbox`](/versions/latest/sdk/checkbox) 把 `value` 与 `onValueChange` 配对。
- 来自 `@react-native-picker/picker` 的 [`Picker`](/versions/latest/sdk/picker) 把 `selectedValue` 与 `onValueChange` 配对。

这些组件每次交互发出一个离散值，因此格式化文本带来的光标和闪烁问题并不适用。

## 更多资源

- [`@expo/ui` 参考中的 `TextInput`](/versions/latest/sdk/ui/universal/textinput)：基于 worklet 的输入、其安装方式，以及完整的 prop 列表。
- [键盘处理](/guides/keyboard-handling)：管理屏幕键盘周围的布局。
- [React Native 文档中的 `TextInput`](https://reactnative.dev/docs/textinput)：核心组件的完整 prop 列表。
