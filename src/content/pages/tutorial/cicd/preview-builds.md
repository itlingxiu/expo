---
title: 用 EAS Workflows 为拉取请求创建预览构建
description: 学习如何用 EAS Workflows 创建预览构建工作流，用于 Slack 通知和 PR 预览。
---

# 用 EAS Workflows 为拉取请求创建预览构建

与队友和拉取请求（PR）评审者分享进行中的移动端变更时，往往需要他们检出某个分支，并在本地运行开发服务器。

## 学习成果

- 用指纹为内部分发自动化预览构建
- 在构建完成时发送 Slack 通知
- 在每个拉取请求上发布一次 [OTA 更新](/deploy/send-over-the-air-updates)，并在 PR 上评论一条用于测试的链接

### 前提条件

**已安装 expo-updates**

安装 [`expo-updates`](/versions/latest/sdk/updates) 库：

:::tabs
:::tab npm
```sh
npx expo install expo-updates
```
:::
:::tab yarn
```sh
yarn dlx expo install expo-updates
```
:::
:::tab pnpm
```sh
pnpm dlx expo install expo-updates
```
:::
:::tab bun
```sh
bunx expo install expo-updates
```
:::
:::

**已配置 EAS Update**

要配置 EAS Update，运行：

```sh
eas update:configure
```

上面的命令会把更新 URL 和 runtime 版本添加到 **app.json**，并在 **eas.json** 的每个构建 profile 中添加一个 [`channel`](/eas-update/deployment) 字段。

**已创建预览构建**

要接收 PR 预览更新，评审者需要在设备上安装一份带有 `expo-updates` 和 EAS Update channel 的预览构建。创建方式：

```sh
eas build --profile preview --platform all
```

由于 `expo-updates` 是原生库，这次构建会同时嵌入它的原生代码和 **eas.json** 中的 channel。运行上面的命令，也会让 EAS CLI 在我们第一次触发预览构建时生成[凭据](/app-signing/app-credentials)。

## 用于预览构建的 `build` 作业类型

团队用预览构建做相关方测试。成员通过内部分发把构建安装到设备、Android 模拟器或 iOS 模拟器上。他们不必运行开发服务器，也不必检出分支就能测试变更。

> 示意图展示预览流水线：指纹检查之后，仅在需要时构建，并把可安装的预览交给相关方。

