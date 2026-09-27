---
title: 在远程与本地来源之间同步凭据
description: 了解如何在远程与本地来源之间同步凭据。
---

# 在远程与本地来源之间同步凭据

如果使用自动管理的凭据，凭据会远程托管在 EAS 服务器上，但你可能遇到需要把凭据拉到本地以运行本地构建的情况。如果使用本地凭据，你也可能想把 **credentials.json** 中指定的凭据上传到 EAS，交由它管理。这两种操作都可以用 `eas credentials` 命令完成。

## 下载凭据

要下载自动管理的凭据，在项目根目录运行 `eas credentials`，选择平台，选择 `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`，然后选择 `"Download credentials from EAS to credentials.json"`。如有需要，再次运行该命令以下载另一个平台的凭据。

Android 凭据可以立即使用，因为项目会从 **credentials.json** 读取凭据。

iOS 凭据在本地设置需要两步。首先把分发证书安装到钥匙串。然后打开项目的 Xcode，进入 “Signing & Capabilities” 部分，导入描述文件并选中它。

## 上传凭据

要把 **credentials.json** 中的凭据上传给 EAS 管理，在项目根目录运行 `eas credentials`，选择平台，选择 `"Credentials.json: Upload/Download credentials between EAS servers and your local json"`，然后选择 `"Upload credentials from credentials.json to EAS"`。如有需要，再次运行该命令以上传另一个平台的凭据。
