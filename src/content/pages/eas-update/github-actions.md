---
title: 用于 PR 预览的 GitHub Action
description: 了解如何使用 GitHub Actions 通过 EAS Update 自动发布更新。
---

# 用于 PR 预览的 GitHub Action

GitHub Action 是每当 GitHub 上发生事件时运行的云函数。你可以配置 GitHub Actions，在你或团队成员合并到某个分支（例如 "production"）时自动构建并发布更新。这让部署过程一致且快速，把更多时间留给开发应用。

本指南将带你设置 GitHub Actions，以便在 pull request 上发布预览。

## 在 pull request 上发布预览

另一个常见用例是为每个 pull request 创建新更新。这让你可以在合并代码之前、且不必在本地启动项目的情况下，在设备上测试 pull request 中的更改。下面是每次打开 pull request 时发布更新的步骤：

1. 在项目根目录创建名为 **.github/workflows/preview.yml** 的文件路径。

2. 在 **preview.yml** 中复制并粘贴以下片段：

```yaml preview.yml
name: preview
on: pull_request

jobs:
  update:
    name: EAS Update
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Check for EXPO_TOKEN
        run: |
          if [ -z "${{ secrets.EXPO_TOKEN }}" ]; then
            echo "You must provide an EXPO_TOKEN secret linked to this project's Expo account in this repo's secrets. Learn more: https://docs.expo.dev/eas-update/github-actions"
            exit 1
          fi

      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: yarn

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: yarn install

      - name: Create preview
        uses: expo/expo-github-action/preview@v8
        with:
          command: eas update --auto
```

在上述脚本中：

- 你使用工作流事件 `on`，在每次打开或更新 pull request 时运行。
- 在 `update` 作业中，使用 GitHub Action 的内置缓存设置 Node.js 版本、Expo 的 GitHub Action 和依赖。
- `eas update --auto` 由 [preview 子 action](https://github.com/expo/expo-github-action/tree/main/preview#readme) 运行。它会在 pull request 上添加一条评论，包含关于该更新的基本信息和用于扫描更新的二维码。

> 不要忘记在作业中添加 `permissions` 部分。这使作业能够向 pull request 添加评论。

3. 如果你已经在上一节设置了 `EXPO_TOKEN`，可以跳过此步骤。只需要一个有效的 `EXPO_TOKEN` 来让 GitHub Actions 向你的 Expo 账户进行身份验证。

如果你还没有，需要通过提供 `EXPO_TOKEN` 环境变量，赋予上面脚本运行的权限。

- 前往 [https://expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)。
- 点击 **Create token** 创建新的个人访问令牌。
- 复制生成的令牌。
- 把 "your-username" 和 "your-repo-name" 替换为你的项目信息，前往 https://github.com/your-username/your-repo-name/settings/secrets/actions。
- 在 **Repository secrets** 下，点击 **New repository secret**。
- 创建一个名为 **EXPO_TOKEN** 的密钥，并把复制的访问令牌粘贴为值。

你的 GitHub Action 现在应该已经设置好了。每当开发者创建 pull request 时，此 action 会构建并发布更新，使所有拥有可访问该 EAS 分支的构建的审查者都能使用它。

> 有些仓库或组织可能需要显式启用 GitHub Workflows，并允许第三方 Action。

## 使用 Bun 而不是 Yarn

要使用 [Bun](/guides/using-bun) 作为包管理器而不是 Yarn，对推送时发布更新和 pull request 上的预览都遵循以下步骤：

1. 把 **update.yml** 或 **preview.yml** 中的 `Setup Node` 步骤替换为以下片段：

```yaml update.yml/preview.yml
- name: Setup Bun
  uses: oven-sh/setup-bun@v1
  with:
    bun-version: latest
```

2. 要用 Bun 安装依赖，把 **Install dependencies** 步骤替换为以下片段：

```yaml update.yml/preview.yml
- name: Install dependencies
  run: bun install
```
