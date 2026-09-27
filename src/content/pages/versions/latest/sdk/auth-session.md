---
title: AuthSession 包参考
description: 提供基于浏览器的身份验证 API 的通用库。
---

# AuthSession 包参考

`AuthSession` 利用 [WebBrowser](/versions/latest/sdk/webbrowser) 和 [Crypto](/versions/latest/sdk/crypto)，在应用中启用基于 Web 浏览器的身份验证（例如基于浏览器的 OAuth 流程）。实现细节请参阅本参考，用法请参阅[身份验证](/guides/authentication)指南。

> 支持平台：Android、iOS、Web、Expo Go。

:::note
`AuthSession` 支持通用的 OAuth 与 OpenID Connect 浏览器身份验证工作流。在可用的情况下，我们建议使用身份提供商提供的库，因为它会处理该提供商特有的实现细节。例如，Google 身份验证使用 [`@react-native-google-signin/google-signin`](/guides/google-authentication)，Facebook 使用 [`react-native-fbsdk-next`](/guides/facebook-authentication)。更多信息见[身份验证](/develop/authentication)概述。
:::

## 安装

> `expo-crypto` 是对等依赖，必须与 `expo-auth-session` 一起安装。

:::tabs
:::tab npm
```sh
npx expo install expo-auth-session expo-crypto
```
:::
:::tab yarn
```sh
yarn expo install expo-auth-session expo-crypto
```
:::
:::tab pnpm
```sh
pnpm expo install expo-auth-session expo-crypto
```
:::
:::tab bun
```sh
bun expo install expo-auth-session expo-crypto
```
:::
:::

## 配置

要使用此库，需要通过设置 `scheme` 在应用中配置深层链接。使用 [`uri-scheme` CLI](https://www.npmjs.com/package/uri-scheme) 工具，可以方便地添加、移除、列出和打开 URI。

例如，要让原生应用处理 `mycoolredirect://`，请运行：

```sh
npx uri-scheme add mycoolredirect
```

现在运行以下命令，应该能看到项目的全部 scheme 列表：

```sh
npx uri-scheme list
```

可以这样测试以确保它能正常工作：

```sh
# 重新构建原生应用，请务必使用模拟器
yarn android
yarn ios

# 打开一个 URI scheme
npx uri-scheme open mycoolredirect://some/redirect
```

### 在独立应用中使用

```json app.json
{
  "expo": {
    "scheme": "mycoolredirect"
  }
}
```

要能够深层链接回应用，需要在项目的应用配置中设置 `scheme`，然后构建独立应用（无法通过更新来更改）。如果不包含 scheme，身份验证流程仍会完成，但无法把信息传回应用，用户必须手动退出身份验证模态框（从而产生一个已取消事件）。

## 指南

> 指南已迁移：[身份验证指南](/guides/authentication)。

## 基于 Web 浏览器的身份验证流程如何工作

移动应用中基于浏览器的身份验证，典型流程如下：

- **发起**：用户按下登录按钮
- **打开 Web 浏览器**：应用打开 Web 浏览器，进入身份验证提供商的登录页。登录页打开的 URL 通常包含用于识别应用的信息，以及成功后要重定向到的 URL。*注意：Web 浏览器应与系统 Web 浏览器共享 Cookie，这样如果用户已在系统浏览器中通过身份验证，就不必再次登录——Expo 的 [WebBrowser](/versions/latest/sdk/webbrowser) API 会处理这一点。*
- **身份验证提供商重定向**：身份验证成功后，提供商应重定向回应用，方式是重定向到应用在登录页查询参数中提供的 URL（[进一步了解移动应用中的链接如何工作](/linking/overview)），*前提是该 URL 位于允许的重定向 URL 允许列表中*。将重定向 URL 加入允许列表很重要，可以防止恶意行为者冒充你的应用。重定向会在 URL 中包含数据（例如用户 ID 和令牌），可以在 location 哈希、查询参数或两者中。
- **应用处理重定向**：由应用处理重定向，并从重定向 URL 中解析数据。

## 安全注意事项

- **绝不要把任何密钥放进应用代码，没有安全的方式可以这样做！** 你应该把密钥存放在服务器上，并暴露一个端点，由它代客户端发起 API 调用，再把数据传回。

## API

```js
import * as AuthSession from 'expo-auth-session';
```

## 高级用法

### 在 Linking 处理程序中过滤 AuthSession 事件

你可能出于多种原因想处理进入应用的入站链接，例如推送通知或常规深层链接（更多内容见 [Linking](/linking/overview)）。身份验证重定向只是深层链接的一种，`AuthSession` 会为你处理这类链接。在你自己的 `Linking.addEventListener` 处理程序中，可以过滤掉由 `AuthSession` 处理的深层链接：检查 URL 是否包含 `+expo-auth-session` 字符串——如果包含，就可以忽略它。这是因为 `AuthSession` 会把 `+expo-auth-session` 加到默认的 `returnUrl` 上；不过，如果你提供了自己的 `returnUrl`，可能需要考虑加入类似的标识符，以便从其他处理程序中过滤掉 `AuthSession` 事件。

### 与 React Navigation 一起使用

如果将深层链接与 React Navigation 一起使用，通过 `Linking.addEventListener` 过滤是不够的，因为深层链接的[处理方式不同](https://reactnavigation.org/docs/configuring-links/#advanced-cases)。要过滤这些事件，请在链接配置中添加自定义的 `getStateFromPath` 函数，然后用与上面相同的方式按 URL 过滤。
