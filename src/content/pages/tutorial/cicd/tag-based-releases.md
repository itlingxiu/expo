---
title: 使用 Git 标签触发生产部署
description: 学习如何在 EAS Workflows 上用 Git 标签触发生产部署。
---

# 使用 Git 标签触发生产部署

向发布分支推送时，每一次提交都会运行生产工作流，包括那些我们从未打算作为发布的提交。

## 学习成果

- 把生产工作流的触发器从 `release/*` 分支切换为匹配 `v*.*.*` 的 Git 标签
- 从 `main` 推送一个标签来切出版本，并在 EAS 仪表板上观看工作流运行
- 把 `v1.0.0-rc.1` 这类预发布标签排除在生产之外，并在单独的工作流中运行候选发布

## 把标签当作发布事件

EAS Workflows 通过带 `tags` 列表的 [`on.push`](/eas/workflows/syntax#onpush) 支持基于标签的触发器。只有当匹配 glob 模式的标签被推送到远程时，工作流才会运行。Git 标签是绑定到特定提交和版本的一次性事件，不同于可以随时间更新的分支。因此标签很适合用来标记发布。

基于标签的发布工作流适合这样的团队：

- 希望 Git 中的版本号与发给应用用户的版本一致
- 直接从 `main` 发布，而不是维护长期存在的发布分支
- 希望按版本清晰审计每一次发布提交

> 示意图对比了两种触发方式：向发布分支推送会在每次提交时运行生产工作流；推送 Git 标签则只在标记某个版本时触发一次。

## 把 production.yml 切换为标签触发器

打开[上一章](/tutorial/cicd/production)中的 **.eas/workflows/production.yml** 工作流，把 `on.push.branches` 触发器替换为 `on.push.tags`。工作流内部的其余内容保持不变。

### 1. 更改触发器

把 `branches` 触发器替换为 `tags` 触发器。`tags` 的 glob 会匹配 `v1.0.0`、`v2.3.7` 和 `v10.0.0-beta.1` 这类标签。

```yaml .eas/workflows/production.yml
name: Deploy to production

on:
  push:
    tags: ['v*.*.*']

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: production
  get_android_build:
    name: Check for existing Android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: production
  get_ios_build:
    name: Check for existing iOS build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: production
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: production
  update_android:
    name: Publish Android update
    needs: [get_android_build]
    if: ${{ needs.get_android_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: android
  update_ios:
    name: Publish iOS update
    needs: [get_ios_build]
    if: ${{ needs.get_ios_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: ios
```

要让标签触发工作流，需要选择一个符合团队流程的模式。常见模式包括：

- `['v*']` 匹配任何以 `v` 开头的标签
- `['v*.*.*']` 匹配严格的三段语义化版本（推荐）

不需要改动其他作业。`fingerprint`、`get-build`、`build` 和 `update` 作业的工作方式完全相同，因为它们针对的是这次提交。

### 2. 提交并推送工作流更改

把对 **production.yml** 的更改提交并推送到 `main`。这不会触发工作流，因为我们已经从分支触发器切换成了标签触发器。

```sh
git add .eas/workflows/production.yml && git commit -m 'Switch production workflow to tag trigger' && git push origin main
```

### 3. 创建一个标签来测试工作流

要运行工作流，需要推送一个与 **production.yml** 中 glob 模式匹配的标签。

在示例项目中做一处 TypeScript/JavaScript 修改，提交它，并推送一个新标签：

```sh
git add . && git commit -m 'Fix welcome copy' && git tag v0.1.0 && git push origin main --tags
```

工作流会在 `v0.1.0` 标签上触发。打开 EAS 仪表板，在 **Workflows** 下可以看到 “Deploy to production” 正在运行，其分支为 `refs/tags/v0.1.0`：

![EAS Workflows 仪表板，展示一次由标签触发的生产工作流运行，包含 Android 和 iOS 的 fingerprint、get-build 和 update 作业。](/static/images/tutorial/cicd/eas-workflows-tag-based-production-run.webp)

由于这是基于标签的发布首次生成指纹的生产运行，Android 和 iOS 都会运行 `build` 作业。之后指向 TypeScript/JavaScript 变更的标签会跳过构建作业，直接进入 `update` 作业。

![EAS Workflows 仪表板，展示 v0.1.0 标签发布中并行的 Android 和 iOS 生产构建作业。](/static/images/tutorial/cicd/eas-workflows-tag-based-build-android-ios.png)

## 用于候选发布的预发布标签

`v*.*.*` 这个 glob 也会匹配 `v1.0.0-rc.1` 这类预发布标签，那样就会把候选发布发给应用用户。要把候选发布排除在生产之外，把它们从生产工作流的触发器中排除：

```yaml .eas/workflows/production.yml
on:
  push:
    tags: ['v*.*.*', '!v*.*.*-rc.*']
```

要在正式发布前演练候选发布，可以创建一个只匹配预发布标签（`tags: ['v*.*.*-rc.*']`）的单独工作流，复用 `fingerprint`、`get-build` 和 `build` 作业，但不包含 `update` 和 `submit` 作业。同一条流水线会运行，但不会有任何内容到达应用用户。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
