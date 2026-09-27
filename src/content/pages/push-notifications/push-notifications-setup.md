---
title: Expo 推送通知设置
description: 了解如何设置推送通知、获取开发和生产环境的凭据，以及发送测试推送通知。
---

# Expo 推送通知设置

要使用 Expo 推送通知服务，必须通过安装一组库来配置应用、实现处理通知的函数，并为 Android 和 iOS 设置凭据。

完成本指南中列出的步骤，或跟随下面更详细的视频。结束时，你将能够发送一条推送通知并在设备上收到它。

> 视频：[Expo Notifications with EAS | Complete Guide](https://www.youtube.com/watch?v=BCCjGtKtBjE)
>
> 了解如何在 Expo 项目中设置推送通知。本视频涵盖：为 Android 配置 Firebase 以使用 FCM v1、在 EAS 上设置 Android 和 iOS 凭据、使用 EAS Build 构建，以及使用 Expo Notifications 工具进行测试。

要让客户端为推送通知做好准备，需要以下内容：

- 用户允许向其发送推送通知的权限。
- 应用的 [`ExpoPushToken`](/versions/latest/sdk/notifications#expopushtoken)。

<details>
<summary>你想直接使用 FCM / APNs，而不是 Expo 推送通知服务吗？</summary>

如果你需要对通知进行更细粒度的控制，直接与 FCM 和 APNs 通信可能是必要的。Expo 不会把你锁定在使用 Expo Application Services 上，`expo-notifications` API 与具体的推送服务无关。了解如何[“使用 FCM 和 APNs 发送通知”](/push-notifications/sending-notifications-custom)。

</details>

**前置条件**

**支持推送的设备或模拟器**

你可以在 Android 或 iOS 真机上、带有 Google Play 服务的 Android 模拟器上，或在 Xcode 14 或更高版本（macOS 13+、iOS 16+）上运行的 iOS 模拟器上测试推送通知。

本指南中的以下步骤使用 [EAS Build](/build/introduction)。这是设置通知最简单的方式，因为你的 EAS 项目也会包含[通知凭据](#为开发构建获取凭据)。不过，你也可以不使用 EAS Build，而是通过[在本地构建项目](/guides/local-app-development)来使用 `expo-notifications` 库。

1. **安装库**

运行以下命令安装 `expo-notifications` 和 `expo-constants` 库：

:::tabs
:::tab npm
```sh
$ npx expo install expo-notifications expo-constants
```
:::
:::tab yarn
```sh
$ yarn expo install expo-notifications expo-constants
```
:::
:::tab pnpm
```sh
$ pnpm expo install expo-notifications expo-constants
```
:::
:::tab bun
```sh
$ bun expo install expo-notifications expo-constants
```
:::
:::

- [`expo-notifications`](/versions/latest/sdk/notifications) 库用于请求用户权限，并获取用于发送推送通知的 `ExpoPushToken`。
- [`expo-constants`](/versions/latest/sdk/constants) 用于从应用配置中获取 `projectId` 值。

2. **添加配置插件**

在[应用配置](/workflow/configuration)的 `plugins` 数组中添加 `expo-notifications` 插件：

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

3. **添加一个最小可运行示例**

下面的代码展示了如何在 React Native 应用中注册、发送和接收推送通知的可运行示例。把它复制并粘贴到你的项目中：

```tsx App.tsx
import { useState, useEffect } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

/* @info 此处理程序决定应用在前台时如何处理收到的通知。 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
/* @end */

/* @info 向 Expo 发送一条通知。也可以使用 https://expo.dev/notifications 上的 Expo 推送通知工具。 */
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
/* @end */

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
    /* @info 获取 Expo 推送令牌（如果之前没有获取过）。该令牌对此设备和 projectId 是唯一的。 */
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    /* @end */
    console.log(pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    /* @info 获取推送令牌并在 UI 中显示；如果出错，则显示错误信息。 */
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));
    /* @end */

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}
```

### 配置 `projectId`

使用前面的示例注册推送通知时，需要使用 [`projectId`](/versions/latest/sdk/constants#easconfig)。此属性用于把 Expo 推送令牌归属到特定项目。对于使用 EAS 的项目，`projectId` 属性表示该项目的通用唯一标识符（UUID）。

创建开发构建时会自动设置 `projectId`。不过，**我们建议在项目代码中手动设置它**。为此，可以使用 [`expo-constants`](/versions/latest/sdk/constants) 从应用配置中获取 `projectId` 值。

```ts
const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
```

把 Expo 推送令牌归属到项目 ID 的一个好处是：当项目在不同账户之间转移，或现有账户被重命名时，它不会改变。

4. **为开发构建获取凭据**

Android 和 iOS 对凭据设置有不同的要求。

:::tabs
:::tab Android

对于 Android，需要配置 **Firebase Cloud Messaging (FCM)** 以获取凭据并设置 Expo 项目。

按照[添加 Android FCM V1 凭据](/push-notifications/fcm-credentials)中的步骤设置凭据。

:::
:::tab iOS

:::warning
生成凭据需要付费的 Apple Developer 账户。
:::

对于 iOS，在第一次运行 `eas build` 命令之前，请确保已经在要测试的设备上[注册了你的 iOS 设备](/develop/development-builds/introduction)。

如果是第一次创建开发构建，系统会询问你是否启用推送通知。当 EAS CLI 提示时，对以下问题回答 yes：

- Setup Push Notifications for your project
- Generating a new Apple Push Notifications service key

:::
:::

> 如果不使用 EAS Build，请手动运行 `eas credentials`。

5. **构建应用**

```sh
$ eas build
```

6. **使用推送通知工具进行测试**

创建并安装开发构建后，可以使用 [Expo 推送通知工具](https://expo.dev/notifications)快速向设备发送测试通知。

1. 为项目启动开发服务器：

:::tabs
:::tab npm
```sh
$ npx expo start
```
:::
:::tab yarn
```sh
$ yarn expo start
```
:::
:::tab pnpm
```sh
$ pnpm expo start
```
:::
:::tab bun
```sh
$ bun expo start
```
:::
:::

2. 在设备上打开开发构建。

3. 生成 `ExpoPushToken` 后，把该值以及其他详细信息（例如消息标题和正文）输入 Expo 推送通知工具。

4. 点击 **Send a Notification** 按钮。

   ![Expo 推送通知工具概览。](/static/images/notifications/push-notifications-tool-overview.png)

从工具发送通知后，你应该会在设备上看到该通知。下面是 Android 设备收到推送通知的示例。

![Android 设备正在接收推送通知。](/static/images/notifications/notification-on-android.png)
