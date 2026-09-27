---
title: 存储数据
description: 了解在 Expo 项目中可用于存储数据的各种库。
---

# 存储数据

存储数据对应用功能来说可能至关重要。在 Expo 项目中有多种保存数据的方式，选择哪种取决于数据类型与应用的安全需求。下面列出的库可以帮助你挑选合适的方案。

## Expo SecureStore

`expo-secure-store` 在设备本地加密并安全地存储键值对。它面向小体量数据："令牌、密钥与其他机密"。

[Expo SecureStore API 参考](/versions/latest/sdk/securestore) —— 安装与用法文档。

## Expo FileSystem

`expo-file-system` 提供对设备本地文件系统的访问。在 Expo Go 中，每个项目有自己独立的文件系统，无法访问其他 Expo 项目的文件。它仍然可以把其他项目共享的内容保存到本地文件系统，也可以把本地文件共享出去；它还支持通过网络 URL 上传/下载。

[Expo FileSystem API 参考](/versions/latest/sdk/filesystem)。

## Expo SQLite

`expo-sqlite` 让应用可以访问一个通过"类 WebSQL API"查询的数据库。数据库在应用重启后仍然存在。用例包括：导入现有数据库、打开数据库、创建表、插入条目、查询并显示结果，以及使用预处理语句。

[Expo SQLite API 参考](/versions/latest/sdk/sqlite)。

## Async Storage

Async Storage 是"React Native 应用的异步、未加密、持久化键值存储"。它的 API 简单，适合存储少量数据，以及无需加密的数据，例如"用户偏好或应用状态"。

- [Async Storage 安装](https://react-native-async-storage.github.io/2.0/Installation/#install)
- [Async Storage 用法文档](https://react-native-async-storage.github.io/2.0/Usage/)

## 其他库

还有其他用于不同目的的数据存储库 —— 例如，不需要加密、或想要比 Async Storage 更快的方案。Expo 推荐使用 [React Native directory 的存储类目搜索](https://reactnative.directory/?search=storage)。
