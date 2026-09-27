---
title: 持续原生生成（CNG）
description: 了解如何用持续原生生成（CNG）和预构建管理原生项目。
---

# 持续原生生成（CNG）

单独一个原生项目本身就难以维护、扩展和更新。在跨平台应用中，你有多个必须维护的原生项目，并且必须跟上最新的操作系统发布，以免在任何第三方依赖上落后太多。

随着原生项目增长，来自第三方依赖的复杂性增加，使升级更复杂并减慢开发者的势头。这会阻碍添加高级原生功能，并导致功能较弱的应用。在跨平台应用中，这种复杂性在每个平台上都会成倍增加。

为了解决这个问题，我们引入了**持续原生生成**的概念。不再是创建一次原生项目并在代码库的整个生命周期中维护对这些原生项目的自定义，而是只在需要时（例如调试或构建时）生成短生命周期的原生项目。这些项目由标准模板加上定义模板应如何自定义的配置或自定义代码生成。结果是一个可以编译成原生应用、并带有开发者所需任何自定义的原生项目。不过，开发者只负责维护其自定义的定义，而不是全部原生项目代码。

## React Native 应用中的 CNG

React Native 应用可以通过使用[预构建](#用法)来使用 **CNG**，以自动化升级、安装或卸载库、应用白标自定义、在多个应用之间共享配置、减少[孤立代码](#预构建如何帮助处理孤立代码)等。

**作为框架的 Expo** 通过组合以下工具来启用 CNG：

1. [应用配置](/workflow/configuration)文件。
2. 传给 `npx expo prebuild` 命令的参数。
3. 项目中安装的 `expo` 版本，以及对应的[预构建模板](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)。
4. [自动链接](/more/glossary-of-terms#自动链接)，用于链接在 **package.json** 中找到的[原生模块](/more/glossary-of-terms#原生模块)。
5. 原生订阅者，用于减少入口点文件（例如 **MainApplication** 或 **AppDelegate**）中的原生代码副作用。
6. 用于为额外 target 和 entitlement 进行代码签名的 EAS 凭据。

最终结果是这样一种工作流：开发者可以用应用配置表达任何原生应用，并通过运行 `npx expo prebuild` 持续生成该项目。

## 用法

可以通过运行以下命令使用预构建：

:::tabs
:::tab npm
```sh
$ npx expo prebuild
```
:::
:::tab yarn
```sh
$ yarn expo prebuild
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild
```
:::
:::tab bun
```sh
$ bun expo prebuild
```
:::
:::

这会创建用于运行 React 代码的 **android** 和 **ios** 目录。如果你手动修改生成的目录，下次运行 `npx expo prebuild --clean` 时就有丢失更改的风险。请改用[配置插件](/config-plugins/introduction)，它们是在预构建期间对原生项目执行修改的函数。

我们强烈建议出于[常见问题](#预构建)一节列出的原因使用预构建，但该系统是[完全可选的](#可选性)，你可以随时停止使用它。

### 与 EAS Build 一起使用

如果项目不包含 **android** 和 **ios** 目录，EAS Build 会在编译之前运行预构建来生成这些原生目录。对于用 `npx create-expo-app` 创建的任何项目，这是默认行为。

对于已有 **android** 和 **ios** 目录的项目，EAS Build 不会运行预构建，以避免覆盖你对原生目录所做的任何更改。

如果你通过[在本地编译](/guides/local-app-development#本地应用编译)来排查应用（运行 `npx expo prebuild`，或 `npx expo run:android` 或 `npx expo run:ios`），你仍然可以在 EAS Build 中使用预构建，在构建过程中生成全新的原生目录。创建新项目时，**android** 和 **ios** 目录会自动加入 **.gitignore**，但如果你需要手动添加，可以把它们加入 **.gitignore** 或 [**.easignore**](/build-reference/easignore) 文件：

```diff .gitignore
diff --git a/.gitignore b/.gitignore
--- a/.gitignore
+++ b/.gitignore
@@ -0,0 +1,2 @@
+/android
+/ios
```

### 与 Expo CLI run 命令一起使用

你可以在本地执行原生构建：

:::tabs
:::tab npm
```sh
# 构建原生 Android 项目
$ npx expo run:android

# 构建原生 iOS 项目
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 构建原生 Android 项目
$ yarn expo run:android

# 构建原生 iOS 项目
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 构建原生 Android 项目
$ pnpm expo run:android

# 构建原生 iOS 项目
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 构建原生 Android 项目
$ bun expo run:android

# 构建原生 iOS 项目
$ bun expo run:ios
```
:::
:::

如果原生目录不存在，`npx expo prebuild` 会针对特定平台运行一次。后续使用这些 `run` 命令时，手动运行 `npx expo prebuild --clean`，以确保原生代码与本地配置全新同步。

## 平台支持

预构建目前支持 Android 和 iOS。不需要 Web 支持，因为没有要为 Web 生成的原生项目，Web 应用在 Web 浏览器中运行。使用 `--platform` 选项为单个平台运行预构建：

:::tabs
:::tab npm
```sh
$ npx expo prebuild --platform ios
```
:::
:::tab yarn
```sh
$ yarn expo prebuild --platform ios
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild --platform ios
```
:::
:::tab bun
```sh
$ bun expo prebuild --platform ios
```
:::
:::

## 依赖

预构建首先从对应于每个 Expo SDK 版本的模板初始化新的原生项目。这也与特定的 React 和 React Native 版本对齐。当你项目的 React 和 React Native 版本与[模板 **package.json**](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum) 的 `dependencies` 字段中指定的期望版本不同时，运行 `npx expo prebuild` 会看到警告。

你可以用 `--skip-dependency-update` 选项跳过更改 npm 包版本：

:::tabs
:::tab npm
```sh
$ npx expo prebuild --skip-dependency-update react-native,react
```
:::
:::tab yarn
```sh
$ yarn expo prebuild --skip-dependency-update react-native,react
```
:::
:::tab pnpm
```sh
$ pnpm expo prebuild --skip-dependency-update react-native,react
```
:::
:::tab bun
```sh
$ bun expo prebuild --skip-dependency-update react-native,react
```
:::
:::

## 包管理器

当[依赖](#依赖)发生变化时，预构建会使用项目当前使用的包管理器（从 lockfile 推断）重新安装库。你可以通过提供 `--npm`、`--yarn`、`--pnpm` 之一来强制使用特定包管理器。

可以通过传入 `--no-install` 命令跳过所有安装，这对快速测试生成很有用。

## 清理

`--clean` 选项会在生成之前删除任何现有的原生目录。不带 `--clean` 选项重新运行 `npx expo prebuild` 会把更改叠加在现有文件之上，这更快，但在某些情况下可能不会产生相同的结果。

例如，有些配置插件不是幂等的。当项目使用多个“危险修改器”向应用代码添加正则更改时，可能导致意外行为。这就是为什么使用 `--clean` 选项是使用预构建命令最安全的方式，并且在大多数情况下通常被推荐。

### 使用 `--clean` 选项

使用 `--clean` 选项时，如果你的 git 代码仓库有任何未提交的更改，你会收到警告，因为此选项会删除并重新创建全部原生项目文件。此提示是可选的，在 CI 中遇到时会被跳过。你可以通过启用环境变量 `EXPO_NO_GIT_STATUS=1` 来禁用此检查。

有些情况下开发者可能想经常在工作流之间切换。例如，你可能想在 Android Studio 和 Xcode 中以原生方式构建自定义功能，然后把该功能移到本地配置插件中。

## 模板

你可以通过[配置插件](/config-plugins/introduction)自定义原生目录的生成方式。已经存在许多用于大量修改的配置插件，社区库也常常自带插件。你可以[查看一些流行插件的列表](https://github.com/expo/config-plugins)了解更多信息。

预构建从模板文件开始，然后用配置插件修改它们。模板文件基于 Expo SDK 版本，来自 npm 包 [`expo-template-bare-minimum`](https://github.com/expo/expo/tree/main/templates/expo-template-bare-minimum)。你可以通过向 `npx expo prebuild` 命令传入 `--template /path/to/template.tgz` 来更改所使用的模板。通常不建议这样做，因为 `@expo/prebuild-config` 中的基础修改器对模板文件做了一些未记录的假设，因此维护自定义模板可能比较棘手。

:::note
在所有包都从私有注册表下载、并且 npm 公共注册表访问被阻止的网络环境中，必须向预构建命令传入本地可用的模板。[进一步了解使用默认模板的本地版本](https://expo.fyi/prebuild-without-npm-access)。
:::

## 副作用

`npx expo prebuild` 在生成 **android** 和 **ios** 目录之外还会执行若干副作用。正在进行消除这些副作用的工作。理想情况下，运行 `npx expo prebuild` 会生成 Android 和 iOS 项目，并保持项目其余部分不变。

除了生成原生目录，预构建还会做以下修改：

- 修改 **package.json** 中的 `scripts` 字段，把 `expo start --android` 和 `expo start --ios` 替换为 `expo run:android` 和 `expo run:ios`
- 修改 **package.json** 中的 `dependencies` 字段

对 `scripts` 字段的便利更改是唯一会改变开发者在预构建前后如何处理应用的副作用。所有其他更改可以保留并提交到 git，以最小化运行预构建时的差异。

## 可选性

预构建是可选的，并且与所有 Expo 工具和服务无缝配合。对于原生项目由手动管理的[现有 React Native 项目](/bare/overview)，不要使用 `npx expo prebuild`，因为那可能覆盖任何手动自定义。开发者可以在采用其他 Expo 工具和工作流的同时，继续（[直接更改其原生项目](/more/glossary-of-terms#裸工作流)）。之后，他们可以把手动自定义移到应用配置和/或配置插件，然后采用 CNG。

Expo 提供的一切，包括 [EAS](/eas)、Expo CLI 和 Expo SDK 中的库，都构建为**完全支持**现有 React Native 项目，因为这是支持使用 `npx expo prebuild` 的项目的最低要求。唯一的例外是 [Expo Go](https://expo.dev/go) 应用，它只有在项目为 Expo Go 运行时中不存在的原生代码包含 JavaScript 回退时，才能加载任意 React Native 项目。

## 常见问题

### CNG

<details>
<summary>CNG 如何帮助项目升级？</summary>

不使用**持续原生生成**的 React Native 开发者报告称，把应用升级到最新版本的 React Native 是该库的第一大弱点，参见 [React Native 调查（2022）](https://results.2022.stateofreactnative.com/opinions/#opinions_pain_points)。

使用 CNG 时，升级过程只是升级 npm 依赖、应用配置，并重新运行 `npx expo prebuild --clean`。

</details>

<details>
<summary>React Native 库作者如何采用 CNG？</summary>

React Native 库作者可以通过多种方式采用 CNG。这取决于他们库的复杂性。下面是几种情形：

- **没有原生代码或配置副作用**：没有原生代码或配置副作用的库，例如 `react-native-blurhash`，可以与 `npx expo prebuild` 无缝集成。它们可以依赖 Node 模块解析，而不需要任何额外配置。

- **安装后无需额外设置的原生代码**：带有原生代码的库通常可以用 [Expo 自动链接](/more/glossary-of-terms#自动链接)自动安装和链接，自动链接在构建原生应用之前运行。

- **额外的配置副作用和设置**：需要额外配置副作用的库可以通过为其库创建 [Expo 配置插件](/config-plugins/introduction)来采用 CNG。这种方法使库作者能够自动化添加权限消息等到 **Info.plist**，或在 Xcode 项目中注入 target。

- **依赖原生运行时钩子的库**：依赖特定原生运行时钩子的库，例如通过 `AppDelegate`、`MainActivity`、`MainApplication` 等拦截初始启动 URL，可以利用 Expo Modules API 中的 [**生命周期监听器**](/modules/android-lifecycle-listeners)。这些生命周期监听器允许通过 Expo 自动链接应用这些运行时钩子，而不是通过修改这些标准原生项目文件，从而不需要配置插件。

许多复杂的库和服务已经通过 Expo 预构建支持 CNG，例如 [MapBox](https://github.com/rnmapbox/maps)、[Sentry](https://github.com/getsentry/sentry-react-native)、[Stripe](https://github.com/stripe/stripe-react-native) 和 [React Native Firebase](https://rnfirebase.io/#installation-for-expo-projects)。

库作者采用 CNG 并不是使用 `npx expo prebuild` 的前提。如果库作者尚未采用 CNG，开发者仍然可以通过创建本地[配置插件](https://github.com/expo/config-plugins/)来修改原生生成流水线，从而使用 `npx expo prebuild`。这种灵活性使 CNG 对 React Native 社区中的所有开发者都可访问且有益。

</details>

<details>
<summary>CNG 是否仅限于 React Native 项目？</summary>

不，CNG 是一种可以应用于任何原生项目的通用模式。虽然 Expo 预构建是专门为 React Native 项目实现 CNG 的工具，这个概念本身并不限于此框架。

</details>

<details>
<summary>社区如何使用 CNG？</summary>

下面是一些把困难的原生功能转换成简单配置文件的社区示例，它们让开发者能够构建更强大的应用，而不牺牲迭代速度：

- [iOS Safari 扩展](https://github.com/andrew-levy/react-native-safari-extension)：在这里，为 iOS 创建 Safari 扩展这一出了名难实现的功能，被简化为几行 JSON。

- [iMessage 贴纸应用](https://github.com/expo/config-plugins/tree/main/packages/ios-stickers)：这个 Expo 配置插件可以从一个 JSON 对象生成整个 iMessage 贴纸应用。

- [整个 Firebase 套件](https://rnfirebase.io/)：在这里你可以看到整个原生 Firebase 套件从跨多个 IDE 的多步原生配置过程，简化为基础 JSON 配置。

- [跨平台主屏幕小组件](https://github.com/gaishimo/eas-widget-example)：这个 Expo 配置插件可以为 Android 和 iOS 生成主屏幕小组件。

- [Apple App Clips](https://github.com/bndkt/react-native-app-clip)：这个 Expo 配置插件把生成 Apple App Clip 的过程从跨越多个 target 的多步过程，简化为一行 `["react-native-app-clip", { "name": "My App Clip" }]`。

在任何时候，这些功能都可以轻松添加和移除，而没有任何副作用。CNG 允许开发者试验复杂功能并快速迭代，而不必担心长期维护成本或项目中潜在的孤立代码。

</details>

<details>
<summary>CNG 可以用于 Android 和 iOS 以外的操作系统吗？</summary>

当然可以！CNG 是一个可以应用于任何操作系统的抽象概念。虽然 Expo 预构建官方为 Android 和 iOS 实现 CNG，它也为开发者提供抽象的平台支持，以便为其他平台创建实现。

</details>

<details>
<summary>使用 Expo 是 CNG 的要求吗？</summary>

完全不是。CNG 是任何社区都可以采用的开放模式。我们抽象地定义了该模式，以帮助其他社区理解如何为自己的项目采用 CNG。

</details>

<details>
<summary>CNG 与静态站点生成（SSG）等 Web 开发模式相比如何？</summary>

CNG 与 SSG 的相似之处在于，它从一组输入生成项目。不过 CNG 的输出与 SSG 不同。它生成的是原生运行时代码，而不是静态网站代码。这意味着原生项目按需生成，并且一旦原生项目被编译成原生应用，生成的源代码和配置就会被丢弃。

</details>

<details>
<summary>是否可以把 CNG 用于现有的棕地项目？</summary>

CNG 设计为持续管理原生项目的全部状态。因此，它并不打算用于现有的棕地项目。不过，你可以用 CNG 生成新的原生项目，然后把它集成到现有的棕地项目中。

</details>

### 预构建

Expo 预构建简化了 CNG 处理。下面是预构建所解决的 React Native 开发周期中的一些问题：

<details>
<summary>预构建如何帮助进行合理的项目升级？</summary>

构建原生代码需要熟悉平台的工具，从而形成陡峭的学习曲线。由于多个平台，这一挑战在跨平台开发中更加剧烈。如果你必须用平台特定的原生代码实现许多功能，跨平台工具也帮不上忙。

引导原生应用时，有一些你可能不理解的初始代码和配置。但你并不负责维护它。最终，你需要理解这些代码才能安全地升级应用。这一挑战常常导致开发者错误地升级，或启动一个新应用并复制现有源代码。

**使用预构建**，升级更接近升级纯 JavaScript 应用。提升 **package.json** 中的版本，重新生成原生项目，你就应该可以继续开发了。

</details>

<details>
<summary>预构建如何简化跨平台配置？</summary>

应用图标、名称、启动画面等跨平台配置必须在原生代码中手动实现。这些实现在每个平台上往往相当不同。

**使用预构建**时，跨平台配置在配置插件层面处理，开发者只需要设置一个值，例如 `"icon": "./icon.png"`，所有图标生成就会被处理。

</details>

<details>
<summary>如何用预构建管理依赖的副作用？</summary>

许多复杂的原生包除了安装和[自动链接](/more/glossary-of-terms#自动链接)之外还需要额外设置。例如，相机库需要把权限设置添加到 Android 的 **AndroidManifest.xml** 和 iOS 的 **Info.plist**。这种额外设置可以视为包的配置副作用。把所需的副作用代码粘贴到项目的原生文件中，可能导致难以解决的原生编译错误，而且这些代码现在由你拥有和维护。

**使用预构建**时，比任何人都更了解如何配置自己库的库作者，可以创建一个可测试、有版本的脚本，称为[配置插件](/config-plugins/introduction)，以自动化为其库添加所需的配置副作用。这意味着库的副作用可以更有表现力、更强大、更稳定。对于原生代码副作用，我们还提供 [Android 生命周期监听器](/modules/android-lifecycle-listeners)和 [AppDelegate 订阅者](/modules/appdelegate-subscribers)，它们在默认[预构建模板](#模板)中是标准配置。

</details>

<details id="预构建如何帮助处理孤立代码">
<summary>预构建如何帮助处理孤立代码？</summary>

卸载包时，你必须确定已经移除了使该包工作所需的全部副作用。如果遗漏任何内容，就会导致无法追溯到任何特定包的孤立代码，这些代码会累积，使项目更难理解和维护。

**使用预构建**时，唯一的副作用是项目 Expo 配置（**app.json**）中的[配置插件](/config-plugins/introduction)，当对应的 node 模块已被卸载时它会抛出错误，这意味着孤立配置少得多。

</details>

<details>
<summary>预构建何时可能不适合某个项目</summary>

下面是 Expo 预构建可能**不**适合某个特定项目的一些原因：

#### 平台兼容性

预构建只能用于 Expo SDK 支持的原生平台。目前这意味着 Android 和 iOS。Web 除外，它不需要 `npx expo prebuild`，因为它使用浏览器而不是自定义原生运行时。

#### 直接做更改比模块化和自动化更快

所有原生更改都必须用原生模块（使用 React Native 内置的 Native Module API 或 Expo Modules API）和配置插件来添加。这意味着如果你想快速向项目添加一个原生文件来试验，那么你可能最好运行预构建并手动添加该文件，然后用 [Monorepo](/guides/monorepos)逐步回到该系统。我们计划通过向 [Expo 自动链接](/more/glossary-of-terms#expo-自动链接)添加功能来加快这一过程，该功能会在构建之前找到原生目录之外的原生项目文件并链接它们。

如果你想修改配置，例如 **gradle.properties** 文件，你必须编写一个插件（[示例](https://github.com/expo/expo/blob/1c994bb042ad47fbf6878e3b5793d4545f2d1208/apps/native-component-list/app.config.js#L21-L28)）。这可以用辅助插件库轻松自动化，不过如果你需要经常做，会稍慢一些。

#### 社区中的配置插件支持

并非所有包都已经支持 _Expo 预构建_。如果你发现某个库在安装后需要额外设置，并且还没有配置插件，我们建议开一个 pull request 或 issue，以便维护者知道这个功能请求。

许多包，例如 [`react-native-blurhash`](https://github.com/mrousavy/react-native-blurhash)，除了[自动链接](/more/glossary-of-terms#自动链接)所处理的内容之外不需要任何额外的原生配置，因此不需要配置插件。

其他包，例如 [`react-native-ble-plx`](https://github.com/Polidea/react-native-ble-plx)，确实需要额外设置，因此要与 `npx expo prebuild` 一起使用就需要配置插件（此情况下有一个外部插件，称为 [`@config-plugins/react-native-ble-plx`](https://github.com/expo/config-plugins/tree/main/packages/react-native-ble-plx)）。

另外，我们也有一个[树外配置插件](https://github.com/expo/config-plugins)仓库，为尚未采用该系统的流行包提供插件。可以把它看成 TypeScript 的 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)。我们更希望包自带配置插件，但如果它们尚未采用该系统，社区可以使用该仓库中列出的包。

</details>
