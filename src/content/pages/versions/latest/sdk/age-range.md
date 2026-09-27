---
title: AgeRange 包参考
description: 一个提供年龄范围信息访问的库，在 Android 上使用 Play Age Signals API，在 iOS 上使用 Declared Age Range 框架。
---

# AgeRange 包参考

`expo-age-range` 提供对用户年龄范围信息的访问。它在 Android 上使用 Google 的 [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api)，在 iOS 上使用 Apple 的 [Declared Age Range 框架](https://developer.apple.com/documentation/declaredagerange/)。

该库允许你向应用用户请求年龄范围信息，帮助你遵守适龄内容法规（例如[美国德克萨斯州](https://developer.apple.com/news/?id=btkirlj8)的规定），并在应用中提供适龄体验。

> 支持平台：Android、iOS、Expo Go。

:::warning
**重要**：Google 和 Apple 提供的底层原生 API 仍在积极开发中。虽然本库是稳定的，但可能需要更多的破坏性变更来适应这一情况。
:::

### 局限

我们建议在真机上测试该功能，因为模拟器运行时可能无法按预期工作。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-age-range
```
:::
:::tab yarn
```sh
yarn expo install expo-age-range
```
:::
:::tab pnpm
```sh
pnpm expo install expo-age-range
```
:::
:::tab bun
```sh
bun expo install expo-age-range
```
:::
:::

## 在应用配置中配置

### 配置 iOS 项目

要在 iOS 上使用年龄范围 API，你需要使用 Xcode 26.0 或更高版本构建项目，但我们建议使用最新版 Xcode 构建，以便访问最新的 API。

需要 `com.apple.developer.declared-age-range` entitlement。将其添加到你的[应用配置](/versions/latest/config/app)文件中：

```json app.json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.developer.declared-age-range": true
      }
    }
  }
}
```

对于现有的 React Native 项目，请将 entitlement 添加到项目中的 **ios/[app]/[app].entitlements** 文件：

```xml
<key>com.apple.developer.declared-age-range</key>
<true/>
```

## 用法

在 Android 上，Play Age Signals 仅在用户同意共享时才会报告年龄范围。请先调用 `requestAgeSignalsAccessAsync`，并且仅当它 resolve 为 `'SHARED'` 时才继续。在 iOS 上，同意提示是 `requestAgeRangeAsync` 的一部分，因此调用会以 `null` resolve，下面的示例也会继续执行。

```tsx
import * as AgeRange from 'expo-age-range';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [result, setResult] = useState<AgeRange.AgeRangeResponse | { error: string } | null>(null);

  const requestAgeRange = async () => {
    try {
      // 在 Android 上，先请求用户共享其年龄信号。在 iOS 上以 null resolve。
      const status = await AgeRange.requestAgeSignalsAccessAsync();
      if (status !== null && status !== 'SHARED') {
        setResult({ error: `Age signals are not shared: ${status}` });
        return;
      }

      const ageRange = await AgeRange.requestAgeRangeAsync({
        threshold1: 10,
        threshold2: 13,
        threshold3: 18,
      });
      setResult(ageRange);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : String(error) });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Request age range" onPress={requestAgeRange} />
      {result && (
        <Text style={styles.result}>
          {'error' in result ? `Error: ${result.error}` : `Lower age bound: ${result.lowerBound}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});
```

## 在 Android 上测试年龄信号

Google Play 仅向其已启用的账号报告年龄信号，因此你的测试账号可能没有所需的年龄范围。可以改用 `setFakeAgeSignals`，通过 Google Play 的 [`FakeAgeSignalsManager`](https://developer.android.com/google/play/age-signals/test-age-signals-api) 来伪造信号。

只有可调试的构建才能伪造信号，因为伪造的信号会让应用中的任何代码绕过你的年龄限制。在不可调试的构建中传入任何非 `null` 的值都会抛出 `ERR_AGE_RANGE_FAKE_SIGNALS_NOT_DEBUGGABLE`。

你的请求本身不变，只有报告的内容会变：

```ts
// 报告一个受监督的 13 到 15 岁用户，且有一项变更等待批准。
AgeRange.setFakeAgeSignals({
  ageSignalsStatus: 'SHARED',
  lowerBound: 13,
  upperBound: 15,
  ageRangeSource: 'TIER_B',
  significantChangeStatus: 'PENDING',
});

const status = await AgeRange.requestAgeSignalsAccessAsync();
const { lowerBound } = await AgeRange.requestAgeRangeAsync({ threshold1: 18 });

// 重新报告真实信号。
AgeRange.setFakeAgeSignals(null);
```

要伪造一次失败，请传入一个[错误代码](https://developer.android.com/google/play/age-signals/handle-errors)而不是信号：

```ts
AgeRange.setFakeAgeSignals({ errorCode: -4 });
```

## 其他资源

- [Play Age Signals API](https://developer.android.com/google/play/age-signals/use-age-signals-api)：Android 的年龄信号文档
- [Declared Age Range 框架](https://developer.apple.com/documentation/declaredagerange/)：iOS 的声明年龄范围文档

## API

```ts
import * as AgeRange from 'expo-age-range';
```

## 错误代码

可从原生模块抛出的任何错误的 `code` 属性中获取。对于 Android 特有的错误代码，请参阅 [Play Age Signals API 文档](https://developer.android.com/google/play/age-signals/handle-errors)中的"错误代码参考"。

| 代码 | 平台 | 描述 |
| --- | --- | --- |
| `ERR_AGE_RANGE_USER_DECLINED` | iOS | 用户拒绝共享其年龄范围。 |
| `ERR_AGE_RANGE_NOT_AVAILABLE` | iOS | 年龄范围不可用。最可能的原因是用户未在设备上登录其 Apple 账户。 |
| `ERR_AGE_RANGE_INVALID_REQUEST` | iOS | 提供的参数无效。年龄范围之间的间隔至少需要 2 年。 |
| `ERR_AGE_RANGE_TASK_CANCELLED` | Android | 用户关闭了 Play Age Signals 的年龄共享同意界面。 |
| `ERR_AGE_RANGE_FAKE_SIGNALS_CONFLICT` | Android | `setFakeAgeSignals` 同时收到了 `errorCode` 和年龄信号。 |
| `ERR_AGE_RANGE_FAKE_SIGNALS_NOT_DEBUGGABLE` | Android | 在不可调试的构建中请求用 `setFakeAgeSignals` 伪造信号。 |
