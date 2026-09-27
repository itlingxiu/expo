---
title: 用 EAS Submit 提交到 Google Play Store
description: 了解如何用 EAS Submit 把 Android 应用提交到 Google Play Store。
---

# 用 EAS Submit 提交到 Google Play Store

[EAS Submit](/deploy/submit-to-app-stores) 是把 Android 应用上传到 Google Play Store 的推荐方式。`eas submit` 命令在你的机器上和 CI/CD 中的工作方式相同。[EAS Workflows](/eas/workflows/introduction) 是在构建之后自动运行它的最简单方式。

## 前置条件

- **注册 Google Play 开发者账户**：把应用提交到 Google Play Store 需要 Google Play 开发者账户。在 [Google Play Console 注册页面](https://play.google.com/apps/publish/signup/)注册。
- **在 Google Play Console 中创建应用**：在 [Google Play Console](https://play.google.com/apps/publish/)中点击 **Create app** 创建应用。
- **创建 Google 服务账号密钥并上传到 EAS**：EAS 需要 Google 服务账号密钥才能代表你提交。按照[创建 Google 服务账号密钥](https://expo.fyi/creating-google-service-account)指南创建一把。然后用 EAS 仪表盘或 EAS CLI 把密钥上传到项目凭据：

:::tabs
:::tab EAS 仪表盘
  - 进入项目的 EAS 仪表盘，点击 **Credentials**，在 **Android** 下点击应用的 **Application identifier**。
  - 在 **Service Credentials** 下，点击 **Add a Google Service Account Key**。
  - 确认已选择 **Upload new key**，并上传下载的 JSON 密钥。

  ![把 Google 服务账号密钥上传到 EAS 仪表盘的 Service Credentials 下](/static/images/tutorial/eas/credentials-03.png)
:::
:::tab EAS CLI
  - 运行 `eas credentials --platform android`
  - 当提示 **Which build profile do you want to configure?** 时，选择 **production**
  - 当提示 **What do you want to do?** 时，选择 **Google Service Account** > **Upload a Google Service Account Key**
  - 输入 JSON 密钥文件的路径
:::
:::

- **在应用配置中包含包名**：在 **app.json** 中包含应用的包名：

  ```json app.json
  {
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
  ```

- **安装 EAS CLI 并用 Expo 账户进行身份验证**：安装 EAS CLI 并用 Expo 账户登录：

:::tabs
:::tab npm
  ```sh
  $ npm install --global eas-cli && eas login
  ```
:::
:::tab yarn
  ```sh
  $ yarn global add eas-cli && eas login
  ```
:::
:::tab pnpm
  ```sh
  $ pnpm add --global eas-cli && eas login
  ```
:::
:::tab bun
  ```sh
  $ bun add --global eas-cli && eas login
  ```
:::
:::

## 构建生产应用

提交需要一份生产 **.aab**（Android App Bundle）。Google Play 要求新应用以应用包而不是 **.apk** 文件发布，并从该包为每台设备生成优化的 APK。用 [EAS Build](/build/introduction) 创建一份：

```sh
$ eas build --platform android --profile production
```

你也可以在自己的电脑上用 `eas build --platform android --profile production --local` 或 Android Studio 构建。

默认的 `production` profile 产出 **.aab**。只有当构建 profile 把 [`android.buildType`](/eas/json#buildtype) 设为 `apk` 时才会产出 **.apk**，这对[安装到模拟器或设备](/build-reference/apk)有用，但不能提交到 Google Play Store。

## 首次提交

如果这是应用的第一次提交，默认的 `eas submit` 命令开箱即用，并在[内部测试轨道](/eas/json#track)上创建应用的第一次发布。运行之前，请完成[前置条件](#前置条件)，使应用存在于 Google Play Console，并且 EAS 拥有可代表你提交的 [Google 服务账号密钥](https://expo.fyi/creating-google-service-account)。在你完成商店列表页和设置任务之前，应用在 Play Console 中保持草稿状态，这些任务是把发布推广到生产之前所必需的。

- **更想自己做第一次上传？** 按照[手动提交指南](/submit/android-manual)在 Play Console 中创建第一次发布。
- **想上传但不推出？** 在 **eas.json** 的提交 profile 中把 [`releaseStatus`](/eas/json#releasestatus) 设为 `draft`，然后在 Play Console 中完成发布。

## 用 `eas submit` 提交

构建就绪后，把它提交到 Google Play Store：

```sh
$ eas submit --platform android
```

该命令会引导你选择一次构建并上传。通过在 **eas.json** 中添加提交 profile 来配置提交过程。每个可用选项参见 [eas.json 参考](/eas/json#android-specific-options-1)。

### 一步完成构建和提交

向 `eas build` 传入 `--auto-submit`，即可把完成的构建自动交给 EAS Submit：

```sh
$ eas build --platform android --auto-submit
```

细节参见[自动提交](/build/automate-submissions)。

## 用 EAS Workflows 自动化

[EAS Workflows](/eas/workflows/introduction) 在 EAS 基础设施上运行同一个 `eas submit` 命令，由 git 推送触发，或从 CLI 手动运行。工作流使用你在[前置条件](#前置条件)中上传的 Google 服务账号密钥向 Google Play 进行身份验证。

创建名为 **.eas/workflows/submit-android.yml** 的工作流文件，内容如下：

```yaml .eas/workflows/submit-android.yml
name: Submit Android

on:
  push:
    branches: ['main']

jobs:
  build_android:
    name: Build Android app
    type: build
    params:
      platform: android
      profile: production

  submit_android:
    name: Submit to Google Play Store
    needs: [build_android]
    type: submit
    params:
      profile: production
      build_id: ${{ needs.build_android.outputs.build_id }}
```

这会在每次推送到 `main` 时构建 Android 应用并提交到 Google Play。手动触发：

```sh
$ eas workflow:run submit-android.yml
```

更多模式参见[工作流示例指南](/eas/workflows/examples/introduction)。

## 使用其他 CI/CD 服务

你可以从任意 CI/CD 服务运行 `eas submit`，例如 GitHub Actions、GitLab CI 等：

```sh
$ eas submit --platform android --profile production
```

这需要[个人访问令牌](/accounts/programmatic-access#personal-access-tokens)来向你的 Expo 账户进行身份验证。在 CI 服务中设置环境变量 `EXPO_TOKEN`，以便 `eas submit` 可以非交互运行。
