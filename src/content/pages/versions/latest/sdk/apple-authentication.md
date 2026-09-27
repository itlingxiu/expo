---
title: AppleAuthentication 包参考
description: 为 iOS 提供“通过 Apple 登录”能力的库。
---

# AppleAuthentication 包参考

`expo-apple-authentication` 为 iOS 提供 Apple 身份验证。它目前尚不支持 Android 或 Web。

> 支持平台：iOS、tvOS、Expo Go。

任何包含第三方身份验证选项的应用，都**必须**提供 Apple 身份验证选项，以符合 App Store 审核指南。更多信息见 Apple 网站上的 [Sign In with Apple](https://developer.apple.com/sign-in-with-apple/)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-apple-authentication
```
:::
:::tab yarn
```sh
yarn expo install expo-apple-authentication
```
:::
:::tab pnpm
```sh
pnpm expo install expo-apple-authentication
```
:::
:::tab bun
```sh
bun expo install expo-apple-authentication
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-apple-authentication`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

### 设置 iOS 项目

要在应用中启用 **Sign In with Apple** 功能，请在项目的应用配置里把 [`ios.usesAppleSignIn`](/versions/latest/config/app#usesapplesignin) 属性设为 `true`：

```json app.json
{
  "expo": {
    "ios": {
      "usesAppleSignIn": true
    }
  }
}
```

在本地运行 [EAS Build](/build/introduction) 时，会使用 [iOS 功能签名](/build-reference/ios-capabilities) 在构建前启用所需功能。

```json app.json
{
  "expo": {
    "plugins": ["expo-apple-authentication"]
  }
}
```

不使用 [EAS Build](/build/introduction) 的应用，必须为其 Bundle Identifier [手动配置](/build-reference/ios-capabilities#manual-setup) **Apple Sign In** 功能。

如果通过 [Apple Developer Console](/build-reference/ios-capabilities#apple-developer-console) 启用 **Apple Sign In** 功能，请务必在 **ios/[app]/[app].entitlements** 文件中加入以下授权：

```xml
<key>com.apple.developer.applesignin</key>
<array>
  <string>Default</string>
</array>
```

另外，在 **ios/[app]/Info.plist** 中把 `CFBundleAllowMixedLocalizations` 设为 `true`，以确保登录按钮使用设备的语言区域设置。

## 用法

```jsx
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            // 已登录
          } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // 处理用户取消了登录流程
            } else {
              // 处理其他错误
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
});
```

## 开发与测试

你可以在 iOS 上的 Expo Go 中测试此库，无需遵循上面的任何说明。不过，如果使用 EAS Build，则需要添加配置插件才能使用此库。在 Expo Go 中登录时，你收到的标识符和值很可能与独立应用中收到的不同。

你可以在 iOS 模拟器上对此库做有限测试。不过，并非所有方法的行为都与真机相同，因此我们强烈建议在开发时尽可能在真机上测试。

## 验证来自 Apple 的响应

Apple 的响应包含一个带有用户信息的已签名 JWT。为确保响应来自 Apple，你可以用 Apple 公布的公钥对签名做密码学校验，公钥发布于 https://appleid.apple.com/auth/keys。这一过程并非 Expo 所特有。

## API

```js
import * as AppleAuthentication from 'expo-apple-authentication';
```

## 错误码

大多数错误码与官方 [Apple 授权错误](https://developer.apple.com/documentation/authenticationservices/asauthorizationerror/code) 一致。

| 代码 | 说明 |
| --- | --- |
| ERR_INVALID_OPERATION | 执行了无效的授权操作。 |
| ERR_INVALID_RESPONSE | 授权请求收到了无效响应。 |
| ERR_INVALID_SCOPE | 传入了无效的 [`AppleAuthenticationScope`](#appleauthenticationscope)。 |
| ERR_REQUEST_CANCELED | 用户取消了授权尝试。 |
| ERR_REQUEST_FAILED | 授权尝试失败。更多信息见错误消息。 |
| ERR_REQUEST_NOT_HANDLED | 授权请求未被正确处理。 |
| ERR_REQUEST_NOT_INTERACTIVE | 授权请求不是交互式的。 |
| ERR_REQUEST_UNKNOWN | 授权尝试因未知原因失败。 |
