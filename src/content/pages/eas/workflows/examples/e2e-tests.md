---
title: 在 EAS Workflows 上用 Maestro 运行 E2E 测试
description: 了解如何在 EAS Workflows 上用 Maestro 设置并运行 E2E 测试。
---

# 在 EAS Workflows 上用 Maestro 运行 E2E 测试

在本指南中，你将了解如何使用 [Maestro](https://maestro.dev/) 在 EAS Workflows 上运行端到端（E2E）测试。该示例演示如何使用[默认 Expo 模板](/more/create-expo#--template)配置 E2E 测试工作流。对于你自己的应用，你需要调整流程以匹配应用的 UI。

1. **设置你的项目**

   如果还没有，创建一个新项目并与 EAS 同步。

   按照[开始使用 EAS Workflows 指南](/eas/workflows/get-started)创建新项目并与 EAS 同步。然后[配置你的项目](/eas/workflows/get-started)并关联 GitHub 仓库。

2. **添加示例 Maestro 测试用例**

   从默认 Expo 模板创建的应用 UI 看起来是这样的：

   ![iOS 模拟器上默认 Expo 模板应用的主屏幕，带有 “Welcome!” 标题和入门步骤。](/static/images/eas-build/tests/01-home.webp)

   ![iOS 模拟器上默认 Expo 模板应用的 Explore 屏幕，列出基于文件的路由和自定义字体等可折叠部分。](/static/images/eas-build/tests/02-explore.webp)

   让我们为示例应用创建两个简单的 Maestro 流程。首先在项目根目录创建一个名为 **.maestro** 的目录。此目录将包含你要配置的流程，并且应当与 **eas.json** 处于同一级。

   在其中创建一个名为 **home.yml** 的新文件。此流程会启动应用，并断言主屏幕上可见文本 “Welcome!”。

   ```yaml .maestro/home.yml
   appId: dev.expo.eastestsexample # 这是示例应用 ID。请替换为你的应用 ID。
   ---
   - launchApp
   - assertVisible: 'Welcome!'
   ```

   接下来，创建一个名为 **expand_test.yml** 的新流程。此流程会打开示例应用中的 “Explore” 屏幕，点击 “File-based routing” 可折叠项，并断言屏幕上可见文本 “This app has two screens.”。

   ```yaml .maestro/expand_test.yml
   appId: dev.expo.eastestsexample # 这是示例应用 ID。请替换为你的应用 ID。
   ---
   - launchApp
   - tapOn: 'Explore.*'
   - tapOn: '.*File-based routing'
   - assertVisible: 'This app has two screens.*'
   ```

3. **在本地运行 Maestro 测试（可选）**

   要在本地运行 Maestro 测试，按照 [安装 Maestro](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) 中的说明安装 Maestro CLI。

   [把应用安装到本地 Android 模拟器或 iOS 模拟器上](/more/expo-cli#编译)。打开终端，进入 Maestro 目录，并运行以下命令用 Maestro CLI 启动测试：

   ```sh
   maestro test .maestro/expand_test.yml

   maestro test .maestro/home.yml
   ```

   下面的视频展示 **.maestro/expand_test.yml** 流程的一次成功运行：

   [本地 E2E 测试视频](/static/videos/guides/local-e2e.mp4)

4. **用于 E2E 测试的构建 profile**

   E2E 测试需要一个已构建的应用文件：Android 用 **.apk**，iOS 用 **.app**——EAS 可以把它安装到模拟器上并测试。

   在 **eas.json** 文件中为 E2E 测试创建一个构建 profile。如果文件不存在，运行 `eas build:configure` 来生成它。

   ```json eas.json
   {
     "build": {
       "e2e-test": {
         "withoutCredentials": true,
         "ios": {
           "simulator": true
         },
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

   上面的构建 profile 为 Android 创建 **.apk**，为 iOS 创建 **.app**。工作流使用此 profile 在 EAS 服务器上构建应用。

5. **创建 E2E 测试工作流**

   在项目根目录创建 **.eas/workflows** 目录。然后为 E2E 测试工作流添加一个 YAML 文件，例如 **.eas/workflows/e2e-test-android.yml**。

   ```yaml .eas/workflows/e2e-test-android.yml
   name: e2e-test-android

   on:
     pull_request:
       branches: ['*'] # 在每个拉取请求上运行 E2E 测试工作流。
   jobs:
     build_android_for_e2e:
       type: build
       params:
         platform: android
         profile: e2e-test # 用于 E2E 测试的 eas 构建 profile

     maestro_test:
       needs: [build_android_for_e2e]
       type: maestro
       params:
         build_id: ${{ needs.build_android_for_e2e.outputs.build_id }}
         flow_path: ['.maestro/home.yml', '.maestro/expand_test.yml']
   ```

   此工作流使用上一步的 `e2e-test` 构建 profile 为 Android 构建 **.apk**。然后它在已构建的 APK 上运行 **.maestro/home.yml** 流程。

   下面是同一测试工作流的 iOS 示例：

   ```yaml .eas/workflows/e2e-test-ios.yml
   name: e2e-test-ios

   on:
     pull_request:
       branches: ['*']

   jobs:
     build_ios_for_e2e:
       type: build
       params:
         platform: ios
         profile: e2e-test # 用于 E2E 测试的 eas 构建 profile

     maestro_test:
       needs: [build_ios_for_e2e]
       type: maestro
       params:
         build_id: ${{ needs.build_ios_for_e2e.outputs.build_id }}
         flow_path: ['.maestro/home.yml', '.maestro/expand_test.yml']
   ```

   进一步了解 [EAS Workflows 的语法](/eas/workflows/syntax)。

6. **运行 E2E 测试工作流**

   你可以用两种方式运行 E2E 测试工作流：

   1. **使用 EAS CLI 手动运行**

      ```sh
      eas workflow:run .eas/workflows/e2e-test-android.yml
      ```

   2. **在打开拉取请求时自动运行**

      该工作流使用 `pull_request` 触发器，在有人向你的仓库打开拉取请求时自动运行。进一步了解 [EAS Workflows 触发器](/eas/workflows/syntax#on)。

   工作流启动后，你可以在 EAS 仪表盘中跟踪其进度并查看结果。下面是一次已完成的工作流运行的截图：

   ![EAS 仪表盘显示一次已完成的端到端测试工作流运行，其 iOS 构建和 Maestro 测试作业已完成。](/static/images/eas-build/tests/e2e-workflow.webp)

## 更多

- [EAS Workflows 的语法](/eas/workflows/syntax)：进一步了解 EAS Workflows 的语法。
- [示例 CI/CD 工作流](/eas/workflows/examples/introduction)：进一步了解 EAS Workflows 的示例 CI/CD 工作流。
- [Maestro 洞察](/eas-insights/maestro)：跟踪 Maestro 测试随时间变化的通过、不稳定和失败趋势。
- [Maestro 文档](https://docs.maestro.dev/)：进一步了解 Maestro 流程以及如何编写它们。
