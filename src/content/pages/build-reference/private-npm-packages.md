---
title: 使用私有 npm 包
description: 了解如何配置 EAS Build 以使用私有 npm 包。
---

# 使用私有 npm 包

EAS Build 完全支持在项目中使用私有 npm 包。这些包可以发布到 npm（如果你有 [Pro/Teams 方案](https://www.npmjs.com/products)），也可以发布到私有 registry（例如自托管的 [Verdaccio](https://verdaccio.org/)）。

开始构建之前，你需要配置项目，以便向 EAS Build 提供 npm 令牌。

## 默认 npm 配置

默认情况下，EAS Build 使用自托管的 npm 缓存，以加快所有构建的依赖安装。每个 EAS Build 构建器都会为各平台配置一份 **.npmrc** 文件：

### Android

```ini
registry=http://npm-cache-service.worker-infra-production.svc.cluster.local:4873
```

### iOS

```ini
registry=http://10.254.24.8:4873
```

## 发布到 npm 的私有包

如果项目使用发布到 npm 的私有包，你需要向 EAS Build 提供[只读 npm 令牌](https://docs.npmjs.com/about-access-tokens)，以便成功安装依赖。

推荐做法是把 `NPM_TOKEN` 密钥添加到账户或项目的密钥中：

![已填写的密钥创建界面。](/static/images/eas-build/environment-secrets/secrets-create-filled.png)

具体做法参见[密钥环境变量](/eas/environment-variables/manage#create-variables-in-the-dashboard)。

当 EAS 在构建期间检测到可用的 `NPM_TOKEN` 环境变量时，会自动创建如下 **.npmrc**：

```ini .npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
```

不过，这只在项目根目录没有 **.npmrc** 时发生。如果你已经有该文件，需要手动更新它。

你可以查看构建日志，并找到 **Prepare project** 构建阶段，以确认是否生效：

![构建日志中显示已创建 .npmrc。](/static/images/eas-build/npmrc.png)

## 发布到私有 registry 的包

如果你使用自托管 [Verdaccio](https://verdaccio.org/) 这类私有 npm registry，需要手动配置 **.npmrc**。

在项目根目录创建 **.npmrc** 文件，内容如下：

```ini .npmrc
registry=__REPLACE_WITH_REGISTRY_URL__
```

如果 registry 需要身份验证，你需要提供令牌。例如，如果 registry URL 是 `https://registry.johndoe.com/`，则把文件更新为：

```ini .npmrc
//registry.johndoe.com/:_authToken=${NPM_TOKEN}
registry=https://registry.johndoe.com/
```

## 同时使用私有 npm 包和私有 registry

> 这是一个进阶示例。

私有 npm 包始终是[带作用域的](https://docs.npmjs.com/about-scopes#scopes-and-package-visibility)。例如，如果你的 npm 用户名是 `johndoe`，私有自托管 registry 的 URL 是 `https://registry.johndoe.com/`。如果要从两个来源都安装依赖，请在项目根目录创建 **.npmrc**，内容如下：

```ini .npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@johndoe:registry=https://registry.npmjs.org/
registry=https://registry.johndoe.com/
```

## 私有仓库中的子模块

如果私有仓库中有子模块，你需要通过设置 SSH 密钥来初始化它。更多信息参见[子模块初始化](/build-reference/git-submodules#子模块初始化)。
