---
title: 使用 EAS Update
description: 了解如何把 EAS Update 与 EAS Build 一起使用。
---

# 使用 EAS Update

EAS Build 为 [`expo-updates`](/versions/latest/sdk/updates) 库提供了一些特别的便利。具体来说，你可以在 **eas.json** 中配置 [`channel`](/eas-update/how-it-works#distributing-builds) 属性，EAS Build 会在构建时负责更新原生项目中的该值。

本文说明把 `expo-updates` 库与 EAS Build 一起使用时需要特别注意的问题。关于用 EAS Update 配置该库的更一般信息，参见[开始使用 EAS Update](/eas-update/getting-started)。

## 为构建 profile 设置 channel

每个[构建 profile](/build/eas-json#构建-profile)都可以指定一个 channel，因此某个 profile 产出的构建只会拉取发布到该 channel 的更新。

下面的示例展示如何为生产构建使用 `"production"` channel，为通过[内部分发](/build/internal-distribution)分发的测试构建使用 `"staging"` channel。

```json eas.json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "staging",
      "distribution": "internal"
    }
  }
}
```

## 二进制兼容性与运行时版本

每次构建时，原生运行时都可能发生变化，这取决于你是否以改变与 JavaScript 的 API 约定的方式修改了代码。如果你把 JavaScript 包发布到原生运行时不兼容的二进制上（例如 JavaScript 包期望存在的某个函数并不存在），应用可能无法按预期工作，或者会崩溃。

建议应用的每个二进制版本使用不同的[运行时版本](/eas-update/runtime-versions)。每当原生运行时发生变化时（在使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目中，添加或移除原生库，或修改 **app.json** 时就会发生），你应该递增运行时版本。

## 在开发构建中预览更新

带有 `runtimeVersion` 字段发布的更新无法在 Expo Go 中加载。你应当使用 [`expo-dev-client`](/versions/latest/sdk/dev-client) 创建开发构建。

## 环境变量与 `eas update`

构建 profile 的 `env` 字段中设置的环境变量，在你运行 `eas update` 时不可用。进一步了解如何[在 EAS Update 中使用环境变量](/eas/environment-variables/usage#using-environment-variables-with-eas-update)。
