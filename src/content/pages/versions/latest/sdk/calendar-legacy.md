---
title: Calendar (legacy) 包参考
description: 提供与设备系统日历、事件、提醒及相关记录交互的 API 的库。
---

# Calendar (legacy) 包参考

:::note
日历 API 的 `legacy` 版本包含在 `expo-calendar` 库中。它可以与从根路径导出的、基于类的 `expo-calendar` API 一起使用。要使用旧版 API，请从 `expo-calendar/legacy` 导入。
:::

`expo-calendar` 提供与设备系统日历、事件、提醒及相关记录交互的 API。

> 支持平台：Android、iOS、Expo Go。

此外，它还提供方法来启动系统提供的日历界面，让用户查看或编辑事件。在 Android 上，这些方法使用 Intent 启动系统日历应用。在 iOS 上，它们会以模态形式呈现 [`EKEventViewController`](https://developer.apple.com/documentation/eventkitui/ekeventviewcontroller) 或 [`EKEventEditViewController`](https://developer.apple.com/documentation/eventkitui/ekeventeditviewcontroller)。

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

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **android** 和 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 Android，在项目的 **android/app/src/main/AndroidManifest.xml** 中添加 `android.permission.READ_CALENDAR` 和 `android.permission.WRITE_CALENDAR` 权限：

  ```xml
  <uses-permission android:name="android.permission.READ_CALENDAR" />
  <uses-permission android:name="android.permission.WRITE_CALENDAR" />
  ```

- 对于 iOS，在项目的 **ios/[app]/Info.plist** 中添加 `NSCalendarsUsageDescription` 和 `NSRemindersUsageDescription`：

  ```xml
  <key>NSCalendarsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your calendar</string>
  <key>NSRemindersUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your reminders</string>
  ```

## 用法

```jsx
import { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import * as Calendar from 'expo-calendar/legacy';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar" onPress={createCalendar} />
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
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
import * as Calendar from 'expo-calendar/legacy';
```

## 权限

### Android

如果只打算使用系统提供的日历界面，则不需要请求任何权限。

否则，你必须在 **app.json** 的 [`expo.android.permissions`](/versions/latest/config/app#permissions) 数组中添加以下权限。

- `READ_CALENDAR`
- `WRITE_CALENDAR`

### iOS

如果只打算使用系统提供的日历界面，通过 `createEventInCalendarAsync` 创建事件，则不需要请求权限。

此库使用以下用途说明键：

- `NSCalendarsUsageDescription`
- `NSRemindersUsageDescription`
