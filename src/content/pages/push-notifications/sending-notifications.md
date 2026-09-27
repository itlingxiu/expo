---
title: 使用 Expo Push Service 发送通知
description: 了解如何从服务器调用 Expo Push Service API 发送推送通知。
---

# 使用 Expo Push Service 发送通知

[`expo-notifications`](/versions/latest/sdk/notifications) 库提供推送通知的全部客户端功能。Expo 还会把推送通知交给 FCM 和 APNs，再由它们发送到特定设备。你只需要使用通过 [`getExpoPushTokenAsync`](/versions/latest/sdk/notifications#getexpopushtokenasyncoptions) 获得的 `ExpoPushToken`，向 Expo Push API 发送请求。

> 如果你更想构建一个直接与 APNs 和 FCM 通信的服务器，请参阅[使用 FCM 和 APNs 发送通知](/push-notifications/sending-notifications-custom)。这比使用 Expo Push Service 更复杂，但允许更细粒度的控制，并能完整访问 FCM 和 APNs 的全部功能。

![说明从你的服务器向设备发送推送的示意图](/static/images/sending-notification.png)

## 使用服务器发送推送通知

设置好推送通知凭据并添加获取 `ExpoPushToken` 的逻辑之后，可以使用 HTTPS POST 请求把它发送到 Expo API。你可以搭建一个带数据库的服务器来做这件事（也可以编写命令行工具来发送，或直接从应用中发送）。

Expo 团队和社区已经用几种不同的语言为你准备了后端：

| SDK | 后端 | 维护者 |
| --- | --- | --- |
| [expo-server-sdk-node](https://github.com/expo/expo-server-sdk-node) | Node.js | Expo 团队 |
| [expo-server-sdk-python](https://github.com/expo/expo-server-sdk-python) | Python | 社区 |
| [expo-server-sdk-ruby](https://github.com/expo/expo-server-sdk-ruby) | Ruby | 社区 |
| [expo-push-notification-client-rust](https://github.com/katayama8000/expo-push-notification-client-rust) | Rust | 社区 |
| [expo-notifier](https://github.com/symfony/expo-notifier) | Symfony | Symfony |
| [exponent-server-sdk-php](https://github.com/Alymosul/exponent-server-sdk-php) | PHP | 社区 |
| [expo-server-sdk-php](https://github.com/ctwillie/expo-server-sdk-php) | PHP | 社区 |
| [exponent-server-sdk-golang](https://github.com/oliveroneill/exponent-server-sdk-golang) | Golang | 社区 |
| [exponent](https://github.com/9ssi7/exponent) | Golang | 社区 |
| [exponent-server-sdk-elixir](https://github.com/pachun/exponent-server-sdk-elixir) | Elixir | 社区 |
| [expo-server-sdk-dotnet](https://github.com/glyphard/expo-server-sdk-dotnet) | dotnet | 社区 |
| [expo-server-sdk-java](https://github.com/hlspablo/expo-server-sdk-java) | Java | 社区 |
| [laravel-expo-notifier](https://github.com/YieldStudio/laravel-expo-notifier) | Laravel | 社区 |

上面的每个示例服务器都是对 Expo Push Service API 的封装。

## 可靠地实现推送通知

推送通知从你的服务器到达接收设备，会经过多个系统。大多数时候通知都能送达。不过，沿途的系统以及它们之间的网络连接偶尔会出现问题。处理错误有助于让推送通知更可靠地到达目的地。

### 限制并发连接

一次性发送大量推送通知时，请限制并发连接数。[Node SDK](https://github.com/expo/expo-server-sdk-node) 会为你实现这一点，最多打开六条并发连接。这可以平滑峰值负载，并帮助 Expo 推送通知服务成功接收推送通知请求。

### 失败时重试

发送推送通知的第一步，是把它们交给 Expo 推送通知服务，该服务会在内部把它们加入队列，以便投递给 Google（FCM v1）和 Apple（APNs）。这一步可能因多种原因失败：

- 你的服务器与 Expo 推送通知服务之间的网络问题
- Expo 通知服务中断或可用性下降
- 推送凭据配置错误
- 通知载荷无效

其中一些失败是暂时的。例如，如果 Expo 推送通知服务宕机或不可达，并且你得到网络错误——HTTP 429 错误（Too Many Requests）或 HTTP 5xx 错误（Server Errors）——请使用[指数退避](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)等待几秒后再重试。如果第一次重试不成功，就等待更长时间（遵循指数退避）并再次重试。这样可以让暂时不可用的服务在你重试之前恢复。

其他失败不会自行解决。例如，如果推送通知载荷格式错误，你可能会收到 HTTP 400 响应，说明载荷的问题。如果项目没有推送凭据，或者在同一次请求中为不同项目发送推送通知，你也会收到错误。

### 检查推送回执中的错误

Expo 推送通知服务在成功接收通知后会响应[**推送票据**](#推送票据)。推送票据表示 Expo 已收到你的通知载荷，但可能仍需要发送它。每张推送票据都包含一个票据 ID，稍后你用它来查询[推送回执](#推送回执)。Expo 尝试把通知投递给 FCM 或 APNs 之后，推送回执才可用。它会告诉你向推送通知提供商的投递是否成功。

你必须检查推送回执。如果投递推送通知时出现问题，推送回执是获取根本原因信息的最佳方式。例如，回执可能表明 FCM 或 APNs、Expo 推送通知服务，或你的通知载荷存在问题。

如果 APNs 或 FCM 返回了相应信息，推送回执也可能告诉你接收设备是否已取消订阅通知（例如撤销通知权限或卸载应用）。推送回执会包含设为 `DeviceNotRegistered` 的 `details` → `error` 字段。在这种情况下，请停止向此设备的推送令牌发送通知，直到它重新向你的服务器注册，这样你的应用才能保持良好行为。只有当 Google 或 Apple 认定设备未注册时，`DeviceNotRegistered` 错误才会出现在推送回执中。这需要不确定的时间，而且通常无法通过卸载应用后立刻发送推送通知来测试。

我们建议在发送推送通知 15 分钟后检查推送回执。虽然推送回执往往更早可用，但 15 分钟的窗口给了 Expo 推送通知服务足够舒适的时间来让回执对你可用。如果 15 分钟后仍然没有推送回执，这很可能表明 Expo 推送通知服务出错。最后，推送回执会在 24 小时后被清除。

### SLA

Expo 推送通知服务没有 SLA，FCM 和 APNs 服务也可能偶尔中断。如果你遵循上面的指导，应用就可以处理暂时的服务中断。

## HTTP/2 API

你也可以不使用前面列出的某个库，而是直接向我们的 HTTP/2 API 发送请求（此 API 目前不需要任何身份验证）。

为此，向 `https://exp.host/--/api/v2/push/send` 发送 POST 请求，并带上以下 HTTP 头：

```text
host: exp.host
accept: application/json
accept-encoding: gzip, deflate
content-type: application/json
```

下面是一条可以使用终端发送的 “hello world” 推送通知（把占位推送令牌替换成你自己的）：

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title":"hello",
  "body": "world"
}'
```

请求体必须是 JSON。它可以是单个[消息对象](#消息请求格式)（如上面的示例），也可以是最多 100 个消息对象的数组，只要它们都属于同一个项目，如下所示。**当你想发送多条消息时，我们建议使用数组，以便高效地尽量减少向 Expo 服务器发出的请求数。** 下面是一个发送四条消息的请求体示例：

```json
[
  {
    "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "sound": "default",
    "body": "Hello world!"
  },
  {
    "to": "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]",
    "badge": 1,
    "body": "You've got mail"
  },
  {
    "to": [
      "ExponentPushToken[zzzzzzzzzzzzzzzzzzzzzz]",
      "ExponentPushToken[aaaaaaaaaaaaaaaaaaaaaa]"
    ],
    "body": "Breaking news!"
  }
]
```

Expo Push Service 也可以选择接受 gzip 压缩的请求体。这可以大幅减少发送大量通知所需的上传带宽。[Node Expo Server SDK](https://github.com/expo/expo-server-sdk-node) 会自动为你 gzip 请求，并自动对请求限流以平滑负载，因此我们强烈推荐它。

### 推送票据

上面的请求会响应一个 JSON 对象，其中有两个可选字段 `data` 和 `errors`。`data` 会包含一个[**推送票据**](#推送票据格式)数组，顺序与消息发送顺序相同（如果你向单个接收者发送单条消息，则是一个推送票据对象）。每张票据都包含一个 `status` 字段，表示 Expo 是否成功收到该通知；如果成功，还会有一个 `id` 字段，稍后可用于检索推送回执。

> 状态为 `ok` 并带有回执 ID，意味着消息已被 Expo 的服务器接收，**并不**意味着用户已收到它（为此你需要检查[推送回执](#推送回执)）。

继续上面的示例，成功的响应体如下所示：

```json
{
  "data": [
    { "status": "ok", "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" },
    { "status": "ok", "id": "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY" },
    { "status": "ok", "id": "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ" },
    { "status": "ok", "id": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA" }
  ]
}
```

如果个别消息出错，但整个请求没有失败，出错消息对应的推送票据状态将为 `error`，并带有描述错误的字段，如下所示：

```json
{
  "data": [
    {
      "status": "error",
      "message": "\"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]\" is not a registered push notification recipient",
      "details": {
        "error": "DeviceNotRegistered"
      }
    },
    {
      "status": "ok",
      "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    }
  ]
}
```

如果整个请求失败，HTTP 状态码为 4xx 或 5xx，`errors` 字段将是错误对象数组（通常只有一个）。否则，HTTP 状态码将为 200，你的消息将在前往 Android 和 iOS 推送通知服务的路上。

### 推送回执

收到一批通知后，Expo 会把每条通知入队，以便投递给 Android 和 iOS 推送通知服务（分别是 FCM 和 APNs）。大多数通知通常在几秒内送达。不过，有时投递可能需要更长时间，尤其是当 Android 或 iOS 推送通知服务接收和投递通知的时间比平常更长，或者 Expo 的 Push Service 基础设施处于高负载时。

一旦 Expo 把通知交给 Android 或 iOS 推送通知服务，Expo 就会创建一条[**推送回执**](#推送回执响应格式)，表明 Android 或 iOS 推送通知服务是否成功收到该通知。如果投递通知时出错，也许是因为凭据有问题或服务停机，推送回执会包含关于该错误的更多信息。

要获取推送回执，向 `https://exp.host/--/api/v2/push/getReceipts` 发送 POST 请求。[请求体](#推送回执请求格式)必须是一个 JSON 对象，其中有一个名为 `ids` 的字段，它是票据 ID 字符串的数组：

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
  "ids": [
    "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    "YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY",
    "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ"
  ]
}'
```

推送回执的[响应体](#推送回执响应格式)与推送票据非常相似；它是一个 JSON 对象，有两个可选字段 `data` 和 `errors`。`data` 包含从回执 ID 到回执的映射。回执包含 `status` 字段，以及两个可选的 `message` 和 `details` 字段（在 `"status": "error"` 的情况下）。如果某个请求的回执 ID 没有推送回执，映射中就不会包含该 ID。对上面请求的成功响应如下所示：

```json
{
  "data": {
    "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX": { "status": "ok" },
    "ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ": { "status": "ok" }
    // 当不存在给定 ID 的回执时（本例中是 YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY），
    // 该 ID 会从响应中省略。
  }
}
```

**你必须检查每一条推送回执，因为它可能包含你需要解决的错误信息。** 例如，如果某台设备不再有资格接收通知，Apple 的文档要求你停止向该设备发送通知。推送回执包含关于这些错误的信息。

> 即使回执的 `status` 为 `ok`，也不能保证设备已收到消息；推送回执中的 “ok” 表示 Android（FCM）或 iOS（APNs）推送通知服务已成功收到该通知。例如，如果接收设备已关机，iOS 或 Android 推送通知服务会尝试投递消息，但设备不一定会收到它。

如果整个请求失败，HTTP 状态码将为 4xx 或 5xx，`errors` 字段将是错误对象数组（通常只有一个）。否则，HTTP 状态码将为 200，你的消息将在前往用户设备的路上。

## 错误

Expo 会提供整个过程中发生的任何错误的详细信息。下面介绍一些最常见的错误，以便你可以在服务器上实现自动处理它们的逻辑。

如果出于任何原因，Expo 无法把消息交给 Android 或 iOS 推送通知服务，推送回执的 details 也可能包含服务特定的信息。这主要用于调试，以及向 Expo 报告可能的 bug。

### 单个错误

在推送票据和推送回执内部，查找带有 `error` 字段的 `details` 对象。如果存在，它可能是以下值之一，你应该这样处理这些错误：

### 推送票据错误

- `DeviceNotRegistered`：设备无法再接收推送通知，你应该停止向对应的 Expo 推送令牌发送消息。

### 推送回执错误

- `DeviceNotRegistered`：设备无法再接收推送通知，你应该停止向对应的 Expo 推送令牌发送消息。

- `MessageTooBig`：通知载荷总体过大。在 Android 和 iOS 上，总载荷最多为 4096 字节。

- `MessageRateExceeded`：你向给定设备发送消息过于频繁。请实现指数退避，并缓慢地重试发送消息。

- `MismatchSenderId`：这表明你的 FCM 推送凭据有问题。FCM 推送凭据有两部分：FCM 服务器密钥和 **google-services.json** 文件。两者必须关联到同一个发送方 ID。你可以在[查找服务器密钥的同一位置](/push-notifications/push-notifications-setup#为开发构建获取凭据)找到发送方 ID。请检查项目 EAS 仪表盘中 **Credentials** > **Application identifier** > **Service Credentials** > **FCM V1 service account key** 下的服务器密钥，以及项目 **google-services.json** 中 `project_number` 的发送方 ID，是否与 Firebase 控制台 **Project Settings** > **Cloud Messaging** 标签页 > **Cloud Messaging API (Legacy)** 中显示的相同。

- `InvalidCredentials`：独立应用的推送通知凭据无效（例如，你可能已经撤销了它们）。
  - **Android**：请确保已按照[上传 FCM V1 服务器凭据](/push-notifications/fcm-credentials)中的说明，正确上传了来自 Firebase 控制台的服务器密钥。
  - **iOS**：运行 `eas credentials` 并按照提示重新生成新的推送通知凭据。如果撤销 APNs 密钥，所有依赖该密钥的应用都将无法再发送或接收推送通知，直到你上传新密钥来替换它。上传新的 APNs 密钥**不会**改变用户的 Expo Push Token。有时，这些错误会包含进一步的细节，声称出现了 `InvalidProviderToken` 错误。这实际上同时与你的 APNs 密钥**和**描述文件有关。要解决此错误，你应该重新构建应用，并重新生成新的推送密钥和描述文件。

> 要更好地理解 iOS 凭据（包括推送通知凭据），请阅读我们的[应用签名文档](/app-signing/app-credentials#ios)。

### 请求错误

如果获取推送票据或推送回执的整个请求出错，`errors` 对象可能具有以下值之一，你应该处理这些错误：

- `TOO_MANY_REQUESTS`：你超过了每个项目每秒 600 条通知的请求限制。我们建议在服务器中实现速率限制，以防止每秒发送超过 600 条通知（请注意，如果你使用 [expo-server-sdk-node](https://github.com/expo/expo-server-sdk-node)，这一点以及重试的指数退避都已经实现）。

- `PUSH_TOO_MANY_EXPERIENCE_IDS`：你试图向不同的 Expo experience 发送推送通知，例如 `@username/projectAAA` 和 `@username/projectBBB`。检查 `details` 字段，其中有从 experience 名称到请求中关联推送令牌的映射，并移除属于另一个 experience 的令牌。

- `PUSH_TOO_MANY_NOTIFICATIONS`：你试图在一次请求中发送超过 100 条推送通知。请确保每次请求只发送 100 条（或更少）通知。

- `PUSH_TOO_MANY_RECEIPTS`：你试图在一次请求中获取超过 1000 条推送回执。请确保只发送一个包含 1000 个（或更少）票据 ID 字符串的数组来获取推送回执。

## 额外的安全性

你可以要求任何推送请求都必须带有有效的[访问令牌](/accounts/programmatic-access)，我们才会把它们投递给用户。你可以在 [EAS 仪表盘](https://expo.dev/settings/access-tokens)中启用这种增强的推送安全性。

默认情况下，你可以通过发送用户的 Expo Push Token 以及消息所需的任何文本或额外数据，向用户发送通知。这很容易设置，但**如果令牌泄露，恶意用户就能冒充你的服务器，向你的用户发送他们的消息。** 我们从未收到过此类报告。不过，为了遵循最佳安全实践，我们提供把访问令牌与推送令牌一起使用的方式，作为额外的安全层。

如果你使用 [`expo-server-sdk-node`](https://github.com/expo/expo-server-sdk-node#usage)，请升级到至少 `v3.6.0`，并在构造函数中把 `accessToken` 作为选项传入。否则，在向我们的推送 API 发出的任何请求中传入头 `'Authorization': 'Bearer ${accessToken}'`。

启用推送安全性之后，任何不带有效访问令牌发送的请求都会导致错误，错误码为：`UNAUTHORIZED`。

## 格式

### 消息请求格式

每条消息必须是一个具有给定字段的 JSON 对象（只有 `to` 字段是必需的）：

| 字段 | 平台 | 类型 | 说明 |
| --- | --- | --- | --- |
| `to` | Android 和 iOS | `string \| string[]` | 一个 Expo 推送令牌，或指定此消息接收者的 Expo 推送令牌数组。 |
| `contentAvailable` | 仅 iOS | `boolean` | 设为 true 时，该通知会使 iOS 应用在后台启动以运行[后台任务](/versions/latest/sdk/notifications#headless-background-notifications)。你的应用需要[配置](/versions/latest/sdk/notifications#background-notification-configuration)才能支持这一点。映射到 [`aps.content-available`](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#Create-a-background-notification)。 |
| `data` | Android 和 iOS | `Object` | 投递到你的应用的 JSON 对象。它可以大约最多 4KiB；发送给 Apple 和 Google 的通知总载荷必须最多 4KiB，否则你会收到 “Message Too Big” 错误。 |
| `title` | Android 和 iOS | `string` | 在通知中显示的标题。通常显示在通知正文上方。映射到 [`AndroidNotification.title`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 和 [`aps.alert.title`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `body` | Android 和 iOS | `string` | 在通知中显示的消息。映射到 [`AndroidNotification.body`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 和 [`aps.alert.body`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `ttl` | Android 和 iOS | `number` | 生存时间：如果消息尚未投递，可以保留以便重新投递的秒数。省略此字段则使用各提供商自己的默认值——4 周。 |
| `expiration` | Android 和 iOS | `number` | 自 Unix 纪元以来的时间戳，指定消息何时过期。效果与 `ttl` 相同（`ttl` 优先于 `expiration`）。 |
| `priority` | Android 和 iOS | `'default' \| 'normal' \| 'high'` | 消息的投递优先级。指定 `default` 或省略此字段，以使用各平台的默认优先级（Android 上为 “normal”，iOS 上为 “high”）。 |
| `subtitle` | 仅 iOS | `string` | 在通知中标题下方显示的副标题。映射到 [`aps.alert.subtitle`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `sound` | 仅 iOS | `string \| null` | 接收者收到此通知时播放声音。指定 `default` 以播放设备的默认通知声音，或省略此字段以不播放声音。自定义声音需要通过配置插件[配置](/versions/latest/sdk/notifications#configurable-properties)，然后在指定时包含文件扩展名。示例：`bells_sound.wav`。 |
| `badge` | 仅 iOS | `number` | 在应用图标角标上显示的数字。指定零以清除角标。 |
| `interruptionLevel` | 仅 iOS | `'active' \| 'critical' \| 'passive' \| 'time-sensitive'` | 通知的重要性和投递时机。这些字符串值对应于 [`UNNotificationInterruptionLevel`](https://developer.apple.com/documentation/usernotifications/unnotificationinterruptionlevel) 枚举 case。 |
| `targetContentId` | 仅 iOS | `string` | 被带到前台的窗口的标识符。此键的值会填充到从推送载荷创建的 `UNNotificationContent` 对象上。映射到 [`aps.target-content-id`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。`expo-notifications` 包把收到的值公开为 `targetContentIdentifier`。 |
| `relevanceScore` | 仅 iOS | `number` | 0 到 1 之间的分数，系统用它来选择在摘要中突出显示哪条通知。值越高表示相关性越高。映射到 [`aps.relevance-score`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `filterCriteria` | 仅 iOS | `string` | 系统用来判断是否在当前专注模式中显示该通知的条件。映射到 [`aps.filter-criteria`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `channelId` | 仅 Android | `string` | 用于显示此通知的通知渠道 ID。如果指定了 ID，但设备上不存在对应渠道（你的应用尚未创建），则不会向用户显示该通知。 |
| `icon` | 仅 Android | `string` | 通知的图标。Android drawable 资源的名称（示例：`myicon`）。默认为[配置插件](/versions/latest/sdk/notifications#configurable-properties)中指定的图标。 |
| `richContent` | Android 和 iOS | `Object` | 目前支持设置通知图片。提供一个对象，键为 `image`，值为 `string` 类型，即图片 URL。Android 会开箱即用地显示该图片。在 iOS 上，你需要向应用添加 Notification Service Extension target。请参阅[此示例](https://github.com/expo/expo/pull/36202)了解如何操作。 |
| `categoryId` | Android 和 iOS | `string` | 此通知所关联的通知类别 ID。[在这里进一步了解通知类别](/versions/latest/sdk/notifications#manage-notification-categories-interactive-notifications)。 |
| `collapseId` | Android 和 iOS | `string` | 用于折叠通知的标识符。在 Android 上，这只会合并传输中的消息（如果设备离线，只会投递具有给定 `collapseId` 的最新一条），并映射到 FCM 的 [`collapse_key`](https://firebase.google.com/docs/cloud-messaging/customize-messages/collapsible-message-types)。要同时替换 Android 上已经显示的通知，请使用 `tag`。在 iOS 上，这既会合并传输中的消息，也会替换设备上已经显示的通知，并映射到 [`apns-collapse-id`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Send-a-POST-request-to-APNs)。 |
| `tag` | 仅 Android | `string` | 用于替换设备上已经显示的通知的标识符。如果设备已经在显示具有相同 `tag` 的通知，新通知会替换它。这与 `collapseId` 不同，后者合并的是传输中的消息，而 `tag` 替换的是已经显示的通知。映射到 FCM 的 [`notification.tag`](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidNotification) 字段。 |
| `threadId` | 仅 iOS | `string` | 系统用来在视觉上把通知分组在一起的标识符。共享同一个 `threadId` 的通知会被堆叠成一组。与 `collapseId` 不同，不会替换或移除任何通知。映射到 [`aps.thread-id`](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Payload-key-reference)。 |
| `mutableContent` | 仅 iOS | `boolean` | 指定此通知是否可以被[客户端应用拦截](https://developer.apple.com/documentation/usernotifications/modifying-content-in-newly-delivered-notifications?language=objc)。默认为 `false`。 |

**关于 `contentAvailable` 的说明**：此字段取代了已弃用的 `_contentAvailable` 字段，后者仍被接受以保持向后兼容。如果两者都指定，`contentAvailable` 优先。

**关于 `ttl` 的说明**：在 Android 上，我们会尽最大努力立即投递 TTL 为零的消息，并且不会对它们限流。不过，把 TTL 设为较低的值（例如零）可能会阻止普通优先级的通知到达处于 doze 模式的 Android 设备。要保证通知被投递，TTL 必须足够长，以便设备从 doze 模式中唤醒。当两者都指定时，此字段优先于 `expiration`。

**关于 `priority` 的说明**：在 Android 上，普通优先级的消息不会在休眠设备上打开网络连接，其投递可能会被延迟以节省电量。高优先级消息更有可能被立即投递，并可能唤醒休眠设备以打开网络连接，从而消耗能量。在 iOS 上，普通优先级的消息会在考虑设备电量的时间发送，并可能被分组后成批投递。它们会被限流，Apple 可能不会投递它们。高优先级消息通常会立即发送。普通优先级对应于 APNs 优先级 5，高优先级对应于 10。

**关于 `sound` 和 `badge` 的说明**：在 iOS 上，只有用户允许声音时系统才会播放声音，只有用户允许角标时才会设置角标。[`getPermissionsAsync()`](/versions/latest/sdk/notifications#getpermissionsasync) 把这两项设置报告为 `ios.allowsSound` 和 `ios.allowsBadge`。当其中一项关闭时，顶层 `status` 仍为 `granted`。当通知到达时没有声音或没有角标，请检查这两个 `ios` 字段。用户在第一次权限提示中选择这两项设置，之后可以在“设置”应用中更改它们。

**关于 `channelId` 的说明**：如果留空，会使用 “Default” 渠道，如果设备上尚不存在该渠道，Expo 会创建它。不过请谨慎使用，因为 “Default” 渠道是面向用户的，你可能无法完全删除它。

### 推送票据格式

```js
{
  "data": [
    {
      "status": "error" | "ok",
      "id": string, // 这是回执 ID
      // 如果 status === "error"
      "message": string,
      "details": JSON
    },
    ...
  ],
  // 仅当整个请求出错时才会填充
  "errors": [{
    "code": string,
    "message": string
  }]
}
```

### 推送回执请求格式

```js
{
  "ids": string[]
}
```

### 推送回执响应格式

```js
{
  "data": {
    Receipt ID: {
      "status": "error" | "ok",
      // 如果 status === "error"
      "message": string,
      "details": JSON
    },
    ...
  },
  // 仅当整个请求出错时才会填充
  "errors": [{
    "code": string,
    "message": string
  }]
}
```

## 投递保证

Expo 会尽最大努力把通知投递给 Google 和 Apple 运营的推送通知服务。Expo 的基础设施设计为至少尝试一次投递到底层推送通知服务。通知被投递给 Google 或 Apple 不止一次的可能性，高于完全没有投递；不过，这两种结果都不常见。

通知被移交给底层推送通知服务之后，Expo 会创建一条“推送回执”，记录移交是否成功。推送回执表示底层推送通知服务是否收到了该通知。

最后，Google 和 Apple 的推送通知服务会按照各自的政策把通知投递到设备。

## 故障排除

<details>
<summary>网络连接问题</summary>

本节帮助你诊断并解决常见的网络问题。你的服务器必须能够连接到美国区域的 Google Cloud Platform 服务，因为 Expo 的推送通知服务托管在那里。

### DNS 解析

测试你的服务器能否解析 Expo 推送服务的域名：

```bash
dig exp.host

# 使用公共 DNS 服务器检查
dig @8.8.8.8 exp.host
```

### 网络路由与连通性

验证你的服务器能否到达 Expo 的端点：

```bash
# 使用 traceroute 找出路由问题
traceroute exp.host

# 测试基本连通性
ping exp.host

# 测试到推送服务器的 HTTPS 连通性。
# 你应该收到状态码为 200 的 HTTP 响应头。
curl --verbose https://exp.host/
```

需要检查的常见问题：

- 防火墙规则阻止出站 HTTPS（端口 443）流量
- 可能需要身份验证或特殊配置的公司代理服务器
- 网络 ACL 或安全组（在云环境中）限制出站连接
- 由于 MTU 大小问题导致的数据包分片

### TLS 证书校验

确保你的服务器能够校验服务器的 TLS 证书：

```bash
openssl s_client -connect exp.host:443 -servername exp.host
```

我们使用由包括 Cloudflare、Google 和 Let's Encrypt 在内的主要服务提供商签名的标准 TLS 证书。

</details>
