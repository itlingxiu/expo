---
title: 自动提交
description: 了解如何用 EAS Build 启用自动提交。
---

# 自动提交

许多移动端部署流程最终会演进到：一旦合适的构建完成，应用就自动提交到相应商店。这样开发者不必守着构建完成，也能省去一些手工操作，并且不必再协调向团队提供应用商店凭据。

EAS Build 通过 `--auto-submit` 标志开箱即用地提供自动提交。该标志告诉 EAS Build：构建完成后，把构建连同合适的提交 profile 交给 EAS Submit。关于如何设置和配置提交，参见 [EAS Submit 文档](/deploy/submit-to-app-stores)。

运行 `eas build --auto-submit` 时，你会得到一个提交详情页链接，可以在那里跟踪提交进度。你也可以随时在[项目的提交仪表盘](https://expo.dev/accounts/[account]/projects/[project]/submissions)找到该页面，并且构建详情页也会链到它。

## 选择提交 profile

默认情况下，`--auto-submit` 会尝试使用与所选构建 profile 同名的提交 profile。如果不存在，或者你想使用不同的 profile，可以改用 `--auto-submit-with-profile=<profile-name>`。

## 构建 profile 的环境变量与提交

运行 `eas build --profile <profile-name> --auto-submit` 时，项目的 **app.config.js** 会使用与构建 profile `<profile-name>` 关联的环境变量进行求值。例如，假设我们用下面的配置运行 `eas build -p ios --profile production --auto-submit`：

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    },
    "development": {
      "env": {
        "APP_ENV": "development"
      }
    }
  }
}
```

```js app.config.js
export default () => {
  return {
    name: process.env.APP_ENV === 'production' ? 'My App' : 'My App (DEV)',
    ios: {
      bundleIdentifier: process.env.APP_ENV === 'production' ? 'com.my.app' : 'com.my.app-dev',
    },
    // ... 此处为其他配置
  };
};
```

求值用于提交的 **app.config.js** 时会使用 `production` profile 中的 `APP_ENV` 变量，因此名称将是 `My App`，bundle identifier 将是 `com.my.app`。

## 应用商店的默认提交行为

默认情况下，`--auto-submit` 标志会让构建可用于内部测试，但不会自动把应用提交审核以进行公开发布。下面各节描述 Android 和 iOS 的默认提交行为。

### Android 提交

对于 Android，如果没有提供足够的元数据，默认行为是为新应用创建内部发布。要控制构建提交到何处以及如何提交，可以在 **eas.json** 提交 profile 中指定 `releaseStatus` 和 `track` 字段：

**发布状态选项：**

- `draft`：创建草稿发布，需要在 Google Play Console 中手动推广
- `completed`：立即向指定轨道上的用户发布
- `inProgress`：分阶段发布（与 `rollout` 百分比一起使用）
- `halted`：已暂停的发布

当你在 **eas.json** 的提交 profile 中显式设置轨道时，`--auto-submit` 标志会把构建提交到所选轨道。这还要求把 `releaseStatus` 设为 `completed`：

**轨道选项：**

- `internal`：内部测试轨道（最多 100 名测试人员）（默认）
- `alpha`：封闭测试轨道
- `beta`：公开测试轨道
- `production`：生产轨道（公开发布）

### iOS 提交

对于 iOS，默认提交行为是把构建提交到 TestFlight，但不提交 App Store 审核。这意味着：

- 构建会提交到 TestFlight，并可用于内部测试。
- 如果你在 App Store Connect 中打开了 “Enable automatic distribution”，TestFlight 会自动创建一个组，并邀请所有内部 TestFlight 用户测试该构建。
- 你也可以在 **eas.json** 提交 profile 中用 [`groups`](/eas/json#groups) 字段指定额外的 TestFlight 组。
- 使用 [TestFlight](/submit/testflight)，你可以发布一个可供内部和外部测试的应用版本。TestFlight 允许在内部与最多 100 名测试人员分享，并提供公开链接与最多 10,000 名外部测试人员分享。
- 提交到 Apple App Store 审核是手动过程。一旦提交到 TestFlight，你必须手动把构建推广到 App Store。

这一行为确保在使用 `--auto-submit` 时，所有 iOS 发布都经过 TestFlight，让你可以在决定向公众开放之前先测试该发布。

### 修改 App Store 列表页（仅 iOS）

单独使用时，EAS Submit 不会更新商店元数据（应用描述、Apple 咨询信息、语言等）。不过，一旦你用 EAS Submit 以新版本号把构建上传到 TestFlight，就可以用 EAS Metadata 更新这些信息。

- [EAS Metadata](/eas/metadata/getting-started)：了解如何自动更新 iOS 应用的元数据。
