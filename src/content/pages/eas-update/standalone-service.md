---
title: 不依赖其他 EAS 服务使用 EAS Update
description: 了解如何独立于 Build 等其他 EAS 服务使用 EAS Update。
---

# 不依赖其他 EAS 服务使用 EAS Update

EAS Update 作为独立服务也很合适，因此你可以在使用或不使用 EAS Build 及其他 EAS 服务的情况下使用它。它的主要功能都设计为与构建流水线无关，并且已被不使用其他 EAS 服务的大型组织用于生产。

<details>
<summary>不结合其他 EAS 服务使用 EAS Update 有哪些缺点？</summary>

EAS Update 与 Build 紧密配合，提供的体验大于各部分之和。例如，当你用 EAS Build 创建构建时，我们会协助处理与更新相关的各种簿记，例如运行时版本和 channel。

使用相同 channel 和运行时版本的构建会归入 [expo.dev](https://expo.dev/accounts/[account-name/projects/[project-name]/deployments) 上的 **Deployments** 分区。这类依赖对构建或应用其他方面了解的簿记与洞察功能，在你独立于其他 EAS 服务使用 EAS Update 时将不可用。

即便如此，许多组织已经在自己的 CI/CD 基础设施上投入很多，或另有理由希望使用其他构建流水线，而跨 EAS 服务更深集成所带来的好处，可能不值得为此迁移到不同 CI/CD 提供商的切换成本。

</details>

## 不使用 EAS Build 时使用 EAS Update

无论是否使用 EAS Build，大部分[安装与配置步骤](/eas-update/getting-started)都相同。主要区别在于如何配置更新 [channel](/eas-update/eas-cli)。使用 EAS Build 时，**eas.json** 中的 channel 会在构建时自动写入构建的 **AndroidManifest.xml** 和 **Expo.plist**。不使用 EAS Build 时，必须手动配置：先[在应用配置中设置请求头](/eas-update/getting-started#在-appjson-中配置更新-channel)，再在服务器上手动创建 channel。

```sh
# 创建一个名为 `production` 的 channel（例如，默认指向 production EAS Update 分支）
# 你的 channel 名称可能因发布流程而异
$ eas channel:create production
```
