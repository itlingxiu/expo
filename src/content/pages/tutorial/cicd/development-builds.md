---
title: 用 EAS Workflows 自动化开发构建
description: 学习如何用 EAS Workflows 自动化 Android 和 iOS 开发构建，并在只有 JavaScript 变更时用指纹跳过重新构建。
---

# 用 EAS Workflows 自动化开发构建

每次向 GitHub 仓库推送都手动重新构建开发客户端，会很慢。拉取了原生变更（新模块、新权限、SDK 升级）的团队成员或新贡献者，必须等一次全新构建完成才能运行项目。

在 `main` 分支上自动化开发构建，可以让一份当前可用的构建随时能安装。我们可以运行 `eas build:dev` 来安装最新的兼容构建。如果项目指纹与某次现有构建匹配，EAS 会下载那次构建，而不是创建新的。

## 学习成果

- 用 `build` 作业类型为 Android 和 iOS 自动化[开发构建](/develop/development-builds/introduction)
- 用 `fingerprint` 和 `get-build` 作业，在原生代码没有变化时跳过重新构建
- 添加一个自定义单元测试作业，让工作流以测试通过为前提

### 前提条件

**已为开发配置 EAS Build**

第一次为某个 profile 触发构建时，EAS CLI 会提示生成凭据。在工作流运行之前，先为 Android 和 iOS 手动触发一次开发构建，使凭据已经存在：

```sh
eas build --profile development --platform all
```

## 用于开发构建的 `build` 作业类型

