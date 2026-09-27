---
title: 提交到应用商店
description: 了解如何把应用上传到 Google Play Store 与 Apple App Store。
---

# 提交到应用商店

## 概览

发布应用就是把签名后的二进制 —— Android 的 **.aab** 或 iOS 的 **.ipa** —— 上传到 Google Play Console 或 App Store Connect，之后由 Google 与 Apple 处理审核、测试轨道与生产发布。

把二进制送进商店有两种方式：**EAS Submit** 或通过商店工具手动上传。文档称 EAS Submit 为"推荐路径"，因为它：

- 在任何操作系统上都能用，包括在 Windows 与 Linux 上提交 iOS
- 与 EAS Build 和 EAS Workflows 集成
- 可以在 CI/CD 服务中运行

手动上传适合不使用 EAS 的人，或者想直接在 Play Console 中完成 Android 应用首次发布的人。

相关视频：[How to quickly publish to the App Store & Play Store with EAS Submit](https://www.youtube.com/watch?v=-KZjr576tuE)

## EAS Submit 的工作方式

### Android（Google Play Store）

EAS Submit 把 **.aab** 上传到 Play Console，并放入所选的轨道（"internal、alpha、beta 或 production"）。对于新应用，默认的 `eas submit` 会在内部测试轨道上创建第一个发布版本，甚至早于商店详情页（store listing）完成。要分发到内部测试之外，需要完成 Play Console 设置并推广该发布。要上传但不发布到任何轨道，在 **eas.json** 中把 `releaseStatus` 设为 `draft`。

### iOS（Apple App Store）

**.ipa** 会上传到 App Store Connect，处理完成后（"通常 10–15 分钟"）出现在 TestFlight 中。TestFlight 构建不会自动发布到 App Store —— 要发布到生产，需要登录 App Store Connect、完成元数据与截图、选择构建，然后提交 App 审核。

## 何时使用 EAS Submit

| 场景 | 推荐 |
| --- | --- |
| 把应用二进制上传到 Google Play Console 与 Apple App Store | ✓ |
| 从 Windows 或 Linux 上传 iOS 应用二进制 | ✓ |
| 避免通过 Play Console、App Store Connect 或 Transporter 手动上传 | ✓ |
| 从 CI 或自动化工作流提交构建 | ✓ |
| 通过 eas.json 配置标准化发布流程 | ✓ |
| 开发过程中的测试 | ✗ |

## 选择提交路径

- **[用 EAS Submit 提交到 Google Play Store](/submit/android)** —— 推荐；一条命令把 Android 构建上传到 Play Console，本地或 CI 均可。
- **[用 EAS Submit 提交到 Apple App Store](/submit/ios)** —— 推荐；在任何操作系统上把 iOS 构建上传到 App Store Connect 与 TestFlight。
- **[手动首次提交 Android 应用](/submit/android-manual)** —— 应用首次发布的 Play Console 分步指南。
- **[用 Xcode 手动提交 iOS 应用](/submit/ios-manual)** —— 在 macOS 上用 Xcode 构建、归档并上传。

相关：[EAS Build](/build/introduction)、[EAS Workflows](/eas/workflows/introduction)、[TestFlight](/submit/testflight)、[eas.json 参考](/eas/json)。

## 面向 AI Agent 的 Expo Skills

安装 [Expo Skills](/skills) 可以让 Agent 学会如何提交与发布应用，通过 **eas-app-stores** 技能 —— 参见 [eas-app-stores](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-app-stores/SKILL.md)，它涵盖用 EAS 构建并提交 iOS 与 Android 应用到 TestFlight、App Store 或 Google Play。

## 常见问题

**可以提交不是用 EAS Build 构建的应用吗？**

可以 —— 任何有效的 `.aab` 或 `.ipa` 都会被接受。对于 EAS Build 构建，运行 `eas submit` 并从列表中选择，或让它默认使用最新构建。对于本地构建，用 `--path` 传入二进制路径：

```sh
eas submit --platform android --path ./my-app.aab

eas submit --platform ios --path ./my-app.ipa
```

二进制必须正确签名 —— Android 需要上传密钥（upload keystore），iOS 需要分发证书与配置文件（provisioning profile）。

**EAS Submit 会处理商店元数据或截图吗？**

不会。它只上传二进制；详情页元数据、截图与发布说明不在其管理范围内。Google Play 的详情页必须在提交前于 Play Console 中配置。对于 Apple，[EAS Metadata](/eas/metadata) 可以自动化应用信息与本地化描述。

**如何知道提交为什么失败？**

打开 EAS 仪表盘中的提交详情页（https://expo.dev/accounts/%5Baccount%5D/projects/%5Bproject%5D/submissions）并阅读日志。留意 "Build Annotations" 气泡（参见[公告](https://expo.dev/changelog/2023-12-01-build-annotations)），它会"直接在日志中高亮常见失败原因与建议的修复方式"。

**可以在 EAS Workflows 或其他 CI/CD 流水线中使用 EAS Submit 吗？**

可以 —— 它可以在 CI 中运行，并与 EAS Workflows 集成，在配置中添加一个 submit 作业：

```yaml
jobs:
  submit_ios_to_store:
    type: submit
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
```

详见 EAS Workflows 的预打包作业。在 CI 中，`--non-interactive` 跳过提示，`--latest` 自动选择最近的构建：

```sh
eas submit --platform android --latest --non-interactive
```

相关链接：[Google Play Console](https://play.google.com/console/about/)、[Apple App Store Connect](https://developer.apple.com/app-store-connect/)、[EAS Workflows 提交作业](/eas/workflows/pre-packaged-jobs)、[eas.json 参考](/eas/json)。
