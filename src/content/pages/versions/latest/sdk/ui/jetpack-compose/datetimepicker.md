---
title: DateTimePicker 组件参考
description: 用于选择日期、日期范围和时间的 Jetpack Compose 组件。
---

# DateTimePicker 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的日期与时间选择器组件与官方 Jetpack Compose [Date Picker](https://developer.android.com/develop/ui/compose/components/datepickers)、[Date Range Picker](https://developer.android.com/develop/ui/compose/components/datepickers#range) 和 [Time Picker](https://developer.android.com/develop/ui/compose/components/time-pickers) API 保持一致。

:::note
日期变体会渲染 Material 的日历网格和输入框，二者内部都会水平滚动。父级 `Host` 必须在水平轴上提供有限宽度，请把 `matchContents={{ vertical: true }}` 与 `style={{ width: '100%' }}`（或任何有限宽度）一起使用。详见 [Host 参考中的匹配内容尺寸](/versions/latest/sdk/ui/jetpack-compose/host#匹配内容尺寸)。
:::

:::note
`DateRangePicker` 也会垂直滚动，并填满父级提供的有限高度。把它的 `Host` 放在有界布局中，例如使用 `flex: 1` 的布局。不要在垂直轴上使用 `matchContents`。
:::

![Material 3 日期选择器，在日历网格中显示选中的日期](/static/images/expo-ui/datetimepicker/android-light.webp)

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

### 日期选择器

![Material 3 日期选择器显示 2026 年 8 月，14 日被选中](/static/images/expo-ui/examples/datetimepicker-date-android-light.webp)

```tsx DatePickerExample.tsx
import { useState } from 'react';
import { Host, DateTimePicker } from '@expo/ui/jetpack-compose';

export default function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <DateTimePicker
        onDateSelected={date => {
          setSelectedDate(date);
        }}
        displayedComponents="date"
        initialDate={selectedDate.toISOString()}
        variant="picker"
      />
    </Host>
  );
}
```

### 时间选择器

![24 小时制时间选择器拨盘设为 23:04，小时字段被选中](/static/images/expo-ui/examples/datetimepicker-time-android-light.webp)

```tsx TimePickerExample.tsx
import { useState } from 'react';
import { Host, DateTimePicker } from '@expo/ui/jetpack-compose';

export default function TimePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <DateTimePicker
        onDateSelected={date => {
          setSelectedDate(date);
        }}
        displayedComponents="hourAndMinute"
        initialDate={selectedDate.toISOString()}
        variant="picker"
      />
    </Host>
  );
}
```

### 输入变体

使用 `variant="input"` 把选择器显示为文本输入框，而不是默认的选择器界面。

![输入模式下的日期选择器，Date 文本框内容为 08/14/2026](/static/images/expo-ui/examples/datetimepicker-input-android-light.webp)

```tsx InputVariantExample.tsx
import { useState } from 'react';
import { Host, DateTimePicker } from '@expo/ui/jetpack-compose';

export default function InputVariantExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <DateTimePicker
        onDateSelected={date => {
          setSelectedDate(date);
        }}
        displayedComponents="date"
        initialDate={selectedDate.toISOString()}
        variant="input"
      />
    </Host>
  );
}
```

### 日期范围选择器

![日期范围选择器选中了五天范围，其间的日期被高亮](/static/images/expo-ui/examples/datetimepicker-date-range-android-light.webp)

```tsx DateRangePickerAndroidExample.tsx
import { useState } from 'react';
import {
  DateRangePicker,
  type DateRangeSelection,
  Host,
} from '@expo/ui/jetpack-compose';

export default function DateRangePickerAndroidExample() {
  const [range, setRange] = useState<DateRangeSelection>({
    start: new Date(),
    end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });

  return (
    <Host style={{ flex: 1 }}>
      <DateRangePicker
        initialStartDate={range.start?.toISOString()}
        initialEndDate={range.end?.toISOString()}
        onDateRangeSelected={setRange}
      />
    </Host>
  );
}
```

回调的 `end` 值在用户完成范围选择之前为 `null`。

### 日期范围选择器对话框

![模态日期范围选择器对话框，开始和结束日期为空，带 Cancel 和 OK 按钮](/static/images/expo-ui/examples/datetimepicker-date-range-dialog-android-light.webp)

```tsx DateRangePickerDialogExample.tsx
import { useState } from 'react';
import { Button } from 'react-native';
import {
  DateRangePickerDialog,
  type DateRangeSelection,
  Host,
} from '@expo/ui/jetpack-compose';

export default function DateRangePickerDialogExample() {
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<DateRangeSelection>({
    start: null,
    end: null,
  });

  return (
    <>
      <Button
        title="Select dates"
        onPress={() => setVisible(true)}
      />
      {visible && (
        <Host>
          <DateRangePickerDialog
            initialStartDate={range.start?.toISOString()}
            initialEndDate={range.end?.toISOString()}
            onDateRangeSelected={selectedRange => {
              setRange(selectedRange);
              setVisible(false);
            }}
            onDismissRequest={() => setVisible(false)}
          />
        </Host>
      )}
    </>
  );
}
```

## API

```tsx
import {
  DateRangePicker,
  DateRangePickerDialog,
  DateTimePicker,
} from '@expo/ui/jetpack-compose';
```
