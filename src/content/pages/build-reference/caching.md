---
title: 缓存依赖
description: 了解如何通过缓存依赖来加快构建。
---

# 缓存依赖

构建作业开始编译项目之前，所有项目依赖都必须已在磁盘上可用。获取依赖花费的时间越长，你等待构建完成的时间就越长，因此缓存依赖是加快构建的重要部分。

> 我们正在积极改进缓存以及构建过程的其他方面，让构建稳定地变快。

## 自定义缓存

[eas.json](/build/eas-json) 中构建 profile 上的 `cache` 字段可用于为特定文件和目录配置缓存。指定的文件会在成功构建后保存到持久存储，并在后续构建中于 JavaScript 依赖安装之后恢复。恢复不会覆盖已有文件。更改 `cache.key` 的值会使缓存失效。更改 `cache` 对象的任何其他属性也会使缓存失效。

## JavaScript 依赖

EAS Build 运行一个 npm 缓存服务器，可以加快构建作业下载 JavaScript 依赖的速度。默认情况下，使用 npm 或 Yarn 2+ 的项目会使用该缓存。不过，Yarn 1（Classic）需要你应用这一[变通方法](/build-reference/npm-cache-with-yarn)，才能在项目的 **package.json** 中使用该缓存。

要禁用 npm 缓存服务器，在 **eas.json** 中把环境变量 `EAS_BUILD_DISABLE_NPM_CACHE` 设为 `"1"`。如果你使用 EAS Workflows，请改为在作业的 [`env`](/eas/workflows/syntax#jobsjob_idenv) 中设置。

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_NPM_CACHE": "1"
      }
    }
  }
}
```

### 不可变锁文件

默认情况下，Node 包会使用你首选包管理器的不可变锁文件标志/命令来安装（例如 `yarn --frozen-lockfile` 或 `npm ci`）。如果想禁用这一点，可以在 **eas.json** 中把环境变量 `EAS_NO_FROZEN_LOCKFILE` 设为 `"1"`。

## Android 依赖

EAS Build 运行一个 Maven 缓存服务器，可以加快构建作业下载 Android 依赖的速度。

目前我们缓存：

- `maven-central`：[https://repo1.maven.org/maven2/](https://repo1.maven.org/maven2/)
- `google`：[https://maven.google.com/](https://maven.google.com/)
- `plugins`：[https://plugins.gradle.org/m2/](https://plugins.gradle.org/m2/)

要禁用 Maven 缓存服务器，在 **eas.json** 中把环境变量 `EAS_BUILD_DISABLE_MAVEN_CACHE` 设为 `"1"`。如果你使用 EAS Workflows，请改为在作业的 [`env`](/eas/workflows/syntax#jobsjob_idenv) 中设置。

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_MAVEN_CACHE": "1"
      }
    }
  }
}
```

## 用 ccache 缓存 C/C++ 编译产物

