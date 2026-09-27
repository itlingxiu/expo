---
title: 在运行时覆盖更新配置
description: 了解如何在运行时覆盖更新 URL 和请求头，以控制客户端加载哪个更新。
---

# 在运行时覆盖更新配置

使用 EAS Update 的典型方式，是在应用构建中嵌入单个更新 URL 和一组请求头（例如更新 channel 名称）。要控制加载哪个更新，你通过 `eas update` 命令或 EAS 仪表盘在服务器上做更改。例如，你向构建所指向的 channel 发布新更新，然后该构建在下次启动时获取该更新。用这种方式，发布到与构建所指向 channel 不同的 channel 的更新不会被下载。

本指南说明如何在运行时更改更新 URL 和请求头，从而可以按 ID 加载特定更新，或更改拉取更新的 channel，而无需创建并安装新构建。

## 覆盖请求头

:::warning
本节描述的功能可在 Expo SDK 54 且 `expo-updates` 版本 0.29.0 及更高版本中使用。
:::

对于使用 EAS Update 的应用，此功能的主要用途是 [channel surfing](/eas-update/channel-surfing)。Channel surfing 在运行时切换 `expo-channel-name` 请求头，作为完整 channel 切换工作流的一部分。

例如，如果你有用于生产更新的 `default` channel 和用于预览更新的 `preview` channel，可以覆盖 `expo-channel-name` 请求头，使其指向 `preview` channel。这样你就可以在当前的生产构建中测试预览更新。

