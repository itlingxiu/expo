
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
