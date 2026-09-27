---
title: 配置多个应用变体
description: 学习如何配置动态应用配置，以便在同一台设备上安装多个应用变体。
---

# 配置多个应用变体

在本章中，我们将配置项目，使多种构建类型（development、preview、production）可以同时在同一台设备上运行。这样我们就可以测试应用开发的各个阶段，而不必卸载再重新安装不同版本。

[观看视频：如何配置多个应用变体](https://www.youtube.com/watch?v=UtJJCAfrjIg) —— 用各自唯一的 bundle identifier 配置 development、preview 和 production 应用变体，使它们可以在同一台设备上并排运行。

---

每个变体都需要唯一的 Android Application ID 和 iOS Bundle Identifier，才能在同一台设备上同时安装。这些 ID 在 **app.json** 中是这样设置的：

```json app.json
{
  "ios": {
    "bundleIdentifier": "com.yourname.stickersmash"
  },
  "android": {
    "package": "com.yourname.stickersmash"
  }
}
```

## 1. 添加 app.config.js 以进行动态配置

**app.json** 在 JSON 文件中包含与应用相关的配置。它是静态的，如果我们想对某些属性使用[动态值](/workflow/configuration#dynamic-configuration)，它并不理想。我们将根据[环境变量](/workflow/configuration#switching-configuration-based-on-the-environment)，为所有构建 profile 添加不同的 Android Application ID 和 iOS Bundle Identifier。

- 在项目根目录创建一个名为 **app.config.js** 的新文件。
- 在 **app.config.js** 中导出一个默认函数，它以 `config` 为参数。然后解构 `config`，以复制 **app.json** 中的全部现有属性。

```js app.config.js
export default ({ config }) => ({
  // config 对象会复制 app.json 文件中的全部现有配置。
  ...config,
});
```

## 2. 根据环境更新动态值

为了识别构建类型，在 **app.config.js** 中为 `development` 和 `preview` 构建 profile 添加两个环境变量，名为 `IS_DEV` 和 `IS_PREVIEW`：

```js app.config.js
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
```

然后添加两个函数，动态更改应用名称、Android Application ID 和 iOS Bundle Identifier：

```js app.config.js
const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  }

  if (IS_PREVIEW) {
    return 'com.yourname.stickersmash.preview';
  }

  return 'com.yourname.stickersmash';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)';
  }

  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)';
  }

  return 'StickerSmash: Emoji Stickers';
};
```

我们将用 `getAppName()` 为应用指定动态的 `name` 值，并用 `getUniqueIdentifier()` 区分 development 和 preview 构建的 `android.package` 与 `ios.bundleIdentifier`：

```js app.config.js
export default ({ config }) => ({
  ...config,
  // 使用 getAppName() 作为 name 属性
  name: getAppName(),
  ios: {
    // 包含 app.json 中现有的 ios 配置
    ...config.ios,
    // 使用 getUniqueIdentifier() 作为 bundleIdentifier 属性
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    // 包含 app.json 中现有的 android 配置
    ...config.android,
    // 使用 getUniqueIdentifier() 作为 package 属性
    package: getUniqueIdentifier(),
  },
});
```

## 3. 配置 eas.json

在 **eas.json** 中添加 `APP_VARIANT` 环境变量：

```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      // 添加 env.APP_VARIANT，以便为该构建 profile 访问环境变量
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      // 添加 env.APP_VARIANT，以便为该构建 profile 访问环境变量
      "env": {
        "APP_VARIANT": "preview"
      }
    }
  }
}
```

现在运行 `eas build --profile development` 会把 `APP_VARIANT` 设为 `development`。

:::note
由于我们更改了 Android Application ID 和 iOS Bundle Identifier，EAS CLI 会提示我们为 Android 生成新的 Keystore，并为 iOS 生成新的描述文件。要了解这些步骤包含什么，请参见上一章。
:::

由于 `ios-simulator` 构建 profile 扩展了 `development`，这份配置会自动应用于 iOS 模拟器。

## 4. 运行开发服务器

> 构建完成后，按照前面几章的同一流程，把它们安装到设备或模拟器上。

由于我们用 `APP_VARIANT` 环境变量来识别开发构建，启动开发服务器时需要把它传给命令。为此，在项目 **package.json** 的 [`"scripts"`](https://docs.npmjs.com/cli/v10/using-npm/scripts) 字段中添加一个 `dev` 脚本：

```json package.json
{
  "scripts": {
    "dev": "APP_VARIANT=development npx expo start"
  }
}
```

运行 `npm run dev` 命令来启动开发服务器：

:::tabs
:::tab npm
```sh
npm run dev
```
:::
:::tab yarn
```sh
yarn run dev
```
:::
:::tab pnpm
```sh
pnpm run dev
```
:::
:::tab bun
```sh
bun run dev
```
:::
:::

这个脚本会在本地求值 **app.config.js**，并为 `development` profile 加载环境变量。

现在，开发构建会在 Android 和 iOS 上运行，并显示 **app.config.js** 中修改后的应用名称。例如，下面的开发构建运行在 iOS 模拟器上。可以看到应用名称是 **StickerSmash (Dev)**：

![运行在 Android 设备上的 development 变体。](/static/images/tutorial/eas/ios-dev-variant.webp)

现在可以继续用 **app.json** 存放静态值，用 **app.config.js** 存放动态值。

## 小结

> 本页末尾包含一个教程进度指示器，用于显示你在本教程系列中的学习进度。
