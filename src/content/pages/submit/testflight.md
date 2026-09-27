---
title: 用 TestFlight 分发 iOS 应用
description: 了解如何用 TestFlight 把 iOS 构建送到测试人员的设备上，以及何时使用内部测试与外部 TestFlight 测试。
---

# 用 TestFlight 分发 iOS 应用

**TestFlight** 是 Apple 的内部与测试版应用分发服务。创建 iOS 生产构建之后，应用可以在公开发布到 App Store 之前，通过 TestFlight 到达测试人员的设备。

有两种测试，它们的区别决定构建多快到达应用用户。**内部测试**面向你自己的 App Store Connect 团队，构建处理完成后即可使用。**外部测试**面向其他任何人。不过，你必须在 App Store Connect 中把构建加入一个组，并且该组的第一次构建必须通过 Apple 的 Beta App Review 流程。

**前置条件**

- **付费的 Apple Developer 账户**：向 Apple App Store 提交应用需要付费的 Apple Developer 账户。在 [Apple Developer Portal](https://developer.apple.com/account/)注册。
- **App Store Connect 中的应用记录**：提交第一次构建时，`eas submit` 会在 App Store Connect 上自动创建应用记录。在 [App Store Connect](https://appstoreconnect.apple.com/)中点击 **Create app** 创建应用。你也可以用 [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)以编程方式创建应用记录，或在 **eas.json** 的 `submit` profile 中设置 `ascAppId` 以跳过创建应用记录。
- **生产构建**：TestFlight 只接受在 **eas.json** 中设置了 `"distribution": "store"` 的构建，这是 [EAS Build](/build/introduction) `production` profile 的默认值。说明参见[构建生产应用](/submit/ios#构建生产应用)。
- **TestFlight 应用**：测试人员需要在 iOS 设备上安装 [TestFlight 应用](https://apps.apple.com/us/app/testflight/id899247664)，才能安装并测试你的应用。

## 快速开始

如果你有 Apple Developer 账户，但其他东西都还没设置，可以用一条命令在 App Store Connect 上创建应用记录、构建生产 **.ipa** 并提交到 TestFlight：

:::tabs
:::tab npx testflight
```sh
# npm
$ npx testflight

# yarn
$ yarn dlx testflight

# pnpm
$ pnpm dlx testflight

# bun
$ bunx testflight
```

上面的命令会创建凭据，在 EAS Build 上运行生产构建，并通过 TestFlight 提交进行内部测试。它是用 EAS CLI 一步完成构建和提交的简写。

:::
:::tab EAS CLI
```sh
$ eas build --platform ios --auto-submit
```

[`--auto-submit`](/build/automate-submissions) 标志会把完成的构建自动交给 EAS Submit。你也可以把构建和提交分成单独的步骤。如果你已经有生产构建，不必重新构建。直接提交已有构建：

```sh
$ eas submit --platform ios
```
:::
:::

本指南的其余部分更详细地介绍内部测试和外部测试。

## 内部测试与外部测试

在 Apple App Store 上公开发布应用之前，你可以通过 TestFlight 以两种方式把应用分发给测试人员：**内部测试**和**外部测试**。区别在于构建多快到达测试人员：

| 目的 | 内部测试 | 外部测试 |
| --- | --- | --- |
| 谁可以测试你的应用 | App Store Connect 团队中的用户 | 任何人。测试人员不需要 App Store Connect 账户。 |
| 允许的最大测试人员数 | 100 | 每个应用 10,000 |
| Beta App Review | 不需要 | 每个应用版本的第一次构建**必需** |
| 如何邀请测试人员 | 仅电子邮件 | 电子邮件、CSV 导入，或可分享的公开链接 |
| 测试版应用描述 | 不需要 | 外部测试**必需**。这是出现在 TestFlight 中的描述。 |
| 反馈电子邮件 | 不需要 | 外部测试**必需**。这是出现在 TestFlight 中的电子邮件。 |
| 到达测试人员的时间 | 处理完成后立即 | Beta App Review 批准构建之后 |
| 构建过期 | 自上传起 90 天 | 自上传起 90 天 |
| 每位测试人员的设备数 | 30 | 30 |

:::warning
**内部分发不是内部测试。** 这两个术语听起来一样。**EAS** [内部分发](/build/internal-distribution)产出的是 [ad hoc 或企业签名的构建](/build/internal-distribution#分发机制概览)，从 URL 安装，并且限于已登记的唯一设备标识符（UDID）。TestFlight 内部测试需要 `"distribution": "store"`，并且经过 Apple。
:::

## 设置内部测试

内部测试面向你自己的 App Store Connect 团队，构建处理完成后即可使用。

1. 构建并提交

   要把构建上传到 App Store Connect 进行内部测试，请确保已创建生产构建。之后运行以下命令把它提交到 TestFlight：

   ```sh
   $ eas submit --platform ios
   ```

2. 等待处理

   Apple 会在可以分发之前处理构建。这通常需要 5 到 10 分钟，但没有保证的时间。处理完成后，Apple 会通过电子邮件通知你。

   应用处理完成后，登录 [App Store Connect](https://appstoreconnect.apple.com/)，选择你的应用，进入 **TestFlight**。你应该在 **iOS Builds** 下看到列出的构建。

   ![App Store Connect 中的 iOS Builds 列表，显示一份已处理、可以提交的构建](/static/images/submit/testflight/01-ios-builds.webp)

3. 创建内部测试组

:::note
   如果你已经有内部测试组，跳过这一步。你可以改为把测试人员加入已有的组。
:::

   在 App Store Connect 中，进入 **TestFlight** > 点击 **Internal Testing** 旁边的加号（`+`）图标 > 输入 **Internal Group** 的名称 > 点击 **Create**。

   ![App Store Connect 中的 Create New Internal Group 对话框，已输入组名](/static/images/submit/testflight/02-create-internal-group.webp)

   然后点击 **Testers** 旁边的加号（`+`）图标，把测试人员加入该组。你可以通过选择电子邮件并点击 **Add**，从 App Store Connect 团队添加测试人员。测试人员会收到测试应用的电子邮件邀请。

   ![新的内部测试组，带有添加测试人员的加号图标，尚未添加测试人员](/static/images/submit/testflight/03-internal-group-testers.webp)

   ![Add Testers 对话框，列出可加入该组的 App Store Connect 团队成员](/static/images/submit/testflight/04-add-testers.webp)

4. 邀请测试人员

   在测试人员的设备上，点按邀请电子邮件中的链接。应用会出现在 TestFlight 中，测试人员可以从那里安装它。

:::note
**提示**：如果你已有内部测试组，也可以直接从 EAS CLI 指定内部组。例如，命令 `eas submit --platform ios --groups "QA Team" --what-to-test "New onboarding flow"` 会指定名为 “QA Team” 的内部测试组，并为该构建设置 “What to Test” 描述。
:::

## 设置外部测试

外部测试面向 App Store Connect 团队之外的人。

:::warning
你必须先创建一个**内部**组，App Store Connect 才会允许你创建**外部**组。
:::

1. 创建外部组

   在 **App Store Connect** > **TestFlight** > 点击 **External Testing** 旁边的加号（`+`）图标 > 输入 **External Group** 的名称 > 点击 **Create**。

   ![在 App Store Connect 中创建外部测试组的 Create a New Group 对话框](/static/images/submit/testflight/05-create-external-group.webp)

2. 使用已有的内部构建

   你可以把已有的内部构建用于外部测试。点击 **Add Builds** > 在 **Select a Build to Test** 下选择你想使用的构建 > 点击 **Next**。

   ![新的外部测试组，显示 Add Builds 和 Invite Testers 步骤](/static/images/submit/testflight/06-external-group-setup.webp)

   ![Select a Build to Test 对话框，列出一份已上传、可以提交的构建](/static/images/submit/testflight/07-select-build.webp)

3. 填写测试信息

   外部测试要求在 Apple 接受构建进行审核之前提供测试版应用描述和反馈电子邮件。如果应用有登录，启用 **Sign-in Information** 并提供供 Apple 使用的测试账户。点击 **Next**。

   ![已填写测试版应用描述、反馈电子邮件和联系信息的 Test Information 表单](/static/images/submit/testflight/08-test-information.webp)

4. 提交 Beta App Review

   在 **What to Test** 下提供所要求的信息，并点击 **Submit for Review**。Apple 会审核构建，并在批准时通过电子邮件通知你。

   ![What to Test 步骤，带有在提交审核前自动通知测试人员的选项](/static/images/submit/testflight/09-what-to-test.webp)

5. 邀请测试人员

   批准后，通过电子邮件邀请、导入 CSV，或打开公开链接。公开链接可以对任何人开放，或按设备和操作系统版本过滤。

   ![外部测试组，带有创建公开链接和添加测试人员的选项](/static/images/submit/testflight/10-public-link.webp)

## 常见问题

<details>
<summary>用 TestFlight 分发应用需要 Mac 吗？</summary>

不需要。`eas build` 和 `eas submit` 都可以在 macOS、Linux 和 Windows 上运行。构建在 EAS Build 基础设施上运行，EAS Submit 会为你把 **.ipa** 上传到 App Store Connect。

</details>

<details>
<summary>从内部测试转到外部测试需要新的构建吗？</summary>

不需要。把已经在 App Store Connect 中的构建加入外部组，并提交 Beta App Review。只有应用本身发生变化时才需要新构建。

</details>

<details>
<summary>为什么队友不能把构建加入外部组？</summary>

他们的 App Store Connect 角色不允许。**Developer** 或 **Marketing** 角色可以管理内部测试，但不能管理外部测试，外部测试需要 **Account Holder**、**Admin** 或 **App Manager**。

同样的限制适用于凭据。只有 **Account Holder** 或 **Admin** 才能创建 EAS Submit 使用的 App Store Connect API 密钥。完整矩阵参见 [Apple Developer Program 角色与权限](/app-signing/apple-developer-program-roles-and-permissions)。

</details>

<details>
<summary>TestFlight 构建会在 App Store 上发布吗？</summary>

不会。发布到 App Store 是你在 App Store Connect 中手动开始的另一次提交。TestFlight 中的构建会留在 TestFlight。

发布时测试也不会停止。如果你在构建上架 App Store 之前没有让它过期，已经收到邀请的测试人员可以继续测试它。要停止他们，进入 **TestFlight** > 选择该构建 > **Expire Build**。

</details>

<details>
<summary>为什么我的构建卡在 Missing Compliance？</summary>

App Store Connect 正在等待出口合规问题的答案，在你回答之前无法把构建分发给测试人员。与其每次上传都回答，不如在应用配置中回答一次：

```json app.json
{
  "ios": {
    "config": {
      "usesNonExemptEncryption": false
    }
  }
}
```

仅当你的应用除了 Apple 豁免的加密（例如通过操作系统的 HTTPS）之外不使用加密时，才把 [`usesNonExemptEncryption`](/versions/latest/config/app#usesnonexemptencryption) 设为 `false`。该声明也涵盖应用链接的第三方库，并且适用于 TestFlight 构建，而不仅是 App Store 发布。

</details>

<details>
<summary>能否从命令行把构建加入 TestFlight 组？</summary>

可以，对于内部组。传入 `--groups` 以及已有内部组的名称，并用 `--what-to-test` 设置测试说明：

```sh
$ eas submit --platform ios --groups "QA Team" --what-to-test "New onboarding flow"
```

`--groups` 只接受**内部**组名称。要把构建加入外部组，请使用 EAS Workflows。

</details>

<details>
<summary>能否自动把构建分发到外部组？</summary>

可以，使用 EAS Workflows 中预置的 [`testflight` 作业](/eas/workflows/pre-packaged-jobs#testflight)。它把构建加入内部和外部组，设置 “What to Test” 说明，并提交 Beta App Review：

```yaml .eas/workflows/testflight.yml
jobs:
  build_ios:
    name: Build iOS
    type: build
    params:
      platform: ios
      profile: production

  testflight:
    name: Distribute to TestFlight
    type: testflight
    needs: [build_ios]
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
      internal_groups: ['QA Team']
      external_groups: ['Public Beta']
      changelog: |
        What's new in this release:
        - New features
        - Bug fixes
```

当提供了 `external_groups` 时，`submit_beta_review` 默认为 `true`。在带外部组运行该作业之前，请先在 App Store Connect 中完成 TestFlight 测试信息。

</details>
