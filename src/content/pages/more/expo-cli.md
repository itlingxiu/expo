---
title: Expo CLI
description: Expo CLI 是开发者与其他 Expo 工具之间的主要命令行界面。
---

# Expo CLI

`expo` 包提供小巧而强大的 CLI 工具 `npx expo`，旨在让你在应用开发期间保持快速推进。

## 亮点

- [为开发应用启动服务器](#开发)：`npx expo start`。
- [为项目生成原生 Android 和 iOS 目录](#预构建)：`npx expo prebuild`。
- [在本地构建并运行](#编译)原生应用：`npx expo run:ios` 和 `npx expo run:android`。
- [安装和更新](#安装依赖)与项目中 `react-native` 版本兼容的包：`npx expo install package-name`。
- `npx expo` 可以与 `npx react-native` 同时使用。

要查看 Expo CLI 中可用命令的列表，在项目中运行：

```sh
npx expo -h
```

> 如果更喜欢用 yarn 作为包管理器，也可以运行 `yarn expo -h`。

输出应类似如下：

```sh
Usage
  $ npx expo <command>

Commands
  start, export
  run:ios, run:android, prebuild
  install, customize, config
  login, logout, whoami, register

Options
  --version, -v   Version number
  --help, -h      Usage info
```

可以在任何命令上使用 `--help` 或 `-h` 标志来了解更多信息：

```sh
npx expo login -h
```

## 安装

Expo CLI 包含在 `expo` 包中。可以用 npm 或 yarn 安装它：

```sh
yarn add expo
```

> 未使用 [Expo 预构建](#预构建)的项目需要进行额外设置，以确保所有自定义 Expo 打包功能正常工作：[现有 React Native 应用的 Metro 设置](/versions/latest/config/metro#现有-react-native-应用)。

## 开发

运行以下命令启动开发服务器以处理项目：

```sh
npx expo start
```

> 也可以把 `npx expo` 作为 `npx expo start` 的别名运行。

此命令在 `http://localhost:8081` 上启动服务器，客户端可以用它与打包器交互。默认打包器是 [Metro](https://metrobundler.dev/)。

进程中显示的 UI 称为 **终端 UI**。它包含二维码（开发服务器 URL）以及可以按下的键盘快捷键列表：

| 键盘快捷键 | 说明 |
| --- | --- |
| <kbd>A</kbd> | 在已连接的 Android 设备上打开项目。 |
| <kbd>Shift</kbd> + <kbd>A</kbd> | 选择要打开的 Android 设备或模拟器。 |
| <kbd>I</kbd> | 在 iOS 模拟器中打开项目。 |
| <kbd>Shift</kbd> + <kbd>I</kbd> | 选择要打开的 iOS 模拟器。 |
| <kbd>W</kbd> | 在 Web 浏览器中打开项目。这可能需要在项目中安装 webpack。 |
| <kbd>R</kbd> | 在任何已连接的设备上重新加载应用。 |
| <kbd>S</kbd> | 在 Expo Go 和开发构建之间切换启动目标。 |
| <kbd>M</kbd> | 在任何已连接的原生设备上打开开发菜单（不支持 Web）。 |
| <kbd>Shift</kbd> + <kbd>M</kbd> | 选择要在已连接设备上触发的更多命令。这包括切换性能监视器、打开元素检查器、重新加载设备以及打开开发菜单。 |
| <kbd>J</kbd> | 为任何使用 Hermes 作为 JavaScript 引擎的已连接设备打开 React Native DevTools。见[使用 Hermes 调试 JavaScript](/guides/using-hermes#javascript-调试器)。 |
| <kbd>O</kbd> | 在编辑器中打开项目代码。可以用 `EXPO_EDITOR` 和 `EDITOR` [环境变量](#环境变量)配置。 |
| <kbd>E</kbd> | 在终端中以二维码形式显示开发服务器 URL。 |
| <kbd>?</kbd> | 显示所有终端 UI 命令。 |

### 启动目标

如果项目中安装了 `expo-dev-client`，`npx expo start` 命令会自动在开发构建中启动应用。否则，它会在 Expo Go 中启动应用。

也可以通过向命令传递以下标志来强制启动目标：

- `--dev-client`：始终在开发构建中启动应用。
- `--go`：始终在 Expo Go 中启动应用。

也可以在运行时按 **终端 UI** 中的 <kbd>S</kbd> 切换启动目标。`run` 命令在编译开发构建后默认也使用 `--dev-client`。

### 服务器 URL

默认情况下，项目通过 LAN 连接提供。可以使用标志 `npx expo start --localhost` 把此行为改为仅 localhost。

其他可用选项：

- `--port`：启动开发服务器的端口（不适用于 webpack 或[隧道 URL](#隧道)）。使用 `--port 0` 自动使用第一个可用端口。默认：**8081**。
- `--https`：**（已弃用，请改用 `--tunnel`）** 使用安全源启动开发服务器。目前仅在 Web 上受支持。

可以使用 `EXPO_PACKAGER_PROXY_URL` 环境变量把 URL 强制为任何值。例如：

```sh
export EXPO_PACKAGER_PROXY_URL=http://expo.dev
npx expo start
```

将把应用打开到：`exp://expo.dev:80`（`:80` 是 Android WebSocket 的临时变通办法）。

#### 隧道

受限的网络条件（公共 Wi-Fi 中常见）、防火墙（Windows 用户中常见）或模拟器配置错误，都可能使远程设备难以通过 LAN/localhost 连接到开发服务器。

有时通过任何具有互联网访问的设备都能访问的代理 URL 连接到开发服务器会更容易，这称为**隧道**。`npx expo start` 通过 [ngrok](https://ngrok.com) 提供对**隧道**的内置支持。

要启用隧道，先安装 `@expo/ngrok`：

```sh
npm i -g @expo/ngrok
```

然后运行以下命令从_隧道_ URL 启动开发服务器：

```sh
npx expo start --tunnel
```

这会从类似 `https://xxxxxxx.bacon.19000.exp.direct:80` 的公开 URL 提供应用。

使用 `EXPO_TUNNEL_SUBDOMAIN` 环境变量以实验方式设置隧道 URL 的子域名。这对在 iOS 上测试通用链接很有用。这可能导致 `expo-linking` 和 Expo Go 出现意外问题。通过传入不是以下值之一的 `string` 来选择确切子域名：`true`、`false`、`1`、`0`。

**缺点**

- 隧道比本地连接慢，因为请求必须转发到公开 URL。
- 隧道 URL 是公开的，任何具有网络连接的设备都可以访问。Expo CLI 通过在 URL 开头添加熵来降低暴露风险。可以通过清除项目中的 **.expo** 目录来重置熵。
- 隧道要求两台设备都有网络连接，这意味着此功能不能与 `--offline` 标志一起使用。

隧道需要第三方托管服务，这意味着它有时可能会遇到间歇性问题，例如 `ngrok tunnel took too long to connect` 或 `Tunnel connection has been closed. This is often related to intermittent connection problems with the Ngrok servers...`。在报告问题之前，请务必检查 [Ngrok 中断](https://status.ngrok.com/)。一些 Windows 用户也报告需要修改防病毒设置才能让 Ngrok 正常工作。

#### 离线

可以使用 `--offline` 标志在没有网络连接的情况下开发：

```sh
npx expo start --offline
```

离线模式会阻止 CLI 发出网络请求。如果不使用该标志且计算机没有互联网连接，则会自动启用离线支持，只是验证可达性会多花一点时间。

Expo CLI 会发出网络请求，用你的用户凭据对清单进行签名，以确保敏感信息在 Expo Go 等可复用运行时中被隔离。

### .expo 目录

首次在项目中启动开发服务器时，会在该项目根目录创建 **.expo** 目录。它包含两个文件：

- **devices.json**：包含最近打开过此项目的设备信息。
- **settings.json**：包含用于提供项目清单的服务器配置信息。

这两个文件都包含特定于你本地计算机的信息。这就是创建新项目时默认把 **.expo** 目录包含在 **.gitignore** 文件中的原因。它不应与其他开发者共享。

### Open 端点

开发服务器公开 `/_expo/open`，以便云智能体、远程预览服务、CI 脚本等外部工具可以内省 CLI 将使用的深层链接，并可选地触发与在 **终端 UI** 中按 <kbd>I</kbd> / <kbd>A</kbd> / <kbd>W</kbd> 相同的操作。它补充了旧的 `/_expo/link` 端点，后者返回到非移动客户端无法跟随的深层链接 scheme 的 `307` 重定向。

| 方法 | 效果 |
| --- | --- |
| `GET` | 试运行：以 JSON 返回深层链接。可以安全地跨隧道调用。 |
| `POST` | 在本地打开项目——相当于在 **终端 UI** 中按 <kbd>I</kbd> / <kbd>A</kbd> / <kbd>W</kbd>。仅限同源请求。 |

#### 查询参数

- `platform`（或 `expo-platform` 请求头）：`ios`、`android` 或 `web`。在 `GET` 上省略它，以获得列出每个平台的发现响应。
- `runtime`：选择 URL 的解析方式。
  - `default`（省略）：镜像按 <kbd>I</kbd> / <kbd>A</kbd> 时的行为。当服务器以 `--dev-client` 启动时选择开发客户端；当项目同时有 Expo Go 和开发构建时回退到消歧页面；否则打开 Expo Go。
  - `expo`：强制使用 Expo Go 深层链接（`exp://…`）。
  - `custom`：强制使用开发构建深层链接（`<scheme>://expo-development-client/?url=…`）。
  - `unknown`：强制使用消歧 `/_expo/loading` 页面，让设备在 Expo Go 和开发构建之间决定。

该端点会反映运行中途的状态变化——按 <kbd>S</kbd> 在 Expo Go 和开发客户端之间切换，或在服务器运行时安装 `expo-dev-client`，都会在下一次请求中显示。

#### GET 响应

针对特定平台：

```json
{
  "runtime": "expo",
  "url": "exp://192.168.1.71:8081",
  "scheme": "myapp",
  "availableRuntimes": ["expo", "custom"],
  "appId": "com.example.app"
}
```

- `runtime`：解析后的运行时（`expo`、`custom` 或 `web`）。当 `url` 是消歧页面时省略；设备决定最终运行时。
- `url`：深层链接（对于 `runtime: 'unknown'` 以及同时存在两种运行时的 `default` 情况，则为消歧页面 URL）。当 `--tunnel` 处于活动状态时，会经过 ngrok 主机。
- `scheme`：用于开发构建深层链接的项目 URL scheme；未配置时为 `null`。
- `availableRuntimes`：`['expo']`、`['custom']` 或 `['expo', 'custom']`。当 `.length > 1` 时，调用方应显式选择运行时，或让设备消歧。
- `appId`：从项目配置（或原生文件）解析出的 iOS bundle identifier 或 Android 包名。对于 Web，或项目尚未设置 `ios.bundleIdentifier` / `android.package` 时为 `null`。在打开深层链接之前，可用于验证构建是否已安装在远程设备上。

没有 `platform` 时，响应按平台作为键，用于发现：

```json
{
  "scheme": "myapp",
  "availableRuntimes": ["expo", "custom"],
  "platforms": {
    "ios": {
      "url": "http://192.168.1.71:8081/_expo/loading?platform=ios",
      "appId": "com.example.app"
    },
    "android": {
      "url": "http://192.168.1.71:8081/_expo/loading?platform=android",
      "appId": "com.example.app"
    },
    "web": { "runtime": "web", "url": "http://192.168.1.71:8081", "appId": null }
  }
}
```

#### POST 行为

`POST /_expo/open?platform=ios` 在请求的平台上于本地打开项目（`ios` → iOS 模拟器，`android` → Android 模拟器，`web` → 桌面浏览器）。响应：

- `200`：`{ "platform", "runtime", "url" }`，描述打开了什么。
- `403`：跨源 POST。正文的 `error` 解释主机不匹配，并指向 `GET /_expo/open` 作为安全替代方案。
- `501`：主机无法启动请求的平台（例如在 Linux/Windows 上 `platform=ios`）。响应带有 `details` 字段，解释原因并建议先 GET 再远程启动的工作流。
- `500`：`openPlatformAsync` 抛出异常。正文转发底层错误代码和消息。

#### 示例

```sh
# 获取 iOS 的深层链接（可通过隧道工作，无需安装 Expo Go）。
curl http://localhost:8081/_expo/open?platform=ios

# 强制使用消歧页面，以便设备或外部选择器进行选择。
curl 'http://localhost:8081/_expo/open?platform=android&runtime=unknown'

# 触发 iOS 模拟器启动（仅在开发服务器的主机上有效）。
curl -X POST http://localhost:8081/_expo/open?platform=ios
```

## 构建

React Native 应用由两部分组成：原生运行时（[编译](#编译)），以及 JavaScript bundle 和资源等静态文件（[导出](#导出)）。Expo CLI 提供执行这两项任务的命令。

### 编译

可以使用 `run` 命令在本地编译应用：

```sh
# 为 iOS 构建
npx expo run:ios
# 为 Android 构建
npx expo run:android
```

**亮点**

- 使用 `--device` 标志直接在已连接的设备上构建，没有全局副作用。支持已锁定的设备，让你可以立即重试，而无需重新构建。
- 从 CLI 自动为开发对 iOS 应用进行代码签名，无需打开 Xcode。
- 智能日志解析显示来自项目源代码的警告和错误，而不像 Xcode 那样显示来自 node modules 的数百个良性警告。
- 导致应用崩溃的致命错误会在终端中显示，无需在 Xcode 中复现。

`npx expo run:ios` 只能在 Mac 上运行，并且必须安装 Xcode。可以从任何计算机使用 `eas build -p ios` 在云中构建应用。同样，`npx expo run:android` 要求在计算机上安装并配置 Android Studio 和 Java。

本地构建对于开发原生模块和[调试复杂的原生问题](/debugging/runtime-issues#原生调试)很有用。由于预先配置的云环境，使用 `eas build` 远程构建是更稳健的选项。

如果项目没有对应的原生目录，`npx expo prebuild` 命令会在构建前运行一次以生成相应目录。

例如，如果项目根目录中没有 **ios** 目录，则 `npx expo run:ios` 会在编译应用之前先运行 `npx expo prebuild -p ios`。有关此过程的更多信息，见 [Expo 预构建](/workflow/continuous-native-generation)。

**跨平台参数**

- `--no-build-cache`：构建前清除原生缓存。在 iOS 上，这是 **derived data** 目录。清除缓存对于分析构建时间很有用。
- `--no-install`：跳过安装依赖。在 iOS 上，如果项目 `package.json` 中的 `dependencies` 字段已更改，这也会跳过运行 `npx pod-install`。
- `--no-bundler`：跳过启动开发服务器。如果开发服务器已从其他进程提供应用，则会自动启用。
- `-d, --device [device]`：要在其上构建应用的设备名称或 ID。可以不带参数传递 `--device`，从可用选项列表中选择设备。这支持已连接的设备以及虚拟设备。使用 `--device generic` 在不针对特定设备的情况下构建（仅构建工作流）。
- `-o, --output <path>`：构建完成后把构建好的应用二进制文件复制到的目录。对 CI/CD 流水线或希望二进制文件位于可预测位置时很有用。
- `-p, --port <port>`：启动开发服务器的端口。**默认：8081**。这仅与开发构建相关。生产构建会[导出](#导出)项目，并在安装到设备之前把文件嵌入原生二进制文件。
- `--binary <path>`：要安装到设备上的二进制文件路径。提供此参数时，将跳过构建过程并尝试直接安装该二进制文件。如果二进制文件不是为正确的设备构建的（例如为模拟器构建却安装到设备上），则命令会失败。

#### 编译 Android

Android 应用可以有多个不同的 **变体**，它们在项目的 `build.gradle` 文件中定义。可以使用 `--variant` 标志选择变体：

##### `debug` 变体

使用 `debug` 变体进行调试构建：

```sh
npx expo run:android --variant debug
```

##### `debugOptimized` 变体

:::warning
`debugOptimized` 在 SDK 54 及更高版本中可用。
:::

使用 `debugOptimized` 变体可以更快地开发，性能接近发布构建，同时整体构建仍保持对调试友好的模式：

```sh
npx expo run:android --variant debugOptimized
```

使用此变体时，请记住以下几点：

- 像发布构建一样优化 C++ 库，提高运行时性能
- 在 EAS Build 中，使用匹配的 Gradle 命令，例如在 [**eas.json** 中的 `:app:assembleDebugOptimized`](/build-reference/apk#配置用于构建-apk-的-profile)
- **局限**：禁用 C++ 调试，C++ 崩溃的堆栈跟踪可能更难读

##### `release` 变体

可以运行以下命令为生产环境编译 Android 应用：

```sh
npx expo run:android --variant release
```

此构建不会自动进行代码签名以提交到 Google Play Store。此命令应用于测试可能只在生产构建中出现的错误。要生成已为 Play Store 进行代码签名的生产构建，建议使用 [EAS Build](/build/introduction)。

##### 调试原生 Android 项目

可以通过在 Android Studio 中打开 **android** 目录，使用原生调试工具调试原生 Android 项目：

```sh
open -a "/Applications/Android Studio.app" android
```

如果自定义的 Android 项目使用不同的 product flavor，可以使用 `--variant` 和 `--app-id` 标志同时配置 flavor 和应用 ID：

```sh
npx expo run:android --variant freeDebug --app-id dev.expo.myapp.free
```

更多信息见[使用 Android product flavor 的本地构建](/guides/local-app-development#使用-android-product-flavor-的本地构建)指南。

#### 编译 iOS

iOS 应用可以有多个 **scheme**，用于表示不同的子应用，如 App Clips、watchOS 应用、Safari 扩展等。默认情况下，`npx expo run:ios` 会为 iOS 应用选择 scheme。可以使用 `--scheme <my-scheme>` 参数选择自定义 scheme。如果只传入 `--scheme` 参数，Expo CLI 会提示你从 Xcode 项目中的可用选项列表中选择 scheme。

你选择的 scheme 会过滤选择提示中显示哪些 `--device` 选项，例如选择 Apple TV scheme 将只显示可用的 Apple TV 设备。

可以运行以下命令为生产环境编译 iOS 应用：

```sh
npx expo run:ios --configuration Release
```

此构建不会自动进行代码签名以提交到 Apple App Store。`npx expo run:ios` 主要用于测试只在生产构建中出现的错误。原生代码签名需要多次网络请求，并且容易出现来自 Apple 服务器的多种不同类型的错误。要生成已为 App Store 进行代码签名的生产构建，建议使用 [EAS Build](/build/introduction)。

当你把应用编译到模拟器上时，模拟器的原生错误日志会通过管道传到终端中的 Expo CLI 进程。这对于快速查看可能导致致命错误的 bug 很有用。例如，缺少权限的消息。错误管道对物理 iOS 设备不可用。

可以通过在 Xcode 中打开项目并从 Xcode 重新构建，使用 `lldb` 和所有原生 Apple 调试工具进行调试：

```sh
xed ios
```

从 Xcode 构建很有用，因为你可以设置原生断点并分析应用的任何部分。请务必在源代码管理（git）中跟踪更改，以防需要使用 `npx expo prebuild -p ios --clean` 重新生成原生应用。

##### 仅构建工作流

可以使用 `generic` 设备选项构建 iOS 模拟器应用，而不针对特定设备：

```sh
npx expo run:ios --device generic
```

上述命令使用通用 Xcode 目标（`generic/platform=iOS Simulator`），而不是特定模拟器 UDID，这对以下情况很有用：

- **CI/CD 流水线**：无需在构建机器上配置模拟器即可构建模拟器应用。
- **分发模拟器构建**：创建可以共享并在任何兼容模拟器上运行的 **.app** bundle。
- **仅构建工作流**：当你只需要编译后的二进制文件，而不需要安装或启动时。

构建完成后，CLI 会输出构建好的 **.app** bundle 的路径：

```sh
✓ Build complete
Binary: ~/Library/Developer/Xcode/DerivedData/.../Release-iphonesimulator/MyApp.app
```

可以把这与 `--configuration Release` 结合以创建生产模拟器构建，并使用 `--output` 把二进制文件复制到特定目录：

```sh
npx expo run:ios --configuration Release --device generic --output ./build
```

上述命令会把构建好的 **.app** bundle 复制到 **./build/MyApp.app**。

**iOS 开发签名**

如果想查看应用在设备上的运行情况，只需连接设备，运行 `npx expo run:ios --device`，然后选择已连接的设备。

Expo CLI 会自动为开发对设备进行签名、安装应用并启动它。

如果计算机上没有设置任何开发者描述文件，则需要在 Expo CLI 之外按照此指南手动设置：[设置 Xcode 签名](https://expo.fyi/setup-xcode-signing)。

### 导出

可以运行以下命令使用 Metro 打包器导出应用的 JavaScript 和资源：

```sh
npx expo export
```

使用 `eas update` 或编译原生运行时时会自动完成此操作。`export` 命令的工作方式类似于大多数 Web 框架：

- 打包器为**生产**环境转译并打包应用代码，剥离所有由 `__DEV__` 布尔值保护的代码。
- 所有静态文件都复制到静态 **dist** 目录中，可以从静态主机提供。
- **public** 目录的内容按原样复制到 **dist** 目录中。

提供以下选项：

- `--platform <platform>`：选择要编译的平台：'ios'、'android'、'all'。**默认：all**。如果在应用配置中配置了，也可以使用 'web'。更多信息见[自定义 Metro](/guides/customizing-metro)。
- `--dev`：为**开发**环境打包，不压缩代码，也不剥离 `__DEV__` 布尔值。
- `--output-dir <dir>`：导出静态文件的目录。**默认：dist**
- `--max-workers <number>`：允许打包器生成的最大任务数。把它设置为 `0` 会在同一进程上运行所有转译，这意味着你可以轻松调试 Babel 转译。
- `-c, --clear`：导出前清除打包器缓存。
- `--no-minify`：跳过压缩 JavaScript 和 CSS 资源。
- `--no-bytecode`：跳过为原生平台生成 Hermes 字节码。仅将此用于分析 bundle 大小，切勿把 UTF-8 bundle 交付到原生平台，因为这会导致启动时间大幅变长。
- `--no-ssg`：跳过为 Web 路由导出静态 HTML 文件。此选项只在 **dist** 目录内生成服务器代码。对 [API 路由](/router/web/api-routes)有用。

#### 使用子路径托管

:::warning
[实验性](/more/release-statuses#experimental)功能。
:::

可以通过在[应用配置](/workflow/configuration)中设置 `experiments.baseUrl` 字段来配置静态资源的前缀：

```json app.json
{
  "expo": {
    "experiments": {
      "baseUrl": "/my-root"
    }
  }
}
```

这将导出所有资源都以 `/my-root` 为前缀的网站。例如，位于 `assets/image.png` 的图片预期托管在 **/my-root/assets/image.png**。实际文件将位于相同的文件系统位置，因为整个目录预期在服务器上托管于 `/my-root`。

Expo Router 对 `baseUrl` 有内置支持。使用 `Link` 和 `router` API 时，`baseUrl` 会自动添加到 URL 前面。

```jsx app/blog/index.tsx
import { Link } from 'expo-router';

export default function Blog() {
  return <Link href="/blog/123">Go to blog post</Link>;
}
```

这将**导出**为以下内容：

```html Output HTML
<a href="/my-root/blog/123">Go to blog post</a>
```

如果直接使用 `<a>`、React Navigation 或 `Linking` API，需要手动在前面加上 `baseUrl`。

`baseUrl` 功能仅用于生产环境，并且必须在导出网站之前设置。如果更改该值，必须重新导出网站。

如果 `require` 或 `import` 图片和其他资源，它们会自动工作。如果直接引用资源 URL，则需要手动附加 **baseUrl**。

```jsx app/index.tsx
import { Image } from 'expo-image';

export default function Blog() {
  return <Image source={require('@/assets/image.png')} />;
}
```

这将**导出**为以下内容：

```html Output HTML
<img src="/my-root/assets/assets/image.png" />
```

手动传递 URL 时需要手动加前缀：

```jsx app/index.tsx
export default function Blog() {
  return <img src="/my-root/assets/image.png" />;
}
```

### 使用 webpack 导出

:::danger
**[已弃用](/more/release-statuses#deprecated)**：在 SDK 50 及更高版本中，Expo Webpack 已弃用，请改用通用 Metro（`npx expo export`）。在[从 Webpack 迁移到 Expo Router](/router/migrate/from-expo-webpack)中了解更多。
:::

可以运行以下命令使用 webpack 导出 Web 应用的 JavaScript 和资源：

```sh
npx expo export:web
```

- `--dev`：以 'development' 模式打包，不压缩代码，也不剥离 `__DEV__` 布尔值。
- `-c, --clear`：导出前清除打包器缓存。

如果项目在 `app.json` 中通过 `expo.web.bundler: 'metro'` 字段配置为使用 `metro` 打包 Web 项目，此命令将被禁用。

## 预构建

```sh
npx expo prebuild
```

原生应用能够编译之前，必须生成原生源代码。Expo CLI 提供称为 _预构建_ 的独特而强大的系统，为项目生成原生代码。要了解更多，阅读 [Expo 预构建文档](/workflow/continuous-native-generation)。

## Lint

```sh
npx expo lint
```

Lint 有助于强制执行最佳实践并确保代码一致。`npx expo lint` 命令会使用 Expo 特定设置配置 ESLint，并使用为 Expo 框架优化的选项运行 `npx eslint` 命令。通过运行 `npx expo lint --fix`，可以自动修复 lint 问题。

默认情况下，运行 `npx expo lint` 针对 **src**、**app** 和 **components** 目录中的所有文件。也可以把自定义文件或目录作为参数传递给 lint 命令。例如：

```sh
npx expo lint ./utils constants.ts
```

默认情况下，所有匹配 `.js, .jsx, .ts, .tsx, .mjs, .cjs` 扩展名的文件都会被 lint。可以通过传递 `--ext` 标志自定义扩展名。例如，要只 lint `.ts` 和 `.tsx` 文件，可以使用 `--ext` 选项：`npx expo lint --ext .ts,.tsx` 或 `npx expo lint --ext .js --tsx .tsx`。

如果需要额外自定义，可以使用 `--` 运算符传递额外参数。例如，要把 `--no-error-on-unmatched-pattern` 标志传递给 ESLint，可以运行：

```sh
npx expo lint -- --no-error-on-unmatched-pattern
```

如果需要更多自定义，可以直接使用 `npx eslint`。

- **[使用 ESLint](/guides/using-eslint)**：进一步了解如何在 Expo 项目中使用 ESLint 确保最佳实践。

## 配置

运行以下命令评估应用配置（**app.json** 或 **app.config.js**）：

```sh
npx expo config
```

- `--full`：包含所有项目配置数据。
- `--json`：以 JSON 格式输出，用于把 **app.config.js** 转换为 **app.config.json**。
- `-t, --type`：要显示的[配置类型](#配置类型)。

### 配置类型

从应用配置生成三种不同的配置类型：

- `public`：用于 OTA 更新的清单文件。可以把它理解为原生应用的 `index.html` 文件的 `<head />` 元素。
- `prebuild`：用于 [Expo 预构建](/workflow/continuous-native-generation)（包括异步修改器）的配置。这是配置不可序列化的唯一情况。
- `introspect`：`prebuild` 配置的子集，只显示内存中的修改，如 `Info.plist` 或 **AndroidManifest.xml** 更改。进一步了解[内省](/config-plugins/development-and-debugging#内省)。

## 安装依赖

与 Web 不同，React Native 不向后兼容。这意味着 npm 包通常需要是与项目中当前安装的 `react-native` 副本完全匹配的版本。Expo CLI 提供尽力而为的工具，使用热门包列表和已知可工作的版本组合来完成此操作。只需把 `install` 命令用作 `npm install` 的直接替代：

```sh
npx expo install expo-camera
```

运行此命令的单个实例时，也可以安装多个包：

```sh
npx expo install typescript expo-sms
```

可以使用 `--` 运算符直接把参数传递给底层包管理器：

```sh
yarn expo install typescript -- -D
```

### 版本验证

可以使用 `--check` 和 `--fix` 标志执行验证和修正：

- `--check`：检查哪些已安装的包需要更新。
- `--fix`：自动更新任何无效的包版本。

示例：

```sh
# 检查所有包的错误版本，并提示在本地修复
npx expo install --check
```

`npx expo install --check` 会提示你哪些包安装不正确。它还会提示在本地把这些包安装到兼容版本。它在持续集成（CI）中以非零状态退出。这意味着你可以用它进行持续的不可变验证。相比之下，`npx expo install --fix` 在需要时总会修复包，无论环境如何。

可以通过传入特定包来验证它们：

```sh
# 只检查 react-native 和 expo-sms
npx expo install react-native expo-sms --check
```

命令 `npx expo install expo-camera` 和 `npx expo install expo-camera --fix` 用途相同，`--fix` 命令对于升级项目中的所有包很有用，例如：

```sh
npx expo install --fix
```

### 配置依赖验证

在某些情况下，你可能想使用与 `npx expo install` 推荐版本不同的包版本。在这种情况下，可以使用项目 **package.json** 中的 [`expo.install.exclude`](/versions/latest/config/package-json#installexclude) 属性，把特定包排除在版本检查之外。

### 安装所用的包管理器

`npx expo install` 支持 `bun`、`npm`、`pnpm` 和 `yarn`。

可以使用具名参数强制包管理器：

- `--bun`：使用 `bun` 安装依赖。当存在 **bun.lockb** 或 **bun.lock** 时为默认。
- `--npm`：使用 `npm` 安装依赖。当存在 **package-lock.json** 时为默认。
- `--pnpm`：使用 `pnpm` 安装依赖。当存在 **pnpm-lock.yaml** 时为默认。
- `--yarn`：使用 `yarn` 安装依赖。当存在 **yarn.lock** 时为默认。

## 身份验证

Expo CLI 提供与 `npx expo start` 命令一起使用的身份验证方法。身份验证用于为安全的 OTA 使用对清单进行“代码签名”。可以把它理解为 Web 上的 HTTPS。

1. 使用 `npx expo register` 注册账户。
2. 使用 `npx expo login` 登录账户。
3. 使用 `npx expo whoami` 检查当前已认证的账户。
4. 使用 `npx expo logout` 登出。

这些凭据在 Expo CLI 和 EAS CLI 之间共享。

物理 iOS 设备上的 Expo Go 也会检查此账户。只有当 Expo CLI 和 Expo Go 登录到同一账户时，它才会从开发服务器打开项目。当账户不匹配时，见 [Expo Go 需要登录](/troubleshooting/expo-go-sign-in-required)。

## 自定义

有时你可能想自定义原本由 Expo CLI 在内存中生成的项目文件。使用 Expo CLI 以外的工具时，需要存在默认配置文件，否则应用可能无法按预期工作。可以运行以下命令生成文件：

```sh
npx expo customize
```

从这里可以选择生成基本项目文件，例如：

- **babel.config.js** — Babel 配置。如果计划使用 Expo CLI 以外的工具打包项目，则必须存在此文件。
- **webpack.config.js** — 用于 Web 开发的默认 webpack 配置。
- **metro.config.js** — 用于通用开发的默认 Metro 配置。与 `npx react-native` 一起使用时需要此文件。
- **tsconfig.json** — 创建 TypeScript 配置文件并安装所需依赖。

## 环境变量

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `HTTP_PROXY` | **string** | 用于所有网络请求的 HTTP/HTTPS 代理 URL。配置 [Undici EnvHttpProxyAgent](https://github.com/nodejs/undici/blob/main/docs/docs/api/EnvHttpProxyAgent.md)。 |
| `EXPO_NO_WEB_SETUP` | **boolean** | 阻止 CLI 在使用 Web 功能之前强制安装 Web 依赖（`react-dom`、`react-native-web`、`@expo/webpack-config`）。这对希望进行非标准 Web 开发的情况很有用。 |
| `EXPO_OFFLINE` | **boolean** | 在适用时跳过所有网络请求。这会在网络连接较差的地区加快开发。 |
| `EXPO_NO_TYPESCRIPT_SETUP` | **boolean** | 阻止 CLI 在 `npx expo start` 时强制配置 TypeScript。更多信息见 [TypeScript 指南](/guides/typescript)。 |
| `DEBUG=expo:*` | **string** | 为 CLI 启用调试日志，可以使用 [`debug` 约定](https://github.com/debug-js/debug#conventions)配置。 |
| `EXPO_DEBUG` | **boolean** | `DEBUG=expo:*` 的别名。 |
| `EXPO_PROFILE` | **boolean** | 为 CLI 启用性能分析统计，这不会分析你的应用。 |
| `EXPO_NO_CACHE` | **boolean** | 禁用所有全局缓存。默认情况下，应用配置 JSON schema、模拟器的 Expo Go 二进制文件和项目模板会缓存在机器上的全局 **.expo** 目录中。 |
| `CI` | **boolean** | 启用时，CLI 会禁用交互功能、跳过可选提示，并在非可选提示上失败。示例：如果任何已安装的包已过时，`CI=1 npx expo install --check` 将失败。 |
| `EXPO_NO_TELEMETRY` | **boolean** | 禁用匿名使用情况收集。[进一步了解遥测](#遥测)。 |
| `EXPO_NO_GIT_STATUS` | **boolean** | 在 `npx expo prebuild --clean` 等潜在危险操作期间跳过关于 git 状态的警告。 |
| `EXPO_NO_REDIRECT_PAGE` | **boolean** | 禁用用于选择应用的重定向页面。当用户安装了 `expo-dev-client` 并用 `npx expo start` 而不是 `npx expo start --dev-client` 启动项目时会显示该页面。 |
| `EXPO_PUBLIC_FOLDER` | **string** | 与 Metro 一起用于 Web 的公共目录路径。[进一步了解自定义 Metro](/guides/customizing-metro)。默认：`public` |
| `EDITOR` | **string** | 在终端 UI 中按 <kbd>O</kbd> 时要打开的编辑器名称。此值在许多命令行工具中使用。 |
| `EXPO_EDITOR` | **string** | `EDITOR` 变量的 Expo 特定版本，定义时具有更高优先级。 |
| `EXPO_IMAGE_UTILS_NO_SHARP` | **boolean** | 禁用全局 Sharp CLI 安装，改用较慢的 Jimp 包进行图像处理。这用于 `npx expo prebuild` 等生成应用图标的地方。 |
| `EXPO_TUNNEL_SUBDOMAIN` | **boolean** | （实验性）禁用把 `exp.direct` 用作 `--tunnel` 连接的主机名。这会启用 **https://** 转发，可用于在 iOS 上测试通用链接。这可能导致 `expo-linking` 和 Expo Go 出现意外问题。通过传入不是以下值之一的 `string` 来选择确切子域名：`true`、`false`、`1`、`0`。 |
| `EXPO_METRO_NO_MAIN_FIELD_OVERRIDE` | **boolean** | 强制 Expo CLI 对所有平台使用项目 **metro.config.js** 中的 [`resolver.resolverMainFields`](https://metrobundler.dev/docs/configuration/#resolvermainfields)。默认情况下，Expo CLI 会对 Web 使用 `['browser', 'module', 'main']`（这是 webpack 的默认值），并对其他平台使用用户定义的 main 字段。 |
| ~~`EXPO_NO_INSPECTOR_PROXY`~~ | **boolean** | （已弃用）禁用具有改进的 Chrome DevTools 协议支持的自定义检查器代理。这包括对网络检查器的支持。 |
| `EXPO_NO_CLIENT_ENV_VARS` | **boolean** | 阻止在客户端 bundle 中内联 `EXPO_PUBLIC_` 环境变量。 |
| `EXPO_NO_DOTENV` | **boolean** | 阻止 Expo CLI 加载所有 `.env` 文件。 |
| `EXPO_NO_METRO_LAZY` | **boolean** | 阻止向 Metro URL 添加 `lazy=true` 查询参数（`metro@0.76.3` 及更高版本）。这会禁用 `import()` 支持。 |
| `EXPO_USE_TYPED_ROUTES` | **boolean** | 使用 `expo.experiments.typedRoutes` 在 Expo Router 中启用静态类型路由。 |
| ~~`EXPO_METRO_UNSTABLE_ERRORS`~~ | **boolean** | （已弃用）禁用 Metro 打包错误的反向依赖堆栈跟踪。默认启用。 |
| ~~`EXPO_USE_METRO_WORKSPACE_ROOT`~~ | **boolean** | （已弃用，SDK 52+）为 Metro 启用自动服务器根检测。这会把服务器根更改为工作区根。对 monorepo 有用。 |
| `EXPO_NO_METRO_WORKSPACE_ROOT` | **boolean** | （SDK 52+）禁用 Metro 的自动服务器根检测。禁用后不会把服务器根更改为工作区根。启用此功能对 monorepo 有用。 |
| ~~`EXPO_USE_UNSTABLE_DEBUGGER`~~ | **boolean** | （已弃用，SDK 52+）启用来自 React Native 的实验性调试器。 |
| `EXPO_ADB_USER` | **string** | 设置应随 ADB 命令的 `--user` 传递的 `user` 编号。用于在具有多个配置文件的 Android 设备上安装 APK。默认为 `0`。 |
| `EXPO_NO_TELEMETRY_DETACH` | **boolean** | （SDK 51+）在 `@expo/cli` 的主线程中发送遥测事件。这会导致 CLI 变慢，因为它会等待所有事件发送完毕。 |
| `EXPO_UNSTABLE_ATLAS` | **boolean** | （实验性，SDK 51+）在开发或导出期间收集 Metro bundle 信息。从 SDK 53 开始，此环境变量已弃用，请改用 `EXPO_ATLAS`。 |
| `EXPO_ATLAS` | **boolean** | （SDK 53+）在开发或导出期间收集 Metro bundle 信息。 |
| `EXPO_NO_BUNDLE_SPLITTING` | **boolean** | （实验性，SDK 51+）在生产环境中禁用对异步导入的 Metro 分块（仅 Web）。 |
| `EXPO_USE_METRO_REQUIRE` | **boolean** | （SDK 52+）启用 Expo 自定义的 Metro `require` 实现和基于 `string` 的模块 ID。这可以改进调试，并为 React Server Components 提供确定性 ID。不支持旧版 RAM bundle。 |
| `EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH` | **boolean** | （实验性，SDK 52+）启用急切打包，在整个 bundle 创建后以无缓存方式运行转换。这是生产 tree shaking 所必需的，对开发打包的优化较少。 |
| `EXPO_UNSTABLE_TREE_SHAKING` | **boolean** | （实验性，SDK 52+）在所有平台上启用不稳定的 tree shaking 支持。更多细节见 [tree shaking](/guides/tree-shaking)。 |
| `EXPO_NO_REACT_NATIVE_WEB` | **boolean** | （已弃用，SDK 56+）启用实验模式，在 Web 上运行 Expo 应用时不需要 React Native Web。 |
| `EXPO_NO_DEPENDENCY_VALIDATION` | **boolean** | （SDK 52+）在通过 `npx expo install` 和 `npx expo start` 安装包时禁用内置依赖验证。 |
| `EXPO_WEB_DEV_HYDRATE` | **boolean** | 为 Web 项目在开发中启用 React hydration。这可以帮助你尽早识别 hydration 问题。 |
| `EXPO_UNSTABLE_LIVE_BINDINGS` | **boolean** | （实验性，SDK 54+）在实验性 import/export 支持中禁用实时绑定。默认启用。实时绑定改进对循环依赖的支持，但可能导致性能略差。 |
| `EXPO_UNSTABLE_LOG_BOX` | **boolean** | （实验性，SDK 55+）为原生应用启用实验性 LogBox 错误覆盖层。Web 上默认启用。 |
| `EXPO_NO_QR_CODE` | **boolean** | 阻止 CLI 在控制台上显示二维码。 |

## 遥测

Expo 开发工具收集关于一般使用情况的匿名数据。这帮助我们知道某项功能何时未按预期工作。遥测完全可选，可以使用 `EXPO_NO_TELEMETRY=1` 环境变量选择退出。
