---
title: 运行你的第一个 EAS Workflows 作业
description: 通过创建工作流文件、作业、触发器，并把作业串联起来，学习 EAS Workflows 的基础。
---

# 运行你的第一个 EAS Workflows 作业

在本章中，我们创建第一个 EAS Workflows 作业。

## 学习成果

- 创建并运行一个自定义工作流，向 EAS 仪表板打印一条消息
- 设置自动触发器，使每次推送到 `main` 都会运行该工作流
- 把多个作业串联起来，让一个作业的输出成为下一个作业的输入
- 在 EAS 仪表板中阅读工作流日志和作业图

## 工作流文件如何工作

工作流文件是存放在项目 **.eas/workflows/** 目录中的 YAML 文件。每个文件定义要运行的作业，以及每个作业所遵循的步骤。

> 示意图展示了工作流中的作业类型：预置作业通过 `type` 告诉 EAS 执行哪一种操作；自定义作业则用 `steps` 和 `run` 编写自己的命令。

一个工作流文件包含一个或多个作业，以及一个可选的触发器。运行时，EAS 读取该文件、准备环境，并在该环境中执行作业。

## EAS Workflows 中的作业类型

EAS Workflows 有两类作业：

- **预置作业：** 这类作业使用 `type` 字段。它告诉 EAS 要运行哪种操作，例如 `build`、`submit` 或 `update`。随后 EAS 会运行该操作预先配置好的步骤。
- **自定义作业：** 这类作业使用 `steps`，而不是 `type` 字段。我们用 `run` 为每个步骤编写自己的命令。自定义作业让我们可以控制工作流运行时发生什么，以及何时运行某条特定命令。

## 创建我们的第一个工作流

用一个自定义作业创建第一个工作流，并在 EAS 上运行它。

### 1. 创建工作流目录

在 Expo 项目根目录创建 **.eas/workflows/** 目录。EAS 只在这个位置查找工作流文件。

```sh
mkdir -p .eas/workflows
```

### 2. 添加 hello.yml 文件

在 **.eas/workflows/** 中创建一个名为 **hello.yml** 的文件。该文件用一个自定义作业定义我们的第一个工作流。作业运行一条 shell 命令，打印 `"Hello, Workflows"`：

```yaml .eas/workflows/hello.yml
name: Hello

jobs:
  greet:
    steps:
      - run: echo "Hello, Workflows" # 这里可以使用任何 shell 命令
```

上面的工作流使用了以下语法：

- `name` 是工作流的名称，会显示在 EAS 仪表板上。
- `jobs` 包含一个或多个要运行的作业。每个作业有唯一 ID（这里是 `greet`）。
- `steps` 是作业按顺序执行的一系列任务。有 `steps` 但没有 `type` 字段的作业是自定义作业。
- `run` 是步骤中要执行的 shell 命令。这里运行 `echo` 来打印一条消息。任何 shell 命令都可以。

### 3. 手动运行工作流

要在 EAS 仪表板上运行该工作流，在终端窗口中运行以下命令：

```sh
eas workflow:run .eas/workflows/hello.yml
```

`eas workflow:run` 命令会把工作流文件上传到 EAS。然后它运行文件中定义的任何作业，EAS CLI 会打印一个指向 EAS 仪表板的 URL，我们可以在那里观看作业。

### 4. 查看作业日志

在浏览器中打开上一步的 URL。在工作流页面上，可以看到 `greet` 作业及其状态。作业完成后，展开步骤输出，即可看到记录的消息：`Hello, Workflows`。

![EAS Workflows 仪表板，展示一次 Hello World 工作流运行中展开的作业日志。](/static/images/tutorial/cicd/eas-workflows-job-logs-dashboard.png)

EAS 仪表板是我们查看和调试任何工作流作业的地方。**Workflow graph** 显示是什么触发了我们的作业，以及作业的唯一 ID。

切换到 **Workflow file** 标签。这里是我们在第 2 步编写的工作流文件，会随这次运行保留下来。

:::tip
在 [Workflows 页面](https://expo.dev/accounts/[account]/projects/[project]/workflows) 上可以查看项目的全部工作流，并按状态或类型筛选。
:::

## 自动运行工作流

从终端运行 `eas workflow:run` 适合一次性执行，但大多数团队希望工作流在 GitHub 事件上自动触发。自动触发意味着没有人需要记得去运行工作流。工作流的配置与它所构建的代码一起放在仓库里。

:::note
触发器是一条规则，告诉 CI/CD 流水线何时开始。它定义了导致流水线自动运行的事件（例如一次代码推送或一个拉取请求），而不需要手动执行。
:::

我们在工作流文件中用 `on` 键定义触发器。EAS 会监视匹配的 GitHub 事件，并自动运行工作流。

### 1. 添加自动触发器

给现有的工作流文件添加一个 `on.push.branches` 触发器。

- `on` 键定义哪个 GitHub 事件会触发工作流
- `push` 字段定义何时触发
- `branches` 字段让我们可以指定：每当代码被推送到 `main` 分支时，工作流应自动运行

```yaml .eas/workflows/hello.yml
name: Hello

on:
  push:
    branches: ['main'] # 每次推送到 main 分支时触发

jobs:
  greet:
    steps:
      - run: echo "Hello, Workflows"
```

`branches` 字段可以包含 GitHub 仓库中存在的任何分支名。我们可以指定多个分支，例如 `['main', 'develop', 'staging']`，这样推送到其中任一分支时都会触发工作流。

### 2. 提交更改并推送到 GitHub

提交工作流文件并推送到 `main` 分支：

```sh
git add .eas/workflows/hello.yml && git commit -m 'Add hello workflow' && git push origin main
```

### 3. 验证自动触发器

:::tip
这一步依赖于本地 Expo 项目已推送到 GitHub，并且 GitHub 仓库已连接到 EAS。确认方法：运行 `git remote -v`，检查本地仓库是否指向一个 GitHub URL；并打开项目在 EAS 上的 [GitHub 设置](https://expo.dev/accounts/[account]/projects/[projectName]/github)，确认已连接仓库。
:::

打开项目在 EAS 仪表板上的 [Workflows 页面](https://expo.dev/accounts/[account]/projects/[project]/workflows)，查看新作业。

![EAS Workflows 仪表板，展示由推送到 GitHub 仓库 main 分支而自动触发的一次工作流运行。](/static/images/tutorial/cicd/eas-workflows-github-triggered-run.png)

在 EAS 仪表板中，注意 **Workflow graph** 标签会显示这次推送的提交信息和分支引用。工作流标题下方的状态中，**Trigger** 和 **Triggered by** 反映的是同一信息。

## 其他触发器类型

本教程后面还会用到的其他触发器类型：

- `on.pull_request`：当针对匹配分支打开或更新拉取请求时运行
- 带 `tags` 的 `on.push`：当匹配的标签模式被推送到 GitHub 仓库时运行
- `on.pull_request_labeled`：当某个特定 label 被添加到拉取请求时运行

## 把作业串联起来

到目前为止，我们在工作流文件中只实现了一个作业。一个工作流文件可以有多个作业。一个作业的输入可以依赖前一个作业的输出。下面把多个作业串联到一个工作流文件中。

### 1. 更新 hello.yml

更新 **hello.yml**，添加一个自定义作业和一个预置作业。这个预置作业叫做 [`doc`](/eas/workflows/pre-packaged-jobs#doc)，它会在 EAS 仪表板上渲染 Markdown：

```yaml .eas/workflows/hello.yml
name: Hello

jobs:
  greet:
    outputs:
      greeting: ${{ steps.set_greeting.outputs.greeting }} # 在作业级别暴露步骤输出
    steps:
      - id: set_greeting
        run: set-output greeting "Hello from EAS Workflows"
  show_info:
    needs: [greet] # 等待 greet 完成，然后读取它的输出
    type: doc # 在仪表板上渲染 Markdown 的预置作业
    params:
      md: |
        # Workflow Output
        **${{ needs.greet.outputs.greeting }}**
```

上面的工作流文件做了这些事：

- 定义了一个 `greet` 作业，它是自定义作业。它使用 [`set-output`](/eas/workflows/syntax#set-output) shell 函数设置一个名为 `greeting` 的值。作业级别的 `outputs` 字段暴露步骤输出，以便其他作业引用。
- 定义了一个 `show_info` 作业，它用 `needs: [greet]` 等待 `greet` 作业完成并访问其输出。然后使用预置的 `doc` 作业类型，在 EAS 仪表板中渲染一份 Markdown 文档。Markdown 内容包含上一个作业中设置的 `greeting` 值。

:::tip
在 EAS Workflows 中，作业默认并行运行。`needs` 字段才是让作业等待的方式：它列出必须成功完成之后，使用 `needs` 的作业才能开始的作业 ID。如果 `needs` 列表中的某个作业失败，依赖它的作业会被跳过。
:::

### 2. 运行串联后的工作流

在终端窗口中运行以下命令，查看串联作业的实际效果：

```sh
eas workflow:run .eas/workflows/hello.yml
```

打开 EAS CLI 给出的 EAS 仪表板链接。在 **Logs** 下，注意 `greet` 作业先运行。它完成后，`show_info` 作业运行，并用上一个作业的输出渲染 Markdown 内容。

![EAS Workflows 仪表板，展示第一个作业完成后按顺序运行的两个串联作业。](/static/images/tutorial/cicd/eas-workflows-chained-jobs.png)

## 清理

本章之后，删除 **hello.yml** 文件，因为后面的章节不会再用它。如果希望保留，请移除 `on.push` 触发器，这样它就不会在每次推送到 `main` 时触发。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
