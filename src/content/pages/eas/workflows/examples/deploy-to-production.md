---
title: 使用 EAS Workflows 部署到生产
description: 了解如何使用 EAS Workflows 部署到生产。
---

# 使用 EAS Workflows 部署到生产

当你准备把更改交付给用户时，可以构建并提交到应用商店，也可以发送 OTA 更新。下面的工作流会检测你是否需要新构建，如果需要，就把它们发送到应用商店。如果不需要新构建，它会发送 OTA 更新。

![展示部署到生产工作流的图。](/static/images/eas-workflows/deploy-to-production.png)

> 视频：[Expo 黄金工作流：用自动化工作流把应用部署到生产](https://www.youtube.com/watch?v=o-peODF6E2o)。用 EAS Workflows 自动化生产发布：在需要时构建并提交到应用商店，在不需要新构建时发送更新。

## 开始使用

- **设置 EAS Build**

  要设置 EAS Build，请遵循本指南：

  - [EAS Build 前置条件](/build/setup)：让项目为 EAS Build 做好准备。

- **设置 EAS Submit**

  要设置 EAS Submit，请遵循 Google Play 商店和 Apple App Store 提交指南：

  - [Google Play 商店 CI/CD 提交指南](/submit/android#用-eas-workflows-自动化)：让项目为 Google Play 商店提交做好准备。
  - [Apple App Store CI/CD 提交指南](/submit/ios#用-eas-workflows-自动化)：让项目为 Apple App Store 提交做好准备。

- **设置 EAS Update**

  最后，你需要设置 EAS Update，可以用以下命令完成：

  ```sh
  eas update:configure
  ```

下面的工作流在每次推送到 `main` 分支时运行，并执行以下操作：

- 使用 [Expo Fingerprint](/versions/latest/sdk/fingerprint) 对项目的原生特征取哈希。
- 检查该指纹是否已有构建。
- 如果构建不存在，它会构建项目并提交到应用商店。
- 如果构建存在，它会发送 OTA 更新。

```yaml .eas/workflows/deploy-to-production.yml
name: Deploy to production

on:
  push:
    branches: ['main']

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: production
  get_android_build:
    name: Check for existing android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: production
  get_ios_build:
    name: Check for existing ios build
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
  submit_android_build:
    name: Submit Android Build
    needs: [build_android]
    type: submit
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
  submit_ios_build:
    name: Submit iOS Build
    needs: [build_ios]
    type: submit
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
  publish_android_update:
    name: Publish Android update
    needs: [get_android_build]
    if: ${{ needs.get_android_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: android
  publish_ios_update:
    name: Publish iOS update
    needs: [get_ios_build]
    if: ${{ needs.get_ios_build.outputs.build_id }}
    type: update
    params:
      branch: production
      platform: ios
```
