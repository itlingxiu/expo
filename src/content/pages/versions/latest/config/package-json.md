---
title: package.json 配置参考
description: package.json 中 Expo 专属字段（expo 键）的参考说明。
---

# package.json 配置参考

本参考涵盖在 **package.json** 文件中添加 `expo` 字段可使用的 Expo 专属属性。package.json 是保存 JavaScript 项目元数据的 JSON 文件。

## install.exclude

以下命令组会运行版本检查，当已安装库的版本与 Expo 推荐版本不同时会发出警告：

- `npx expo start` 和 `npx expo-doctor`
- `npx expo install` —— 当安装该库的更新版本时，或使用 `--check` / `--fix` 时

在 `install.exclude` 数组中列出某个库，可将其排除在这些检查之外。

```json package.json
{
  "expo": {
    "install": {
      "exclude": ["expo-updates", "expo-splash-screen"]
    }
  }
}
```

## autolinking

允许配置模块解析行为。

```json package.json
{
  "expo": {
    "autolinking": {
      "nativeModulesDir": "./modules"
    }
  }
}
```

完整参考见[自动链接配置](/modules/autolinking#configuration)。

## doctor

允许配置 [`npx expo-doctor`](/develop/tools#expo-doctor) 命令的行为。

### reactNativeDirectoryCheck

Expo Doctor 会将项目中的包与 React Native directory 对比，并警告其中未收录的包。

```json package.json
{
  "expo": {
    "doctor": {
      "reactNativeDirectoryCheck": {
        "enabled": true,
        "exclude": ["/foo/", "bar"],
        "listUnknownPackages": true
      }
    }
  }
}
```

默认情况下该检查开启，且未知包会被列出。

### appConfigFieldsNotSyncedCheck

如果存在原生 **android** 或 **ios** 目录，但未包含在 **.gitignore** 或 **.easignore** 中，Doctor 会查找应用配置文件，其存在表明项目使用 Prebuild 配置。当这些原生目录存在时，EAS Build 不会将应用配置属性同步到原生项目中，Doctor 会在满足这些条件时发出警告。

```json package.json
{
  "expo": {
    "doctor": {
      "appConfigFieldsNotSyncedCheck": {
        "enabled": false
      }
    }
  }
}
```
