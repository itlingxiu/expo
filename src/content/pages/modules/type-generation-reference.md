---
title: 类型生成参考
description: expo-type-information 包的参考文档。
---

# 类型生成参考

:::warning
`expo-type-information` 库仅在 macOS 上工作。适用于 SDK 56 及更高版本。
:::

`expo-type-information` 包提供自动为 Swift 模块生成 TypeScript 接口的工具。它由多个部分组成：

- 基于 `sourcekitten` 的 Swift 解析器：可以从 Swift Expo 模块中检索并结构化类型信息的解析器。
- 类型抽象：对 Expo 模块相关类型信息的抽象，解析器以这种抽象方式返回信息。
- TypeScript AST 生成器：一组帮助生成 TypeScript 代码的函数。
- CLI：集成上述功能的命令行工具。

## 配置

安装 `expo-type-information` 库：

:::tabs
:::tab npm
```sh
$ npx expo install expo-type-information
```
:::
:::tab yarn
```sh
$ yarn expo install expo-type-information
```
:::
:::tab pnpm
```sh
$ pnpm expo install expo-type-information
```
:::
:::tab bun
```sh
$ bun expo install expo-type-information
```
:::
:::

使用此包还需要安装 `sourcekitten`。可以使用 Homebrew 等 macOS 包管理器。

```sh
$ brew install sourcekitten
```

## CLI 参考

### 通用 CLI 选项

此库中的每个 CLI 命令都使用以下通用选项进行配置。唯一的例外是 `inline-modules-interface`，它的选项略有不同。

| 标志 | 说明 | 默认值 |
| --- | --- | --- |
| `-i, --input-paths <filePaths...>` | 某个模块的 Swift 文件路径，允许使用 glob 模式。 | |
| `-m --module-path <modulePath>` | Expo 模块根目录的路径。 | |
| `-o, --output-path <filePath>` | 保存生成输出的路径。如果未提供此选项，生成的输出会打印到控制台。 | |
| `-t, --type-inference <typeInference>` | 类型推断级别：`NO_INFERENCE`、`SIMPLE_INFERENCE` 或 `PREPROCESS_AND_INFERENCE`。注意，`PREPROCESS_AND_INFERENCE` 选项偶尔会在某些模块上失败。如果遇到错误，请回退到 `SIMPLE_INFERENCE` 或 `NO_INFERENCE`。 | `PREPROCESS_AND_INFERENCE` |
| `-s, --skip-unicode-character-mapping` | 跳过把文件中所有非 ASCII 字符映射为 ASCII 字符串。默认会执行此映射，因为 SourceKitten 在计算非 ASCII 字符偏移时不一致。 | |
| `-w --watcher` | 启动一个监视器，检查 input-path 文件的更改。 | |

### 主要命令

#### `module-interface`

为 Swift 模块生成完整的 TypeScript 接口。它包括：

- 包含模块中定义的所有类型的 **types.ts** 文件
- 包含原生模块定义的 **module.ts**
- 模块中定义的每个视图对应的 **view.tsx**
- 重新导出部分函数的 **index.ts** 文件

> 接受标准的[通用 CLI 选项](#通用-cli-选项)。

#### `inline-modules-interface`

为项目中的每个 Swift 内联模块创建 TypeScript 接口。该接口由两个文件组成：

- **Module.generated.ts**：每次运行该命令时都会重新生成
- **Module.tsx**：如果你修改了它，则不会重新生成

**选项：**

| 标志 | 说明 | 默认值 |
| --- | --- | --- |
| `-a --app-json <appJsonPath>` | 定义了 `inline.modules.watchedDirectories` 的[应用配置](/workflow/configuration)文件路径。 | |
| `-w --watcher` | 启动一个监视器，检查内联模块文件的更改。 | |
| `-t, --type-inference <typeInference>` | 类型推断级别：`NO_INFERENCE`、`SIMPLE_INFERENCE` 或 `PREPROCESS_AND_INFERENCE`。注意，`PREPROCESS_AND_INFERENCE` 选项偶尔会在某些模块上失败。如果遇到错误，请回退到 `SIMPLE_INFERENCE` 或 `NO_INFERENCE`。 | `SIMPLE_INFERENCE` |

#### `short-module-interface`

为 Expo 模块创建简短的 TypeScript 接口。会覆盖 **ModuleName.generated.ts**，并在 **ModuleName.ts** 不存在时创建它。可以与内联模块一起使用。

> 接受标准的[通用 CLI 选项](#通用-cli-选项)。

#### `generate-mocks-for-file`

为给定的 Expo 模块生成模拟。

> 接受标准的[通用 CLI 选项](#通用-cli-选项)。

### 其他命令

这些命令是内部命令，或非常专门。

> 本节中的所有命令都接受标准的[通用 CLI 选项](#通用-cli-选项)。

#### `other type-information`

解析 Swift 模块类型信息，并输出 `FileTypeInformation` JSON。

#### `other generate-module-types`

为模块生成类型声明文件内容。

#### `other generate-view-types`

为原生 View 生成类型声明文件。

#### `other generate-jsx-intrinsics`

为 View 生成声明文件，并用该 View 的 props 更新 JSX intrinsics。

#### `other preprocess-file`

打印文件在使用 `sourcekitten` 解析之前、预处理完成后的状态。它有助于检查 `--module-path`、`--input-path` 和 `--type-inference` 选项如何影响被解析的文件。

## Swift 解析器的限制

`expo-type-information` 库使用 `sourcekitten` 解析 Swift 文件。解析 Swift 文件是一项复杂的任务，目前并非所有内容都已实现。

<details>
<summary>当前版本解析 Swift 文件的已知问题</summary>

- 嵌套类不会被完全解析。

  `Sourcekitten` 在解析嵌套闭包时有限制，因此模块中定义的类可能无法被完全解析。这也是如果模块中存在 DSL `Class`，其方法的返回类型会是 `unresolved` 的原因。

- 返回类型解析，以及 `PREPROCESS_AND_INFERENCE` 推断选项。

  当闭包的返回类型没有显式给出时，工具需要推断它。
  在 `sourcekitten` 中，一种做法是：当存在 `return identifier` 语句时，可以查询该 `identifier` 的类型。
  第三种推断选项 `PREPROCESS_AND_INFERENCE` 会重写文件，对每个 `return expression` 语句插入新的 `let return_expression = expression; return return_expression;`，以便查询标识符类型。
  重写有时会出现问题（主要是因为字符串和注释），因此并不总是有效。
  目前也无法解析没有 `return` 的返回，即返回表达式是闭包的尾部表达式时。

- 不支持的 Expo Module DSL 声明。

  目前并非所有 DSL 声明都会被解析，有些也不是在每种上下文中都会被解析。例如，`Events` 会在 `View` 内部被解析，但不会在 Module 定义中被解析。

- 使用 Unicode 字符会破坏 `sourcekitten` 的偏移计算。

</details>

### 支持的 Expo modules DSL 声明

| 特性 | 说明与限制 |
| --- | --- |
| **Expo DSL 声明** | 支持解析：`AsyncFunction`、`Constant`、`Constructor`、`Events`、`Function`、`Name`、`Prop`、`Property` 和 `View`。 |
| **Swift `struct` 与 `class`** | 必须遵循 `Record` 协议。只会解析带有 `@Field` 注解的属性。 |
| **Swift `enum`** | 支持基本 case。目前不会解析与 enum case 关联的值。 |
