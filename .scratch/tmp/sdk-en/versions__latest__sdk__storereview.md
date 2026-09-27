---
title: StoreReview
description: A library that provides access to native APIs for in-app reviews.
packageName: expo-store-review
---

# StoreReview

> 支持平台：Android、iOS、Expo Go。

`expo-store-review` is a library that provides access to `ReviewManager` API on Android 5+ and `SKStoreReviewController` API on iOS. It allows you to ask the user to rate your app without leaving the app itself.

![Screenshots of the store review API in action on iOS](/static/images/store-review.png)

## Installation

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

## Usage

It is important that you follow the [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews) for iOS and [Guidelines](https://developer.android.com/guide/playcore/in-app-review#when-to-request) for Android when using this API.

**Specifically:**

- Don't call `StoreReview.requestReview()` from a button - instead try calling it after the user has finished some signature interaction in the app.
- Don't spam the user.
- Don't request a review when the user is doing something time sensitive like navigating.
- Don't ask the user any questions before or while presenting the rating button or card.

### Write reviews

#### Android

There is no equivalent redirect on Android, you can still open the Play Store to the reviews sections using the query parameter `showAllReviews=true` like this:

```ts
const androidPackageName = 'host.exp.exponent';
// Open the Android Play Store in the browser -> redirects to Play Store on Android
Linking.openURL(
  `https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`
);
// Open the Android Play Store directly
Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
```

#### iOS

You can redirect an app user to the **"Write a Review"** screen for an app in the iOS App Store by using the query parameter `action=write-review`. For example:

```ts
const itunesItemId = 982107779;
// Open the iOS App Store in the browser -> redirects to App Store on iOS
Linking.openURL(`https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`);
// Open the iOS App Store directly
Linking.openURL(
  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
);
```

## API

```js
import * as StoreReview from 'expo-store-review';
```

## Error codes

### `ERR_STORE_REVIEW_FAILED`

This error occurs when the store review request was not successful.

