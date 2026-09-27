---
title: 用 Expo GitHub App 触发构建
description: 了解如何使用 Expo GitHub App 为应用在 EAS 上触发构建。
---

# 用 Expo GitHub App 触发构建

本指南说明如何使用 Expo GitHub App，直接从 GitHub 仓库触发构建。

**前置条件**

- **在 eas.json 中设置 image 字段**：对于你想与 GitHub 一起使用的构建 profile，在 **eas.json** 中为原生平台指定要使用的 [`image`](/eas/json#image)。如果项目配置不依赖特定的[构建镜像](/build-reference/infrastructure)，请使用 `latest` 镜像。例如：

  ```json eas.json
  {
    "build": {
      "production": {
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

- **本地机器上一次成功的构建**：要从 GitHub 仓库触发 EAS 构建，你需要为 EAS Build 配置项目，并针对希望在 GitHub 上支持的每个平台，从电脑成功运行一次构建。如果你还没有成功运行 `eas build -p [all|ios|android]`，更多信息参见[创建你的第一次构建](/build/setup)。
- **已关联的 GitHub 账户和应用权限**：
  - 组织中的一名 Expo 用户必须有已关联的 GitHub 用户，且该用户能访问目标仓库。检查 **Account settings** > **Overview** > **User settings** > [**Connections**](https://expo.dev/settings#connections)，确认你的 GitHub 用户账户已关联。
  - 你必须接受 [Expo GitHub app](https://github.com/settings/installations) 请求的权限。

## 为 GitHub 配置应用

### 把 GitHub 仓库关联到 Expo 项目

访问项目的 [GitHub 设置](https://expo.dev/accounts/[account]/projects/[projectName]/github)。

![项目的 GitHub 设置页面](/static/images/eas-build/build-from-github/project-github-page.webp)

在你的 GitHub 账户上安装 Expo GitHub App。

:::note
你必须拥有该 Expo 账户的 [Owner 或 Admin 访问权限](/accounts/account-types#manage-access)才能安装该应用。
:::

![GitHub 应用安装界面](/static/images/eas-build/build-from-github/install-github-app.png)

然后把 GitHub 仓库关联到你的 Expo 项目。

:::note
你只能把 [GitHub 组织仓库](https://docs.github.com/en/organizations)关联到 Expo 组织。
:::

![Expo 项目 GitHub 设置页面上的仓库选择器](/static/images/eas-build/build-from-github/connect-a-repository.png)

要从另一个 GitHub 账户添加仓库，在账户选择器下拉菜单中点击 **Add new account** 选项。

![Expo 项目 GitHub 设置页面上的账户选择器](/static/images/eas-build/build-from-github/add-new-account.png)

### 配置仓库设置

运行构建之前，Expo GitHub App 需要知道去哪里找项目的源代码。如果 Expo 项目源代码在仓库根目录，你不需要做任何事。如果 Expo 项目源代码在子目录中，你需要在项目的 [GitHub 设置页面](https://expo.dev/accounts/[account]/projects/[projectName]/github)上为仓库配置 “Base directory” 设置。

![Expo 项目 GitHub 设置页面上的基目录输入框](/static/images/eas-build/build-from-github/specify-base-directory.png)

## 从 GitHub 触发构建

为 GitHub 配置好应用之后，你可以通过项目构建列表页上的界面，或通过 GitHub PR 上的标签，从 GitHub 触发构建。

### 使用 Expo 网站构建

访问项目的[构建列表页面](https://expo.dev/accounts/[account]/projects/[projectName]/builds)，点击 “Build from GitHub” 按钮。系统会提示你选择 Git ref（分支/提交/标签）、要构建的平台，以及要应用的构建 profile。

你也可以为这次特定构建指定基目录。这不会改变该项目的全局设置。

![Expo 项目构建列表页面上的从 GitHub 构建界面](/static/images/eas-build/build-from-github/github-build-ui.png)

### 使用 GitHub PR 标签构建

你可以通过给 GitHub PR 添加标签来触发构建。标签的形式必须是 `eas-build-[platform]:[profile]`，其中 `[platform]` 是 `android`、`ios` 或 `all`，`[profile]` 是 **eas.json** 文件中指定的构建 profile 名称。如果你不指定构建平台，默认为 `all`。如果你不指定构建 profile，默认为 `production`。

例如，如果你想为 Android 触发生产构建，给 PR 添加标签 `eas-build-android`。

![带有 eas-build 标签和实时状态检查的 PR](/static/images/eas-build/build-from-github/eas-build-label.png)

构建会针对 PR 基分支上的最新提交触发。你可以在 PR 的检查中查看构建状态。检查详情中会有构建链接。

![GitHub PR 上的 EAS Build 检查详情](/static/images/eas-build/build-from-github/gh-check-details.png)

### 代码推送到 GitHub 仓库时自动构建

你可以把构建自动化再进一步：把代码推送到 GitHub 时自动构建 Expo 项目。

#### 使用 EAS Workflows

EAS Workflows 是 Expo 的一项服务，允许你在 EAS 上运行构建以及许多其他类型的作业。你可以用 EAS Workflows 自动化开发和发布流程，例如创建开发构建，或自动构建并提交到应用商店。

要用 EAS Workflows 创建构建，先在 **.eas/workflows/build.yml** 中加入以下代码：

```yaml .eas/workflows/build.yml
name: Build

on:
  push:
    branches:
      - main

jobs:
  build_android:
    name: Build Android App
    type: build
    params:
      platform: android
  build_ios:
    name: Build iOS App
    type: build
    params:
      platform: ios
```

当提交被推送到 main 分支时，此工作流会创建 Android 和 iOS 构建。你可以在 [EAS Workflows 文档](/eas/workflows/get-started)中了解如何修改此工作流，以及如何编排其他类型的作业。

#### 设置构建触发器

:::warning
**[已弃用](/more/release-statuses#deprecated)：** 此功能已弃用，并对新项目禁用。建议改用 [EAS Workflows](/eas/workflows/get-started)。
:::

<details>
<summary>了解如何设置构建触发器</summary>

你可以设置构建触发器，配置 EAS 何时从 GitHub 构建应用。我们允许你在推送到分支、拉取请求和 Git 标签时构建。

在仪表盘中打开你的 Expo 项目。要创建构建触发器，滚动到项目 GitHub 设置页面的 **Build triggers** 部分，点击 **New Build Trigger**。

![Expo 项目 GitHub 设置页面上的构建触发器部分](/static/images/eas-build/build-from-github/empty-build-triggers-table.png)

点击 **New Build Trigger** 后，你会看到一个表单，用来配置这次构建应如何运行。

这些模式可以包含用星号（`*`）表示的通配符，它可以匹配模式中的任意字符和任意数量的字符。例如，`releases/*` 可以匹配 `releases/`、`release/1234`、`release/genesis` 等。如果你把模式指定为单独的星号（`*`），所有分支/标签都会匹配。

![新建构建触发表单的默认状态](/static/images/eas-build/build-from-github/empty-build-trigger-form.webp)

你也可以为特定平台和构建 profile 配置触发器。如果你选择多个平台，会为每个平台分别创建一个触发器。

![已填写的新建构建触发表单](/static/images/eas-build/build-from-github/filled-build-trigger-form.webp)

![填有构建触发器的 Expo 项目 GitHub 设置页面上的构建触发器部分](/static/images/eas-build/build-from-github/filled-build-triggers-table.png)

推送到分支或标签时，你可以查看某次提交的 **Checks** 部分来找到这些构建。

![分支提交上的 GitHub 检查部分](/static/images/eas-build/build-from-github/builds-executed-automatically-on-branch.png)

![标签提交上的 GitHub 检查部分](/static/images/eas-build/build-from-github/tag-triggered-build.webp)

对于拉取请求，你可以配置 **target branch pattern**。这是你想构建的拉取请求的目标分支。通配符规则同样适用。

![拉取请求的构建触发表单](/static/images/eas-build/build-from-github/pull-request-trigger-form.webp)

当你推送到源分支和目标分支都匹配此触发器的拉取请求时，会在拉取请求的检查部分找到这些构建：

![拉取请求上的 GitHub 检查部分](/static/images/eas-build/build-from-github/pull-request-triggered-build.png)

:::note
要从拉取请求触发构建，拉取请求的作者必须是 GitHub 仓库的协作者。如果你想构建来自外部贡献者的拉取请求，请[应用 PR 标签](#使用-github-pr-标签构建)。
:::

#### 管理构建触发器

在 EAS 仪表盘的项目 GitHub 设置页面上，你可以点击构建触发器行右侧的选项按钮，以禁用、编辑或删除该触发器。

![构建触发器行上的选项按钮](/static/images/eas-build/build-from-github/edit-trigger-option.webp)

你也可以用触发器中的参数手动运行一次 GitHub 构建。这不会计入自动构建触发记录。

#### 用 EAS Submit 自动提交到应用商店

构建完成后，你可以用 EAS Submit 自动把应用提交到应用商店。此功能简化流程，减少发布应用所需的手动步骤。

要启用自动提交，你需要把构建触发器配置为把提交作为构建过程的一部分。设置方法如下：

- 在 EAS 仪表盘上进入项目的 GitHub 设置页面。
- 找到你想修改的构建触发器，点击选项按钮。
- 选择 **Edit trigger**，在出现的对话框中勾选 **Submit to store after build**。

![触发器编辑表单上的 EAS Submit 表单字段](/static/images/eas-build/build-from-github/eas-submit-form-fields.png)

- 保存更改。

![已启用自动提交的已启用构建触发器](/static/images/eas-build/build-from-github/auto-submit-trigger-column.png)

启用后，每次由此配置触发构建时，它都会自动提交到你在 **eas.json** 的 `submit` 字段中配置的应用商店。

:::note
确保 **eas.json** 已正确配置提交，包括指定正确的应用商店凭据和提交 profile。更多信息参见 [EAS Submit](/submit/eas-json)。
:::

</details>

### 故障排除

- 出问题时，我们会在尝试构建的提交上评论一些错误信息。
- 尝试构建时，请再次确认[前置条件](#前置条件)一节中的每一项都成立。
- 如果你使用 Monorepo 设置，确认基目录准确。
- 构建 profile 正确吗？如果在 **eas.json** 中找不到匹配的 profile，构建不会被派发。
