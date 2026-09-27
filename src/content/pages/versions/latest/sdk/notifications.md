---
title: Notifications 包参考
description: 用于获取推送通知令牌，以及呈现、调度、接收和响应通知的库。
---

# Notifications 包参考

> 支持平台：Android、iOS。

`expo-notifications` 提供用于获取推送通知令牌，以及呈现、调度、接收和响应通知的 API。

- [通知指南](/push-notifications/overview)：不要错过我们关于如何设置、发送和处理推送通知的指南。

:::warning
从 SDK 53 起，`expo-notifications` 提供的推送通知（远程通知）功能在 Android 的 Expo Go 中不可用。使用推送通知需要[开发构建](/develop/development-builds/introduction)。本地通知（应用内通知）在 Expo Go 中仍然可用。
:::

## 特性

- 为特定日期或从现在起的一段时间调度一次性通知
- 按某个时间间隔（或在 iOS 上按日历日期匹配）重复调度通知
- 获取和设置应用角标数字
- 获取原生设备推送令牌，以便用 FCM（Android）和 APNs（iOS）发送推送通知
- 获取 Expo 推送令牌，以便用 [Expo 推送服务](/push-notifications/sending-notifications)发送推送通知
- 在前台和后台监听传入通知
- 监听与通知的交互
- 在应用处于前台时处理通知
- 以命令方式从通知中心/通知栏关闭通知
- 创建、更新和删除 [Android 通知渠道](https://developer.android.com/develop/ui/views/notifications/channels)
- 在 Android 上为通知设置自定义图标和颜色

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-notifications
```
:::
:::tab yarn
```sh
yarn expo install expo-notifications
```
:::
:::tab pnpm
```sh
pnpm expo install expo-notifications
```
:::
:::tab bun
```sh
bun expo install expo-notifications
```
:::
:::

然后继续[配置](#配置)，设置[配置插件](#应用配置)并获取推送通知的[凭据](#凭据)。

### 已知问题（Android）

在 **Android 开发构建**中从推送通知启动应用时，启动画面大约有 70% 的时间无法正确显示。图标和淡出动画可能不会按预期出现。

- 图标可能缺失
- 淡出动画可能不会运行
- 可能只短暂闪过背景色

此问题只影响调试构建，不会出现在发布构建中。变通方法是在发布模式下测试通知启动（`npx expo run:android --variant release`），以获得准确行为。

## 用法

查看下面的示例 Snack，了解 Notifications 的实际效果。推送通知可在物理设备、带 Google Play 服务的 Android 模拟器，以及 Xcode 14 或更高版本上的 iOS 模拟器（macOS 13+、iOS 16+）上工作。

```tsx
import { useState, useEffect } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
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
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map(c => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
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
    alert('Failed to get push token for push notification!');
    return;
  }
  // 了解更多关于 projectId 的信息：
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // 这里使用 EAS projectId。
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(token);
  } catch (e) {
    token = `${e}`;
  }

  return token;
}
```

### 向用户呈现本地（应用内）通知

```ts
import * as Notifications from 'expo-notifications';

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Look at that notification',
    body: "I'm so proud of myself!",
  },
  trigger: null,
});
```

### 用导航处理推送通知

如果希望在收到推送通知时深链接到应用中的特定界面，可以配置 Expo 的任一导航系统来实现。

:::tabs
:::tab Expo Router
可以用 Expo Router 的[内置深链接](/router/basics/core-concepts#2-all-pages-have-a-url)处理来自推送通知的传入 URL。只需配置根布局，监听传入的通知事件和初始通知事件。

```tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Slot, router } from 'expo-router';

function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        // 推送该 URL。导航前你可能需要验证格式。
        router.push(url);
        // 清除已存储的响应，以免布局重新挂载时再次跳转到同一 URL。
        Notifications.clearLastNotificationResponse();
      }
    }

    // 处理初始推送通知。
    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    // 监听运行时通知。
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);
}

