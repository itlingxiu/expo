---
title: EAS 环境变量常见问题
description: 关于 EAS 环境变量的常见问题。
---

# EAS 环境变量常见问题

本页涵盖关于 EAS 环境变量的常见问题。

## 在我的 EAS 项目中使用环境变量的推荐工作流是什么？

在 EAS 项目中高效使用环境变量的一种可行方式是：

### 使用正确的可见性设置

确保将环境变量的可见性设置为适当的级别。避免对应用 JavaScript 代码中使用或用于解析应用配置的 `EXPO_PUBLIC_` 变量设置过高的密钥可见性。请注意，密钥可见性的环境变量在 EAS 服务器之外不可读，也无法拉到本地用于开发，或用于打包应用 JavaScript 代码进行更新。

### 将 .env 文件添加到 .gitignore

为避免云作业期间出现令人困惑的覆盖以及敏感信息泄露，请将 **.env** 文件添加到 **.gitignore** 文件中。

### 在 `eas update` 中使用 `--environment` 标志

发布更新时，`eas update` 命令必须带上 `--environment` 标志。这样可以确保更新使用与构建作业相同的环境变量。

提供 `--environment` 标志后，`eas update` 将为更新作业使用 EAS 服务器上的环境变量，并忽略项目中常用于本地开发的 **.env** 文件。

### 使用 `eas env:pull` 同步本地开发的环境变量

你可以使用 `eas env:pull` 命令将环境变量从 EAS 服务器拉到本地 **.env** 文件用于开发。为此目的最理想的环境是 `development` 环境，因为它是开发构建使用的默认环境。

### 为构建显式指定环境

在 **eas.json** 中为构建 profile 显式设置 [`environment`](/eas/json#environment) 值，确保构建作业始终使用正确的环境变量，并让你完全掌控这一过程。

## 我可以使用 `eas build` 命令触发构建时在 CI 提供商上设置环境变量吗？

环境变量必须在 EAS 服务器上定义，才能提供给 EAS Build 构建器使用。如果你从 CI 触发构建，同样的规则适用，你应该注意不要把在 GitHub Actions（或你选择的提供商）上设置环境变量与在 EAS 服务器上设置环境变量和密钥混为一谈。

## 环境变量如何作用于我的开发构建？

构建 profile 中设置的、会影响 **app.config.js** 的环境变量将用于配置开发构建。

当你运行 `npx expo start` 在开发构建中加载应用时，只会使用开发机器上可用的环境变量。

## 我可以在 EAS 项目中使用文件类型的环境变量吗？

除了将字符串设为值之外，你还可以上传文件作为环境变量的值。

使用文件环境变量的一个常见场景是：将一个被 git 忽略的 **google-services.json** 配置文件传递给构建作业。作业运行期间，该文件会在项目目录之外的位置创建，文件的路径会赋给环境变量（`GOOGLE_SERVICES_JSON=/path/to/google-services.json`）。例如，你可以将应用配置中的 `android.googleServicesFile` 设置为 `GOOGLE_SERVICES_JSON` 环境变量的值，以便在执行构建或工作流作业时使用此文件。

```js app.config.js
export default {
  /* @hide 省略 ... */ /* @end */
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? '/local/path/to/google-services.json',
    /* @hide 省略 ... */ /* @end */
  },
};
```

## EAS CLI 与 Expo CLI 处理环境变量的差异

使用 Expo 框架与使用 EAS 的环境变量之间的一个区别是：EAS CLI 本身不支持加载 **.env** 文件来在解析应用配置时设置环境变量。相反，建议使用 EAS 环境变量管理系统，通过 EAS CLI 命令为构建作业和更新设置环境变量，以避免混乱，并确保以下两种情况使用完全相同的环境变量：

- 本地应用配置解析，由 EAS CLI 在准备应用配置时完成
- 在 EAS 服务器上运行的远程作业，这些作业通常无法访问被 git 忽略的本地 **.env** 文件

在 **SDK 54 及更早版本**中，`eas update` 是这条规则的一个例外。默认情况下，它会像 [Expo CLI](/guides/environment-variables) 一样（底层执行 `npx expo export` 命令），使用项目目录中的 **.env** 文件为更新作业设置环境变量。在 **SDK 55 或更高版本**中，`--environment` 标志是必需的，`eas update` 只使用 EAS 服务器上设置的环境变量。

对于 SDK 54 或更早版本的项目，你可以使用 `eas update` 命令的 `--environment` 标志来选择启用此行为。

## 在 EAS 中使用环境变量有什么限制吗？

- 环境变量值的大小限制：密钥可见性的环境变量为 32 KiB，其他可见性类型为 4 KiB。
- 每个 Expo 账户最多可创建 150 个账户级环境变量，每个应用最多可创建 200 个项目级环境变量。
- 每个项目的[自定义环境](/eas/environment-variables/manage#自定义环境)限制为 10 个。
- 创建自定义环境时，环境名称可以包含字母、数字、下划线和连字符，长度在 3-100 个字符之间。
