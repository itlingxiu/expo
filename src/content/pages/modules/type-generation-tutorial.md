---
title: 教程：生成模块的 TypeScript 接口
description: 使用 expo-type-information 包为 Expo 模块创建 TypeScript 接口的教程。
---

# 教程：生成模块的 TypeScript 接口

:::warning
本教程面向 macOS 用户，因为 `expo-type-information` 包仅在 macOS 上工作。
:::

编写 Expo 模块通常意味着要多次编写模块接口：在 Swift 中、在 Kotlin 中，以及在 TypeScript 中。`expo-type-information` 包通过直接从你的 Swift 代码中提取类型定义来生成 TypeScript 接口，从而自动化这一过程。

在本教程中，你将学习如何使用 `expo-type-information` 包，为**内联模块**和**常规 Expo 模块**生成 TypeScript 接口。

## 设置项目

首先安装 `expo-type-information` 包。

:::tabs
:::tab npm
```sh
$ npm install expo-type-information
```
:::
:::tab yarn
```sh
$ yarn add expo-type-information
```
:::
:::tab pnpm
```sh
$ pnpm add expo-type-information
```
:::
:::tab bun
```sh
$ bun add expo-type-information
```
:::
:::

使用此包还需要安装 sourcekitten。

```sh
$ brew install sourcekitten
```

## 生成内联模块接口

我们在[内联模块示例](/modules/inline-modules-tutorial)的基础上继续。在该教程中，我们构建了一个带有内联模块和内联视图的示例应用。你的项目中应该有：

```text
app/FirstInlineModule.kt
app/FirstInlineModule.swift
app/FirstInlineView.swift
app/FirstInlineView.kt
app/index.ts
```

请记住，我们以前有一个 index 文件，其中使用 `requireNativeModule` 和 `requireNativeView` 直接引用内联模块，但它们返回的是 `any` 类型，既没有类型安全，也不支持自动补全。

```tsx app/index.tsx
import { requireNativeModule, requireNativeView } from 'expo';
import { StyleSheet, Text, View } from 'react-native';

const FirstInlineModule = requireNativeModule('FirstInlineModule');
const FirstInlineView = requireNativeView('FirstInlineView');

export default function InlineModulesDemoComponent() {
  return (
    <>
      <View style={styles.textBox}>
        <Text style={styles.text}> {FirstInlineModule.Hello} </Text>
      </View>
      <FirstInlineView style={styles.inlineView} url="https://docs.expo.dev/modules/" />
    </>
  );
}

const styles = StyleSheet.create({
  textBox: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  text: { fontSize: 26 },
  inlineView: { flex: 1 },
});
```

现在我们将使用 `expo-type-information` 包为这些模块生成 TS 接口。在项目根目录运行以下命令：

:::tabs
:::tab npm
```sh
$ npx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab yarn
```sh
$ yarn dlx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab bun
```sh
$ bunx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::

`--app-json`（简写 `-a`）指定应用配置文件的路径，内联模块的 watchedDirectories 在该文件中定义。使用 `--watcher`（简写 `-w`）选项时，应用配置文件和所有 `watchedDirectories` 都会被监视，当它们发生变化时会重新生成 TS 接口。

运行此命令后，你应该会在项目中看到 4 个新文件：

```text
app/FirstInlineModule.generated.ts
app/FirstInlineModule.tsx
app/FirstInlineView.generated.ts
app/FirstInlineView.tsx
```

我们先看 `FirstInlineModule.swift`。项目中的每个内联模块都会创建两个文件，在这里是 `FirstInlineModule.generated.ts` 和 `FirstInlineModule.tsx`。

```tsx app/FirstInlineModule.generated.ts
/*由 expo-type-information 自动生成。*/

import { ViewProps } from 'react-native';

import { NativeModule } from 'expo';

