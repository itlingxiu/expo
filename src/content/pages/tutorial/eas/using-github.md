---
title: 从 GitHub 仓库触发构建
description: 了解从 GitHub 仓库触发构建的过程。
---

# 从 GitHub 仓库触发构建

[Expo GitHub App](/build/building-from-github) 会用 EAS 自动从我们的 GitHub 项目触发构建。我们可以根据开发团队的偏好，为任何构建 profile 触发构建。它也允许对直接提交到仓库的 `git` push，或对拉取请求触发构建。

在本章中，我们将配置这项功能。示例应用已经有一个 GitHub 仓库，用来演示这一点。

[观看视频：如何从 GitHub 仓库触发构建](https://www.youtube.com/watch?v=fBLFEFC0ip0) —— 把 Expo GitHub App 连接到你的仓库，并配置它在推送或拉取请求时触发 EAS 构建。

---

## 1. 配置 Expo GitHub 应用

要使用这项功能，需要连接我们的 GitHub 账户：

- 在 EAS 仪表板中前往 [expo.dev/settings](https://expo.dev/settings#connections)，在 **Connections** > **GitHub** 下点击 **Connect**。这会打开 **Connect GitHub** 账户页面。
- 点击 **Get started** 按钮，会弹出窗口以授权 Expo GitHub 应用。点击 **Install and Authorize**。
- 应用安装到我们的 GitHub 账户后，需要把它关联到 Expo 账户。在下一个弹窗中点击 **Link installation**。
- 账户关联后，它会显示在 **GitHub** 下。

![EAS 仪表板中显示已关联的 GitHub 账户](/static/images/tutorial/eas/github-01.png)

## 2. 连接 GitHub 仓库

要从 GitHub 仓库触发构建，需要在 EAS 仪表板中把它连接到我们的项目：

- 在 EAS 仪表板中，前往 **Projects** > 选择你的项目 > **Project settings** > **GitHub**。
- 在 **Connect a GitHub repository** 下，会看到我们的 GitHub 仓库列表。需要连接正确的那一个。在示例中，我们搜索的是仓库 **sticker-smash.**
- 为项目仓库点击 **Connect**。

![可连接到 EAS 仪表板中项目的 GitHub 仓库列表](/static/images/tutorial/eas/github-02.png)

## 3. 使用默认的仓库设置

Expo GitHub 应用需要知道到哪里找项目的源代码。默认情况下，它用 `/` 选择根目录。在我们的示例项目中，源代码也在仓库根目录。可以在 EAS 仪表板中保持这个默认值。

## 4. 用 GitHub PR 的 label 触发构建

Expo GitHub 应用提供[多种方式](/build/building-from-github#trigger-a-build-from-github)来触发构建，例如：

- 在 Builds 页面上针对特定平台手动触发
- 当新代码被推送到仓库时自动触发
- 使用 GitHub PR 的 label 自动触发

要用 GitHub PR 的 label 自动触发构建，我们将使用上面列表中的第三种方式：

- 需要指定将要使用的构建镜像。打开 **eas.json**，在 `development` profile 下添加 [`android.image`](/eas/json#image) 和 [`ios.image`](/eas/json#image-1) 属性，并把它们的值设为 [`latest`](/build-reference/infrastructure#configuring-build-environment)。

  ```json eas.json
  {
    "build": {
      "development": {
        "android": {
          "image": "latest"
        },
        "ios": {
          "image": "latest"
        }
      }
    }
  }
  ```

- 接下来，创建一个名为 `dev` 的新分支，并修改应用的 JavaScript 代码。然后提交更改、推送该分支，并从该分支创建一个 PR。
- 在 PR 链接中，于 **Labels** 下创建一个名为 `eas-build-all:development` 的 label。

![在 GitHub PR 中创建 label](/static/images/tutorial/eas/github-04.png)

- 点击 **Create pull request** 按钮创建 PR。Expo GitHub 应用会开始创建开发构建的过程。

- 在 EAS 仪表板的 **Builds** 页面上，可以验证 Android 和 iOS 的构建都已触发。

![EAS 仪表板中为 Android 和 iOS 平台触发的构建](/static/images/tutorial/eas/github-06.png)

- 如果查看某一次构建的详情，可以在 **Created by** 下看到该构建是由 GitHub 应用创建的。

![EAS 仪表板中单次构建的详情](/static/images/tutorial/eas/github-07.png)

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
