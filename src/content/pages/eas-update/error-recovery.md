---
title: 错误恢复
description: 了解如何在使用 expo-updates 库时利用内置的错误恢复。
---

# 错误恢复

使用 `expo-updates` 的应用可以利用内置的错误恢复行为，作为防止意外发布损坏更新的额外保障。

虽然我们无论如何强调在发布到生产之前于预发布环境中测试更新的重要性都不为过，但人（甚至计算机）偶尔会犯错，这里描述的错误恢复行为可以在这种情况下作为最后手段。

:::warning
**免责声明：** 下面记录的行为可能会变化，不应依赖它。发布更新之前，始终在接近生产的环境中仔细、彻底地测试你的代码。
:::

## 救命！我向生产环境发布了损坏的更新。我该怎么办？

首先，不要慌。错误会发生；很可能一切都会好的。

重要的是**尽快发布带有修复的新更新（不过要在你对修复有 100% 信心之前不要发布）。** `expo-updates` 中的错误恢复机制会确保在大多数情况下，即使已经下载了损坏更新的用户也应该能够获得修复。

首先要尝试的是回滚到你知道曾经正常工作的较旧更新。**不过这并不总是安全的；** 你损坏的更新可能以不向后兼容的方式修改了持久状态（例如存储在 AsyncStorage 或设备文件系统上的数据）。重要的是在尽可能接近终端用户设备状态的预发布环境中测试：加载损坏的更新，然后再回滚。

