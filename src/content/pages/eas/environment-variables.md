---
title: EAS 中的环境变量
description: 概述如何在构建、更新和工作流中使用 Expo Application Services（EAS）环境变量。
---

# EAS 中的环境变量

本指南介绍如何在 Expo Application Services（EAS）中使用环境变量：Build、Updates、Workflows 和 Hosting。有关环境变量在 Expo 框架中工作原理的通用信息，请参阅 [Expo 中的环境变量](/guides/environment-variables)。

在本地开发期间，环境变量从本地的 **.env** 或 **.env.local** 文件加载。这些文件通常被排除在项目版本控制之外（即列在 **.gitignore** 文件中或未提交），因此在远程服务器上运行的作业（例如 EAS Build 和 EAS Workflows）无法使用它们。此外，大多数项目有多个应用变体，需要多组环境变量（例如 Development 和 Production）。

## 为什么使用 EAS 环境变量

如果你需要以下功能，可能会想使用 EAS 环境变量：

- 在云构建、更新和工作流中集中管理配置，无需提交 **.env** 文件。
- 按环境（`development`、`preview`、`production`）区分值，同时复用变量名。
- 控制可见性（明文、敏感、密钥），让只有合适的场合才能读取每个值。
- 通过 [`eas env:pull`](/eas/environment-variables/manage#拉取变量用于本地开发) 在本地或在 CI/CD 中应用同一组变量。

这些正是 EAS 环境变量要解决的问题。使用 EAS 环境变量时，变量通过 EAS CLI 或直接在 [expo.dev](https://expo.dev) 仪表盘中配置，EAS Build、EAS Workflows 以及你的本地机器都可以通过 EAS CLI 访问它们。

## 快速开始

1. 要创建新的环境变量，请在项目目录中使用 EAS CLI 运行以下命令。下面的命令为 `production` 环境创建一个名为 `EXPO_PUBLIC_API_URL`、值为 `https://api.example.com` 的环境变量。

   ```sh
   eas env:set --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment production --visibility plaintext
   ```

2. 在项目设置中的 [Environment variables](https://expo.dev/accounts/[account]/projects/[project]/environment-variables) 页面确认该环境变量带有 **production** 徽章，以验证其创建成功。环境变量也可以直接在 [expo.dev](https://expo.dev) 上管理。

3. 要在 EAS Build 中使用该环境变量，请在 `production` 构建 profile 中添加 `environment` 字段：

   ```json eas.json
   {
     "build": {
       "production": {
         "environment": "production"
       }
     }
   }
   ```

   现在，为 `production` 构建 profile 创建的任何环境变量都会在构建过程中可用。

4. 要在 EAS Update 中使用该环境变量，运行 `eas update` 命令并指定 `--environment` 标志：

   ```sh
   eas update --environment production
   ```

   `--environment` 标志用于指定更新作业使用的环境。更新过程中只会使用指定环境中的环境变量。

5. 要在 EAS Hosting 中使用该环境变量，运行 `eas deploy` 命令并指定 `--environment` 标志。如果你同时需要客户端和服务端环境变量，请按以下顺序运行命令（客户端变量必须是明文或敏感类型，不能是密钥类型），更多信息请参阅 [客户端环境变量](/eas/environment-variables/usage#客户端环境变量)。

   ```sh
   eas env:pull --environment production
   npx expo export --platform web
   eas deploy --environment production
   ```

   `--environment` 标志用于指定部署作业使用的环境。部署过程中只会使用指定环境中的环境变量。

## 关键概念

### 可用环境

默认情况下，EAS 为环境变量支持三种环境：`development`、`preview` 和 `production`。自定义环境名称在 Enterprise 和 Production 计划中可用。

每个环境都是一组独立的变量，可用于在不同上下文中定制你的应用。例如，你可以为开发和生产使用不同的 API 密钥，或为应用商店发布使用不同的 bundle identifier。

每个 EAS Build 和 Workflows 作业都使用其中一个可用环境的环境变量运行。你也可以为更新指定环境，从而为构建作业使用同一组环境变量。发布更新时，用必需的 `--environment` 标志指定环境。

环境变量可以分配给多个环境并在所有环境中使用相同的值，也可以只为单个环境创建。

### 作用域

- **项目级**：仅针对单个 EAS 项目。你可以在项目仪表盘的 [Environment variables](https://expo.dev/accounts/[account]/projects/[project]/environment-variables) 页面创建、查看和管理它们。这些环境变量在该项目的任何 EAS 服务器作业和更新中都可用。如果其可见性设置允许，也可以拉到本地用于开发。
- **账户级**：在 EAS 账户的所有项目中可用。你可以在账户仪表盘的 [Environment variables](https://expo.dev/accounts/[account]/settings/environment-variables) 页面创建、查看和管理它们。这些环境变量与项目的项目级变量一起，在 EAS 服务器作业和更新中可用。如果其[可见性设置](#环境变量的可见性设置)允许，你可以将它们拉到本地或在 EAS 服务器之外读取。

### 变量类型

- **字符串**：标准键值对，可用于构建、更新、工作流和托管。
- **文件**：以文件形式上传的值（例如 `google-services.json` 或证书），在构建运行器上以文件路径的形式提供给作业使用。

## 环境变量的可见性设置

每个环境变量都有三种不同的可见性设置：

| 可见性 | 描述 |
| --- | --- |
| 明文 | 在网站、EAS CLI 和日志中可见。 |
| 敏感 | 在 EAS Build 和 Workflows 作业日志中会被混淆。你可以通过开关让它们在网站上可见。它们在 EAS CLI 中也可读。 |
| 密钥 | 在 EAS 服务器之外不可读，包括网站和 EAS CLI。在 EAS Build 和 Workflows 作业日志中会被混淆。 |

:::warning
请注意，**任何包含在客户端代码中的内容都应视为公开的，任何能够运行你的应用的人都可以读取**。
:::

:::warning
**密钥类型的环境变量**旨在为 EAS Build 或 Workflows 作业提供值，以便用于改变作业的运行方式。例如，设置 `NPM_TOKEN` 从 npm 安装私有包。密钥不会为最终嵌入应用本身的值提供任何额外的安全性。
:::

## 接下来去哪里

- [在 EAS 中创建和管理环境变量](/eas/environment-variables/manage)：了解如何使用 EAS 仪表盘和 EAS CLI 创建、设置作用域和使用环境变量。
- [在 EAS 中使用环境变量](/eas/environment-variables/usage)：了解如何在 EAS 构建、更新、托管和工作流作业中使用环境变量。
- [不使用 EAS 管理环境变量](/eas/environment-variables/without-eas)：了解在 Expo 和 React Native 项目中管理环境变量的非 EAS 方式。
- [常见问题](/eas/environment-variables/faq)：关于 EAS 环境变量的常见问题。
