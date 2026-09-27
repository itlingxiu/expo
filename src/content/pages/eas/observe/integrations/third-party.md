---
title: 把第三方包与 EAS Observe 集成
description: 了解如何为第三方包添加可选的 EAS Observe 集成。
---

# 把第三方包与 EAS Observe 集成

第三方包可以与 EAS Observe 集成，以发送帮助开发者识别性能和使用问题的事件。这些往往是仅从应用代码很难发现的问题。

事件应当描述开发者可以修复的可操作问题。例如，一个包可能会报告：

- 比设备屏幕大得多的图像
- 完成时间过长的后台任务
- 加载缓慢的原生资源

## 前置条件

- **Expo SDK 57 及更高版本**

  第三方集成需要 SDK 57 及更高版本才能访问 `Observe.registerIntegration()`。

- **已经使用 EAS Observe 的应用**

  按照[开始使用](/eas/observe/get-started)安装 `expo-observe` 并创建第一次构建。

1. **把 `expo-observe` 添加为可选的 peer 依赖**

   把 `expo-observe` 添加为可选的 peer 依赖，这样在没有安装它时你的包仍然可以工作。同时把它添加为开发依赖，以便获得 TypeScript 类型和测试。不要把它添加为必需的运行时依赖。

   ```json package.json
   {
     "peerDependencies": {
       "expo-observe": ">={{expoSdkVersion}}"
     },
     "peerDependenciesMeta": {
       "expo-observe": {
         "optional": true
       }
     },
     "devDependencies": {
       "expo-observe": "^{{expoSdkVersion}}"
     }
   }
   ```

   在 `try/catch` 块中用 `require()` 加载该包。使用 `typeof import()` 以保留其 TypeScript 类型：

   ```ts observe.ts
   let observeModule: typeof import('expo-observe') | undefined;

   try {
     observeModule = require('expo-observe') as typeof import('expo-observe');
   } catch {
     // 未安装 expo-observe 时，集成保持禁用。
   }
   ```

2. **声明集成配置**

   使用声明合并，把你的包的集成键添加到 `expo-observe`：

   ```ts observe.types.ts
   export type YourPackageIntegrationConfig = {
     thresholdMs?: number;
   };

   declare module 'expo-observe' {
     interface ObserveIntegrationsConfig {
       'your-package'?: boolean | YourPackageIntegrationConfig;
     }
   }
   ```

   从包的入口点导出此声明，以便用户导入你的包时 TypeScript 会加载它。

   使用你的包的开发者随后可以用 `Observe.configure()` 启用该集成：

   ```tsx app/_layout.tsx
   import { Observe } from 'expo-observe';

   Observe.configure({
     integrations: {
       'your-package': true,
     },
   });
   ```

   如果集成接受选项，开发者可以传入配置对象而不是 `true`：

   ```tsx app/_layout.tsx
   Observe.configure({
     integrations: {
       'your-package': {
         thresholdMs: 1500,
       },
     },
   });
   ```

3. **注册集成**

   用你的集成键调用 `Observe.registerIntegration()`。回调会收到你的集成的配置：

   ```ts observe.ts
   export function initObserveIntegration() {
     // typeof window 检查会在 Web 的服务端渲染期间跳过初始化。
     if (typeof window !== 'undefined' && observeModule) {
       const { Observe } = observeModule;

       Observe.registerIntegration('your-package', config => {
         if (config) {
           enableObserveIntegration(config === true ? {} : config);
         }
       });
     }
   }

   let enabled = false;

   function enableObserveIntegration() {
     // 在这里初始化集成
     // 例如：
     enabled = true;
   }
   ```

   在你的包中实现 `enableObserveIntegration()`。当集成被省略或设为 `false` 时，回调不会运行。

   从包的入口点调用初始化函数：

   ```ts index.ts
   import { initObserveIntegration } from './observe';

   export type { YourPackageIntegrationConfig } from './observe.types';

   initObserveIntegration();
   ```

4. **记录事件**

   当你的包检测到可操作的问题时，调用 `Observe.logEvent()`。使用小写事件名称，并以包名作为第一段。用句点分隔各段：

   ```ts observe.ts
   export function logExpensiveOperation(durationMs: number, thresholdMs: number) {
     if (!observeModule || !enabled) {
       return;
     }

     const { Observe } = observeModule;

     Observe.logEvent('your-package.expensive-operation', {
       severity: 'warn',
       body: 'Reduce the work performed by this operation or increase the configured threshold.',
       attributes: {
         durationMs,
         thresholdMs,
       },
     });
   }
   ```

   关于命名事件和添加细节的更多信息，见[用户定义的事件](/eas/observe/events)。
