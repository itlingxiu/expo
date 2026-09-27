---
title: 与团队分享预览
description: 学习如何使用 EAS Update 发送 OTA 更新，并与团队分享预览。
---

# 与团队分享预览

更新通常用于在应用商店发布之间修复小缺陷、推送小改动。它们允许更新示例应用中的非原生部分，例如 JavaScript 代码、样式和图片。

在本章中，我们将使用 [EAS Update](/eas-update/introduction) 与团队分享变更。这有助于[我们和团队快速分享变更的预览](/review/overview)。

[观看视频：如何与团队分享预览](https://www.youtube.com/watch?v=vPKh-tNm-yI) —— 设置 EAS Update，在应用商店发布之间与团队分享应用的预览版本。

---

## 1. 安装 expo-updates 库

要初始化项目并发送更新，需要使用 [`expo-updates`](/versions/latest/sdk/updates) 库。运行以下命令安装它：

:::tabs
:::tab npm
```sh
npx expo install expo-updates
```
:::
:::tab yarn
```sh
yarn expo install expo-updates
```
:::
:::tab pnpm
```sh
pnpm expo install expo-updates
```
:::
:::tab bun
```sh
bun expo install expo-updates
```
:::
:::

## 2. 配置 EAS Update

要用 EAS Update 初始化项目，需要按以下步骤操作：

- 由于我们使用动态的 **app.config.js** 作为应用配置，必须添加 [`updates`](/versions/latest/config/app#updates) 和 [`runtimeVersion`](/eas-update/runtime-versions#setting-runtimeversion) 属性，才能让项目与 EAS Update 兼容。运行以下命令，从 EAS 获取这些属性及其值，并手动复制到 **app.config.js**：

```sh
eas update:configure
```

<details>
<summary>非动态（app.json）项目呢？</summary>

如果项目不使用动态应用配置（使用 **app.json** 而不是 **app.config.js**），上面的命令会把应用配置为与 EAS Update 兼容，并把正确的属性添加到 **app.json** 和 **eas.json**。

</details>

- 再次运行 `eas update:configure` 以继续设置过程。应在 **eas.json** 的每个构建 profile 中添加一个 [`channel`](/eas/json#channel)：

```json eas.json
{
  "build": {
    "development": {
      "channel": "development"
    },
    "ios-simulator": {},
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

:::note
注意，`eas update:configure` 命令会给 **eas.json** 中的每个构建 profile 都加上 `channel`。不过，我们的 `ios-simulator` profile 扩展了 `development` profile，单独再有一个 `channel` 没有意义。可以安全地从上面的配置中移除 `ios-simulator.channel`。
:::

<details>
<summary>什么是 channel？</summary>

[Channel](/eas-update/how-it-works#conceptual-overview) 用于把构建分组。如果我们有 Android 和 iOS 构建，并且都在应用商店中，可以给它们都指定 production 这个 channel。之后可以让 EAS Update 以 production channel 为目标，这样更新就会影响所有带有 production channel 的构建。

</details>

## 3. 创建开发构建

需要创建一次新的开发构建，因为上一次构建不包含 `expo-updates` 库。运行以下命令：

```sh
eas build --platform android --profile development
```

> 我们使用面向 Android 设备的开发构建来演示更新。也可以用 `--platform all` 或 `--platform ios` 为两个平台或仅为 iOS 创建构建。

新版本的开发构建创建完成后，请确保把它安装到设备上。

## 4. 修改应用的 JavaScript 代码

来修改示例应用的 JavaScript 代码。如果你没有使用 [Sticker Smash 应用](/tutorial/eas/introduction#前提条件)，可以修改代码中的任意部分，以便在应用中看到变化。

我们将把示例应用中第一个按钮的文字从 **Choose a photo** 改为 **Select a photo**。

```tsx src/app/(tabs)/index.tsx
<Button theme="primary" label="Select a photo" onPress={pickImageAsync} />
```

## 5. 发布更新

与其创建一次新构建来与团队分享这次变更以供测试，不如发布一次更新：

```sh
eas update --channel development --message "Change first button label"
```

在上面的命令中，我们使用了 `development` channel。每一次更新都关联一个 [channel 名称](/eas-update/how-it-works#publishing-an-update)。这类似于我们用 git 做的每一次提交都关联一个 git 分支。

因此，在构建 profile 中使用 `development` 这个 channel，然后再发布一次更新，就是在要求 EAS 把这次更新交付给带有 `development` channel 的构建。当我们创建一个 EAS Update channel 时，它会自动映射到同名的分支。

更新发布后，CLI 会提示我们关于它的信息。

![更新已通过 CLI 提示成功发布](/static/images/tutorial/eas/update-01.png)

点击 **Website link**，在 EAS 仪表板的 **Over-the-air updates** > **Update groups** 下查看这次更新：

![EAS 仪表板显示开发构建最近一次已发布的更新](/static/images/tutorial/eas/update-02.png)

## 6. 在开发构建中实时预览更新

要在开发构建中预览实时更新：

- 在开发构建中登录你的 Expo 账户。
- 打开 **Extensions** 标签。
- 在 **EAS Update** 下找到 **Branch: development**。
- 点击 **Open** 以访问这次更新。

## 7. 与 preview 或 production 构建分享变更

非开发构建（preview 或 production）的更新会在应用启动并向服务器请求新更新时自动下载到设备。

任何正在运行 preview 或 production 构建的团队成员，都会收到我们推送到那些特定分支的更新及其中的变更。

例如，对于 `preview` 构建，可以运行：

```sh
eas update --channel preview --message "Change first button label"
```

下面是我们为 `preview` 构建发布了一次更新的例子。要测试更新，强制关闭并重新打开应用两次，以下载并查看变更：

<video src="/static/videos/tutorial/eas/running-update-on-dev.mp4" controls></video>

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
