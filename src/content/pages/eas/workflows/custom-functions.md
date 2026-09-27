---
title: EAS Workflows 中的自定义函数
description: 了解如何用自定义函数定义可复用的步骤序列。
---

# EAS Workflows 中的自定义函数

自定义函数为自定义作业和钩子定义可复用的步骤序列。你可以像内置函数一样，用相对路径通过 [`uses`](/eas/workflows/syntax#jobsjob_idstepsstepuses) 调用它们。每个自定义函数在 **function.yml** 或 **function.yaml** 文件的 `runs.steps` 下定义其步骤。这些步骤使用与[自定义作业步骤](/eas/workflows/syntax#custom-jobs)相同的格式。

**function.yml** 的 schema 见语法参考中的[自定义函数](/eas/workflows/syntax#custom-functions)。

## 工作原理

为你的自定义函数创建一个目录，并在其中放入 **function.yml** 文件。EAS Workflows 也接受 **function.yaml**。EAS Workflows 相对于你的 EAS 项目目录解析你传给 `uses` 的路径：

```text
my-app/.eas/workflows/publish-preview-update.yml
my-app/.eas/functions/setup/function.yml
my-app/eas.json
```

上面示例中的 **.eas/functions/&lt;name&gt;** 路径只是一种选择。`uses` 的值必须以 `./` 或 `../` 开头，并指向包含 **function.yml** 或 **function.yaml** 文件的目录。以 `../` 开头的路径可以指向 EAS 项目目录之外，但自定义函数必须仍在仓库内。

自定义函数内部步骤上的相对 `working_directory` 从作业的默认工作目录解析，而不是从包含 **function.yml** 的目录解析。

你可以在以下位置使用自定义函数：

- 自定义作业的 [`steps`](/eas/workflows/syntax#jobsjob_idsteps)
- 构建作业的 [`steps`](/eas/workflows/syntax#jobsjob_idsteps)
- 作业的 [`hooks`](/eas/workflows/syntax#jobsjob_idhooks) 和 [`defaults.hooks`](/eas/workflows/syntax#defaultshooks)

## 输入、输出与作用域

在调用处用 `with:` 传递输入。在函数内部，用 `${{ inputs.<name> }}` 读取输入。

在 **function.yml** 中用 `outputs` 定义函数输出。EAS Workflows 把每个输出暴露为字符串。以 `${{ steps.<call_id>.outputs.<name> }}` 读取输出。使用调用步骤的 `id`。调用方不能引用函数内部的步骤标识符。

表达式使用以下作用域：

- 在函数内部，`steps.*` 引用针对函数自己的步骤解析。
- EAS Workflows 在调用方的作用域中求值调用步骤的 `with`、`env` 和 `if` 值。
- 函数中的每个步骤都继承调用步骤的 `env` 值。在嵌套调用中，同名的内部值会覆盖外部值。
- EAS Workflows 在函数的作用域中求值函数内部的输入默认值和表达式。
- 调用步骤的 `if` 把整个函数作为一个单元来门控。

## 嵌套

自定义函数可以调用其他自定义函数和内置的 `eas/*` 函数。目前，自定义函数不能调用 `eas/build` 或 `eas/maestro_test`。EAS Workflows 相对于 EAS 项目目录解析每个嵌套路径，而不是相对于包含调用函数的目录。

自定义函数最多可以嵌套 10 层。自定义函数不能调用自身，无论是直接调用还是通过其他自定义函数。

## 示例

**.eas/functions/greet/function.yml** 定义了一个带有一个输入、一个输出和一个步骤的自定义函数：

```yaml .eas/functions/greet/function.yml
name: Greet
inputs:
  - name: who
    default_value: world
outputs:
  message:
    value: '${{ steps.make.outputs.message }}'
runs:
  steps:
    - id: make
      run: set-output message "Hello, ${{ inputs.who }}!"
```

工作流用 `uses: ./.eas/functions/greet` 调用它，用 `with:` 传递输入，并从 `${{ steps.greet.outputs.message }}` 读取输出：

```yaml .eas/workflows/hello.yml
name: Hello
jobs:
  greet:
    steps:
      - id: greet
        uses: ./.eas/functions/greet
        with:
          who: Expo
      - run: echo "${{ steps.greet.outputs.message }}"
```

你也可以从[钩子](/eas/workflows/syntax#jobsjob_idhooks)调用自定义函数：

```yaml .eas/workflows/build.yml
jobs:
  build_ios:
    type: build
    params:
      platform: ios
    hooks:
      before_install_node_modules:
        - uses: ./.eas/functions/setup
```
