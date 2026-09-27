const fs = require('fs');

function apply(file, pairs) {
  let text = fs.readFileSync(file, 'utf8');
  const missing = [];
  for (const [a, b] of pairs) {
    if (!text.includes(a)) missing.push(a.slice(0, 100).replace(/\n/g, '\\n'));
    else text = text.split(a).join(b);
  }
  return { text, missing };
}

function write(dest, text) {
  fs.writeFileSync(dest, text.replace(/\r\n/g, '\n'));
}

const nSrc = 'E:/个人/个人项目/expo/.scratch/tmp/sdk-en/versions__latest__sdk__notifications.md';
const nDest = 'E:/个人/个人项目/expo/src/content/pages/versions/latest/sdk/notifications.md';

const nPairs = [
  [
    `---
title: Notifications
description: A library that provides an API to fetch push notification tokens and to present, schedule, receive and respond to notifications.
packageName: expo-notifications
---

# Notifications`,
    `---
title: Notifications 包参考
description: 用于获取推送通知令牌，以及呈现、调度、接收和响应通知的库。
---

# Notifications 包参考`,
  ],
  [
    '`expo-notifications` provides an API to fetch push notification tokens and to present, schedule, receive and respond to notifications.',
    '`expo-notifications` 提供用于获取推送通知令牌，以及呈现、调度、接收和响应通知的 API。',
  ],
  [
    '- [Notification guides](/push-notifications/overview)：Do not miss our guides on how to set up, send, and handle push notifications.',
    '- [通知指南](/push-notifications/overview)：不要错过我们关于如何设置、发送和处理推送通知的指南。',
  ],
  [
    'Push notifications (remote notifications) functionality provided by `expo-notifications` is unavailable in Expo Go on Android from SDK 53. A [development build](/develop/development-builds/introduction) is required to use push notifications. Local notifications (in-app notifications) remain available in Expo Go.',
    '从 SDK 53 起，`expo-notifications` 提供的推送通知（远程通知）功能在 Android 的 Expo Go 中不可用。使用推送通知需要[开发构建](/develop/development-builds/introduction)。本地通知（应用内通知）在 Expo Go 中仍然可用。',
  ],
  ['## Features', '## 特性'],
  ['- Schedule a one-off notification for a specific date or some time from now', '- 为特定日期或从现在起的一段时间调度一次性通知'],
  ['- Schedule a notification repeating in some time interval (or a calendar date match on iOS)', '- 按某个时间间隔（或在 iOS 上按日历日期匹配）重复调度通知'],
  ['- Get and set the application badge icon number', '- 获取和设置应用角标数字'],
  ['- Obtain a native device push token, so you can send push notifications with FCM (for Android) and APNs (for iOS)', '- 获取原生设备推送令牌，以便用 FCM（Android）和 APNs（iOS）发送推送通知'],
  ['- Obtain an Expo push token, so you can send push notifications with [Expo Push Service](/push-notifications/sending-notifications)', '- 获取 Expo 推送令牌，以便用 [Expo 推送服务](/push-notifications/sending-notifications)发送推送通知'],
  ['- Listen to incoming notifications in the foreground and background', '- 在前台和后台监听传入通知'],
  ['- Listen to interactions with notifications', '- 监听与通知的交互'],
  ['- Handle notifications when the app is in the foreground', '- 在应用处于前台时处理通知'],
  ['- Imperatively dismiss notifications from Notification Center/tray', '- 以命令方式从通知中心/通知栏关闭通知'],
  ['- Create, update, and delete [Android notification channels](https://developer.android.com/develop/ui/views/notifications/channels)', '- 创建、更新和删除 [Android 通知渠道](https://developer.android.com/develop/ui/views/notifications/channels)'],
  ['- Set custom icon and color for notifications on Android', '- 在 Android 上为通知设置自定义图标和颜色'],
  ['## Installation', '## 安装'],
  [
    `Then proceed to [configuration](#configuration) to set up the [config plugin](#app-config) and
obtain the [credentials](#credentials) for push notifications.`,
    '然后继续[配置](#配置)，设置[配置插件](#应用配置)并获取推送通知的[凭据](#凭据)。',
  ],
  ['### Known issues （Android）', '### 已知问题（Android）'],
  [
    'When launching the app from a push notification in **Android development builds**, the splash screen may fail to display correctly about 70% of the time. The icon and fade animation may not appear as expected.',
    '在 **Android 开发构建**中从推送通知启动应用时，启动画面大约有 70% 的时间无法正确显示。图标和淡出动画可能不会按预期出现。',
  ],
  ['- Icon may be missing', '- 图标可能缺失'],
  ['- Fade animation may not run', '- 淡出动画可能不会运行'],
  ['- Only the background color may flash briefly', '- 可能只短暂闪过背景色'],
  [
    'This issue only affects debug builds and does not occur in release builds. To workaround it, test notification launches in release mode (`npx expo run:android --variant release`) for accurate behavior.',
    '此问题只影响调试构建，不会出现在发布构建中。变通方法是在发布模式下测试通知启动（`npx expo run:android --variant release`），以获得准确行为。',
  ],
  ['## Usage', '## 用法'],
  [
    'Check out the example Snack below to see Notifications in action. Push notifications work on physical devices, Android emulators with Google Play services, and iOS simulators on Xcode 14 or later (macOS 13+, iOS 16+).',
    '查看下面的示例 Snack，了解 Notifications 的实际效果。推送通知可在物理设备、带 Google Play 服务的 Android 模拟器，以及 Xcode 14 或更高版本上的 iOS 模拟器（macOS 13+、iOS 16+）上工作。',
  ],
  [
    `  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // EAS projectId is used here.`,
    `  // 了解更多关于 projectId 的信息：
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // 这里使用 EAS projectId。`,
  ],
  ['### Present a local (in-app) notification to the user', '### 向用户呈现本地（应用内）通知'],
  ['### Handle push notifications with navigation', '### 用导航处理推送通知'],
  [
    "If you'd like to deep link to a specific screen in your app when you receive a push notification, you can configure either of Expo's navigation systems to do that.",
    '如果希望在收到推送通知时深链接到应用中的特定界面，可以配置 Expo 的任一导航系统来实现。',
  ],
  [
    "You can use Expo Router's [built-in deep linking](/router/basics/core-concepts#2-all-pages-have-a-url) to handle incoming URLs from push notifications. Simply configure the root layout to listen for incoming and initial notification events.",
    '可以用 Expo Router 的[内置深链接](/router/basics/core-concepts#2-all-pages-have-a-url)处理来自推送通知的传入 URL。只需配置根布局，监听传入的通知事件和初始通知事件。',
  ],
  [
    `        /* @info Push the URL. You may want to verify the format before navigating. */
        router.push(url);
        /* @end */
        /* @info Clear the stored response so a layout re-mount does not redirect to the same URL again. */
        Notifications.clearLastNotificationResponse();
        /* @end */`,
    `        // 推送该 URL。导航前你可能需要验证格式。
        router.push(url);
        // 清除已存储的响应，以免布局重新挂载时再次跳转到同一 URL。
        Notifications.clearLastNotificationResponse();`,
  ],
  [
    `    /* @info Handle the initial push notification. */
    const response = Notifications.getLastNotificationResponse();`,
    `    // 处理初始推送通知。
    const response = Notifications.getLastNotificationResponse();`,
  ],
  [
    `    /* @info Listen for runtime notifications. */
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      /* @end */`,
    `    // 监听运行时通知。
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {`,
  ],
  [
    `  /* @info Observe at the root. Ensure this layout never returns **null** or the navigation will go unhandled. */
  useNotificationObserver();
  /* @end */`,
    `  // 在根布局观察。确保此布局永远不返回 null，否则导航将无法处理。
  useNotificationObserver();`,
  ],
  [
    "React Navigation's manual [linking configuration](https://reactnavigation.org/docs/navigation-container#linking) can be configured to handle incoming redirects from push notifications:",
    '可以配置 React Navigation 的手动[链接配置](https://reactnavigation.org/docs/navigation-container#linking)，以处理来自推送通知的传入跳转：',
  ],
  ['          // Configuration for linking', '          // 链接配置'],
  [
    `          // First, you may want to do the default deep link handling
          // Check if app was opened from a deep link`,
    `          // 首先，你可能需要做默认的深链接处理
          // 检查应用是否由深链接打开`,
  ],
  ['          // Handle URL from expo push notifications', '          // 处理来自 Expo 推送通知的 URL'],
  ['          // Listen to incoming links from deep linking', '          // 监听来自深链接的传入链接'],
  ['          // Listen to expo push notifications', '          // 监听 Expo 推送通知'],
  [
    `            // Any custom logic to see whether the URL needs to be handled
            //...`,
    `            // 用于判断是否需要处理该 URL 的任何自定义逻辑
            //...`,
  ],
  ['              // Let React Navigation handle the URL', '              // 让 React Navigation 处理该 URL'],
  [
    '            // Clear the stored response so the next getInitialURL call does not redirect to the same URL again',
    '            // 清除已存储的响应，以免下一次 getInitialURL 调用再次跳转到同一 URL',
  ],
  ['            // Clean up the event listeners', '            // 清理事件监听器'],
  [
    'See more details on [React Navigation documentation](https://reactnavigation.org/docs/deep-linking/#third-party-integrations).',
    '更多细节见 [React Navigation 文档](https://reactnavigation.org/docs/deep-linking/#third-party-integrations)。',
  ],
  ['## Configuration', '## 配置'],
  ['### Credentials', '### 凭据'],
  [
    'Follow the [setup guide](/push-notifications/push-notifications-setup#get-credentials-for-development-builds).',
    '请遵循[设置指南](/push-notifications/push-notifications-setup#get-credentials-for-development-builds)。',
  ],
  ['### App config', '### 应用配置'],
  [
    'To configure `expo-notifications`, use the built-in [config plugin](/config-plugins/introduction) in the app config (**app.json** or **app.config.js**) for [EAS Build](/build/introduction) or with `npx expo run:[android|ios]`. The plugin allows you to configure the following properties that cannot be set at runtime and require building a new app binary to take effect:',
    '要配置 `expo-notifications`，请在应用配置（**app.json** 或 **app.config.js**）中使用内置[配置插件](/config-plugins/introduction)，用于 [EAS Build](/build/introduction) 或 `npx expo run:[android|ios]`。该插件可以配置以下无法在运行时设置、必须构建新的应用二进制才会生效的属性：',
  ],
  ['### Configurable properties', '### 可配置属性'],
  ['| Name | Default | Description |', '| 名称 | 默认值 | 说明 |'],
  ['| `icon` | - | Only for: Android. Local path to an image to use as the icon for push notifications. 96x96 all-white png with transparency. |', '| `icon` | - | 仅 Android。用作推送通知图标的图片本地路径。96x96、带透明度的全白 png。 |'],
  ['| `largeIcon` | - | Only for: Android. Local path to an image to use as the large icon for notifications. The image is resized to 64x64 dp and shown next to the notification text. A notification that carries its own image uses that image instead. |', '| `largeIcon` | - | 仅 Android。用作通知大图标的图片本地路径。图片会调整为 64x64 dp，并显示在通知文本旁边。自带图片的通知会改用那张图片。 |'],
  ['| `color` | `#ffffff` | Only for: Android. Tint color for the push notification image when it appears in the notification tray. |', '| `color` | `#ffffff` | 仅 Android。推送通知图片出现在通知栏中时的着色。 |'],
  ['| `defaultChannel` | - | Only for: Android. Default channel for FCMv1 notifications. |', '| `defaultChannel` | - | 仅 Android。FCMv1 通知的默认渠道。 |'],
  ['| `sounds` | - | Array of local paths to sound files (.wav recommended) that can be used as custom notification sounds. Sound will not be played when focus mode does not permit it or silent mode is on. |', '| `sounds` | - | 可用作自定义通知声音的声音文件本地路径数组（建议 .wav）。专注模式不允许或静音模式开启时不会播放声音。 |'],
  ['| `enableBackgroundRemoteNotifications` | `false` | Only for: iOS. Whether to enable background remote notifications, as described in [Apple documentation](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app). This updates the `UIBackgroundModes` key in the `Info.plist` to include `remote-notification`. |', '| `enableBackgroundRemoteNotifications` | `false` | 仅 iOS。是否启用后台远程通知，如 [Apple 文档](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app)所述。这会更新 `Info.plist` 中的 `UIBackgroundModes` 键，使其包含 `remote-notification`。 |'],
  ['Here is an example of using the config plugin in the app config file:', '下面是在应用配置文件中使用配置插件的示例：'],
  [
    `> The iOS APNs entitlement is _always_ set to 'development'. Xcode automatically changes this to 'production' in the archive generated by a release build.
> See [this Stack Overflow answer on the APNs entitlement](https://stackoverflow.com/a/42293632/4047926).`,
    `:::note
iOS APNs 权利_始终_设为 'development'。Xcode 会在发布构建生成的归档中自动把它改为 'production'。见[这篇关于 APNs 权利的 Stack Overflow 回答](https://stackoverflow.com/a/42293632/4047926)。
:::`,
  ],
  ['<details><summary>Are you using this library in an existing React Native app?</summary>', '<details><summary>你是在现有 React Native 应用中使用这个库吗？</summary>'],
  [
    'Learn how to configure the native projects in the [installation instructions in the `expo-notifications` repository](https://github.com/expo/expo/tree/main/packages/expo-notifications#installation-in-bare-react-native-projects).',
    '关于如何配置原生项目，见 [`expo-notifications` 仓库中的安装说明](https://github.com/expo/expo/tree/main/packages/expo-notifications#installation-in-bare-react-native-projects)。',
  ],
  ['## Permissions', '## 权限'],
  [
    "- On Android, this module requires permission to subscribe to the device boot. It's used to set up scheduled notifications when the device (re)starts.\n  The `RECEIVE_BOOT_COMPLETED` permission is added automatically through the library's **AndroidManifest.xml**.",
    '- 在 Android 上，此模块需要订阅设备启动的权限。它用于在设备（重新）启动时设置已调度的通知。\n  `RECEIVE_BOOT_COMPLETED` 权限会通过库的 **AndroidManifest.xml** 自动添加。',
  ],
  [
    `- Starting from Android 12 (API level 31), to schedule a notification that triggers at an exact time, you need to add
  \`<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>\` to **AndroidManifest.xml**.
  Read more about the [exact alarm permission](https://developer.android.com/about/versions/12/behavior-changes-12#exact-alarm-permission).
  The \`delivery: 'alarmClock'\` trigger option also requires an exact alarm permission. On Android 13 (API level 33) and later, alarm clock, timer, and calendar apps
  can declare \`<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>\` instead. The system grants that permission without a user prompt.
  [Google Play's exact alarm policy](https://support.google.com/googleplay/android-developer/answer/13161072) restricts \`USE_EXACT_ALARM\` to those app categories.`,
    `- 从 Android 12（API 级别 31）起，要调度在精确时间触发的通知，需要在 **AndroidManifest.xml** 中添加
  \`<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>\`。
  更多信息见[精确闹钟权限](https://developer.android.com/about/versions/12/behavior-changes-12#exact-alarm-permission)。
  \`delivery: 'alarmClock'\` 触发选项也需要精确闹钟权限。在 Android 13（API 级别 33）及更高版本上，闹钟、计时器和日历应用
  可以改为声明 \`<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>\`。系统会授予该权限，无需用户提示。
  [Google Play 的精确闹钟政策](https://support.google.com/googleplay/android-developer/answer/13161072)把 \`USE_EXACT_ALARM\` 限制在这些应用类别。`,
  ],
  [
    `- On Android 13, app users must opt-in to receive notifications via a permissions prompt automatically triggered by the operating system.
  This prompt will not appear until at least one notification channel is created. The \`setNotificationChannelAsync\` must be called before
  \`getDevicePushTokenAsync\` or \`getExpoPushTokenAsync\` to obtain a push token. You can read more about the new notification permission behavior for Android 13
  in the [official documentation](https://developer.android.com/develop/ui/views/notifications/notification-permission#new-apps).`,
    `- 在 Android 13 上，应用用户必须通过操作系统自动触发的权限提示选择接收通知。
  在至少创建一个通知渠道之前，此提示不会出现。必须在
  \`getDevicePushTokenAsync\` 或 \`getExpoPushTokenAsync\` 之前调用 \`setNotificationChannelAsync\` 才能获取推送令牌。关于 Android 13 新的通知权限行为，详见
  [官方文档](https://developer.android.com/develop/ui/views/notifications/notification-permission#new-apps)。`,
  ],
  ['| Android permission | Description |', '| Android 权限 | 说明 |'],
  [
    '| `RECEIVE_BOOT_COMPLETED` | Allows an application to receive the Intent.ACTION_BOOT_COMPLETED that is broadcast after the system finishes booting. Allows an application to receive the `[Intent.ACTION_BOOT_COMPLETED](https://developer.android.com/reference/android/content/Intent#ACTION_BOOT_COMPLETED)` that is broadcast after the system finishes booting. If you don\'t request this permission, you will not receive the broadcast at that time. Though holding this permission does not have any security implications, it can have a negative impact on the user experience by increasing the amount of time it takes the system to start and allowing applications to have themselves running without the user being aware of them. As such, you must explicitly declare your use of this facility to make that visible to the user. |',
    '| `RECEIVE_BOOT_COMPLETED` | 允许应用接收系统启动完成后广播的 Intent.ACTION_BOOT_COMPLETED。允许应用接收系统启动完成后广播的 `[Intent.ACTION_BOOT_COMPLETED](https://developer.android.com/reference/android/content/Intent#ACTION_BOOT_COMPLETED)`。如果不请求此权限，届时将收不到该广播。持有此权限没有安全影响，但可能增加系统启动所需时间，并允许应用在用户不知情的情况下自行运行，从而对用户体验产生负面影响。因此，你必须显式声明使用此功能，以便用户可见。 |',
  ],
  ['| `SCHEDULE_EXACT_ALARM` | Allows applications to use exact alarm APIs. |', '| `SCHEDULE_EXACT_ALARM` | 允许应用使用精确闹钟 API。 |'],
  [
    '| `USE_EXACT_ALARM` | Allows apps to use exact alarms just like with SCHEDULE_EXACT_ALARM but without needing to request this permission from the user. Allows apps to use exact alarms just like with `[SCHEDULE_EXACT_ALARM](https://developer.android.com/reference/android/Manifest.permission#SCHEDULE_EXACT_ALARM)` but without needing to request this permission from the user. |',
    '| `USE_EXACT_ALARM` | 允许应用像使用 SCHEDULE_EXACT_ALARM 一样使用精确闹钟，但无需向用户请求此权限。允许应用像使用 `[SCHEDULE_EXACT_ALARM](https://developer.android.com/reference/android/Manifest.permission#SCHEDULE_EXACT_ALARM)` 一样使用精确闹钟，但无需向用户请求此权限。 |',
  ],
  [
    'No usage description is required, see [notification-related permissions](#fetch-information-about-notifications-related-permissions).',
    '不需要用途说明，见[与通知相关的权限](#fetch-information-about-notifications-related-permissions)。',
  ],
  ['### Interpret the iOS permissions response', '### 解读 iOS 权限响应'],
  [
    "On iOS, permissions for sending notifications are a little more granular than they are on Android. This is why you should rely on the `NotificationPermissionsStatus`'s `ios.status` field, instead of the root `status` field.",
    '在 iOS 上，发送通知的权限比 Android 更细。因此应依赖 `NotificationPermissionsStatus` 的 `ios.status` 字段，而不是根级 `status` 字段。',
  ],
  [
    'This value will be one of the following, accessible under `Notifications.IosAuthorizationStatus`:',
    '该值将是以下之一，可通过 `Notifications.IosAuthorizationStatus` 访问：',
  ],
  ["- `NOT_DETERMINED`: The user hasn't yet made a choice about whether the app is allowed to schedule notifications", '- `NOT_DETERMINED`：用户尚未选择是否允许应用调度通知'],
  ["- `DENIED`: The app isn't authorized to schedule or receive notifications", '- `DENIED`：应用未被授权调度或接收通知'],
  ['- `AUTHORIZED`: The app is authorized to schedule or receive notifications', '- `AUTHORIZED`：应用已被授权调度或接收通知'],
  ['- `PROVISIONAL`: The app is provisionally authorized to post noninterruptive user notifications', '- `PROVISIONAL`：应用被临时授权发布不打断用户的通知'],
  ['- `EPHEMERAL`: The app is authorized to schedule or receive notifications for a limited amount of time', '- `EPHEMERAL`：应用被授权在有限时间内调度或接收通知'],
  ['## Notification events listeners', '## 通知事件监听器'],
  [
    'Notification events include incoming notifications, interactions your users perform with notifications (this can be tapping on a notification, or interacting with it via [notification categories](#管理交互式通知的通知类别)), and rare occasions when your notifications may be dropped.',
    'PLACEHOLDER',
  ],
];