:::warning
当更新使用不同的迁移或数据形态时，切换 channel 可能导致兼容性问题。参见[切换 channel 时的风险与注意事项](/eas-update/channel-surfing#切换-channel-时的风险与注意事项)。
:::

另一个可能的用途是向不同用户提供不同更新，例如让一组内部用户（如员工）先于终端用户收到更新。

### 工作原理

你可以调用 [`Updates.setUpdateRequestHeadersOverride`](/versions/latest/sdk/updates#updatessetupdaterequestheadersoverriderequestheaders) 来覆盖请求头。使用 EAS Update 时，覆盖 `expo-channel-name` 请求头会使应用从指定的 channel 请求更新。

要在运行时覆盖 `expo-channel-name` 请求头，原生构建必须包含它。当 **eas.json** 中的构建 profile 定义了 `channel` 时，EAS Build 会自动把该请求头设为该值。在 EAS Build 之外创建的构建（例如用 `npx expo run:android`）不会自动设置它。对于这些构建，在应用配置的 [`updates.requestHeaders`](/eas-update/getting-started#在-appjson-中配置更新-channel) 中声明该请求头，然后重新构建应用。

在应用中提供一种让用户触发请求头变更的方式。这可以是只有受信任用户能访问的隐藏菜单，或其他适合你用例的机制。更改请求头后，调用 [`fetchUpdateAsync()`](/versions/latest/sdk/updates#updatesfetchupdateasync) 获取更新，并调用 [`reloadAsync()`](/versions/latest/sdk/updates#updatesreloadasyncoptions) 重新加载应用。你也可以等到下次启动时自动获取并安装更新。

```js
import * as Updates from 'expo-updates';

// 在哪里调用此方法取决于你的用例。例如，在预览构建中放一个菜单，
// 让测试人员从可用的 channel 中选择，可能是合理的：
Updates.setUpdateRequestHeadersOverride({ 'expo-channel-name': 'preview' });

// 你可以立即获取并重新加载更新，或等到下次启动
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```

<details>
<summary>我可以覆盖其他请求头吗？</summary>

可以。任何你想在运行时覆盖的其他请求头，都必须在应用配置的 [`updates.requestHeaders`](/eas-update/getting-started#在-appjson-中配置更新-channel) 中声明。传给 `setUpdateRequestHeadersOverride()` 的对象会替换构建中的全部自定义请求头，因此在覆盖生效期间，要包含应用仍然需要的每一个请求头。

</details>

## 同时覆盖更新 URL 和请求头

:::warning
本节描述的功能可在 Expo SDK 52 且 `expo-updates` 版本 0.27.0 及更高版本中使用。在预览环境中使用 `disableAntiBrickingMeasures` 选项。避免在生产应用中使用它。
:::

与[覆盖请求头](#覆盖请求头)类似，如果你还想把更新 URL 进一步覆盖为某个特定更新，可以使用 [`Updates.setUpdateURLAndRequestHeadersOverride`](/versions/latest/sdk/updates#updatessetupdateurlandrequestheadersoverrideconfigoverride) 方法。这允许你按 ID 加载特定更新，即使该更新是在当前构建创建之前发布的。

在决定于生产环境使用此功能之前，务必熟悉[安全注意事项](#安全注意事项)。未来我们可能会增加对该功能更受限版本的支持，它会更适合这个用例。

### 工作原理

有两个相关 API：

1. `Updates.setUpdateURLAndRequestHeadersOverride({ updateUrl: string, requestHeaders: Object })`：此方法覆盖 **app.json** / **Expo.plist** / **AndroidManifest.xml** 中指定的更新 URL 和请求头，例如 `expo-channel-name` 请求头。
2. `disableAntiBrickingMeasures`：应用配置中的这个字段会禁用 `expo-updates` 内置的防变砖措施。这些措施确保之后始终可以发布后续更新，以修复先前安装的更新中的问题。更改此值后，需要创建新构建才会生效。**不要在生产构建中启用它。** 使用这个名称是为了明确指出：当你覆盖更新 URL 或请求头时，我们不再能够安全地回滚到先前加载的更新。因此，如果新加载的更新导致应用崩溃，`expo-updates` 无法自动恢复，因为该字段与 `setUpdateURLAndRequestHeadersOverride` 一起会禁用嵌入式更新，从而没有任何更新可以回滚。用户需要卸载并重新安装应用。你只应在预览构建中使用此功能。

如何使用这些 API：

1. **覆盖更新 URL 或请求头，并指示用户关闭应用**：在应用的某处提供一种方式，让用户触发对 URL 和/或请求头的更改。这可以是只有受信任用户能访问的隐藏菜单，或其他取决于用例的机制。参数更改后，通知用户需要关闭并重新打开应用，例如通过 alert。在应用关闭并重新打开之前，`expo-updates` 库中的 `checkForUpdateAsync()` 等方法不会使用新覆盖的 URL 和请求头。
2. **新更新会在下次打开应用时下载并启动**：应用被完全关闭（被“杀掉”，而不只是进入后台）并重新打开后，更新及其相关资源都会被下载。准备好后应用会启动。下载期间，用户必须在启动画面上等待。我们知道在启动画面上等待并不理想，如果此功能被广泛使用，我们打算在未来改进这一体验。对于当前推荐的用例（预览），这很可能是可以接受的折中。

### 安全注意事项

可以用 `disableAntiBrickingMeasures` 禁用的防变砖措施确保：无论发布了什么更新，你之后始终可以再发布另一个会被应用的更新。禁用防变砖措施后，某些类型的攻击和利用成为可能，尤其是内部（被攻陷的员工）发布恶意更新。例如，有能力发布更新的员工可以发布一个恶意更新，把更新 URL 和请求头改成指向他们自己的服务器，从而接管应用的安装。使用生产更新的[代码签名](/eas-update/code-signing)并限制对密钥的访问，可以降低但不能消除这一风险。

<details>
<summary>CodePush 的类似用法是否带有同样的风险？</summary>

是的。CodePush 允许开发者用 `sync({ deploymentKey: string })` 交换部署密钥，这可能被恶意用来以同样的方式接管应用安装。

</details>

### 示例代码

下面是如何使用这些 API 的示例：

```js
import * as Updates from 'expo-updates';

// 在哪里调用此方法取决于你的用例。例如，在预览构建中放一个菜单，
// 让测试人员从可用的 pull request 中选择，可能是合理的。
function overrideUpdateURLAndHeaders() {
  Updates.setUpdateURLAndRequestHeadersOverride({
    updateUrl: 'https://u.expo.dev/{updateId}/group/{groupId}',
    requestHeaders: {},
  });

  alert('Close and re-open the app to load the latest version.');
}
```

```json
{
  "expo": {
    "updates": {
      // 建议只在预览构建中启用此项。
      // 可以用 app.config.js 动态配置它。
      "disableAntiBrickingMeasures": true
      // 等等
    }
  }
}
```