[ccache](https://ccache.dev/) 是一个编译器缓存，通过缓存先前的编译结果来加快原生代码的重新编译。EAS 开箱即支持 ccache 配置。

你可以用这些环境变量把构建配置为自动保存和恢复 ccache 缓存：

- `EAS_USE_CACHE`：设为 `1` 时，在构建作业期间同时启用恢复和保存缓存结果。
- `EAS_RESTORE_CACHE`：控制在构建开始时恢复缓存。设为 `1` 启用，设为 `0` 禁用。它会覆盖 `EAS_USE_CACHE`。
- `EAS_SAVE_CACHE`：控制是否在构建结束时保存构建缓存。设为 `1` 启用，设为 `0` 禁用。它会覆盖 `EAS_USE_CACHE`。

### EAS Workflows

对于 EAS Workflows，使用 [`eas/restore_cache`](/eas/workflows/syntax#easrestore_cache) 和 [`eas/save_cache`](/eas/workflows/syntax#eassave_cache)。

**Android 示例：**

```yaml .eas/workflows/build-android.yml
jobs:
  build_android:
    type: build
    steps:
      - uses: eas/checkout
      - uses: eas/restore_build_cache
      # 这等价于上面的步骤。你也可以通过定义自己的 key 模式和路径，用 /restore_cache 做其他缓存用途
      # - uses: eas/restore_cache
      #   with:
      #     key: android-ccache-${{ hashFiles('yarn.lock') }}
      #     restore_keys: android
      #     path: /home/expo/.cache/ccache
      - uses: eas/build
      - uses: eas/save_build_cache
      # - uses: eas/save_cache
      #   with:
      #    key: android-ccache-${{ hashFiles('yarn.lock') }}
      #    path: /home/expo/.cache/ccache
```

**iOS 示例：**

```yaml .eas/workflows/build-ios.yml
jobs:
  build_ios:
    type: build
    steps:
      - uses: eas/checkout
      - uses: eas/restore_build_cache
      # 这等价于上面的步骤。你也可以通过定义自己的 key 模式和路径，用 /restore_cache 做其他缓存用途
      # - uses: eas/restore_cache
      #   with:
      #     key: ios-ccache-${{ hashFiles('yarn.lock') }}
      #     restore_keys: ios
      #     path: /Users/expo/Library/Caches/ccache
      - uses: eas/build
      - uses: eas/save_build_cache
      # - uses: eas/save_cache
      #   with:
      #    key: ios-ccache-${{ hashFiles('yarn.lock') }}
      #    path: /Users/expo/Library/Caches/ccache
```

### 自定义构建

在你自行管理构建步骤的自定义构建中，添加 [`eas/restore_build_cache`](/custom-builds/schema#easrestore_build_cache) 和 [`eas/save_build_cache`](/custom-builds/schema#eassave_build_cache) 以启用 ccache 缓存。

```yaml .eas/build/custom.yml
build:
  name: Build with ccache
  steps:
    - eas/checkout
    - eas/restore_build_cache
    - eas/build
    - eas/save_build_cache
```

缓存键使用包管理器锁文件的哈希，根据你的依赖创建唯一键。当依赖变化时，会创建新缓存，同时仍允许通过 `restore_keys` 回退到先前的缓存。

### 缓存键匹配

恢复缓存时，缓存系统按特定搜索顺序查找匹配的缓存条目。缓存键要么自动生成（使用 `eas/restore_build_cache` 或 `eas/save_build_cache` 时），要么通过 `key` 参数显式提供（使用 `eas/restore_cache` 或 `eas/save_cache` 时）。

搜索顺序：

1. **精确匹配**：首先搜索与缓存键精确匹配的条目（自动生成或显式提供）
2. **恢复键**：如果没有精确匹配，会按顺序检查 `restore_keys`，寻找最近的前缀匹配

如果与提供的 `key` 精确匹配，这被视为直接缓存命中，缓存会立即恢复。如果是部分匹配或来自 `restore_keys` 的匹配，缓存会被恢复，但效果可能不那么好。

#### 使用恢复键

:::note
恢复键匹配由缓存系统自动处理，不需要手动配置。本节是对预期行为的参考说明。
:::

恢复键 `android-ccache-` 匹配任何以字符串 `android-ccache-` 开头的键。例如，键 `android-ccache-fd3052de` 和 `android-ccache-a9b253ff` 都匹配该恢复键。会使用创建日期最近的那个缓存。本例中的键按以下顺序搜索：

1. **`android-ccache-${{ hashFiles('yarn.lock') }}`** 匹配特定哈希。
2. **`android-ccache-`** 匹配以 `android-ccache-` 为前缀的缓存键。
3. **`android-`** 匹配任何以 `android-` 为前缀的键。

### 缓存限制

访问限制通过在不同 Git 分支或用户之间建立逻辑边界，提供缓存隔离和安全性。在构建应用时理解并利用它们，对你和用户的安全都很重要。

#### GitHub 运行

当构建从 GitHub 运行时，缓存的作用域限定为构建所在的分支。构建可以恢复在以下位置创建的缓存：

- 当前分支
- 默认分支（`main` 或 `master`）

#### EAS CLI 运行

当构建从 `eas-cli` 触发时，缓存的作用域限定为运行构建的用户。这些以用户为作用域的缓存提供隔离，使构建及其缓存的修改在开发期间或用户之间不会被无意共享。

#### 默认分支缓存

如果构建没有恢复到以用户为作用域的缓存，它会自动回退到恢复由默认分支上触发的 GitHub 构建所发布的缓存。这样，即使尚无以用户为作用域的缓存，构建也能受益于可信来源创建的缓存。

#### 共享用户行为

当单个用户主体在多人之间共享时（例如使用访问令牌，或从 GitHub Actions 触发构建），以用户为作用域的缓存规则仍然适用。这意味着在该共享账户下运行的构建不再拥有隔离的缓存，并有共享非预期产物的风险。为避免这一点，建议不要在共享用户下为生产构建恢复缓存，并指定专门的作业只保存干净的新缓存。

### 用于创建缓存的指定作业

你可以把作业配置为只保存缓存、不恢复缓存，从而发布干净的新缓存。

**为生产构建禁用缓存恢复：**

你可以通过配置这些环境变量，为特定构建 profile 禁用缓存恢复：

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "EAS_RESTORE_CACHE": "0",
        "EAS_SAVE_CACHE": "1"
      }
    },
    "preview": {
      "env": {
        "EAS_USE_CACHE": "1"
      }
    }
  }
}
```

**只从指定作业保存缓存：**

为确保只有可信来源发布缓存，你可以把工作流配置为只从 main 分支上的特定作业保存缓存。

```yaml .eas/workflows/build.yml
jobs:
  build_production:
    type: build
    if: ${{ github.ref_name == 'main' }}
    env:
      EAS_RESTORE_CACHE: '0'
      EAS_SAVE_CACHE: '1'
    params:
      platform: android
      profile: production
