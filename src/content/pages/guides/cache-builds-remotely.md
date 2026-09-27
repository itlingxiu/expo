---
title: 使用构建缓存提供方
description: 通过缓存并复用来自提供方的构建，加快本地开发。
---

# 使用构建缓存提供方

构建缓存可以根据项目[指纹](/versions/latest/sdk/fingerprint)把构建缓存在远端，从而加快 `npx expo run:[android|ios]`。运行 `npx expo run:[android|ios]` 时，它会检查是否存在指纹匹配的构建，若有则下载并启动，而不再重新编译。否则会按常规编译项目，再把生成的二进制上传到远端缓存，供以后的运行使用。

## 使用 EAS 作为构建提供方

要使用 EAS Build 提供方插件，先把 `eas-build-cache-provider` 安装为开发依赖：

:::tabs
:::tab macOS/Linux
```sh
# npm
npx expo install eas-build-cache-provider --dev

# yarn
yarn expo install eas-build-cache-provider --dev

# pnpm
pnpm expo install eas-build-cache-provider --dev

# bun
bun expo install eas-build-cache-provider --dev
```
:::
:::tab Windows
```sh
# npm
npx expo install eas-build-cache-provider "--" --dev

# yarn
yarn expo install eas-build-cache-provider "--" --dev

# pnpm
pnpm expo install eas-build-cache-provider "--" --dev

# bun
bun expo install eas-build-cache-provider "--" --dev
```
:::
:::

然后更新 **app.json**，加入 `buildCacheProvider` 属性及其提供方：

```json app.json
{
  "expo": {
    "buildCacheProvider": "eas"
    /* @hide 省略 ... */ /* @end */
  }
}
```

你也可以自己实现缓存提供方，导出一个实现以下方法的插件：

```ts
type BuildCacheProviderPlugin<T = any> = {
  /**
   * 尝试获取已有构建。返回其 URL；若不存在则返回 null。
   */
  resolveBuildCache(props: ResolveBuildCacheProps, options: T): Promise<string | null>;

  /**
   * 上传新的构建二进制。返回其 URL；失败时返回 null。
   */
  uploadBuildCache(props: UploadBuildCacheProps, options: T): Promise<string | null>;

  /**
   * （可选）自定义指纹哈希算法。
   */
  calculateFingerprintHash?: (
    props: CalculateFingerprintHashProps,
    options: T
  ) => Promise<string | null>;
};

type ResolveBuildCacheProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
  fingerprintHash: string;
};
type UploadBuildCacheProps = {
  projectRoot: string;
  buildPath: string;
  runOptions: RunOptions;
  fingerprintHash: string;
  platform: 'android' | 'ios';
};
type CalculateFingerprintHashProps = {
  projectRoot: string;
  platform: 'android' | 'ios';
  runOptions: RunOptions;
};
```

使用 GitHub Releases 缓存构建的参考实现见 [Build Cache Provider 示例](https://github.com/expo/examples/tree/master/with-github-remote-build-cache-provider)。

## 限制

构建缓存提供方只会被本地的 `npx expo run:[android|ios]` 命令查询。用 `eas build` 触发的构建不受影响。它们始终生成全新产物，不会调用缓存提供方插件。

有些本地构建也会被跳过：

- **iOS 物理设备构建。** 设备构建只在与其描述文件匹配的设备上有效，因此在不同机器或设备之间复用并不安全。当目标是物理设备时，`npx expo run:ios` 会同时跳过缓存查找和构建后上传。只有 iOS 模拟器构建会参与缓存。

如果在 **eas.json** 中使用 `appVersionSource: "remote"`，请注意 `versionCode`（Android）和 `buildNumber`（iOS）位于 EAS 服务器上，而不是项目源码中，因此它们不属于指纹输入。这对正常的开发迭代没有问题。本地 `npx expo run:*` 调用不会自动递增这些值，但要知道：缓存产物会保留它最初构建时嵌入的构建号。

## 创建自定义构建提供方

先创建一个 **provider** 目录，用 TypeScript 编写提供方插件，并在项目根目录添加 **provider.plugin.js** 文件，作为插件的入口。

1. 创建 `provider/tsconfig.json` 文件

```json provider/tsconfig.json
{
  "extends": "expo-module-scripts/tsconfig.plugin",
  "compilerOptions": {
    "outDir": "build",
    "rootDir": "src"
  },
  "include": ["./src"],
  "exclude": ["**/__mocks__/*", "**/__tests__/*"]
}
```

2. 为插件创建 `provider/src/index.ts` 文件

```ts provider/src/index.ts
import { type BuildCacheProviderPlugin } from '@expo/config';

const plugin: BuildCacheProviderPlugin = {
  resolveBuildCache: async () => {
    console.log('Searching for remote builds...');
    return null;
  },
  uploadBuildCache: async () => {
    console.log('Uploading build to remote...');
    return null;
  },
};

export default plugin;
```

3. 在根目录创建 `provider.plugin.js` 文件

```js provider.plugin.js
// 此文件配置插件的入口文件。
module.exports = require('./provider/build');
```

4. 构建提供方插件

在项目根目录运行 `npm run build provider`，以监听模式启动 TypeScript 编译器。

5. 配置示例项目使用你的插件，在 `example/app.json` 中添加以下内容：

```json example/app.json
{
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js"
    }
  }
}
```

6. 测试提供方

在 **example** 目录中运行 `npx expo run` 时，日志中应能看到插件的 console 输出。

```sh
# 进入 example 目录
cd example

# 在 Android 上运行示例
npx expo run:android

# 在 iOS 上运行示例
npx expo run:ios
```

这样就完成了。你现在有了一个远端构建缓存提供方，可以加快构建速度。

### 传入自定义选项

要把自定义选项注入插件，可以使用 `options` 字段，它会作为自定义函数的第二个参数传入。按如下方式修改 **example/app.json** 中的 `buildCacheProvider` 字段：

```json example/app.json
{
  "expo": {
    /* @hide 省略 ... */ /* @end */
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js",
      "options": {
        "myCustomKey": "XXX-XXX-XXX"
      }
    }
  }
}
```
