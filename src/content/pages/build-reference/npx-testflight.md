---
title: npx testflight 命令
description: 一条命令即可构建、签名并把 iOS 应用提交到 TestFlight。
---

# npx testflight 命令

[`npx testflight`](https://www.npmjs.com/package/testflight) 是一个 CLI 工具，会引导你完成构建、签名并把 iOS 应用提交到 TestFlight。

**前置条件**

- **一个 React Native iOS 项目**：你想部署到 TestFlight 的 React Native iOS 项目。
- **Apple Developer 账户**：TestFlight 分发需要付费的 [Apple Developer 账户](https://developer.apple.com/account/)。
- **Expo 账户**：如果还没有，请注册 [Expo](https://expo.dev/signup) 账户。

## 运行 `npx testflight` 命令

在项目根目录运行以下命令：

```sh
$ npx testflight
```

该命令的工作流是交互式的，会使用最新的 EAS CLI 版本引导你完成以下提示：

- **初始化或检测已关联的 EAS 项目。** 如果你在新项目中运行此命令，CLI 会使用应用配置文件中的 slug 创建一个新的 EAS 项目。如果 CLI 检测到该项目已在 EAS 上创建，它会继续使用同一个 slug。
- **确认 bundle identifier。** 如果你在新项目中运行此命令，可以输入新的标识符；后续再次运行时，则接受 CLI 检测到的那个。向导还会询问应用使用的是标准加密还是豁免加密。再次运行此命令时，[`buildNumber`](/tutorial/eas/manage-app-versions#understanding-developer-facing-and-user-facing-app-versions) 会自动递增。
- **登录 Apple Developer。** 提供你的 Apple ID，完成双重认证，并允许 CLI 创建新的或复用已有的分发证书或描述文件。
- **生成凭据。** 如果 EAS 尚未为该 bundle identifier 管理凭据，CLI 会为你创建或更新分发证书和描述文件。
- **创建生产构建。** 它使用默认的 EAS [`production` profile](/build/eas-json#生产构建)启动一次 iOS 构建，创建 iOS 归档（**.ipa**）文件。
- **验证 App Store Connect 访问权限。** 提交步骤会检查是否有 [App Store Connect API 密钥](https://expo.fyi/creating-asc-api-key)，并在需要时创建一个。
- **把应用提交到 TestFlight。** 把得到的 **.ipa** 文件上传到 App Store Connect，并为团队的[内部测试组](/submit/testflight#设置内部测试)启用 TestFlight 分发。

在整个过程中，你会在终端窗口里收到构建和提交状态更新。在 App Store Connect 仪表盘中，你可以管理测试人员和分发。

:::note
每一条提示都对应 EAS Build 和 EAS Submit 流程，因此你可以像分别运行 eas build 或 eas submit 时那样回答。这意味着在构建和提交过程中会生成 EAS 仪表盘链接，你可以用它们查看进度。提交过程成功完成后，你会得到 App Store Connect 的链接，用来查看提交到 TestFlight 的内容。
:::

## 为什么使用 `npx testflight`

- 节省开发者时间，不需要分开的构建和提交步骤
- 通过 EAS CLI 的引导提示处理 Apple 凭据、描述文件和 App Store Connect API 密钥
- 生成新构建并提交到 TestFlight，无需运行单独的命令
- 适合共享机器或安装全局包不方便的 CI 运行器

## 何时使用 `npx testflight`

- 从本地机器快速交付一次 TestFlight 构建
- 在不配置完整 CI 工作流的情况下，向 TestFlight 触发一次或多次构建
- 已有内部测试组，并希望尽快让应用中的最新更改可用
- 让 EAS 自动处理证书、描述文件和 API 密钥

## 常见问题

<details>
<summary>能否以非交互模式运行 <code>npx testflight</code> 命令？</summary>

可以。当你在 **eas.json** 的 `submit.production` profile 中提供 `ascAppId` 时，`npx testflight` 命令会跳过确认应用已存在于 App Store Connect 的过程。

```json eas.json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

要进一步了解如何查找 ascAppId，参见[提交到 Apple App Store 中的这些步骤](/submit/ios#如何查找-ascappid)。

</details>