与[开发构建](/tutorial/cicd/development-builds#用指纹跳过不必要的构建)一样，我们添加指纹，以便在原生代码没有变化时避免不必要的重新构建。

### 1. 添加 preview.yml

在 **.eas/workflows/** 中添加一个名为 **preview.yml** 的新文件。这个工作流文件使用 `preview` profile。

```yaml .eas/workflows/preview.yml
name: Preview builds

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: preview
  get_android_build:
    name: Check for existing Android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: preview
  get_ios_build:
    name: Check for existing iOS build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: preview
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: preview
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: preview
```

### 2. 运行工作流

用以下命令手动运行工作流：

```sh
eas workflow:run .eas/workflows/preview.yml
```

在 EAS 仪表板上，注意工作流遵循我们为[开发构建](/tutorial/cicd/development-builds#用指纹跳过不必要的构建)实现的同一套指纹模式。由于这是第一次创建预览构建，它会为 Android 和 iOS 运行构建作业。如果我们在不改变原生代码的情况下再向 `main` 分支推送一次提交，工作流会跳过构建作业，因为兼容的构建已经存在。

![EAS Workflows 预览运行：fingerprint 和 get-build 作业跳过了构建作业，因为兼容的 Android 和 iOS 构建已经存在。](/static/images/tutorial/cicd/eas-workflows-preview-fingerprint-skip.png)

## Slack 通知

:::note
本节是可选的。不用 Slack？跳到下一节关于 PR 预览的内容。
:::

许多团队用 Slack 接收构建通知，这样团队不用查看 EAS 仪表板就能看到构建状态。当构建完成（或被跳过）时，[`slack`](/eas/workflows/pre-packaged-jobs#slack) 预置作业会把状态发布到一个频道。

### 1. 创建 Slack webhook URL

要从 EAS Workflows 向我们的 Slack 频道发送消息，需要从 Slack 的设置中获取一个 webhook URL：

1. 前往 [api.slack.com/apps](https://api.slack.com/apps)，创建一个新的 Slack 应用（或使用现有应用）。
2. 在 **Features** 下选择 **Incoming Webhooks** 并打开开关。
3. 点击 **Add New Webhook**，并选择要发布通知的频道。
4. 复制 webhook URL。它的形式类似：`https://hooks.slack.com/services/TD000/B000/XXXXXXXXXX`
5. 把 webhook URL 添加为名为 `SLACK_WEBHOOK_URL` 的 EAS 环境变量。在 EAS 仪表板上打开项目的[环境变量](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)页面，为 `preview` 环境创建该变量，并把[可见性](/eas/environment-variables#visibility-settings-for-environment-variables)设为 **secret**，因为只有 EAS 服务器需要读取它。也可以用 [EAS CLI](/eas/environment-variables/manage) 创建：

```sh
eas env:set --name SLACK_WEBHOOK_URL --value https://hooks.slack.com/services/TD000/B000/XXXXXXXXXX --environment preview --visibility secret
```

### 2. 添加 Slack 通知作业

更新 **preview.yml**，在构建作业之后添加一个 `notify` 作业。`notify` 作业使用 `webhook_url` 和 `message` 参数，或者用 `payload` 参数配合 [Slack Block Kit](https://docs.slack.dev/block-kit) 做富文本格式。该作业通过 `environment` 字段，从[我们先前创建的 `SLACK_WEBHOOK_URL` 环境变量](#1-创建-slack-webhook-url)读取 webhook URL。作业默认使用 `production` 环境，因此这里设置 `environment: preview` 才会让该变量可用。

```yaml .eas/workflows/preview.yml
name: Preview builds

jobs:
  fingerprint: # ...
  get_android_build: # ...
  get_ios_build: # ...
  build_android: # ...
  build_ios: # ...
  notify:
    name: Notify on Slack
    after: [build_android, build_ios]
    type: slack
    environment: preview
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: 'Preview builds are ready - Android: ${{ after.build_android.status }}, iOS: ${{ after.build_ios.status }}'
```

`after` 字段确保通知在构建结束后发出，无论结果如何。`message` 使用 `${{ after.build_android.status }}` 和 `${{ after.build_ios.status }}` 来包含每个平台的结果（成功、失败或跳过）。团队不用离开 Slack 就能看到发生了什么。

### 3. 运行工作流

用以下命令手动运行工作流：

```sh
eas workflow:run .eas/workflows/preview.yml
```

在 EAS 仪表板上，可以验证 `Notify on Slack` 作业成功运行。

![EAS Workflows 预览运行，展示 Android 和 iOS 构建作业之后成功完成的 Notify on Slack 作业。](/static/images/tutorial/cicd/eas-workflows-preview-slack-notify-job.png)

也可以在与该应用集成的 Slack 频道中验证这一点。

![EAS Workflows 发布的一条 Slack 消息，展示某个 Expo 项目 Android 和 iOS 预览构建的完成状态。](/static/images/tutorial/cicd/eas-workflows-preview-slack-notification.webp)

## 使用 EAS Update 的 PR 预览

PR 评审者可以阅读 diff，但无法直观看到变更，也无法在设备上测试它们。

Web 团队用部署预览解决这个问题。当有人打开拉取请求时，CI/CD 工作流会生成一个预览链接。评审者打开链接即可测试变更，而不必检出分支。

对于移动端，可以用 [EAS Update](/eas-update/introduction) 搭建等价的流程。它把 JavaScript 包交付给已经安装了兼容构建的设备，从而跳过原生编译步骤。对于 PR 预览，更新是合适的选择，因为评审者可以快速打开并测试，然后在 PR 上留下反馈。

EAS Workflows 为此提供了 [`github-comment`](/eas/workflows/pre-packaged-jobs#github-comment) 预置作业。它在更新发布后于拉取请求上发表评论，给评审者一个链接或二维码，以便在设备上打开更新。

### 1. 创建 pr-preview.yml

在 **.eas/workflows/** 中添加一个名为 **pr-preview.yml** 的新文件。这个工作流在使用 `on.pull_request` 触发器创建拉取请求时运行。它只用 `update` 作业类型发布一次更新，然后在 PR 上发表一条带有更新链接的评论。

```yaml .eas/workflows/pr-preview.yml
name: PR Preview

on:
  pull_request:
    branches: ['*']

jobs:
  publish_preview:
    name: Publish PR preview update
    type: update
    environment: preview
    params:
      channel: preview
  comment:
    needs: [publish_preview]
    type: github-comment
```

:::warning
在测试上面的工作流之前，提交 **pr-preview.yml** 并推送到我们 GitHub 仓库的 `main` 分支。**EAS Workflows 从默认分支读取工作流文件。**
:::

### 2. 用拉取请求测试

通过在 GitHub 仓库中创建一个拉取请求来测试工作流。拉取请求需要一个与 `main` 分开的分支。运行以下命令创建并切换到一个新分支：

```sh
git checkout -b test-preview
```

现在在 Expo 项目中做一处看得见的修改（例如更改一段文字或背景色）。然后提交并推送该分支：

```sh
git add . && git commit -m 'Test PR preview' && git push origin test-preview
```

在 GitHub 上从 `test-preview` 向 `main` 打开一个拉取请求。创建拉取请求后，工作流会自动运行。在 EAS 仪表板上，可以验证 `publish_preview` 作业先运行，`comment` 作业在它成功后运行。

![EAS Workflows 拉取请求预览运行，展示 publish_preview 作业，以及随后把更新链接发布到 GitHub 的 comment 作业。](/static/images/tutorial/cicd/eas-workflows-preview-pr-publish-comment.png)

在 GitHub 拉取请求上，应该出现一条评论，其中包含用于在设备上测试更新的链接或二维码。

![EAS Workflows 在 GitHub 拉取请求上发表的评论，链接到针对所提议变更的 EAS Update 预览。](/static/images/tutorial/cicd/eas-workflows-preview-github-pr-comment.png)

使用评论中的链接或二维码，现在可以在设备或模拟器上打开更新并测试这些变更。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
