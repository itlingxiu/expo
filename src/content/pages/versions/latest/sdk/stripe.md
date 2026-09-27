---
title: '@stripe/stripe-react-native 包参考'
description: 提供用于集成 Stripe 支付的原生 API 的库。
---

# @stripe/stripe-react-native 包参考

> 支持平台：Android、iOS、Expo Go。

Expo 支持 [`@stripe/stripe-react-native`](https://github.com/stripe/stripe-react-native)，让你可以用 React Native 和 Expo 在原生 Android 与 iOS 应用中构建流畅的支付体验。这个库提供开箱即用、功能强大且可定制的 UI 界面和元素，用来收集用户的支付信息。

> 正在从 Expo 的 `expo-payments-stripe` 模块迁移？[了解如何过渡到新的 `@stripe/stripe-react-native` 库](https://github.com/expo/fyi/blob/main/payments-migration-guide.md#how-to-migrate-from-expo-payments-stripe-to-the-new-stripestripe-react-native-library)。

- [观看：通用全栈 Expo Stripe 支付集成](https://www.youtube.com/watch?v=J0tyxUV_omY)：在 Android、iOS 和 Web 上把 Stripe 支付集成到通用 Expo 应用的完整演示。

## 安装

每个 Expo SDK 版本都需要特定的 `@stripe/stripe-react-native` 版本。版本对应关系见 [Stripe CHANGELOG](https://github.com/stripe/stripe-react-native/blob/master/CHANGELOG.md)。要自动安装与当前 Expo SDK 版本匹配的版本，请运行：

:::tabs
:::tab npm
```sh
npx expo install @stripe/stripe-react-native
```
:::
:::tab yarn
```sh
yarn expo install @stripe/stripe-react-native
```
:::
:::tab pnpm
```sh
pnpm expo install @stripe/stripe-react-native
```
:::
:::tab bun
```sh
bun expo install @stripe/stripe-react-native
```
:::
:::

### 配置插件设置（可选）

如果使用 EAS Build，大部分 Stripe 设置可以通过 `@stripe/stripe-react-native` [配置插件](/config-plugins/introduction)完成。设置时，把配置插件加入 **app.json** 或 **app.config.js** 的 `plugins` 数组，如下所示，然后重新构建应用。

```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "string | string[]",
          "enableGooglePay": "boolean"
        }
      ]
    ]
  }
}
```

- **merchantIdentifier**：仅 iOS。这是[在这里获取的 Apple 商户 ID](https://docs.stripe.com/apple-pay?platform=react-native)。否则 Apple Pay 无法按预期工作。如果有多个 merchantIdentifier，可以把它们放进数组。
- **enableGooglePay**：仅 Android。表示是否启用 Google Pay 的布尔值。默认为 `false`。

## 示例

试用 Stripe 只需要几秒钟。在设备上连接到[这个 Snack](https://snack.expo.dev/@charliecruzan/stripe-react-native-example?platform=mydevice)。

在底层，该示例连接到一台 Glitch 服务器来处理支付。

## 用法

用法信息和详细文档见以下资源：

- [Stripe 的 React Native SDK 参考](https://stripe.dev/stripe-react-native/api-reference/index.html)
- [Stripe 的 React Native GitHub 仓库](https://github.com/stripe/stripe-react-native)
- [Stripe 的示例 React Native 应用](https://github.com/stripe/stripe-react-native/tree/master/example)

### 常见问题

#### 浏览器弹窗没有重定向回我的应用

如果依赖重定向，需要向 `initStripe` 传入 `urlScheme`。为了始终使用正确的 `urlScheme`，请传入：

```js
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

urlScheme:
  Constants.appOwnership === 'expo'
    ? Linking.createURL('/--/')
    : Linking.createURL(''),
```

[`Linking.createURL()`](/versions/latest/sdk/linking#createurloptions) 会确保你使用正确的 scheme，无论是在 Expo Go 还是生产应用中运行。在 Expo Go 中需要 `'/--/'`，因为它表示其后的子串对应深层链接路径，而不是应用自身路径的一部分。

#### iOS 上的 PaymentSheet 本地化

在 Android 上，`PaymentSheet` 的翻译会根据设备语言设置自动检测。

在 iOS 上，必须启用 `CFBundleAllowMixedLocalizations`，并在应用配置的 [`ios.infoPlist`](/versions/latest/config/app#infoplist) 下用 `CFBundleLocalizations` 添加首选语言：

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "CFBundleAllowMixedLocalizations": true,
        "CFBundleLocalizations": ["fr"]
      }
    }
  }
}
```

## 限制

### Google Pay

[Expo Go](https://expo.dev/go) **不**支持 Google Pay。要使用 Google Pay，必须创建[开发构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。可以通过 [EAS Build](/build/introduction) 完成，也可以在本地运行 `npx expo run:android`。

### Apple Pay

[Expo Go](https://expo.dev/go) **不**支持 Apple Pay。要使用 Apple Pay，必须创建[开发构建](/develop/development-builds/introduction#how-would-you-like-to-build-your-development-build)。可以通过 [EAS Build](/build/introduction) 完成，也可以在本地运行 `npx expo run:ios`。
