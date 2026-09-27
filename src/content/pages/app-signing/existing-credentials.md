---
title: 使用现有凭据
description: 了解向 EAS Build 提供应用签名凭据的不同方式。
---

# 使用现有凭据

EAS Build 提供两种方式，为构建作业提供应用签名凭据：

1. [自动管理的凭据](/app-signing/managed-credentials)：EAS 可以托管你的应用签名凭据，并与拥有必要权限的队友共享。
2. [本地凭据](/app-signing/local-credentials)：你在项目中创建 **credentials.json** 文件，指向密钥库（Android）和/或描述文件与分发证书（iOS），以及相关密码。该文件在某次构建作业运行时从本地机器上传，并在该构建作业完成后丢弃。

无论选择哪种方式，使用现有凭据的第一步都是在 **credentials.json** 中把它们设置为本地凭据。具体做法见[本地凭据指南中的 credentials.json 一节](/app-signing/local-credentials#credentialsjson)。

配置好 **credentials.json** 之后，可以运行 `eas credentials`，选择平台，然后选择 `"Update credentials on Expo servers with values from credentials.json"`，把它们上传到 EAS 进行托管和管理。详见[同步凭据](/app-signing/syncing-credentials)。
