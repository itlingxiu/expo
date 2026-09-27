---
title: 本地化
description: 了解如何使用 expo-localization 在 Expo 项目中开始并配置本地化（i18n）。
---

# 本地化

如果你希望应用对其他语言/文化的使用者友好，就需要本地化它。本地化让应用适应当前设备的语言环境，以用户熟悉的方式显示翻译、货币，并格式化数字、列表等内容。本指南使用 `expo-localization` 读取用户语言设置，并用 `i18n-js` 作为多语言支持的示例。

## 获取用户的语言

使用 `expo-localization` 库读取当前语言。安装：

```sh
npx expo install expo-localization
```

然后在应用中访问本地化方法/数据：

```tsx
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;
```

`getLocales` 返回设备系统设置中的当前语言环境。在较新的 Android 与 iOS 版本中，可以按应用设置语言，因此通常不需要在应用内提供切换语言的 UI。有时按应用的语言偏好确实需要 UI；作为一般规则，以下内容应允许更改：

- 如果应用对本地化单位（公制/英制、货币、温度等）的使用达到一定程度，则应允许更改
- 如果在支持的平台上默认值没有 API 可用，则允许更改其他偏好（参见 expo-localization API 文档）

链接：[expo-localization](/versions/latest/sdk/localization)。

### 通过系统设置启用按应用选择语言

Android 与 iOS 都允许用户通过系统设置为每个应用选择首选语言；应用必须声明支持的语言环境。使用 expo-localization 配置插件的 `supportedLocales` 属性 —— 可以是语言环境数组，或平台专属的 `supportedLocales.ios` 与 `supportedLocales.android` 字段：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-localization",
        {
          "supportedLocales": {
            "ios": ["en", "ja"],
            "android": ["en", "ja"]
          }
        }
      ]
    ]
  }
}
```

:::note
在 Android 上，参考[语言环境命名指南](https://developer.android.com/guide/topics/resources/app-languages#locale-names)与[最常用语言环境列表](https://developer.android.com/guide/topics/resources/app-languages#sample-config)。在 iOS 上，使用语言名称或 ISO 语言代号。
:::

链接：[expo-localization 安装](/versions/latest/sdk/localization#installation)。

## 翻译应用

管理翻译会变成一项大任务；手动进行是可能的，但推荐使用库。

示例：使用 `i18n-js` 支持英语与日语：

```sh
npx expo install i18n-js
```

然后配置语言：

```tsx
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en: { welcome: 'Hello' },
  ja: { welcome: 'こんにちは' },
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales().at(0)?.languageCode ?? 'en'; // you can also do getLocales()[0].languageCode ?? 'en'

