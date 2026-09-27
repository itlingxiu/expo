---
title: 发布网站
description: 了解如何为生产环境部署 Expo 网站。
---

# 发布网站

Expo Web 应用可以在本地提供，以测试生产行为，也可以部署到托管服务。我们建议部署到 [EAS Hosting](/eas/hosting)，以获得最好的功能支持。你也可以自行托管或使用第三方服务。

- [用 EAS 即时部署](/eas/hosting/get-started) —— EAS Hosting 是部署 Web 应用的最佳方式，支持自定义域名、SSL 等。

> 对于 SDK 49 及更早版本，你可能需要[发布 `webpack` 构建的指南](/archive/publishing-websites-webpack)。

## 输出目标

可以在[应用配置](/workflow/configuration)中配置 [`web.output`](/versions/latest/config/app#output) 目标，以设置 Web 应用的导出方法：

```json app.json
{
  "expo": {
    "web": {
      "output": "server",
      "bundler": "metro"
    }
  }
}
```

Expo Router 为 Web 应用支持三种输出目标。

| 输出 | Expo Router | API 路由 | 说明 |
| --- | --- | --- | --- |
| `single`（默认） | 是 | 否 | 输出单页应用（SPA），输出目录中有单个 **index.html**，没有可静态索引的 HTML。 |
| `server` | 是 | 默认启用 | 创建 **client** 和 **server** 目录。客户端文件输出为单独的 HTML 文件。API 路由输出为单独的 JavaScript 文件，以便用自定义 Node.js 服务器托管。 |
| `static` | 是 | 选择启用 | 为 **app** 目录中的每条路由输出单独的 HTML 文件。 |

在 SDK 58 及更高版本中，在 `expo-router` 配置插件中设置 `apiRoutes: true`，即可在 `static` 输出下启用 API 路由。使用 `server` 输出时，API 路由默认启用。在任一模式下设置 `apiRoutes: false` 可禁用它们。配置与部署要求见 [API 路由](/router/web/api-routes#create-an-api-route)。

:::note
对于 `static` 和 `server` 输出模式，可以通过 `expo-router` 插件配置应用于所有路由响应的[全局 HTTP 头](/router/web/server-headers)。
:::

## 创建构建

创建项目构建是发布 Web 应用的第一步。无论你想在本地提供还是部署到托管服务，都需要导出项目的全部 JavaScript 和资源。这称为静态 bundle。可以通过运行以下命令导出。

运行通用导出命令，为 Web 编译项目：

:::tabs
:::tab npm
```sh
npx expo export -p web
```
:::
:::tab yarn
```sh
yarn expo export -p web
```
:::
:::tab pnpm
```sh
pnpm expo export -p web
```
:::
:::tab bun
```sh
bun expo export -p web
```
:::
:::

生成的项目文件位于 **dist** 目录。**public** 目录中的任何文件也会复制到 **dist** 目录。

:::warning
`/assets` 等某些路径被 Metro 保留。避免把文件放在 **public/assets/** 或其他保留路径中。完整列表见[保留路径](/router/reference/reserved-paths)。
:::

## 在本地提供

使用 `npx expo serve` 快速在本地测试网站在生产中将如何托管。运行以下命令来提供静态 bundle：

:::tabs
:::tab npm
```sh
npx expo serve
```
:::
:::tab yarn
```sh
yarn expo serve
```
:::
:::tab pnpm
```sh
pnpm expo serve
```
:::
:::tab bun
```sh
bun expo serve
```
:::
:::

打开 [`http://localhost:8081`](http://localhost:8081) 查看项目效果。这是**仅 HTTP**，因此权限、相机、位置以及许多其他安全功能可能无法按预期工作。

## 使用 EAS 托管

准备好进入生产环境时，可以用 EAS CLI 即时部署网站。

- [用 EAS 即时部署](/eas/hosting/get-started) —— EAS Hosting 是部署 Web 应用的最佳方式，支持自定义域名、SSL 等。

## 在第三方服务上托管

### Netlify

[Netlify](https://www.netlify.com/) 是一个大体上不预设框架的 Web 应用部署平台。它与 Expo Web 应用的兼容性最高，因为对框架做的假设很少。

#### 使用 Netlify CDN 手动部署

1. 运行以下命令安装 Netlify CLI：

:::tabs
:::tab npm
```sh
npm install --global netlify-cli
```
:::
:::tab yarn
```sh
yarn global add netlify-cli
```
:::
:::tab pnpm
```sh
pnpm add --global netlify-cli
```
:::
:::tab bun
```sh
bun add --global netlify-cli
```
:::
:::

2. 为单页应用配置重定向。

> 如果应用使用[静态渲染](/router/web/static-rendering)，可以跳过此步骤。

`expo.web.output: 'single'` 会生成单页应用。这意味着只有一个 **dist/index.html** 文件，所有请求都必须重定向到它。在 Netlify 中可以创建 **./public/\_redirects** 文件，把所有请求重定向到 **/index.html**。

```sh public/_redirects
/*    /index.html   200
```

如果修改此文件，必须用 `npx expo export -p web` 重新构建项目，才能安全地把它复制到 **dist** 目录。

3. 运行以下命令部署 Web 构建目录：

```sh
netlify deploy --dir dist
```

你会看到一个 URL，可以用它在线查看项目。

#### 持续交付

推送到 git 或打开新的拉取请求时，Netlify 也可以构建并部署：

- [开始一个新的 Netlify 项目](https://app.netlify.com/signup)。
- 选择 Git 托管服务并选择仓库。
- 点击 **Build your site**。

### Vercel

[Vercel](https://vercel.com/) 有单命令部署流程。

1. 安装 [Vercel CLI](https://vercel.com/docs/cli)。

:::tabs
:::tab npm
```sh
npm install --global vercel@latest
```
:::
:::tab yarn
```sh
yarn global add vercel@latest
```
:::
:::tab pnpm
```sh
pnpm add --global vercel@latest
```
:::
:::tab bun
```sh
bun add --global vercel@latest
```
:::
:::

2. 为单页应用配置重定向。

在应用根目录创建 **vercel.json** 文件并添加以下配置：

```json vercel.json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist",
  "devCommand": "expo",
  "cleanUrls": true,
  "framework": null,
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/"
    }
  ]
}
```

如果应用使用[静态渲染](/router/web/static-rendering)，你可能希望添加额外的[动态路由配置](/router/web/static-rendering#dynamic-routes)。

3. 部署网站。

```sh
vercel
```

现在你会看到一个 URL，可以用它在线查看项目。构建完成后把该 URL 粘贴到浏览器，就能看到已部署的应用。

### AWS Amplify Console

[AWS Amplify Console](https://console.amplify.aws) 提供基于 Git 的工作流，用于持续部署和托管全栈无服务器 Web 应用。Amplify 从仓库而不是从你的电脑部署 PWA。本指南使用 GitHub 仓库。开始之前，请[在 GitHub 上创建新仓库](https://github.com/new)。

1. 把 [**amplify-explicit.yml**](https://github.com/expo/amplify-demo/blob/master/amplify-explicit.yml) 文件添加到仓库根目录。确保已从 **.gitignore** 文件中移除生成的 **dist** 目录，并提交这些更改。

2. 把本地 Expo 项目推送到 GitHub 仓库。如果还没有推送到 GitHub，遵循 [GitHub 把现有项目添加到 GitHub 的指南](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)。

3. 登录 [Amplify Console](https://console.aws.amazon.com/amplify/home)，选择现有应用或创建新应用。授予 Amplify 从你的 GitHub 账户或拥有该仓库的组织读取的权限。

4. 添加仓库，选择分支，并选择 **Connecting a monorepo?** 以输入应用 **dist** 目录的路径，然后选择 **Next**。

Amplify Console 会检测到项目中的 **amplify.yml** 文件。选择 **Allow AWS Amplify to automatically deploy all files hosted in your project root directory**，然后选择 **Next**。

5. 检查设置并选择 **Save and deploy**。应用现在会部署到 `https://branchname.xxxxxx.amplifyapp.com` URL。你现在可以访问 Web 应用、部署另一个分支，或在 Expo 移动应用和 Web 应用之间添加统一的后端环境。

按照 **Learn how to get the most out of Amplify Hosting** 下拉菜单中的步骤，**添加带免费 SSL 证书的自定义域名**以及更多信息。

### Firebase Hosting

[Firebase Hosting](https://console.firebase.google.com/) 是面向 Web 项目的生产级 Web 内容托管。

1. 用 [Firebase Console](https://console.firebase.google.com) 创建 Firebase 项目，并按照这些[说明](https://firebase.google.com/docs/hosting)安装 Firebase CLI。

2. 使用 CLI，运行以下命令登录 Firebase 账户：

```sh
firebase login
```

3. 然后运行以下命令初始化 Firebase 项目以进行托管：

```sh
firebase init
```

设置取决于你如何构建 Expo 网站：

1. 询问公共路径时，务必指定 **dist** 目录。
2. 提示 **Configure as a single-page app (rewrite all urls to /index.html)** 时，只有在使用了 `web.output: "single"`（默认）时才选择 **Yes**。否则选择 **No**。

4. 在 **package.json** 现有的 `scripts` 属性中添加 `predeploy` 和 `deploy` 属性。各自的值如下：

```json package.json
"scripts": {
  /* @hide 省略 ... */ /* @end */
  "predeploy": "expo export -p web",
  "deploy-hosting": "npm run predeploy && firebase deploy --only hosting",
}
```

5. 要部署，运行以下命令：

:::tabs
:::tab npm
```sh
npm run deploy-hosting
```
:::
:::tab yarn
```sh
yarn run deploy-hosting
```
:::
:::tab pnpm
```sh
pnpm run deploy-hosting
```
:::
:::tab bun
```sh
bun run deploy-hosting
```
:::
:::

从控制台输出中打开 URL 以检查部署，例如：`https://project-name.firebaseapp.com`。

如果要更改托管的响应头，在 **firebase.json** 的 `hosting` 部分添加以下配置：

```json firebase.json
  "hosting": [
    {
      /* @hide 省略 ... */ /* @end */
      "headers": [
        {
          "source": "/**",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache, no-store, must-revalidate"
            }
          ]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|eot|otf|ttf|ttc|woff|woff2|font.css)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "max-age=604800"
            }
          ]
        }
      ],
    }
  ]
```

### GitHub Pages

[GitHub Pages](https://pages.github.com/) 允许你直接从 GitHub 仓库发布网站。

1. 先在项目中初始化新的 git 仓库，并配置它推送到 GitHub 仓库。如果已经在与 GitHub 仓库同步更改，跳过此步骤。

在 GitHub 网站上创建仓库。然后在项目根目录运行以下命令：

```sh
git init

git remote add origin https://github.com/username/expo-gh-pages.git
```

上面的命令会初始化新的 Git 仓库，并配置它把源码推送到指定的 GitHub 仓库。

2. 把 `gh-pages` 包安装为项目的开发依赖：

:::tabs
:::tab npm
```sh
npm install --save-dev gh-pages
```
:::
:::tab yarn
```sh
yarn add -D gh-pages
```
:::
:::tab pnpm
```sh
pnpm add -D gh-pages
```
:::
:::tab bun
```sh
bun add -D gh-pages
```
:::
:::

3. 要部署项目，在[应用配置](/workflow/configuration)中用 [`baseUrl`](/versions/latest/config/app#baseurl) 属性把它配置到子路径。把它的值设为字符串 `/repo-name`。

例如，如果 GitHub 仓库是 `expo-gh-pages`，[实验性 `baseUrl` 属性](/more/expo-cli#hosting-with-sub-paths)的值如下：

```json app.json
{
  "expo": {
    "experiments": {
      "baseUrl": "/expo-gh-pages"
    }
  }
}
```

4. 修改 **package.json** 文件中的 `scripts`，添加 `predeploy` 和 `deploy` 脚本。各自有自己的值：

```json package.json
"scripts": {
 /* @hide 省略 ... */ /* @end */
  "deploy": "gh-pages --nojekyll -d dist",
  "predeploy": "expo export -p web"
}
```

由于 Expo 在生成的文件中使用下划线，需要用 `--nojekyll` 标志禁用 Jekyll。

5. 要生成 Web 应用的生产构建并部署到 GitHub Pages，运行以下命令：

:::tabs
:::tab npm
```sh
npm run deploy
```
:::
:::tab yarn
```sh
yarn run deploy
```
:::
:::tab pnpm
```sh
pnpm run deploy
```
:::
:::tab bun
```sh
bun run deploy
```
:::
:::

这会把 Web 应用的构建发布到 GitHub 仓库的 `gh-pages` 分支。该分支只包含 **dist** 目录中的构建产物，以及 `gh-pages` 生成的 **.nojekyll** 文件。它不包含开发源码。

6. Web 应用已发布到 `gh-pages` 分支后，配置 GitHub Pages 从该分支提供应用。

- 前往 GitHub 仓库的 **Settings** 标签页。
- 向下滚动到 **Pages** 部分。
- 确保 **Source** 设为 **Deploy from a branch**。
- 在 **Branch** 部分，选择 **gh-pages** 和 **root** 目录。
- 点击 **Save**。

![仓库设置中的 GitHub Pages 配置](/static/images/distribution/publishing-websites-github-pages-config.webp)

7. Web 应用发布并且 GitHub Pages 配置完成后，一个 GitHub Action 会部署你的网站。可以前往仓库的 **Actions** 标签页监控进度。完成后，Web 应用将在 URL `http://username-on-github.github.io/repo-name` 可用。

对于后续部署和更新，运行 `deploy` 命令，GitHub Action 会自动开始更新 Web 应用。