export default function Layout() {
  // 在根布局观察。确保此布局永远不返回 null，否则导航将无法处理。
  useNotificationObserver();

  return <Slot />;
}
```
:::

:::tab React Navigation
可以配置 React Navigation 的手动[链接配置](https://reactnavigation.org/docs/navigation-container#linking)，以处理来自推送通知的传入跳转：

```tsx
import React from 'react';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer
      linking={{
        config: {
          // 链接配置
        },
        async getInitialURL() {
          // 首先，你可能需要做默认的深链接处理
          // 检查应用是否由深链接打开
          const url = await Linking.getInitialURL();

          if (url != null) {
            return url;
          }

          // 处理来自 Expo 推送通知的 URL
          const response = Notifications.getLastNotificationResponse();
          const notificationUrl = response?.notification.request.content.data?.url;
          if (typeof notificationUrl === 'string') {
            return notificationUrl;
          }
        },
        subscribe(listener) {
          const onReceiveURL = ({ url }: { url: string }) => listener(url);

          // 监听来自深链接的传入链接
          const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

          // 监听 Expo 推送通知
          const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const url = response.notification.request.content.data?.url;

            // 用于判断是否需要处理该 URL 的任何自定义逻辑
            //...

            if (typeof url === 'string') {
              // 让 React Navigation 处理该 URL
              listener(url);
            }

            // 清除已存储的响应，以免下一次 getInitialURL 调用再次跳转到同一 URL
            Notifications.clearLastNotificationResponse();
          });

          return () => {
            // 清理事件监听器
            eventListenerSubscription.remove();
            subscription.remove();
          };
        },
      }}>
      
    </NavigationContainer>
  );
}
```

更多细节见 [React Navigation 文档](https://reactnavigation.org/docs/deep-linking/#third-party-integrations)。
:::
:::

## 配置

### 凭据

请遵循[设置指南](/push-notifications/push-notifications-setup#get-credentials-for-development-builds)。

### 应用配置

要配置 `expo-notifications`，请在应用配置（**app.json** 或 **app.config.js**）中使用内置[配置插件](/config-plugins/introduction)，用于 [EAS Build](/build/introduction) 或 `npx expo run:[android|ios]`。该插件可以配置以下无法在运行时设置、必须构建新的应用二进制才会生效的属性：

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `icon` | - | 仅 Android。用作推送通知图标的图片本地路径。96x96、带透明度的全白 png。 |
| `largeIcon` | - | 仅 Android。用作通知大图标的图片本地路径。图片会调整为 64x64 dp，并显示在通知文本旁边。自带图片的通知会改用那张图片。 |
| `color` | `#ffffff` | 仅 Android。推送通知图片出现在通知栏中时的着色。 |
| `defaultChannel` | - | 仅 Android。FCMv1 通知的默认渠道。 |
| `sounds` | - | 可用作自定义通知声音的声音文件本地路径数组（建议 .wav）。专注模式不允许或静音模式开启时不会播放声音。 |
| `enableBackgroundRemoteNotifications` | `false` | 仅 iOS。是否启用后台远程通知，如 [Apple 文档](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app)所述。这会更新 `Info.plist` 中的 `UIBackgroundModes` 键，使其包含 `remote-notification`。 |

下面是在应用配置文件中使用配置插件的示例：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./local/assets/notification_icon.png",
          "largeIcon": "./local/assets/notification_large_icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "sounds": [
            "./local/assets/notification_sound.wav",
            "./local/assets/notification_sound_other.wav"
          ],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
