---
title: 创建应用商店素材
description: 了解如何为应用的商店页面创建截图与预览。
---

# 创建应用商店素材

向 Google Play Store 和 Apple App Store 提交应用之前，需要为商店列表页提供一些素材。这些图片和视频的目的，是让潜在用户了解应用体验大致是什么样。

两个应用商店都需要上传应用截图。尽管两边都叫“应用截图”，它们 _确实_ 必须包含应用的准确视觉呈现。并没有规定这些图片必须是在特定设备上截取的屏幕截图。

两个应用商店对图片格式和尺寸都有要求。在这些限制之内，你可以发挥创意。例如，常见做法是用 Figma 等设计工具设计素材，并把真实应用截图（或设计稿）与补充文案结合在一起。

## 创建“截图”的不同方法

创建商店截图有三种常用方法。可以选择最适合应用需求与资源的方法。

### 方案 1：真实截图

最直接的做法 —— 在真机上打开应用并截图。

**优点**：操作直接。对应用的呈现最准确。

**缺点**：需要在不同设备上加载应用，才能得到完整的截图范围。

![Expo Go 的 Apple App Store 列表页截图](/static/images/guides/expo-go-screenshots.webp)

Expo Go 的 Apple App Store 列表页截图。

### 方案 2：设计稿中的截图

大多数应用使用这种方法。它包括截取应用屏幕（有时用现有设计稿代替真实截图），并把它们连同合适的文案嵌入商店素材。

**优点：** 可以在素材中传达额外信息。

**缺点：** 需要用设计软件创建素材。

![Brex 的 Apple App Store 列表页截图](/static/images/guides/brex-screenshots.webp)

Brex 的 Apple App Store 列表页截图。

### 方案 3：做得更精致

在这种方案中，你可以在应用商店页面上融入应用设计元素和有创意的文案，以突出产品。

**优点：** 可以让商店页面有创意、有趣味。

**缺点：** 需要有经验的设计师来创建和维护素材。

![MS Office 的 Apple Store 列表页截图](/static/images/guides/office-screenshots.webp)

MS Office 的 Apple Store 列表页截图。

## Google Play Store 素材要求

Google 对商店素材的格式和尺寸有具体要求，与 Apple 不同。最新规格见[官方文档](https://support.google.com/googleplay/android-developer/answer/9866151)，其中有 Google Play Store 素材的详细要求。

- [商店素材 Figma 模板](https://www.figma.com/community/file/1352686667495694112) —— 查看我们的模板，了解最低素材要求摘要。

### 应用图标

与 Apple App Store 不同（那里的应用图标始终自动取自应用包），在 Google Play Store 上，你还必须为商店列表页单独上传一个应用图标。

### 特色图片

发布商店列表页必须提供特色图片。它是显示在商店列表页顶部的横幅。

### 截图

发布应用至少需要上传四张截图。

### 视频（可选）

可以为商店列表页添加一个预览视频。视频需要上传到 YouTube，然后在 **preview video** 字段中输入 YouTube URL 即可添加。

## iOS App Store 素材要求

对于 iOS App Store，可以上传截图（图片）和预览（视频）。每一项 Apple 都要求特定的宽度和高度。请务必参考 [Apple 的截图规格](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)以获得准确尺寸。哪怕差一个像素，也无法提交这些图片。

- [商店素材 Figma 模板](https://www.figma.com/community/file/1352686667495694112) —— 查看我们的模板，了解最低素材要求摘要。

### 截图

最低要求是，Apple 要求你为带灵动岛的 iPhone（6.9 英寸）上传截图。你可以选择为其他屏幕尺寸上传额外截图。如果没有提供特定截图，将改用从最接近的已上传尺寸缩小后的截图。

如果应用在 iPad 上运行，还必须提供一套 iPad 截图（13 英寸）。

每种本地化最多可以上传十张截图。如果应用提供多种语言，且截图包含文字，应为每种本地化上传对应语言的截图。

截图可以是竖屏或横屏。

### 预览（可选）

可以包含应用预览视频来演示应用如何工作。每种屏幕尺寸最多可以添加三个应用预览。

视频尺寸与格式的摘要见 Apple 文档中的[应用预览规格](https://developer.apple.com/help/app-store-connect/reference/app-preview-specifications/)。

## 最低要求

以下是发布应用所需的最低配置。

### Play Store - Android

| 类型 | 数量 | 尺寸 | 要求 |
| --- | --- | --- | --- |
| 应用图标 | 1 | 512 × 512 | 32 位 PNG（带 alpha）；最大文件大小：1024 KB |
| 特色图片 | 1 | 1024 × 500 | JPEG 或 24 位 PNG（无 alpha） |
| 截图 | 4-10 | 最小：1024 × 500<br/>最大宽度：3840px<br/>9:16 宽高比 | JPEG 或 24 位 PNG（无 alpha） |

### App Store - iPhone

| 类型 | 数量 | 尺寸（任选其一） | 要求 |
| --- | --- | --- | --- |
| 截图（带灵动岛的 iPhone） | 2-10 | 1320 × 2868<br/>1290 × 2796 | JPG 或 PNG（无 alpha） |

### App Store - iPad

如果应用也在 iPad 上运行，需要额外提供截图。

| 类型 | 数量 | 尺寸（任选其一） | 要求 |
| --- | --- | --- | --- |
| 截图 | 2-10 | 2064 × 2752<br/>2048 × 2732 | JPG 或 PNG（无 alpha） |
