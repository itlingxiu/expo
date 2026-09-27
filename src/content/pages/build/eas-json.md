---
title: 用 eas.json 配置 EAS Build
description: 了解使用 EAS 服务的项目如何用 eas.json 进行配置。
---

# 用 eas.json 配置 EAS Build

**eas.json** 是 EAS CLI 与各项服务的配置文件。它在项目中第一次运行 [`eas build:configure` 命令](/build/setup#配置项目)时生成，位于项目根目录、与 **package.json** 相邻。EAS Build 的配置全部位于 `build` 键下。

新项目中生成的 **eas.json** 默认配置如下：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 构建 profile

构建 profile 是一组命名的配置，描述执行某种类型构建所需的参数。

`build` 键下的 JSON 对象可以包含多个构建 profile，并且你可以使用自定义的构建 profile 名称。在默认配置中有三个构建 profile：`development`、`preview` 和 `production`。不过，它们也可以命名为 `foo`、`bar` 和 `baz`。

要用特定 profile 运行构建，使用下面的命令并带上 `<profile-name>`：

```sh
# 把 <profile-name> 替换为 eas.json 中的某个构建 profile
$ eas build --profile <profile-name>
```

如果省略 `--profile` 标志，EAS CLI 会默认使用名为 `production` 的 profile（如果它存在）。

### 特定平台的选项与通用选项

在每个构建 profile 内部，你可以指定 [`android`](/eas/json#android-specific-options) 和 [`ios`](/eas/json#ios-specific-options) 字段，其中包含该构建的平台专用配置。[两个平台都可用的选项](/eas/json#common-properties-for-native-platforms)可以放在平台专用配置对象上，或放在 profile 的根上。

### 在 profile 之间共享配置

构建 profile 可以用 `extends` 选项扩展其他构建 profile 的属性。

例如，在 `preview` profile 中可以有 `"extends": "production"`。这样 `preview` profile 会继承 `production` profile 的配置。

只要避免循环依赖，就可以把 profile 扩展链起来，最深 5 层。

## 常见用例

使用 Expo 工具的开发者通常最终会有三种不同类型的构建：**development**、**preview** 和 **production**。

### 开发构建

默认情况下，`eas build:configure` 会创建一个带有 `"developmentClient": true` 的 `development` profile。这表示该构建依赖 [`expo-dev-client`](/develop/development-builds/introduction)。这些构建包含开发者工具，并且永远不会提交到应用商店。

`development` profile 还默认使用 [`"distribution": "internal"`](/build/internal-distribution)。这让你很容易把应用直接分发到 Android 和 iOS 真机。

你也可以把开发构建配置为在 [iOS 模拟器](/build-reference/simulators)上运行。为此，对 `development` profile 使用以下配置：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

:::note
对于 iOS，要分别创建一份用于内部分发的构建和另一份用于 iOS 模拟器的构建，可以为该构建创建单独的开发 profile。你可以给 profile 起自定义名称。例如 `development-simulator`，并在该 profile 上使用 [iOS 模拟器专用配置](/build-reference/simulators#配置用于模拟器的-profile)，而不是放在 `development` 上。在[设备上和 Android 模拟器上运行 Android **.apk**](/build-reference/apk)不需要这样的配置，因为同一个 **.apk** 可以在两种环境中运行。
:::

### 预览构建

这些构建不包含开发者工具。它们供你的团队和其他相关方安装，以便在类似生产的环境中测试应用。就这一点而言，它们类似于[生产构建](#生产构建)。不过，它们与生产构建不同，因为它们要么没有为应用商店分发签名（iOS 上的 ad hoc 或企业描述文件），要么以对商店部署并非最优的方式打包（预览建议使用 Android **.apk**，Google Play Store 建议使用 **.aab**）。

一个最小的 `preview` profile 示例：

```json eas.json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

与[开发构建](#开发构建)类似，你可以把预览构建配置为在 [iOS 模拟器](/build-reference/simulators)上运行，或为此创建一个预览 profile 的变体。在[设备上和 Android 模拟器上运行 Android **.apk**](/build-reference/apk)不需要这样的配置，因为同一个 **.apk** 可以在两种环境中运行。

### 生产构建

这些构建会提交到应用商店，用于向公众发布，或作为商店协助的测试流程（例如 TestFlight）的一部分。

生产构建必须通过各自的应用商店安装。它们不能直接安装到 Android 模拟器或设备，也不能直接安装到 iOS 模拟器或设备。唯一的例外是你在构建 profile 上为 Android 显式设置 `"buildType": "apk"`。不过，提交到商店时建议使用 **.aab**，因为这是默认配置。

一个最小的 `production` profile 示例：

```json eas.json
{
  "build": {
    "production": {}
  }
}
```

### 在同一台设备上安装同一应用的多个构建

在同一台设备上同时安装开发构建和生产构建很常见。参见[在同一台设备上安装应用变体](/build-reference/variants)。

## 配置构建工具

每次构建都隐式或显式地依赖执行构建过程所需的一组特定版本的相关工具。这些工具包括但不限于：Node.js、npm、Yarn、Ruby、Bundler、CocoaPods、Fastlane、Xcode 和 Android NDK。

### 选择构建工具版本

最常见构建工具的版本可以在构建 profile 上用与工具名称对应的字段设置。例如 [`node`](/eas/json#node)：

```json eas.json
{
  "build": {
    "production": {
      "node": "18.18.0"
    }
  }
}
```

在 profile 之间共享构建工具配置很常见。为此使用 `extends`：

```json eas.json
{
  "build": {
    "production": {
      "node": "18.18.0"
    },
    "preview": {
      "extends": "production",
      "distribution": "internal"
    },
    "development": {
      "extends": "production",
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

### 选择资源等级

资源等级是 EAS Build 为你的作业提供的虚拟机资源配置（CPU 核心数、内存大小）。默认情况下，资源等级设为 `medium`，这对小型和较大的项目通常都足够。不过，如果你的项目需要更强的 CPU 或更大的内存，或者你希望构建更快完成，可以切换到 `large` 工作器。

关于每个等级提供的资源的更多细节，参见 [`android.resourceClass`](/eas/json#resourceclass-1) 和 [`ios.resourceClass`](/eas/json#resourceclass-2) 属性。要在特定资源等级的工作器上运行构建，在构建 profile 中配置此属性：

```json eas.json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "medium"
      },
      "ios": {
        "resourceClass": "large"
      }
    }
  }
}
```

:::note
在 `large` 工作器上运行作业需要[付费 EAS 方案](https://expo.dev/accounts/[account]/settings/billing)。
:::

### 选择基础镜像

构建作业的基础镜像控制多种依赖的默认版本，例如 Node.js、Yarn 和 CocoaPods。你可以用上一节所述的具名专用字段覆盖它们，并使用 `resourceClass`。不过，镜像包含无法用其他方式显式设置的特定工具版本，例如操作系统版本和 Xcode 版本。

如果你用 Expo 构建应用，EAS Build 会为你正在构建的 SDK 版本选择合适的镜像，并带上一组合理的依赖。否则，建议查看[构建服务器基础设施](/build-reference/infrastructure)上的可用镜像列表。

### 示例

#### 结构

```json eas.json
{
  "cli": {
    "version": "SEMVER_RANGE", // 所需的 EAS CLI 版本范围
    "requireCommit": false, // 为 true 时，确保构建前所有更改都已提交。默认为 false
    "appVersionSource": "local", // 设为 remote 时，EAS 服务器上存储的值优先于本地值。默认为 local
    "promptToConfigurePushNotifications": true // 设为 false 时，跳过 EAS Build 的推送通知凭据设置。默认为 true
  },
  "build": {
    "BUILD_PROFILE_NAME_1": {
      // 任意名称，用作标识符
      // 两个平台通用的选项
      // ...COMMON_OPTIONS,
      "android": {
        // 两个平台通用的选项
        // ...COMMON_OPTIONS,
        // Android 专用以及两个平台通用的选项
        // ...ANDROID_OPTIONS
      },
      "ios": {
        // 两个平台通用的选项
        // ...COMMON_OPTIONS,
        // iOS 专用以及两个平台通用的选项
        // ...IOS_OPTIONS
      }
    },
    "BUILD_PROFILE_NAME_2": {}
  }
}
```

> 你可以在平台专用配置对象中或在 profile 根上指定[通用属性](/eas/json#common-properties-for-native-platforms)。平台专用选项优先于全局定义的选项。

<details>
<summary>带有多个 profile 的持续原生生成（CNG）项目</summary>

```json eas.json
{
  "build": {
    "base": {
      "node": "12.13.0",
      "yarn": "1.22.5",
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "default",
        "env": {
          "PLATFORM": "android"
        }
      },
      "ios": {
        "image": "latest",
        "env": {
          "PLATFORM": "ios"
        }
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "env": {
        "ENVIRONMENT": "development"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

</details>

<details>
<summary>带有多个 profile 的现有 React Native 项目</summary>

```json eas.json
{
  "build": {
    "base": {
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "ubuntu-18.04-android-30-ndk-r19c",
        "ndk": "21.4.7075529"
      },
      "ios": {
        "image": "latest",
        "node": "12.13.0",
        "yarn": "1.22.5"
      }
    },
    "development": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true,
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

</details>

## 环境变量

你可以用 `"env"` 字段在构建 profile 上配置环境变量。运行 `eas build` 时，这些环境变量会用于在本地求值 **app.config.js**，并且也会设置到 EAS Build 构建器上。

```json eas.json
{
  "build": {
    "production": {
      "node": "16.13.0",
      "env": {
        "API_URL": "https://company.com/api"
      }
    },
    "preview": {
      "extends": "production",
      "distribution": "internal",
      "env": {
        "API_URL": "https://staging.company.com/api"
      }
    }
  }
}
```

[环境变量与密钥](/eas/environment-variables)参考更详细地解释了这一主题，[使用 EAS Update](/build/updates)指南说明了把此功能与 `expo-updates` 一起使用时需要考虑的事项。

## 更多

- [EAS Build schema 参考](/eas/json#eas-build)：查看 EAS Build 可用属性的完整参考。