// The categories anchor is translated later; set the real sentence now with the final anchor.
nPairs[nPairs.length - 1] = [
  'Notification events include incoming notifications, interactions your users perform with notifications (this can be tapping on a notification, or interacting with it via [notification categories](#manage-notification-categories-interactive-notifications)), and rare occasions when your notifications may be dropped.',
  '通知事件包括传入通知、用户对通知执行的交互（可以是点按通知，或通过[通知类别](#管理交互式通知的通知类别)与之交互），以及通知偶尔被丢弃的情况。',
];

nPairs.push(
  [
    'Several listeners are exposed and documented in the [Push notification behaviors](/push-notifications/what-you-need-to-know#push-notification-behaviors) section.',
    '若干监听器已在[推送通知行为](/push-notifications/what-you-need-to-know#push-notification-behaviors)一节中公开并说明。',
  ],
  ['## Headless (Background) notifications', '## 无界面（后台）通知'],
  [
    'See the [definition](/push-notifications/what-you-need-to-know#headless-background-notifications) of Headless Background Notifications in the [What you need to know](/push-notifications/what-you-need-to-know) guide.',
    '无界面后台通知的[定义](/push-notifications/what-you-need-to-know#headless-background-notifications)见[须知](/push-notifications/what-you-need-to-know)指南。',
  ],
  [
    'To handle notifications while the app is in the background or not running, you need to do the following:',
    '要在应用处于后台或未运行时处理通知，需要完成以下步骤：',
  ],
  ['- Add `expo-task-manager` package to your project.', '- 向项目添加 `expo-task-manager` 包。'],
  ['- [Configure background notifications](#background-notification-configuration).', '- [配置后台通知](#ios-后台通知配置)。'],
  [
    '- In your application code, set up a [background task](#registertaskasynctaskname) to run when the notification is received.',
    '- 在应用代码中设置一个[后台任务](#registertaskasynctaskname)，在收到通知时运行。',
  ],
  ['Then send a push notification which:', '然后发送满足以下条件的推送通知：'],
  ['- Contains only the `data` key (no `title`, `body`)', '- 只包含 `data` 键（没有 `title`、`body`）'],
  [
    '- Has `contentAvailable: true` set for iOS — see the [Expo push notification service payload format](/push-notifications/sending-notifications#message-request-format)',
    '- 对 iOS 设置 `contentAvailable: true`——见 [Expo 推送通知服务载荷格式](/push-notifications/sending-notifications#message-request-format)',
  ],
  ['### Background notification configuration （iOS）', '### iOS 后台通知配置'],
  [
    'To be able to use headless (background) notifications push notifications on iOS, the `remote-notification` value needs to be present in the `UIBackgroundModes` array in your app\'s **Info.plist** file.',
    '要在 iOS 上使用无界面（后台）推送通知，应用 **Info.plist** 文件的 `UIBackgroundModes` 数组中必须有 `remote-notification` 值。',
  ],
  [
    "**If you're using [CNG](/workflow/continuous-native-generation)**, set the [`enableBackgroundRemoteNotifications` property](#configurable-properties) of the config plugin to true, and the correct configuration will be applied automatically by prebuild.",
    '**如果你使用 [CNG](/workflow/continuous-native-generation)**，把配置插件的 [`enableBackgroundRemoteNotifications` 属性](#可配置属性)设为 true，预构建会自动应用正确配置。',
  ],
  ['<details><summary>Configure UIBackgroundModes manually on iOS</summary>', '<details><summary>在 iOS 上手动配置 UIBackgroundModes</summary>'],
  [
    "If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation)) or you're using a native iOS project, then you'll need to add the following to your **Expo.plist** file:",
    '如果你不使用连续原生生成（[CNG](/workflow/continuous-native-generation)），或者使用原生 iOS 项目，则需要在 **Expo.plist** 文件中添加以下内容：',
  ],
  ['## Additional information', '## 更多信息'],
  ['### Set custom notification sounds', '### 设置自定义通知声音'],
  [
    'To add custom push notification sounds to your app, add the `expo-notifications` plugin to your **app.json** file and then under the `sounds` key, provide an array of local paths to sound files that can be used as custom notification sounds. These local paths are local to your project.',
    '要为应用添加自定义推送通知声音，请把 `expo-notifications` 插件加入 **app.json**，然后在 `sounds` 键下提供可用作自定义通知声音的声音文件本地路径数组。这些路径相对于你的项目。',
  ],
  [
    'After building your app, the array of files will be available for use in both [`NotificationContentInput`](#notificationcontentinput) and [`NotificationChannelInput`](#notificationchannelinput).\nYou only need to provide the base filename. Here\'s an example using the config above:',
    '构建应用后，该文件数组可在 [`NotificationContentInput`](#notificationcontentinput) 和 [`NotificationChannelInput`](#notificationchannelinput) 中使用。\n你只需要提供基本文件名。下面是使用上述配置的示例：',
  ],
  ["sound: 'mySoundFile.wav', // Provide ONLY the base filename", "sound: 'mySoundFile.wav', // 只提供基本文件名"],
  ['You can also manually add notification files to your Android and iOS projects if you prefer:', '如果你愿意，也可以手动把通知文件添加到 Android 和 iOS 项目：'],
  ['<details><summary>Manually adding notification sounds on Android</summary>', '<details><summary>在 Android 上手动添加通知声音</summary>'],
  [
    'On Androids 8.0+, playing a custom sound for a notification requires more than setting the `sound` property on the `NotificationContentInput`.\nYou will also need to configure the `NotificationChannel` with the appropriate `sound`, and use it when sending/scheduling the notification.',
    '在 Android 8.0 及以上，为通知播放自定义声音不只是在 `NotificationContentInput` 上设置 `sound` 属性。\n你还需要用相应的 `sound` 配置 `NotificationChannel`，并在发送/调度通知时使用它。',
  ],
  [
    'For the example below to work, you would place your **email_sound.wav** file in **android/app/src/main/res/raw/**.',
    '要让下面的示例生效，请把 **email_sound.wav** 文件放在 **android/app/src/main/res/raw/**。',
  ],
  ['// Prepare the notification channel', '// 准备通知渠道'],
  ["sound: 'email_sound.wav', // <- for Android 8.0+, see channelId property below", "sound: 'email_sound.wav', // <- Android 8.0 及以上，见下方 channelId 属性"],
  ['// Eg. schedule the notification', '// 例如，调度通知'],
  ["sound: 'email_sound.wav', // <- for Android below 8.0", "sound: 'email_sound.wav', // <- Android 8.0 以下"],
  ["channelId: 'new_emails', // <- for Android 8.0+, see definition above", "channelId: 'new_emails', // <- Android 8.0 及以上，见上方定义"],
  ['<details><summary>Manually adding notification sounds on iOS</summary>', '<details><summary>在 iOS 上手动添加通知声音</summary>'],
  [
    "On iOS, all that's needed is to place your sound file in your Xcode project (see the screenshot below),\nand then specify the sound file in your `NotificationContentInput`, like this:",
    '在 iOS 上，只需把声音文件放进 Xcode 项目（见下方截图），\n然后在 `NotificationContentInput` 中指定该声音文件，如下所示：',
  ],
  [
    '![notification.wav inside of app resources in Xcode project organizer](/static/images/notification-sound-ios.jpeg)',
    '![Xcode 项目组织器中应用资源里的 notification.wav](/static/images/notification-sound-ios.jpeg)',
  ],
  ['### Push notification payload specification', '### 推送通知载荷规范'],
  [
    'See [Message request format](/push-notifications/sending-notifications#message-request-format).',
    '见[消息请求格式](/push-notifications/sending-notifications#message-request-format)。',
  ],
  ['### Manage notification categories for interactive notifications', '### 管理交互式通知的通知类别'],
  [
    'Notification categories allow you to create interactive push notifications, so that a user can respond directly to the incoming notification\neither via buttons or a text response. A category defines the set of actions a user can take, and then those actions are applied to a notification\nby specifying the `categoryIdentifier` in the [`NotificationContent`](#notificationcontent).',
    '通知类别让你可以创建交互式推送通知，使用户可以通过按钮或文本回复直接响应传入通知。类别定义用户可以采取的一组操作，然后通过在 [`NotificationContent`](#notificationcontent) 中指定 `categoryIdentifier` 把这些操作应用到通知上。',
  ],
  [
    '![Image of notification categories on Android and iOS](/static/images/sdk/notifications/categories.webp)',
    '![Android 和 iOS 上的通知类别图片](/static/images/sdk/notifications/categories.webp)',
  ],
  [
    'On iOS, notification categories also allow you to customize your notifications further. With each category, you can set the interactive actions a user can take and configure things like the placeholder text to display when the user disables notification previews for your app.',
    '在 iOS 上，通知类别还允许你进一步自定义通知。对于每个类别，你可以设置用户可以采取的交互操作，并配置当用户关闭应用通知预览时显示的占位文本等内容。',
  ],
  ['## Platform-specific guides', '## 平台特定指南'],
  ['### Handling notification channels （android 8+）', '### 处理通知渠道（Android 8+）'],
  [
    `Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel. For each channel,
you can set the visual and auditory behavior that is applied to all notifications in that channel.
Then, users can change these settings and decide which notification channels from your app should be intrusive or visible at all,
as [Android developer docs](https://developer.android.com/training/notify-user/channels) states.`,
    `从 Android 8.0（API 级别 26）起，所有通知都必须分配到一个渠道。对于每个渠道，
你可以设置应用于该渠道中所有通知的视觉和听觉行为。
然后，用户可以更改这些设置，并决定你的应用中哪些通知渠道应该打扰用户或完全可见，
如 [Android 开发者文档](https://developer.android.com/training/notify-user/channels)所述。`,
  ],
  [
    'If you do not specify a notification channel, `expo-notifications` will create a fallback channel for you, named **Miscellaneous**.\nWe encourage you to always ensure appropriate channels with informative names are set up for the application and to always send notifications to these channels.',
    '如果你不指定通知渠道，`expo-notifications` 会为你创建一个名为 **Miscellaneous** 的回退渠道。\n我们建议始终为应用设置名称清晰的适当渠道，并始终向这些渠道发送通知。',
  ],
  [
    '> Calling these methods is a no-op for platforms that do not support this feature (Android below version 8.0 (26) and iOS).',
    '> 在不支持此功能的平台上（低于 8.0（26）的 Android 以及 iOS），调用这些方法不会产生效果。',
  ],
  ['### Custom notification icon and colors （Android）', '### 自定义通知图标和颜色（Android）'],
  [
    "You can configure the `icon` and `color` keys for notification in the project by using the [`expo-notifications` config plugin](#可配置属性) with [Expo Prebuild](/workflow/continuous-native-generation). These are build-time settings, so you'll need to recompile your native Android app with `eas build -p android` or `npx expo run:android` to see the changes.",
    'PLACEHOLDER2',
  ]
);

