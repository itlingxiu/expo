---
title: 部署你的第一个 Expo Router 与 React 应用
description: 了解如何把 Expo Router 和 React 应用部署到 EAS Hosting。
---

# 部署你的第一个 Expo Router 与 React 应用

EAS Hosting 是一项 React 托管服务，可以把导出的 Expo Web 构建部署到预览或生产 URL。

本指南会带你完成创建第一次 Web 部署的过程。

> 视频：[部署你的 Expo Router Web 项目](https://www.youtube.com/watch?v=NaKsfWciJLo)。为 Expo Router Web 项目设置 EAS Hosting，创建第一次部署，并让预览 URL 运行起来。

## 前置条件

- **一个 Expo 账户**

  任何拥有 Expo 账户的人都可以使用 EAS Hosting，无论你是否为 EAS 付费，或使用 Free 方案。可以在 [expo.dev/signup](https://expo.dev/signup) 注册。

  付费订阅者可以创建更多部署，拥有更多带宽、存储和请求额度，并且可以设置自定义域名。不同方案及其权益见 [EAS 定价](https://expo.dev/pricing#host)。

- **一个 Expo Router Web 项目**

  还没有项目？创建一个可以配合本指南使用的 “Hello world” 应用很快也很简单。运行以下命令创建新项目：

:::tabs
:::tab npm
```sh
npx create-expo-app@latest my-app
```
:::
:::tab yarn
```sh
yarn create expo-app my-app
```
:::
:::tab pnpm
```sh
pnpm create expo-app my-app
```
:::
:::tab bun
```sh
bun create expo my-app
```
:::
:::

1. **安装最新的 EAS CLI**

   EAS CLI 是你将在终端中用来与 EAS 服务交互的命令行应用。运行以下命令安装：

:::tabs
:::tab npm
```sh
npm install --global eas-cli
```
:::
:::tab yarn
```sh
yarn global add eas-cli
```
:::
:::tab pnpm
```sh
pnpm add --global eas-cli
```
:::
:::tab bun
```sh
bun add --global eas-cli
```
:::
:::

   你也可以用上面的命令检查是否有新版本的 EAS CLI。我们建议你始终使用最新版本。

   > 我们建议使用 `npm` 而不是 `yarn` 做全局包安装。你也可以改用 `npx eas-cli@latest`。文档中凡是需要调用 `eas` 的地方，都记得改用它。

2. **登录你的 Expo 账户**

   如果你已经用 Expo CLI 登录了 Expo 账户，可以跳过本节所述的步骤。如果还没有，运行以下命令登录：

   ```sh
   eas login
   ```

   可以运行 `eas whoami` 检查是否已登录。

3. **准备你的项目**

   对于应用配置文件中的 [`expo.web.output`](/versions/latest/config/app#output)，决定把它设为 `single`、`static` 还是 `server`。

   - `single`：把 Expo 应用导出为只有一个 `index.html` 输出的单页应用
   - `static`：把 Expo 应用导出为[静态生成的 Web 应用](/router/web/static-rendering)
   - `server`：除静态页面外，还支持应用的[服务器函数](/guides/server-components#react-服务器函数)和 [API 路由](/router/web/api-routes)

   > 如果还不确定需要哪种输出模式，不必担心，你以后随时可以更改这个值并重新部署。

4. **导出你的应用**

   你需要把 Web 项目导出到 **dist** 目录。为此，运行：

:::tabs
:::tab npm
```sh
npx expo export --platform web
```
:::
:::tab yarn
```sh
yarn expo export --platform web
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web
```
:::
:::tab bun
```sh
bun expo export --platform web
```
:::
:::

   > 记得在每次部署之前重新运行此命令。

5. **部署你的应用**

   现在把网站发布到 EAS Hosting：

   ```sh
   eas deploy
   ```

   第一次运行此命令时，它会：

   1. 如果你还没有关联 EAS 项目，提示你关联一个
   2. 要求你选择预览子域名

   :::note
   **预览子域名**是应用预览 URL 的前缀。例如，如果你选择 `my-app` 作为预览子域名，预览 URL 会类似这样：`https://my-app--or1170q9ix.expo.app/`，生产 URL 会是：`https://my-app.expo.app/`。
   :::

   部署完成后，CLI 会输出已部署应用的预览 URL，以及 EAS 仪表盘上该部署详情的链接。
