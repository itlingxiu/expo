---
title: 使用本地 HTTPS 开发
description: 了解如何为 Expo Web 应用设置本地 HTTPS。
---

# 使用本地 HTTPS 开发

在本地开发 Expo Web 应用时，你可能需要在本地开发环境中使用 HTTPS，以便测试安全的浏览器 API。本指南说明如何为 Expo Web 应用设置本地 HTTPS。

## 前置条件

- **已安装 `mkcert`** —— `mkcert` 是用于创建开发证书的工具。安装说明见 [`mkcert` GitHub 仓库](https://github.com/FiloSottile/mkcert#installation)。

## 好处

- **团队可扩展**：同一套设置对所有人都适用
- **身份验证支持**：HTTP-Only Cookie 与安全上下文
- **与生产一致**：匹配生产环境的 HTTPS
- **便于共享**：团队内开发 URL 保持一致

## 设置项目

1. 创建或进入你的 Expo 项目：

:::tabs
:::tab npm
```sh
# 如有需要，创建新项目
npx create-expo-app@latest example-app
cd example-app

# 或进入已有项目
cd your-expo-project
```
:::
:::tab yarn
```sh
# 如有需要，创建新项目
yarn create expo-app example-app
cd example-app

# 或进入已有项目
cd your-expo-project
```
:::
:::tab pnpm
```sh
# 如有需要，创建新项目
pnpm create expo-app example-app
cd example-app

# 或进入已有项目
cd your-expo-project
```
:::
:::tab bun
```sh
# 如有需要，创建新项目
bun create expo example-app
cd example-app

# 或进入已有项目
cd your-expo-project
```
:::
:::

2. 启动 Expo 开发服务器：

:::tabs
:::tab npm
```sh
npx expo start --web
```
:::
:::tab yarn
```sh
yarn expo start --web
```
:::
:::tab pnpm
```sh
pnpm expo start --web
```
:::
:::tab bun
```sh
bun expo start --web
```
:::
:::

应用将运行在 `http://localhost:8081`。保持此终端窗口打开。

3. 使用 `mkcert` 为 localhost 生成证书。在项目根目录新开一个终端窗口，运行以下命令：

```sh
mkcert localhost
```

:::tip
安装 `mkcert` 后，请运行 `mkcert -install` 以安装本地证书颁发机构（CA）。
:::

这会在项目根目录生成两个已签名的证书文件：`localhost.pem`（证书）和 `localhost-key.pem`（私钥）。

4. 在项目根目录运行以下命令启动代理：

:::tabs
:::tab npm
```sh
npx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```
:::
:::tab yarn
```sh
yarn dlx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```
:::
:::tab pnpm
```sh
pnpm dlx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```
:::
:::tab bun
```sh
bunx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```
:::
:::

:::tip
[`local-ssl-proxy`](https://github.com/cameronhunter/local-ssl-proxy) 会创建一个代理服务器，把来自 443 端口的 HTTPS 流量转发到 8081 端口上的 Expo 开发服务器。
:::

这会创建一个代理，把来自 443 端口的 HTTPS 流量转发到 8081 端口上的 Expo 开发服务器。

5. 在浏览器中打开 `https://localhost` 访问应用。你的 Expo 应用现在通过 HTTPS 运行。
