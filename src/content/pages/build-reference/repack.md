---
title: 重新打包应用
description: 用更新后的 JavaScript 包重新打包已有的 APK、IPA 或 .app，而无需完整的原生重新构建。
---

# 重新打包应用

[`@expo/repack-app`](https://www.npmjs.com/package/@expo/repack-app) 是一个 CLI 工具，可以重新打包已有的 Android APK、iOS IPA 或 iOS **.app** 包，而无需执行完整的原生构建。它用新的 JavaScript（JS）包、资源和应用程序元数据（例如应用名称、版本，以及包名或 bundle identifier）更新已有产物。由于不涉及原生编译，重新打包通常比完整的原生构建快得多。

要进一步了解指纹与重新打包如何一起加快 CI，参见博客文章 [Accelerating Continuous Integration with Fingerprint and Repack in EAS Workflows](https://expo.dev/blog/accelerating-continuous-integration-with-fingerprint-repack-in-eas-workflows)。

**前置条件**

- **一份已有的构建产物**：由你的 Expo 项目产出的构建产物：Android 为 APK，iOS 为 IPA 或 **.app** 包。
- **签名凭据（可选）**：如果重新打包后的产物需要能在设备上安装，则需要凭据。更多信息参见[签名](#签名)。

## 何时使用重新打包

重新打包假定源二进制文件的原生侧自构建以来没有变化。如果你添加了原生依赖、更改了[配置插件](/config-plugins/introduction)，或升级了 Expo SDK，重新打包后的产物中的 JS 会期望并不存在的原生 API，并且很可能在运行时崩溃。使用 [fingerprint](/versions/latest/sdk/fingerprint) 把源二进制文件的原生身份与当前项目比较。如果指纹匹配，重新打包就是安全的。如果不同，请改为做完整的原生构建。

重新打包不能替代 [EAS Update](/eas-update/introduction)。EAS Update 把新的 JS 包发送给已经安装的应用，用户在下次启动时看到它。重新打包产出一份新的可安装产物。一个好的经验法则是：内部测试（QA 设备、测试人员、CI 冒烟测试）使用重新打包，向生产用户交付 JS 变更则使用 EAS Update。

## 使用场景

- **QA 周期**：向测试人员分发一份基础构建，然后在每次迭代中用 JS 修复重新打包，而不必等待原生重新构建。
- **CI 优化**：每个指纹只做一次原生构建，然后在后续每个 PR 上重新打包 JS 包，把等待时间从分钟级降到秒级。
- **分支测试**：针对同一份原生二进制文件测试多个 JS 分支，以隔离仅 JavaScript 的变更。

## 用法

### 独立 CLI

你需要在项目根目录运行下面为 Android 和 iOS 平台指定的命令。至少需要 `--platform` 和 `--source-app`。该工具在底层运行 `npx expo export:embed` 来产出新的 JS 包，把它换入源二进制文件，并写出输出产物。

输出格式始终与 `--source-app` 输入一致。APK 输入产出 APK，IPA 产出 IPA，**.app** 包产出 **.app** 包。

:::tabs
:::tab Android
```sh
$ npx @expo/repack-app --platform android --source-app MyApp.apk
```
:::
:::tab iOS

使用 IPA：

```sh
$ npx @expo/repack-app --platform ios --source-app MyApp.ipa
```

使用 **.app** 包（用于模拟器构建；iOS 设备产物始终是 IPA）：

```sh
$ npx @expo/repack-app --platform ios --source-app MyApp.app
```

:::
:::

### EAS Workflows

EAS Workflows 提供预置的 `repack` 作业类型，会自动处理签名和构建管理。完整语法、参数和示例参见 [EAS Workflows 预置作业](/eas/workflows/pre-packaged-jobs#repack)。

## 签名

要产出可在真机上安装的产物，请在 `--platform` 和 `--source-app` 之外传入签名凭据。没有它们时，Android APK 会以未签名形式输出，iOS IPA 也无法安装到设备上。面向模拟器的 iOS **.app** 包不需要签名，可以跳过这一步。

如果你本地还没有签名凭据，参见[应用凭据](/app-signing/app-credentials)了解如何获取 keystore（Android）或签名身份和描述文件（iOS）。

:::tabs
:::tab Android
```sh
$ npx @expo/repack-app --platform android --source-app MyApp.apk --ks keystore.jks --ks-key-alias my-alias
```

keystore 密码标志和其他设置参见 [Android 专用选项](#android-专用选项)。
:::
:::tab iOS

传入签名身份和描述文件：

:::note
iOS 重新打包仅支持 ad hoc 和开发签名。
:::

```sh
$ npx @expo/repack-app --platform ios --source-app MyApp.ipa --signing-identity "Apple Distribution: ..." --provisioning-profile /path/to/profile.mobileprovision
```

完整的签名标志列表参见 [iOS 专用选项](#ios-专用选项)。

:::
:::

## `--js-bundle-only` 模式

默认情况下，重新打包会更新 JS 包、资源和应用元数据（应用名称、版本、bundle identifier 以及 expo-updates 清单）。当你有意只更新 JS 包、保持所有原生配置不变时，传入 `--js-bundle-only`。

```sh
$ npx @expo/repack-app --platform android --source-app MyApp.apk --js-bundle-only
```

## 限制

不建议把重新打包用于生产环境的 Google Play Store 或 Apple App Store 提交。生产构建应走完整的构建流水线，以便正确符号化并签名。

## CLI 参考

```text
Usage: @expo/repack-app [options] [project-root]
```

### 参数

| 参数 | 说明 |
| --- | --- |
| `[project-root]` | 项目根目录路径。默认为当前工作目录。 |

### 选项

| 选项 | 说明 |
| --- | --- |
| `-p, --platform <platform>` | **必需。** 要为其重新打包应用的平台（`android` 或 `ios`）。 |
| `--source-app <path>` | **必需。** 源应用的路径（Android 为 APK，iOS 为 IPA 或 **.app**）。输出格式与输入一致。 |
| `-o, --output <path>` | 输出产物的路径。默认是项目根目录中的 `repacked.apk`、`repacked.ipa` 或 `repacked.app`，与源格式一致。 |
| `-w, --working-directory <path>` | 临时文件的工作目录路径。 |
| `--skip-working-dir-cleanup` | 重新打包完成后跳过清理工作目录。对调试有用。 |
| `-v, --verbose` | 启用详细日志。 |
| `--js-bundle-only` | 只更新 JS 包，跳过原生配置更新（例如应用名称、版本和其他元数据）。 |
| `--embed-bundle-assets` | 强制运行 `npx expo export:embed` 来生成 JS 包和资源，即使是通常从开发服务器加载包的调试构建也如此。 |
| `--bundle-assets-sourcemap-output <path>` | 在指定路径生成 source map。需要 `--embed-bundle-assets`。 |

### Android 专用选项

| 选项 | 说明 |
| --- | --- |
| `--ks <path>` | keystore 文件的路径。 |
| `--ks-pass <password>` | keystore 密码。默认为 `pass:android`。支持的格式：`pass:<password>`、`env:<name>`、`file:<file>`。 |
| `--ks-key-alias <alias>` | keystore 密钥别名。 |
| `--ks-key-pass <password>` | keystore 密钥密码。支持的格式：`pass:<password>`、`env:<name>`、`file:<file>`。 |
| `--android-build-tools-dir <path>` | Android SDK build-tools 目录的路径。 |

### iOS 专用选项

| 选项 | 说明 |
| --- | --- |
| `--signing-identity <identity>` | 代码签名身份。 |
| `--provisioning-profile <path>` | 描述文件的路径。也可以是面向多 target 应用的 JSON 编码值（例如打包应用扩展时）。 |
