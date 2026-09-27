---
title: 用 EAS Workflows 把 Web 应用部署到 EAS Hosting
description: 学习如何在现有 EAS Workflows 中，把 Web 构建与 Android、iOS 发布一起部署到 EAS Hosting。
---

# 用 EAS Workflows 把 Web 应用部署到 EAS Hosting

前面几章的工作流覆盖了 Android 和 iOS。现在扩展它们，在同一次发布中把 Web 构建也部署到 [EAS Hosting](/eas/hosting/introduction)。

## 学习成果

- 配置 Expo 项目，导出静态 Web 构建
- 在 **preview.yml** 中添加 Web 部署作业，生成非生产环境的 Web 构建
- 在 **production.yml** 中添加 Web 部署作业，生成生产环境的 Web 构建

## EAS Hosting 与 deploy 作业

**EAS Hosting** 是托管和部署 Expo 应用 Web 构建的服务。每次部署都有自己的唯一 URL，一个项目还有一个生产 URL，提供我们最近一次部署到生产环境的内容。

EAS Workflows 中的 [`deploy`](/eas/workflows/pre-packaged-jobs#deploy) 预置作业会运行 Web 导出，把导出步骤的输出上传到 EAS Hosting，并把部署 URL 作为作业输出返回。`deploy` 作业有两个参数：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `prod` | boolean | 可选。若为 `true`，部署到项目的生产 URL。若省略，则作为预览部署。 |
| `alias` | string | 可选。为稳定的别名 URL 命名，例如 `awesome-project--staging.expo.app`。 |

## 为静态导出配置 web.output

在给工作流添加 Web 部署作业之前，需要把 Expo 项目配置为导出[静态 Web 构建](/router/web/static-rendering)。在 **app.json** 中，把 [`web.output`](/versions/latest/config/app#web) 字段设为 `static`：

```json app.json
{
  "expo": {
    // ...
    "web": {
      "output": "static"
    }
  }
}
```

`static` 告诉 Expo CLI 生成一个由静态 HTML、JavaScript 和资源文件组成的目录，供 EAS Hosting 提供。Expo 也支持 `single` 和 `server` 输出；`static` 生成任何主机都能提供的普通文件，这里我们只需要这一点。

用上述配置更新 **app.json** 之后，提交更改并推送到仓库的 `main` 分支。

## 添加 Web 预览部署

设置 `prod: true` 是预览部署和生产部署的区别。预览会得到每次部署唯一的 URL。我们在[第 3 章第 1 步](/tutorial/cicd/preview-builds#1-添加-previewyml)创建了预览工作流。给该工作流添加一个 `deploy_web` 作业，这样每次创建新的预览构建时，也会得到一次新的 Web 部署。

### 1. 添加 deploy_web 作业

打开 **.eas/workflows/preview.yml**，添加一个 `deploy_web` 作业。这个新作业没有 `needs` 依赖，因此会与现有构建作业并行运行。

```yaml .eas/workflows/preview.yml
name: Preview builds

jobs:
  # ... existing fingerprint, get-build, build_android, build_ios, notify jobs

  deploy_web:
    name: Deploy web (preview)
    type: deploy
```

没有 `prod` 参数时，这次部署是非生产版本。每次推送都会得到一个唯一 URL，例如 `https://awesome-project--abc123.expo.app`。

### 2. 把工作流更改推送到仓库

提交对 **preview.yml** 的更改，并推送到 GitHub 仓库的 `main` 分支。EAS Workflows 从默认分支读取工作流文件，因此这一步才会让更改生效。

```sh
git add .eas/workflows/preview.yml && git commit -m 'Add web preview deploy job to preview workflow' && git push origin main
```

### 3. 测试工作流

现在用以下命令手动运行预览工作流：

```sh
eas workflow:run .eas/workflows/preview.yml
```

在 EAS 仪表板上，预览工作流运行会在构建作业旁边显示 `deploy_web` 作业。

![EAS Workflows 预览运行，展示与 Android 和 iOS 构建作业并行运行的 deploy_web 作业。](/static/images/tutorial/cicd/eas-workflows-web-deploy-preview-job.png)

在 **Deploy web (preview)** 下，点击 **View Deployment** 链接，在浏览器中打开已部署的 Web 构建。

![deploy_web 作业输出的 EAS Hosting 部署 URL，展示每次部署唯一的预览 URL。](/static/images/tutorial/cicd/eas-hosting-deployment-url-output.webp)

## 添加 Web 生产部署

[第 6 章第 1 步](/tutorial/cicd/tag-based-releases#1-更改触发器)中的生产工作流会在我们推送新的 Git 标签时运行，并构建或更新原生应用。给该工作流添加一个 `deploy_web` 作业，这样发布应用新版本时，也会更新生产 URL 上的 Web 版本。

### 1. 添加 deploy_web 作业

打开 **.eas/workflows/production.yml**，添加一个 `deploy_web` 作业。这个新作业没有 `needs` 依赖，因此会与现有构建作业并行运行。

```yaml .eas/workflows/production.yml
name: Deploy to production

on:
  push:
    tags: ['v*.*.*']

jobs:
  # ... existing fingerprint, get-build, build, update jobs ...

  deploy_web:
    name: Deploy web (production)
    type: deploy
    params:
      prod: true
```

在上面的工作流中，`['v*.*.*']` 匹配严格的三段语义化版本。`params.prod: true` 会把 Web 应用部署到生产 URL，例如 `https://awesome-project.expo.app`。

### 2. 创建一个标签来测试工作流

把工作流更改提交到仓库的 `main` 分支：

```sh
git add .eas/workflows/production.yml && git commit -m 'Add web production deploy to production workflow' && git push origin main
```

要运行工作流，创建一个新标签并推送到仓库：

```sh
git tag v0.2.0 && git push origin v0.2.0
```

生产工作流现在会在 `v0.2.0` 标签发布时运行。`deploy_web` 作业会把 Web 构建部署到生产 URL。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
