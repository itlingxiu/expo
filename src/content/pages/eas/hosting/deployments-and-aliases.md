---
title: 分配别名并提升到生产
description: 了解部署 URL，以及如何设置别名。
---

# 分配别名并提升到生产

## 部署

部署到 EAS Hosting 的内容是不可变的。每个部署都可以通过唯一的部署 URL 访问，该 URL 由预览子域名和部署 ID 组成。

### 预览子域名

要为项目启用 EAS Hosting，你需要选择一个**预览子域名**。可以在 [expo.dev](https://expo.dev) 网站上项目的 **Hosting** 部分完成。或者，当你使用 EAS CLI 创建第一次部署时，系统也会提示你选择预览子域名。

### 预览 URL 与生产 URL

**预览子域名**是应用预览 URL 的前缀。例如，如果你选择 `my-app` 作为预览子域名，预览 URL 会是：`https://my-app--or1170q9ix.expo.app/`，生产 URL 会是：`https://my-app.expo.app/`。

### 部署 ID

每个部署都可以用唯一的部署 ID 标识。这个 ID 可以自定义，但默认是一串随机的字母和数字。

部署是不可变的。一旦部署完成，就不能再更改，并且始终可以通过其部署 ID 访问和识别。

## 别名

别名是用户定义的值，用于为部署创建自定义 URL。

要创建部署并把它分配给一个别名，使用 `--alias` 选项：

```sh
eas deploy --alias hello
```

上面的命令会创建一个部署，它既有标准 URL `https://my-app--or1170q9ix.expo.app/`，也有别名 URL `https://my-app--hello.expo.app/`。

> 别名在每个项目内是唯一的。如果你选择的别名已经在使用，它会被重新分配给新的部署。

单个部署可以有多个别名。也可以用 `--id` 选项把别名分配给已有部署：

```sh
eas deploy:alias --id=my-id
```

在上面的命令中，`my-id` 是预览 URL 中的 ID。

别名可以是任意名称。例如，如果你想创建 staging 环境，可以创建一个名为 `staging` 的别名，并把某个部署分配给它。

### 生产别名

如果你的预览子域名是 `my-app`，生产 URL 将是 `https://my-app.expo.app/`。

与其他别名类似，可以使用 `--prod` 选项把部署提升到生产：

```sh
eas deploy --prod
```

也可以用部署 ID 和 `--id` 选项把已有部署提升到生产：

```sh
eas deploy:alias --prod --id=deploymentId
```

## 术语

在下面的例子中，选择 `my-app` 作为预览子域名：

- `https://my-app--or1170q9ix.expo.app/`：预览 URL，它是唯一的，也是你的部署所在的地址。
  - `my-app`：预览子域名。与项目绑定的全局唯一前缀。
  - `or1170q9ix`：部署 ID，对该部署唯一。
- `https://my-app--hello.expo.app/`：带别名的部署 URL。
  - `hello`：用户定义的别名。
- `https://my-app.expo.app/`：生产部署 URL。

## 常见问题

### EAS Hosting 是否提供独立 IP 地址？

不提供。EAS Hosting 使用 **SNI（Server Name Indication）**，这意味着 IP 地址是共享的，不会专用于单个项目。