nPairs[nPairs.length - 1] = [
  'You can configure the `icon` and `color` keys for notification in the project by using the [`expo-notifications` config plugin](#configurable-properties) with [Expo Prebuild](/workflow/continuous-native-generation). These are build-time settings, so you\'ll need to recompile your native Android app with `eas build -p android` or `npx expo run:android` to see the changes.',
  '可以用 [`expo-notifications` 配置插件](#可配置属性)配合 [Expo 预构建](/workflow/continuous-native-generation)，在项目中配置通知的 `icon` 和 `color` 键。这些是构建时设置，因此需要用 `eas build -p android` 或 `npx expo run:android` 重新编译原生 Android 应用才能看到变化。',
];

nPairs.push(
  [
    "For your notification icon, make sure you follow [Google's design guidelines](https://m2.material.io/design/iconography/product-icons.html#design-principles)\n(the icon must be all white with a transparent background) or else it may not be displayed as intended.",
    '对于通知图标，请务必遵循 [Google 的设计指南](https://m2.material.io/design/iconography/product-icons.html#design-principles)\n（图标必须全白且背景透明），否则可能无法按预期显示。',
  ],
  [
    'You can also set a custom notification color **per-notification** directly in your [`NotificationContentInput`](#notificationcontentinput) under the `color` attribute.',
    '你也可以在 [`NotificationContentInput`](#notificationcontentinput) 的 `color` 属性中**按条通知**直接设置自定义通知颜色。',
  ]
);

