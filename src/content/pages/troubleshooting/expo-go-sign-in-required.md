---
title: “You need to be signed in to Expo Go and Expo CLI”错误
description: 了解为什么在 iOS 真机上使用 Expo Go 时，Expo CLI 与 Expo Go 必须登录同一个 Expo 账户。
---

# “You need to be signed in to Expo Go and Expo CLI”错误

当 Expo CLI 和 Expo Go 都未登录时，Expo Go 会在 iOS 真机上显示以下错误：

```text
You need to be signed in to Expo Go and Expo CLI to open your project. Run "npx expo login" on your computer to sign in with Expo CLI.
```

当其中一侧已登录而另一侧未登录，或两个账户不一致时，你会看到以下错误之一：

```text
You're signed in to Expo Go as "your-account", but not signed in to Expo CLI. Run "npx expo login" on your computer to sign in to Expo CLI as "your-account" so you can open this project.

You're signed in to Expo CLI as "your-account", but not signed in to Expo Go. Sign in to Expo Go as "your-account" to open this project.

You're signed in to Expo CLI as "your-account" and to Expo Go as "another-account" — these accounts need to match to open this project.
```

Expo CLI 不会报告这些情况。开发服务器会继续运行，终端中没有任何警告，因此错误只会出现在设备上。

## 为什么会出现这种情况

在 iOS 真机上，Expo Go 会在打开项目之前检查 Expo 账户。Expo CLI 与 Expo Go 必须登录同一个 Expo 账户。

这项检查仅适用于 iOS 真机，并且仅适用于由开发服务器提供的项目。Android 设备、Android 模拟器、iOS 模拟器以及已发布的更新都不受影响。

## 登录同一个账户

如果还没有 Expo 账户，可以在 [expo.dev/signup](https://expo.dev/signup) 免费创建一个。

在电脑上登录 Expo CLI：

```sh
$ npx expo login
```

然后在设备上打开 Expo Go，点击右上角的账户图标，使用同一个账户登录。

要查看 Expo CLI 当前使用的账户，请运行：

```sh
$ npx expo whoami
```

## 重新加载项目

在 Expo Go 的错误界面上点击 **Try Again**。每次 Expo Go 请求项目时，Expo CLI 都会读取你的凭据，因此在开发服务器运行期间登录即可。

如果登录的是另一个账户，请重启开发服务器。Expo CLI 会在进程的整个生命周期内缓存已解析的账户。