console.log(i18n.t('welcome'));
```

在整个应用中使用 `i18n.t` 翻译字符串。有些文本（例如姓名）可以跳过本地化：在默认语言中定义一次，并通过 `i18n.enableFallback = true;` 复用。

在 Android 上，更改设备语言不会重置应用；使用 [`AppState`](https://reactnative.dev/docs/appstate#basic-usage) API 监听状态变化并每次调用 `getLocales()`。在 iOS 上，更改设备语言会重置应用，因此只需设置一次语言，无需让 React 组件响应语言变化。

### 完整示例

```tsx Localization
import { View, StyleSheet, Text } from 'react-native';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: { welcome: 'Hello', name: 'Charlie' },
  ja: { welcome: 'こんにちは' },
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment the line below to force the app to use the Japanese language.
// i18n.locale = 'ja';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {i18n.t('welcome')} {i18n.t('name')}
      </Text>
      <Text>Current locale: {i18n.locale}</Text>
      <Text>Device locale: {getLocales()[0].languageCode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: 20,
    marginBottom: 16,
  },
});
```

### 其他翻译库

`i18n-js` 只是一个例子。选择库时需要考虑：

- 与翻译管理工具的集成，便于字符串管理与自动化。
- 为字符串提供上下文的能力，让 AI 翻译工具和/或人工审校者理解上下文，产出更好的翻译。
- 开发者体验 —— 在 React/JSX 中的用法；有些库包含 ESLint 插件等工具。
- 不要担心日期或数字的本地化 —— 使用标准化的 `Intl` API 即可。

不完整的列表：

- [Lingui](https://lingui.dev/) —— 成熟的库，对 React（包括 React Server Components（RSC））有一等支持，与翻译管理工具集成良好。
- [fbtee](https://fbtee.dev/) —— JavaScript 与 React 的国际化框架，强大、灵活且直观。
- [React i18next](https://react.i18next.com/) —— 基于 `i18next` 的稳定、维护良好的库。
- [Intlayer](https://intlayer.org/doc/environment/react-native-and-expo) —— 按组件划分的 i18n 库，带提取器与 AI 工具，专注 bundle 体积与性能。

链接：[其他翻译库](/guides/localization#other-translation-libraries)。

### 翻译应用元数据

要向不同国家/地区发布或支持多种语言，需要为显示名称与系统对话框等提供本地化字符串，在[应用配置](/workflow/configuration)中设置。首先设置 `ios.infoPlist.CFBundleAllowMixedLocalizations: true`，然后为 `locales` 提供文件路径：

```json app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "CFBundleAllowMixedLocalizations": true
      }
    },
    "locales": {
      "ja": "./languages/japanese.json"
    }
  }
}
```

`locales` 的键应为[语言标识符](https://developer.apple.com/documentation/xcode/choosing-localization-regions-and-scripts) —— 一个[两位语言代码](https://www.loc.gov/standards/iso639-2/php/code_list.php)加上可选的地区代码（例如 `en-US` 或 `en-GB`）。值指向一个 JSON 文件，例如：

```json japanese.json
{
  "ios": {
    "CFBundleDisplayName": "こんにちは",
    "NSContactsUsageDescription": "日本語のこれらの言葉",
    "NSUserTrackingUsageDescription": "より関連性の高い広告を表示するために、このアプリによるアクティビティの追跡を許可します。",
    "Localizable.strings": {
      "HELLO_NOTIFICATION_KEY": "こんにちは世界"
    }
  },
  "android": {
    "app_name": "こんにちは",
    "HELLO_NOTIFICATION_KEY": "こんにちは世界"
  }
}
```

在设为日语的设备上，应用显示名会变成 `こんにちは`。配置插件会在 Info.plist 中设置默认的 iOS 用途说明；对于翻译后的权限文案，把对应的用途说明键添加到每个语言环境文件的 `ios` 对象中 —— prebuild 时 Expo 会把这些值写入该语言环境的 InfoPlist.strings。在 SDK 55 及以后，还有一个仅 iOS 的 `Localizable.strings` 对象选项，其条目会生成本地化文件，可用于 [iOS 本地化通知](https://developer.apple.com/documentation/usernotifications/generating-a-remote-notification#Localize-your-alert-messages)。

## RTL 支持

RTL 语言需要正确处理布局与文本方向的变化。

:::note
本节描述 **SDK 58 及以后**的行为。此前，RTL 支持默认启用，但 Expo Go 中除外（禁用）。
:::

RTL 支持默认启用；布局方向遵循 React Native 的 [`I18nManager`](https://reactnative.dev/docs/i18nmanager)。当设备设置为 RTL 语言（如阿拉伯语或希伯来语）时，应用以 RTL 渲染，否则为 LTR。在 iOS 上，设备语言还必须在通过 `supportedLocales` 选项声明的应用支持语言之中。这适用于 Expo Go、开发构建，以及通过 EAS Build 或 `npx expo prebuild` 构建的应用。

### 禁用 RTL 支持

把 expo-localization 配置插件的 `supportsRTL` 设为 `false` 即可退出：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-localization",
        {
          "supportsRTL": false
        }
      ]
    ]
  }
}
```

### 强制 RTL 布局

