---
title: 手动把 Android 应用提交到 Google Play Store
description: 首次把 Android 应用上传到 Google Play Console 的分步指南。
---

# 手动把 Android 应用提交到 Google Play Store

如果你是**第一次**把 Android 应用提交到 Google Play Store，本指南会带你手动上传，并在 Google Play Console（一个 Web 界面）中创建第一次发布。

:::note
**手动上传是可选的**。[`eas submit`](/submit/android) 命令可以直接创建应用的第一次发布，默认在内部测试轨道上。如果你更想自己在 Play Console 中创建第一次发布，请使用本指南。
:::

:::warning
Google Play Console 仪表盘会随时间变化。如果本指南中的截图或标签与你看到的不一致，请[在 GitHub 上开一个 issue](https://github.com/expo/expo/issues/new/choose)告诉我们。
:::

## 创建第一次发布的步骤

1. 打开 [Google Play Console](https://play.google.com/apps/publish/)并点击 **Create app**。

   ![带有 Create app 按钮的 Google Play Console 主屏幕](/static/images/submit/first-android-submission/01-open-google-play-console.webp)

2. 输入 **App name**，选择 **Default language**、**App or game**、**Free or paid**，然后点击 **Create app**。

   ![Play Console 中的创建应用表单](/static/images/submit/first-android-submission/02-create-application.webp)

3. 你会被重定向到 **Dashboard**，在那里提供关于 Android 应用的全部信息。

   ![显示设置任务的 Play Console Dashboard](/static/images/submit/first-android-submission/03-dashboard.webp)

4. 按步骤填写应用详情。先准备应用的内部测试版本。在 **Start testing now** 下点击 **View tasks**。

:::note
   这一步很重要。否则，当你尝试发布时，会看到与应用信息相关的错误。
:::

   ![带有 View tasks 按钮的 Dashboard 任务列表](/static/images/submit/first-android-submission/04-steps.webp)

5. 在 **Internal testing** 页面的 **Testers** 下，点击 **Create email list**，添加要分享内部测试发布的用户。创建（或选择已有的）测试人员列表后，点击 **Save**。

   ![创建测试人员电子邮件列表](/static/images/submit/first-android-submission/05-create-email-list.webp)

   ![显示已保存测试人员列表的内部测试标签页](/static/images/submit/first-android-submission/05-testing.webp)

6. 点击 **Create new release**。

   ![内部测试页面上的 Create new release 按钮](/static/images/submit/first-android-submission/06-create-release.webp)

7. 你会被重定向到应用完整性屏幕。选择 **Choose signing key** > **Google-generated key**。使用 Google 生成的密钥后，即使丢失 Android keystore，你仍然可以上传应用。

   ![选择 Google 生成的签名密钥](/static/images/submit/first-android-submission/07-google-app-signing.webp)

8. 在 **App bundles** 下，点击 **Upload** 并从电脑选择 **.aab** 文件。如果还没有创建构建，请[用 `eas build` 创建一份](/tutorial/eas/android-production-build#create-a-production-build)。

   ![上传 aab 归档](/static/images/submit/first-android-submission/08-upload-aab-archive.webp)

9. 上传完成后，你会看到归档类型和 **Version code**。**Version code** 标识每次发布。每次新发布都必须有唯一的值。在 Expo 项目中，用应用配置里的 `expo.android.versionCode` 设置它，或使用[远程版本来源](/build-reference/app-versions)自动递增。

   ![查看已上传归档的 version code](/static/images/submit/first-android-submission/09-view-version-code.webp)

10. 输入 **Release name** 并点击 **Next**。在 **Preview and confirm** 屏幕上，你可能会看到关于 *“... no deobfuscation file associated with this App Bundle ...”* 的警告。你现在可以跳过，或[用 `expo-build-properties` 启用 ProGuard 规则](/versions/latest/sdk/build-properties#pluginconfigtypeandroid)。点击 **Save and publish**。

    ![提交第一次发布的屏幕](/static/images/submit/first-android-submission/10-submit-first-release.webp)

11. 你会进入 **Internal testing** > **Releases** 摘要。点击 **Promote release**，让应用对测试人员可用，或把它推广到生产环境。

    ![发布摘要页面](/static/images/submit/first-android-submission/11-release-summary.webp)

12. 要与你创建的测试人员列表分享该发布，点击 **Testers** > **Copy link** 并分享该链接。测试人员可以从该链接把应用安装到设备上。

    ![复制测试人员链接](/static/images/submit/first-android-submission/12-testers-copy-link.webp)

## 后续步骤

回到 **Dashboard**，完成应用剩余的任务：隐私政策、商店素材和其他详情。在应用可以进入生产环境之前，这是必需的。

![带有待办任务的 Dashboard](/static/images/submit/first-android-submission/13-pending-tasks.webp)

### 延伸阅读

- Play Console 中的[缺少隐私政策](https://expo.fyi/missing-privacy-policy)错误
- 为应用的商店页面[创建商店素材](/guides/store-assets)
- [创建 Google 服务账号密钥](https://expo.fyi/creating-google-service-account)：使用 `eas submit --platform android` 所必需
- [用 EAS Submit 提交到 Google Play Store](/submit/android)
