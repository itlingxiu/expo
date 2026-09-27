---
title: 为 Android 创建生产构建
description: 了解为 Android 创建生产构建并自动化发布过程。
---

# 为 Android 创建生产构建

在本章中，我们将创建示例应用的生产版本并提交到 Google Play Store。我们还会探索如何自动化新应用版本的创建与发布。

[观看视频：为 Android 创建并发布生产构建](https://www.youtube.com/watch?v=nxlt8uwqhpE) —— 用 EAS 为 Android 创建生产构建，提交到 Google Play Store，并自动化发布过程。

---

### 前提条件

- **Google Play Developer 账户**：需要一个付费的 Google Play Developer 账户。设置细节参见 [Google Play 注册页面](https://play.google.com/apps/publish/signup/)。
- **eas.json 中的生产构建 profile**：确保 **eas.json** 中存在 `production` 构建 profile，它是默认添加的。
- **Google Service Account 密钥（可选）**：需要 Google Service Account 邮箱和 JSON 密钥，才能[自动化发布过程](#9-自动发布)。请按[创建 Google Service Account 密钥或从现有账户下载](https://expo.fyi/creating-google-service-account)中的详细说明操作，然后回到本指南。

## 面向 Android 的生产构建

[Android 生产构建](/build/eas-json#production-builds)采用 **.aab** 格式，针对在 Google Play Store 上分发做了优化。与 **.apk** 构建不同，**.aab** 文件只能通过 Google Play Store 分发和安装。

## 1. 创建生产构建

要使用默认的 `production` profile 创建 Android 生产构建，打开终端并执行以下命令。由于 EAS 配置中把 `production` 设为默认 profile，不必用 `--profile` 标志显式指定它。

```sh
eas build --platform android
```

上面的命令会把构建加入队列。在 EAS 仪表板上注意 **Version Code** 会自动递增。

## 2. 在 Google Play Console 上创建应用

:::note
不必手动创建第一次发布：`eas submit` 可以直接创建应用的第一次发布。在本教程中，我们会走一遍 Play Console，以便熟悉发布是如何工作的。
:::

第一次把应用上传到 Google Play Store 时，我们需要：

- 前往 Google Play 仪表板。
- 在 **Home** 页面点击 **Create app**，创建一个新应用。

![在 Google Play Console 上创建应用](/static/images/tutorial/eas/play-store-01.webp)

- 填写应用详情并点击 **Create app** 按钮。

![Google Play Console 上的创建应用表单](/static/images/tutorial/eas/play-store-02.png)

## 3. 发布内部测试版本

在 Google Play Console 上创建应用后，它会把我们重定向到应用的 Dashboard 屏幕。我们需要准备应用的内部测试版本。

- 在 **Dashboard** 上点击 **Start testing now**。

![Google Play Console 上 Start testing now 下的步骤](/static/images/tutorial/eas/play-store-03.png)

- 在 **Internal Testing** > **Testers for the internal testing release** 下创建一份用户邮箱列表。

![为内部测试者创建邮箱列表](/static/images/tutorial/eas/play-store-04.png)

- Google Play Console 会提示我们创建一次内部测试发布。
- 要创建新发布，前往 **Dashboard** 并点击 **Create new release**。你会首先注意到，签名密钥已由 Google Play Console 在 **App integrity** 下自动生成。

![为应用包选择签名密钥](/static/images/tutorial/eas/play-store-05.png)

## 4. 上传应用二进制文件

EAS 创建生产构建之后：

- 打开 EAS 仪表板并点击 **Download**，获取 **.aab** 文件。

![下载 aab 文件](/static/images/tutorial/eas/play-store-07.png)

- 返回 Google Play Console，前往 **Test and release** > **Testing** > **Internal testing**。
- 在 **App bundles** 下点击 **Upload**，添加 **.aab** 文件。然后提供应用的发布详情并点击 **Next**。
- 在接下来的屏幕上点击 **Save and publish**。

![把 aab 文件上传到 Google Play Console](/static/images/tutorial/eas/play-store-08.png)

## 5. 分享内部发布版本

在 **Track Summary** 下，我们看到最新发布显示的是一个临时应用名称。这是因为我们的应用尚未通过审核。

![Google Play Console 上待审核的应用](/static/images/tutorial/eas/play-store-09.png)

在 **Releases** 下，我们看到应用已可供内部测试者使用。要把应用分享给一组测试者：

- 切换到 **Releases** 旁边的 **Testers** 标签。
- 在 **How testers join your test** 下点击 **copy link**。你可以用这个链接，通过邮件或消息分享给测试团队。

![分享内部发布版本](/static/images/tutorial/eas/play-store-14.png)

- 在设备上打开测试邮件，并按步骤下载应用。

![作为内部测试者在设备上下载应用](/static/images/tutorial/eas/play-store-15.webp)

- 持有测试邮件的人需要接受邀请，接受之后就可以把应用安装到设备上。

![接受邀请后，应用可以安装到设备上](/static/images/tutorial/eas/play-store-16.webp)

![作为内部测试者安装在设备上的应用](/static/images/tutorial/eas/play-store-17.webp)

:::tip
要在 Play Store 上发布应用，请在 Google 仪表板中完成 **Set up your app** 下的步骤。这些步骤是第一次把应用发布到 Play Store 之前所必需的。你需要提供隐私政策链接、目标受众、数据安全等信息。
:::

> **完成商店列表页**：要为商店列表页准备应用，参见[创建应用商店素材](/guides/store-assets)，了解如何创建截图和预览。

<details>
<summary>提升测试发布</summary>

要把内部测试发布版本提升到 **alpha**，在 Google Play Store Console 中：

- 在 **Test and release** 下，前往 **Testing** > **Closed testing**。
- 在 **Closed testing - Alpha** 旁边点击 **Manage track**。

</details>

## 6. 添加 Google Service Account 权限密钥

:::tip
在按本节步骤操作之前，请先阅读[创建 Google Service Account 密钥或从现有账户下载](https://expo.fyi/creating-google-service-account)指南中的说明。
:::

从现在起，我们可以用 [EAS Submit](/submit/android) 自动化发布，从而避免手动过程。为此，需要把服务账户密钥添加到项目的凭据中。

按照 Google Service Account 指南的步骤操作后，可以把下载的 JSON 密钥上传到 EAS 仪表板：

- 前往项目的 EAS 仪表板，点击 **Credentials**，在 **Android** 下点击应用的 **Application identifier**。

![向 EAS 仪表板添加新的 Google Service Account 密钥](/static/images/tutorial/eas/credentials-01.png)

- 在 **Service Credentials** 下点击 **Add a Google Service Account Key**。

![在 Change Google Service Account Key 下把 Google Service Account 密钥上传到 EAS 仪表板](/static/images/tutorial/eas/credentials-02.png)

- 在 **Change Google Service Account Key** 下，确保选中 **Upload new key**，并上传下载的 JSON 密钥。这会把密钥添加到项目凭据中。

![在 Service Credentials 下把 Google Service Account 密钥上传到 EAS 仪表板](/static/images/tutorial/eas/credentials-03.png)

## 7. 内部发布

在 **eas.json** 中把 track 设为 `internal`。

- 在 `submit.production` profile 下，把 `track` 设为 `internal`：

```json
{
  "submit": {
    "production": {
      "android": {
        // 把 track 设为 internal。
        "track": "internal"
      }
    }
  }
}
```

在上面的片段中，我们添加了 [`track`](/eas/json#track) 属性，并把它的值设为 `internal`。这样 `eas submit` 命令就可以上传我们的生产构建，并在 Google Play Store 上将其发布为内部测试。

- 现在运行 `eas submit` 命令，发布一个新的内部测试版本：

```sh
eas submit --platform android
```

- 这条命令会在 Google Play Console 中自动创建一个新的内部发布版本：

![EAS Submit 在 Google Play Console 中自动创建的内部发布版本](/static/images/tutorial/eas/play-store-18.png)

## 8. 生产发布

要把应用发布到生产环境：

- 在 **eas.json** 中把 `track` 的值改为 `production`：

```json
{
  "submit": {
    "production": {
      "android": {
        // 把 track 改为 production。
        "track": "production"
      }
    }
  }
}
```

- 我们也可以使用内部测试发布时用过的同一次 EAS Build。运行 `eas submit` 命令发布到 Play Store：

```sh
eas submit --platform android
```

- 要创建 track 并把应用提交到 Google Play Store 的审核流程，需要前往 **Test and release** > **Production**，并在 **Releases** 下选择我们想送审的构建。

## 9. 自动发布

对于以后的后续发布，可以用 `eas build` 的 [`--auto-submit`](/build/automate-submissions) 标志，把创建构建和提交到 Play Store 合并为一步，从而简化流程：

```sh
eas build --platform android --auto-submit
```

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
