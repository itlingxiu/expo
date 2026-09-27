---
title: DatePicker 组件参考
description: 用于选择日期和时间的 SwiftUI DatePicker 组件。
---

# DatePicker 组件参考

> 支持平台：iOS、Expo Go。

Expo UI 的 DatePicker 与官方 SwiftUI [DatePicker API](https://developer.apple.com/documentation/swiftui/datepicker) 保持一致，并支持通过 [`datePickerStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符设置样式。

![Form 内的日期和时间 DatePicker 行](/static/images/expo-ui/datepicker/ios-light.webp)

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

## 日期选择器

![Select a date 行，当前日期显示在紧凑按钮中](/static/images/expo-ui/examples/datepicker-date-ios-light.webp)

```tsx DatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';

export default function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 日期选择器会占满给定宽度，因此 `matchContents` 会把它压扁。
  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Select a date"
        selection={selectedDate}
        displayedComponents={['date']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

## 时间选择器

![Select a time 行，当前时间显示在紧凑按钮中](/static/images/expo-ui/examples/datepicker-time-ios-light.webp)

```tsx TimePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';

export default function TimePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Select a time"
        selection={selectedDate}
        displayedComponents={['hourAndMinute']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

## 日期与时间选择器

![Select date and time 行，日期和时间按钮分开](/static/images/expo-ui/examples/datepicker-date-time-ios-light.webp)

```tsx DateTimePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';

export default function DateTimePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Select date and time"
        selection={selectedDate}
        displayedComponents={['date', 'hourAndMinute']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

## 带日期范围

![Select a date 行被限制在 2024 年 12 月 31 日，即允许范围的结束](/static/images/expo-ui/examples/datepicker-range-ios-light.webp)

```tsx DateRangePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';

export default function DateRangePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Select a date"
        selection={selectedDate}
        displayedComponents={['date']}
        range={{
          start: new Date(2024, 0, 1),
          end: new Date(2024, 11, 31),
        }}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

## 用修饰符设置样式

可以使用 `datePickerStyle` 修饰符改变选择器外观。可用样式：`automatic`、`compact`、`graphical` 和 `wheel`。

![滚轮样式选择器，含日、月、年列](/static/images/expo-ui/examples/datepicker-wheel-ios-light.webp)

```tsx WheelDatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

export default function WheelDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        modifiers={[datePickerStyle('wheel')]}
        title="Select a date"
        selection={selectedDate}
        displayedComponents={['date']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

![图形样式选择器，显示月历且当前日被选中](/static/images/expo-ui/examples/datepicker-graphical-ios-light.webp)

```tsx GraphicalDatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

export default function GraphicalDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        modifiers={[datePickerStyle('graphical')]}
        title="Select a date"
        selection={selectedDate}
        displayedComponents={['date']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
      />
    </Host>
  );
}
```

## 禁用的选择器

可以使用 `disabled` 修饰符让选择器不可交互。

![Select a date 行，日期为纯文本，没有可点击按钮](/static/images/expo-ui/examples/datepicker-disabled-ios-light.webp)

```tsx DisabledDatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { disabled } from '@expo/ui/swift-ui/modifiers';

export default function DisabledDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Select a date"
        selection={selectedDate}
        displayedComponents={['date']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
        modifiers={[disabled()]}
      />
    </Host>
  );
}
```

## 自定义区域设置

对 `environment` 修饰符使用 `locale` 键，以特定区域设置显示选择器。

![标签为 Sélectionner la date 的选择器，以法语显示日期](/static/images/expo-ui/examples/datepicker-locale-ios-light.webp)

```tsx LocaleDatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { environment } from '@expo/ui/swift-ui/modifiers';

export default function LocaleDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Sélectionner la date"
        selection={selectedDate}
        displayedComponents={['date']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
        modifiers={[environment('locale', 'fr_FR')]}
      />
    </Host>
  );
}
```

## 自定义时区

对 `environment` 修饰符使用 `timeZone` 键，以特定 IANA 时区显示选择器。

![Tokyo time 行，以 Asia/Tokyo 时区显示日期和时间](/static/images/expo-ui/examples/datepicker-timezone-ios-light.webp)

```tsx TimeZoneDatePickerExample.tsx
import { useState } from 'react';
import { Host, DatePicker } from '@expo/ui/swift-ui';
import { environment } from '@expo/ui/swift-ui/modifiers';

export default function TimeZoneDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Host style={{ flex: 1 }}>
      <DatePicker
        title="Tokyo time"
        selection={selectedDate}
        displayedComponents={['date', 'hourAndMinute']}
        onDateChange={date => {
          setSelectedDate(date);
        }}
        modifiers={[environment('timeZone', 'Asia/Tokyo')]}
      />
    </Host>
  );
}
```

## API

```tsx
import { DatePicker } from '@expo/ui/swift-ui';
```