```

:::note
iOS APNs 权利_始终_设为 'development'。Xcode 会在发布构建生成的归档中自动把它改为 'production'。见[这篇关于 APNs 权利的 Stack Overflow 回答](https://stackoverflow.com/a/42293632/4047926)。
:::

<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>

关于如何配置原生项目，见 [`expo-notifications` 仓库中的安装说明](https://github.com/expo/expo/tree/main/packages/expo-notifications#installation-in-bare-react-native-projects)。

</details>

## 权限

### Android

- 在 Android 上，此模块需要订阅设备启动的权限。它用于在设备（重新）启动时设置已调度的通知。
  `RECEIVE_BOOT_COMPLETED` 权限会通过库的 **AndroidManifest.xml** 自动添加。

- 从 Android 12（API 级别 31）起，要调度在精确时间触发的通知，需要在 **AndroidManifest.xml** 中添加
  `<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>`。
  更多信息见[精确闹钟权限](https://developer.android.com/about/versions/12/behavior-changes-12#exact-alarm-permission)。
  `delivery: 'alarmClock'` 触发选项也需要精确闹钟权限。在 Android 13（API 级别 33）及更高版本上，闹钟、计时器和日历应用
  可以改为声明 `<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>`。系统会授予该权限，无需用户提示。
  [Google Play 的精确闹钟政策](https://support.google.com/googleplay/android-developer/answer/13161072)把 `USE_EXACT_ALARM` 限制在这些应用类别。

- 在 Android 13 上，应用用户必须通过操作系统自动触发的权限提示选择接收通知。
  在至少创建一个通知渠道之前，此提示不会出现。必须在
  `getDevicePushTokenAsync` 或 `getExpoPushTokenAsync` 之前调用 `setNotificationChannelAsync` 才能获取推送令牌。关于 Android 13 新的通知权限行为，详见
  [官方文档](https://developer.android.com/develop/ui/views/notifications/notification-permission#new-apps)。

| Android 权限 | 说明 |
| --- | --- |
| `RECEIVE_BOOT_COMPLETED` | 允许应用接收系统启动完成后广播的 Intent.ACTION_BOOT_COMPLETED。允许应用接收系统启动完成后广播的 `[Intent.ACTION_BOOT_COMPLETED](https://developer.android.com/reference/android/content/Intent#ACTION_BOOT_COMPLETED)`。如果不请求此权限，届时将收不到该广播。持有此权限没有安全影响，但可能增加系统启动所需时间，并允许应用在用户不知情的情况下自行运行，从而对用户体验产生负面影响。因此，你必须显式声明使用此功能，以便用户可见。 |
| `SCHEDULE_EXACT_ALARM` | 允许应用使用精确闹钟 API。 |
| `USE_EXACT_ALARM` | 允许应用像使用 SCHEDULE_EXACT_ALARM 一样使用精确闹钟，但无需向用户请求此权限。允许应用像使用 `[SCHEDULE_EXACT_ALARM](https://developer.android.com/reference/android/Manifest.permission#SCHEDULE_EXACT_ALARM)` 一样使用精确闹钟，但无需向用户请求此权限。 |

### iOS

不需要用途说明，见[与通知相关的权限](#fetch-information-about-notifications-related-permissions)。

### 解读 iOS 权限响应

在 iOS 上，发送通知的权限比 Android 更细。因此应依赖 `NotificationPermissionsStatus` 的 `ios.status` 字段，而不是根级 `status` 字段。

该值将是以下之一，可通过 `Notifications.IosAuthorizationStatus` 访问：

- `NOT_DETERMINED`：用户尚未选择是否允许应用调度通知
- `DENIED`：应用未被授权调度或接收通知
- `AUTHORIZED`：应用已被授权调度或接收通知
- `PROVISIONAL`：应用被临时授权发布不打断用户的通知
- `EPHEMERAL`：应用被授权在有限时间内调度或接收通知

## 通知事件监听器

通知事件包括传入通知、用户对通知执行的交互（可以是点按通知，或通过[通知类别](#管理交互式通知的通知类别)与之交互），以及通知偶尔被丢弃的情况。

若干监听器已在[推送通知行为](/push-notifications/what-you-need-to-know#push-notification-behaviors)一节中公开并说明。

## 无界面（后台）通知

无界面后台通知的[定义](/push-notifications/what-you-need-to-know#headless-background-notifications)见[须知](/push-notifications/what-you-need-to-know)指南。

要在应用处于后台或未运行时处理通知，需要完成以下步骤：

- 向项目添加 `expo-task-manager` 包。
- [配置后台通知](#ios-后台通知配置)。
- 在应用代码中设置一个[后台任务](#registertaskasynctaskname)，在收到通知时运行。

然后发送满足以下条件的推送通知：

- 只包含 `data` 键（没有 `title`、`body`）
- 对 iOS 设置 `contentAvailable: true`——见 [Expo 推送通知服务载荷格式](/push-notifications/sending-notifications#message-request-format)

### iOS 后台通知配置

要在 iOS 上使用无界面（后台）推送通知，应用 **Info.plist** 文件的 `UIBackgroundModes` 数组中必须有 `remote-notification` 值。

**如果你使用 [CNG](/workflow/continuous-native-generation)**，把配置插件的 [`enableBackgroundRemoteNotifications` 属性](#可配置属性)设为 true，预构建会自动应用正确配置。

<details><summary>在 iOS 上手动配置 UIBackgroundModes</summary>

如果你不使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者使用原生 iOS 项目，则需要在 **Expo.plist** 文件中添加以下内容：

```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

</details>

## 更多信息

### 设置自定义通知声音

要为应用添加自定义推送通知声音，请把 `expo-notifications` 插件加入 **app.json**，然后在 `sounds` 键下提供可用作自定义通知声音的声音文件本地路径数组。这些路径相对于你的项目。

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["local/path/to/mySoundFile.wav"]
        }
      ]
    ]
  }
}
```

构建应用后，该文件数组可在 [`NotificationContentInput`](#notificationcontentinput) 和 [`NotificationChannelInput`](#notificationchannelinput) 中使用。
你只需要提供基本文件名。下面是使用上述配置的示例：

```ts
await Notifications.setNotificationChannelAsync('new_emails', {
  name: 'E-mail notifications',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'mySoundFile.wav', // 只提供基本文件名
});

await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    sound: 'mySoundFile.wav', // 只提供基本文件名
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2,
    channelId: 'new_emails',
  },
});
```

如果你愿意，也可以手动把通知文件添加到 Android 和 iOS 项目：

<details><summary>在 Android 上手动添加通知声音</summary>

在 Android 8.0 及以上，为通知播放自定义声音不只是在 `NotificationContentInput` 上设置 `sound` 属性。
你还需要用相应的 `sound` 配置 `NotificationChannel`，并在发送/调度通知时使用它。

要让下面的示例生效，请把 **email_sound.wav** 文件放在 **android/app/src/main/res/raw/**。

```ts
// 准备通知渠道
await Notifications.setNotificationChannelAsync('new_emails', {
  name: 'E-mail notifications',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'email_sound.wav', // <- Android 8.0 及以上，见下方 channelId 属性
});

// 例如，调度通知
await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    body: 'Open the notification to read them all',
    sound: 'email_sound.wav', // <- Android 8.0 以下
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 2,
    channelId: 'new_emails', // <- Android 8.0 及以上，见上方定义
  },
});
```

</details>

<details><summary>在 iOS 上手动添加通知声音</summary>

在 iOS 上，只需把声音文件放进 Xcode 项目（见下方截图），
然后在 `NotificationContentInput` 中指定该声音文件，如下所示：

```ts
await Notifications.scheduleNotificationAsync({
  content: {
    title: "You've got mail! 📬",
    body: 'Open the notification to read them all',
    sound: 'notification.wav',
  },
  trigger: {
    // ...
  },
});
```

![Xcode 项目组织器中应用资源里的 notification.wav](/static/images/notification-sound-ios.jpeg)

</details>

### 推送通知载荷规范

见[消息请求格式](/push-notifications/sending-notifications#message-request-format)。

### 管理交互式通知的通知类别

通知类别让你可以创建交互式推送通知，使用户可以通过按钮或文本回复直接响应传入通知。类别定义用户可以采取的一组操作，然后通过在 [`NotificationContent`](#notificationcontent) 中指定 `categoryIdentifier` 把这些操作应用到通知上。

![Android 和 iOS 上的通知类别图片](/static/images/sdk/notifications/categories.webp)

在 iOS 上，通知类别还允许你进一步自定义通知。对于每个类别，你可以设置用户可以采取的交互操作，并配置当用户关闭应用通知预览时显示的占位文本等内容。

## 平台特定指南

### 处理通知渠道（Android 8+）

从 Android 8.0（API 级别 26）起，所有通知都必须分配到一个渠道。对于每个渠道，
你可以设置应用于该渠道中所有通知的视觉和听觉行为。
然后，用户可以更改这些设置，并决定你的应用中哪些通知渠道应该打扰用户或完全可见，
如 [Android 开发者文档](https://developer.android.com/training/notify-user/channels)所述。

如果你不指定通知渠道，`expo-notifications` 会为你创建一个名为 **Miscellaneous** 的回退渠道。
我们建议始终为应用设置名称清晰的适当渠道，并始终向这些渠道发送通知。

> 在不支持此功能的平台上（低于 8.0（26）的 Android 以及 iOS），调用这些方法不会产生效果。

### 自定义通知图标和颜色（Android）

可以用 [`expo-notifications` 配置插件](#可配置属性)配合 [Expo 预构建](/workflow/continuous-native-generation)，在项目中配置通知的 `icon` 和 `color` 键。这些是构建时设置，因此需要用 `eas build -p android` 或 `npx expo run:android` 重新编译原生 Android 应用才能看到变化。

对于通知图标，请务必遵循 [Google 的设计指南](https://m2.material.io/design/iconography/product-icons.html#design-principles)
（图标必须全白且背景透明），否则可能无法按预期显示。

你也可以在 [`NotificationContentInput`](#notificationcontentinput) 的 `color` 属性中**按条通知**直接设置自定义通知颜色。

## API

```js
import * as Notifications from 'expo-notifications';
```