export declare class FirstInlineModuleNativeModuleType extends NativeModule {
  readonly Hello: string;
}
```

这个 “generated” 文件包含已解析的每一个类型。在我们的例子中，它只有 `FirstInlineModule` 的定义，其中只声明了一个类型为 `string` 的 `Hello` 常量。重新运行该命令，或以 `--watcher` 运行时，此文件会被重新生成，因此不要修改它，除非你不再想使用该命令。

我们来看为 FirstInlineModule 生成的另一个文件。

```tsx app/FirstInlineModule.tsx
// 文件哈希: c7729100cc23e11d5d39fcb99fe861f7b03502986ee7becb85731cb631f37000
import { FirstInlineModuleNativeModuleType } from './FirstInlineModule.generated';

import { requireNativeModule, requireNativeView } from 'expo';

const FirstInlineModule: FirstInlineModuleNativeModuleType =
  requireNativeModule<FirstInlineModuleNativeModuleType>('FirstInlineModule');

export const Hello: string = FirstInlineModule.Hello;
```

此文件应当是模块的“稳定”接口。CLI 使用文件哈希来检测手动更改。如果你自定义了此文件，CLI 将停止覆盖它，从而允许你添加自定义逻辑或辅助函数，同时让原生类型在 “generated” 文件中保持同步。

在我们的例子中，我们只是从原生模块重新导出 `Hello` 常量。

现在来看为 `FirstInlineView.swift` 生成的文件。

```tsx app/FirstInlineView.generated.ts
/*由 expo-type-information 自动生成。*/

import { ViewProps } from 'react-native';

import { NativeModule } from 'expo';

// 这些类型未在提供的文件中定义。
export type URL = unknown;

export interface ExpoWebViewProps extends ViewProps {
  url: URL;
  onLoad?: (event: any) => void;
}

export declare class FirstInlineViewNativeModuleType extends NativeModule {}
```

查看 “generated” 文件，我们可以看到 `FirstInlineView.swift` 中并非所有类型都能被解析，`URL` 类型被设为 `unknown`。当类型不是基本类型（工具会手动映射基本类型）、并且没有在提供的文件中定义时（这里它没有在 `FirstInlineView.swift` 中定义），或者工具未能解析其定义时，就可能发生这种情况。

我们还可以看到生成了 `ExpoWebViewProps` 接口，它包含来自 `FirstInlineView` 的 props 和事件。

```tsx app/FirstInlineView.tsx
// 文件哈希: 6eb6c583bee1f61cbb9f6557faadc9d6b7fb51313c05027076431304668f7ac5
import React from 'react';

import {
  URL,
  FirstInlineViewNativeModuleType,
  ExpoWebViewProps,
} from './FirstInlineView.generated';

import { requireNativeModule, requireNativeView } from 'expo';

const FirstInlineView: FirstInlineViewNativeModuleType =
  requireNativeModule<FirstInlineViewNativeModuleType>('FirstInlineView');

const ExpoWebView = requireNativeView<ExpoWebViewProps>('FirstInlineView', 'ExpoWebView');

export default function ExpoWebViewComponent(props: ExpoWebViewProps) {
  return <ExpoWebView {...props} />;
}
```

“稳定”文件也与前一种情况略有不同。它现在有一个默认导出，是原生 `FirstInlineView` 视图的 `ExpoWebViewComponent` 包装。不过请注意，由于这是默认导出，一个内联模块中只能定义一个视图，这个“稳定”文件才能正常工作。

有了这些生成的文件，我们现在就可以轻松地从 TypeScript 使用内联模块和内联视图。`app/index.tsx` 以前是：

```tsx app/index.tsx
import { requireNativeModule, requireNativeView } from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

const FirstInlineModule = requireNativeModule('FirstInlineModule');
const FirstInlineView = requireNativeView('FirstInlineView');

export default function InlineModulesDemoComponent() {
  return (
    <>
      <View style={styles.textBox}>
        <Text style={styles.text}> {FirstInlineModule.Hello} </Text>
      </View>
      <FirstInlineView style={styles.inlineView} url="https://docs.expo.dev/modules/" />
    </>
  );
}

