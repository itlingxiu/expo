---
title: 使用 Git 子模块
description: 了解如何配置 EAS Build 以使用 Git 子模块。
---

# 使用 Git 子模块

使用默认的版本控制系统（VCS）工作流时，工作目录的内容会按原样上传到 EAS Build，其中也包括 Git 子模块的内容。不过，如果你在 CI 上构建，或者在 **eas.json** 中把 `cli.requireCommit` 设为 `true`，或者子模块位于私有仓库，就需要先初始化子模块，以免上传空目录。

## 子模块初始化

要在 EAS Build 构建器上初始化子模块：

1. 创建一份[密钥](/eas/environment-variables#visibility-settings-for-environment-variables)，内容为经过 base64 编码的私钥，且该密钥有权访问子模块仓库。

2. 添加 [`eas-build-pre-install` npm 钩子](/build-reference/npm-hooks) 来检出这些子模块，例如：

   ```bash eas-build-pre-install.sh
   #!/usr/bin/env bash

   mkdir -p ~/.ssh

   # 打包过程中会丢失真实的 origin URL，因此如果你的
   # 子模块在 .gitmodules 里使用相对 URL 定义，
   # 就需要用下面的命令恢复：
   #
   # git remote set-url origin git@github.com:example/repo.git

   # 从环境变量恢复私钥并生成公钥
   umask 0177
   echo "$SSH_KEY_BASE64" | base64 -d > ~/.ssh/id_rsa
   umask 0022
   ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

   # 把 Git 托管方加入已知主机列表
   ssh-keyscan github.com >> ~/.ssh/known_hosts

   git submodule update --init
   ```