const n = apply(nSrc, nPairs);
write(nDest, n.text);
console.log('notifications missing', n.missing.length);
n.missing.forEach(m => console.log(' N', m));

const sSrc = 'E:/个人/个人项目/expo/.scratch/tmp/sdk-en/versions__latest__sdk__sqlite.md';
const sDest = 'E:/个人/个人项目/expo/src/content/pages/versions/latest/sdk/sqlite.md';

const sPairs = [
  [
    `---
title: SQLite
description: A library that provides access to a database that can be queried through a SQLite API.
packageName: expo-sqlite
---

# SQLite`,
    `---
title: SQLite 包参考
description: 用于访问可通过 SQLite API 查询的数据库的库。
---

# SQLite 包参考`,
  ],
  [
    '`expo-sqlite` gives your app access to a database that can be queried through a SQLite API. The database is persisted across restarts of your app.',
    '`expo-sqlite` 让应用可以访问可通过 SQLite API 查询的数据库。数据库会在应用重启后保留。',
  ],
  [
    'On Apple TV, the underlying database file is in the caches directory and not the application documents directory, per [Apple platform guidelines](https://github.com/react-native-tvos/react-native-tvos/issues/68#issuecomment-628327676).',
    '在 Apple TV 上，底层数据库文件位于缓存目录，而不是应用文档目录，这符合 [Apple 平台指南](https://github.com/react-native-tvos/react-native-tvos/issues/68#issuecomment-628327676)。',
  ],
  ['## Installation', '## 安装'],
  ['## Configuration in app config', '## 在应用配置中配置'],
  [
    'You can configure `expo-sqlite` for advanced configurations using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you\'ll need to manually configure the library.',
    '如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)对 `expo-sqlite` 做高级配置。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。',
  ],
  ['### Example app.json with config plugin', '### 带配置插件的 app.json 示例'],
  ['            // Override the shared configuration for Android', '            // 覆盖 Android 的共享配置'],
  ['            // You can also override the shared configurations for iOS', '            // 也可以覆盖 iOS 的共享配置'],
  ['### Configurable properties', '### 可配置属性'],
  ['| Name | Default | Description |', '| 名称 | 默认值 | 说明 |'],
  ['| `customBuildFlags` | - | Custom build flags to be passed to the SQLite build process. |', '| `customBuildFlags` | - | 传给 SQLite 构建过程的自定义构建标志。 |'],
  ['| `enableFTS` | `true` | Whether to enable the [FTS3, FTS4](https://www.sqlite.org/fts3.html) and [FTS5](https://www.sqlite.org/fts5.html) extensions. |', '| `enableFTS` | `true` | 是否启用 [FTS3、FTS4](https://www.sqlite.org/fts3.html) 和 [FTS5](https://www.sqlite.org/fts5.html) 扩展。 |'],
  ['| `useSQLCipher` | `false` | Use the [SQLCipher](https://www.zetetic.net/sqlcipher/) implementations rather than the default SQLite. |', '| `useSQLCipher` | `false` | 使用 [SQLCipher](https://www.zetetic.net/sqlcipher/) 实现，而不是默认的 SQLite。 |'],
  ['| `withSQLiteVecExtension` | `false` | Include the [sqlite-vec](https://github.com/asg017/sqlite-vec) extension to [`bundledExtensions`](#sqlitebundledextensions). |', '| `withSQLiteVecExtension` | `false` | 把 [sqlite-vec](https://github.com/asg017/sqlite-vec) 扩展包含进 [`bundledExtensions`](#sqlitebundledextensions)。 |'],
  ['## Web setup', '## Web 设置'],
  [
    'To use `expo-sqlite` on web, you need to configure Metro bundler to support **wasm** files and add HTTP headers to allow [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) usage.',
    '要在 Web 上使用 `expo-sqlite`，需要配置 Metro 打包器以支持 **wasm** 文件，并添加 HTTP 响应头以允许使用 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)。',
  ],
  [
    "Add the following configuration to your **metro.config.js**. If you don't have the **metro.config.js** yet, you can run `npx expo customize metro.config.js`. [Learn more about customizing Metro](/guides/customizing-metro).",
    '把以下配置添加到 **metro.config.js**。如果还没有 **metro.config.js**，可以运行 `npx expo customize metro.config.js`。[了解更多关于自定义 Metro 的信息](/guides/customizing-metro)。',
  ],
  ['+// Add wasm asset support', '+// 添加 wasm 资源支持'],
  ['+// Add COEP and COOP headers to support SharedArrayBuffer', '+// 添加 COEP 与 COOP 响应头以支持 SharedArrayBuffer'],
  [
    'If you deploy your app to web hosting services, you will also need to add the `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers to your web server. [Learn more about the `COEP`, `COOP` headers, and `SharedArrayBuffer`](https://developer.chrome.com/blog/enabling-shared-array-buffer/).',
    '如果把应用部署到 Web 托管服务，还需要向 Web 服务器添加 `Cross-Origin-Embedder-Policy` 和 `Cross-Origin-Opener-Policy` 响应头。[了解更多关于 `COEP`、`COOP` 响应头和 `SharedArrayBuffer` 的信息](https://developer.chrome.com/blog/enabling-shared-array-buffer/)。',
  ],
  [
    'If you deploy your app on [EAS Hosting](/eas/hosting/introduction), you can configure the headers in your app config:',
    '如果把应用部署在 [EAS Hosting](/eas/hosting/introduction) 上，可以在应用配置中配置这些响应头：',
  ],
  ['## Usage', '## 用法'],
  ['Import the module from `expo-sqlite`.', '从 `expo-sqlite` 导入该模块。'],
  ['### `useSQLiteContext()` hook with `React.Suspense`', '### 配合 `React.Suspense` 的 `useSQLiteContext()` Hook'],
  ['### `useSQLiteContext()` hook', '### `useSQLiteContext()` Hook'],
  ['### Basic CRUD operations', '### 基本 CRUD 操作'],
  [
    '// `execAsync()` is useful for bulk queries when you want to execute altogether.\n// Note that `execAsync()` does not escape parameters and may lead to SQL injection.',
    '// `execAsync()` 适合想要一次性执行的批量查询。\n// 注意 `execAsync()` 不会转义参数，可能导致 SQL 注入。',
  ],
  ['// `runAsync()` is useful when you want to execute some write operations.', '// `runAsync()` 适合执行一些写入操作。'],
  ["await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // Binding unnamed parameters from variadic arguments", "await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // 从可变参数绑定未命名参数"],
  ["await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // Binding unnamed parameters from array", "await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // 从数组绑定未命名参数"],
  ["await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // Binding named parameters from object", "await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // 从对象绑定命名参数"],
  ['// `getFirstAsync()` is useful when you want to get a single row from the database.', '// `getFirstAsync()` 适合从数据库获取单行。'],
  ['// `getAllAsync()` is useful when you want to get all results as an array of objects.', '// `getAllAsync()` 适合把全部结果作为对象数组获取。'],
  ['// `getEachAsync()` is useful when you want to iterate SQLite query cursor.', '// `getEachAsync()` 适合迭代 SQLite 查询游标。'],
  ['### Prepared statements', '### 预处理语句'],
  [
    'Prepared statements allow you to compile your SQL query once and execute it multiple times with different parameters. They automatically escape input parameters to defend against SQL injection attacks, and are recommended for queries that include user input. You can get a prepared statement by calling [`prepareAsync()`](#prepareasyncsource) or [`prepareSync()`](#preparesyncsource) method on a database instance. The prepared statement can fulfill CRUD operations by calling [`executeAsync()`](#executeasyncparams) or [`executeSync()`](#executesyncparams) method.',
    '预处理语句让你编译一次 SQL 查询，再用不同参数多次执行。它们会自动转义输入参数以防御 SQL 注入攻击，建议用于包含用户输入的查询。可以在数据库实例上调用 [`prepareAsync()`](#prepareasyncsource) 或 [`prepareSync()`](#preparesyncsource) 获取预处理语句。预处理语句可以通过调用 [`executeAsync()`](#executeasyncparams) 或 [`executeSync()`](#executesyncparams) 完成 CRUD 操作。',
  ],
  [
    '> **Note:** Remember to call [`finalizeAsync()`](#finalizeasync) or [`finalizeSync()`](#finalizesync) method to release the prepared statement after you finish using the statement. `try-finally` block is recommended to ensure the prepared statement is finalized.',
    ':::note\n记得在用完预处理语句后调用 [`finalizeAsync()`](#finalizeasync) 或 [`finalizeSync()`](#finalizesync) 来释放它。建议使用 `try-finally` 块，确保预处理语句被终结。\n:::',
  ],
  ['  // Reset the SQLite query cursor to the beginning for the next `getAllAsync()` call.', '  // 把 SQLite 查询游标重置到开头，以便下一次 `getAllAsync()` 调用。'],
  ['  // Reset the SQLite query cursor to the beginning for the next `for-await-of` loop.', '  // 把 SQLite 查询游标重置到开头，以便下一次 `for-await-of` 循环。'],
  ['  // The result object is also an async iterable. You can use it in `for-await-of` loop to iterate SQLite query cursor.', '  // 结果对象也是异步可迭代对象。可以在 `for-await-of` 循环中用它迭代 SQLite 查询游标。'],
  ['### Tagged template literals API', '### 标签模板字面量 API'],
  [
    'For convenience and improved developer experience, `expo-sqlite` provides Bun-inspired tagged template literals API through the `db.sql` property. This API automatically escapes parameters to prevent SQL injection attacks and provides automatic type inference based on the query type.',
    '为了方便并改善开发体验，`expo-sqlite` 通过 `db.sql` 属性提供受 Bun 启发的标签模板字面量 API。此 API 会自动转义参数以防止 SQL 注入攻击，并根据查询类型提供自动类型推断。',
  ],
  ['// Type: User[]', '// 类型：User[]'],
  ['// Mutable queries like INSERT/UPDATE/DELETE return SQLiteRunResult metadata', '// INSERT/UPDATE/DELETE 等变更查询返回 SQLiteRunResult 元数据'],
  ['// Get first row only', '// 只获取第一行'],
  ['// Iterate over results', '// 遍历结果'],
  ['// Synchronous API', '// 同步 API'],
  ['  // if (currentDbVersion === 1) {\n  //   Add more migrations\n  // }', '  // if (currentDbVersion === 1) {\n  //   添加更多迁移\n  // }'],
  ['  // Your styles...', '  // 你的样式...'],
  [
    'As with the [`useSQLiteContext()`](#usesqlitecontext-hook) hook, you can also integrate the [`SQLiteProvider`](#sqlitesqliteprovider) with [`React.Suspense`](https://react.dev/reference/react/Suspense) to show a fallback component until the database is ready. To enable the integration, pass the `useSuspense` prop to the `SQLiteProvider` component.',
    '与 [`useSQLiteContext()`](#usesqlitecontext-hook) Hook 一样，你也可以把 [`SQLiteProvider`](#sqlitesqliteprovider) 与 [`React.Suspense`](https://react.dev/reference/react/Suspense) 集成，在数据库就绪前显示回退组件。要启用该集成，把 `useSuspense` 属性传给 `SQLiteProvider` 组件。',
  ],
  ['### Executing queries within an async transaction', '### 在异步事务中执行查询'],
  [
    'Due to the nature of async/await, any query that runs while the transaction is active will be included in the transaction. This includes query statements that are outside of the scope function passed to `withTransactionAsync()` and may be surprising behavior. For example, the following test case runs queries inside and outside of a scope function passed to `withTransactionAsync()`. However, all of the queries will run within the actual SQL transaction because the second `UPDATE` query runs before the transaction finishes.',
    '由于 async/await 的特性，事务处于活动状态时运行的任何查询都会被包含进该事务。这包括传给 `withTransactionAsync()` 的作用域函数之外的查询语句，这种行为可能出人意料。例如，下面的测试用例在传给 `withTransactionAsync()` 的作用域函数内外都运行查询。不过，所有查询都会在实际的 SQL 事务中运行，因为第二条 `UPDATE` 查询在事务结束之前运行。',
  ],
  ['  // 1. A new transaction begins', '  // 1. 新事务开始'],
  [
    `    // 2. The value "first" is inserted into the test table and we wait 2
    //    seconds`,
    `    // 2. 值 "first" 被插入 test 表，然后我们等待 2
    //    秒`,
  ],
  ['    // 4. Two seconds in, we read the latest data from the table', '    // 4. 两秒后，我们从表中读取最新数据'],
  [
    `    // ❌ The data in the table will be "second" and this expectation will fail.
    //    Additionally, this expectation will throw an error and roll back the
    //    transaction, including the \`UPDATE\` query below since it ran within
    //    the transaction.`,
    `    // ❌ 表中的数据将是 "second"，此断言会失败。
    //    此外，此断言会抛出错误并回滚
    //    事务，包括下面的 \`UPDATE\` 查询，因为它是在
    //    事务内运行的。`,
  ],
  [
    `  // 3. One second in, the data in the test table is updated to be "second".
  //    This \`UPDATE\` query runs in the transaction even though its code is
  //    outside of it because the transaction happens to be active at the time
  //    this query runs.`,
    `  // 3. 一秒后，test 表中的数据被更新为 "second"。
  //    这条 \`UPDATE\` 查询会在事务中运行，即使它的代码
  //    在事务之外，因为此查询运行时事务恰好
  //    处于活动状态。`,
  ],
  [
    'The [`withExclusiveTransactionAsync()`](#withexclusivetransactionasynctask) function addresses this. Only queries that run within the scope function passed to `withExclusiveTransactionAsync()` will run within the actual SQL transaction.',
    '[`withExclusiveTransactionAsync()`](#withexclusivetransactionasynctask) 函数解决了这个问题。只有在传给 `withExclusiveTransactionAsync()` 的作用域函数内运行的查询，才会在实际的 SQL 事务中运行。',
  ],
  ['### Executing PRAGMA queries', '### 执行 PRAGMA 查询'],
  [
    `:::note
**Tip:** Enable [WAL journal mode](https://www.sqlite.org/wal.html) when you create a new database to improve performance in general.
:::`,
    `:::tip
创建新数据库时启用 [WAL 日志模式](https://www.sqlite.org/wal.html)，通常可以提升性能。
:::`,
  ],
  ['### Import an existing database', '### 导入已有数据库'],
  [
    'To open a new SQLite database using an existing **.db** file you already have, you can use the [`SQLiteProvider`](#sqlitesqliteprovider) with [`assetSource`](#assetsource).',
    '要用已有的 **.db** 文件打开新的 SQLite 数据库，可以把 [`SQLiteProvider`](#sqlitesqliteprovider) 与 [`assetSource`](#assetsource) 一起使用。',
  ],
  ['### Sharing a database between apps/extensions (iOS)', '### 在应用/扩展之间共享数据库（iOS）'],
  [
    'To share a database with other apps/extensions in the same App Group, you can use shared containers by following the steps below:',
    '要与同一 App Group 中的其他应用/扩展共享数据库，可以按以下步骤使用共享容器：',
  ],
  ['1. Configure the App Group in app config:', '1. 在应用配置中配置 App Group：'],
  [
    '2. Use [`Paths.appleSharedContainers`](/versions/latest/sdk/filesystem#applesharedcontainers) from the [`expo-file-system`](/versions/latest/sdk/filesystem) library to retrieve the path to the shared container:',
    '2. 使用 [`expo-file-system`](/versions/latest/sdk/filesystem) 库中的 [`Paths.appleSharedContainers`](/versions/latest/sdk/filesystem#applesharedcontainers) 获取共享容器的路径：',
  ],
  [
    "      // or `Paths.appleSharedContainers['group.com.myapp']?.uri` to choose specific container",
    "      // 或者用 `Paths.appleSharedContainers['group.com.myapp']?.uri` 选择特定容器",
  ],
  ['### Passing binary data', '### 传递二进制数据'],
  [
    'Use [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) to pass binary data to the database:',
    '使用 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 向数据库传递二进制数据：',
  ],
  ['### Browse an on-device database', '### 浏览设备上的数据库'],
  [
    'The `expo-sqlite` library includes a built-in DevTools inspector plugin that is automatically enabled in development and requires no extra setup. It lets you browse tables, view and edit rows, run SQL queries, and export databases directly from your browser. To open it, press <kbd>Shift</kbd> + <kbd>M</kbd> in the Expo CLI terminal to open the dev tools menu, and then select **Open expo-sqlite** to launch the inspector.',
    '`expo-sqlite` 库包含内置的 DevTools 检查器插件，在开发环境中自动启用，无需额外设置。它让你可以直接在浏览器中浏览表、查看和编辑行、运行 SQL 查询并导出数据库。要打开它，在 Expo CLI 终端中按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具菜单，然后选择 **Open expo-sqlite** 启动检查器。',
  ],
  [
    '![SQLite inspector showing a data browser with table rows, edit/delete actions, and a sidebar listing tables](/static/images/sdk/sqlite/inspector.webp)',
    '![SQLite 检查器，显示带表格行、编辑/删除操作以及列出各表的侧边栏的数据浏览器](/static/images/sdk/sqlite/inspector.webp)',
  ],
  [
    'Alternatively, you can also use the [`drizzle-studio-expo` dev tools plugin](https://github.com/drizzle-team/drizzle-studio-expo) to launch [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview), connected to a database in your app, directly from Expo CLI. This plugin can be used with any `expo-sqlite` configuration and does not require [Drizzle ORM](#drizzle-orm). [Learn how to install and use the plugin](https://github.com/drizzle-team/drizzle-studio-expo).',
    '你也可以使用 [`drizzle-studio-expo` 开发工具插件](https://github.com/drizzle-team/drizzle-studio-expo)，直接从 Expo CLI 启动连接到应用中数据库的 [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)。此插件可用于任何 `expo-sqlite` 配置，不需要 [Drizzle ORM](#drizzle-orm)。[了解如何安装和使用该插件](https://github.com/drizzle-team/drizzle-studio-expo)。',
  ],
  ['### Key-value storage', '### 键值存储'],
  [
    'The `expo-sqlite` library provides [`Storage`](#sqlitestorage) as a drop-in replacement for the [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage) library. This key-value store is backed by SQLite. If your project already uses `expo-sqlite`, you can leverage `expo-sqlite/kv-store` without needing to add another dependency.',
    '`expo-sqlite` 库提供 [`Storage`](#sqlitestorage)，作为 [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage) 库的直接替换。此键值存储由 SQLite 支持。如果项目已经使用 `expo-sqlite`，可以利用 `expo-sqlite/kv-store`，无需再添加依赖。',
  ],
  [
    '[`Storage`](#sqlitestorage) provides the same API as `@react-native-async-storage/async-storage`:',
    '[`Storage`](#sqlitestorage) 提供与 `@react-native-async-storage/async-storage` 相同的 API：',
  ],
  [
    '// The storage API is the default export, you can call it Storage, AsyncStorage, or whatever you prefer.',
    '// 存储 API 是默认导出，你可以把它叫做 Storage、AsyncStorage，或任何你喜欢的名字。',
  ],
  [
    "A key benefit of using `expo-sqlite/kv-store` is the addition of synchronous APIs for added convenience:",
    '使用 `expo-sqlite/kv-store` 的一个关键好处是增加了同步 API，使用更方便：',
  ],
  [
    "If you're currently using `@react-native-async-storage/async-storage` in your project, switching to `expo-sqlite/kv-store` is as simple as changing the import statement:",
    '如果你的项目目前使用 `@react-native-async-storage/async-storage`，切换到 `expo-sqlite/kv-store` 只需更改导入语句：',
  ],
  ['### The `localStorage` API', '### `localStorage` API'],
  [
    "The `expo-sqlite/localStorage/install` module provides a drop-in implementation for the [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API. If you're already familiar with this API from the web, or you would like to be able to share storage code between web and other platforms, this may be useful. To use it, you just need to import the `expo-sqlite/localStorage/install` module:",
    '`expo-sqlite/localStorage/install` 模块为 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API 提供直接替换实现。如果你已经熟悉 Web 上的这个 API，或者希望在 Web 和其他平台之间共享存储代码，它会很有用。要使用它，只需导入 `expo-sqlite/localStorage/install` 模块：',
  ],
  [
    "> **Note:** `import 'expo-sqlite/localStorage/install';` is a no-op on web and will be excluded from the production JS bundle.",
    ":::note\n`import 'expo-sqlite/localStorage/install';` 在 Web 上不会产生效果，并且会从生产 JS 包中排除。\n:::",
  ],
  ['## Security', '## 安全'],
  [
    "SQL injections are a class of vulnerabilities where attackers trick your app into executing user input as SQL code. You must escape all user input passed to SQLite to defend against SQL injections. [Prepared statements](#预处理语句) are an effective defense against this problem. They explicitly separate a SQL query's logic from its input parameters, and SQLite automatically escapes inputs when executing prepared statements.",
    'PLACEHOLDER',
  ],
];

