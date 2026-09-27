---
title: Android 应用链接
description: 了解如何配置 Android 应用链接，让你的 Expo 应用可以通过标准 Web URL 打开。
---

# Android 应用链接

要为你的应用配置 Android 应用链接（Android App Links），你需要：

- 在项目的应用配置中添加 `intentFilters` 属性，并将 `autoVerify` 设为 `true`
- 建立双向关联（two-way association），以验证你的网站和原生应用

[观看视频：使用 Expo Router 设置 Android 应用链接](https://www.youtube.com/watch?v=kNbEEYlFIPs&t=399) —— 配置带 autoVerify 的 intent filter，在网站与应用之间建立双向关联，并验证 Android 应用链接。

## 在应用配置中添加 intentFilters

在应用配置中添加 `android.intentFilters` 属性，并将 `autoVerify` 属性设为 `true`。要正确使用 Android 应用链接，必须指定 `autoVerify`。

下面的示例展示了一个基本配置，它让你的应用出现在标准 Android 对话框中，作为处理指向 `webapp.io` 域名的任意链接的一个选项。由于 [Android 应用链接](/linking/overview#android-app-links)与[标准深层链接](/linking/into-other-apps)不同，该配置使用的是常规的 `https` scheme。

```json app.json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          /* @info 在应用配置的 intent filter 中添加 autoVerify 属性以启用应用链接。*/
          "autoVerify": true,
          /* @end */
          "data": [
            {
              "scheme": "https",
              "host": "*.webapp.io",
              "pathPrefix": "/records"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## 建立双向关联

要在网站和 Android 应用之间建立**双向关联**，你需要以下内容：

- **网站验证**：需要在目标网站的 **/.well-known** 目录下创建 **assetlinks.json** 文件并托管它。该文件用于验证通过某个链接打开的应用确实是正确的应用。
- **原生应用验证**：需要通过某种形式的代码签名来引用目标网站的域名（URL）。

### 创建 assetlinks.json 文件

1. 在 **/.well-known/assetlinks.json** 路径创建用于网站验证的 **assetlinks.json** 文件（也称为[数字资产链接（digital asset links）](https://developers.google.com/digital-asset-links/v1/getting-started)文件）。该文件用于验证针对某个链接所打开的应用。

   如果你使用 Expo Router 构建网站（或 Remix、Next.js 等其他现代 React 框架），请在 **public/.well-known/assetlinks.json** 创建 **assetlinks.json**。对于旧版 Expo webpack 项目，请在 **web/.well-known/assetlinks.json** 创建该文件。

2. 从应用配置的 `android.package` 中获取 `package_name` 的值。

3. 从应用的签名证书中获取 `sha256_cert_fingerprints` 的值。如果你使用 [EAS Build](/build/setup) 构建 Android 应用，在创建构建后：

   - 运行 `eas credentials -p android` 命令，并选择构建 profile 以获取其指纹值。
   - 复制 `SHA256 Fingerprint` 下列出的指纹值。

   <details>
   <summary>从 Google Play Console 获取 SHA256 证书指纹的替代方法</summary>

   如果你不使用 EAS 管理代码签名，可以通过手动构建应用并提交到 [Google Play Console](https://play.google.com/console/) 来找到 **sha256_cert_fingerprints**：

   - 在 Google Play Console 的仪表盘中，进入 **Release > Setup > App Signing**（发布 > 设置 > 应用签名）。
   - 找到适用于你的应用的 **Digital Asset Links JSON** 代码片段。
   - 复制形如 `14:6D:E9:83...` 的值，并将其粘贴到 **public/.well-known/assetlinks.json** 文件的 `sha256_cert_fingerprints` 下。

   </details>

4. 将 `package_name` 和 `sha256_cert_fingerprints` 添加到 **assetlinks.json** 文件中：

   ```json public/.well-known/assetlinks.json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         /* @info 将 com.example 替换为你应用的包名。*/
         "package_name": "com.example",
         /* @end */
         "sha256_cert_fingerprints": [
           // 支持为不同的应用和密钥添加多个指纹
           /* @info 将 14:6D:E9:83... 替换为你应用的 SHA256 证书指纹。*/
           "14:6D:E9:83:51:7F:66:01:84:93:4F:2F:5E:E0:8F:3A:D6:F4:CA:41:1A:CF:45:BF:8D:10:76:76:CD"
           /* @end */
         ]
       }
     }
   ]
   ```

   :::note
   你可以在 `sha256_cert_fingerprints` 数组中添加多个指纹，以支持应用的不同变体。更多信息请参见 [Android 关于如何声明网站关联的文档](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc)。
   :::

### 托管 assetlinks.json 文件

使用你的域名的 Web 服务器托管 **assetlinks.json** 文件。该文件必须以 `application/json` 的 content-type 提供，并且可以通过 HTTPS 连接访问。在浏览器地址栏中输入完整 URL，确认浏览器能够访问该文件。

### 原生应用验证

将应用安装到 Android 设备上，以触发 [Android 应用验证](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc)流程。

应用打开后，参见[处理指向你应用的链接](/linking/into-your-app#handle-urls)，了解如何处理传入链接并向用户展示他们所请求的内容。

## 调试

Expo CLI 让你无需部署网站即可测试 Android 应用链接。利用 [`--tunnel`](/more/expo-cli#tunneling) 功能，你可以把开发服务器转发到一个公开可访问的 HTTPS URL。

1. 设置环境变量 `EXPO_TUNNEL_SUBDOMAIN=my-custom-domain`，其中 `my-custom-domain` 是你在开发期间使用的唯一字符串。这样可以确保开发服务器重启后 tunnel URL 保持一致。

2. 按照[上文所述](#在应用配置中添加-intentfilters)在应用配置中添加 `intentFilters`。把 `host` 值替换为 Ngrok URL：`my-custom-domain.ngrok.io`。

3. 使用 `--tunnel` 标志启动开发服务器：

   ```sh
   npx expo start --tunnel
   yarn expo start --tunnel
   pnpm expo start --tunnel
   bun expo start --tunnel
   ```

4. 在设备上编译开发构建：

   ```sh
   npx expo run:android
   yarn expo run:android
   pnpm expo run:android
   bun expo run:android
   ```

5. 使用下面的 `adb` 命令启动 intent activity 并在你的应用中打开链接，或者在设备的 Web 浏览器中输入自定义域名链接。

   ```sh
   adb shell am start -a android.intent.action.VIEW -c android.intent.category.BROWSABLE -d "https://my-custom-domain.ngrok.io/" <your-package-name>
   ```

## 疑难排查

以下是实施 Android 应用链接时的一些常见疑难排查技巧：

- 确保你的网站通过 HTTPS 提供，且 content-type 为 `application/json`
- [验证 Android 应用链接](https://developer.android.com/training/app-links/verify-android-applinks)
- Android 验证可能需要 20 秒或更长时间才能生效，请务必等待验证完成。
- 如果你更新了 Web 文件，请重新构建原生应用，以触发厂商端（Google）的服务器更新。
