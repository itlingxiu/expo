---
title: 不使用 EAS 管理环境变量
description: 了解在 Expo 和 React Native 项目中管理环境变量的非 EAS 方式。
---

# 不使用 EAS 管理环境变量

使用 [EAS 环境变量](/eas/environment-variables)是为云构建和更新管理环境变量的推荐方式，但你仍然可以在本地或使用其他工具完成这项工作。

## 不使用 EAS 管理环境变量

如果你想不使用 EAS 来管理环境变量，可以使用 [`dotenv`](https://www.npmjs.com/package/dotenv)（基于 Node 的加载器）或 [Doppler](https://www.doppler.com/) 等服务来注入环境变量。这些工具允许你创建 **.env** 文件，并在其中存储环境变量。

:::note
如果你不使用 EAS 管理环境变量，请避免把密钥提交到 **.env** 文件。
:::

## 环境变量如何加载

创建 **.env** 文件之后，需要确保该文件没有列在 **.gitignore** 或 **.easignore** 中。这样 `eas build`、`eas update` 等 EAS 命令才能读取它。

**.env** 文件按照[标准 **.env** 文件](https://github.com/bkeepers/dotenv/blob/c6e583a/README.md#what-other-env-files-can-i-use)的解析规则加载，然后把代码中对 `process.env.EXPO_PUBLIC_[VARIABLE_NAME]` 的所有引用替换为 **.env** 文件中设置的对应值。出于安全考虑，**node_modules** 目录中的代码不受影响。

**从 .env 文件读取环境变量**

更多信息请参阅 Expo CLI 如何从 .env 文件读取环境变量。

[从 .env 文件读取环境变量](/guides/environment-variables#从-env-文件读取环境变量)

## 将 .env 文件与 EAS Hosting 一起使用

将 **.env** 文件与 EAS Hosting 一起使用时，带 `EXPO_PUBLIC_` 前缀的环境变量在客户端代码和服务端代码中都可用。不带 `EXPO_PUBLIC_` 前缀的变量只在服务端代码中可用。

[纳入客户端和服务端环境变量的步骤](/eas/environment-variables/usage#存储环境变量)与使用 EAS 环境变量时相同。因此，在运行 `npx expo export` 命令之前，需要确保本地 **.env** 文件包含正确的环境变量。
