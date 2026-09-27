---
title: BuildProperties 包参考
description: 用于在预构建期间自定义原生构建属性的配置插件。
---

# BuildProperties 包参考

`expo-build-properties` 是一个[配置插件](/config-plugins/introduction)，用于在[预构建](/workflow/continuous-native-generation)期间配置 **android/gradle.properties** 和 **ios/Podfile.properties.json** 目录中的原生构建属性。

> 支持平台：Android、iOS、tvOS。

:::note
此配置插件配置的是[预构建命令](/workflow/continuous-native-generation#usage)如何生成原生 **android** 和 **ios** 目录，因此不能用于不运行 `npx expo prebuild` 的项目（已有的 React Native 项目）。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-build-properties
```
:::
:::tab yarn
```sh
yarn expo install expo-build-properties
```
:::
:::tab pnpm
```sh
pnpm expo install expo-build-properties
```
:::
:::tab bun
```sh
bun expo install expo-build-properties
```
:::
:::

## 用法

:::tabs
:::tab app.json
```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": {{compileSdkVersion}},
            "targetSdkVersion": {{targetSdkVersion}},
            "buildToolsVersion": "{{buildToolsVersion}}"
          },
          "ios": {
            "deploymentTarget": "{{iosDeploymentTarget}}"
          }
        }
      ]
    ]
  }
}
```
:::
:::tab app.config.js
```js app.config.js
export default {
  expo: {
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: {{compileSdkVersion}},
            targetSdkVersion: {{targetSdkVersion}},
            buildToolsVersion: '{{buildToolsVersion}}',
          },
          ios: {
            deploymentTarget: '{{iosDeploymentTarget}}',
          },
        },
      ],
    ],
  },
};
```
:::
:::

### 全部可配置属性

[`PluginConfigType`](#pluginconfigtype) 接口表示当前可用的配置属性。

## API