如果你能确定一个可以安全回滚的较旧更新，可以使用 EAS Update 的 `republish` 选项，从 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/updates)或 [EAS CLI](/eas-update/eas-cli#在分支内重新发布先前的更新)完成。

如果你无法确定可以安全回滚的较旧更新，就需要向前修复。虽然最好尽快推出修复，但你应该花时间确保修复可靠，并且知道即使在此期间下载了损坏更新的用户也应该能够下载你的修复。

如果你想了解更多这是如何工作的，请继续阅读。

## 解释错误恢复流程

错误恢复流程旨在尽可能轻量。它不是保护终端用户免受错误结果影响的完整安全网；在许多情况下，用户仍会看到崩溃。

相反，其目的是防止更新把应用“变砖”（在应用能够检查更新之前于启动时崩溃，使应用在卸载并重新安装之前无法使用），方法是尽可能在更多情况下确保应用有机会下载新更新并自行修复。

### 捕获错误

如果你的应用在执行 JS 时抛出致命错误，并且该错误发生在应用生命周期中足够早的位置，可能阻止应用下载进一步的更新，`expo-updates` 会捕获此错误。

> 如果从应用第一次渲染到抛出致命错误之间已经过去超过 10 秒，`expo-updates` 根本不会捕获此错误，也不会触发任何错误恢复代码。因此，我们强烈建议应用在启动后很快检查更新，无论是自动还是手动，以确保将来出错时你能够推出修复。

如果 `expo-updates` 捕获了 JS 错误，接下来会发生什么取决于 React Native 是否已经触发了原生的 "content appeared" 事件（Android 上的 `ReactMarkerConstants.CONTENT_APPEARED` 或 iOS 上的 `RCTContentDidAppearNotification`），大约是此特定更新的第一个视图已经渲染到屏幕上的时刻，无论是这次启动还是先前的一次。

> **为什么要做这种区分？** 在某些情况下，`expo-updates` 可能会尝试自动回滚到较旧的（可用的）更新，但如果新更新以不向后兼容的方式修改了持久状态，这可能是危险的。我们假设如果错误发生在第一个视图渲染之前，这样的代码还没能执行，因此回滚是安全的。在此之后，`expo-updates` 只会向前修复，不会回滚。

### 如果内容已经出现

如果捕获了错误，并且 "content appeared" 事件已经触发，或者它曾经在此设备上于同一更新的过去某次启动中触发过，则会发生以下情况：

- 启动一个 5 秒计时器，并且（除非 `EXUpdatesCheckOnLaunch` / `expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH` 设为 `NEVER`）应用会检查新更新，如果有就下载它。
- 如果没有新更新、更新下载完成，或计时器耗尽（以先发生者为准），应用会抛出原始错误并崩溃。

请注意，如果下载了新更新，它会在用户下次尝试打开应用时启动。

### 如果内容尚未出现

如果在 "content appeared" 事件触发之前捕获了错误，并且这是当前更新第一次在此设备上启动，则会发生以下情况：

- 该更新会在本地标记为 "failed"，并且不会在此设备上再次启动。
- 启动一个 5 秒计时器，并且（除非 `EXUpdatesCheckOnLaunch` / `expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH` 设为 `NEVER`）应用会检查新更新，如果有就下载它。
- 如果新更新在计时器耗尽之前下载完成，应用会立即尝试重新加载自身并启动新下载的更新。
- 如果这个新下载的更新也抛出致命错误，或者没有新更新，或者计时器耗尽，应用会立即尝试通过回滚到较旧的更新来重新加载，即最近一次成功启动的那个。
- 如果这也失败，或者设备上没有较旧的更新可用，应用会抛出原始错误并崩溃。

## 错误堆栈跟踪

如果应用遇到致命 JS 错误，并且错误恢复系统无法恢复，它会重新抛出原始异常以导致崩溃。堆栈跟踪看起来类似这样：

:::tabs
:::tab Android
```text
--------- beginning of crash
AndroidRuntime: FATAL EXCEPTION: expo-updates-error-recovery
AndroidRuntime: Process: com.myapp.MyApp, PID: 12498
AndroidRuntime: com.facebook.react.common.JavascriptException
AndroidRuntime:
AndroidRuntime: 	at com.facebook.react.modules.core.ExceptionsManagerModule.reportException(ExceptionsManagerModule.java:72)
AndroidRuntime: 	at java.lang.reflect.Method.invoke(Native Method)
AndroidRuntime: 	at com.facebook.react.bridge.JavaMethodWrapper.invoke(JavaMethodWrapper.java:372)
AndroidRuntime: 	at com.facebook.react.bridge.JavaModuleWrapper.invoke(JavaModuleWrapper.java:188)
AndroidRuntime: 	at com.facebook.react.bridge.queue.NativeRunnable.run(Native Method)
AndroidRuntime: 	at android.os.Handler.handleCallback(Handler.java:938)
AndroidRuntime: 	at android.os.Handler.dispatchMessage(Handler.java:99)
AndroidRuntime: 	at com.facebook.react.bridge.queue.MessageQueueThreadHandler.dispatchMessage(MessageQueueThreadHandler.java:27)
AndroidRuntime: 	at android.os.Looper.loop(Looper.java:223)
AndroidRuntime: 	at com.facebook.react.bridge.queue.MessageQueueThreadImpl$4.run(MessageQueueThreadImpl.java:228)
AndroidRuntime: 	at java.lang.Thread.run(Thread.java:923)
```

在 Android 上，原始异常的堆栈跟踪会被保留。取决于你的崩溃报告服务，你可能需要或不需要在本地复现崩溃，才能看到关于底层错误的更多信息。
:::
:::tab iOS
```text
Last Exception Backtrace:
0   CoreFoundation                	0xf203feba4 __exceptionPreprocess + 220 (NSException.m:200)
1   libobjc.A.dylib               	0xf201a1be7 objc_exception_throw + 60 (objc-exception.mm:565)
2   MyApp                         	0x10926b7ee -[EXUpdatesAppController throwException:] + 24 (EXUpdatesAppController.m:422)
3   MyApp                         	0x109280352 -[EXUpdatesErrorRecovery _crash] + 984 (EXUpdatesErrorRecovery.m:222)
4   MyApp                         	0x10927fa3d -[EXUpdatesErrorRecovery _runNextTask] + 148 (EXUpdatesErrorRecovery.m:0)
5   libdispatch.dylib             	0x109bc1848 _dispatch_call_block_and_release + 32 (init.c:1517)
6   libdispatch.dylib             	0x109bc2a2c _dispatch_client_callout + 20 (object.m:560)
7   libdispatch.dylib             	0x109bc93a6 _dispatch_lane_serial_drain + 668 (inline_internal.h:2622)
8   libdispatch.dylib             	0x109bca0bc _dispatch_lane_invoke + 392 (queue.c:3944)
9   libdispatch.dylib             	0x109bd6472 _dispatch_workloop_worker_thread + 648 (queue.c:6732)
10  libsystem_pthread.dylib       	0xf6da2845d _pthread_wqthread + 288 (pthread.c:2599)
11  libsystem_pthread.dylib       	0xf6da2742f start_wqthread + 8
```

尽管看起来异常是从 expo-updates 抛出的，此堆栈跟踪通常表明**错误起源于 JavaScript**。

不幸的是，Apple 的崩溃报告不包含异常消息，而异常消息详细说明了底层错误及其在 JavaScript 中的位置。要看到该消息并帮助你缩小问题范围，你可能需要在连接 Xcode 调试器或 macOS 控制台应用的情况下在本地复现崩溃。
:::
:::
