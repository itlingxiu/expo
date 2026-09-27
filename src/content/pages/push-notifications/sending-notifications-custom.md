---
title: 使用 FCM 和 APNs 发送通知
description: 了解如何使用 FCM 和 APNs 发送通知。
---

# 使用 FCM 和 APNs 发送通知

你可能需要对通知进行更细粒度的控制，这时直接与 FCM 和 APNs 通信可能是必要的。Expo 平台不会把你锁定在使用 Expo Application Services 上，`expo-notifications` API 与具体的推送服务无关。

:::note
本指南并不打算成为通过 FCM 或 APNs 发送通知的全面资料。我们建议你阅读官方文档，以确保遵循最新说明。
:::

## 获取用于 FCM 或 APNs 的设备令牌

使用 Expo 通知服务时，你会使用通过 [`getExpoPushTokenAsync`](/versions/latest/sdk/notifications#getexpopushtokenasyncoptions) 获得的 `ExpoPushToken`。

如果想改为通过 FCM 或 APNs 发送通知，需要使用 [`getDevicePushTokenAsync`](/versions/latest/sdk/notifications#getdevicepushtokenasync) 获取原生设备令牌。

```diff
diff --git a/App.js b/App.js
index 0000000..1111111 100644
--- a/App.js
+++ b/App.js
@@ -1,4 +1,4 @@
 import * as Notifications from 'expo-notifications';
 // ...
-const token = (await Notifications.getExpoPushTokenAsync()).data;
+const token = (await Notifications.getDevicePushTokenAsync()).data;
 // 把令牌发送到你的服务器
```

## FCMv1 服务器

本指南基于 [Firebase 官方文档](https://firebase.google.com/docs/cloud-messaging/server)。

与 FCM 通信是通过发送 POST 请求完成的。不过，在发送或接收任何通知之前，你需要按照步骤[配置 FCM](/push-notifications/fcm-credentials)并获取 `FCM-SERVER-KEY`。

### 获取身份验证令牌

FCM 需要 OAuth 2.0 访问令牌，必须通过[“更新发送请求的授权”](https://firebase.google.com/docs/cloud-messaging/send/v1-api#authorize-http-v1-send-requests)中描述的方法之一获取。

出于测试目的，可以使用 Google Auth Library 以及上面获得的私钥文件，为单条通知获取一个短生命周期令牌，如下面这个改编自 Firebase 文档的 Node 示例：

```ts
import { JWT } from 'google-auth-library';

function getAccessTokenAsync(
  key: string // FCM 私钥文件的内容
) {
  return new Promise(function (resolve, reject) {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'],
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
```

### 发送通知

下面的示例代码调用上面的 `getAccessTokenAsync()` 来获取 OAuth 2.0 令牌，然后构造并发送通知 POST 请求。请注意，与 FCM 旧协议不同，该请求的端点包含你的 Firebase 项目名称。

```ts
// FCM_SERVER_KEY：值为 FCM 私钥文件路径的环境变量
// FCM_PROJECT_NAME：你的 Firebase 项目名称
// FCM_DEVICE_TOKEN：客户端的设备令牌（见本文上方）

async function sendFCMv1Notification() {
  const key = require(process.env.FCM_SERVER_KEY);
  const firebaseAccessToken = await getAccessTokenAsync(key);
  const fcmToken = process.env.FCM_DEVICE_TOKEN;

  const messageBody = {
    message: {
      token: fcmToken,
      data: {
        channelId: 'default',
        message: 'Testing',
        title: `This is an FCM notification message`,
        body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
        scopeKey: '@yourExpoUsername/yourProjectSlug',
        experienceId: '@yourExpoUsername/yourProjectSlug',
      },
    },
  };

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_NAME}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${firebaseAccessToken}`,
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    }
  );

  const readResponse = (response: Response) => response.json();
  const json = await readResponse(response);

  console.log(`Response JSON: ${JSON.stringify(json, null, 2)}`);
}
```

`experienceId` 和 `scopeKey` 字段仅在使用 Expo Go 时适用（从 SDK 53 起，Expo Go 已移除推送通知支持）。否则，通知将无法到达你的应用。FCM 在[通知载荷](https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support)中提供了受支持字段的列表，你可以通过查看 [FirebaseRemoteMessage](/versions/latest/sdk/notifications#firebaseremotemessage) 了解 `expo-notifications` 在 Android 上支持哪些字段。

FCM 还提供了一些[几种不同语言的服务端库](https://firebase.google.com/docs/cloud-messaging/send/admin-sdk)，可以用来代替原始的 `fetch` 请求。

### 如何找到 FCM 服务器密钥

确保你已经遵循了[配置步骤](/push-notifications/push-notifications-setup#为开发构建获取凭据)。不要把 FCM 密钥上传到 Expo，而是直接在服务器中使用该密钥（作为上一示例中的 `FCM-SERVER-KEY`）。

## APNs 服务器

:::note
本文档基于 [Apple 的文档](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)，本节介绍让你起步所需的基础知识。
:::

与 APNs 通信比与 FCM 通信稍微复杂一些。有些库把所有这些功能封装成一两次函数调用，例如 [`node-apn`](https://github.com/node-apn/node-apn)。不过，下面的示例只使用了一组最少的库。

### 客户端 APNs entitlement

只有当 iOS 应用拥有 APNs entitlement 时，接收推送通知才会生效。对于使用 [CNG](/workflow/continuous-native-generation) 的应用，需要用以下两种方式之一修改 Expo 配置：

- **推荐**：把 `expo-notifications` 库添加到应用中，并确保它的插件出现在[应用配置](/workflow/configuration)的 `plugins` 数组中：

```json app.json
{
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "plugins": [
      /* @hide 省略 ... */ /* @end */
      "expo-notifications"
      ]
  }
}
```

- 如果不打算使用 `expo-notifications` 库，则应[手动把 `aps-environment` entitlement 添加到 Expo 配置](/build-reference/ios-capabilities#entitlements)，如下例所示：

```json app.json
{
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "ios": {
      /* @hide 省略 ... */ /* @end */
      "entitlements": {
        "aps-environment": "development"
      }
    }
  }
}
```

如果不使用 CNG，则应[在 Xcode 中添加推送通知 entitlement](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns)。

:::note
如果要把 Expo 应用从 SDK 51 及更早版本升级，请参阅[这篇 FYI 文档](https://expo.fyi/apns-entitlement-sdk-51)。
:::

### 授权

一开始，在向 APNs 发送请求之前，你需要获得向应用发送通知的权限。这通过使用 iOS 开发者凭据生成的 JSON Web Token 授予：

- 与应用关联的 APNs 密钥（`.p8` 文件）
- 上述 `.p8` 文件的 Key ID
- 你的 Apple Team ID

```js
const jwt = require("jsonwebtoken");
const authorizationToken = jwt.sign(
  {
    iss: "YOUR-APPLE-TEAM-ID"
    iat: Math.round(new Date().getTime() / 1000),
  },
  fs.readFileSync("./path/to/appName_apns_key.p8", "utf8"),
  {
    header: {
      alg: "ES256",
      kid: "YOUR-P8-KEY-ID",
    },
  }
);
```

### HTTP/2 连接

获得 `authorizationToken` 之后，可以打开一条到 Apple 服务器的 HTTP/2 连接。在开发环境中，把请求发送到 `api.sandbox.push.apple.com`。在生产环境中，把请求发送到 `api.push.apple.com`。

下面是如何构造请求：

```js
const http2 = require('http2');

