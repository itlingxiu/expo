---
title: 开始使用 EAS Workflows
description: 了解如何使用 EAS Workflows 自动化 React Native 的 CI/CD 开发与发布流程。
---

# 开始使用 EAS Workflows

本页带你创建第一个 EAS Workflow：为 Android 模拟器、iOS 模拟器、真机创建应用的开发构建，以及为应用商店创建生产构建。

## 开始使用

- **注册 Expo 账户**

  你需要[注册](https://expo.dev/signup)一个 Expo 账户。

- **创建一个项目**

  你需要用以下命令创建项目：

:::tabs
:::tab npm
```sh
npx create-expo-app@latest
```
:::
:::tab yarn
```sh
yarn create expo-app
```
:::
:::tab pnpm
```sh
pnpm create expo-app
```
:::
:::tab bun
```sh
bun create expo
```
:::
:::

- **安装 EAS CLI**

  你需要安装 EAS CLI 来创建和运行工作流：

  ```sh
  npm install -g eas-cli
  ```

1. 运行以下命令，创建一个为 Android 和 iOS 创建开发构建的工作流：

   ```sh
   eas workflow:create --template build
   ```

   然后按照提示以及出现的 `[Action requested]` 步骤操作。该命令会在 **.eas/workflows/build.yml** 生成一个工作流文件，并设置你的项目以便在 EAS 上构建。

2. 用以下命令运行该工作流：

   ```sh
   eas workflow:run .eas/workflows/build.yml
   ```

   完成后，你可以在项目的[工作流页面](https://expo.dev/accounts/[account]/projects/[projectName]/workflows)上观看工作流运行。

3. 构建完成后，你可以通过网站界面把它们安装到真机上。你也可以运行以下命令，把最新构建安装到 Android 模拟器和 iOS 模拟器上：

   ```sh
   eas build:run -p android --latest
   ```

   ```sh
   eas build:run -p ios -e development-ios-simulator --latest
   ```

   然后启动开发服务器，以便开发构建加载你的应用：

   ```sh
   npx expo start
   ```

## 创建生产构建

当你准备为应用商店构建时，用 `deploy` 模板生成一个发布工作流：

```sh
eas workflow:create --template deploy
```

这会为自动化部署设置你的项目：它配置 EAS Build 和 EAS Update 并设置应用标识符，然后把完整的发布工作流写入 **.eas/workflows/deploy.yml**。

当你运行它时，工作流会对项目做指纹。有原生更改时，它会构建并提交新的生产构建，以便它们准备好提交；当匹配的构建已经存在时，它会发布 OTA 更新，并立即发送给你的用户。

关于所生成工作流的演练，见[部署到生产示例](/eas/workflows/examples/deploy-to-production)。

如果你只需要创建生产构建，为每个平台使用带有 `build` 作业的工作流：

```yaml .eas/workflows/create-production-builds.yml
name: Create Production Builds

jobs:
  build_android:
    type: build # 此作业类型为 Android 创建生产构建
    params:
      platform: android
      profile: production
  build_ios:
    type: build # 此作业类型为 iOS 创建生产构建
    params:
      platform: ios
      profile: production
```

此工作流使用 **eas.json** 中的 `production` profile。生产构建需要应用签名凭据。用以下命令为每个平台设置它们：

```sh
eas credentials:configure-build -p android -e production
```

```sh
eas credentials:configure-build -p ios -e production
```

然后运行该工作流：

```sh
eas workflow:run .eas/workflows/create-production-builds.yml
```

## 更多

### 用 GitHub 事件自动化工作流

你可以通过向 GitHub 仓库推送提交来触发工作流。你可以用以下步骤把 GitHub 仓库关联到 EAS 项目：

- 前往项目的 [GitHub 设置](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)。
- 按照界面安装 GitHub 应用。
- 选择与 Expo 项目匹配的 GitHub 仓库并连接它。

然后把 [`on` 触发器](/eas/workflows/syntax#on)添加到工作流文件。例如，如果你想在提交被推送到 `main` 分支时触发工作流，可以添加以下内容：

```yaml .eas/workflows/create-production-builds.yml
name: Create Production Builds

# 在推送到 main 时触发
on:
  push:
    branches: ['main']

jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    type: build
    params:
      platform: ios
      profile: production
```

### 从 App Store Connect 事件触发工作流

你也可以使用 [`on.app_store_connect`](/eas/workflows/syntax#onapp_store_connect) 从 App Store Connect 事件触发工作流。

在使用 App Store Connect 触发器之前，在 EAS 仪表盘中配置你的 App Store Connect 连接：

- 打开 EAS 仪表盘并选择你的项目。
- 前往 **[Project settings > General > Connections](https://expo.dev/accounts/[account]/projects/[project]/settings)**。
- 连接你的 App Store Connect 应用。

示例工作流：

```yaml .eas/workflows/app-store-connect-events.yml
name: React to App Store Connect events

# 在应用版本进入审核相关状态时触发
on:
  app_store_connect:
    app_version:
      states:
        - ready_for_review
        - waiting_for_review

jobs:
  send_slack_notification:
    type: slack
    environment: production
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: 'App version is ready for review or waiting for review.'
```

该示例从 `SLACK_WEBHOOK_URL` [环境变量](/eas/environment-variables/manage#管理环境变量)读取 webhook URL。在运行工作流之前，在 `production` 环境中[创建它](https://expo.dev/accounts/[account]/settings/environment-variables)。

### VS Code 扩展

下载 [Expo Tools VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)，以便为工作流文件获得说明和自动补全。

> 有反馈或功能请求？请发送电子邮件到 workflows@expo.dev。
