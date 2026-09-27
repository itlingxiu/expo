---
title: 处理收到的通知
description: 了解如何响应应用收到的通知，并根据事件采取操作。
---

# 处理收到的通知

[`expo-notifications`](/versions/latest/sdk/notifications) 库包含事件监听器，用于处理应用在收到通知时如何响应。

## 通知事件监听器

[`addNotificationReceivedListener`](/versions/latest/sdk/notifications#addnotificationreceivedlistenerlistener) 和 [`addNotificationResponseReceivedListener`](/versions/latest/sdk/notifications#addnotificationresponsereceivedlistenerlistener) 事件监听器会在收到通知或与通知交互时接收一个对象。

这些监听器让你可以在应用打开并处于前台时收到通知，以及在应用处于后台或已关闭、用户点击通知时添加行为。

```js
useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  /* @info 每当应用处于前台时收到通知，就会触发此监听器。 */
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log(notification);
  });
  /* @end */

  /* @info 每当用户点击通知或与通知交互时就会触发此监听器（应用处于前台、后台或已被杀掉时都有效）。 */
  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });
  /* @end */

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}, []);
```

<details>
<summary>来自 addNotificationReceivedListener 的 Android 通知对象示例</summary>

使用 `Notifications.addNotificationReceivedListener` 时，回调函数收到的 `notification` 对象示例：

```json
// 打印 notification
{
  "request": {
    "trigger": {
      "remoteMessage": {
        "originalPriority": 2,
        "sentTime": 1724782348210,
        "notification": {
          "usesDefaultVibrateSettings": false,
          "color": null,
          "channelId": null,
          "visibility": null,
          "sound": null,
          "tag": null,
          "bodyLocalizationArgs": null,
          "imageUrl": null,
          "title": "Chat App",
          "ticker": null,
          "eventTime": null,
          "body": "New message from John Doe",
          "titleLocalizationKey": null,
          "notificationPriority": null,
          "icon": null,
          "usesDefaultLightSettings": false,
          "sticky": false,
          "link": null,
          "titleLocalizationArgs": null,
          "bodyLocalizationKey": null,
          "usesDefaultSound": false,
          "clickAction": null,
          "localOnly": false,
          "lightSettings": null,
          "notificationCount": null
        },
        "data": {
          "channelId": "default",
          "message": "New message from John Doe",
          "title": "Chat App",
          "body": "{\"senderId\":\"user123\",\"senderName\":\"John Doe\",\"messageId\":\"msg789\",\"conversationId\":\"conversation-456\",\"messageType\":\"text\",\"timestamp\":1724766427}",
          "scopeKey": "@betoatexpo/expo-notifications-app",
          "experienceId": "@betoatexpo/expo-notifications-app",
          "projectId": "51092087-87a4-4b12-8008-145625477434"
        },
        "to": null,
        "ttl": 0,
        "collapseKey": "dev.expo.notificationsapp",
        "messageType": null,
        "priority": 2,
        "from": "115310547649",
        "messageId": "0:1724782348220771%0f02879c0f02879c"
      },
      "channelId": "default",
      "type": "push"
    },
    "content": {
      "autoDismiss": true,
      "title": "Chat App",
      "badge": null,
      "sticky": false,
      "sound": "default",
      "body": "New message from John Doe",
      "subtitle": null,
      "data": {
        "senderId": "user123",
        "senderName": "John Doe",
        "messageId": "msg789",
        "conversationId": "conversation-456",
        "messageType": "text",
        "timestamp": 1724766427
      }
    },
    "identifier": "0:1724782348220771%0f02879c0f02879c"
  },
  "date": 1724782348210
}
```

你可以通过打印 `notification.request.content.data` 对象直接访问通知的自定义数据：

```json
// 打印 notification.request.content.data
{
  "senderId": "user123",
  "senderName": "John Doe",
  "messageId": "msg789",
  "conversationId": "conversation-456",
  "messageType": "text",
  "timestamp": 1724766427
}
```

</details>

<details>
<summary>来自 addNotificationReceivedListener 的 iOS 通知对象示例</summary>

使用 `Notifications.addNotificationReceivedListener` 时，回调函数收到的 `notification` 对象示例：

```json
// 打印 notification
{
  "request": {
    "trigger": {
      "class": "UNPushNotificationTrigger",
      "type": "push",
      "payload": {
        "experienceId": "@betoatexpo/expo-notifications-app",
        "projectId": "51092087-87a4-4b12-8008-145625477434",
        "scopeKey": "@betoatexpo/expo-notifications-app",
        "aps": {
          "thread-id": "",
          "category": "",
          "badge": 1,
          "alert": {
            "subtitle": "Hey there! How's your day going?",
            "title": "Chat App",
            "launch-image": "",
            "body": "New message from John Doe"
          },
          "sound": "default"
        },
        "body": {
          "messageId": "msg789",
          "timestamp": 1724766427,
          "messageType": "text",
          "senderId": "user123",
          "senderName": "John Doe",
          "conversationId": "conversation-456"
        }
      }
    },
    "identifier": "3AEB849E-9059-4D09-BC3B-9A0B104CF062",
    "content": {
      "body": "New message from John Doe",
      "sound": "default",
      "launchImageName": "",
      "badge": 1,
      "subtitle": "Hey there! How's your day going?",
      "title": "Chat App",
      "data": {
        "conversationId": "conversation-456",
        "senderName": "John Doe",
        "senderId": "user123",
        "messageType": "text",
        "timestamp": 1724766427,
        "messageId": "msg789"
      },
      "summaryArgument": null,
      "categoryIdentifier": "",
      "attachments": [],
      "interruptionLevel": "active",
      "threadIdentifier": "",
      "targetContentIdentifier": null,
      "summaryArgumentCount": 0
    }
  },
  "date": 1724798493.0589335
}
```

你可以通过打印 `notification.request.content.data` 对象直接访问通知的自定义数据：

```json
// 打印 notification.request.content.data
{
  "senderId": "user123",
  "senderName": "John Doe",
  "messageId": "msg789",
  "conversationId": "conversation-456",
  "messageType": "text",
  "timestamp": 1724766427
}
```

</details>

关于这些对象的更多信息，请参阅 [`Notification`](/versions/latest/sdk/notifications#notification) 文档。

## 前台通知行为

在 SDK 57 及更早版本中，前台通知默认完全不会显示。要显示它，你必须使用 [`Notifications.setNotificationHandler`](/versions/latest/sdk/notifications#present-incoming-notifications-when-the-app-is) 设置一个要求显示它的处理程序。如果处理程序在 3 秒内没有响应，该通知会被丢弃。

在 SDK 58 及更高版本中，应用处于**前台**时到达的通知默认会显示。它会播放声音、显示横幅、出现在通知列表中，并设置应用角标。如果处理程序在 3 秒内没有响应，通知会以同样的方式显示。

要更改行为，请使用带有 `handleNotification()` 回调的 [`Notifications.setNotificationHandler`](/versions/latest/sdk/notifications#present-incoming-notifications-when-the-app-is) 来设置以下选项：

- `shouldPlaySound`
- `shouldSetBadge`
- `shouldShowBanner`
- `shouldShowList`

```jsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

### 禁用通知处理程序

在 SDK 58 及更高版本中，要停止让 `expo-notifications` 决定收到的通知是否显示，请传入 `null`：

```jsx
Notifications.setNotificationHandler(null);
```

在 Android 上，应用处于前台时该通知随后不会显示。在 iOS 上，决定权交给另一个库设置的 `UNUserNotificationCenterDelegate`。如果没有库设置它，该通知不会显示。

## 关闭状态下的通知行为

在 Android 上，用户可以设置某些操作系统级别的设置，通常围绕性能和电池优化，这些设置可以在应用关闭时阻止通知投递。例如，OnePlus 设备在 Android 9 及更低版本上的 **Deep Clear** 选项就是这样一种设置。
