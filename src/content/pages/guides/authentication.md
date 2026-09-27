---
title: 使用 OAuth 或 OpenID 提供商进行身份验证
description: 了解如何使用 expo-auth-session 与 OAuth 或 OpenID 提供商进行身份验证。
---

# 使用 OAuth 或 OpenID 提供商进行身份验证

`expo-auth-session` 提供了一套跨 Android、iOS 与 Web 的 OAuth 与 OpenID Connect API。本指南通过几个示例演示 `AuthSession` API。

## 所有身份验证提供商的规则

同样的规则适用于每个提供商：

- 调用 `WebBrowser.maybeCompleteAuthSession()` 关闭 Web 弹窗 —— 否则"弹窗不会关闭"。
- 用 `AuthSession.makeRedirectUri()` 构造重定向，它处理跨平台支持并在内部使用 `expo-linking`。
- 用 `AuthSession.useAuthRequest()` 构造请求；该 hook 允许异步设置，这样移动端浏览器不会阻塞身份验证。
- 在 `request` 定义之前保持提示按钮禁用。
- 在 Web 上，`promptAsync` 只能在用户交互内调用。
- Expo Go 不能用于开发/测试 OAuth 或 OpenID Connect 应用，因为应用 scheme 无法自定义。改用开发构建 —— 它提供类似 Expo Go 的体验，并支持 OAuth 重定向回应用，行为与生产一致。

## 获取访问令牌

大多数提供商使用 OAuth 2。在授权码授权（authorization code grant）中，身份提供商返回一次性 code，用它换取用户的访问令牌。由于客户端应用代码不是安全的密钥存储，交换应发生在服务端（例如 API Routes 或 React Server Components），这样你可以在请求提供商的 token 端点时保留并使用 client secret。

## 示例

### GitHub

| 网站 | 提供商 | PKCE | 自动发现 |
| --- | --- | --- | --- |
| [获取你的配置](https://github.com/settings/developers) | OAuth 2.0 | 支持 | 不可用 |

- GitHub 每个应用只允许一个重定向 URI，所以每种方式需要单独的应用：
  - 独立 / 开发构建：`com.your.app://*`
  - Web：`https://yourwebsite.com/*`
- `redirectUri` 需要两个斜杠（`://`）。
- `revocationEndpoint` 是动态的，需要你的 `config.clientId`。

```tsx GitHub Auth Example
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'CLIENT_ID',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'your.app'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
```

### Okta

| 网站 | 提供商 | PKCE | 自动发现 |
| --- | --- | --- | --- |
| [注册](https://developer.okta.com/signup/) > Applications | OpenID | 支持 | 可用 |

- 无法定义自定义 `redirectUri`；Okta 会为你提供一个。

```tsx Okta Auth Example
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button, Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery('https://<OKTA_DOMAIN>.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'CLIENT_ID',
      scopes: ['openid', 'profile'],
      redirectUri: makeRedirectUri({
        native: 'com.okta.<OKTA_DOMAIN>:/callback',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
```

## 重定向 URI 模式

### 独立/开发构建

> `yourscheme://path`

有时会有 1 到 3 个斜杠（`/`）。

- **环境：**
  - 现有 React Native 应用 —— `npx expo prebuild`
  - App/Play Store 中的独立构建，或本地测试 —— Android：`eas build` 或 `npx expo run:android`；iOS：`eas build` 或 `npx expo run:ios`
- **创建：** 使用 `AuthSession.makeRedirectUri({ native: '<YOUR_URI>' })` 在正确的环境中选择原生 URI。
  - `your.app://redirect` -> `makeRedirectUri({ scheme: 'your.app', path: 'redirect' })`
  - `your.app:///` -> `makeRedirectUri({ scheme: 'your.app', isTripleSlashed: true })`
  - `your.app:/authorize` -> `makeRedirectUri({ native: 'your.app:/authorize' })`
  - `your.app://auth?foo=bar` -> `makeRedirectUri({ scheme: 'your.app', path: 'auth', queryParams: { foo: 'bar' } })`
  - `exp://u.expo.dev/[project-id]?channel-name=[channel-name]&runtime-version=[runtime-version]` -> `makeRedirectUri()`
  - 链接通常可以自动生成，但建议至少定义 `scheme`。完整 URL 可以用 `native` 覆盖 —— 对于要求自定义原生 URI 重定向的提供商（如 Google 或 Okta）通常需要这样做。`npx uri-scheme` 可以添加、列出与打开 URI scheme。
  - 如果 `expo.scheme` 改变，运行 `npx expo prebuild --clean` 重新生成原生项目，然后用 `npx expo run:android` / `npx expo run:ios` 重新构建。
- **用法：** `promptAsync({ redirectUri })`

## 改善用户体验

登录流程很重要，因为那是用户决定是否继续使用应用的时刻；糟糕的体验可能在他们深入使用之前就把人赶走。以下提示让身份验证快速、简单且安全：

### 预热浏览器

Android 支持可选地预热浏览器，让它在后台初始化，这可以显著加快认证提示的弹出。

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

function App() {
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Do authentication ...
}
```

### 隐式登录

因为 client secret 无法安全地存储在应用 bundle 中，提供商历史上提供了一种"Implicit flow"，无需 client secret 即返回访问令牌。由于包括访问令牌注入在内的安全风险，**这已不再推荐**。现在大多数提供商支持带 PKCE 的授权码流程，它可以在客户端代码中安全地用授权码交换访问令牌。`expo-auth-session` 为遗留代码仍支持 Implicit flow。

```tsx
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
};

function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: 'CLIENT_ID',
      scopes: ['user-read-email', 'playlist-modify-public'],
      redirectUri: makeRedirectUri({
        scheme: 'your.app'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response && response.type === 'success') {
      const token = response.params.access_token;
    }
  }, [response]);

  return <Button disabled={!request} onPress={() => promptAsync()} title="Login" />;
}
```

### 存储数据

在原生平台上，令牌等数据可以用 `expo-secure-store` 保护 —— 它与 `AsyncStorage` 不同，后者不安全。它提供对 Android 加密 SharedPreferences 与 iOS 钥匙串服务的原生访问。Web 上没有等价物。存储认证结果让你之后可以恢复会话，用户无需再次登录。

```tsx
import * as SecureStore from 'expo-secure-store';

const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';

function App() {
  const [, response] = useAuthRequest({});

  useEffect(() => {
    if (response && response.type === 'success') {
      const auth = response.params;
      const storageValue = JSON.stringify(auth);

      if (Platform.OS !== 'web') {
        // Securely store the auth on your device
        SecureStore.setItemAsync(MY_SECURE_AUTH_STATE_KEY, storageValue);
      }
    }
  }, [response]);

  // More login code...
}
```