`build` 作业类型是 EAS Workflows 的[预置作业](/tutorial/cicd/first-workflow#eas-workflows-中的作业类型)之一。我们不必定义构建过程的每一步，而是用 `build` 作业类型为 Android 和 iOS 运行一次 EAS Build。

本章使用 **eas.json** 中的 `development` 构建 profile。我们在开发 Expo 应用时使用这个 profile。

### 1. 添加 build.yml

在 **.eas/workflows/** 中添加一个名为 **build.yml** 的新文件。它使用带 `profile` 和 `platform` 参数的 `build` 作业类型，为 Android 和 iOS 创建开发构建。

把以下代码添加到 **build.yml**：

```yaml .eas/workflows/build.yml
name: Development builds

jobs:
  build_android:
    name: Build Android
    type: build
    params:
      platform: android
      profile: development
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: development
```

我们添加两个作业：`build_android` 和 `build_ios`。两者类型都是 `build`，但平台和构建 profile 的参数不同。

每个作业的 `params` 键包括：

- [`platform`](/eas/workflows/pre-packaged-jobs#build) 设置构建的目标操作系统（`android` 或 `ios`）
- [`profile`](/build/eas-json#build-profiles) 指定 **eas.json** 中的构建 profile

### 2. 手动运行工作流

用以下命令手动运行工作流：

```sh
eas workflow:run .eas/workflows/build.yml
```

### 3. 在 EAS 仪表板上验证

在 EAS 仪表板上，注意 **Workflow graph** 标签下会显示 “Triggered manually”。只要 **Trigger** 显示为 **Manual**，就表示工作流是用 `eas workflow:run` 命令启动的。

![EAS Workflows 仪表板，展示一次手动触发的运行，并行创建 Android 和 iOS 开发构建。](/static/images/tutorial/cicd/eas-workflows-development-build-manual-run.png)

每次构建的日志都出现在工作流界面中。点击构建的 ID 可以打开它的 EAS Build 页面。

![Android 开发构建的 EAS Build 详情页，展示构建状态、指纹哈希、提交 SHA 和展开的日志输出。](/static/images/tutorial/cicd/eas-build-android-development-build-logs.webp)

:::warning
在 EAS Workflows 中，没有依赖的作业默认并行运行。在上面的工作流中，`build_android` 和 `build_ios` 都没有任何依赖，因此它们同时开始。
:::

进入下一步之前，请等待两次构建都完成。完成后，可以使用 **Install** 或 **Open with [Orbit](/build/orbit)** 按钮，或从 **Artifacts** 下载，安装到设备、Android 模拟器或 iOS 模拟器。

## 用指纹跳过不必要的构建

当项目只有 TypeScript/JavaScript 变更时，现有的开发构建仍然兼容，因此不需要新的构建。

[**Expo Fingerprint**](/versions/latest/sdk/fingerprint) 会自动化这个判断。它会对项目的原生特征（依赖、原生项目文件、配置）做哈希。如果哈希与某次现有构建匹配，说明原生代码没有变化，EAS 会跳过重新构建。如果哈希不同，说明原生代码变了，EAS 会创建一次新构建。

> 示意图展示指纹流程：先计算原生特征的哈希，再与已有构建比较。匹配则跳过构建，不匹配则创建新构建。

下面逐步更新 **build.yml**，以便检测原生变更，并只在需要时构建。

### 1. 添加 fingerprint 作业

[`fingerprint`](/eas/workflows/pre-packaged-jobs#fingerprint) 预置作业会对项目的原生特征做哈希，并为每个平台输出一个指纹哈希。`environment` 字段告诉 EAS 使用哪一套[环境变量配置](/eas/environment-variables)。注意，`environment` 和 `profile` 可以同名，但指的是不同的东西。`profile` 指向 **eas.json** 中的构建 profile（如何构建）。`environment` 指向在 EAS 上配置的环境变量（构建时注入哪些值）。

更新 **build.yml**，在构建作业之前添加 `fingerprint` 作业：

```yaml .eas/workflows/build.yml
name: Development builds

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: development
  build_android:
    # ...
  build_ios:
    # ...
```

`fingerprint` 作业产生两个输出：`android_fingerprint_hash` 和 `ios_fingerprint_hash`。下一步我们用这些哈希检查是否已经存在兼容的构建。

### 2. 添加 get-build 作业

[`get-build`](/eas/workflows/pre-packaged-jobs#get-build) 预置作业会检查给定指纹哈希和 profile 是否已经存在构建。如果存在匹配的构建，它会输出 `build_id`。如果不存在，`build_id` 为空。

在工作流文件中，在 `fingerprint` 和构建作业之间添加 `get_android_build` 与 `get_ios_build` 作业。每个作业都用 `needs: [fingerprint]` 等待 fingerprint 作业完成并访问其输出：

```yaml .eas/workflows/build.yml
name: Development builds

jobs:
  fingerprint:
    # ...
  get_android_build:
    name: Check for existing Android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: development
  get_ios_build:
    name: Check for existing iOS build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: development
  build_android:
    # ...
  build_ios:
    # ...
```

在上面的工作流中，`get-build` 作业使用 `${{ needs.fingerprint.outputs.* }}` 表达式语法，从上一个作业接收指纹哈希。

### 3. 添加条件构建

[`if`](/eas/workflows/syntax#jobsjob_idif) 字段控制作业是否运行。表达式 `${{ !needs.get_android_build.outputs.build_id }}` 的意思是：_只有当 `get-build` 没有找到匹配构建时才运行作业_。`!` 是取反运算符。如果这个指纹已经存在兼容构建，构建作业会被跳过。

更新每个构建作业，使它依赖对应的 `get-build` 作业，并添加 `if` 条件：

```yaml .eas/workflows/build.yml
name: Development builds

jobs:
  fingerprint:
    # ...
  get_android_build:
    # ...
  get_ios_build:
    # ...
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: development
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: development
```

### 4. 添加触发器并运行工作流

给工作流添加 `on.push` 触发器，使它在每次推送到 `main` 时自动运行：

```yaml .eas/workflows/build.yml
name: Development builds

on:
  push:
    branches: ['main']

jobs:
  fingerprint:
    name: Fingerprint
    type: fingerprint
    environment: development
  get_android_build:
    name: Check for existing Android build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.android_fingerprint_hash }}
      profile: development
  get_ios_build:
    name: Check for existing iOS build
    needs: [fingerprint]
    type: get-build
    params:
      fingerprint_hash: ${{ needs.fingerprint.outputs.ios_fingerprint_hash }}
      profile: development
  build_android:
    name: Build Android
    needs: [get_android_build]
    if: ${{ !needs.get_android_build.outputs.build_id }}
    type: build
    params:
      platform: android
      profile: development
  build_ios:
    name: Build iOS
    needs: [get_ios_build]
    if: ${{ !needs.get_ios_build.outputs.build_id }}
    type: build
    params:
      platform: ios
      profile: development
```

假设我们对 Expo 项目做了一些 TypeScript/JavaScript 修改，例如改变按钮颜色或更新屏幕上的文字。之后可以把一次提交推送到 `main` 分支，从 GitHub 仓库触发工作流：

```sh
git add . && git commit -m 'Update button label and tweak styling' && git push origin main
```

这会触发一个新工作流，并在几秒内完成。在 EAS 仪表板上，Android 和 iOS 构建都会被跳过，因为上一节已经存在匹配的构建。

![EAS Workflows 运行：fingerprint 和 get-build 作业跳过了 Android 和 iOS 构建作业，因为找到了兼容的现有构建。](/static/images/tutorial/cicd/eas-workflows-fingerprint-skips-existing-build.png)

我们从 `main` 分支拉取最新代码并运行 `npx expo start`。现有的开发构建会接收这些 JS 变更。

## 用于单元测试的自定义作业

:::note
本节假设项目中已经设置了 Jest。设置说明参见[用 Jest 做单元测试](/develop/unit-testing)。
:::

在团队中工作时，我们希望推送到 `main` 分支的每一次变更都先通过测试，再触发新的构建。

如果没有自动化，团队必须记得在推送到 `main` 之前在本地运行测试。如果他们忘了，而代码里有失败的测试，下一次工作流就可能从损坏的代码创建构建。

借助 **EAS Workflows**，可以把自定义作业与现有的预置作业混在一起，从而自动化这个过程。这个自定义作业在 fingerprint 和构建作业之前运行。如果测试失败，EAS 会停止工作流，并且不创建构建。

> 示意图展示单元测试门禁：测试通过后才继续指纹计算和构建；测试失败则停止工作流。

### 1. 为单元测试添加自定义作业

在 **build.yml** 工作流文件中，添加一个在构建开始之前运行单元测试的自定义作业：

```yaml .eas/workflows/build.yml
name: Development builds

on:
  push:
    branches: ['main']

jobs:
  run_tests:
    name: Run unit tests
    steps:
      - uses: eas/checkout # 检出仓库
      - uses: eas/install_node_modules
      - run: npx jest --ci
  fingerprint:
    name: Fingerprint
    # 把这一行加到 fingerprint 作业。它只在测试通过后运行；如果测试失败，什么都不会构建。
    needs: [run_tests]
    type: fingerprint
    environment: development
  get_android_build:
    # ...
  get_ios_build:
    # ...
  build_android:
    # ...
  build_ios:
    # ...
```

自定义的 `run_tests` 作业做了这些事：

- `uses: eas/checkout` 从 GitHub 仓库检出项目源文件。自定义作业运行在一台新的虚拟机上，因此默认没有代码。在访问任何项目文件之前，这一步是必需的。
- `uses: eas/install_node_modules` 使用项目中检测到的包管理器（bun、npm、pnpm 或 Yarn）安装依赖。在运行任何依赖 **node_modules** 中包的命令（例如 Jest）之前，需要这一步。
- `run: npx jest --ci` 执行测试套件。`run` 键会运行任何 shell 命令，类似于 `echo` 命令。`--ci` 标志告诉 Jest 以 CI 模式运行，它不会监视文件变化，并在跑完所有测试后退出。

现在，`fingerprint` 作业有 `needs: [run_tests]`，因此它只在测试通过后运行。如果测试失败，EAS 会跳过工作流的其余部分。

### 2. 触发工作流

把更新后的工作流连同测试文件一起提交并推送到 `main`：

```sh
git add . && git commit -m 'Add unit tests to development builds workflow' && git push origin main
```

触发工作流后，打开 EAS 仪表板，观察工作流中作业的流向。

![EAS Workflows 运行通过指纹匹配复用现有开发构建，跳过 Android 和 iOS 构建作业。](/static/images/tutorial/cicd/eas-workflows-fingerprint-reuses-build.png)

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
