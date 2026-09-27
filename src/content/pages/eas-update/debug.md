---
title: EAS Update 调试
description: 了解如何使用基本调试技巧修复更新问题。
---

# EAS Update 调试

本指南展示如何验证配置，以便找到问题来源，例如应用没有显示已发布的更新。在任何时刻说明应用的当前状态都很重要，EAS Update 正是以此为出发点构建的。一旦我们知道哪些更新在哪些构建上运行，就可以做出更改，使应用处于我们期望的状态。

- [如何调试 EAS Update](https://www.youtube.com/watch?v=m9PLTr3t3S4)：在这个 Expo 调试教程中，你将学习如何调试构建没有获得更新的情况。

> 如果我们不使用 EAS Build，部署页面将是空的。请改为遵循[不使用 EAS Build 时调试配置](#不使用-eas-build-时的配置)的指南。

## 前往部署页面

EAS 网站有一个[部署页面](https://expo.dev/accounts/[account]/projects/[project]/deployments)，显示应用的当前状态。术语 _部署_ 指一组构建及其对应的更新。如果我们用 EAS 制作了构建和更新，可以在网站的部署标签页上看到项目状态。

![部署标签页](/static/images/eas-update/deployments-website-tab.png)

## 常见问题

下一节描述常见问题以及如何修复它们。下面是 EAS Update 如何工作的示意图，以及查找问题根因时值得检查的位置。在后续各节中，我们将检查并验证这些位置以及更多内容。

![调试点地图](/static/images/eas-update/debug-map.png)

### 意外的 channel

![部署具有意外的 channel](/static/images/eas-update/deployments-wrong-channel.png)

如果部署 channel 不符合预期，意味着我们的构建没有用正确的 channel 构建。要修复这一点，[配置我们的 channel](#配置-channel)并重新构建应用。

### 意外的运行时版本

![部署具有意外的运行时版本](/static/images/eas-update/deployments-wrong-runtime.png)

如果部署的运行时版本不符合预期，意味着我们的构建没有用正确的运行时版本构建。要修复这一点，[配置我们的运行时版本](#配置运行时版本)并重新构建应用。

### 意外的分支

![部署具有意外的分支](/static/images/eas-update/deployments-wrong-branch.png)

如果部署有意外的分支，我们需要[把 channel 映射到正确的分支](#把-channel-映射到分支)。

### 缺少更新

![部署没有更新](/static/images/eas-update/deployments-no-updates.png)

显示的部署没有任何更新。要修复这一点，[向该分支发布更新](#发布更新)。如果已经发布了更新，检查[更新页面](https://expo.dev/accounts/[account]/projects/[project]/updates)，确保它与我们构建的运行时版本匹配。

### 缺少分支

![部署没有分支](/static/images/eas-update/deployments-no-branch.png)

显示的部署有正确的 channel，但没有链接到分支。要修复这一点，[把 channel 映射到正确的分支](#把-channel-映射到分支)。

### 缺少部署

如果我们的部署没有显示，意味着构建没有为 EAS Update 正确配置。要修复这一点，[配置我们的 channel](#配置-channel)、[配置我们的运行时版本](#配置运行时版本)，并验证我们的[常规配置](#验证应用配置)。做出这些更改后需要重新构建应用。

### 更新崩溃时自动回滚

如果部署页面上一切看起来都正确，但应用仍显示先前的更新或随构建嵌入的代码，新更新的代码可能正在崩溃。当应用下载并应用新更新后、根组件渲染之前这个新更新崩溃时，就会发生这种情况。

EAS Update 设计为：如果检测到新更新在启动后不久崩溃，会自动回滚到先前的更新。更多信息参见 [EAS Update 如何检测崩溃并回滚到先前可用的版本](/eas-update/error-recovery#解释错误恢复流程)。

要诊断导致更新崩溃的错误：

- 参见[运行时问题故障排查指南](/debugging/runtime-issues)，采用一种策略来识别错误。
- 识别错误后，发布修复该崩溃的新更新来解决问题。

新更新不工作但嵌入代码可以工作的一个常见原因是缺少环境变量。更多信息参见[环境变量如何与 EAS Update 一起工作](/eas/environment-variables/usage#在-eas-update-中使用环境变量)。

### 未能加载全部资源

如果用户看到 "Failed to load all assets" 错误，意味着应用能够下载清单，但无法下载运行更新所需的全部资源。如果资源不在原始构建中，就需要下载它。常见错误原因是：

- 更新中添加了许多大型资源，应用因网络问题无法全部下载。
- 用户的互联网连接较差。
- 用户所在的国家/地区屏蔽或限速 Cloudflare IP 地址，EAS Update 用这些地址提供资源。

要诊断资源加载问题：

- 通过检查[资源列表](#查看更新中包含的全部资源)，验证用户下载了哪些资源及其大小。
- 在你自己的设备上复现问题，并检查从原生层呈现的 `expo-updates` [日志条目](/versions/latest/sdk/updates#updatesreadlogentriesasyncmaxage)。
- 如果你在 Sentry 等服务中记录了此错误，检查遇到错误的用户的 IP 地址，并验证它不在已知会屏蔽或限速 Cloudflare IP 地址的国家/地区。

## 解决方案

### 配置 channel

要验证构建具有特定 channel，确保 **eas.json** 中的构建 profile 有 channel 属性：

```json eas.json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

然后我们可以运行类似 `eas build --profile preview` 的命令，创建 channel 名为 "preview" 的构建。

### 配置运行时版本

要验证运行时版本，确保应用配置（**app.json** / **app.config.js**）有 `runtimeVersion` 属性：

```json app.json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

默认情况下它是 `{ "policy": "appVersion" }`，但我们可以把运行时改为[使用不同的策略或特定版本](/eas-update/runtime-versions)。然后我们可以运行类似 `eas build --profile preview` 的命令，创建具有我们期望的运行时版本的构建。

### 把 channel 映射到分支

如果 channel 没有映射到我们期望的分支，可以用以下命令更改链接：

```sh
# eas channel:edit [channel-name] --branch [branch-name]

# 示例
$ eas channel:edit production --branch release-1.0
```

如果没有列出我们的分支，可以用 `eas branch:create` 创建新分支。

### 发布更新

要创建并发布更新，可以运行以下命令：

```sh
$ eas update
```

发布后，输出会显示分支和运行时版本。这些信息可以帮助我们验证正在用期望的配置创建更新。

## 通用策略

在使用本指南中提到的更具体策略之前，先尝试这些策略。

### 使用 `expo-dev-client`

创建[构建的开发版本](/eas-update/expo-dev-client)。它将帮助我们在有问题的构建内部预览已发布的更新。

### 应用内调试

`expo-updates` 库导出多种函数，以便在应用已经运行后与更新交互。在某些情况下，调用获取更新并看到错误消息可以帮助我们缩小根因。我们可以制作项目的模拟器构建，并手动检查是否有可用更新，或获取更新时是否有错误。

- 打印 [Update.Constants](/versions/latest/sdk/updates#constants) 以验证配置。
- [检查从原生层呈现的日志条目](/versions/latest/sdk/updates#updatesreadlogentriesasyncmaxage)。
- 获取并[手动加载更新](/versions/latest/sdk/updates#example-check-for-updates-manually)。

## 配置问题

尽管遵循了[基本指南](/eas-update/debug)，应用仍没有收到期望的更新。

### `expo-updates` 配置

`expo-updates` 库在终端用户的应用内运行，并向更新服务器发出请求以获取最新更新。

#### 验证应用配置

设置 EAS Update 时，我们很可能运行了 `eas update:configure` 来配置 expo-updates 以与 EAS Update 一起工作。此命令会更改我们的应用配置（**app.json** / **app.config.js**）。我们期望看到的字段如下：

- 应设置 `runtimeVersion`。默认情况下它是 `{ "policy": "appVersion" }`。如果项目有 **android** 和 **ios** 目录，我们必须手动设置 `runtimeVersion`。
- `updates.url` 应是类似 `https://u.expo.dev/your-project-id` 的值，其中 `your-project-id` 与我们项目的 ID 匹配。我们可以在[我们的网站](https://expo.dev/accounts/[account]/projects/[project])上看到此 ID。
- `updates.enabled` 不应为 `false`。如果未指定，默认为 `true`。

最后，确保 **package.json** 中包含 `expo-updates`。如果没有，运行：

:::tabs
:::tab npm
```sh
$ npx expo install expo-updates
```
:::
:::tab yarn
```sh
$ yarn expo install expo-updates
```
:::
:::tab pnpm
```sh
$ pnpm expo install expo-updates
```
:::
:::tab bun
```sh
$ bun expo install expo-updates
```
:::
:::

#### 预构建后检查 expo-updates 配置

每当我们运行 `eas build` 时，EAS 服务器上会对我们的项目运行 `npx expo prebuild` 命令，以展开包含原生文件的 **android** 和 **ios** 目录。这使得 EAS Build 可以构建任何项目，无论它是否包含原生文件。

如果项目没有 **android** 或 **ios** 目录，我们可以提交任何现有更改，然后运行 `npx expo prebuild` 来检查 EAS Build 将作用的项目状态。运行之后，查找以下文件：**android/app/src/main/AndroidManifest.xml** 和 **ios/your-project-name/Supporting/Expo.plist**。

在每个文件中，我们期望看到 EAS Update URL 和运行时版本的配置。下面是我们期望在每个文件中看到的属性：

```xml AndroidManifest.xml
<!-- @hide 省略 ... --><!-- @end -->
<meta-data android:name="expo.modules.updates.EXPO_RUNTIME_VERSION" android:value="your-runtime-version-here"/>
<meta-data android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="https://u.expo.dev/your-project-id-here"/>
<!-- @hide 省略 ... --><!-- @end -->
```

```xml Expo.plist
<!-- @hide 省略 ... --><!-- @end -->
<key>EXUpdatesRuntimeVersion</key>
<string>your-runtime-version-here</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id-here</string>
<!-- @hide 省略 ... --><!-- @end -->
```

### 不使用 EAS Build 时的配置

如果我们不使用 EAS Build，本节将逐步调试项目中 EAS Update 的状态。我们需要查看系统中的多个位置。下面是 EAS Update 如何工作的示意图，以及查找问题根因时值得检查的位置。在后续各节中，我们将检查并验证这些位置以及更多内容。

![调试点地图](/static/images/eas-update/debug-map.png)

#### 验证构建配置

遵循[本地构建指南](/eas-update/standalone-service)配置应用的 channel 和运行时版本。我们还需要确保[常规配置](#expo-updates-配置)正确。

#### 验证 channel

构建有一个名为 `channel` 的属性，EAS Update 用它链接到分支。一个 channel 常常赋给多个平台特定的构建。例如，我们可能有 Android 构建和 iOS 构建，两者的 channel 都名为 `"production"`。

一旦构建有了 channel 名称，我们可以通过检查 [Channels 页面](https://expo.dev/accounts/[account]/projects/[project]/channels)来确认 EAS 服务器知道它。

我们期望该页面显示与构建相同的 channel 名称。如果那里没有，我们可以在 EAS 服务器上创建该 channel：

```sh
# eas channel:create [channel-name]

# 示例
$ eas channel:create production
```

#### 验证 channel 与分支的映射

开发者在 channel 与分支之间定义了一条链接。当 channel 和分支链接后，具有该 channel 的应用会获得所链接分支上最近的兼容更新。

如果存在映射，[Channels 页面](https://expo.dev/accounts/[account]/projects/[project]/channels)会显示 channel 到分支的映射。

![Channels 页面上已链接的分支](/static/images/eas-update/channels-linked-branches.png)

如果 channel 没有链接到我们期望的分支，可以用以下命令更改链接：

```sh
# eas channel:edit [channel-name] --branch [branch-name]

# 示例
$ eas channel:edit production --branch release-1.0
```

#### 验证更新

每个分支包含一个更新列表。当构建请求更新时，我们找到构建的 channel，然后找到链接到该 channel 的分支。找到分支后，EAS 会返回该分支上最近的兼容更新。当构建和更新共享相同的运行时版本和平台时，它们是兼容的。

要检查分支上有哪些更新，我们可以前往 [Branches 页面](https://expo.dev/accounts/[account]/projects/[project]/branches)并选择感兴趣的分支。

分支详情页会显示更新列表及其运行时版本和平台。从这个列表中，我们应能通过把构建的运行时版本和平台与更新的运行时版本和平台匹配，弄清哪个更新应应用到给定构建。最近的兼容更新可供构建下载和执行。

![分支详情页上的更新列表](/static/images/eas-update/branch-update-list.png)

## 调试 EAS Update

验证 `expo-updates` 和 EAS Update 配置之后，我们可以继续调试项目如何与更新交互。

### 应用内调试

`expo-updates` 库导出多种函数，以便在应用已经运行后与更新交互。在某些情况下，调用获取更新并看到错误消息可以帮助我们缩小根因。我们可以制作项目的模拟器构建，并手动检查是否有可用更新，或获取更新时是否有错误。参见[手动检查更新](/versions/latest/sdk/updates#example-check-for-updates-manually)的代码示例。

### 手动检查构建

把项目构建成应用时，可能有多个步骤会改变 `npx expo prebuild` 的输出。制作构建后，可以打开构建的内容并检查原生文件，以查看其最终配置。

在 macOS 上检查 iOS 模拟器构建的步骤如下：

1. 使用 EAS Build 创建应用的 iOS 模拟器构建。做法是在构建 profile 中添加 `"ios": { "simulator": true }`。
2. 构建完成后，下载结果并解压。
3. 然后右键点击该应用并选择 "Show Package Contents"。
4. 从那里我们可以检查 **Expo.plist** 文件。

在 **Expo.plist** 文件中，我们期望看到以下配置：

```xml Expo.plist
<!-- @hide 省略 ... --><!-- @end -->
<key>EXUpdatesRequestHeaders</key>
<dict>
  <key>expo-channel-name</key>
  <string>your-channel-name</string>
</dict>
<key>EXUpdatesRuntimeVersion</key>
<string>your-runtime-version</string>
<key>EXUpdatesURL</key>
<string>https://u.expo.dev/your-project-id</string>
<!-- @hide 省略 ... --><!-- @end -->
```

### 手动检查清单

用 EAS Update 发布更新时，我们会创建终端用户应用所请求的清单。清单包含更新加载所需的资源及版本等信息。我们可以通过在浏览器中访问特定 URL 或使用 `curl` 来检查清单。

在项目的应用配置（**app.json** / **app.config.json**）中，我们可以 GET 的 URL 位于 `updates.url` 下。

这个 `url` 是 EAS 的 "https://u.expo.dev" 域名，后跟项目在 EAS 服务器上的 ID。如果我们直接访问该 URL，会看到关于缺少请求头的错误。我们可以通过向 URL 添加三个查询参数来查看清单：`runtime-version`、`channel-name` 和 `platform`。如果我们发布的更新运行时版本为 `1.0.0`、channel 为 `production`、平台为 `android`，可以访问的完整 URL 类似这样：

```text
https://u.expo.dev/your-project-id?runtime-version=1.0.0&channel-name=production&platform=android
```

### 查看网络请求

识别问题根因的另一种方式是查看应用向 EAS 服务器发出的网络请求，然后查看响应。我们建议使用 [Proxyman](https://proxyman.com/) 或 [Charles Proxy](https://www.charlesproxy.com/) 等程序监视来自应用的网络请求。

无论使用哪个程序，我们都需要遵循它们安装 SSL 证书的说明，以便程序能够解码 HTTPS 请求。在模拟器或实体设备上设置好之后，我们可以打开应用并监视请求。

我们感兴趣的请求来自 https://u.expo.dev 和 https://assets.eascdn.net。来自 https://u.expo.dev 的响应包含更新清单，它指定应用运行更新需要获取哪些资源。来自 https://assets.eascdn.net 的响应包含运行更新所需的资源，例如图片、字体文件等。

检查发往 https://u.expo.dev 的请求时，我们可以查找以下请求头：

- `Expo-Runtime-Version`：这应是我们制作构建和更新时使用的运行时版本。
- `expo-channel-name`：这应是 **eas.json** 构建 profile 中指定的 channel 名称。
- `Expo-Platform`：这应是 "android" 或 "ios"。

对于所有请求，我们期望看到 `200` 响应码，或者如果没有任何变化则是 `304`。

下面的截图显示了一次成功的更新清单请求：

![成功的清单请求](/static/images/eas-update/network-request.png)

## 运行时问题

我们能够加载期望的更新，但项目表现出意外行为。

### 通过 expo-updates 加载应用时调试原生代码

默认情况下，我们需要制作发布构建才能启用 `expo-updates`，并加载更新而不是从开发服务器读取。这是因为调试构建的行为与普通 React Native 项目的调试构建一样。

为了更容易在更接近生产的环境中测试和调试原生代码，按以下步骤创建启用了 `expo-updates` 的应用调试构建。

我们也提供了[快速试用 EAS Update 的分步指南](/eas-update/standalone-service)，在使用 Android Studio 或 Xcode 的本地开发环境中，使用应用的发布或调试构建。

#### Android 本地构建

- 设置调试环境变量：`export EX_UPDATES_NATIVE_DEBUG=1`
- [确保在 **AndroidManifest.xml** 中设置了所需的 channel](/eas-update/getting-started#配置更新-channel)
- 用 Android Studio 或从命令行执行应用的[调试构建](/debugging/runtime-issues#原生调试)。

#### iOS 本地构建

- 设置调试环境变量：`export EX_UPDATES_NATIVE_DEBUG=1`
- 用 `npx pod-install` 重新安装 pods。`expo-updates` 的 podspec 现在会检测此环境变量，并做出更改，以便绕过通常会从 Metro 打包器加载的调试代码，并用 EXUpdates bundle 以及从 EAS 加载更新所需的其他依赖来构建应用。
- [确保在 **Expo.plist** 中设置了所需的 channel](/eas-update/getting-started#配置更新-channel)
- 修改应用的 Xcode 项目文件，强制为发布和调试构建都打包应用的 JavaScript：

```sh
$ sed -i '' 's/SKIP_BUNDLING/FORCE_BUNDLING/g;' ios/<project name>.xcodeproj/project.pbxproj
```

- 用 Xcode 或从命令行执行应用的[调试构建](/debugging/runtime-issues#原生调试)。

#### EAS Build

或者，我们可以使用 EAS 创建启用了 `expo-updates` 的调试构建。环境变量在 **eas.json** 中设置，如下例所示：

```json eas.json
{
  "build": {
    "preview_debug": {
      "env": {
        "EX_UPDATES_NATIVE_DEBUG": "1"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true,
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      },
      "channel": "preview_debug"
    }
  }
}
```

## 发布问题

我们无法发布更新，或者更新的某些部分没有按预期发布。

### 在本地检查最新更新

用 EAS Update 发布更新时，它会在项目根目录本地创建 **/dist** 目录，其中包含作为更新一部分上传的资源。

![dist 目录](/static/images/eas-update/dist.png)

### 查看更新中包含的全部资源

查看更新 bundle 中包含哪些资源可能会有帮助。我们可以从[更新详情](https://expo.dev/accounts/[account]/projects/[project]/updates)页面看到已命名资源的列表：

![资源列表](/static/images/eas-update/asset-list.png)

或在本地运行：

:::tabs
:::tab npm
```sh
$ npx expo export
```
:::
:::tab yarn
```sh
$ yarn expo export
```
:::
:::tab pnpm
```sh
$ pnpm expo export
```
:::
:::tab bun
```sh
$ bun expo export
```
:::
:::

## 缓解步骤

找到问题的根因后，我们可能想采取各种缓解步骤。最常见的问题之一是推送了内部有 bug 的更新。发生这种情况时，我们可以重新发布先前的更新来解决问题。

### 重新发布先前的更新

“撤销”一次糟糕发布的最快方式是重新发布一个已知良好的更新。想象我们有一个带两个更新的分支：

```text
branch: "production"
updates: [
  update 2 (id: xyz2) "fixes typo"     // 糟糕的更新
  update 1 (id: abc1) "updates color"  // 良好的更新
]
```

如果 "update 2" 结果是糟糕的更新，我们可以用类似这样的命令重新发布 "update 1"：

```sh
# eas update:republish --group [update-group-id]
# eas update:republish --branch [branch-name]

# 示例
$ eas update:republish --group abc1
$ eas update:republish --branch production
```

上面的示例命令会产生一个现在看起来像这样的分支：

```text
branch: "production"
updates: [
  update 3 (id: def3) "updates color"  // 重新发布 update 1（id: abc1）
  update 2 (id: xyz2) "fixes typo"     // 糟糕的更新
  update 1 (id: abc1) "updates color"  // 良好的更新
]
```

由于 "update 3" 现在是 "production" 分支上最近的更新，将来查询更新的所有用户都会收到 "update 3"，而不是糟糕的更新 "update 2"。

虽然这会防止所有新用户看到糟糕的更新，但已经收到糟糕更新的用户会一直运行它，直到他们能够下载最新更新。由于移动网络并不总能下载最近的更新，用户有时可能会长时间运行糟糕的更新。查看应用的错误日志时，看到一条残留的长尾错误是正常的，因为用户的应用正在获取最近的更新或构建。当我们看到错误率大幅下降时，就知道已经解决了这个 bug；不过，如果我们的用户群分布在许多地点和移动网络上，它很可能不会完全消失。
