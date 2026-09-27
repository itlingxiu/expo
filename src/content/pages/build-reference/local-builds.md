---
title: 使用 local 标志在本地运行 EAS Build
description: 了解如何使用 --local 标志，在你的机器或自定义基础设施上本地使用 EAS Build。
---

# 使用 local 标志在本地运行 EAS Build

使用 `eas build --local` 标志，可以在你的机器上直接运行通常在 EAS Build 服务器上运行的同一套构建过程。这有助于调试云端构建中出现、而你不跑同一组步骤就无法复现的构建失败。

```sh
$ eas build --platform android --local
# 或者
$ eas build --platform ios --local
```

**前置条件**

- **使用 Expo 进行身份验证**：运行 `eas login`，或者设置 `EXPO_TOKEN`，采用[基于令牌的身份验证](/accounts/programmatic-access)。

## 本地构建的使用场景

- [调试](#使用本地构建进行调试) EAS 服务器上的构建失败。
- 公司政策限制使用第三方 CI/CD 服务。使用本地构建时，整个过程在你的基础设施上运行，与 EAS 服务器的通信仅限于：
  - 确认项目 `@account/slug` 存在
  - 如果你使用托管凭据，则下载这些凭据

## 使用本地构建进行调试

如果在 EAS 服务器上遇到构建失败，并且无法通过查看日志确定原因，在本地调试可能会有帮助。为简化该过程，我们支持若干环境变量来配置本地构建过程。

- `EAS_LOCAL_BUILD_SKIP_CLEANUP=1`：设置此项可在构建过程结束后禁用工作目录清理。
- `EAS_LOCAL_BUILD_WORKINGDIR`：指定构建过程的工作目录，默认位于 **/tmp** 目录中的某处（具体位置因平台而异）。
- `EAS_LOCAL_BUILD_ARTIFACTS_DIR`：成功构建后产物被复制到的目录。默认情况下，这些文件会复制到当前目录；如果你连续运行多次构建，这可能并不理想。

如果在 iOS 构建中使用 `EAS_LOCAL_BUILD_SKIP_CLEANUP` 和 `EAS_LOCAL_BUILD_WORKINGDIR`，你应该可以查看工作目录下 `logs` 子目录的内容，以阅读 Xcode 日志。

## 限制

云端构建可用的某些选项在本地不可用。需要注意的限制：

- 你只能为特定平台构建（`all` 选项被禁用）。
- 不支持自定义软件版本，**eas.json** 中的 `node`、`yarn`、`fastlane`、`cocoapods`、`ndk`、`image` 字段会被忽略。
- 不支持缓存。
- 不支持可见性为 [“Secret”](/eas/environment-variables#visibility-settings-for-environment-variables) 的 EAS 环境变量（请改为在本地环境中设置它们）。
- 你需要自行确保环境中安装了所有必要工具：
  - Node.js/Yarn/npm
  - fastlane（仅 iOS）
  - CocoaPods（仅 iOS）
  - Android SDK 和 NDK
- 在 Windows 上，可以使用 [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) 进行本地 EAS Build。不过，我们并未针对该平台做官方测试，也不支持在 Windows 上进行本地构建（支持 macOS 和 Linux）。

## 在本地为开发和生产构建编译应用

要用 Expo CLI 在本地为开发编译应用，请改用 `npx expo run:android` 或 `npx expo run:ios` 命令。如果使用[持续原生生成](/workflow/continuous-native-generation)，也可以运行[预构建](/more/glossary-of-terms#prebuild)来生成 **android** 和 **ios** 目录，然后在相应 IDE 中打开项目，像任意原生项目一样构建。更多细节参见：

- [本地应用开发](/guides/local-app-development)：了解如何在本地编译并构建 Expo 应用。

要在本地创建生产构建，电脑上需要安装 Android Studio 和 Xcode。更多信息参见下面的指南：

- [在本地创建生产构建](/guides/local-app-production)：了解如何在电脑上为 Expo 应用创建本地生产构建。

无论采用上述哪种方式，你遵循的流程都与使用 EAS Build 在云端创建构建不同。云端那套流程对应的就是 `eas build --local` 标志。
