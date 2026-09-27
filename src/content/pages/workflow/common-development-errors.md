---
title: 常见开发错误
description: Expo 开发者常遇到的开发错误列表。
---

# 常见开发错误

本页列出使用 Expo 的开发者经常遇到的错误。对每个错误，第一条说明错误为何发生，第二条包含调试建议。如果你认为某个错误应该出现在这里，欢迎并鼓励你[创建 PR](https://github.com/expo/expo/pulls)！

### Metro bundler ECONNREFUSED 127.0.0.1:19001

- 某个错误阻止了与本地开发服务器的连接。
- 运行 `rm -rf .expo` 清除本地状态。检查防火墙或影响你当前所连网络的[代理](/troubleshooting/proxies)。

### Module AppRegistry is not a registered callable module (calling runApplication)

- 代码中的某个错误阻止了 JavaScript bundle 在启动时执行。
- 尝试运行 `npx expo start --no-dev --minify`，在本地复现生产 JS bundle。如果可能，连接设备并通过 Android Studio 或 Xcode 查看设备日志。设备日志包含详细得多的堆栈跟踪和信息。检查 Babel 配置中是否有变更或错误。在少数情况下，此问题可能由 Metro JavaScript 压缩器与应用中某些代码不兼容引起。

### npm ERR! No git binary found in $PATH

- 要么没有安装 git，要么它没有正确配置到 `$PATH` 中。
- 如果尚未安装，请[安装 git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)。否则，根据操作系统检查如何把它加入 `$PATH`。

### XX.X.X is not a valid SDK version

- 你正在运行的 SDK 版本已被弃用，不再受支持。
- [升级项目](/workflow/upgrading-expo-sdk-walkthrough)到受支持的 SDK 版本。如果你使用的是受支持的版本却看到此消息，需要更新 Expo Go 应用。

### React Native version mismatch

- 终端中运行的开发服务器打包的 React Native 版本，与设备或模拟器中的应用不同。
- 通过检查 **app.json** 和 **package.json** 中的版本来[对齐 react-native 版本](/troubleshooting/react-native-version-mismatch)。

### Application has not been registered

- 应用原生部分与 JS 部分注册的 AppKey 不一致。
- [对齐 AppKey](/troubleshooting/application-has-not-been-registered)，使其与项目的原生侧一致。

### 应用行为不符合预期

- 缓存可能让你看不到应用的当前状态。
- 在 [Unix 类系统](/troubleshooting/clear-cache-macos-linux)或 [Windows](/troubleshooting/clear-cache-windows)上清除与项目相关的全部缓存。
