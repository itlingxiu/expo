---
title: Expo Image 集成
description: 通过为 EAS Observe 启用 Expo Image 集成，检测生产应用中过大的图像。
---

# Expo Image 集成

[`expo-image`](/versions/latest/sdk/image) 附带一个可选的 EAS Observe 集成，用于报告以远大于设备屏幕可显示尺寸解码的图像。过大的图像会浪费带宽和内存，却不会提高视觉质量。该集成为每一张这样的图像记录一个 `expo-image.oversized` 事件，因此你可以在生产环境中找到它们，而不必手动审计每个屏幕。

## 前置条件

- **Expo SDK 57 或更高版本**

  该集成在 `expo-image` 57.0.2 及更高版本中可用。

- **已经使用 EAS Observe 的应用**

  按照[开始使用](/eas/observe/get-started)安装 `expo-observe` 并创建第一次构建。如果没有安装 `expo-observe`，该集成会静默地不执行任何操作。

- **应用中已安装 Expo Image**

  该集成观察通过 [`expo-image`](/versions/latest/sdk/image) 加载的图像。用其他库加载的图像不会被报告。

## 启用集成

在模块作用域、应用挂载之前，用 `expo-image` 集成标志调用一次 `Observe.configure()`：

```tsx src/app/_layout.tsx
import { Observe } from 'expo-observe';

Observe.configure({
  integrations: { 'expo-image': true },
});
```

不需要其他设置。启用后，该集成会自动观察每一次图像加载。

## 工作原理

在每次图像加载时，集成会把图像的解码像素尺寸与设备屏幕上的物理像素数进行比较。当解码面积超过屏幕像素数的幅度大于所配置的阈值时，集成会以 `warn` 严重程度记录一个 `expo-image.oversized` 事件。

对于用 `<Image>` 组件渲染的图像，集成看到的解码尺寸在平台之间有所不同：

- 在 Android 上，`<Image>` 组件会在解码时把图像缩小到组件的尺寸，因此显示在小组件中的大图源通常不会被报告。
- 在 iOS 上，集成报告的是 `expo-image` 为渲染而缩小之前的源解码尺寸，因此显示在小组件中的大图源仍会被报告，即使启用了 `allowDownscaling`。

用 `useImage` 钩子或 `Image.loadAsync` 加载的图像，在两个平台上默认都以源的完整尺寸解码。你可以用 `maxWidth` 和 `maxHeight` 加载选项限制解码尺寸。这会使报告的图像尺寸在各平台之间保持一致。

每个图像 URL 在每个应用会话中最多报告一次。去重使用经过清理的 URL，因此在默认配置下，只在查询参数上有差异的同一图像变体（例如轮换的签名 URL）只会产生一个事件。

**事件属性：**

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `url` | `string` | 过大图像经过清理的 URL。 |
| `urlSanitized` | `boolean` | 清理是否移除了 URL 的一部分（查询字符串、片段或凭据）。 |
| `imageWidth` | `number` | 解码后的图像宽度，单位为像素。 |
| `imageHeight` | `number` | 解码后的图像高度，单位为像素。 |
| `screenWidth` | `number` | 屏幕宽度，单位为点。 |
| `screenHeight` | `number` | 屏幕高度，单位为点。 |
| `pixelRatio` | `number` | 用于计算屏幕物理像素数的设备像素比。 |

事件会被发送到设备之外，因此集成在报告之前会清理图像 URL：

- 默认会移除查询字符串和片段，因为查询参数常常携带签名令牌或 API 密钥等敏感值。设置 [`includeUrlParams`](#配置) 选项可改为报告完整 URL。
- 无论 `includeUrlParams` 如何，基本认证凭据始终会被移除。
- 只报告 `http(s)`、`file` 和 `android.resource` URL。其他 scheme，例如 `data:` 或 `ph://`，携带图像载荷或稳定的个人照片标识符，因此它们永远不会离开设备。

`urlSanitized` 属性告诉你清理是否改变了所报告的 URL。URL 以规范化（WHATWG）形式报告，仅规范化本身不算作更改。

## 配置

传入配置对象而不是 `true`，以调整何时报告图像：

```tsx src/app/_layout.tsx
import { Observe } from 'expo-observe';

Observe.configure({
  integrations: {
    'expo-image': {
      oversizeThreshold: 2,
    },
  },
});
```

- `oversizeThreshold`：当图像的解码像素面积超过屏幕物理像素数的倍数大于此因子时，就会报告该图像。默认值是 `1.5`，这为全屏图像留出了 50% 的余量。
- `includeUrlParams`：所报告的事件是否包含图像 URL 的查询字符串和片段。默认值是 `false`：URL 在离开设备之前会在它们处被截断，因为查询参数常常携带签名令牌或 API 密钥等敏感值。仅当你的图像 URL 完整发送到设备之外是安全的时，才启用此项。无论此设置如何，基本认证凭据始终会被移除。

## 修复过大的图像

- 以接近其显示尺寸的大小提供图像，例如从图像 CDN 请求调整过尺寸的变体。
- 用 [`useImage`](/versions/latest/sdk/image#useimagesource-options-dependencies) 钩子加载图像时，设置 `maxWidth` 和 `maxHeight` 加载选项，以便在解码时缩小图像，同时保持其宽高比。

## 查看事件

在仪表盘中：打开你的项目，前往 [**Observe > Events**](https://expo.dev/accounts/[account]/projects/[project]/observe/events)，并选择 `expo-image.oversized` 事件，以查看带有属性和会话的各个报告。

从 CLI：

```sh
# 显示过大图像事件
eas observe:events expo-image.oversized
```

所有事件共有的命名、严重程度和属性细节，见[用户定义的事件](/eas/observe/events)。
