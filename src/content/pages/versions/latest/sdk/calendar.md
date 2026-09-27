---
title: Calendar 包参考
description: 提供与设备系统日历、事件、提醒及相关记录交互的 API 的库。
---

# Calendar 包参考

:::note
为了更快地提供更新，`expo-calendar` 目前在 Expo Go 和 Snack 中不受支持。要使用它，请创建[开发构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。
:::

`expo-calendar` 提供与设备系统日历、事件、提醒及相关记录交互的 API。

> 支持平台：iOS*、Android*。

此外，它还提供方法来启动系统提供的日历界面，让用户查看或编辑事件。在 iOS 上，它们会以模态形式呈现 [`EKEventViewController`](https://developer.apple.com/documentation/eventkitui/ekeventviewcontroller) 或 [`EKEventEditViewController`](https://developer.apple.com/documentation/eventkitui/ekeventeditviewcontroller)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-calendar
```
:::
:::tab yarn
```sh
yarn expo install expo-calendar
```
:::
:::tab pnpm
```sh
pnpm expo install expo-calendar
```
:::
:::tab bun
```sh
bun expo install expo-calendar
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-calendar`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-calendar",
        {
          "calendarPermission": "The app needs to access your calendar."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `calendarPermission` | iOS | `"Allow $(PRODUCT_NAME) to access your calendar"` | 用于设置 [`NSCalendarsUsageDescription`](#ios) 权限说明的字符串。 |
| `remindersPermission` | iOS | `"Allow $(PRODUCT_NAME) to access your reminders"` | 用于设置 [`NSRemindersUsageDescription`](#ios) 权限说明的字符串。 |
| `writeOnlyCalendarPermission` | iOS | `"Allow $(PRODUCT_NAME) to add events to your calendars"` | 用于设置 [`NSCalendarsWriteOnlyAccessUsageDescription`](#ios) 权限说明的字符串，在请求只写日历访问权限时显示（iOS 17 及以上）。仅当 `writeOnlyAccess` 为 `true` 时使用。 |
| `writeOnlyAccess` | iOS | `false` | 为 `true` 时，请求只写日历访问权限（iOS 17 及以上）。会设置 `NSCalendarsWriteOnlyAccessUsageDescription`，并省略 `NSCalendarsFullAccessUsageDescription`。 |

要本地化 iOS 日历或提醒权限说明，请在每个[语言区域文件](/guides/localization#translating-app-metadata)的 `ios` 对象中添加对应的用途说明键。`calendarPermission` 属性会同时设置 `NSCalendarsUsageDescription` 和 `NSCalendarsFullAccessUsageDescription`，`remindersPermission` 会同时设置 `NSRemindersUsageDescription` 和 `NSRemindersFullAccessUsageDescription`。Expo 会在预构建期间把本地化后的值写入 **InfoPlist.strings**。

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 iOS，在项目的 **ios/[app]/Info.plist** 中添加 `NSCalendarsUsageDescription`、`NSCalendarsFullAccessUsageDescription` 和 `NSRemindersUsageDescription`：

  ```xml
  <key>NSCalendarsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your calendar</string>
  <key>NSCalendarsFullAccessUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your calendar</string>
  <key>NSRemindersUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your reminders</string>
  ```

  在 iOS 17 及以上请求只写日历访问权限时，添加 `NSCalendarsWriteOnlyAccessUsageDescription`，而不是 `NSCalendarsFullAccessUsageDescription`：

  ```xml
  <key>NSCalendarsWriteOnlyAccessUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to add events to your calendars</string>
  ```

## 用法

```jsx
import * as Calendar from 'expo-calendar';
import { useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const BasicUsage = () => {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissions();
      if (status === 'granted') {
        const calendars = Calendar.getCalendars(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log(JSON.stringify(calendars));
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar" onPress={createCalendar} />
    </View>
  );
};

async function createCalendar() {
  const newCalendar = await Calendar.createCalendar({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
  });
  console.log(`Your new calendar: ${JSON.stringify(newCalendar)}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
```

## API

```js
import * as Calendar from 'expo-calendar';
```

除非另有说明，所有日期都以 ISO 8601 格式返回。

## 权限

### Android

如果只打算使用系统提供的日历界面，则不需要请求任何权限。

否则，你必须在 **app.json** 的 [`expo.android.permissions`](/versions/latest/config/app#permissions) 数组中添加以下权限。

- `READ_CALENDAR`
- `WRITE_CALENDAR`

### iOS

若只添加事件、而不读取已有日历数据，请在[配置插件](#在应用配置中配置)中启用 `writeOnlyAccess` 选项，并向 `requestCalendarPermissions` 传入 `true` 以请求只写访问权限。这对于 `ExpoCalendar.createEvent` 等方法已经足够。读取日历数据的方法，例如 `getCalendars`、`listEvents` 或 `presentPicker`，需要完整的日历访问权限。

此库使用以下用途说明键：

- `NSCalendarsUsageDescription`
- `NSCalendarsFullAccessUsageDescription`：向用户说明应用为何请求对用户日历数据的完整访问权限。
- `NSCalendarsWriteOnlyAccessUsageDescription`：向用户说明应用为何请求对用户日历数据的只写访问权限。
- `NSRemindersUsageDescription`
