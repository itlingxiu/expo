---
title: 自定义构建入门
description: 了解如何用自定义构建扩展 EAS Build。
---

# 自定义构建入门

自定义构建允许在构建过程之前、期间或之后运行命令，从而定制项目的构建流程。自定义构建可以从 EAS CLI 运行，也可以在 React Native CI/CD 流水线中运行构建时使用，例如 [EAS Workflows](/eas/workflows/get-started)。

## 创建自定义构建配置

   开始时，在与 **eas.json** 同级的位置创建目录和名为 **.eas/build/hello-world.yml** 的文件。这两个目录的位置和名称都很重要，EAS Build 据此识别项目包含自定义构建配置。

   在 **hello-world.yml** 中编写自定义构建配置。文件名并不重要，可以随意命名。唯一要求是文件扩展名为 **.yml**。

   在文件中添加下面的自定义构建配置步骤：

   ```yaml .eas/build/hello-world.yml
   build:
     name: Hello World!
     steps:
       - run: echo "Hello, world!"
       # 内置函数（可选）
   ```

   在真实场景中，你会调用[内置函数](/custom-builds/schema#内置-eas-函数)来触发构建。

## 在 eas.json 中添加 `config` 属性

   要使用自定义构建配置，在 **eas.json** 的某个构建 profile 下添加 `config` 属性。

   我们在 `build` 下创建一个名为 `test` 的新[构建 profile](/build/eas-json#构建-profile)，用来运行 **test.yml** 文件中的自定义配置：

   ```json eas.json
   {
     "build": {
       // ...其他配置
       "test": {
         "config": "test.yml"
       }
     }
   }
   ```

   如果希望每个平台使用不同的配置，可以为 Android 和 iOS 分别创建 YAML 配置文件。例如：

   ```json eas.json
   {
     "build": {
       // ...其他配置
       "test": {
         "ios": {
           "config": "hello-ios.yml"
         },
         "android": {
           "config": "hello-android.yml"
         }
       }
     }
   }
   ```

## 运行构建以测试自定义构建配置

   要测试自定义构建配置，运行下面的命令：

   ```sh
   eas build -p android -e test
   ```

   构建完成后，可以在构建详情页的日志中确认 `echo "Hello World!"` 脚本已执行。

## 进一步了解

查看示例仓库以获取更详细的示例：

- **[自定义构建示例仓库](https://github.com/expo/eas-custom-builds-example/tree/main)**：一个自定义 EAS Build 示例，包含设置函数、使用环境变量、上传产物等自定义构建示例。
