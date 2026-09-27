---
title: DatePicker 组件参考
description: A SwiftUI DatePicker component for selecting dates and times.
---

# DatePicker 组件参考

> 支持平台：iOS、Expo Go。

Expo UI DatePicker matches the official SwiftUI [DatePicker API](https://developer.apple.com/documentation/swiftui/datepicker) and supports styling via the [`datePickerStyle`](modifiers#datepickerstylestyle) modifier.

![Date and time DatePicker rows inside a Form](/static/images/expo-ui/datepicker/ios-light.webp)

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

## Date picker

![A Select a date row with the current date in a compact button](/static/images/expo-ui/examples/datepicker-date-ios-light.webp)

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

## Time picker

![A Select a time row with the current time in a compact button](/static/images/expo-ui/examples/datepicker-time-ios-light.webp)

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

## Date and time picker

![A Select date and time row with separate date and time buttons](/static/images/expo-ui/examples/datepicker-date-time-ios-light.webp)

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

## With date range

![A Select a date row clamped to 31 Dec 2024, the end of the allowed range](/static/images/expo-ui/examples/datepicker-range-ios-light.webp)

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

## Styling with modifiers

You can use the `datePickerStyle` modifier to change the appearance of the picker. Available styles are: `automatic`, `compact`, `graphical`, and `wheel`.

![A wheel style picker with day, month, and year columns](/static/images/expo-ui/examples/datepicker-wheel-ios-light.webp)

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

![A graphical style picker showing a month calendar with the current day selected](/static/images/expo-ui/examples/datepicker-graphical-ios-light.webp)

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

## Disabled picker

You can make the picker non-interactive using the `disabled` modifier.

![A Select a date row with the date as plain text and no tappable button](/static/images/expo-ui/examples/datepicker-disabled-ios-light.webp)

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

## Custom locale

Apply the `environment` modifier with the `locale` key to display the picker in a specific locale.

![A picker labelled Sélectionner la date showing the date in French](/static/images/expo-ui/examples/datepicker-locale-ios-light.webp)

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

## Custom time zone

Apply the `environment` modifier with the `timeZone` key to display the picker in a specific IANA time zone.

![A Tokyo time row showing the date and time in the Asia/Tokyo time zone](/static/images/expo-ui/examples/datepicker-timezone-ios-light.webp)

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