sPairs[sPairs.length - 1] = [
  "SQL injections are a class of vulnerabilities where attackers trick your app into executing user input as SQL code. You must escape all user input passed to SQLite to defend against SQL injections. [Prepared statements](#prepared-statements) are an effective defense against this problem. They explicitly separate a SQL query's logic from its input parameters, and SQLite automatically escapes inputs when executing prepared statements.",
  'SQL 注入是一类漏洞，攻击者诱使应用把用户输入当作 SQL 代码执行。必须转义传给 SQLite 的所有用户输入以防御 SQL 注入。[预处理语句](#预处理语句)是针对此问题的有效防御。它们明确把 SQL 查询的逻辑与输入参数分开，SQLite 在执行预处理语句时会自动转义输入。',
];

sPairs.push(
  ['## Third-party library integrations', '## 第三方库集成'],
  [
    'The `expo-sqlite` library is designed to be a solid SQLite foundation. It enables broader integrations with third-party libraries for more advanced higher-level features. Here are some of the libraries that you can use with `expo-sqlite`.',
    '`expo-sqlite` 库旨在成为坚实的 SQLite 基础。它能与第三方库更广泛地集成，以获得更高级的高层功能。下面是一些可以与 `expo-sqlite` 一起使用的库。',
  ],
  [
    '[Drizzle](https://orm.drizzle.team/) is a ["headless TypeScript ORM with a head"](https://orm.drizzle.team/docs/overview). It runs on Node.js, Bun, Deno, and React Native. It also has a CLI companion called [`drizzle-kit`](https://orm.drizzle.team/kit-docs/overview) for generating SQL migrations.',
    '[Drizzle](https://orm.drizzle.team/) 是一个[“有头的无头 TypeScript ORM”](https://orm.drizzle.team/docs/overview)。它运行在 Node.js、Bun、Deno 和 React Native 上。它还有一个名为 [`drizzle-kit`](https://orm.drizzle.team/kit-docs/overview) 的 CLI 配套工具，用于生成 SQL 迁移。',
  ],
  [
    'Check out the [Drizzle ORM documentation](https://orm.drizzle.team/) and the [`expo-sqlite` integration guide](https://orm.drizzle.team/docs/get-started/expo-new) for more details.',
    '更多细节见 [Drizzle ORM 文档](https://orm.drizzle.team/)和 [`expo-sqlite` 集成指南](https://orm.drizzle.team/docs/get-started/expo-new)。',
  ],
  [
    '[Knex.js](https://knexjs.org/) is a SQL query builder that is ["flexible, portable, and fun to use!"](https://github.com/knex/knex)',
    '[Knex.js](https://knexjs.org/) 是一个[“灵活、可移植、用起来有趣”](https://github.com/knex/knex)的 SQL 查询构建器。',
  ],
  [
    'Check out the [`expo-sqlite` integration guide](https://github.com/expo/knex-expo-sqlite-dialect) for more details.',
    '更多细节见 [`expo-sqlite` 集成指南](https://github.com/expo/knex-expo-sqlite-dialect)。',
  ],
  [
    '> **Note:** SQLCipher is not supported on [Expo Go](https://expo.dev/go).',
    ':::note\n[Expo Go](https://expo.dev/go) 不支持 SQLCipher。\n:::',
  ],
  [
    '[SQLCipher](https://www.zetetic.net/sqlcipher/) is a fork of SQLite that adds encryption and authentication to the database. The `expo-sqlite` library supports SQLCipher for Android, iOS, and macOS. To use SQLCipher, you need to add the `useSQLCipher` config to your **app.json** as shown in the [Configuration in app config](#configuration-in-app-config) section and run `npx expo prebuild`.',
    '[SQLCipher](https://www.zetetic.net/sqlcipher/) 是 SQLite 的一个分支，为数据库增加加密和身份验证。`expo-sqlite` 库在 Android、iOS 和 macOS 上支持 SQLCipher。要使用 SQLCipher，需要按[在应用配置中配置](#在应用配置中配置)一节所示，把 `useSQLCipher` 配置添加到 **app.json**，并运行 `npx expo prebuild`。',
  ],
  [
    "Right after you open a database, you need to set a password for the database using the `PRAGMA key = 'password'` statement.",
    "打开数据库后，需要立即用 `PRAGMA key = 'password'` 语句为数据库设置密码。",
  ],
  ['### Cheatsheet for the common API', '### 常用 API 速查'],
  [
    'The following table summarizes the common API for [`SQLiteDatabase`](#sqlitedatabase) and [`SQLiteStatement`](#sqlitestatement) classes:',
    '下表总结了 [`SQLiteDatabase`](#sqlitedatabase) 和 [`SQLiteStatement`](#sqlitestatement) 类的常用 API：',
  ],
  [
    '| [`SQLiteDatabase`](#sqlitedatabase) methods      | [`SQLiteStatement`](#sqlitestatement) methods                                 | Description                                                                                                                                                            | Use case                                                                                                                                                                                   |',
    '| [`SQLiteDatabase`](#sqlitedatabase) 方法 | [`SQLiteStatement`](#sqlitestatement) 方法 | 说明 | 使用场景 |',
  ],
  [
    '| [`runAsync()`](#runasyncsource-params)           | [`executeAsync()`](#executeasyncparams)                                       | Executes a SQL query, returning information on the changes made.                                                                                                       | Ideal for SQL write operations such as `INSERT`, `UPDATE`, `DELETE`.                                                                                                                       |',
    '| [`runAsync()`](#runasyncsource-params) | [`executeAsync()`](#executeasyncparams) | 执行 SQL 查询，并返回所做更改的信息。 | 适合 `INSERT`、`UPDATE`、`DELETE` 等 SQL 写入操作。 |',
  ],
  [
    "| [`getFirstAsync()`](#getfirstasyncsource-params) | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getfirstasync) | Retrieves the first row from the query result.                                                                                                                         | Suitable for fetching a single row from the database. For example: `getFirstAsync('SELECT * FROM Users WHERE id = ?', userId)`.                                                            |",
    "| [`getFirstAsync()`](#getfirstasyncsource-params) | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getfirstasync) | 获取查询结果的第一行。 | 适合从数据库获取单行。例如：`getFirstAsync('SELECT * FROM Users WHERE id = ?', userId)`。 |",
  ],
  [
    '| [`getAllAsync()`](#getallasyncsource-params)     | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getallasync)   | Fetches all query results at once.                                                                                                                                     | Best suited for scenarios with smaller result sets, such as queries with a LIMIT clause, like `SELECT * FROM Table LIMIT 100`, where you intend to retrieve all results in a single batch. |',
    '| [`getAllAsync()`](#getallasyncsource-params) | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getallasync) | 一次获取全部查询结果。 | 最适合结果集较小的场景，例如带 LIMIT 子句的查询，如 `SELECT * FROM Table LIMIT 100`，你打算一次性取回全部结果。 |',
  ],
  [
    '| [`getEachAsync()`](#geteachasyncsource-params)   | [`executeAsync()`](#executeasyncparams) + `for-await-of` async iterator       | Provides an iterator for result set traversal. This method fetches one row at a time from the database, potentially reducing memory usage compared to `getAllAsync()`. | Recommended for handling large result sets incrementally, such as with infinite scrolling implementations.                                                                                 |',
    '| [`getEachAsync()`](#geteachasyncsource-params) | [`executeAsync()`](#executeasyncparams) + `for-await-of` 异步迭代器 | 提供用于遍历结果集的迭代器。此方法每次从数据库取一行，与 `getAllAsync()` 相比可能降低内存占用。 | 建议用于增量处理大型结果集，例如无限滚动实现。 |',
  ]
);

const s = apply(sSrc, sPairs);
write(sDest, s.text);
console.log('sqlite missing', s.missing.length);
s.missing.forEach(m => console.log(' S', m));
