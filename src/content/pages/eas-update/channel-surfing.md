---
title: Channel surfing
description: 了解如何在运行时切换 EAS Update channel。
---

# Channel surfing

**Channel surfing** 让已安装的发布构建在运行时从另一个 EAS Update channel 请求更新。

在默认的 EAS Update 流程中，更新 URL 和更新 channel 在构建时固定。在 EAS 上构建时，这个 channel 在 **eas.json** 的构建 profile 中设置。它作为 `expo-channel-name` 请求头发送到更新 URL，并决定应用从哪个 channel 接收更新。Channel surfing 允许你在 JavaScript 代码中覆盖该请求头，使应用可以从另一个 channel 请求更新。

Channel surfing 不会改变原生代码，也不会绕过更新兼容性规则。所选 channel 上的更新仍必须匹配已安装应用的平台和[运行时版本](/eas-update/runtime-versions)。

:::warning
使用 `Updates.setUpdateRequestHeadersOverride()` 进行 channel surfing 可在 Expo SDK 54 且 `expo-updates` 版本 0.29.0 及更高版本中使用。
:::

## 何时使用 channel surfing

你可以使用 channel surfing 来：

- 让单个已安装的应用按需在 channel 之间移动。应用可以在运行时切换 channel，而不是一直绑定在构建时定义的 channel 上。
- 在真实构建上启用预览和测试。开发者、QA 和其他相关方可以用用户已安装的同一生产构建来试用进行中的更新。
- 把应用重定向到另一个 channel，加快迭代和验证，而不必等待新的构建。

若要进行面向开发者的测试并预览兼容的更新，使用安装了 [`expo-dev-client`](/eas-update/expo-dev-client) 库的[开发构建](/eas-update/expo-dev-client)。这不使用 `Updates.setUpdateRequestHeadersOverride()`，开发构建不支持该 API。

## 前置条件

- **已配置 EAS Update**

  参见[开始使用 EAS Update](/eas-update/getting-started)。

- **已安装发布构建**

  使用发布构建，或启用了 [`EX_UPDATES_NATIVE_DEBUG`](/eas-update/debug#通过-expo-updates-加载应用时调试原生代码) 的调试构建。这与安装了 `expo-dev-client` 的开发构建不同。在普通开发构建中，大部分 `expo-updates` API 不可用。

- **构建时已配置 channel**

  `Updates.setUpdateRequestHeadersOverride()` 只能覆盖构建中已嵌入的请求头键。对于 channel surfing，这意味着构建必须包含 `expo-channel-name`。[EAS Build](/build/introduction)会在构建时把 **eas.json** 中的 channel 写入原生项目。如果你不使用 EAS Build，请用 [`updates.requestHeaders`](/eas-update/getting-started#在-appjson-中配置更新-channel) 或在原生项目中配置 channel。

- **目标 channel 上有兼容的更新**

  目标 channel 必须有适用于已安装应用的平台和运行时版本的更新。

## 切换 channel

提供一个应用级的切换 channel 触发方式，例如给受信任用户的隐藏菜单，或其他适合你工作流的机制。选中某个 channel 后，使用 [`Updates.setUpdateRequestHeadersOverride()`](/versions/latest/sdk/updates#updatessetupdaterequestheadersoverriderequestheaders) 覆盖 `expo-channel-name` 请求头。设置覆盖后，检查更新，若有可用更新则获取它，然后重新加载应用：

```tsx
import * as Updates from 'expo-updates';

export async function switchUpdateChannelAsync(channel: string) {
  Updates.setUpdateRequestHeadersOverride({
    'expo-channel-name': channel,
  });

  const update = await Updates.checkForUpdateAsync();

  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
  }

  await Updates.reloadAsync();
}
```

覆盖会保留在设备上。设置之后，后续的更新检查都会使用所选 channel，直到应用清除或替换该覆盖，或直到应用被卸载。

## 切换回构建时的 channel

向 `Updates.setUpdateRequestHeadersOverride()` 传入 `null`，即可清除请求头覆盖并回到构建中配置的 channel：

```tsx
import * as Updates from 'expo-updates';

export async function clearUpdateChannelOverrideAsync() {
  Updates.setUpdateRequestHeadersOverride(null);

  const update = await Updates.checkForUpdateAsync();

  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
  }

  await Updates.reloadAsync();
}
```

`Updates.channel` 反映的是应用启动时处于活动状态的 channel。调用 `Updates.setUpdateRequestHeadersOverride()` 后它不会立刻更新，但会在应用重新加载后反映新的 channel。

## 测试 channel surfing

1. 安装一个指向你想作为起点的 channel 的发布构建。如果使用 [EAS Build](/build/introduction)，用包含起始 `channel` 的 profile 创建构建。本地测试可以使用 Android [APK 构建](/build-reference/apk)或 [iOS 模拟器构建](/build-reference/simulators)。

2. 向另一个兼容的 channel 发布带有可见变更的更新：

   ```sh
   $ eas update --channel preview
   ```

3. 打开已安装的应用，触发 channel 切换器并选择 `preview`。应用应检查更新，从 `preview` channel 获取兼容的更新，并重新加载进入该更新。

## 切换 channel 时的风险与注意事项

切换 channel 会改变应用运行的 JavaScript bundle。如果应用依赖在各 channel 之间不兼容的迁移或数据形态，来回切换可能会出问题。

例如，如果某个 beta 更新应用了数据库迁移，生产版本可能无法理解新的 schema。确保你的更新在相互切换时仍然安全，或在需要时把切换限制为单向。

## 更多资源

- [Expo Updates 的 channel surfing](https://expo.dev/blog/channel-surfing-for-expo-updates-how-to-switch-update-channels-at-runtime)：阅读 Expo 博客中关于在 EAS Update 里进行 channel surfing 的文章。
