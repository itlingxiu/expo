---
title: 开发构建简介
description: 了解如何创建开发构建，以及为什么应该优先使用它而不是 Expo Go。
---

# 开发构建简介

使用 [create-expo-app](/get-started/create-a-project) 创建的新项目，可以直接编辑 TypeScript/JavaScript 并在 Expo Go 中看到变化。开发构建（development build）就像是你自己的 Expo Go —— 可以使用任何原生库，也可以修改原生配置；它是把应用发布到应用商店的推荐方式。开发构建捆绑了 [expo-dev-client](/versions/latest/sdk/dev-client)，它在 React Native 开发工具的基础上增加了网络请求检查，以及用于切换开发服务器（你自己的或同事的）和 [EAS Update](/eas-update/introduction) 等部署的启动器界面（launcher UI）。

相关视频：[Expo Go 与开发构建：该用哪个？](https://www.youtube.com/watch?v=FdjczjkwQKE)（Beto 讲解了各自的用途，以及何时应该选择开发构建）

## 使用 AI Agent 创建开发构建

以下三种方式任选其一，把合适的提示词复制给你的 AI Agent：

:::tabs
:::tab 本地构建
```text
为这个 Expo 项目创建并安装一个开发构建：

1. 运行 npx expo install expo-dev-client 安装 expo-dev-client。
2. 运行 npx expo run:android（iOS 用 npx expo run:ios）编译并安装开发构建。
   默认安装到模拟器；要装到已连接的物理设备，加上 --device 参数。
3. 如项目已有原生目录，需要时先运行 npx expo prebuild --clean 重新生成。
4. 之后运行 npx expo start 启动开发服务器。
```
:::
:::tab 使用 EAS
```text
为这个 Expo 项目使用 EAS 创建并安装一个开发构建：

1. 运行 npx expo install expo-dev-client 安装 expo-dev-client。
2. 确认已安装 EAS CLI 并已登录（eas login）。
3. 如果项目中没有 eas.json，创建一个，并在其中添加 development 构建配置；
   要构建到 iOS 模拟器，请在该配置中设置 ios.simulator: true。
4. 完成以上步骤后先暂停，并告诉我："一切就绪。现在要开始构建吗？"
   我确认后，运行：eas build --platform <平台> --profile development
```
:::
:::tab 使用 EAS CLI 本地构建
```text
为这个 Expo 项目使用 EAS CLI 在本地创建并安装一个开发构建：

1. 运行 npx expo install expo-dev-client 安装 expo-dev-client。
2. 确认已安装 EAS CLI 并已登录（eas login）。
3. 创建 eas.json 并添加 development 构建配置（模拟器构建需设置 ios.simulator: true）。
4. 运行 eas build --platform <平台> --profile development --local 在本地构建。
5. 把生成的 .apk（Android）或 .app（iOS）安装到设备/模拟器，然后运行 npx expo start。
```
:::
:::

## 选择构建开发构建的方式

三种方式产出的构建相同，区别在于编译发生的位置以及本地环境要求。

- **本地构建** —— 通过 [Expo CLI](/more/expo-cli) 使用 Android Studio 与 Xcode 编译；无需 Expo 账户。
- **使用 EAS 构建** —— 在 EAS 服务器上编译；无需原生工具链；任何操作系统都可以构建 iOS。
- **使用 EAS CLI 本地构建** —— 即带 `--local` 参数的 EAS Build；签名与构建配置仍由 EAS 处理。

## 本地构建

使用 Expo CLI 和本地原生工具链自行编译。无需 Expo 账户；这也是在没有付费 Apple Developer 账户的情况下，在 iPhone 上安装开发构建的唯一途径。

| 平台 | Android | iOS 模拟器 | iPhone 真机 |
| --- | --- | --- | --- |
| macOS | ✓ | ✓ | ✓ |
| Windows | ✓ | ✗ | ✗ |
| Linux | ✓ | ✗ | ✗ |

> 环境配置：构建 Android 需要 [Android Studio 与模拟器](/workflow/android-studio-emulator)；构建 iOS 需要 [Xcode 与 iOS 模拟器](/workflow/ios-simulator)。

### 安装 expo-dev-client

```sh
npx expo install expo-dev-client
yarn expo install expo-dev-client
pnpm expo install expo-dev-client
bun expo install expo-dev-client
```

:::note
已有的 React Native 应用：不使用[持续原生生成（CNG）](/workflow/continuous-native-generation)或使用 `npx react-native` 创建的项目需要额外配置 —— 参见[在现有 React Native 项目中安装 expo-dev-client](/bare/install-dev-builds-in-bare)的步骤 1–2。
:::

:::note
你也可以不使用 `expo-dev-client`：用 `npx expo start --dev-client` 启动服务器，让开发服务器指向构建而非 Expo Go。
:::

### 编译并运行应用

Android：

```sh
npx expo run:android
yarn expo run:android
pnpm expo run:android
bun expo run:android
```

默认安装到正在运行的 Android 模拟器；要装到真机，请通过 USB 连接设备、允许 **USB 调试**，并加上 `--device` 参数。

iOS：

```sh
npx expo run:ios
yarn expo run:ios
pnpm expo run:ios
bun expo run:ios
```

默认安装到 iOS 模拟器；要装到 iPhone，请连接设备、开启[开发者模式](/guides/ios-developer-mode)、确保应用配置中 `ios.bundleIdentifier` 唯一，并加上 `--device` 参数。该命令会运行 [prebuild](/workflow/continuous-native-generation)（若 **android**/**ios** 目录不存在则先创建），然后编译、安装并启动开发服务器。

### 原生代码变更后重新构建

`npx expo run:android|ios` 会复用原生目录；仅改动了 JS/TS 时只需要：

```sh
npx expo start
yarn expo start
pnpm expo start
bun expo start
```

只有在安装/更新[含原生代码的库](/workflow/using-libraries)、修改[应用配置](/workflow/configuration)（**app.json**）或升级 Expo SDK 时，才需要重新生成原生目录：

```sh
npx expo prebuild --clean
yarn expo prebuild --clean
pnpm expo prebuild --clean
bun expo prebuild --clean
```

然后重新构建：

**构建 Android**

```sh
npx expo run:android
yarn expo run:android
pnpm expo run:android
bun expo run:android
```

**构建 iOS**

```sh
npx expo run:ios
yarn expo run:ios
pnpm expo run:ios
bun expo run:ios
```

:::note
所有 Expo 构建工具（`npx expo run:android|ios`、`eas build`）都会在原生目录不存在时自动运行 prebuild，无需手动先执行一次。参见[持续原生生成（CNG）](/workflow/continuous-native-generation)。
:::

## 使用 EAS 创建开发构建

[EAS Build](/eas/build/introduction) 在 EAS 服务器上编译，产出可安装到真机、Android 模拟器或 iOS 模拟器的构建；它还支持在非 macOS 机器上构建 iOS。

| 平台 | Android | iOS 模拟器 | iPhone 真机 |
| --- | --- | --- | --- |
| macOS | ✓ | ✓ | ✓* |
| Windows | ✓ | ✓ | ✓* |
| Linux | ✓ | ✓ | ✓* |

> \* 所有运行在 iPhone 真机上的构建都需要付费的 Apple Developer 账户进行构建签名（[developer.apple.com](https://developer.apple.com)）。

前置条件：注册 [Expo](https://expo.dev/signup) 账户；安装并登录 [EAS CLI](/build/setup)：

```sh
npm install --global eas-cli && eas login
yarn global add eas-cli && eas login
pnpm add --global eas-cli && eas login
bun add --global eas-cli && eas login
```

### 安装 expo-dev-client

```sh
npx expo install expo-dev-client
yarn expo install expo-dev-client
pnpm expo install expo-dev-client
bun expo install expo-dev-client
```

### 构建原生应用

如果不存在 **eas.json**，CLI 会提示创建一个包含默认 `development` 配置的文件。

Android（模拟器可选）：

```sh
eas build --platform android --profile development
```

iOS 模拟器（仅 macOS；需要 [iOS 模拟器](/workflow/ios-simulator)）：在 `development` 配置中把 [`simulator`](/eas/json) 选项设为 `true` —— 如果同时需要真机构建，请使用单独的配置。

```json eas.json
{
  "build": {
    "development": {
      /* @info */
      "ios": {
        "simulator": true
      }
      /* @end */
    }
  }
}
```

```sh
eas build --platform ios --profile development
```

模拟器构建只能安装到模拟器。

iOS 真机（需要付费的 [Apple Developer](https://developer.apple.com/) 账户用于[签名凭据](/app-signing/managed-credentials)）：

```sh
eas build --platform ios --profile development
```

真机构建只能安装到 iPhone；安装后需在设备上开启 [iOS 开发者模式](/guides/ios-developer-mode)。

### 安装应用

CLI 会提示安装：Android 模拟器/iOS 模拟器按 `Y`，真机扫描二维码。也可以从 [expo.dev](https://expo.dev/) 仪表盘或 [Expo Orbit](https://expo.dev/orbit) 安装构建。

### 启动 JavaScript bundler

```sh
npx expo start
yarn expo start
pnpm expo start
bun expo start
```

安装 `expo-dev-client` 后，它会指向你的开发构建而不是 Expo Go。

## 使用 EAS CLI 在本地创建开发构建

任何 EAS Build 都可以加上 `--local` 在你的机器上运行：EAS 提供凭据、签名与构建配置，编译则使用你的本地原生工具链。需要本地原生构建工具 —— 参见[本地运行 EAS Build](/build-reference/local-builds)。

| 平台 | Android | iOS 模拟器 | iPhone 真机 |
| --- | --- | --- | --- |
| macOS | ✓ | ✓ | ✓* |
| Windows | ✓** | ✓ | ✗ |
| Linux | ✓** | ✓ | ✗ |

> \* 所有运行在 iPhone 真机上的构建都需要付费的 Apple Developer 账户进行构建签名。
> \** 没有一等支持，但可通过 WSL 实现（[expo.fyi/wsl](https://expo.fyi/wsl)）。

前置条件：注册 Expo 账户；安装并登录 EAS CLI（命令同上）；配置本地环境 —— Android 需要 [Android Studio](/workflow/android-studio-emulator)，iOS 需要 [Xcode](/workflow/ios-simulator)。

### 安装 expo-dev-client

```sh
npx expo install expo-dev-client
yarn expo install expo-dev-client
pnpm expo install expo-dev-client
bun expo install expo-dev-client
```

### 在本地机器上构建原生应用

CLI 会在没有 **eas.json** 时提示创建带 `development` 配置的文件。

Android：

```sh
eas build --platform android --profile development --local
```

iOS：

```sh
eas build --platform ios --profile development --local
```

构建模拟器版本前，先在 `development` 配置中把 [`simulator`](/eas/json) 选项设为 `true`。

### 安装应用

输出是一个压缩包（Android 为 **.apk**，iOS 为 **.app**/**.ipa**）。拖到模拟器上，或用 [Expo Orbit](https://expo.dev/orbit) 安装。

### 启动 JavaScript bundler

```sh
npx expo start
yarn expo start
pnpm expo start
bun expo start
```

它会指向开发构建，而不是 Expo Go。

## 安装开发构建之后

从设备主屏幕打开构建，并在启动器中连接服务器。关于启动器、重新构建与调试的详情，参见[使用开发构建](/develop/development-builds/use-development-builds)；关于与 Expo Go 的对比与限制，参见[常见问题](/develop/development-builds/faq)。

## 面向 AI Agent 的 Expo Skills

安装 [Expo Skills](/skills)，让 AI Agent 学会这些工作流：

- [expo-dev-client](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-dev-client/SKILL.md) —— 本地或通过 TestFlight 构建并分发开发客户端，用于内部测试。
- [eas-simulator](https://github.com/expo/skills/blob/main/plugins/expo/skills/eas-simulator/SKILL.md) —— 在 EAS 托管的远程 iOS/Android 模拟器上运行并控制应用。
