---
title: TypeScript 函数
description: 了解如何在自定义构建配置中创建并使用 EAS Build 函数。
---

# TypeScript 函数

EAS Build 函数是扩展自定义构建功能的好方法。你可以用它们创建可复用的步骤，并用 JavaScript、TypeScript 或 Bash 编写逻辑（更多信息见配置 schema 中的 [`command`](/custom-builds/schema#functionsfunction_namecommand)）。本指南逐步说明如何用 TypeScript 创建函数。

## 初始化 EAS Build 函数模块

创建 EAS Build 函数最简单的方式是使用 `create-eas-build-function` CLI 工具。在与 **eas.json** 相同的目录中运行下面的命令，可以创建一个新的自定义 TypeScript 函数：

:::tabs
:::tab npm
```sh
npx create-eas-build-function@latest ./.eas/build/myFunction
```
:::
:::tab yarn
```sh
yarn create eas-build-function ./.eas/build/myFunction
```
:::
:::tab pnpm
```sh
pnpm create eas-build-function ./.eas/build/myFunction
```
:::
:::tab bun
```sh
bun create eas-build-function ./.eas/build/myFunction
```
:::
:::

这会在 **.eas/build** 目录中创建一个名为 `myFunction` 的新模块。该模块包含预先生成的模块配置，以及 **src** 目录，其中的 **index.ts** 文件包含默认的 TypeScript 函数模板。

```ts .eas/build/myFunction/src/index.ts
// 此文件由 `create-eas-build-function` 命令自动生成。
// 前往 README.md 了解如何编写自己的自定义构建函数。

import { BuildStepContext } from '@expo/steps';

// interface FunctionInputs {
//   // 在此指定输入值的类型，以及它们是否必填
//   // 示例：name: BuildStepInput<BuildStepInputValueTypeName.STRING, true>;
// }

// interface FunctionOutputs {
//   // 在此指定函数输出，以及它们是否必填
//   // 示例：name: BuildStepOutput<true>;
// }

async function myFunction(
  ctx: BuildStepContext
  // {
  //   inputs,
  //   outputs,
  //   env,
  // }: {
  //   inputs: FunctionInputs;
  //   outputs: FunctionOutputs;
  //   env: BuildStepEnv;
  // }
): Promise<void> {
  ctx.logger.info('Hello from my TypeScript function!');
}

export default myFunction;
```

## 编译函数

函数必须编译成单个 JavaScript 文件，并且无需安装任何依赖即可运行。生成函数的默认 `build` 脚本使用 [ncc](https://github.com/vercel/ncc) 把函数及其全部依赖编译成单个文件。如果机器上没有全局安装 `ncc`，运行 `npm install -g @vercel/ncc` 来安装。然后在 **.eas/build/myFunction** 目录中运行 build 脚本：

:::tabs
:::tab npm
```sh
npm run build
```
:::
:::tab yarn
```sh
yarn run build
```
:::
:::tab pnpm
```sh
pnpm run build
```
:::
:::tab bun
```sh
bun run build
```
:::
:::

该命令会触发自定义函数模块 **package.json** 中的 `build` 脚本。

```json package.json
{
  ...
  "scripts": {
    ...
    "build": "ncc build ./src/index.ts -o build/ --minify --no-cache --no-source-map-register"
    ...
  },
  ...
}
```

`build` 脚本会生成 **build/index.js**。该文件必须作为项目归档的一部分上传到 EAS Build，构建器才能运行你的函数。请确保该文件没有被 **.gitignore** 或 **.easignore** 排除。

## 把函数暴露给自定义构建配置

:::note
下面的示例假设你已经设置了自定义构建工作流，并在 **eas.json** 中完成配置。如果还没有，继续之前请先看[自定义构建入门](/custom-builds/get-started#创建自定义构建配置)。
:::

假设 **.eas/build** 目录中有一个 **config.yml** 文件，内容如下：

```yaml .eas/build/config.yml
build:
  name: My example config
  steps:
    - eas/checkout
    - eas/install_node_modules
    - run:
        name: Finished
        command: echo Finished
```

要把函数加入配置，需要在 **config.yml** 中添加下面几行：

```yaml .eas/build/config.yml
build:
  name: My example config
  steps:
    - eas/checkout
    - eas/install_node_modules
    - run:
        name: Finished
        command: echo Finished

functions:
  my_function:
    name: My function
    path: ./myFunction
```

`path` 属性应是从配置文件到函数目录的相对路径。这里就是 `./myFunction`。

现在，在 **config.yml** 中添加对 `my_function` 函数的调用：

```yaml .eas/build/config.yml
build:
  name: My example config
  steps:
    - eas/checkout
    - eas/install_node_modules
    - my_function
    - run:
        name: Finished
        command: echo Finished

functions:
  my_function:
    name: My function
    path: ./myFunction
```

![使用 JavaScript/TypeScript 函数的自定义构建配置示例。](/static/images/eas-build/custom-build-function.png)

## 编写函数

来看一个更进一步的例子：你希望函数计算两个数的和，把结果打印到控制台，然后把该值作为函数输出。为此，修改 **config.yml** 和 **index.ts**，让函数接受两个名为 `num1` 和 `num2` 的输入，并返回名为 `sum` 的输出，即它们的和。

```yaml .eas/build/config.yml
build:
  name: My example config
  steps:
    - eas/checkout
    - eas/install_node_modules
    - my_function:
        inputs:
          num1: 1
          num2: 2
        id: sum_function
    - run:
        name: Print the sum
        inputs:
          sum: ${ steps.sum_function.sum }
        command: echo ${ inputs.sum }
    - run:
        name: Finished
        command: echo Finished

functions:
  my_function:
    name: My function
    inputs:
      - name: num1
        type: number
      - name: num2
        type: number
    outputs:
      - name: sum
    path: ./myFunction
```

```ts .eas/build/myFunction/src/index.ts
// 此文件由 `create-eas-build-function` 命令自动生成。
// 前往 README.md 了解如何编写自己的自定义构建函数。

import {
  BuildStepContext,
  BuildStepInput,
  BuildStepInputValueTypeName,
  BuildStepOutput,
} from '@expo/steps';

interface FunctionInputs {
  // 第一个模板参数是输入值的类型，第二个模板参数是表示输入是否必填的布尔值
  num1: BuildStepInput<BuildStepInputValueTypeName.NUMBER, true>;
  num2: BuildStepInput<BuildStepInputValueTypeName.NUMBER, true>;
}

interface FunctionOutputs {
  // 模板参数是表示输出是否必填的布尔值
  sum: BuildStepOutput<true>;
}

async function myFunction(
  ctx: BuildStepContext,
  {
    inputs,
    outputs,
  }: // env,
  {
    inputs: FunctionInputs;
    outputs: FunctionOutputs;
    // env: BuildStepEnv;
  }
): Promise<void> {
  ctx.logger.info(`num1: ${inputs.num1.value}`);
  ctx.logger.info(`num2: ${inputs.num2.value}`);

  const sum = inputs.num1.value + inputs.num2.value;

  ctx.logger.info(`sum: ${sum}`);

  outputs.sum.set(sum.toString()); // 目前输出必须是字符串。这一点将来会改进。
}

export default myFunction;
```

![使用自定义 JavaScript/TypeScript 函数的自定义构建配置示例。](/static/images/eas-build/custom-build-function-advanced.png)

:::note
每次修改函数后都要记得编译：`npm run build`。
:::

## 小结

- 编写函数是用你自己的逻辑扩展自定义构建功能的好方法。
- EAS Build 函数可以复用：你可以在多个自定义构建配置中使用它们。
- 对于不容易用 shell 脚本完成的更高级用例，使用 EAS Build 函数是很好的选择。
- 大多数[内置函数](/custom-builds/schema#内置-eas-函数)都是开源的，可以 fork，或作为编写自己函数时的参考。

查看**示例仓库**以获取更详细的示例：

- **[自定义构建示例仓库](https://github.com/expo/eas-custom-builds-example/tree/main)**：一个自定义 EAS Build 示例，包含设置函数、使用环境变量、上传产物等自定义构建示例。