const styles = StyleSheet.create({
  textBox: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  text: { fontSize: 26 },
  inlineView: { flex: 1 },
});
```

现在我们可以去掉 `requireNativeModule`，并从“稳定”文件导入模块和视图。

```tsx app/index.tsx
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { Hello } from './FirstInlineModule';
import FirstInlineView from './FirstInlineView';

export default function InlineModulesDemoComponent() {
  return (
    <>
      <View style={styles.textBox}>
        <Text style={styles.text}> {Hello} </Text>
      </View>
      <FirstInlineView style={styles.inlineView} url="https://docs.expo.dev/modules/" />
    </>
  );
}

const styles = StyleSheet.create({
  textBox: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  text: { fontSize: 26 },
  inlineView: { flex: 1 },
});
```

### 监视器

要看监视器如何工作，请确保前面的命令仍在运行：

:::tabs
:::tab npm
```sh
$ npx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab yarn
```sh
$ yarn dlx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::tab bun
```sh
$ bunx expo-type-information inline-modules-interface --app-json ./app.json --watcher
```
:::
:::

然后我们给 FirstInlineModule 添加一个新函数：

```Swift app/FirstInlineModule.swift
internal import ExpoModulesCore

class FirstInlineModule: Module {
  public func definition() -> ModuleDefinition {
    Constant("Hello") {
      return "Hello iOS inline modules!"
    }

    Function("ConcatStrings") { (str1: String, strings: [String]) -> String in
        return strings.reduce(str1) { $0 + $1 }
    }
  }
}
```

把新的 `ConcatStrings` 函数添加到 Swift 模块文件后，你应该会看到 “generated” 和 “stable” 文件已更新，并且现在也包含 `ConcatStrings` 函数。

```tsx app/FirstInlineModule.generated.ts
/*由 expo-type-information 自动生成。*/

import { ViewProps } from 'react-native';

import { NativeModule } from 'expo';

export declare class FirstInlineModuleNativeModuleType extends NativeModule {
  readonly Hello: string;
  ConcatStrings(str1: string, strings: string[]): string;
}
```

```tsx app/FirstInlineModule.tsx
// 文件哈希: 2311de57c3a0c2135c45f49be6d2fdccd57a2b65c0ad10285c248bdf5276b7b6
import { FirstInlineModuleNativeModuleType } from './FirstInlineModule.generated';

import { requireNativeModule, requireNativeView } from 'expo';

const FirstInlineModule: FirstInlineModuleNativeModuleType =
  requireNativeModule<FirstInlineModuleNativeModuleType>('FirstInlineModule');

export const Hello: string = FirstInlineModule.Hello;

export function ConcatStrings(str1: string, strings: string[]) {
  return FirstInlineModule.ConcatStrings(str1, strings);
}
```

如果此文件没有更新，你可能已经修改过它！如果想让它重新生成，需要先删除它，然后修改 Swift 模块以触发监视器。

现在你可以在应用中使用这个新函数：

```tsx app/index.tsx
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { Hello, ConcatStrings } from './FirstInlineModule';
import FirstInlineView from './FirstInlineView';

export default function InlineModulesDemoComponent() {
  return (
    <>
      <View style={styles.textBox}>
        <Text style={styles.text}> {Hello} </Text>
        <Text style={styles.text}>
          {ConcatStrings('Nicely ', ['typed ', 'function ', 'which ', 'concatenates ', 'strings!'])}
        </Text>
      </View>
      <FirstInlineView style={styles.inlineView} url="https://docs.expo.dev/modules/" />
    </>
  );
}

