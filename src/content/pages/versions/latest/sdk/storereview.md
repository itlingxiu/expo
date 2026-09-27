---
title: StoreReview 包参考
description: 提供应用内评价原生 API 的库。
---

# StoreReview 包参考

> 支持平台：Android、iOS、Expo Go。

`expo-store-review` 提供对 Android 5+ 上 `ReviewManager` API 以及 iOS 上 `SKStoreReviewController` API 的访问。它让你可以在不离开应用的情况下请求用户为应用评分。

![iOS 上商店评价 API 实际效果的截图](/static/images/store-review.png)

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-store-review
```
:::
:::tab yarn
```sh
yarn expo install expo-store-review
```
:::
:::tab pnpm
```sh
pnpm expo install expo-store-review
```
:::
:::tab bun
```sh
bun expo install expo-store-review
```
:::
:::

## 用法

使用这个 API 时，务必遵守 iOS 的[人机界面指南](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews)和 Android 的[指南](https://developer.android.com/guide/playcore/in-app-review#when-to-request)。

**具体来说：**

- 不要从按钮调用 `StoreReview.requestReview()`，而应在用户完成应用中某项标志性交互之后再调用。
- 不要反复打扰用户。
- 不要在用户正在做时间敏感的事情（例如导航）时请求评价。
- 在展示评分按钮或卡片之前或期间，不要向用户提问。

### 撰写评价

#### Android

Android 没有等价的跳转。你仍然可以用查询参数 `showAllReviews=true` 打开 Play Store 的评价部分，如下所示：

```ts
const androidPackageName = 'host.exp.exponent';
// 在浏览器中打开 Android Play Store -> 在 Android 上会重定向到 Play Store
Linking.openURL(
  `https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`
);
// 直接打开 Android Play Store
Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
```

#### iOS

可以用查询参数 `action=write-review`，把应用用户重定向到 iOS App Store 中某个应用的**「撰写评价」**界面。例如：

```ts
const itunesItemId = 982107779;
// 在浏览器中打开 iOS App Store -> 在 iOS 上会重定向到 App Store
Linking.openURL(`https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`);
// 直接打开 iOS App Store
Linking.openURL(
  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
);
```

## API

```js
import * as StoreReview from 'expo-store-review';
```

## 错误码

### `ERR_STORE_REVIEW_FAILED`

商店评价请求未成功时会出现这个错误。
