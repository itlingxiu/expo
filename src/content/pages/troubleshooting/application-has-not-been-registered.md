---
title: “Application has not been registered”错误
description: 了解 Application has not been registered 错误的含义，以及如何在 Expo 或 React Native 应用中解决它。
---

# “Application has not been registered”错误

开发 Expo 或 React Native 应用时，经常会遇到类似下面的错误：

```text
Application "main" has not been registered.
# 或者
Invariant Violation: "main" has not been registered.
```

在这个具体错误中，`"main"` 可以是任意字符串。

## 这个错误是什么意思

### 异常可能阻止了应用完成注册

此错误最常见的原因是：应用在完成自身注册之前抛出了异常。React Native 应用加载时有两个步骤：

1. 加载 JavaScript 代码。如果一切成功，应用就会被注册。如果加载 bundle 时出现任何异常，执行会被中止，永远到不了注册应用的那一步。
2. 运行已注册的应用。如果代码加载失败，应用就不会被注册，你就会看到本页所讨论的错误。

如果处于这种情况，你看到的错误信息是一条[转移注意力的线索](https://en.wikipedia.org/wiki/Red_herring)，它把你从导致应用未能注册的真正错误上引开了。

查看这条错误信息之前的日志，找出可能的原因。一个常见原因是某个会把自己注册为视图的原生模块依赖存在多个版本。例如[这篇 Stack Overflow 讨论](https://stackoverflow.com/questions/67543844/invariant-violation-main-has-not-been-registered-while-running-react-native-a/67550379)中，发帖人的依赖里有多个版本的 `react-native-safe-area-context`。

### 应用根组件可能没有被注册

另一种可能是：传给 [`AppRegistry.registerComponent`](https://reactnative.dev/docs/appregistry#registercomponent) 的 `AppKey`，与原生 iOS 或 Android 侧注册的 `AppKey` 不一致。

在使用[持续原生代码生成（CNG）](/workflow/continuous-native-generation)的项目中，默认行为是使用 `"main"` 作为 `AppKey`。这会自动处理。只要你不把 **package.json** 中的 `"main"` 字段改离默认值，它就能正常工作。如果要自定义应用入口，请参阅 [registerRootComponent](/versions/latest/sdk/expo#registerrootcomponentcomponent) API 参考。

在包含原生代码的项目中，默认的 **index.js** 大致如下：

```js
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

其中 `registerRootComponent` 的实现是：

```js
function registerRootComponent(component) {
  AppRegistry.registerComponent('main', () => component);
}
```

在原生侧，**AppDelegate.m** 中应能看到：

```objectivec
RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"main" initialProperties:nil];
```

在 **MainActivity.java** 中：

```java
@Override
protected String getMainComponentName() {
  return "main";
}
```

默认情况下，整个项目都一致使用 `"main"`。如果遇到此错误，很可能是某些值被改过，彼此不再一致。请确保 JavaScript 侧注册的名称与原生侧期望的名称相同（如果使用 Expo 的 `registerRootComponent` 函数，该名称就是 `"main"`）。

## 其他考虑

此错误也可能出现在其他一些场景中，但更难预测，修复方式也更取决于具体项目。例如：

- 你连接到了错误项目的本地开发服务器。试着关闭其他 Expo CLI 或 React Native community CLI 进程（用 `ps -A | grep "expo\|react-native"` 找到它们）。
- 如果此错误只出现在生产应用中，请尝试用 `npx expo start --no-dev --minify` 在本地以生产模式运行应用，以找到错误来源。
