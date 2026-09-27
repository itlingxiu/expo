---
title: 在同一台设备上安装应用变体
description: 了解如何在同一台设备上安装应用的多个变体。
---

# 在同一台设备上安装应用变体

创建[开发、预览和生产构建](/build/eas-json#常见用例)时，在同一台设备上同时安装这些构建变体很常见。这样你可以在设备上进行开发、预览应用的下一个版本，并运行生产版本，而不必卸载再重新安装应用。

本指南提供配置多个（开发和生产）变体，以便在同一台设备上安装并使用它们所需的步骤。

**前置条件**

- **每个变体有唯一的应用 ID 或 Bundle Identifier**：要在设备上安装应用的多个变体，每个变体必须有唯一的 [应用 ID（Android）](/versions/latest/config/app#package)或 [Bundle Identifier（iOS）](/versions/latest/config/app#bundleidentifier)。

## 配置开发和生产变体

你已经用 Expo 工具创建了项目，现在想创建开发构建和生产构建。项目的 **app.json** 可能有以下配置：

```json app.json
{
  "expo": {
    "name": "MyApp",
    "slug": "my-app",
    "ios": {
      "bundleIdentifier": "com.myapp"
    },
    "android": {
      "package": "com.myapp"
    }
  }
}
```

如果项目已配置 EAS Build，**eas.json** 也有如下类似配置：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "production": {}
  }
}
```

### 把 app.json 转换为 app.config.js

要在同一台设备上安装应用的多个变体，把 **app.json** 重命名为 **app.config.js**，并按下面的方式导出配置：

```js app.config.js
export default {
  name: 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: 'com.myapp',
  },
  android: {
    package: 'com.myapp',
  },
};
```

在 **app.config.js** 中添加名为 `IS_DEV` 的环境变量，根据该变量为每个变体切换 `android.package` 和 `ios.bundleIdentifier`：

```js app.config.js
const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  // 你也可以切换应用图标和其他属性，以便在设备上进一步区分应用。
  name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
  android: {
    package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
};
```

在上面的示例中，环境变量 `IS_DEV` 用于区分开发环境和生产环境。根据它的值，为每个变体设置不同的应用 ID 或 Bundle Identifier。

<details>
<summary>应用变体的其他自定义</summary>

你可以按变体自定义应用的其他方面。可以用与上面相同的方法，替换你以前在 **app.json** 中使用的任何配置。

**示例：**

- 如果你使用的库要求向外部服务注册应用标识符才能使用其 SDK，例如 Google Maps 或 Firebase Cloud Messaging（FCM），你需要为 `android.package` 和 `ios.bundleIdentifier` 准备该 API 的单独配置。
- 如果你使用[开发构建](/develop/development-builds/introduction)，可以把 `expo-dev-client` 插件配置为在非开发构建中禁用 Expo CLI 和 EAS Update 二维码使用的应用 scheme。这确保那些 URL 始终启动开发构建，而不受设备默认设置的影响：

```js app.config.js
plugins: [
  [
    'expo-dev-client',
    {
      addGeneratedScheme: !!IS_DEV,
    },
  ],
],
```

</details>

### EAS Build 的配置

在 **eas.json** 中，用 `env` 属性把环境变量 `APP_VARIANT` 设置为使用 **development** profile 运行构建：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "production": {}
  }
}
```

现在，当你运行 `eas build --profile development` 时，在本地和 EAS Build 构建器上求值 **app.config.js** 时，环境变量 `APP_VARIANT` 都会被设为 `development`。

### 使用开发服务器

启动开发服务器时，你需要运行 `APP_VARIANT=development npx expo start`（如果你使用 Windows，则使用该平台的等价写法）。

一个快捷方式是在 **package.json** 中添加以下脚本：

```json package.json
{
  "scripts": {
    "dev": "APP_VARIANT=development npx expo start"
  }
}
```

### 使用生产变体

运行 `eas build --profile production` 时，环境变量 `APP_VARIANT` 未设置，构建会作为生产变体运行。

:::note
如果你使用 EAS Update 发布应用的 JavaScript 更新，运行 `eas update` 命令时，应谨慎为你正在发布的应用变体设置正确的环境变量。更多信息参见 EAS Build 的[环境变量与密钥](/build/updates)。
:::

