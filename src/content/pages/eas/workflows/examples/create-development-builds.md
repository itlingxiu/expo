---
title: 使用 EAS Workflows 创建开发构建
description: 了解如何使用 EAS Workflows 创建开发构建。
---

# 使用 EAS Workflows 创建开发构建

[开发构建](/develop/development-builds/introduction)是包含 Expo 开发者工具的专用项目构建。这类构建包含项目内的全部原生依赖，使你能够在模拟器或真机上运行接近生产的项目构建。此工作流让你可以为每个平台，以及真机、Android 模拟器和 iOS 模拟器创建开发构建，你的团队可以用 `eas build:dev` 访问它们。

![展示开发构建工作流的图。](/static/images/eas-workflows/create-development-builds.png)

> 视频：[Expo 黄金工作流：自动化创建开发构建](https://www.youtube.com/watch?v=u8MAJ0F18s0)。了解如何使用 EAS Workflows 为 Android、iOS 设备和模拟器自动化开发构建。

## 开始使用

- **设置你的环境**

  要开始，你需要配置项目和设备，以便构建并运行开发构建。用以下指南了解如何为开发构建设置环境：

  - [Android 设备设置](/get-started/set-up-your-environment?mode=development-build&platform=android&device=physical)：让项目为开发构建做好准备。
  - [Android 模拟器设置](/get-started/set-up-your-environment?mode=development-build&platform=android&device=simulated)：让项目为开发构建做好准备。
  - [iOS 设备设置](/get-started/set-up-your-environment?mode=development-build&platform=ios&device=physical)：让项目为开发构建做好准备。
  - [iOS 模拟器设置](/get-started/set-up-your-environment?mode=development-build&platform=ios&device=simulated)：让项目为开发构建做好准备。

- **创建构建 profile**

  配置项目和设备之后，把以下构建 profile 添加到 **eas.json** 文件。

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "development-simulator": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

下面的工作流会为每个平台，以及真机、Android 模拟器和 iOS 模拟器创建构建。它们都会并行运行。

```yaml .eas/workflows/create-development-builds.yml
name: Create development builds

jobs:
  android_development_build:
    name: Build Android
    type: build
    params:
      platform: android
      profile: development
  ios_device_development_build:
    name: Build iOS device
    type: build
    params:
      platform: ios
      profile: development
  ios_simulator_development_build:
    name: Build iOS simulator
    type: build
    params:
      platform: ios
      profile: development-simulator
```

用以下命令运行上面的工作流：

```sh
eas workflow:run .eas/workflows/create-development-builds.yml
```
