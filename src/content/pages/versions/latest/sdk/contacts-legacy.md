---
title: Contacts (legacy) 包参考
description: 提供手机系统通讯录访问能力的库。
---

# Contacts (legacy) 包参考

:::note
通讯录 API 的 `legacy` 版本包含在 `expo-contacts` 库中。它可以与从根路径导出的、基于类的 `expo-contacts` API 一起使用。要使用旧版 API，请从 `expo-contacts/legacy` 导入。
:::

`expo-contacts` 提供对设备系统通讯录的访问，让你可以获取联系人信息，以及添加、编辑或删除联系人。

> 支持平台：Android、iOS、Expo Go。

在 iOS 上，联系人具有多层分组系统，你也可以通过此 API 访问。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-contacts
```
:::
:::tab yarn
```sh
yarn expo install expo-contacts
```
:::
:::tab pnpm
```sh
pnpm expo install expo-contacts
```
:::
:::tab bun
```sh
bun expo install expo-contacts
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-contacts`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `contactsPermission` | iOS | `"Allow $(PRODUCT_NAME) to access your contacts"` | 用于设置 [`NSContactsUsageDescription`](#ios) 权限说明的字符串。 |

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **android** 和 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 Android，在项目的 **android/app/src/main/AndroidManifest.xml** 中添加 `android.permission.READ_CONTACTS` 和 `android.permission.WRITE_CONTACTS` 权限：

  ```xml
  <uses-permission android:name="android.permission.READ_CONTACTS" />
  <uses-permission android:name="android.permission.WRITE_CONTACTS" />
  ```

- 对于 iOS，在项目的 **ios/[app]/Info.plist** 中添加 `NSContactsUsageDescription` 键：

  ```xml
  <key>NSContactsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your contacts</string>
  ```

## 用法

```jsx
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Contacts from 'expo-contacts/legacy';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Contacts Module Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```js
import * as Contacts from 'expo-contacts/legacy';
```

## 权限

### Android

此库会自动为应用添加 `READ_CONTACTS` 和 `WRITE_CONTACTS` 权限：

- `READ_CONTACTS`
- `WRITE_CONTACTS`

### iOS

此库使用以下用途说明键：

- `NSContactsUsageDescription`
