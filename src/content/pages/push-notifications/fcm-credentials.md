---
title: 使用 FCM V1 获取 Google 服务账号密钥
description: 了解如何创建或使用 Google 服务账号密钥，以便通过 FCM 发送 Android 通知。
---

# 使用 FCM V1 获取 Google 服务账号密钥

## 创建新的 Google 服务账号密钥

以下是在 EAS 中配置新的 Google 服务账号密钥、以便使用 FCM V1 发送 Android 通知的步骤。

1. 在 [Firebase 控制台](https://console.firebase.google.com)中为应用创建一个新的 Firebase 项目。如果应用已经有 Firebase 项目，请继续下一步。

   ![在 Firebase 控制台中创建项目](/static/images/creating-google-service-account/fcm-v1/new-service-account/01-new-firebase-project.png)

2. 在 Firebase 控制台中，打开项目的 **Project settings** > [**Service accounts**](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)。

   ![Firebase 控制台中的服务账号设置标签页](/static/images/creating-google-service-account/fcm-v1/new-service-account/02-manage-service-accounts.webp)

3. 点击 **Generate New Private Key**，然后点击 **Generate Key** 确认。安全地保存包含私钥的 JSON 文件。

   ![在 Firebase 控制台中生成新的私钥](/static/images/creating-google-service-account/fcm-v1/new-service-account/03-generate-key.webp)

4. 把 JSON 文件上传到 EAS，并配置它用于发送 Android 通知。可以使用 EAS CLI 或在 [EAS 仪表盘](https://expo.dev)中完成。

:::tabs
:::tab EAS CLI

- 运行 `eas credentials`
- 选择 `Android` > `production` > `Google Service Account`
- 选择 `Manage your Google Service Account Key for Push Notifications (FCM V1)`
- 选择 `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key`
- 如果你之前把 JSON 文件存放在项目目录中，EAS CLI 会自动检测到该文件并提示你选择它。按 **Y** 继续。

:::note
把 JSON 文件加入版本控制的忽略文件（例如 **.gitignore**），避免把它提交到仓库，因为它包含敏感数据。
:::

:::
:::tab expo.dev

- 在 **Project settings** 下，点击导航菜单中的 [**Credentials**](https://expo.dev/accounts/[account]/projects/[project]/credentials)
- 对于 **Android**，点击 **Add Application Identifier**，或选择一个已有的 **Application identifier**
- 在 **Service Credentials** > **FCM V1 service account key** 下，点击 **Add a service account key**

![expo.dev 上的项目凭据页面](/static/images/creating-google-service-account/fcm-v1/new-service-account/04-upload-credential-1.webp)

- 在 **Upload new key** 下上传 JSON 凭据，然后点击 **Save**

![把服务账号密钥文件保存到项目](/static/images/creating-google-service-account/fcm-v1/new-service-account/04-upload-credential-2.png)

:::
:::

5. 在项目中配置 **google-services.json** 文件。从 Firebase 控制台下载它，并放在项目目录的根目录。

   此文件是把 Android 应用注册到 FCM 所必需的。你可以把它提交到仓库，因为它包含的是 Firebase 项目中面向公众的标识符。

   **注意**：如果 **google-services.json** 已经设置好，可以跳过此步骤。

   ![从 Firebase Cloud 控制台下载 google-services.json](/static/images/creating-google-service-account/fcm-v1/new-service-account/05-setup-google-services-json.png)

   在 **app.json** 中添加 [`expo.android.googleServicesFile`](/versions/latest/config/app#googleservicesfile)，其值为 **google-services.json** 的路径。

   ```json app.json
   {
     "expo": {
     /* @hide 省略 ... */ /* @end */
     "android": {
       /* @hide 省略 ... */ /* @end */
       "googleServicesFile": "./path/to/google-services.json"
     }
   }
   ```

   :::warning
   如果 **google-services.json** 中的 API 密钥（`client.api_key.current_key` 字段）受到限制，请在 [Google Cloud 控制台](https://console.cloud.google.com/apis/credentials)中检查它。在 **API restrictions** 下，允许 **FCM Registration API** 和 **Firebase Installations API**，或者不限制该密钥。在 **Application restrictions** 下，使用 Google Play 控制台中 **Release** > **Setup** > **App Integrity** > **App signing key certificate** 的 SHA-1，而不是你的[上传密钥](/app-signing/app-credentials#google-play-应用签名)。不匹配会导致 Firebase Installations API 返回 `403 PERMISSION_DENIED: Requests from this Android client application are blocked`，应用永远收不到推送令牌。
   :::

6. 全部完成！现在可以通过 Expo 推送通知，使用 FCM V1 协议向 Android 设备发送通知。

   ![服务账号密钥已成功上传](/static/images/creating-google-service-account/fcm-v1/new-service-account/06-upload-credential-complete.png)

## 使用现有的 Google 服务账号密钥

1. 在 Google Cloud 控制台中打开 [IAM 管理页面](https://console.cloud.google.com/iam-admin/iam?authuser=0)。在 Permissions 标签页中，找到你打算修改的 **Principal**，点击铅笔图标进行 **Edit Principal**。

   ![在 Google Cloud 控制台的 IAM 管理页面中编辑主体](/static/images/creating-google-service-account/fcm-v1/existing-service-account/01-iam-admin-page.webp)

2. 点击 **Add Role**，从下拉列表中选择 **Firebase Cloud Messaging API Admin** 角色。点击 **Save**。

   ![分配角色](/static/images/creating-google-service-account/fcm-v1/existing-service-account/02-add-role-1.webp)

   ![选择 Firebase Messaging API Admin 角色](/static/images/creating-google-service-account/fcm-v1/existing-service-account/02-add-role-2.webp)

   ![保存角色分配](/static/images/creating-google-service-account/fcm-v1/existing-service-account/02-add-role-3.webp)

3. 你必须向 EAS 指定使用哪个 JSON 凭据文件来发送 FCM V1 通知，可以通过 EAS CLI 或在 [EAS 仪表盘](https://expo.dev)中完成。你可以上传新的 JSON 文件，或选择之前上传的文件。

:::tabs
:::tab EAS CLI

- 运行 `eas credentials`
- 选择 `Android` > `production` > `Google Service Account`
- 选择 `Manage your Google Service Account Key for Push Notifications (FCM V1)`
- 选择 `Set up a Google Service Account Key for Push Notifications (FCM V1)` > `Upload a new service account key`
- EAS CLI 会自动检测本地机器上的文件并提示你选择它。按 **Y** 继续。

:::note
把 JSON 文件加入版本控制的忽略文件（例如 **.gitignore**），避免把它提交到仓库，因为它包含敏感数据。
:::

:::
:::tab expo.dev

- 在 **Project settings** 下，点击导航菜单中的 [**Credentials**](https://expo.dev/accounts/[account]/projects/[project]/credentials)
- 对于 **Android**，点击 **Add Application Identifier**，或选择一个已有的 **Application identifier**
- 在 **Service Credentials** > **FCM V1 service account key** 下，点击 **Add a service account key**

![expo.dev 上的项目凭据页面](/static/images/creating-google-service-account/fcm-v1/new-service-account/04-upload-credential-1.webp)

- 在 **Upload new key** 下上传 JSON 凭据，然后点击 **Save**

![把服务账号密钥文件保存到项目](/static/images/creating-google-service-account/fcm-v1/new-service-account/04-upload-credential-2.png)

:::
:::

4. 在项目中配置 **google-services.json** 文件。从 Firebase 控制台下载它，并放在项目目录的根目录。

   此文件是把 Android 应用注册到 FCM 所必需的。你可以把它提交到仓库，因为它包含的是 Firebase 项目中面向公众的标识符。

   **注意**：如果 **google-services.json** 已经设置好，可以跳过此步骤。

   ![从 Firebase Cloud 控制台下载 google-services.json](/static/images/creating-google-service-account/fcm-v1/existing-service-account/04-setup-google-services-json.png)

   在 **app.json** 中添加 [`expo.android.googleServicesFile`](/versions/latest/config/app#googleservicesfile)，其值为 **google-services.json** 的路径。

   ```json app.json
   {
     "expo": {
       /* @hide 省略 ... */ /* @end */
       "android": {
         /* @hide 省略 ... */ /* @end */ "googleServicesFile": "./path/to/google-services.json"
       }
     }
   }
   ```

5. 全部完成！现在可以通过 Expo 推送通知，使用 FCM V1 协议向 Android 设备发送通知。

   ![服务账号密钥已成功上传](/static/images/creating-google-service-account/fcm-v1/new-service-account/06-upload-credential-complete.png)