const styles = StyleSheet.create({
  textBox: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  text: { fontSize: 26 },
  inlineView: { flex: 1 },
});
```

关于如何为内联模块生成并使用 TypeScript 接口的教程到此结束。

## Expo 模块接口

我们在[原生模块教程示例](/modules/native-module-tutorial)的基础上继续。在该示例中，你创建了一个 expo-settings 模块，其中定义了一个简单的 Swift 模块。

```Swift expo-settings/ios/SettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: Theme) -> Void in
      UserDefaults.standard.set(theme.rawValue, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme.rawValue
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }
  }

  enum Theme: String, Enumerable {
    case light
    case dark
    case system
  }
}
```

你还为这个模块创建了由以下文件组成的 TypeScript 接口：

- `expo-settings/src/ExpoSettings.types.ts`
- `expo-settings/src/ExpoSettingsModule.ts`
- `expo-settings/src/index.ts`

现在我们使用 `expo-type-information` CLI 自动生成这个接口，而不是手写！

首先删除上面的文件，并确保你位于项目根目录。

然后运行命令来生成接口：

:::tabs
:::tab npm
```sh
$ npx expo-type-information module-interface --module ./expo-settings
```
:::
:::tab yarn
```sh
$ yarn dlx expo-type-information module-interface --module ./expo-settings
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-type-information module-interface --module ./expo-settings
```
:::
:::tab bun
```sh
$ bunx expo-type-information module-interface --module ./expo-settings
```
:::
:::

如果你打算修改文件并想看接口如何变化，请给命令加上 `--watcher`（简写 `-w`）标志。

:::tabs
:::tab npm
```sh
$ npx expo-type-information module-interface --module ./expo-settings -w
```
:::
:::tab yarn
```sh
$ yarn dlx expo-type-information module-interface --module ./expo-settings -w
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-type-information module-interface --module ./expo-settings -w
```
:::
:::tab bun
```sh
$ bunx expo-type-information module-interface --module ./expo-settings -w
```
:::
:::

`--module` 选项（简写 `-m`）是模块根文件夹的路径。运行此命令后，你应该会在模块包中看到 3 个新生成的文件。

- `expo-settings/src/ExpoSettings.types.ts`
- `expo-settings/src/ExpoSettingsModule.ts`
- `expo-settings/src/index.ts`

现在来看生成了什么。

```tsx expo-settings/src/ExpoSettings.types.ts
// 文件哈希: 455b035995710b95054ffc0fa6ee888d3be158c5145e64ce4b8e0a3a92c5c510
/*由 expo-type-information 自动生成。*/

import { ViewProps } from 'react-native';

import { NativeModule } from 'expo';

export enum Theme {
  light,
  dark,
  system,
}
```

`*.types.ts` 文件包含模块中定义的所有类型的定义。在我们的例子中，我们只声明了一个 `Theme` 枚举，它已被正确地放入该文件。不过请注意，与教程中的 `ExpoSettings.types.ts` 不同，事件类型没有被生成。`expo-type-information` 工具是新的且功能强大，但并非每个选项都已实现，模块事件就是其中之一。

```tsx expo-settings/src/ExpoSettingsModule.ts
// 文件哈希: 21a1653e3cadc31ac359d32209987615e0feb20925c494864a9038013a3416b6
/*由 expo-type-information 自动生成。*/

import { requireNativeModule, NativeModule } from 'expo';

import { Theme } from './ExpoSettings.types';

export declare class ExpoSettings extends NativeModule {
  setTheme(theme: Theme): void;
  getTheme(): string;
}

const _default: ExpoSettings = requireNativeModule<ExpoSettings>('ExpoSettings');
export default _default;
```

`*Module.ts` 文件包含原生模块类的声明，并导出模块实例。请注意，与上一个文件类似，这里也没有定义事件。

```tsx expo-settings/src/index.ts
/*由 expo-type-information 自动生成。*/

export type * from './ExpoSettings.types';

export { default as ExpoSettings } from './ExpoSettingsModule';
```

index 文件与示例的差异更大。我们没有把每个模块方法包装成单独的函数，而是选择只重新导出模块对象。
