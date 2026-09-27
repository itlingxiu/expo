---
title: DateTimePicker 组件参考
description: Jetpack Compose components for selecting dates, date ranges, and times.
---

# DateTimePicker 组件参考

> 支持平台：Android、Expo Go。

Expo UI's date and time picker components match the official Jetpack Compose [Date Picker](https://developer.android.com/develop/ui/compose/components/datepickers), [Date Range Picker](https://developer.android.com/develop/ui/compose/components/datepickers#range), and [Time Picker](https://developer.android.com/develop/ui/compose/components/time-pickers) APIs.

> **Note:** The date variants render Material's calendar grid and input field, both of which scroll horizontally internally. The parent `Host` must provide a finite width on the horizontal axis, use `matchContents={{ vertical: true }}` together with `style={{ width: '100%' }}` (or any finite width). See [Match contents in Host reference](host#match-contents) for details.

> **Note:** `DateRangePicker` also scrolls vertically and fills the finite height provided by its parent. Place its `Host` in a bounded layout, such as one using `flex: 1`. Do not use `matchContents` on the vertical axis.

![Material 3 date picker showing a selected date in a calendar grid](/static/images/expo-ui/datetimepicker/android-light.webp)

## Installation

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

## Usage

### Date picker

![A Material 3 date picker showing August 2026 with the 14th selected](/static/images/expo-ui/examples/datetimepicker-date-android-light.webp)

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

### Time picker

![A 24-hour time picker dial set to 23:04 with the hour field selected](/static/images/expo-ui/examples/datetimepicker-time-android-light.webp)

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

### Input variant

Use `variant="input"` to display the picker as a text input field instead of the default picker UI.

![A date picker in input mode with a Date text field containing 08/14/2026](/static/images/expo-ui/examples/datetimepicker-input-android-light.webp)

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

### Date range picker

![A date range picker with a five day range selected and the days between it highlighted](/static/images/expo-ui/examples/datetimepicker-date-range-android-light.webp)

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

The callback's `end` value is `null` until the user finishes selecting the range.

### Date range picker dialog

![A modal date range picker dialog with an empty start and end date and Cancel and OK buttons](/static/images/expo-ui/examples/datetimepicker-date-range-dialog-android-light.webp)

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
