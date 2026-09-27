---
title: SecureStore 包参考
description: 用于在设备本地加密并安全存储键值对的库。
---

# SecureStore 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

`expo-secure-store` 提供在设备本地加密并安全存储键值对的方法。每个 Expo 项目都有独立的存储系统，无法访问其他 Expo 项目的存储。

**过大的载荷可能会被底层平台拒绝。历史上，某些 iOS 版本会拒绝大约超过 2048 字节的值。Expo 不强制限制，因此如果你打算存储非常大的字符串，请务必处理原生错误。**

**当生物识别可用时，Expo Go 不支持 `requireAuthentication` 选项，因为缺少 `NSFaceIDUsageDescription` 键。**

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-secure-store
```
:::
:::tab yarn
```sh
yarn expo install expo-secure-store
```
:::
:::tab pnpm
```sh
pnpm expo install expo-secure-store
```
:::
:::tab bun
```sh
bun expo install expo-secure-store
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-secure-store`。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `configureAndroidBackup` | `true` | 仅 Android。表示是否配置 Android 自动备份，使其与 `expo-secure-store` 正确配合的布尔值。[了解更多](#android-自动备份)。 |
| `faceIDPermission` | `"Allow $(PRODUCT_NAME) to access your Face ID biometric data."` | 仅 iOS。用于设置 [`NSFaceIDUsageDescription`](#ios) 权限提示文案的字符串。 |

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

在 **Info.plist** 中添加 `NSFaceIDUsageDescription` 键：

```xml
<key>NSFaceIDUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to access your Face ID biometric data.</string>
```

</details>

## 平台上的值存储

### Android

在 Android 上，值存储在 [`SharedPreferences`](https://developer.android.com/training/data-storage/shared-preferences) 中，并用 [Android 的 Keystore 系统](https://developer.android.com/training/articles/keystore.html)加密。

### iOS

在 iOS 上，值通过[钥匙串服务](https://developer.apple.com/documentation/security/keychain_services)以 `kSecClassGenericPassword` 存储。**由于 iOS 钥匙串的底层特性，用 `expo-secure-store` 存储的数据在应用以相同 Bundle ID 重新安装后，会在卸载后仍然保留。** 这是 iOS 钥匙串系统的预期行为，设计应用的数据处理时应考虑到这一点。iOS 还可以额外设置值的 `kSecAttrAccessible` 属性，用来控制何时可以读取该值。

## 数据持久性

`expo-secure-store` 旨在提供跨应用重启和更新的持久数据存储。不过，不要把它当作不可替代的关键数据的唯一事实来源。

- **在 Android 上：** 用 `expo-secure-store` 保存的数据在**卸载应用后不会保留**。
- **在 iOS 上：** 如果应用以相同 Bundle ID 重新安装，用 `expo-secure-store` 保存的数据**会在卸载后仍然保留**。这是因为 iOS 钥匙串管理已存储凭据的方式。请记住，这一点并不能保证，你永远不应依赖这个实现细节。

此外，如果 `requireAuthentication` 选项设为 `true`，当用户的生物识别设置发生变化（例如添加新指纹）时，受保护的数据将无法访问。

### 免除加密提示

Apple App Store Connect 会提示你选择应用实现的加密算法类型。这称为**出口合规信息**。在发布应用或提交 TestFlight 时会被询问。

使用 `expo-secure-store` 时，可以在应用配置中把 [`ios.config.usesNonExemptEncryption`](/versions/latest/config/app#usesnonexemptencryption) 属性设为 `false`：

```json
{
  "expo": {
    "ios": {
      "config": {
        "usesNonExemptEncryption": false
      }
    }
  }
}
```

设置这个属性会自动处理合规信息提示。

## Android 自动备份

[Android 应用自动备份](https://developer.android.com/identity/data/autobackup)会自动备份目标并运行在 Android 6.0（API 级别 23）或更高版本上的应用中的用户数据。

必须配置自动备份系统，以排除 `expo-secure-store` 的 shared preferences 条目，因为恢复备份后无法解密它们——应用卸载时，应用的条目会从 Android Key Store 中删除。

如果你的应用没有任何自定义备份配置，`expo-secure-store` 会自动配置自动备份系统，忽略 `expo-secure-store` 的数据。

如果你使用自己的自动备份配置，应在 `sharedpref` 域下排除 `SecureStore`，并在[配置插件配置](#带配置插件的-appjson-示例)中把 `configureAndroidBackup` 设为 `false`。

```xml
<data-extraction-rules>
  <cloud-backup>
    <include domain="sharedpref" path="."/>
    <exclude domain="sharedpref" path="SecureStore"/>
  </cloud-backup>
  <device-transfer>
    <include domain="sharedpref" path="."/>
    <exclude domain="sharedpref" path="SecureStore"/>
  </device-transfer>
</data-extraction-rules>
```

```xml
<full-backup-content>
  <include domain="sharedpref" path="."/>
  <exclude domain="sharedpref" path="SecureStore"/>
</full-backup-content>
```

## 用法

```jsx
import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}

export default function App() {
  const [key, onChangeKey] = useState('Your key here');
  const [value, onChangeValue] = useState('Your value here');

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Save an item, and grab it later!</Text>
      <TextInput
        style={styles.textInput}
        clearTextOnFocus
        onChangeText={text => onChangeKey(text)}
        value={key}
      />
      <TextInput
        style={styles.textInput}
        clearTextOnFocus
        onChangeText={text => onChangeValue(text)}
        value={value}
      />
      <Button
        title="Save this key/value pair"
        onPress={() => {
          save(key, value);
          onChangeKey('Your key here');
          onChangeValue('Your value here');
        }}
      />
      <Text style={styles.paragraph}>🔐 Enter your key 🔐</Text>
      <TextInput
        style={styles.textInput}
        onSubmitEditing={event => {
          getValueFor(event.nativeEvent.text);
        }}
        placeholder="Enter the key for the value you want to get"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    marginTop: 34,
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 4,
  },
});
```

## API

```js
import * as SecureStore from 'expo-secure-store';
```