const client = http2.connect(
  IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
);

const request = client.request({
  ':method': 'POST',
  ':scheme': 'https',
  'apns-topic': 'YOUR-BUNDLE-IDENTIFIER',
  ':path': '/3/device/' + nativeDeviceToken, // 这是你在客户端获取的原生设备令牌
  authorization: `bearer ${authorizationToken}`, // 这是在“授权”步骤中生成的 JSON Web Token
});
request.setEncoding('utf8');

request.write(
  JSON.stringify({
    aps: {
      alert: {
        title: "\uD83D\uDCE7 You've got mail!",
        body: 'Hello world! \uD83C\uDF10',
      },
    },
    experienceId: '@yourExpoUsername/yourProjectSlug', // 仅在旧版 Expo Go 中测试时需要（SDK 52 及更早版本）
    scopeKey: '@yourExpoUsername/yourProjectSlug', // 仅在旧版 Expo Go 中测试时需要（SDK 52 及更早版本）
  })
);
request.end();
```

> 此示例是最小化的，不包含错误处理和连接池。出于测试目的，可以参考 [`sendNotificationToAPNS`](https://github.com/expo/expo/blob/main/docs/public/static/examples/sendNotificationToAPNS.js) 示例代码。

APNs 在[通知载荷](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)中提供了受支持字段的完整列表。
