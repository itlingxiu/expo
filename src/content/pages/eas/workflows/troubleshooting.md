---
title: 排查 EAS Workflows 问题
description: 了解如何诊断并修复运行 EAS Workflows 时的常见问题。
---

# 排查 EAS Workflows 问题

本页列出常见的 EAS Workflows 失败模式以及如何修复它们。如果工作流没有启动或作业失败，请从项目[工作流页面](https://expo.dev/accounts/[account]/projects/[projectName]/workflows)上该次工作流运行的详情页开始。它显示每个作业的状态、日志和错误。

## 校验工作流文件

在运行之前检查工作流文件的 YAML 语法和 schema 错误：

```sh
eas workflow:validate .eas/workflows/my-workflow.yml
```

该命令也会校验工作流从其步骤或钩子调用的任何[自定义函数](/eas/workflows/custom-functions)。

[Expo Tools VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)也会在你编辑工作流文件时提供说明和自动补全。

## 工作流不会在 GitHub 事件上启动

如果带有 [`on` 触发器](/eas/workflows/syntax#on) 的工作流从未启动，请检查以下各项：

- **GitHub 连接**：`push`、`pull_request` 和 `ref_delete` 等触发器要求你的 EAS 项目[关联到 GitHub 仓库](/eas/workflows/get-started#用-github-事件自动化工作流)。
- **工作流文件位置和 ref**：文件必须位于 **.eas/workflows** 目录内。对于 `push` 和 `pull_request` 事件，EAS 从触发提交读取工作流文件，因此该文件必须存在于该分支上。对于 `schedule` 和 `ref_delete` 事件，EAS 从默认分支读取工作流文件。
- **触发器筛选**：`branches`、`tags`、`paths`、`types` 和 `labels` 筛选必须与事件匹配。例如，`on.push.branches: ['main']` 会忽略对其他所有分支的推送。
- **提交消息跳过标记**：当提交消息包含 `[eas skip]`、`[skip eas]` 或 `[no eas]` 时，由 `push` 和 `pull_request` 事件触发的运行会被跳过。
- **定时工作流**：`on.schedule` 工作流只从仓库的默认分支运行，在 GMT 时区运行，并且在高负载期间可能会延迟。

## 构建作业失败并提示 “Missing build profile in eas.json”

预置的[构建作业](/eas/workflows/pre-packaged-jobs#build)要求它们使用的构建 profile 存在于项目的 **eas.json** 中。除非作业的 `params.profile` 另有说明，构建作业使用 `production` profile，因此空的或缺失的 **eas.json** 会因此错误而失败。

把该 profile 添加到 **eas.json**，或运行 `eas build:configure` 以生成带有默认 profile 的文件。构建还需要每个平台的应用签名凭据。用 EAS CLI 以相同平台和 profile 完成一次构建会同时设置这两者。见[创建你的第一次构建](/build/setup)。

## 环境变量为空或缺失

[EAS 环境变量](/eas/environment-variables)的作用域是一个环境：`production`、`preview` 或 `development`。作业只能看到由其 [`environment` 键](/eas/workflows/syntax#jobsjob_idenvironment)设置的环境中的变量，该键默认为 `production`。如果作业中的某个变量为空，请确认该变量存在于作业使用的环境中，或把作业的 `environment` 设为与变量定义所在的环境匹配。

还要注意，[`env` 键](/eas/workflows/syntax#jobsjob_idenv)在 `apple-device-registration-request`、`branch-delete`、`doc`、`get-build`、`github-comment`、`require-approval` 和 `slack` 作业上不可用。

## 更多帮助

如果仍然卡住，请把工作流文件和失败运行的链接通过电子邮件发送到 [workflows@expo.dev](mailto:workflows@expo.dev)，或在 [Expo Discord](https://chat.expo.dev/) 中提问。
