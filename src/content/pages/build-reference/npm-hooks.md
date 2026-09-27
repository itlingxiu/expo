---
title: 构建生命周期钩子
description: 了解如何用 npm 使用 EAS Build 生命周期钩子来自定义构建过程。
---

# 构建生命周期钩子

EAS Build 生命周期 npm 钩子允许你在构建过程之前或之后运行脚本，从而自定义构建过程。

> 为了更好地理解，参见 [Android 构建过程](/build-reference/android-builds)和 [iOS 构建过程](/build-reference/ios-builds)。

:::warning
在[自定义构建](/custom-builds/get-started)中，构建过程不会执行这些生命周期钩子。需要在过程中由构建步骤手动提取并调用它们。
:::

## EAS Build 生命周期钩子

共有六个 EAS Build 生命周期 npm 钩子。要使用它们，可以在 **package.json** 中设置。

| 构建生命周期 npm 钩子 | 说明 |
| --- | --- |
| `eas-build-pre-install` | 在 EAS Build 运行 `npm install` 之前执行。 |
| `eas-build-post-install` | 行为取决于平台和项目类型。<br/><br/>对于 Android，在以下命令全部完成后运行一次：`npm install` 和 `npx expo prebuild`（如果需要）。<br/><br/>对于 iOS，在以下命令全部完成后运行一次：`npm install`、`npx expo prebuild`（如果需要）和 `pod install`。 |
| `eas-build-on-success` | 如果构建成功，在构建过程结束时触发此钩子。 |
| `eas-build-on-error` | 如果构建失败，在构建过程结束时触发此钩子。 |
| `eas-build-on-complete` | 在构建过程结束时触发此钩子。你可以用环境变量 `EAS_BUILD_STATUS` 检查构建状态。它的值是 `finished` 或 `errored`。 |
| `eas-build-on-cancel` | 如果构建被取消，则触发此钩子。 |

使用一个或多个生命周期钩子时，**package.json** 可以如下所示：

```json package.json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "echo 123",
    "eas-build-post-install": "echo 456",
    "eas-build-on-success": "echo 789",
    "eas-build-on-error": "echo 012",
    "eas-build-on-cancel": "echo 345",
    "start": "expo start",
    "test": "jest"
  },
  "dependencies": {
    "expo": "{{expoSdkVersion}}"
  }
}
```

## 特定平台的钩子行为

要只为 Android 或 iOS 构建运行某个脚本（或脚本的某一部分），可以在脚本内部根据平台分叉行为。下面是通过 shell 脚本或 Node 脚本实现的常见示例。

### 示例

#### package.json 与 shell 脚本

```json package.json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "./pre-install",
    "start": "expo start"
  },
  "dependencies": {
  }
}
```

```bash pre-install
#!/bin/bash

# 这是项目根目录中名为 "pre-install" 的文件

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
  echo "Run commands for Android builds here"
elif [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  echo "Run commands for iOS builds here"
fi
```

<details>
<summary>示例：在 macOS 工作器上安装 <code>git-lfs</code> 的 pre-install 脚本</summary>

下面的脚本会在尚未安装时安装 [`git-lfs`](https://git-lfs.com/)。在某些需要 `git-lfs` 才能安装特定 CocoaPods 的情况下，这很有用。

```bash pre-install
if [[ "$EAS_BUILD_PLATFORM" == "ios" ]]; then
  if brew list git-lfs > /dev/null 2>&1; then
    echo "=====> git-lfs is already installed."
  else
    echo "=====> Installing git-lfs"
    HOMEBREW_NO_AUTO_UPDATE=1 brew install git-lfs
    git lfs install
  fi
fi
```

</details>

#### package.json 与 Node 脚本

```json package.json
{
  "name": "my-app",
  "scripts": {
    "eas-build-pre-install": "node pre-install.js",
    "start": "expo start"
    // ...
  },
  "dependencies": {
    // ...
  }
}
```

```js pre-install.js
// 在项目根目录创建名为 "pre-install.js" 的文件

if (process.env.EAS_BUILD_PLATFORM === 'android') {
  console.log('Run commands for Android builds here');
} else if (process.env.EAS_BUILD_PLATFORM === 'ios') {
  console.log('Run commands for iOS builds here');
}
```
