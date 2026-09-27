
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
