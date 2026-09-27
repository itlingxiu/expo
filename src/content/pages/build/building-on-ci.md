---
title: 从 CI 触发构建
description: 了解如何从 GitHub Actions 等 CI 环境为应用在 EAS 上触发构建。
---

# 从 CI 触发构建

本文概述如何从 GitHub Actions、Travis CI 等 CI 环境为应用在 EAS 上触发构建。

**前置条件**

- **本地机器上一次成功的构建**：要从 CI 环境触发 EAS 构建，应用需要设置为以非交互模式使用 EAS Build。在本地终端为你希望在 CI 上支持的每个平台运行 `eas build -p [all|android|ios]`，以便 `eas build` 命令提示它需要的任何额外配置。该配置随后可用于以后的非交互运行。

  在本地运行一次构建会完成以下关键配置步骤：

  - 通过生成 `projectId` 在 EAS 上初始化项目。
  - 添加定义构建 profile 的 **eas.json** 文件。
  - 填充原生构建所需的关键应用配置属性，例如 `android.packageName` 和 `ios.bundleIdentifier`。
  - 确保创建构建凭据，包括 Android keystore 以及 iOS 分发证书和描述文件。

  如果还没做过，请参见[创建你的第一次构建](/build/setup)指南，准备好后再回到这里。

## 使用 EAS Workflows

[EAS Workflows](/eas/workflows/get-started) 是 Expo 的 CI/CD 服务，允许你在 EAS 上运行构建以及许多其他类型的作业。你可以用 EAS Workflows 自动化开发和发布流程，例如创建开发构建，或自动构建并提交到应用商店。

要用 EAS Workflows 创建构建，先在 **.eas/workflows/build.yml** 中加入以下代码：

```yaml
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

## 为其他 CI 服务配置应用

### 提供个人访问令牌，以便在 CI 上用你的 Expo 账户进行身份验证

接下来，我们需要确保可以在 CI 上以应用所有者的身份进行身份验证。这可以通过在 CI 设置中把个人访问令牌存入环境变量 `EXPO_TOKEN` 来实现。

参见[个人访问令牌](/accounts/programmatic-access#personal-access-tokens)了解如何创建访问令牌。

### （可选）为你的 Apple 团队提供 ASC API 令牌

如果 iOS 凭据需要修复，我们需要一把 ASC API 密钥，以便在 CI 中向 Apple 进行身份验证。常见情况是描述文件需要重新签名。

你需要创建一把 [API 密钥](https://expo.fyi/creating-asc-api-key)。接下来，你需要收集 [Apple 团队](https://expo.fyi/apple-team)的信息。

用收集到的信息，通过环境变量把它传入构建命令。你需要传入以下内容：

- `EXPO_ASC_API_KEY_PATH`：ASC API 密钥 **.p8** 文件的路径。例如 **/path/to/key/AuthKey_SFB993FB5F.p8**。
- `EXPO_ASC_KEY_ID`：ASC API 密钥的密钥 ID。例如 `SFB993FB5F`。
- `EXPO_ASC_ISSUER_ID`：ASC API 密钥的 issuer ID。例如 `f9675cff-f45d-4116-bd2c-2372142cee09`。
- `EXPO_APPLE_TEAM_ID`：你的 Apple Team ID。例如 `77KQ969CHE`。
- `EXPO_APPLE_TEAM_TYPE`：你的 Apple 团队类型。有效类型为 `IN_HOUSE`、`COMPANY_OR_ORGANIZATION` 或 `INDIVIDUAL`。

如果你在 CI 上用 ad hoc 描述文件运行[内部分发](/build/internal-distribution)构建，请刷新 ad hoc 描述文件，以便包含上次构建之后才登记的设备。对于 `eas build`，把 [`--refresh-ad-hoc-provisioning-profile`](/eas/cli#eas-build) 与 `--non-interactive` 一起传入。对于 [EAS Workflows](/eas/workflows/get-started)，在构建作业的 `params` 中设置 `refresh_ad_hoc_provisioning_profile: true`（[构建作业参数](/eas/workflows/pre-packaged-jobs#build)）。要求和示例命令参见 [CI 上的自动化](/build/internal-distribution#ci-上的自动化可选)。

### 触发新构建

既然已经用 Expo CLI 完成身份验证，我们就可以创建构建步骤。

要触发新构建，把这个脚本加入配置：

```sh
$ npx eas-cli build --platform all --non-interactive --no-wait
```

这会在 EAS 上触发一次新构建。会打印一个 URL，链接到 EAS 仪表盘中该构建的进度。

:::note
`--no-wait` 标志在构建被触发后就退出该步骤。EAS 执行构建期间，你不会为 CI 执行时间付费。不过，只有触发 EAS Build 成功时，CI 才会报告构建作业通过。

如果需要在构建完成后运行另一个 CI 步骤，请去掉此标志。
:::

<details>
<summary>Travis CI</summary>

在项目仓库根目录的 **.travis.yml** 中加入以下代码片段。

```yaml travis.yml
language: node_js
node_js:
  - node
  - lts/*
cache:
  directories:
    - ~/.npm
before_script:
  - npm install -g npm@latest

jobs:
  include:
    - stage: build
      node_js: lts/*
      script:
        - npm ci
        - npx eas-cli build --platform all --non-interactive --no-wait
```

</details>

<details>
<summary>GitLab CI</summary>

在项目仓库根目录的 **.gitlab-ci.yml** 中加入以下代码片段。

```yaml .gitlab-ci.yml
image: node:alpine

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm
    # 或者使用 Yarn：
    #- .yarn

stages:
  - build

before_script:
  - npm ci --cache .npm
  # 或者使用 Yarn：
  #- yarn install --cache-folder .yarn

eas-build:
  stage: build
  script:
    - apk add --no-cache bash
    - npx eas-cli build --platform all --non-interactive --no-wait
```

</details>

<details>
<summary>Bitbucket Pipelines</summary>

在项目仓库根目录的 **bitbucket-pipelines.yml** 中加入以下代码片段。

```yaml bitbucket-pipelines.yml
image: node:alpine

definitions:
  caches:
    npm: ~/.npm

pipelines:
  default:
    - step:
        name: Build app
        deployment: test
        caches:
          - npm
        script:
          - apk add --no-cache bash
          - npm ci
          - npx eas-cli build --platform all --non-interactive --no-wait
```

</details>

<details>
<summary>CircleCI</summary>

在项目仓库根目录的 **circleci/config.yml** 中加入以下代码片段。

```yaml .circleci/config.yml
version: 2.1

executors:
  default:
    docker:
      - image: cimg/node:lts
    working_directory: ~/my-app

jobs:
  eas_build:
    executor: default
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Trigger build
          command: npx eas-cli build --platform all --non-interactive --no-wait

workflows:
  build_app:
    jobs:
      - eas_build:
          filters:
            branches:
              only: master
```

</details>

<details>
<summary>GitHub Actions</summary>

在项目仓库根目录的 **.github/workflows/eas-build.yml** 中加入以下代码片段。

```yaml .github/workflows/eas-build.yml
name: EAS Build
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    name: Install and build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Install dependencies
        run: npm ci
      - name: Build on EAS
        run: eas build --platform all --non-interactive --no-wait
```

</details>