```

:::note
把 `EAS_SAVE_CACHE: '1'` 并不会让保存缓存只属于这个作业，其他设置了相同环境变量的作业仍然可以保存并覆盖缓存。
:::

## iOS 依赖

EAS Build 从缓存服务器提供大多数 CocoaPods 产物。这提高了 `pod install` 耗时的一致性，并通常能提高速度。如果你提供自己的 **.netrc** 或 **.curlrc** 文件，缓存会自动被绕过。

要禁用 CocoaPods 缓存服务器，在 **eas.json** 中把环境变量 `EAS_BUILD_DISABLE_COCOAPODS_CACHE` 设为 `"1"`。如果你使用 EAS Workflows，请改为在作业的 [`env`](/eas/workflows/syntax#jobsjob_idenv) 中设置。

```json eas.json
{
  "build": {
    "production": {
      "env": {
        "EAS_BUILD_DISABLE_COCOAPODS_CACHE": "1"
      }
    }
  }
}
```

使用[预构建](/more/glossary-of-terms#prebuild)在[构建时远程](/build-reference/ios-builds)生成 **ios** 目录时，通常不会把项目的 **Podfile.lock** 提交到版本控制。缓存 **Podfile.lock** 有助于获得确定性构建，但代价是：因为你在本地开发时不使用该锁文件，判断何时需要变更以及更新特定依赖的能力会受限。如果缓存该文件，你偶尔可能会遇到需要清除缓存的构建错误。要缓存 **Podfile.lock**，把 **./ios/Podfile.lock** 加入 **eas.json** 构建 profile 的 `cache.paths` 列表。

```json eas.json
{
  "build": {
    "production": {
      "cache": {
        "paths": ["./ios/Podfile.lock"]
      }
    }
  }
}
```
