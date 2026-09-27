---
title: MailComposer 包参考
description: 使用系统界面撰写并发送电子邮件的库。
---

# MailComposer 包参考

> 支持平台：Android、iOS*、Web、Expo Go。

`expo-mail-composer` 让你通过操作系统界面快速撰写并发送电子邮件。iOS 模拟器无法登录邮件账户，因此不能在 iOS 模拟器上使用这个模块。

<video src="/static/videos/sdk/mailcomposer.mp4" controls></video>

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-mail-composer
```
:::
:::tab yarn
```sh
yarn expo install expo-mail-composer
```
:::
:::tab pnpm
```sh
pnpm expo install expo-mail-composer
```
:::
:::tab bun
```sh
bun expo install expo-mail-composer
```
:::
:::

## API

```js
import * as MailComposer from 'expo-mail-composer';
```
