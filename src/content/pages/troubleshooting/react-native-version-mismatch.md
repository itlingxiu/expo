---
title: “React Native version mismatch”错误
description: 了解 React Native 版本不匹配的含义，以及如何在 Expo 或 React Native 应用中解决它。
---

# “React Native version mismatch”错误

开发 Expo 或 React Native 应用时，经常会遇到类似下面的错误：

```text
React Native version mismatch.

JavaScript version: X.XX.X
Native version: X.XX.X

Make sure you have rebuilt the native code...
```

## 这个错误是什么意思

终端中正在运行的打包器（使用 `npx expo start`）所使用的 `react-native` JavaScript 版本，与设备或模拟器上的原生应用不一致。升级 React Native 或 Expo SDK 版本之后，或者连接到了错误的本地开发服务器时，都可能出现这种情况。

## 如何修复

- 关闭所有正在运行的开发服务器（可以用 `ps` 命令列出全部终端进程，并用 `ps -A | grep "expo\|react-native"` 搜索 Expo CLI 或 React Native community CLI 进程）。

- 如果这是 Expo 项目，要么从 **app.json** 中移除 `sdkVersion` 字段，要么确保它与 **package.json** 中 `expo` 依赖的值一致。

- 如果这是 Expo 项目，应确认 `react-native` 版本正确。运行 `npx expo-doctor` 查看应安装的 `react-native` 版本。如果已经升级到更新的 SDK，请运行 `npx expo install --fix` 并按照提示操作。Expo CLI 会确保 `expo`、`react-native` 等包的依赖版本对齐。

- 如果这是[现有 React Native 项目](/bare/overview)，并且错误恰好出现在升级 React Native 版本之后，应仔细检查是否正确完成了每一步升级操作。

- 最后：
  - 运行 `rm -rf node_modules && npm cache clean --force && npm install && watchman watch-del-all && rm -rf $TMPDIR/haste-map-* && rm -rf $TMPDIR/metro-cache && npx expo start --clear` 清除打包器缓存
    - 使用 npm 时的命令见[此处](/troubleshooting/clear-cache-macos-linux)。
    - Windows 上的命令见[此处](/troubleshooting/clear-cache-windows)。
  - 如果这是现有 React Native 项目，运行 `npx pod-install`，然后重新构建原生项目（运行 `yarn android` 重新构建 Android，运行 `yarn ios` 重新构建 iOS）
