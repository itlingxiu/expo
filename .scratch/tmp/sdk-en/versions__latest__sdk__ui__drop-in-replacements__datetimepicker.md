---
title: DateTimePicker
description: A date and time picker compatible with @react-native-community/datetimepicker.
packageName: @expo/ui
---

# DateTimePicker

> 支持平台：Android、iOS、Expo Go。

A `DateTimePicker` component with an API compatible with `@react-native-community/datetimepicker`. It uses Jetpack Compose on Android and SwiftUI on iOS, providing a modern Material 3 and SwiftUI appearance by default (the community module defaults to the older look on Android).

`DateTimePicker` component is fully declarative. Use the `presentation` prop to render the picker `'inline'` directly in the view hierarchy or as a `'dialog'` on Android. There is no Android imperative API (`DateTimePickerAndroid.open()`).

Under the hood this component wraps the platform-specific `@expo/ui` primitives:

- **Android**: [Jetpack Compose DateTimePicker](/versions/latest/sdk/ui/jetpack-compose/datetimepicker#datetimepicker) (inline), [DatePickerDialog/TimePickerDialog](/versions/latest/sdk/ui/jetpack-compose/datetimepicker#datepickerdialog) (dialog)
- **iOS**: [SwiftUI DatePicker](/versions/latest/sdk/ui/swift-ui/datepicker)

If you need lower-level control (custom modifiers, styles, or layouts), use those primitives directly.

![A Material 3 date picker dialog（Android）](/static/images/expo-ui/community-datetimepicker/android-light.webp)

![A compact date field showing 21 Aug 2026（iOS）](/static/images/expo-ui/community-datetimepicker/ios-light.webp)

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

## Migrating from `@react-native-community/datetimepicker`

- Update the import from `import DateTimePicker from '@react-native-community/datetimepicker'` to `import DateTimePicker from '@expo/ui/community/datetime-picker'`.
- There is no imperative `DateTimePickerAndroid.open()` API. Render the component and use `presentation="dialog"` instead.
- `minuteInterval`, `textColor`, `firstDayOfWeek`, `neutralButton`, `onNeutralButtonPress`, `fullscreen`, `title` and `startOnYearSelection` props are not supported.
- Use `timeZoneName` (IANA name) instead of `timeZoneOffsetInMinutes`.
- The `countdown` mode is not supported.
- `onError` prop is not needed.

## Basic usage

![A Material 3 date picker dialog for August 2026（Android）](/static/images/expo-ui/examples/community-datetimepicker-basic-android-light.webp)

![A compact date field showing 21 Aug 2026（iOS）](/static/images/expo-ui/examples/community-datetimepicker-basic-ios-light.webp)

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

## Time picker

![A Material 3 time picker dialog with a clock face（Android）](/static/images/expo-ui/examples/community-datetimepicker-time-android-light.webp)

![A compact time field（iOS）](/static/images/expo-ui/examples/community-datetimepicker-time-ios-light.webp)

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

## With date constraints

![A date picker dialog with the dates before today greyed out（Android）](/static/images/expo-ui/examples/community-datetimepicker-constrained-android-light.webp)

![An open calendar with the dates outside the allowed range greyed out（iOS）](/static/images/expo-ui/examples/community-datetimepicker-constrained-ios-light.webp)

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

## Dialog presentation

On Android, you can use `presentation="dialog"` to show the picker as a modal dialog. The dialog opens when the component mounts. Unmount it in response to `onValueChange` or `onDismiss`. On iOS, this prop is ignored and the picker always renders inline.

![A date picker dialog opened by the Pick a date button（Android）](/static/images/expo-ui/examples/community-datetimepicker-dialog-android-light.webp)

![A Pick a date button above a compact date field（iOS）](/static/images/expo-ui/examples/community-datetimepicker-dialog-ios-light.webp)

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

