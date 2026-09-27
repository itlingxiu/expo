---
title: 代理故障排除
description: 了解如何使用一组推荐工具排查代理问题。
---

# 代理故障排除

## macOS 代理配置（Sierra）

> 如果出现任何问题，可以在系统网络偏好设置中使用自动代理配置 `your-corporate-proxy-uri:port-number/proxy.pac`，恢复为“自动代理设置”。

### 概述

要在公司 Wi-Fi 网络下于本地 iOS 模拟器中运行，需要一个本地代理管理器。可以使用 [Charles](https://charlesproxy.com) 这类本地代理应用。

#### 打开 macOS 网络偏好设置

1. 打开 Mac 的 `系统偏好设置`（苹果菜单 > 系统偏好设置）。
2. 进入“网络”。
3. 确认 `位置` 设置为你的代理网络，而不是“自动”。
4. 在左侧选中 Wi-Fi 和/或以太网连接，点击窗口右下角的 `高级...`。

#### 配置代理地址

1. 如果已勾选“自动代理配置”，请取消勾选并禁用它。
2. 勾选“Web 代理 (HTTP)”，并将“Web 代理服务器”设置为 127.0.0.1 : 8888
3. 勾选“安全 Web 代理 (HTTPS)”，并将“安全 Web 代理服务器”设置为 127.0.0.1 : 8888

### 配置 `Charles`

1. 打开 Charles
2. 如果它询问是否允许管理 macOS 网络配置，不要允许，前面的步骤已经完成了这一步。（如果更改了 Charles 的端口，请把上一步中的默认端口 8888 更新为正确端口）
3. 在 Charles 菜单中进入 `Proxy > External Proxy Settings`，勾选 `Use external proxy servers`
4. 勾选 `Web Proxy (HTTP)`，并输入 `your-corporate-proxy-uri:port-number`
5. 勾选 `Proxy server requires a password`
6. Domain: YOUR DOMAIN,
   Username: YOUR USERNAME
   Password: YOUR PASSWORD
7. 对 Secure Web Proxy (HTTPS) 做同样的设置。务必填写相同的代理、用户名和密码地址字段。
8. 在 `Bypass external proxies for the following hosts:` 的文本区域中输入：

   ```text
   localhost
   *.local
   ```

   你可能还需要加入邮件服务器或其他公司网络地址。

9. 勾选 “Always bypass external proxies for localhost”

### iOS 模拟器配置

如果已有一套无法正常工作的 iOS 模拟器自定义设置，请从菜单选择 “Simulator > Reset Content and Settings”。

如果模拟器仍然打开，请退出它。

然后，在 Charles 的 “Help” 菜单中选择 Install Charles Root Certificate，再选择一次 Install Charles Root Certificate in iOS Simulators。

:::note
**技术说明：** 整个流程是必需的，因为 iOS 模拟器拿到的是一份有问题的代理证书，而不是真正的证书，并且不允许它用于运行 Expo 所必需的 https://exp.host/。

**另外：** 把需要访问互联网的应用（例如 Spotify）配置为使用 http://localhost:8888 作为代理。Chrome 和 Firefox 等部分应用可以在设置中配置为使用“系统网络偏好设置”，从而根据苹果菜单/网络偏好设置中的“位置”使用 Charles : 8888，或不使用代理。如果设置为“自动”，则不使用代理；如果设置为“你的代理网络”，则会使用代理，并且 Charles 需要处于运行状态。
:::

## 命令行应用的代理配置

npm、git、Brew、Curl 以及其他命令行应用也需要代理访问。

### 针对 npm

打开 `~/.npmrc` 并设置：

```ini .npmrc
http_proxy=http://localhost:8888
https_proxy=http://localhost:8888
```

### 针对 git

打开 `~/.gitconfig` 并设置：

```ini .gitconfig
[http]
  proxy = http://localhost:8888
[https]
  proxy = http://localhost:8888
```

### 针对命令行应用

根据你的 shell 和配置，打开 `~/.bashrc`、`~/.bash_profile`、`~/.zshrc`，或你设置 shell 变量的任何文件，并设置：

```bash
export HTTP_PROXY="http://localhost:8888"
export http_proxy="http://localhost:8888"
export ALL_PROXY="http://localhost:8888"
export all_proxy="http://localhost:8888"
export HTTPS_PROXY="http://localhost:8888"
export https_proxy="http://localhost:8888"
```

> 如果把网络位置切换回“自动”以便使用 npm 或 git，需要在希望禁用的行前面加上 `#` 来注释掉这些行。如果你更喜欢，也可以改用命令行代理管理器。
