---
title: 估算带宽用量
description: 了解如何估算 EAS Update 的带宽用量。
---

# 估算带宽用量

## 理解更新的带宽用量

EAS Update 让应用可以通过 OTA 更新自己的非原生部分（例如 JavaScript、样式和图片）。本指南说明带宽如何被消耗，以及如何优化消耗。

## 带宽计算拆解

每个订阅方案除了每月活跃用户（MAU）配额外，还包含每个月度计费周期预定义的带宽配额（[进一步了解 MAU 如何计算](/eas-update/introduction#每月活跃用户是如何计数的)）。超出标准配额的 MAU 按[基于用量的价格](https://expo.dev/pricing#update)计费，并且每增加一个这样的 MAU，会在标准带宽配额上再增加 40 MiB。这段带宽决定了在开始收取额外带宽费用之前，用户可以下载多少次更新。

估算每次更新的带宽用量：

- **更新大小：** 带宽消耗的关键因素是设备上尚不存在的更新资源的大小。如果更新只修改了应用的 JavaScript 部分，用户只会下载新的 JavaScript。举例来说，假设导出时生成的未压缩 JavaScript 部分为 **10 MB**。压缩会进一步减小其体积。
- **压缩比：** 压缩程度取决于文件类型。JavaScript 和 Hermes 字节码（React Native 应用中常用）可以压缩，而图片和图标不会自动压缩。在上面的例子中，Hermes 字节码 bundle 估计可以达到 **2.6 倍压缩比**，实际下载大小降为：

  ```text
  10 MB / 2.6 ≈ 3.85 MB update bandwidth size
  ```

给定带宽配额后，我们可以估算在开始收取额外带宽费用之前，一个计费月内可以下载多少次更新。例如，如果你在 production 方案上有 60,000 个 MAU，其中包含 50,0000 个 MAU 以及**每月 1 TiB（1,024 GiB）带宽**。通过基于用量的定价额外购买的 10,000 个 MAU，每个 MAU 再获得 **40 MiB 带宽**。可下载的更新总数为：

```text
(1,024 GiB × 1,024 MiB/GiB) + (10,000 MAU × 40 MiB/MAU) = 1,448,576 MiB per month
1,448,576 MiB / 3.85 MiB ≈ 376,254 updates
```

## 测量实际更新大小

先用以下命令生成未压缩的生产 bundle：

:::tabs
:::tab npm
```sh
$ npx expo export
```
:::
:::tab yarn
```sh
$ yarn expo export
```
:::
:::tab pnpm
```sh
$ pnpm expo export
```
:::
:::tab bun
```sh
$ bun expo export
```
:::
:::

然后查看 **dist/\_expo/static/js** 目录。其中会有 **android** 和 **ios** 目录，每个目录里有一个 **.hbc** 文件。**.hbc** 文件的大小就是 Hermes bundle 的未压缩大小。请注意，如果你使用了平台特定的代码文件，Android 和 iOS 的 bundle 大小可能不同。

这些文件的长文件名包含哈希。在本例中，把你要分析的文件重命名为 **bundle.hbc**。

要确定 Hermes bundle 的实际压缩大小（也就是应用用户下载时的大小），运行以下命令：

```sh
$ brotli -5 -k bundle.hbc
$ gzip -9 -k bundle.hbc
$ ls -lh bundle.hbc.br bundle.hbc.gz
```

这会生成 Hermes bundle 的 **Brotli 与 Gzip 压缩**版本（**bundle.hbc.br** 和 **bundle.hbc.gz**）并显示它们的大小。你可以据此根据应用真实的更新大小细化带宽计算。

## 估算 bundle 差异补丁大小

如果项目使用 [bundle 差异](/eas-update/bundle-diffing)，大多数用户下载的是补丁而不是完整 bundle。补丁只包含设备上已有 bundle 与新 bundle 之间的差异，因此通常比完整更新小得多。把 bundle 差异的影响考虑进去，可以得到更贴近实际的带宽用量估算。

EAS Update 使用 [bsdiff 算法](https://en.wikipedia.org/wiki/Bsdiff)生成补丁。你可以在本地运行同一算法来比较自己的两个 bundle。首先安装 bsdiff：

```sh
$ brew install bsdiff
```

接下来导出应用两次：一次是用户当前运行的版本，一次带上你的新改动。每次导出都运行 `npx expo export`，在 **dist** 文件夹中生成 bundle。把两个 **.hbc** 文件重命名为 **old.hbc** 和 **new.hbc**。

然后生成补丁并查看其大小：

```sh
$ bsdiff old.hbc new.hbc patch.bin
$ ls -lh patch.bin
```

**patch.bin** 的大小大约就是从旧 bundle 转到新 bundle 的用户的下载大小。补丁已经压缩过，因此不需要再计入压缩算法。

每个补丁都不同。试一系列较小和较大的代码变更，看看 bundle 差异对你自己的应用有什么影响。

在正常情况下，大多数用户下载的是补丁而不是完整 bundle，但在某些情况下 EAS Update 可能会回退为提供完整 bundle（参见[当前限制](/eas-update/bundle-diffing#当前限制)）。bundle 差异的实际影响也取决于是否为嵌入式 bundle 启用了差异。

## 影响带宽消耗的因素

实际带宽用量会因以下因素而变化：

- **用户行为：** 理论计算假设每个用户都下载每一次更新。但许多用户只在重新打开应用时获取更新，常常会跳过中间的更新。因此实际带宽用量通常远低于理论最大值。
- **缺失的资源：** 如果更新包含字体和图片等资源，而这些资源既不在构建中、也没有在先前下载的更新里，它们也需要被下载。

## 优化带宽用量

1. **先监控用量：** 管理带宽最简单的方式是跟踪你的[用量指标](https://expo.dev/accounts/[account]/settings/usage)，找出异常峰值或低效之处。
2. **优化资源大小：** 用[这篇指南](/eas-update/optimize-assets)减小资源体积。
3. **需要时排除资源：** 使用[资源选择](/eas-update/asset-selection)减少每次更新包含的资源数量。这是高级优化，应先尝试其他方法。
