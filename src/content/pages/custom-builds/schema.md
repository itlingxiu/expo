---
title: 自定义构建配置 schema
description: 使用 EAS Build 进行自定义构建的配置选项参考。
---

# 自定义构建配置 schema

为 EAS Build 创建自定义构建有助于为项目自定义构建过程。

## 自定义构建的 YAML 语法

自定义构建配置文件存放在 **.eas/build** 目录路径中。它们使用 YAML 语法，并且必须具有 `.yml` 或 `.yaml` 文件扩展名。如果你不熟悉 YAML 或想进一步了解语法，见 [用 Y 分钟学习 YAML](https://learnxinyminutes.com/docs/yaml/)。

## `build`

用于描述自定义构建配置。创建自定义构建的所有配置选项都在其下指定。

### `name`

自定义构建的名称，用于在构建日志中识别它。EAS Build 使用此属性在仪表盘中显示构建名称。

例如，构建名称是 `Run tests`：

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
```

### `steps`

步骤用于描述操作列表，形式为命令或函数调用。自定义构建在 EAS Build 上运行时会执行这些操作。你可以在构建配置中定义单个或多个步骤。不过，每个构建**必须**至少定义一个步骤。

每个步骤使用以下属性配置：

#### `steps[].run`

`run` 键用于触发一组指令。例如，使用 `run` 键通过 `npm install` 命令安装依赖：

```yaml
build:
  name: Install npm dependencies
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
```

也可以使用 `steps[].run` 执行单行或多行 shell 命令：

```yaml
build:
  name: Run inline shell commands
  steps:
    - run: echo "Hello world"
    - run: |
        echo "Multiline"
        echo "bash commands"
```

#### 使用单个步骤

例如，具有以下 `steps` 的构建配置将打印 “Hello world”：

```yaml
build:
  name: Greeting
  steps:
    - run: echo "Hello world"
```

:::note
`run` 前面的 `-` 算作缩进。
:::

#### 使用多个步骤

定义多个 `steps` 时，它们会按顺序执行。例如，具有以下 `steps` 的构建配置会先检出项目、安装 npm 依赖，然后运行命令来运行测试：

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Install dependencies
        command: npm install
    - run:
        name: Run tests
        command: |
          echo "Running tests..."
          npm test
```

#### 与其他步骤共享环境变量

在一个步骤的 `command` 中导出（使用 `export`）的环境变量不会自动暴露给其他步骤。要与其他步骤共享环境变量，请使用 `set-env` 可执行文件。

`set-env` 期望使用两个参数调用：环境变量的名称和值。例如，`set-env NPM_TOKEN "abcdef"` 会把值为 `abcdef` 的 `$NPM_TOKEN` 变量暴露给其他步骤。

:::note
用 `set-env` 共享的变量不会自动在本地导出。你需要自己调用 `export`。
:::

```yaml
build:
  name: Shared environment variable example
  steps:
    - run:
        name: Set environment variables
        command: |
          set -x

          # 设置变量
          ENV_TEST_LOCAL="present-only-in-current-shell-context"
          # 设置并导出变量
          export ENV_TEST_LOCAL_EXPORT="present-in-current-step"
          # 设置共享变量
          set-env ENV_TEST_SET_ENV "present-in-following-steps"

          # 将打印 "ENV_TEST_LOCAL: present-only-in-current-shell-context"
          # 因为当前 shell 可以访问此本地变量。
          echo "ENV_TEST_LOCAL: $ENV_TEST_LOCAL"

          # 将打印 "ENV_TEST_LOCAL_EXPORT: present-in-current-step"
          # 因为 export 也会设置本地变量的值。
          echo "ENV_TEST_LOCAL_EXPORT: $ENV_TEST_LOCAL_EXPORT"

          # 将打印 "ENV_TEST_SET_ENV: "
          # 因为 set-env 不会设置或导出变量。
          echo "ENV_TEST_SET_ENV: $ENV_TEST_SET_ENV"

          # 只会打印 LOCALLY_EXPORTED_ENV，
          # 因为它是唯一被 export 的变量。
          env | grep ENV_TEST_
    - run:
        name: Check variables values in next step
        command: |
          set -x

          # 将打印 "ENV_TEST_LOCAL: "，因为 ENV_TEST_LOCAL
          # 只是上一步中的本地变量。
          echo "ENV_TEST_LOCAL: $ENV_TEST_LOCAL"

          # 将打印 "ENV_TEST_LOCAL_EXPORT: "
          # 因为 export 不会把变量共享给其他步骤。
          echo "ENV_TEST_LOCAL_EXPORT: $ENV_TEST_LOCAL_EXPORT"

          # 将打印 "ENV_TEST_SET_ENV: present-in-following-steps"
          # 因为 set-env 把变量“导出”给了其他步骤。
          echo "ENV_TEST_SET_ENV: $ENV_TEST_SET_ENV"

          # 只会打印 ENV_TEST_SET_ENV，
          # 因为 set-env 把它“导出”给了其他步骤。
          env | grep ENV_TEST_
```

#### `steps[].run.name`

在构建日志中用于显示步骤名称的名称。

#### `steps[].run.command`

`command` 定义步骤执行时要运行的自定义 shell 命令。每个步骤**必须**定义一个命令。它可以是多行 shell 命令：

```yaml
build:
  name: Run tests
  steps:
    - eas/checkout
    - run:
        name: Run tests
        command: |
          echo "Running tests..."
          npm test
```

#### `steps[].run.working_directory`

`working_directory` 用于定义项目根目录中已存在的目录。在步骤中定义现有路径后，使用它会更改该步骤的当前目录。例如，创建一个步骤列出 **assets** 目录中的所有资源，该目录是 Expo 项目中的目录。`working_directory` 设置为 `assets`：

```yaml
build:
  name: Demo
  steps:
    - eas/checkout
    - run:
        name: List assets
        working_directory: assets
        command: ls -la
```

#### `steps[].run.shell`

用于定义步骤的默认可执行 shell。例如，把步骤的 shell 设置为 `/bin/sh`：

```yaml
build:
  name: Demo
  steps:
    - run:
        shell: /bin/sh
        command: |
          echo "Steps can use another shell"
          ps -p $$
```

#### `steps[].run.inputs`

向步骤提供输入值。例如，可以使用 `input` 提供一个值：

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Say Hi
        inputs:
          name: Expo
        command: echo "Hi, ${ inputs.name }!"
```

#### `steps[].run.outputs`

步骤期间预期有一个输出值。例如，步骤的输出值是 `Hello world`：

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Produce output
        outputs: [value]
        command: |
          echo "Producing output for another step"
          set-output value "Output from another step..."
```

#### `steps[].run.outputs.required`

输出值可以使用布尔值表明该输出值是否必需。例如，函数没有必需的输出值：

```yaml
build:
  name: Demo
  steps:
    - run:
        name: Produce another output
        id: id456
        outputs:
          - required_param
          - name: optional_param
            required: false
        command: |
          echo "Producing more output"
          set-output required_param "abc 123 456"
```

#### `steps[].run.id`

为步骤定义 `id` 允许：

- 多次调用产生一个或多个输出的同一函数
- 把一个步骤的输出用于另一个步骤

#### 多次调用同一函数

例如，以下函数生成一个随机数：

```yaml
functions:
  random:
    name: Generate random number
    outputs: [value]
    command: set-output value `random_number`
```

在构建配置中，使用 `random` 函数生成两个随机数并打印它们：

```yaml
build:
  name: Functions Demo
  steps:
    - random:
        id: random_1
    - random:
        id: random_2
    - run:
        name: Print random numbers
        inputs:
          random_1: ${ steps.random_1.value }
          random_2: ${ steps.random_2.value }
        command: |
          echo "${ inputs.random_1 }"
          echo "${ inputs.random_2 }"
```

#### 把一个步骤的输出用于另一个步骤

例如，以下构建配置演示如何把一个步骤的输出用于另一个步骤：

```yaml
build:
  name: Outputs demo
  steps:
    - run:
        name: Produce output
        id: id123
        outputs: [foo]
        command: |
          echo "Producing output for another step"
          set-output foo bar
    - run:
        name: Use output from another step
        inputs:
          foo: ${ steps.id123.foo }
        command: |
          echo "foo = \"${ inputs.foo }\""
```

## `functions`

用于描述可在构建配置中使用的可复用函数。创建函数的所有配置选项使用以下属性指定：

### `functions.[function_name]`

`[function_name]` 是你定义的函数名称，用于在 `build.steps` 中识别它。例如，可以定义名为 `greetings` 的函数：

```yaml
functions:
  greetings:
    name: Say Hi!
```

### `functions.[function_name].name`

在构建日志中用于显示函数名称的名称。例如，显示名称为 `Say Hi!` 的函数：

```yaml
functions:
  greetings:
    name: Say Hi!
```

### `functions.[function_name].inputs`

向函数提供输入值。

#### `inputs[].name`

输入值的名称。它用作标识符来访问输入值，例如在 bash 命令插值中。

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
    command: echo "${ inputs.name }!"
```

#### `inputs[].required`

布尔值，表明输入值是否必需。例如，函数没有必需值：

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        required: false
```

#### `inputs[].type`

输入值的类型。可以是 `string`、`num` 或 `json`。

在函数调用中设置的输入值，以及函数的 `default_value` 和 `allowed_values`，都会根据类型进行验证。

默认输入 `type` 是 `string`。

例如，函数有一个类型为 `string` 的输入值：

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        type: string
      - name: age
        type: num
      - name: other_data
        type: json
```

#### `inputs[].default_value`

可以使用 `default_value` 提供一个默认输入。例如，函数的默认值是 `Hello world`：

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
```

#### `inputs[].allowed_values`

可以使用 `allowed_values` 在数组中提供多个值。例如，函数有多个允许值：

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Hello world
        allowed_values: [Hi, Hello, Hey]
        type: string
```

#### 多个输入值

可以向函数提供多个输入值。

```yaml
functions:
  greetings:
    name: Say Hi!
    inputs:
      - name: name
        default_value: Expo
      - name: greeting
        default_value: Hi
        allowed_values: [Hi, Hello]
    command: echo "${ inputs.greeting }, ${ inputs.name }!"
```

### `functions.[function_name].outputs`

函数预期有一个输出值。例如，函数的输出值是 `Hello world`：

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs: [value]
    command: set-output value "Hello world"
```

#### `outputs[].name`

输出值的名称。它用作标识符，以便在另一步骤中访问输出值：

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs:
      - name: name
```

#### `outputs[].required`

布尔值，表明输出值是否必需。例如，函数没有必需的输出值：

```yaml
functions:
  greetings:
    name: Say Hi!
    outputs:
      - name: value
        required: false
```

### `functions.[function_name].command`

如果希望函数是简单的 shell 脚本，用于定义函数执行时要运行的命令。每个函数**必须**定义 `command` 或指向实现该函数的 JS/TS 模块的 `path`。例如，使用命令 `echo "Hello world"` 打印消息：

```yaml
functions:
  greetings:
    name: Say Hi!
    command: echo "Hi!"
```

### `functions.[function_name].path`

用于定义实现该函数的 JavaScript/TypeScript 模块路径。每个函数**必须**定义 `command` 或 `path` 属性。例如，路径 `./greetings` 用于执行在 `greetings` 模块中声明的 `greetings` 函数：

```yaml
functions:
  greetings:
    name: Say Hi!
    path: ./greetings
```

> [进一步了解构建和使用自定义 TypeScript/JavaScript 函数](/custom-builds/functions)。

### `functions.[function_name].shell`

用于定义执行函数的步骤的默认可执行 shell。例如，把步骤的 shell 设置为 `/bin/sh`：

```yaml
functions:
  greetings:
    name: Say Hi!
    shell: /bin/sh
    command: echo "Hi!"
```

### `functions.[function_name].supported_platforms`

用于定义函数支持的平台。默认为所有平台。允许的平台：`darwin`、`linux`。

例如，函数支持的平台是 `darwin`（macOS）：

```yaml
functions:
  greetings:
    name: Say Hi!
    supported_platforms: [darwin]
    command: echo "Hi!"
```

## `import`

用于从其他配置文件导入函数的配置文件路径列表。导入的文件不能有 `build` 部分。

例如，以下构建配置导入两个文件并调用两个导入的函数：`say_hi` 和 `say_bye`。

```yaml build-and-test.yml
import:
  - common-functions.yml
  - another-file.yml

build:
  steps:
    - say_hi
    - say_bye
```

```yaml common-functions.yml
functions:
  say_hi:
    name: Say Hi!
    command: echo "Hi!"
```

```yaml another-file.yml
functions:
  say_bye:
    name: Say bye :(
    command: echo "Bye!"
```
## 函数

### 内置 EAS 函数

EAS 提供一组内置可复用函数，你可以在构建配置中使用它们，而无需定义函数定义。

:::note
**提示：** 任何由 EAS 提供的内置函数都必须以 `eas/` 前缀开头。
:::

#### `eas/build`

封装整个 EAS Build 构建过程的一体化函数。它根据构建 profile 在 [**eas.json**](/eas/json) 中的设置解析最佳构建配置。

它适合希望完成构建、而不必担心手动更改和配置构建过程的人。如果你想在构建过程之前或之后使用其他自定义步骤，又不想更改构建过程本身，它可以作为自定义构建配置的良好起点。

```yaml example.yml
build:
  name: Run a build using a single command
  steps:
    - eas/build
```

要更好地控制构建过程并按需求自定义它，见 `eas/build` 在后台运行的以下自定义函数和步骤。它们根据构建 profile 的配置作为构建过程执行。

##### Android

当构建配置使用 [`withoutCredentials`](/eas/json#withoutcredentials) 时：

- [`eas/checkout`](#eascheckout)
- [`eas/use_npm_token`](#easuse_npm_token)
- [`eas/install_node_modules`](#easinstall_node_modules)
- [`eas/resolve_build_config`](#easresolve_build_config)
- [`eas/prebuild`](#easprebuild)
- [`eas/configure_eas_update`](#easconfigure_eas_update)
- [`eas/run_gradle`](#easrun_gradle)
- [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)

当构建配置使用凭据时（`internal` 和 `store` [分发](/eas/json#distribution)构建都适用）：

- [`eas/checkout`](#eascheckout)
- [`eas/use_npm_token`](#easuse_npm_token)
- [`eas/install_node_modules`](#easinstall_node_modules)
- [`eas/resolve_build_config`](#easresolve_build_config)
- [`eas/prebuild`](#easprebuild)
- [`eas/configure_eas_update`](#easconfigure_eas_update)
- [`eas/inject_android_credentials`](#easinject_android_credentials)
- [`eas/configure_android_version`](#easconfigure_android_version)
- [`eas/run_gradle`](#easrun_gradle)
- [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)

##### iOS

当构建配置使用 [`withoutCredentials`](/eas/json#withoutcredentials) 或 [`simulator`](/eas/json#simulator) 时：

- [`eas/checkout`](#eascheckout)
- [`eas/use_npm_token`](#easuse_npm_token)
- [`eas/install_node_modules`](#easinstall_node_modules)
- [`eas/resolve_build_config`](#easresolve_build_config)
- [`eas/prebuild`](#easprebuild)
- 使用 `pod install` 命令安装 pods
- [`eas/configure_eas_update`](#easconfigure_eas_update)
- [`eas/generate_gymfile_from_template`](#easgenerate_gymfile_from_template)
- [`eas/run_fastlane`](#easrun_fastlane)
- [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)

当构建配置使用凭据时（`internal` 和 `store` [分发](/eas/json#distribution)构建都适用）：

- [`eas/checkout`](#eascheckout)
- [`eas/use_npm_token`](#easuse_npm_token)
- [`eas/install_node_modules`](#easinstall_node_modules)
- [`eas/resolve_build_config`](#easresolve_build_config)
- [`eas/resolve_apple_team_id_from_credentials`](#easresolve_apple_team_id_from_credentials)
- [`eas/prebuild`](#easprebuild)
- 使用 `pod install` 命令安装 pods
- [`eas/configure_eas_update`](#easconfigure_eas_update)
- [`eas/configure_ios_credentials`](#easconfigure_ios_credentials)
- [`eas/configure_ios_version`](#easconfigure_ios_version)
- [`eas/generate_gymfile_from_template`](#easgenerate_gymfile_from_template)
- [`eas/run_fastlane`](#easrun_fastlane)
- [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)

可以在 YAML 配置文件中使用这些步骤替换 `eas/build` 命令调用：

- **[ios-simulator-build.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/ios-simulator-build.yml)**：在示例仓库中查看 `eas/build` 函数为 iOS 模拟器构建在后台执行的步骤。
- **[ios-credentials-build.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/ios-build-with-credentials.yml)**：在示例仓库中查看 `eas/build` 函数为带凭据的 iOS 构建在后台执行的步骤。
- **[android-build-without-credentials.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/android-build-without-credentials.yml)**：在示例仓库中查看 `eas/build` 函数为不带凭据的 Android 构建在后台执行的步骤。
- **[android-build-with-credentials.yml](https://github.com/expo/eas-custom-builds-example/blob/main/.eas/build/android-build-with-credentials.yml)**：在示例仓库中查看 `eas/build` 函数为带凭据的 Android 构建在后台执行的步骤。

##### 已知局限

- 它不接受任何输入，解析出的构建过程将根据 [**eas.json**](/eas/json) 中的构建 profile 进行配置。
- `eas/build` 产生的构建过程不可配置，你无法自定义它。如果需要自定义构建过程，请使用此函数在后台执行的函数和步骤子集，并按上面示例所示在 YAML 配置文件中手动配置它们。

#### `eas/maestro_test`

安装 Maestro、准备测试环境（Android 模拟器或 iOS 模拟器）并测试应用的一体化函数。

:::warning
项目必须配置为使用旧版构建基础设施才能启动 Android 模拟器。前往[项目设置](https://expo.dev/accounts/[account]/projects/[project]/settings)进行配置。更多信息见[这篇更新日志](https://expo.dev/changelog/2024-08-29-c3d-default)。
:::

| 输入 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `flow_path` | `string` | 是 | 要运行的 [Maestro 流程](https://docs.maestro.dev/getting-started/writing-your-first-flow)路径（或多个路径，每个占一行）。 |
| `app_path` | `string` | 否 | 应测试的模拟器应用的路径（或正则模式）。如果未提供，Android 默认为 **android/app/build/outputs/\*\*/\*.apk**，iOS 默认为 **ios/build/Build/Products/\*simulator/\*.app**。 |

```yaml build-and-test.yml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/maestro_test:
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

```yaml test-ios-simulator-app.yml
build:
  name: Build and test iOS simulator app
  steps:
    - eas/checkout
    - eas/maestro_test:
        app_path: ./fixtures/my_app.app
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

```yaml test-android-emulator-app.yml
build:
  name: Build and test Android emulator app
  steps:
    - eas/checkout
    - eas/maestro_test:
        app_path: ./fixtures/my_app.apk
        inputs:
          flow_path: |
            maestro/sign_in.yml
            maestro/create_post.yml
            maestro/sign_out.yml
```

在后台，它使用：

- [`eas/install_maestro`](#easinstall_maestro) 安装 Maestro
- [`eas/start_android_emulator`](#easstart_android_emulator) 在需要时启动 Android 模拟器
- [`eas/start_ios_simulator`](#easstart_ios_simulator) 在需要时启动 iOS 模拟器
- 自定义 `run` 把 **.apk** 安装到正在运行的 Android 模拟器，把 **.app** 安装到 iOS 模拟器
- 一系列 `run` 对提供的每个流程执行 `maestro test`
- [`eas/upload_artifact`](#easupload_artifact) 把 Maestro 测试产物作为构建产物上传

:::warning
我们观察到，如果在带有 Xcode 15.0 或 15.2 的镜像上运行，Maestro 测试经常超时。使用 `latest` 镜像以避免任何问题。
:::

如果需要自定义 Maestro 版本、运行特定的 Android 模拟器或 iOS 模拟器，或上传多个构建产物，则需要自己编写这一系列步骤。

<details>
<summary>展开了 <code>eas/maestro_test</code> 的 Android 构建配置示例</summary>

```yaml build-and-test-android-expanded.yml
build:
  name: Build and test (Android, expanded)
  steps:
    - eas/build
    - eas/install_maestro
    - eas/start_android_emulator:
        inputs:
          system_package_name: system-images;android-34;default;x86_64
    - run:
        command: |
          # 需要 shopt -s globstar 才能支持 /**
          shopt -s globstar
          # 需要 shopt -s nullglob，这样在没有匹配文件时
          # 不会尝试按字面安装 SEARCH_PATH。
          shopt -s nullglob

          SEARCH_PATH="android/app/build/outputs/**/*.apk"
          FILES_FOUND=false

          for APP_PATH in $SEARCH_PATH; do
            FILES_FOUND=true
            echo "Installing \"$APP_PATH\""
            adb install "$APP_PATH"
          done

          if ! $FILES_FOUND; then
            echo "No files found matching \"$SEARCH_PATH\". Are you sure you've built an Emulator app?"
            exit 1
          fi
    - run:
        command: |
          maestro test maestro/flow.yml
    - eas/upload_artifact:
        name: Upload test artifact
        if: ${ always() }
        inputs:
          type: build-artifact
          path: ${ eas.env.HOME }/.maestro/tests
```

</details>

<details>
<summary>展开了 <code>eas/maestro_test</code> 的 iOS 构建配置示例</summary>

```yaml build-and-test-ios-expanded.yml
build:
  name: Build and test (iOS, expanded)
  steps:
    - eas/build
    - eas/install_maestro
    - eas/start_ios_simulator
    - run:
        command: |
          # 需要 shopt -s nullglob，这样在没有匹配文件时
          # 不会尝试按字面安装 SEARCH_PATH。
          shopt -s nullglob

          SEARCH_PATH="ios/build/Build/Products/*simulator/*.app"
          FILES_FOUND=false

          for APP_PATH in $SEARCH_PATH; do
            FILES_FOUND=true
            echo "Installing \"$APP_PATH\""
            xcrun simctl install booted "$APP_PATH"
          done

          if ! $FILES_FOUND; then
            echo "No files found matching \"$SEARCH_PATH\". Are you sure you've built a Simulator app?"
            exit 1
          fi
    - run:
        command: |
          maestro test maestro/flow.yml
    - eas/upload_artifact:
        name: Upload test artifact
        if: ${ always() }
        inputs:
          type: build-artifact
          path: ${ eas.env.HOME }/.maestro/tests
```

</details>

- **[eas/maestro_test 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functionGroups/maestroTest.ts)**：在 GitHub 上查看 eas/maestro_test 函数的源代码。

#### `eas/checkout`

检出项目源文件。

```yaml upload.yml
build:
  name: List files
  steps:
    - eas/checkout
    - run:
        name: List assets
        run: ls assets
```

对于基于 Git 的项目源，该步骤默认使用构建记录的提交。使用 `ref` 检出不同的分支、标签或提交：

```yaml example.yml
build:
  name: Check out a specific ref
  steps:
    - eas/checkout:
        inputs:
          ref: feature/add-icon
    - eas/build
```

`ref` 接受：

- 分支，可以是裸名称（如 `feature/add-icon`）或限定引用（如 `refs/heads/feature/add-icon`）。仓库最终会位于该分支上。
- 标签，作为限定引用，如 `refs/tags/v1.2.3`。仓库最终会位于分离的 `HEAD` 上。
- 完整的提交 SHA。仓库最终会位于分离的 `HEAD` 上。

`ref` 输入仅在项目源来自 Git 仓库时有效，例如通过 GitHub 集成触发的构建。本地构建和上传的项目压缩包不支持它。把该步骤放在 [`eas/build`](#easbuild) 之前，后者会在内部检出项目。

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `ref` | `string` | 否 | 要检出的 Git 分支、标签或完整提交 SHA。默认为触发构建或工作流作业的引用。 |

- **[eas/checkout 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/checkout.ts)**：在 GitHub 上查看 eas/checkout 函数的源代码。

#### `eas/use_npm_token`

配置 Node 包管理器（bun、npm、pnpm 或 Yarn），以便使用发布到 npm 或私有注册表的私有包。

在项目密钥中设置 `NPM_TOKEN`，此函数会通过创建带有该令牌的 **.npmrc** 来配置构建环境。

```yaml example.yml
build:
  name: Install private npm modules
  steps:
    - eas/checkout
    - eas/use_npm_token
    - run:
        name: Install dependencies
        run: npm install # 现在可以安装私有包
```

- **[eas/use_npm_token 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/useNpmToken.ts)**：在 GitHub 上查看 eas/use_npm_token 函数的源代码。

#### `eas/install_node_modules`

使用根据项目检测到的包管理器（bun、npm、pnpm 或 Yarn）安装 node_modules。适用于 monorepo。

```yaml example.yml
build:
  name: Install node modules
  steps:
    - eas/checkout
    - eas/install_node_modules
```

- **[eas/install_node_modules 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/installNodeModules.ts)**：在 GitHub 上查看 eas/install_node_modules 函数的源代码。

#### `eas/restore_build_cache`

从指定键恢复先前保存的构建缓存。这对于通过复用已编译依赖、构建工具或其他中间构建输出等缓存产物来加快构建很有用。

```yaml example.yml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          restore_keys: cache
          path: /path/to/cache
```

```yaml example.yml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Restore build cache`。 |
| `inputs.key` | `string` | 是 | 要恢复的缓存键。可以使用 `${{ hashFiles('package-lock.json') }}` 等表达式，根据文件哈希创建动态键。 |
| `inputs.restore_keys` | `string` | 否 | 如果找不到精确键时使用的回退键或前缀。如果提供，缓存系统会查找任何以此前缀开头的缓存条目。 |
| `inputs.path` | `string` | 是 | 应恢复缓存的路径。这应与保存缓存时使用的路径匹配。 |

- **[eas/restore_build_cache 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/restoreBuildCache.ts)**：在 GitHub 上查看 eas/restore_build_cache 函数的源代码。

#### `eas/save_build_cache`

把构建缓存保存到指定键。这允许你持久化构建产物、已编译依赖或其他中间输出，以便在后续构建中复用，从而加快构建过程。

```yaml example.yml
build:
  name: Build with cache
  steps:
    - eas/checkout
    - eas/restore_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
    - eas/install_node_modules
    - eas/prebuild
    - eas/run_gradle
    - eas/save_build_cache:
        inputs:
          key: cache-${{ hashFiles('package-lock.json') }}
          path: /path/to/cache
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Save build cache`。 |
| `inputs.key` | `string` | 是 | 保存缓存所用的缓存键。可以使用 `${{ hashFiles('package-lock.json') }}` 等表达式，根据文件哈希创建动态键。这应与恢复缓存时使用的键匹配。 |
| `inputs.path` | `string` | 是 | 应缓存的目录或文件路径。这应与恢复缓存时使用的路径匹配。 |

- **[eas/save_build_cache 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/saveBuildCache.ts)**：在 GitHub 上查看 eas/save_build_cache 函数的源代码。

#### `eas/resolve_build_config`

解析并打印构建配置。如果构建由 GitHub 集成触发，它会更新当前的 `job` 和 `metadata` 上下文值。应在安装依赖之后调用它，因为配置可能受配置插件影响。

此函数由 [`eas/build`](#easbuild) 函数组自动执行。

- **[eas/resolve_build_config 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/resolveBuildConfig.ts)**：在 GitHub 上查看 eas/resolve_build_config 函数的源代码。

#### `eas/get_credentials_for_build_triggered_by_github_integration`

:::danger
**[已弃用](/more/release-statuses#deprecated)：** 用 [`eas/resolve_build_config`](#easresolve_build_config) 替换此步骤。
:::

#### `eas/resolve_apple_team_id_from_credentials`

:::warning
此函数仅适用于 iOS 构建。
:::

根据 `inputs.credentials` 中提供的构建凭据解析 Apple team ID 值。解析出的 Apple team ID 存储在 `outputs.apple_team_id` 输出值中。

```yaml example.yml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Resolve Apple team ID from credentials`。 |
| `inputs.credentials` | `json` | 否 | iOS 构建的应用凭据。默认为 `${ eas.job.secrets.buildCredentials }`。需要符合 iOS 的 `${ eas.job.secrets.buildCredentials }` schema。 |

- **[eas/resolve_apple_team_id_from_credentials 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/resolveAppleTeamIdFromCredentials.ts)**：在 GitHub 上查看 eas/resolve_apple_team_id_from_credentials 函数的源代码。

#### `eas/prebuild`

使用根据项目检测到的包管理器（bun、npm、pnpm 或 Yarn），以最适合你的构建类型和构建环境的命令运行 `expo prebuild`。

```yaml example.yml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
```

```yaml example.yml
build:
  name: Run prebuild script
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `clean` | `boolean` | 可选属性，定义函数运行命令时是否应使用 `--clean` 标志。默认为 false。 |
| `apple_team_id` | `string` | 可选属性，定义预构建时应使用的 Apple team ID。使用凭据的 iOS 构建应指定它。 |

- **[eas/prebuild 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/prebuild.ts)**：在 GitHub 上查看 eas/prebuild 函数的源代码。

#### `eas/configure_eas_update`

:::warning
要使用此函数，需要已为项目配置 EAS Update。
:::

为构建配置运行时版本和发布 channel。

```yaml example.yml
build:
  name: Configure EAS Update
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
```

```yaml example.yml
build:
  name: Configure EAS Update
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update:
        inputs:
          runtime_version: 1.0.0
          channel: mychannel
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Configure EAS Update`。 |
| `inputs.runtime_version` | `string` | 否 | 应为构建配置的运行时版本。默认为 `${ eas.job.version.runtimeVersion }` 或原生定义的运行时版本。 |
| `inputs.channel` | `string` | 否 | 应为构建配置的 channel。默认为 `${ eas.job.updates.channel }`。 |

- **[eas/configure_eas_update 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/configureEASUpdateIfInstalled.ts)**：在 GitHub 上查看 eas/configure_eas_update 函数的源代码。

#### `eas/inject_android_credentials`

:::warning
此函数仅适用于 Android 构建。
:::

使用凭据在构建器上配置 Android keystore，并把使用这些凭据的应用签名配置注入 Gradle 配置。

```yaml example.yml
build:
  name: Android credentials
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/inject_android_credentials
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Inject Android credentials`。 |
| `inputs.credentials` | `json` | 否 | Android 构建的应用凭据。默认为 `${ eas.job.secrets.buildCredentials }`。需要符合 Android 的 `${ eas.job.secrets.buildCredentials }` schema。 |

- **[eas/inject_android_credentials 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/injectAndroidCredentials.ts)**：在 GitHub 上查看 eas/inject_android_credentials 函数的源代码。

#### `eas/configure_ios_credentials`

:::warning
此函数仅适用于 iOS 构建。
:::

在构建器上配置 iOS 凭据。通过把描述文件分配给目标来修改 Xcode 项目的配置。

```yaml example.yml
build:
  name: iOS credentials
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_ios_credentials
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Configure iOS credentials`。 |
| `inputs.build_configuration` | `string` | 否 | Xcode 项目的 Build Configuration。默认为 `${ eas.job.buildConfiguration }`；如果未指定，开发客户端解析为 `Debug`，其他构建解析为 `Release`。 |
| `inputs.credentials` | `json` | 否 | iOS 构建的应用凭据。默认为 `${ eas.job.secrets.buildCredentials }`。需要符合 iOS 的 `${ eas.job.secrets.buildCredentials }` schema。 |

- **[eas/configure_ios_credentials 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/configureIosCredentials.ts)**：在 GitHub 上查看 eas/configure_ios_credentials 函数的源代码。

#### `eas/configure_android_version`

:::warning
此函数仅适用于 Android 构建。
:::

配置 Android 应用的版本。在使用[远程应用版本管理](/build-reference/app-versions)时用它设置版本。

不是必须使用此函数。如果不使用，将使用预构建阶段生成的原生代码中的版本。

```yaml example.yml
build:
  name: Configure Android version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/configure_android_version
```

```yaml example.yml
build:
  name: Configure Android version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/configure_android_version:
        inputs:
          version_code: '123'
          version_name: '1.0.0'
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Configure Android version`。 |
| `inputs.version_code` | `string` | 否 | Android 构建的 `versionCode`。默认为 `${ eas.job.version.versionCode }`。 |
| `inputs.version_name` | `string` | 否 | Android 构建的 `versionName`。默认为 `${ eas.job.version.versionName }`。 |

- **[eas/configure_android_version 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/configureAndroidVersion.ts)**：在 GitHub 上查看 eas/configure_android_version 函数的源代码。

#### `eas/configure_ios_version`

:::warning
此函数仅适用于 iOS 构建。
:::

配置 iOS 应用的版本。在使用[远程应用版本管理](/build-reference/app-versions)时用它设置版本。

不是必须使用此函数。如果不使用，将使用预构建阶段生成的原生代码中的版本。

```yaml example.yml
build:
  name: Configure iOS version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/configure_ios_version
```

```yaml example.yml
build:
  name: Configure iOS version
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/configure_ios_version:
        inputs:
          build_number: '123'
          app_version: '1.0.0'
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Configure iOS version`。 |
| `inputs.build_number` | `string` | 否 | iOS 构建的构建号（`CFBundleVersion`）。默认为 `${ eas.job.version.buildNumber }`。 |
| `inputs.app_version` | `string` | 否 | iOS 构建的应用版本（`CFBundleShortVersionString`）。默认为 `${ eas.job.version.appVersion }`。 |
| `inputs.build_configuration` | `string` | 否 | Xcode 项目的 Build Configuration。默认为 `${ eas.job.buildConfiguration }`；如果未指定，开发客户端解析为 `Debug`，其他构建解析为 `Release`。 |
| `inputs.credentials` | `json` | 否 | iOS 构建的应用凭据。默认为 `${ eas.job.secrets.buildCredentials }`。需要符合 iOS 的 `${ eas.job.secrets.buildCredentials }` schema。 |

- **[eas/configure_ios_version 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/configureIosVersion.ts)**：在 GitHub 上查看 eas/configure_ios_version 函数的源代码。

#### `eas/run_gradle`

:::warning
此函数仅适用于 Android 构建。
:::

运行 Gradle 命令以构建 Android 应用。

```yaml example.yml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle
```

```yaml example.yml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle:
        inputs:
          command: :app:bundleRelease
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Run gradle`。 |
| `inputs.command` | `string` | 否 | 用于构建 Android 应用的 Gradle 命令。如果未指定，则根据构建配置和 `${ eas.job }` 对象的内容解析。 |

- **[eas/run_gradle 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/runGradle.ts)**：在 GitHub 上查看 eas/run_gradle 函数的源代码。

#### `eas/generate_gymfile_from_template`

:::warning
此函数仅适用于 iOS 构建。
:::

从模板生成用于使用 Fastlane 构建 iOS 应用的 [`Gymfile`](https://docs.fastlane.tools/actions/gym/#gymfile)。

传入凭据时使用的默认模板：

```ruby Gymfile
suppress_xcode_output(true)
clean(<%- CLEAN %>)

scheme("<%- SCHEME %>")
<% if (BUILD_CONFIGURATION) { %>
configuration("<%- BUILD_CONFIGURATION %>")
<% } %>

export_options({
method: "<%- EXPORT_METHOD %>",
provisioningProfiles: {<% _.forEach(PROFILES, function(profile) { %>
    "<%- profile.BUNDLE_ID %>" => "<%- profile.UUID %>",<% }); %>
}<% if (ICLOUD_CONTAINER_ENVIRONMENT) { %>,
iCloudContainerEnvironment: "<%- ICLOUD_CONTAINER_ENVIRONMENT %>"
<% } %>
})

export_xcargs "OTHER_CODE_SIGN_FLAGS=\\"--keychain <%- KEYCHAIN_PATH %>\\""

disable_xcpretty(true)
buildlog_path("<%- LOGS_DIRECTORY %>")

output_directory("<%- OUTPUT_DIRECTORY %>")
```

未传入凭据时使用的默认模板（模拟器构建）：

```ruby Gymfile
suppress_xcode_output(true)
clean(<%- CLEAN %>)

scheme("<%- SCHEME %>")
<% if (BUILD_CONFIGURATION) { %>
configuration("<%- BUILD_CONFIGURATION %>")
<% } %>

derived_data_path("<%- DERIVED_DATA_PATH %>")
skip_package_ipa(true)
skip_archive(true)
destination("<%- SCHEME_SIMULATOR_DESTINATION %>")

disable_xcpretty(true)
buildlog_path("<%- LOGS_DIRECTORY %>")
```

`CLEAN`、`SCHEME`、`BUILD_CONFIGURATION`、`EXPORT_METHOD`、`PROFILES`、`ICLOUD_CONTAINER_ENVIRONMENT`、`KEYCHAIN_PATH`、`LOGS_DIRECTORY`、`OUTPUT_DIRECTORY`、`DERIVED_DATA_PATH` 和 `SCHEME_SIMULATOR_DESTINATION` 的值根据输入和 EAS Build 的默认内部配置提供给模板。

```yaml example.yml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
```

```yaml example.yml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/generate_gymfile_from_template
```

也可以在模板中使用其他自定义属性：在 `inputs.template` 中指定自定义模板，并在 `inputs.extra` 对象中为自定义属性提供值。

```yaml example.yml
build:
  name: Generate Gymfile template
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
          extra:
            MY_VALUE: my value
          template: |
            suppress_xcode_output(true)
            clean(<%- CLEAN %>)

            scheme("<%- SCHEME %>")
            <% if (BUILD_CONFIGURATION) { %>
            configuration("<%- BUILD_CONFIGURATION %>")
            <% } %>

            export_options({
            method: "<%- EXPORT_METHOD %>",
            provisioningProfiles: {<% _.forEach(PROFILES, function(profile) { %>
                "<%- profile.BUNDLE_ID %>" => "<%- profile.UUID %>",<% }); %>
            }<% if (ICLOUD_CONTAINER_ENVIRONMENT) { %>,
            iCloudContainerEnvironment: "<%- ICLOUD_CONTAINER_ENVIRONMENT %>"
            <% } %>
            })

            export_xcargs "OTHER_CODE_SIGN_FLAGS=\"--keychain <%- KEYCHAIN_PATH %>\""

            disable_xcpretty(true)
            buildlog_path("<%- LOGS_DIRECTORY %>")

            output_directory("<%- OUTPUT_DIRECTORY %>")

            sth_else("<%- MY_VALUE %>")
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | - | 否 | 在构建日志中显示的可复用函数步骤名称。默认为 `Generate Gymfile from template`。 |
| `inputs.template` | `string` | 否 | 应使用的 Gymfile 模板。如果未指定，将根据是否指定了 `inputs.credentials` 值使用两个默认模板之一。 |
| `inputs.credentials` | `json` | 否 | iOS 构建的应用凭据。如果指定，将向模板提供 `KEYCHAIN_PATH`、`EXPORT_METHOD` 和 `PROFILES` 值。 |
| `inputs.build_configuration` | `string` | 否 | Xcode 项目的 Build Configuration。默认为 `${ eas.job.buildConfiguration }`；如果未指定，开发客户端解析为 `Debug`，其他构建解析为 `Release`。对应于 `BUILD_CONFIGURATION` 模板值。 |
| `inputs.scheme` | `string` | 否 | 构建应使用的 Xcode 项目 scheme。默认为 `${ eas.job.scheme }`；如果未指定，解析为 Xcode 项目中找到的第一个 scheme。对应于 `SCHEME` 模板值。 |
| `inputs.clean` | `boolean` | 否 | 构建前是否应清理 Xcode 项目。默认为 `true`。对应于 `CLEAN` 模板变量。 |
| `inputs.extra` | `json` | 否 | 应提供给模板的额外值。 |

- **[eas/generate_gymfile_from_template 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/generateGymfileFromTemplate.ts)**：在 GitHub 上查看 eas/generate_gymfile_from_template 函数的源代码。

#### `eas/run_fastlane`

:::warning
此函数仅适用于 iOS 构建。
:::

针对 `ios` 项目目录中的 [`Gymfile`](https://docs.fastlane.tools/actions/gym/#gymfile) 运行 [`fastlane gym`](https://docs.fastlane.tools/actions/gym/#gym) 命令以构建 iOS 应用。

```yaml example.yml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
    - eas/run_fastlane
```

```yaml example.yml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/generate_gymfile_from_template
    - eas/run_fastlane
```

- **[eas/run_fastlane 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/runFastlane.ts)**：在 GitHub 上查看 eas/run_fastlane 函数的源代码。

#### `eas/find_and_upload_build_artifacts`

:::warning
**目前每个构建作业每种产物类型只能上传一次。** 如果在构建 profile 中配置了 [`buildArtifactPaths`](/eas/json#buildartifactpaths) 的同时使用 [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)，并且该步骤找到并上传了一些构建产物，则之后的任何 `eas/upload_artifact` 步骤都会失败。目前的解决办法是：从自定义构建的 profile 中移除 `buildArtifactPaths`，如果需要在 YAML 中调用，则用 `eas/upload_artifact` 手动上传产物。
:::

自动从默认位置并使用 [`buildArtifactPaths`](/eas/json#buildartifactpaths) 配置查找并上传应用归档、额外构建产物和 Xcode 日志。把找到的产物上传到 EAS 服务器。

```yaml example.yml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials
    - eas/prebuild:
        inputs:
          clean: false
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }
    - eas/configure_eas_update
    - eas/configure_ios_credentials
    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }
    - eas/run_fastlane
    - eas/find_and_upload_build_artifacts
```

```yaml example.yml
build:
  name: Build iOS app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/generate_gymfile_from_template
    - eas/run_fastlane
    - eas/find_and_upload_build_artifacts
```

```yaml example.yml
build:
  name: Build Android app
  steps:
    - eas/checkout
    - eas/install_node_modules
    - eas/prebuild
    - eas/configure_eas_update
    - eas/inject_android_credentials
    - eas/run_gradle
    - eas/find_and_upload_build_artifacts
```

- **[eas/find_and_upload_build_artifacts 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/findAndUploadBuildArtifacts.ts)**：在 GitHub 上查看 eas/find_and_upload_build_artifacts 函数的源代码。

#### `eas/upload_artifact`

把作业工作区中的文件作为附加到该次运行的产物上传。上传的产物出现在运行的 **Artifacts** 部分，并可以在后续作业中用 [`eas/download_artifact`](/eas/workflows/syntax#easdownload_artifact) 取回。

:::warning
**目前每个构建作业每种产物类型只能上传一次。** 如果在构建 profile 中配置了 [`buildArtifactPaths`](/eas/json#buildartifactpaths) 的同时使用 [`eas/find_and_upload_build_artifacts`](#easfind_and_upload_build_artifacts)，并且该步骤找到并上传了一些构建产物，则之后的任何 `eas/upload_artifact` 步骤都会失败。目前的解决办法是：从自定义构建的 profile 中移除 `buildArtifactPaths`，如果需要在 YAML 中调用，则用 `eas/upload_artifact` 手动上传产物。
:::

```yaml upload.yml
build:
  name: Upload artifacts
  steps:
    - eas/checkout
    # - ...
    - eas/upload_artifact:
        name: Upload application archive
        inputs:
          path: fixtures/app-debug.apk
    - eas/upload_artifact:
        name: Upload artifacts
        inputs:
          type: build-artifact
          path: |
            assets/*.jpg
            assets/*.png
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `path` | string | 是 | 要上传的路径，或换行分隔的路径列表。支持 `*` 和其他 [glob 模式](https://github.com/isaacs/node-glob#glob-primer)。 |
| `type` | string | 否 | 产物类型。在自定义作业中使用 `other`（通用产物）。当作业没有构建平台时默认为 `other`，在构建作业中默认为 `application-archive`。限定于构建的值 `application-archive` 和 `build-artifact` 只在构建作业中有效。 |
| `name` | string | 否 | 产物名称，用于从 [`eas/download_artifact`](/eas/workflows/syntax#easdownload_artifact) 引用它。 |
| `metadata` | json | 否 | 要附加到通用（`other`）产物的任意元数据。 |
| `ignore_error` | boolean | 否 | 为 `true` 时，上传失败会被记录但不会使步骤失败。默认为 `false`。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `artifact_id` | string | 已上传产物的 ID。可以传给 [`eas/download_artifact`](/eas/workflows/syntax#easdownload_artifact)。 |

- **[eas/upload_artifact 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/uploadArtifact.ts)**：在 GitHub 上查看 eas/upload_artifact 函数的源代码。

#### `eas/install_maestro`

确保已安装移动 UI 测试框架 [Maestro](https://maestro.dev/) 及其所有依赖。

```yaml build-and-test.yml
build:
  name: Build and test
  steps:
    - eas/build
    # ... 模拟器设置
    - eas/install_maestro:
        inputs:
          # 如果需要，可以提供要安装的 Maestro 版本。
          maestro_version: 1.35.0
    - run:
        command: maestro test flows/signin.yml
    - eas/upload_artifact:
        name: Upload Maestro artifacts
        inputs:
          type: build-artifact
          path: ${ eas.env.HOME }/.maestro/tests
```

| 输入 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `maestro_version` | `string` | 否 | 要安装的 Maestro 版本（例如 1.35.0）。如果未提供，`install_maestro` 会安装最新版本。 |

- **[eas/install_maestro 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/installMaestro.ts)**：在 GitHub 上查看 eas/install_maestro 函数的源代码。

#### `eas/start_android_emulator`

启动可用于测试应用的 Android 模拟器。仅在为 Android 运行构建时可用。

:::warning
项目必须配置为使用旧版构建基础设施才能启动 Android 模拟器。前往[项目设置](https://expo.dev/accounts/[account]/projects/[project]/settings)进行配置。更多信息见[这篇更新日志](https://expo.dev/changelog/2024-08-29-c3d-default)。
:::

```yaml build-and-test.yml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/start_android_emulator:
        inputs:
          system_image_package: system-images;android-30;default;x86_64
    # ... Maestro 设置和测试
```

| 输入 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `device_name` | `string` | 否 | 创建的设备名称。如果启动多个模拟器，可以自定义它。 |
| `system_image_package` | `string` | 否 | 模拟器使用的 Android 包路径。例如 `system-images;android-30;default;x86_64`。要获取可用系统镜像列表，在本地计算机上运行 [`sdkmanager --list`](https://developer.android.com/tools/sdkmanager#list)。虚拟机运行在 x86_64 架构上，因此始终选择 `x86_64` 包变体。[`sdkmanager` 工具](https://developer.android.com/tools/sdkmanager)来自 Android SDK 命令行工具。 |

- **[eas/start_android_emulator 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/startAndroidEmulator.ts)**：在 GitHub 上查看 eas/start_android_emulator 函数的源代码。

#### `eas/start_ios_simulator`

启动可用于测试应用的 iOS 模拟器。仅在为 iOS 运行构建时可用。

```yaml build-and-test.yml
build:
  name: Build and test
  steps:
    - eas/build
    - eas/start_ios_simulator
    # ... Maestro 设置和测试
```

| 输入 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `device_identifier` | `string` | 否 | 要启动的模拟器的名称或 UDID。示例包括 `iPhone [XY] Pro`、`AEF997BB-222C-4379-89BA-D21070B1D787`。**注意：** 每个镜像可用的模拟器不同。如果更改镜像，给定名称的模拟器可能变得不可用。例如，Xcode 14 镜像会有 iPhone 14 模拟器，而 Xcode 15 镜像会有 iPhone 15 模拟器。通常建议不要提供此输入。更多信息见[运行器镜像](/build/eas-json#选择基础镜像)。 |

- **[eas/start_ios_simulator 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/startIosSimulator.ts)**：在 GitHub 上查看 eas/start_ios_simulator 函数的源代码。

#### `eas/send_slack_message`

向已配置的 [Slack webhook URL](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks) 发送指定消息，然后该 URL 会把它发布到相关 Slack 频道。消息可以指定为纯文本或 [Slack Block Kit](https://docs.slack.dev/block-kit) 消息。

可以在消息中引用构建作业属性并[使用其他步骤的输出](#把一个步骤的输出用于另一个步骤)进行动态求值。例如 `'Build URL: ${ eas.job.expoBuildUrl }'`、`Build finished with status: ${ steps.run_fastlane.status_text }`、`Build failed with error: ${ steps.run_gradle.error_text }`。

```yaml send-slack-message.yml
build:
  name: Slack your team from custom build
  steps:
    - eas/send_slack_message:
        name: Send Slack message to a given webhook URL
        inputs:
          message: 'This is a message to plain input URL'
          slack_hook_url: 'https://hooks.slack.com/services/[rest_of_hook_url]'
    - eas/send_slack_message:
        name: Send Slack message to a default webhook URL from SLACK_HOOK_URL secret
        inputs:
          message: 'This is a test message to default URL from SLACK_HOOK_URL secret'
    - eas/send_slack_message:
        name: Send Slack message to a webhook URL from specified secret
        inputs:
          message: 'This is a test message to a URL from specified secret'
          slack_hook_url: ${ eas.env.ANOTHER_SLACK_HOOK_URL }

    - eas/build
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message when the build finishes (Android)
        inputs:
          message: |
            This is a test message when Android build finishes
            Status: `${ steps.run_gradle.status_text }`
            Link: `${ eas.job.expoBuildUrl }`
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message when the build finishes (iOS)
        inputs:
          message: |
            This is a test message when iOS build finishes
            Status: `${ steps.run_fastlane.status_text }`
            Link: `${ eas.job.expoBuildUrl }`
    - eas/send_slack_message:
        if: ${ failure() }
        name: Send Slack message when the build fails (Android)
        inputs:
          message: |
            This is a test message when Android build fails
            Error: `${ steps.run_gradle.error_text }`
    - eas/send_slack_message:
        if: ${ failure() }
        name: Send Slack message when the build fails (iOS)
        inputs:
          message: |
            This is a test message when iOS build fails
            Error: `${ steps.run_fastlane.error_text }`
    - eas/send_slack_message:
        if: ${ success() }
        name: Send Slack message when the build succeeds
        inputs:
          message: |
            This is a test message when build succeeds
    - eas/send_slack_message:
        if: ${ always() }
        name: Send Slack message with Slack Block Kit layout
        inputs:
          payload:
            blocks:
              - type: section
                text:
                  type: mrkdwn
                  text: |-
                    Hello, Sir Developer

                     *Your build has finished!*
              - type: divider
              - type: section
                text:
                  type: mrkdwn
                  text: |-
                    *${ eas.env.EAS_BUILD_ID }*
                    *Status:* `${ steps.run_gradle.status_text }`
                    *Link:* `${ eas.job.expoBuildUrl }`
                accessory:
                  type: image
                  image_url: [your_image_url]
                  alt_text: alt text for image
              - type: divider
              - type: actions
                elements:
                  - type: button
                    text:
                      type: plain_text
                      text: 'Do a thing :rocket:'
                      emoji: true
                    value: a_thing
                  - type: button
                    text:
                      type: plain_text
                      text: 'Do another thing :x:'
                      emoji: true
                    value: another_thing
```

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `message` | `string` | 要发送的消息文本。例如 `'This is the content of the message'`。**注意：** 必须提供 `message` 或 `payload` 之一，但不能同时提供。 |
| `payload` | `json` | 要发送的消息内容，使用 [Slack Block Kit](https://docs.slack.dev/block-kit) 布局定义。**注意：** 必须提供 `message` 或 `payload` 之一，但不能同时提供。 |
| `slack_hook_url` | `string` | 先前配置的 Slack webhook URL，它会把消息发布到指定频道。使用 [EAS 环境变量](/eas/environment-variables/manage#管理环境变量)提供它，例如 `slack_hook_url: ${{ env.ANOTHER_SLACK_HOOK_URL }}`，或设置 `SLACK_HOOK_URL` 环境变量作为默认 webhook URL（后一种情况下无需提供 `slack_hook_url` 属性）。 |

- **[eas/send_slack_message 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/sendSlackMessage.ts)**：在 GitHub 上查看 eas/send_slack_message 函数的源代码。

以下函数把构建连接到 [PostHog](/guides/using-posthog)。运行 `eas integrations:posthog:connect` 以链接 PostHog 项目并设置这些函数读取的环境变量。`eas/posthog_capture_event` 使用公开的项目 API 密钥，而其他函数使用带有各自注明作用域的 PostHog 个人 API 密钥。设置见[使用 PostHog](/guides/using-posthog)，完整工作流见 [EAS Workflows 的 PostHog 配方](/guides/using-posthog/recipes)。

#### `eas/posthog_capture_event`

向 [PostHog](https://posthog.com/) 发送分析事件。用它在 PostHog 时间线上标记构建、发布和其他里程碑。

如果不提供 `distinct_id`，事件会匿名发送，并且不会创建 PostHog [人员资料](https://posthog.com/docs/data/persons)。

```yaml posthog-capture-event.yml
build:
  name: Build and mark the release in PostHog
  steps:
    - eas/build
    - eas/posthog_capture_event:
        name: Capture a PostHog event
        inputs:
          event: store_build_finished
          properties:
            platform: ios
            profile: production
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `event` | string | 是 | 要发送的事件名称。 |
| `distinct_id` | string | 否 | 要把事件归属到的人员。省略时，事件匿名发送，并且不会创建人员资料。 |
| `properties` | json | 否 | 要附加到事件的属性。 |
| `api_key` | string | 否 | PostHog 项目 API 密钥。默认为由 `eas integrations:posthog:connect` 设置的 `EXPO_PUBLIC_POSTHOG_API_KEY` 环境变量；如果未设置，则回退到 `POSTHOG_API_KEY`。 |
| `host` | string | 否 | PostHog 主机。默认为 `EXPO_PUBLIC_POSTHOG_HOST` 环境变量，或 `https://us.posthog.com`。 |
| `ignore_error` | boolean | 否 | 为 `true` 时，发送事件失败会被记录但不会使步骤失败。默认为 `false`。 |

- **[eas/posthog_capture_event 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/capturePosthogEvent.ts)**：在 GitHub 上查看 eas/posthog_capture_event 函数的源代码。

#### `eas/posthog_flag_rollout`

启用、禁用或推出 [PostHog 功能标志](https://posthog.com/docs/feature-flags)。该函数按键查找标志然后更新它。至少提供 `active`、`rollout_percentage` 或 `payload` 之一。

```yaml posthog-flag-rollout.yml
build:
  name: Roll out a PostHog feature flag
  steps:
    - eas/posthog_flag_rollout:
        name: Roll out the flag to 25 percent
        inputs:
          flag: new-checkout
          rollout_percentage: 25
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `flag` | string | 是 | 要更新的功能标志的键。 |
| `active` | boolean | 否 | 标志是否启用。 |
| `rollout_percentage` | number | 否 | 标志推出到的用户百分比，为 `0` 到 `100` 的整数。函数把它应用到标志的兜底发布条件并保留其他条件。当标志没有兜底条件时，函数把它应用到第一个条件。 |
| `payload` | json | 否 | 要附加到标志的载荷。 |
| `variant` | string | 否 | 在多变量标志上存储 `payload` 所用的变体键。默认为标志的 `true` 载荷。 |
| `api_key` | string | 否 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `feature_flag:read` 和 `feature_flag:write` 作用域。 |
| `project_id` | string | 否 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 否 | 为 `true` 时，网络错误、缺少标志或意外响应会被记录但不会使步骤失败。默认为 `false`。权限错误，或无效输入（例如超出范围的 `rollout_percentage`）始终会使步骤失败。 |

- **[eas/posthog_flag_rollout 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/rolloutPosthogFlag.ts)**：在 GitHub 上查看 eas/posthog_flag_rollout 函数的源代码。

#### `eas/posthog_wait_for_metric`

暂停，直到 [HogQL](https://posthog.com/docs/hogql) 查询返回满足比较条件的数字。用它来对指标设门控，例如保持等待直到最近几分钟的错误计数保持较低。函数每 `interval_seconds` 运行一次查询，直到比较为真或经过 `timeout_seconds`。

:::note
此步骤没有 `ignore_error` 输入。超时或无法读取的查询始终会使步骤失败。
:::

```yaml posthog-wait-for-metric.yml
build:
  name: Gate on the error count
  steps:
    - eas/posthog_wait_for_metric:
        name: Wait for the error count to stay low
        inputs:
          query: SELECT count() FROM events WHERE event = '$exception' AND timestamp > now() - INTERVAL 15 MINUTE
          operator: lt
          threshold: 10
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `query` | string | 是 | HogQL 查询。第一行的第一列必须是单个数字。 |
| `operator` | string | 是 | 比较运算符。`lt`、`lte`、`gt`、`gte` 或 `eq` 之一。当 `value <operator> threshold` 成立时步骤通过。 |
| `threshold` | number | 是 | 用来与查询结果比较的值。 |
| `timeout_seconds` | number | 否 | 最长等待时间，以秒为单位。默认为 `600`。 |
| `interval_seconds` | number | 否 | 检查之间的时间，以秒为单位。默认为 `30`。 |
| `api_key` | string | 否 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `query:read` 作用域。 |
| `project_id` | string | 否 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |

##### 输出

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `value` | string | 满足比较条件的指标值。 |

- **[eas/posthog_wait_for_metric 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/waitForPosthogMetric.ts)**：在 GitHub 上查看 eas/posthog_wait_for_metric 函数的源代码。

#### `eas/posthog_wait_for_query`

暂停，直到 [HogQL](https://posthog.com/docs/hogql) 查询返回 true。当条件更容易在查询本身中表达时使用它。对于带有显式阈值的数值比较，请改用 [`eas/posthog_wait_for_metric`](#easposthog_wait_for_metric)。当第一行的第一列是 `true` 或非零数字时，步骤通过。

:::note
与 `eas/posthog_wait_for_metric` 一样，此步骤没有 `ignore_error` 输入。超时或无法读取的查询始终会使步骤失败。
:::

```yaml posthog-wait-for-query.yml
build:
  name: Wait for a smoke test event
  steps:
    - eas/posthog_wait_for_query:
        name: Wait for the smoke test to pass
        inputs:
          query: SELECT count() > 0 FROM events WHERE event = 'smoke_test_passed' AND timestamp > now() - INTERVAL 30 MINUTE
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `query` | string | 是 | HogQL 查询。当第一行的第一列是 `true` 或非零数字时，步骤通过。 |
| `timeout_seconds` | number | 否 | 最长等待时间，以秒为单位。默认为 `600`。 |
| `interval_seconds` | number | 否 | 检查之间的时间，以秒为单位。默认为 `30`。 |
| `api_key` | string | 否 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `query:read` 作用域。 |
| `project_id` | string | 否 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |

- **[eas/posthog_wait_for_query 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/waitForPosthogQuery.ts)**：在 GitHub 上查看 eas/posthog_wait_for_query 函数的源代码。

#### `eas/posthog_annotation`

在项目时间线上创建 [PostHog 注释](https://posthog.com/docs/data/annotations)。注释显示在 PostHog 图表上，因此适合在受影响的指标旁边标记构建、发布和其他里程碑。

```yaml posthog-annotation.yml
build:
  name: Annotate the release in PostHog
  steps:
    - eas/posthog_annotation:
        name: Create a PostHog annotation
        inputs:
          content: Published a production build
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `content` | string | 是 | 注释文本。 |
| `date_marker` | string | 否 | 注释固定到的 ISO 8601 时间戳。默认为当前时间。 |
| `api_key` | string | 否 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 `annotation:write` 作用域。 |
| `project_id` | string | 否 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 否 | 为 `true` 时，网络错误或意外响应会被记录但不会使步骤失败。默认为 `false`。权限错误始终会使步骤失败。 |

- **[eas/posthog_annotation 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/createPosthogAnnotation.ts)**：在 GitHub 上查看 eas/posthog_annotation 函数的源代码。

#### `eas/posthog_upload_sourcemaps`

把 JavaScript source map 上传到 PostHog，以便 PostHog 在[错误跟踪](/guides/using-posthog#错误跟踪)中符号化堆栈跟踪。在产生 bundle 的步骤之后、同一作业中运行它，这样 bundle 和 source map 在磁盘上可用。使用 `npx expo export --source-maps` 导出，并按照 [Source map 指南](/guides/using-posthog#source-map)配置 PostHog Metro 配置，使 bundle 携带与其 source map 匹配的 chunk ID。

:::warning
此步骤运行 PostHog CLI，它无法把权限错误与任何其他失败区分开。与其他 PostHog 函数不同，设置 `ignore_error: true` 也会隐藏身份验证和作用域错误。
:::

```yaml posthog-upload-sourcemaps.yml
build:
  name: Export and upload source maps
  steps:
    - eas/checkout
    - eas/install_node_modules
    - run:
        name: Export the bundle and source maps
        command: npx expo export --source-maps --platform ios
    - eas/posthog_upload_sourcemaps:
        name: Upload source maps to PostHog
        inputs:
          directory: dist
```

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `directory` | string | 否 | 包含 bundle 和 source map 的目录，相对于工作目录。默认为 `dist`。 |
| `api_key` | string | 否 | PostHog 个人 API 密钥。默认为 `POSTHOG_CLI_API_KEY` 环境变量。需要 source map 上传权限。 |
| `project_id` | string | 否 | PostHog 项目 ID。默认为 `POSTHOG_CLI_PROJECT_ID` 环境变量。 |
| `ignore_error` | boolean | 否 | 为 `true` 时，上传失败会被记录但不会使步骤失败。默认为 `false`。 |

- **[eas/posthog_upload_sourcemaps 源代码](https://github.com/expo/eas-cli/blob/main/packages/build-tools/src/steps/functions/uploadPosthogSourcemaps.ts)**：在 GitHub 上查看 eas/posthog_upload_sourcemaps 函数的源代码。

### 使用内置 EAS 函数构建应用

使用内置 EAS 函数，可以为不同构建类型重建默认的 EAS Build 过程。

例如，要触发一个为 Android 创建内部分发构建、为 iOS 创建模拟器构建的构建，可以使用以下配置：

```json eas.json
{
  // ...
  "build": {
    // ...
    "developmentBuild": {
      "distribution": "internal",
      "android": {
        "config": "development-build-android.yml"
      },
      "ios": {
        "simulator": true,
        "config": "development-build-ios.yml"
      }
    }
    // ...
  }
  // ...
}
```

```yaml .eas/build/development-build-android.yml
build:
  name: Simple internal distribution Android build
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - eas/inject_android_credentials

    - eas/run_gradle

    - eas/find_and_upload_build_artifacts
```

```yaml .eas/build/development-build-ios.yml
build:
  name: Simple simulator iOS build
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - run:
        name: Install pods
        working_directory: ./ios
        command: pod install

    - eas/generate_gymfile_from_template

    - eas/run_fastlane

    - eas/find_and_upload_build_artifacts
```

要为 Android 创建 Google Play Store 构建、为 iOS 创建 Apple App Store 构建，可以使用以下配置：

```json eas.json
{
  // ...
  "build": {
    // ...
    "productionBuild": {
      "android": {
        "config": "production-build-android.yml"
      },
      "ios": {
        "config": "production-build-ios.yml"
      }
    }
    // ...
  }
  // ...
}
```

```yaml .eas/build/production-build-android.yml
build:
  name: Customized Android Play Store build example
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/prebuild

    - eas/inject_android_credentials

    - eas/run_gradle

    - eas/find_and_upload_build_artifacts
```

```yaml .eas/build/production-build-ios.yml
build:
  name: Customized iOS App Store build example
  steps:
    - eas/checkout

    - eas/install_node_modules

    - eas/resolve_apple_team_id_from_credentials:
        id: resolve_apple_team_id_from_credentials

    - eas/prebuild:
        inputs:
          apple_team_id: ${ steps.resolve_apple_team_id_from_credentials.apple_team_id }

    - run:
        name: Install pods
        working_directory: ./ios
        command: pod install

    - eas/configure_ios_credentials

    - eas/generate_gymfile_from_template:
        inputs:
          credentials: ${ eas.job.secrets.buildCredentials }

    - eas/run_fastlane

    - eas/find_and_upload_build_artifacts
```

查看**示例仓库**以获取更详细的示例：

- **[自定义构建示例仓库](https://github.com/expo/eas-custom-builds-example/tree/main)**：一个自定义 EAS Build 示例，包括设置函数、使用环境变量、上传产物等自定义构建示例。

### 在 `build` 中使用可复用函数

例如，具有以下可复用函数的自定义构建配置包含一条用于打印回显消息的命令。

```yaml
functions:
  greetings:
    - name: name
      default_value: Hello world
    inputs: [value]
    command: echo "${ inputs.name }, { inputs.value }"
```

上述函数可以在 `build` 中按如下方式使用：

```yaml
build:
  name: Functions Demo
  steps:
    - greetings:
        inputs:
          value: Expo
```

:::note
**提示：** `build.steps` 可以按顺序执行多个可复用 `functions`。
:::

## 在 `build` 中覆盖值

可以为以下属性覆盖值：

- `working_directory`
- `name`
- `shell`

例如，名为 `list_files` 的可复用函数：

```yaml
functions:
  list_files:
    name: List files
    command: ls -la
```

在构建配置中调用 `list_files` 时，它会列出项目根目录中的所有文件：

```yaml
build:
  name: List files
  steps:
    - eas/checkout
    - list_files
```

可以使用 `working_directory` 属性在函数调用中覆盖该行为，通过指定该目录的路径来列出不同目录中的文件：

```yaml
build:
  name: List files
  steps:
    - eas/checkout
    - list_files:
        working_directory: /a/b/c
```