为了测试或仅面向 RTL 语言环境本地化的应用，把 `forcesRTL` 设为 `true` 强制启用 RTL：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-localization",
        {
          "forcesRTL": true
        }
      ]
    ]
  }
}
```

#### 动态覆盖 RTL 设置

动态覆盖默认 RTL 检测不能使用静态应用配置；需要从应用代码中修改。这在 Expo Go 中无效，因为 Expo Go 在打开启动器或各个项目时会重置 RTL 偏好。

```tsx Overriding RTL settings
import { Text, View, StyleSheet, I18nManager, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export default function App() {
  const shouldBeRTL = true;

  if (shouldBeRTL !== I18nManager.isRTL && Platform.OS !== 'web') {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    Updates.reloadAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{I18nManager.isRTL ? ' RTL' : ' LTR'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '50%',
    backgroundColor: 'pink',
  },
});
```

### 在运行时更改 Expo Router 的方向

如果你的应用允许用户不重启就切换语言，在根 **app/_layout.tsx** 中用 `LocaleProvider` 包裹导航器，传入所选语言环境的方向，以更新导航头部、转场与手势。

```tsx app/_layout.tsx
import { LocaleProvider, Stack } from 'expo-router';

import { useAppLocale } from '../providers/AppLocaleProvider';

export default function RootLayout() {
  const { direction } = useAppLocale();

  return (
    <LocaleProvider direction={direction}>
      <Stack />
    </LocaleProvider>
  );
}
```

`LocaleProvider` 配置 Expo Router 的导航组件；应用内容的布局方向仍需单独设置。

## 让应用在 RTL 语言环境下表现正确

### 布局与视图

无需根据语言环境手动调整 `<View>` 样式；`justifyContent`、`alignItems` 等属性会按需改变行为。

- 在 LTR 语言环境中，`start` 与 `end` 等同于 `left` 与 `right`。
- 在 RTL 语言环境中，`start` 与 `end` 等同于 `right` 与 `left`。

:::note
关于 RTL 在 React Native 中如何工作的更多细节，参见 React Native 介绍 RTL 支持的[博客文章](https://reactnative.dev/blog/2016/08/19/right-to-left-support-for-react-native-apps)。
:::

#### Web 支持

Web 的 RTL 布局不需要修改应用配置。Expo 在浏览器中使用 `react-native-web`；要让它自动适应当前语言环境的方向，给根 `<View>` 组件添加 `dir` 属性：

```tsx App.tsx
import { View } from 'react-native';
import { getLocales } from 'expo-localization';
// ...

return <View dir={getLocales()[0].textDirection || 'ltr'}>...</View>;
```

:::note
`textDirection` 在 Firefox 与较旧的浏览器版本中不可用。如有需要可[手动检测](https://stackoverflow.com/a/15726039)。
:::

### 文本对齐

React Native 的 `textAlign` 不接受 flex 属性中可用的 `start`/`end` 值。取而代之，`left` 实际上充当 `start`（LTR 中为左，RTL 中为右），`right` 充当 `end`。然而，默认（未设置）的 `textAlign` 值意味着真正的左侧（LTR 与 RTL 都是左），因此每个 `<Text>` 都应设置 `textAlign: left` 或 `textAlign: right` 才能正确对齐。最佳实践：把它定义在一个可复用的自定义 `<Text>` 组件中，在任何渲染文本的地方导入。

```tsx mobile-text.tsx
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

const MobileText = (props: RNTextProps) => {
  return <RNText style={{ textAlign: 'left', ...props.style }} {...props} />;
};
export default MobileText;
```

#### Web 支持

为每个文本标签添加 `lang` 属性，值为当前语言环境标识符；最好在自定义可复用组件中定义。

```tsx web-text.tsx
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;

const WebText = (props: RNTextProps) => {
  return <RNText lang={deviceLanguage} {...props} />;
};

export default WebText;
```

然后按平台选择移动端或 Web 版 Text：

```tsx Text.tsx
const Text = Platform.OS === 'web' ? WebText : MobileText;
export default Text;
```

### 根据语言环境方向选择资源

要为 LTR/RTL 使用不同图标，或根据设置改变样式，使用 [`I18nManager.isRTL`](https://reactnative.dev/docs/next/i18nmanager#isrtl)：

```tsx
import { I18nManager } from 'react-native';
const isRTL = I18nManager.isRTL;
```

## 语言环境设置与单位

`expo-localization` 让你读取用户的语言环境与其他偏好。同步的 `getLocales()` 与 `getCalendars()` 方法获取当前设备的语言环境设置：

- `getLocales()` 按用户偏好顺序返回语言环境列表；至少有一个。
- `getCalendars()` 按用户偏好顺序返回日历列表；至少有一个。

```ts
import { getLocales, getCalendars } from 'expo-localization';

const {
  languageTag,
  languageCode,
  textDirection,
  digitGroupingSeparator,
  decimalSeparator,
  measurementSystem,
  currencyCode,
  currencySymbol,
  regionCode,
} = getLocales()[0];

const { calendar, timeZone, uses24hourClock, firstWeekday } = getCalendars()[0];
```

#### 限制

- 目前还无法从用户偏好中读取温度单位。在 Android 上可以用基于语言环境的查找表；在 iOS 上，用户可以在设备偏好中更改。
- 有些属性在当前平台不可用时可能为 null。

## Intl API

使用 Hermes 时，[`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API 在所有平台上都可用，提供格式化列表、日期、数字、货币金额、单位、复数形式等工具。传入 `default` 作为语言环境字符串，`Intl` 就会使用设备语言环境，因此获取当前语言环境（如 `"en-US"`）不需要 `expo-localization`：

```ts
new Intl.NumberFormat('default', { style: 'currency', currency: 'EUR' }).format(5.0);
```

:::note
`Intl` API 在你知道用户期望什么之后格式化字符串/值。它们不提供关于设备或当前语言环境的信息，因此无法用来获取当前语言环境的单位、货币或度量系统 —— 为此你需要 `expo-localization`、Web 上的 JS 代码，或 Android/iOS 上的第三方或自定义原生代码。
:::