### 在本地构建并运行多个应用变体

如果你用 [`expo run:android|ios`](/workflow/continuous-native-generation#usage) [在本地构建应用](/guides/local-app-overview)，运行 `expo run` 命令时设置环境变量 `APP_VARIANT`。例如，要把 `development` 变体作为调试构建为 iOS 编译，运行：

:::tabs
:::tab npm
```sh
$ APP_VARIANT=development npx expo run:ios
```
:::
:::tab yarn
```sh
$ APP_VARIANT=development yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ APP_VARIANT=development pnpm expo run:ios
```
:::
:::tab bun
```sh
$ APP_VARIANT=development bun expo run:ios
```
:::
:::

`APP_VARIANT` 只改变应用的名称，以及 Android 上的包名和 iOS 上的 bundle identifier。它不影响二进制文件如何编译。切换变体时，已有的 **android** 和 **ios** 目录仍然反映先前的变体。如果原生目录已经存在，`expo run` 会跳过重新生成，并按原样编译它。

要切换变体，你需要在编译应用之前用 `prebuild --clean` 重新生成原生目录。在下面的示例中，`development` 变体（已有的调试构建）被切换到 `test`，这也是另一个调试构建。要重新生成 **android** 和 **ios** 目录然后编译 `test` 变体，在两条命令上都设置 `APP_VARIANT`，以便干净的预构建和编译使用同一个变体：

:::tabs
:::tab npm
```sh
$ APP_VARIANT=test npx expo prebuild --clean

$ APP_VARIANT=test npx expo run:ios
```
:::
:::tab yarn
```sh
$ APP_VARIANT=test yarn expo prebuild --clean

$ APP_VARIANT=test yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ APP_VARIANT=test pnpm expo prebuild --clean

$ APP_VARIANT=test pnpm expo run:ios
```
:::
:::tab bun
```sh
$ APP_VARIANT=test bun expo prebuild --clean

$ APP_VARIANT=test bun expo run:ios
```
:::
:::

**android** 和 **ios** 目录由[持续原生生成](/workflow/continuous-native-generation)管理，因此当它们列在 **.gitignore** 中时，重新生成它们是安全的。

### 在现有 React Native 项目中

:::note
如果你想把[应用配置文件](/workflow/configuration)作为应用配置（包括变体的 bundle identifier 和包名）的事实来源，你需要迁移到[持续原生生成（CNG）](/workflow/continuous-native-generation)，并把 **android** 和 **ios** 目录加入 **.gitignore**。如果你从 React Native CLI 项目起步并添加了自定义原生代码，这一点尤其重要。这确保原生项目配置不会优先于应用配置，特别是在使用 bundle ID 查找行为时。否则，你可能会遇到运行了错误的应用变体，或开发构建未被正确检测的问题。你也可以显式选择下面描述的 Android flavor 和 iOS scheme。
:::

#### Android

在 **android/app/build.gradle** 中，为 **eas.json** 里你想构建的每个构建 profile 创建单独的 flavor。

```groovy android/app/build.gradle
android {
    // ...
    flavorDimensions "env"
    productFlavors {
        production {
            dimension "env"
            applicationId 'com.myapp'
        }
        development {
            dimension "env"
            applicationId 'com.myapp.dev'
        }
    }
    // ...
}
```

:::note
目前，EAS CLI 只支持 `applicationId` 字段。如果你在 `productFlavors` 或 `buildTypes` 部分内使用 `applicationIdSuffix`，该值将无法被正确检测。
:::

通过在 **eas.json** 中指定 `gradleCommand`，把 Android flavor 分配给 EAS Build profile：

```json eas.json
{
  "build": {
    "development": {
      "android": {
        "gradleCommand": ":app:assembleDevelopmentDebug"
      }
    },
    "production": {
      "android": {
        "gradleCommand": ":app:bundleProductionRelease"
      }
    }
  }
}
```

默认情况下，每个 flavor 都可以以 debug 或 release 模式构建。如果你想把某个 flavor 限制为特定模式，参见下面的片段，并修改 **build.gradle**。

```groovy android/app/build.gradle
android {
    // ...
    variantFilter { variant ->
        def validVariants = [
                ["production", "release"],
                ["development", "debug"],
        ]
        def buildTypeName = variant.buildType*.name
        def flavorName = variant.flavors*.name

        def isValid = validVariants.any { flavorName.contains(it[0]) && buildTypeName.contains(it[1]) }
        if (!isValid) {
            setIgnore(true)
        }
    }
    // ...
}
```

此时其余配置与任何带 flavor 的 Android 项目相同。你可能想应用到项目的一些常见配置：

- 要更改用 development profile 构建的应用名称，创建 **android/app/src/development/res/values/strings.xml** 文件：

  ```xml android/app/src/development/res/values/strings.xml
  <resources>
      <string name="app_name">MyApp - Dev</string>
  </resources>
  ```

- 要更改用 development profile 构建的应用图标，创建带有合适资源的 **android/app/src/development/res/mipmap-\*** 目录（你可以从 **android/app/src/main/res** 复制它们并替换图标文件）。
- 要为特定 flavor 指定 **google-services.json**，把它放在 **android/app/src/{flavor}/google-services.json** 文件中。
- 要配置 Sentry，把 `project.ext.sentryCli = [ flavorAware: true ]` 加入 **android/app/build.gradle**，并把属性文件命名为 **android/sentry-{flavor}-{buildType}.properties**（例如 **android/sentry-production-release.properties**）。

#### iOS

在 **eas.json** 中为每个构建 profile 分配不同的 `scheme`：

```json eas.json
{
  "build": {
    "development": {
      "ios": {
        "buildConfiguration": "Debug",
        "scheme": "myapp-dev"
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "myapp"
      }
    }
  }
}
```

**Podfile** 应该有一个这样定义的 target：

```ruby Podfile
target 'myapp' do
  # ...
end
```

把它替换为一个抽象 target，通用配置可以从旧 target 复制过来：

```ruby Podfile
abstract_target 'common' do
  # 把通用 target 配置放在这里

  target 'myapp' do
  end

  target 'myapp-dev' do
  end
end
```

在 Xcode 中打开项目，在导航面板中点击项目名称，右键点击现有 target，然后点击 “Duplicate”：

![复制 Xcode target](/static/images/eas-build/variants/1-ios-duplicate-target.webp)

把 target 重命名为更有意义的名称，例如把 `myapp copy` 改为 `myapp-dev`。

为新 target 配置 scheme：

- 进入 `Product` -> `Scheme` -> `Manage schemes`。
- 在列表中找到 scheme `myapp copy`。
- 把 scheme 名称从 `myapp copy` 改为 `myapp-dev`。
- 默认情况下，新 scheme 应被标记为共享，但 Xcode 不会创建 `.xcscheme` 文件。要修复这一点，取消勾选 “Shared” 复选框再重新勾选，之后新的 `.xcscheme` 文件应出现在 **ios/myapp.xcodeproj/xcshareddata/xcschemes** 目录中。

![Xcode scheme 列表](/static/images/eas-build/variants/2-scheme-list.webp)

默认情况下，新创建的 target 有单独的 **Info.plist** 文件（在上面的示例中是 **ios/myapp copy-Info.plist**）。为简化项目，建议所有 target 使用同一个文件：

- 删除 **./ios/myapp copy-Info.plist**。
- 点击新 target。
- 进入 `Build Settings` 标签页。
- 找到 `Packaging` 部分。
- 更改 **Info.plist** 的值，从 **myapp copy-Info.plist** 改为 **myapp/Info.plist**。
- 更改 `Product Bundle Identifier`。

![Xcode 构建设置](/static/images/eas-build/variants/3-target-build-settings.webp)

要更改显示名称：

- 打开 **Info.plist**，添加键 `Bundle display name`，值为 `$(DISPLAY_NAME)`。
- 打开两个 target 的 `Build Settings`，找到 `User-Defined` 部分。
- 添加键 `DISPLAY_NAME`，值为你想用于该 target 的名称。

要更改应用图标：

- 创建一个新的图像集（你可以从当前图标的现有图像集创建，它通常名为 `AppIcon`）。
- 打开你想更改图标的 target 的 `Build Settings`。
- 找到 `Asset Catalog Compiler - Options` 部分。
- 把 `Primary App Icon Set Name` 改为新图像集的名称。
