---
title: 使用 EAS Workflows 清理 EAS Update 分支
description: 了解如何使用 EAS Workflows，在 GitHub 分支被删除时删除 EAS Update 分支。
---

# 使用 EAS Workflows 清理 EAS Update 分支

你可能会把更新发布到以 GitHub 分支命名的 EAS Update 分支，例如使用 [`eas update --auto`](/eas-update/eas-cli#创建新更新并发布它)、带有 `branch: ${{ github.ref_name }}` 的 [`update` 工作流作业](/eas/workflows/pre-packaged-jobs#update)，或[每个分支上的预览更新](/eas/workflows/examples/publish-preview-update)。这样做时，删除 GitHub 分支会把 EAS Update 分支留在后面。当 Git 分支被删除时，此工作流会清理成为孤儿的 EAS Update 分支。

## 开始使用

- **设置 EAS Update**

  你的项目需要已配置 [EAS Update](/eas-update/introduction)。可以用以下命令设置项目：

  ```sh
  eas update:configure
  ```

- **连接你的 GitHub 仓库**

  你的 EAS 项目必须关联到一个 GitHub 仓库。见[开始使用 EAS Workflows](/eas/workflows/get-started#用-github-事件自动化工作流)。

- **工作流文件位于默认分支**

  把此工作流文件放在仓库的默认分支上。当某个分支被删除时，EAS 从默认分支 HEAD 读取工作流配置，而不是从被删除的 ref。

下面的工作流会删除与被删除的 GitHub 分支同名的 EAS Update 分支：

```yaml .eas/workflows/branch-cleanup.yml
name: Branch cleanup

on:
  ref_delete:
    branches: ['*', '!main']

jobs:
  delete-update-branch:
    type: branch-delete
    params:
      branch_name: ${{ github.ref_name }}
```

## 工作原理

1. 当匹配这些模式的 GitHub 分支被删除时，[`on.ref_delete`](/eas/workflows/syntax#onref_delete) 会运行。上面的示例在除 `main` 之外的所有分支上触发。
2. [`branch-delete`](/eas/workflows/pre-packaged-jobs#branch-delete) 作业删除名为 `${{ github.ref_name }}` 的 EAS Update 分支，该名称与被删除的 Git 分支相同。
3. 使用默认的 `fail_on_missing: false` 时，即使 EAS Update 分支已经被删除或从未存在，作业也会成功。

## 重要说明

- `github.sha` 是默认分支，而不是被删除 ref 的最后一次提交。关于 `ref_delete` 运行的插值细节，见 [`github` 上下文参考](/eas/workflows/syntax#github)。
- 频道映射会阻止删除：如果某个频道指向该 EAS Update 分支，删除会失败，并给出关于频道映射的错误。
- 使用 `on.ref_delete.branches` 中的否定模式（例如 `!main` 或 `!release/**`）保护你永远不想清理的分支。
