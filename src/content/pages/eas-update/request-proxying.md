---
title: 请求代理
description: 通过你自己的服务器代理发往 EAS Update 服务器的请求。
---

# 请求代理

EAS Update 支持请求代理，允许你通过自己的服务器代理发往 EAS Update 服务器的请求。这在多种场景下有用，例如添加自定义请求头、记录请求，或实施额外的安全措施或请求 IP 匿名化。

## 启用请求代理

1. 创建两台用于处理请求的代理服务器：
   - 一台处理更新资源请求（JavaScript bundle、图片等）。
     - 必须把请求转发到 EAS Update 资源服务器 `assets.eascdn.net`。
     - 必须透传全部 URL 内容（路径、查询参数等）。
     - 必须转发所有满足以下条件的请求头：
       - 以 `expo-` 或 `eas-` 开头，或
       - 恰好是 `authorization` 或 `a-im`。
   - 一台处理更新清单请求。
     - 必须把请求转发到 EAS Update 服务器 `u.expo.dev`。
     - 必须透传全部 URL 内容（路径、查询参数等）。
     - 必须透传所有以 `expo-` 或 `eas-` 为前缀的请求头。
2. 在 **eas.json** 配置文件中加入以下字段，把占位符替换为你实际的代理服务器 URL：

   ```json eas.json
   {
     "cli": {
       /* @hide 省略 ... */ /* @end */
       "updateAssetHostOverride": "updates-asset-proxy.example.com",
       "updateManifestHostOverride": "updates-manifest-proxy.example.com"
     }
   }
   ```

3. 运行以下命令以应用更改：

   ```sh
   $ eas update:configure
   ```

4. 发布一次更新以测试代理：

   ```sh
   $ eas update
   ```

5. 在 [EAS Update 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/updates)上进入该更新组，点击某个平台的 "View Metadata" 进行验证。
   - **manifest.json** 应显示被覆盖的 `manifestHostOverride`。
   - 其他资源应显示被覆盖的 `assetHostOverride`。
