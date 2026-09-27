---
title: DateTimePicker 包参考
description: 与 @react-native-community/datetimepicker 兼容的日期和时间选择器。
---

# DateTimePicker 包参考

> 支持平台：Android、iOS、Expo Go。

与 `@react-native-community/datetimepicker` API 兼容的 `DateTimePicker` 组件。它在 Android 上使用 Jetpack Compose，在 iOS 上使用 SwiftUI，默认提供现代的 Material 3 和 SwiftUI 外观（社区模块在 Android 上默认是较旧的外观）。

`DateTimePicker` 组件是完全声明式的。用 `presentation` 属性把选择器以 `'inline'` 直接渲染在视图层级中，或在 Android 上渲染为 `'dialog'`。没有 Android 命令式 API（`DateTimePickerAndroid.open()`）。

在底层，这个组件封装了平台专用的 `@expo/ui` 原语：

- **Android**：[Jetpack Compose DateTimePicker](/versions/latest/sdk/ui/jetpack-compose/datetimepicker#datetimepicker)（内联）、[DatePickerDialog/TimePickerDialog](/versions/latest/sdk/ui/jetpack-compose/datetimepicker#datepickerdialog)（对话框）
- **iOS**：[SwiftUI DatePicker](/versions/latest/sdk/ui/swift-ui/datepicker)

如果需要更底层的控制（自定义修饰符、样式或布局），请直接使用这些原语。

![Material 3 日期选择器对话框（Android）](/static/images/expo-ui/community-datetimepicker/android-light.webp)

![显示 2026 年 8 月 21 日的紧凑日期字段（iOS）](/static/images/expo-ui/community-datetimepicker/ios-light.webp)

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

## 从 `@react-native-community/datetimepicker` 迁移

- 把导入从 `import DateTimePicker from '@react-native-community/datetimepicker'` 改为 `import DateTimePicker from '@expo/ui/community/datetime-picker'`。
- 没有命令式的 `DateTimePickerAndroid.open()` API。渲染该组件，并改用 `presentation="dialog"`。
- 不支持 `minuteInterval`、`textColor`、`firstDayOfWeek`、`neutralButton`、`onNeutralButtonPress`、`fullscreen`、`title` 和 `startOnYearSelection` 属性。
- 使用 `timeZoneName`（IANA 名称）代替 `timeZoneOffsetInMinutes`。
- 不支持 `countdown` 模式。
- 不需要 `onError` 属性。

## 基本用法

![2026 年 8 月的 Material 3 日期选择器对话框（Android）](/static/images/expo-ui/examples/community-datetimepicker-basic-android-light.webp)

![显示 2026 年 8 月 21 日的紧凑日期字段（iOS）](/static/images/expo-ui/examples/community-datetimepicker-basic-ios-light.webp)

```tsx
import { useState } from 'react';
import DateTimePicker from '@expo/ui/community/datetime-picker';

export default function DateTimePickerExample() {
  const [date, setDate] = useState(new Date());

  return (
    <DateTimePicker
      value={date}
      onValueChange={(event, selectedDate) => {
        setDate(selectedDate);
      }}
      mode="date"
    />
  );
}
```

## 时间选择器

![带表盘的 Material 3 时间选择器对话框（Android）](/static/images/expo-ui/examples/community-datetimepicker-time-android-light.webp)

![紧凑的时间字段（iOS）](/static/images/expo-ui/examples/community-datetimepicker-time-ios-light.webp)

```tsx
import { useState } from 'react';
import DateTimePicker from '@expo/ui/community/datetime-picker';

export default function TimePickerExample() {
  const [date, setDate] = useState(new Date());

  return (
    <DateTimePicker
      value={date}
      onValueChange={(event, selectedDate) => {
        setDate(selectedDate);
      }}
      mode="time"
    />
  );
}
```

## 带日期约束

![今天之前的日期被置灰的日期选择器对话框（Android）](/static/images/expo-ui/examples/community-datetimepicker-constrained-android-light.webp)

![允许范围之外的日期被置灰的展开日历（iOS）](/static/images/expo-ui/examples/community-datetimepicker-constrained-ios-light.webp)

```tsx
import { useState } from 'react';
import DateTimePicker from '@expo/ui/community/datetime-picker';

const today = new Date();
const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

export default function ConstrainedDatePickerExample() {
  const [date, setDate] = useState(new Date());

  return (
    <DateTimePicker
      value={date}
      onValueChange={(event, selectedDate) => {
        setDate(selectedDate);
      }}
      mode="date"
      minimumDate={today}
      maximumDate={thirtyDaysFromNow}
    />
  );
}
```

## 对话框呈现

在 Android 上，可以用 `presentation="dialog"` 把选择器显示为模态对话框。组件挂载时对话框会打开。在响应 `onValueChange` 或 `onDismiss` 时卸载它。在 iOS 上，这个属性会被忽略，选择器始终以内联方式渲染。

![由「选择日期」按钮打开的日期选择器对话框（Android）](/static/images/expo-ui/examples/community-datetimepicker-dialog-android-light.webp)

![紧凑日期字段上方的「选择日期」按钮（iOS）](/static/images/expo-ui/examples/community-datetimepicker-dialog-ios-light.webp)

```tsx
import { useState } from 'react';
import { Button, View } from 'react-native';
import DateTimePicker from '@expo/ui/community/datetime-picker';

export default function AndroidDialogExample() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  return (
    <View>
      <Button title="Pick a date" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          onValueChange={(event, selectedDate) => {
            setShow(false);
            setDate(selectedDate);
          }}
          onDismiss={() => {
            setShow(false);
          }}
          mode="date"
          presentation="dialog"
        />
      )}
    </View>
  );
}
```

## API

```tsx
import DateTimePicker from '@expo/ui/community/datetime-picker';
```
