---
title: 在 EAS Workflows 上用 Maestro 运行 E2E 测试
description: 学习如何在 EAS Workflows 上，使用 Android 和 iOS 开发构建，用 Maestro 自动化端到端（E2E）测试。
---

# 在 EAS Workflows 上用 Maestro 运行 E2E 测试

损坏的导航流程和会崩溃的屏幕常常能躲过代码评审，因为评审者无法在每个拉取请求上都实际运行应用。

## 学习成果

- 为导航和屏幕内容测试编写 [Maestro](https://maestro.mobile.dev/) 流程文件
- 在工作流中针对 Android 和 iOS [开发构建](/develop/development-builds/introduction) 运行 E2E 测试
- 用 `on.pull_request` 在拉取请求上自动触发 E2E 测试，或用 `on.pull_request_labeled` 按需触发

:::warning
EAS Workflows 中的 Maestro 作业类型目前处于 [alpha](/more/release-statuses#alpha)。
:::

## 为什么 E2E 测试有用？

前面几章的流水线会构建项目并交付更新，还会发送 Slack 通知。然而，损坏的导航流程或会崩溃的屏幕仍然可能悄悄进入生产环境。E2E 测试通过模拟真实用户交互、验证应用行为是否符合预期，有助于在这些问题到达生产环境之前抓住它们。

[Maestro](https://maestro.mobile.dev/) 在 Android 模拟器或 iOS 模拟器上，针对已构建的应用运行自动化流程。它可以点击按钮、输入文本、断言屏幕内容，并在屏幕之间导航。EAS Workflows 在为 Android 构建 APK 或为 iOS 构建模拟器版本之后，在云端运行这些流程。

## 设置 E2E 测试

对于 Android 和 iOS，我们需要为 E2E 测试添加一个专门的[构建 profile](/build/eas-json)。这个 profile 会跳过 Android 的凭据设置，并允许在模拟器中运行 iOS 构建。

### 1. 添加 e2e-test 构建 profile

在 **eas.json** 中添加一个 `e2e-test` profile。这个 profile 会为 Android 创建一个未签名的 APK，并为 iOS 创建一个模拟器构建：

```json eas.json
{
  // ...
  "build": {
    "e2e-test": {
      "withoutCredentials": true,
      "android": {
        "buildType": "apk",
        "image": "latest"
      },
      "ios": {
        "simulator": true,
        "image": "latest"
      }
    }
  }
}
```

### 2. 添加 Maestro 流程文件

在 Expo 项目根目录创建 **.maestro/** 目录，然后添加以下测试文件。

例如，下面的代码片段添加一个基本的主屏幕测试：启动应用，并检查 “Welcome” 文本是否可见。把 `appId` 中的 `com.yourname.yourapp` 替换为我们应用在 **app.json** 中定义的 Android [`android.package`](/versions/latest/config/app#package) 或 iOS [`ios.bundleIdentifier`](/versions/latest/config/app#bundleidentifier)：

```yaml .maestro/home.yml
appId: com.yourname.yourapp # 替换为应用配置文件中的包名或 bundle identifier
---
- launchApp
- assertVisible: 'Welcome'
```

然后可以再为设置屏幕添加一个测试：

```yaml .maestro/navigate.yml
appId: com.yourname.yourapp # 替换为应用配置文件中的包名或 bundle identifier
---
- launchApp
- tapOn: 'Settings'
- assertVisible: 'Settings'
```

## 为 E2E 测试创建工作流

### 1. 创建 e2e-tests.yml

在 **.eas/workflows/** 中添加一个名为 **e2e-tests.yml** 的新文件，内容如下：

```yaml .eas/workflows/e2e-tests.yml
name: E2E Tests

jobs:
  build_android:
    name: Build Android for E2E
    type: build
    params:
      platform: android
      profile: e2e-test
  build_ios:
    name: Build iOS for E2E
    type: build
    params:
      platform: ios
      profile: e2e-test
  test_android:
    name: Run Maestro tests (Android)
    needs: [build_android]
    type: maestro
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
      flow_path: ['.maestro/home.yml', '.maestro/navigate.yml']
  test_ios:
    name: Run Maestro tests (iOS)
    needs: [build_ios]
    type: maestro
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      flow_path: ['.maestro/home.yml', '.maestro/navigate.yml']
```

在上面的工作流中，有两个分别针对 Android 和 iOS 的构建作业：`build_android` 和 `build_ios`。每个构建完成后，对应的 Maestro 作业（`test_android` 或 `test_ios`）会为该平台运行测试。

每个 Maestro 作业通过 `build_id` 引用构建，并通过 `flow_path` 指向 Maestro 流程文件。

### 2. 手动运行工作流

使用 `eas workflow:run` 命令手动运行工作流：

```sh
eas workflow:run .eas/workflows/e2e-tests.yml
```

在 EAS 仪表板上，注意 Android 和 iOS 构建会并行开始。每个构建完成后，对应的 Maestro 测试作业会针对该构建运行流程文件。

![EAS Workflows 仪表板，展示一次 Maestro E2E 测试运行，Android 和 iOS 测试作业在开发构建上并行进行。](/static/images/tutorial/cicd/eas-workflows-maestro-e2e-run.png)

![EAS Workflows 仪表板，展示 Android 和 iOS 开发构建上已成功完成的 Maestro E2E 测试作业。](/static/images/tutorial/cicd/eas-workflows-maestro-e2e-success.webp)

## 自动触发 E2E 测试

到目前为止，我们是手动运行工作流。可以从 GitHub 事件触发它，使它在每个拉取请求上运行，或通过拉取请求的 label 按需运行。

### 在每个拉取请求上运行

要在每个拉取请求上运行 E2E 测试，给工作流添加一个 `on.pull_request` 触发器：

```yaml .eas/workflows/e2e-tests.yml
on:
  pull_request:
    branches: ['*']
```

### 用 label 按需运行

只在需要时运行 E2E 测试，可以使用 [`on.pull_request_labeled`](/eas/workflows/syntax#onpull_request_labeled) 触发器。它接受一个 `labels` 参数，只有当有人把其中某个 label 添加到拉取请求时，工作流才会运行。例如，可以用 `test` 这个 label 来触发 E2E 测试工作流：

```yaml .eas/workflows/e2e-tests.yml
on:
  pull_request_labeled:
    labels: ['test']
```

![由 GitHub 拉取请求 label 触发的 EAS Workflows 运行，针对 Android 和 iOS 开发构建执行 Maestro E2E 测试。](/static/images/tutorial/cicd/eas-workflows-maestro-e2e-pull-request-label.png)

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
