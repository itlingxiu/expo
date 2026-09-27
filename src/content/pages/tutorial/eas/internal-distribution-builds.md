---
title: 创建并分享内部分发构建
description: 了解什么是内部分发构建、为什么需要它们，以及如何创建。
---

# 创建并分享内部分发构建

在本章中，我们将学习如何设置[内部分发构建](/build/internal-distribution#using-internal-distribution)。

[观看视频：如何创建并分享内部分发构建](https://www.youtube.com/watch?v=1fQuGLHxWks) —— 用 EAS 创建内部分发构建，并直接分享给团队进行测试。

---

## 内部分发构建

内部分发构建适合与团队成员分享更新，让技术和非技术相关方都能直接提供反馈。与开发构建不同，它们不需要运行开发服务器，从而简化测试过程。

### 在内部发行应用的方式

Google 和 Apple 都提供了内置的内部共享机制：

- **Android**：使用 Google Play beta
- **iOS**：使用 TestFlight

不过，这两种传统方法都有局限。例如，TestFlight 一次只能有一个活跃构建。

### 用 EAS Build 更快地分发

EAS Build 加快了这个过程。它为我们的构建创建可分享的链接，并提供使用说明。它有一套默认配置，专门方便内部分发，是传统方法之外更高效的替代方案。

## 创建内部分发构建

要用 EAS Build 创建并分发构建，需要按以下步骤操作：

### 1. 配置 preview 构建 profile

从我们在 **eas.json** 中的初始设置来看，已经有一份默认配置，其中包含为内部分发设计的 `preview` 构建 profile：

```json eas.json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

`preview` profile 中的 `distribution` 值被设为 `internal`。

这就是创建第一次内部分发构建所需的全部内容。上面片段中的 `preview` 构建 profile 有一个 `distribution` 属性，其值为 `internal`。这个值让我们可以把构建 URL 分享给任何人，他们可以把它安装到自己的设备上，并且不需要开发服务器就能运行应用。

如前面几章所述，对于非应用商店构建，Android 需要 **.apk**，iOS 需要 **.ipa**。内部分发构建同样如此。当 `distribution` 设为 `internal` 时，会自动为设备创建这些文件格式的应用二进制文件。

### 2. 创建

创建内部分发构建需要[应用签名凭据](/app-signing/app-credentials)。

Android 应用签名限制较少，允许安装任何兼容的 **.apk** 文件。创建开发构建时，已经为它生成了一个新的 Android Keystore。因此，预览构建不需要再生成新的 keystore。

另一方面，Apple 对在 iOS 设备上分发应用有更严格的规则。我们需要一份 ad hoc 描述文件，明确列出允许运行应用的设备。某些应用满足特定要求的组织，可以使用 [Apple Developer Enterprise Program](https://developer.apple.com/programs/enterprise/) 在内部向更大范围的受众分发应用。

:::tabs
:::tab Android

- 使用 `preview` profile 发起一次 Android 构建：

```sh
eas build --platform android --profile preview
```

- 这条命令会触发 EAS Build，在 EAS 仪表板上可以看到构建进度：

![EAS 仪表板中的 Android 预览构建详情与进度](/static/images/tutorial/eas/android-preview-build.png)

:::
:::tab iOS

用 ad hoc 描述文件签名的应用，可以由 UDID 已登记到该描述文件的 iOS 设备安装。

- 要登记更多设备，使用 `eas device:create`。这条命令会登记一台 iOS 设备，并给我们一个用于设备登记的 URL 或二维码：

```sh
eas device:create
```

- 这条命令会登记一台用于安装应用的 iOS 设备，并生成一个可分享的 URL（或二维码）供设备登记。

:::tip
这条命令可以在任何时候启用设备登记。不过，只有登记之后创建的构建才能在新添加的设备上运行。
:::

:::warning
**在新的或最近续订的 Apple Developer Program 会员资格下，新登记的设备可能无法立即安装。** 用 Expo 登记设备并不会向 Apple 登记它。设备只有在第一次被包含进某次构建或重新签名时，才会被添加到 Apple。对于这类会员资格，Apple 随后可能需要[最多 24–72 小时](https://developer.apple.com/help/account/reference/device-registration-updates/)才能完成设备处理，之后才能把它加入描述文件。如果在登记新设备后构建立刻失败，请等待 Apple 处理完成，然后再次运行构建。更多内容参见[管理设备](/build/internal-distribution#managing-devices)。
:::

- 要创建预览构建，需要在 `eas build` 命令中使用 `preview` profile：

```sh
eas build --platform ios --profile preview
```

- 这条命令会触发 EAS Build，在 EAS 仪表板上可以看到构建进度：

![EAS 仪表板中的 iOS 预览构建详情与进度](/static/images/tutorial/eas/ios-preview-build.png)

<details>
<summary>使用 <code>eas build:resign</code> 登记设备的替代方法</summary>

[`eas build:resign`](/app-signing/app-credentials#re-signing-new-credentials) 命令可以用来用新的 ad hoc 描述文件重新签名现有的 iOS **.ipa**，从而不必完整重新构建。

</details>

<details>
<summary>你在设置企业描述文件吗？</summary>

Apple Enterprise Program 会员资格每年 299 美元，而且[并非所有组织都符合资格](https://developer.apple.com/programs/enterprise/)，因此你很可能使用 ad hoc 描述文件，它适用于任何普通的付费 Apple Developer 账户。

如果你有 [Apple Developer Enterprise Program 会员资格](https://developer.apple.com/programs/enterprise/)，用户无需预先登记 UDID 就可以把应用安装到设备上。他们只需把描述文件安装到设备上，然后就可以访问现有构建。在 `eas build` 过程中，你需要用 Apple Developer Enterprise 账户登录，以设置正确的描述文件。

如果你既通过企业描述文件又通过 App Store 分发应用，每种场景都需要不同的 bundle identifier。我们建议：

- 在用 Expo CLI 生成的项目中，使用 [**app.config.js** 动态切换标识符](/tutorial/eas/multiple-app-variants)。
- 在[现有的 React Native 项目](/bare/overview)中，为每个 bundle identifier 创建单独的 `scheme`，并在不同的构建 profile 中指定 scheme 名称。

</details>

<details>
<summary>你在使用手动的本地凭据吗？</summary>

如果是，请确保 **credentials.json** 指向你通过 Apple Developer Portal 生成的 ad hoc 或企业描述文件（更新一份用于其他分发类型的现有 **credentials.json**，或用指向相应描述文件的新文件替换它）。请注意，EAS CLI 对本地凭据只做有限校验，设备 UDID 登记需要你手动处理。更多内容参见[使用本地凭据](/app-signing/local-credentials)。

</details>

:::
:::

### 3. 安装

构建完成后，Build artifact 一节会更新，表明构建已完成。这一节提供了在 iOS 设备上运行开发构建的可用方法：Expo Orbit 和 Install 按钮。

- 打开构建的详情页。如果要把构建分享给其他人，可以把构建链接发给他们。他们可以打开构建详情页或构建产物详情，其中包含 Expo Orbit。
- 用 USB 把 Android 或 iOS 设备连接到你的电脑。
- 打开 Orbit 菜单栏应用。
- 在 Orbit 应用中选择 **Device**。
- 在 **Build artifact** 下点击 **Open with Orbit**。

<details>
<summary>替代方案：使用 Install 和二维码</summary>

- 打开构建的详情页。如果要把构建分享给其他人，可以把构建页面的链接发给他们。他们可以打开它，并看到包含 Expo Orbit 的构建产物详情。
- 在 Build artifact 一节下点击 **Install**，显示 **Install on a test device** 弹窗。
- 从 **Send a link to a device** 一节复制链接，并发送到测试设备。

![EAS 仪表板中的内部分发构建详情和安装链接](/static/images/tutorial/eas/android-qr-code.png)

</details>

### 4. 运行

在设备上点击应用图标，启动预览构建。不需要开发服务器。

由于我们已经设置了多个应用变体，可以在设备上看到 development 和 preview 变体分别安装。例如：

- 在 Android 上：

![EAS 仪表板中 Android 内部分发构建的详情和安装链接](/static/images/tutorial/eas/android-multi-variants-installed.png)

- 在 iOS 上：

![EAS 仪表板中 iOS 内部分发构建的详情和安装链接](/static/images/tutorial/eas/ios-multi-variants-installed.webp)

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
