---
title: 使用 Expo 的本地优先架构
description: 介绍新兴的本地优先软件运动，并附上相关学习资源与工具的链接。
---

# 使用 Expo 的本地优先架构

:::note
本指南仍在完善中。如果你有任何反馈，请在我们的 GitHub 仓库中[提交 issue](https://github.com/expo/expo/issues/new/choose)。
:::

“本地优先”一词最早出现在研究实验室 [Ink & Switch](https://www.inkandswitch.com/) 撰写的论文 [《Local-first software》](https://www.inkandswitch.com/local-first/)中，但其背后的想法已经存在很久。它是一些我们喜欢的应用所使用的架构，例如 [Linear](https://linear.app/)、[Superhuman](https://superhuman.com/)、[Excalidraw](https://excalidraw.com/)，甚至 [Apple Notes](<https://en.wikipedia.org/wiki/Notes_(Apple)>)。

在本地优先软件中，“另一台计算机是否可用，永远不应妨碍你工作”（[Martin Kleppmann](https://www.youtube.com/watch?v=NMq0vncHJvU)）。离线时，你仍然可以直接从设备上的数据库读取和写入。你可以信任软件在离线时工作，并且知道联网后数据会无缝同步，并在运行该应用的任何设备上可用。在线时，这种架构很适合“多人”应用，[正如 Figma 所推广的那样](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)。

要更深入了解本地优先是什么以及它如何工作，请参考下面的[更多资源](#更多资源)。

## 为什么使用本地优先架构？

### 用户体验方面的好处

本地优先软件感觉**快**，因为交互不再受网络束缚，你可以直接从设备上的数据库读取和写入。

你可以信任软件在离线时工作，并且知道联网后数据会无缝同步，并在运行该应用的任何设备上可用。

本地优先软件的另一个特点是协作 —— 多台设备可以处理同一份数据，更改会在所有设备之间同步。这可以实时发生，例如在 [Figma](https://www.figma.com/) 中协作设计；也可以异步发生，例如在 Linear 中离线创建任务，再次上线时完成同步。

### 开发者体验方面的好处

你不再需要为每个网络请求管理应用的各种状态 —— “已加载”、“加载中”、“错误”等等，以及对应的 UI 状态和其他逻辑。写入本地数据库，应用会自动把更改同步到服务器。这意味着你可以专注于构建应用，而不必那么担心网络和离线状态。

本地优先架构并不会消除每一个依赖网络的状态。有些操作（例如发送邮件）只有在远程服务接受后才算完成。先把这些操作写入本地数据库，再跟踪它们的状态，例如“已排队”、“发送中”、“已接受”和“失败”。

服务器可用性可能仍然重要，但在故障期间用户仍能访问应用并继续工作。你甚至可以提供一种不经过自己服务器来同步数据的机制。

## 构建本地优先应用的挑战

今天可用的工具仍处于早期阶段，因此你可能会发现自己在解决一些本以为现有工具已经解决的问题。例如，你可能需要实现自定义同步层，或者弄清楚如何处理多个用户操作同一份数据时的权限。随着生态演进，我们预期构建本地优先应用会变得更容易。如果你还没准备好成为早期采用者，以及随之而来的一切，可能希望等工具成熟后再用本地优先工具开始构建应用。

## 构建本地优先应用的工具

[“Local-first software”社区网站](https://localfirstweb.dev/)上有一份全面的工具列表。下面是一份较短的列表，列出我们在 Expo 有直接使用经验的工具。

思考本地优先工具的一种方式，是按以下类别分组：持久化、状态管理和同步。如果某个工具处理问题的多个方面，它会落入多个类别。同步还可以进一步细分为可同步的数据结构和传输层。

### Legend-State

[Legend-State](https://legendapp.com/open-source/state/v3/) 是一个极快的一体化状态与同步库，让你用更少的代码做出更快的应用。它的主要目标如下：

- 为 React 应用提供更快的状态管理
- 细粒度响应性，以尽量减少渲染
- 强大的同步与持久化（内置 Supabase 支持）

它可与 Expo 和 React Native 配合（通过 [`react-native-async-storage`](https://github.com/react-native-async-storage/async-storage?tab=readme-ov-file#react-native-async-storage)）。这使它非常适合构建本地优先的移动和 Web 应用。使用 [Legend-State Supabase 示例](https://github.com/expo/examples/tree/master/with-legend-state-supabase)开始：

```sh
npx create-expo-app --example with-legend-state-supabase
```

### TinyBase

[TinyBase](https://tinybase.org/) 自称“本地优先应用的响应式数据存储”。它是一个状态管理库，可接入许多最流行的同步与持久化层，例如 [Yjs](#yjs) 和 [SQLite](#sqlite)。对于需要持久化并同步数据的本地优先应用，它是很好的选择。使用 [TinyBase 示例](https://github.com/expo/examples/tree/master/with-tinybase)开始：

```sh
npx create-expo-app --example with-tinybase
```

TinyBase 与 Expo Go 无缝配合，让你可以快速开发。在 Android 和 iOS 上，它使用 [`expo-sqlite`](/versions/latest/sdk/sqlite) 库持久化数据。在 Web 上，它依赖 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API。[Beto Moedano](https://github.com/betomoedano) 在下面的视频中演示如何构建一个[通用的本地优先购物清单应用](https://github.com/betomoedano/groceries-shopping-list-app)：

- [观看：用 Expo 和 TinyBase 构建本地优先的实时购物清单应用](https://www.youtube.com/watch?v=HqOiB2tDM8Q) —— 使用 TinyBase，以 expo-sqlite 做持久化并自动同步，构建实时购物清单应用。

### SQLite

[Expo SQLite](/versions/latest/sdk/sqlite) 是一个 SQLite 库，非常适合作为本地优先应用的持久化方案。你可以在 SQLite 前面使用不同的状态管理与同步层，例如用 [`y-expo-sqlite`](https://github.com/brentvatne/y-expo-sqlite) 持久化 [Yjs](#yjs) 文档，用 [TinyBase](#tinybase) 作为状态管理层。使用 SQLite 很灵活，但你需要把它与其他工具组合，或自己构建工具，才能得到完整的本地优先方案。更多信息见 [Expo SQLite API 参考](/versions/latest/sdk/sqlite)。

### Yjs

[Yjs](https://github.com/yjs/yjs) 是一种 [CRDT 实现](https://github.com/yjs/yjs?tab=readme-ov-file#yjs-crdt-algorithm)，提供可在多个客户端之间同步的数据类型。用 Yjs 构建应用并处理希望能够同步的数据时，你会用 `Y.Array` 和 `Y.Map` 表示数据，而不是 `Array` 和 `Object`。你可以在 Yjs 之上使用 [TinyBase](#tinybase) 之类的库做状态管理，持久化则可以由多种工具处理，从文件系统上的 JSON 文件到完整的数据库（例如 [`y-expo-sqlite`](https://github.com/brentvatne/y-expo-sqlite)），以及介于两者之间的一切。更多信息见 [Yjs 的 GitHub 仓库](https://github.com/yjs/yjs)。

### Prisma

[Prisma](https://prisma.io) 作为 Node.js 和 TypeScript 后端最流行的 ORM 而广为人知，现在也以[抢先体验](https://www.prisma.io/blog/bringing-prisma-orm-to-react-native-and-expo)形式可用于 Expo 和 React Native。Prisma 旨在提供完整的本地优先方案，状态管理、同步和持久化都为你覆盖。虽然仍处于早期，[Beto Moedano](https://github.com/betomoedano) 整理了一份用 Prisma 与 Expo 构建本地优先 Notion 克隆的完整演练，[在 GitHub 上查看代码](https://github.com/betomoedano/React-Native-Notion-Clone)。

- [观看：用 React Native Expo 和 Prisma 构建本地优先的 Notion 克隆](https://www.youtube.com/watch?v=uTrPte0sCiw) —— 用面向 Expo 的 Prisma ORM 构建本地优先的 Notion 克隆，涵盖状态管理、同步和持久化。

### Jazz

[Jazz](https://jazz.tools/) 是带实时同步、离线支持和行级权限的本地优先关系数据库。它是开源的，为 Expo 和 React Native 提供一流支持，你可以[自行托管](https://jazz.tools/docs/getting-started/server-setup)以便快速开始。要了解更多，查看[示例](https://github.com/garden-co/jazz/tree/main/examples)，或参见[入门指南](https://jazz.tools/docs/install/client)获取详细说明。

### LiveStore

[LiveStore](https://docs.livestore.dev/getting-started/expo/) 是面向高性能应用、以客户端为中心的本地优先数据层。它为 Expo 提供一流支持，是构建本地优先应用的好选择。参见博客文章 [LiveStore：面向本地优先应用的基于 SQLite 的数据层](https://expo.dev/blog/local-first-application-development-with-livestore)。

- [观看：如何用 LiveStore 和 Expo 构建本地优先的原生应用](https://www.youtube.com/watch?v=zQIhJqYU1Qw) —— 使用 LiveStore 基于 SQLite 的数据层，用 Expo 构建高性能的本地优先应用。

### Turso

[Turso](https://turso.tech) 是构建在 SQLite 之上的现代数据库服务。它现在支持 [Offline Sync](https://turso.tech/blog/turso-offline-sync-public-beta)，从而实现真正的本地优先体验。你可以在本地与远程源之间同步数据库，支持双向同步和内置冲突检测。虽然自动冲突解决尚不可用，这一特性仍是一大步。你今天就可以把 Turso 与 [expo-sqlite](/versions/latest/sdk/sqlite) 一起使用。要了解更多，阅读 [Turso：Offline Sync 公开测试](https://turso.tech/blog/turso-offline-sync-public-beta)博客文章。集成示例见 [Notes App](https://github.com/betomoedano/notes-app)。

- [观看：如何用 Turso 和 Expo 构建本地优先的笔记应用](https://www.youtube.com/watch?v=SBv32tmyb3k) —— 用 Turso 的离线同步和 expo-sqlite 构建本地优先笔记应用，实现双向数据同步。

### Instant

[Instant](https://www.instantdb.com/) 是 Firebase 的现代替代方案。它为你提供实时数据库，让你可以专注于构建应用前端。要开始，查看[入门指南](https://www.instantdb.com/docs/start-rn)。你也可以探索下面视频中的 [Sketch App](https://github.com/betomoedano/sketch-app)。

- [观看：用 Expo、Instant 和 Reanimated 构建本地优先的素描应用](https://www.youtube.com/watch?v=DEJIcaGN3vY) —— 用 Instant 的实时数据库和 Reanimated 构建协作素描应用，实现流畅的绘制交互。

### RxDB

[RxDB](https://rxdb.info/)（Reactive Database）是面向 JavaScript 应用的本地优先 NoSQL 数据库。它具有深度响应性，允许你订阅查询结果，从而在数据变化时自动更新 UI。RxDB 专注于离线优先能力，以构建即使没有互联网也能工作、重新上线后再同步的应用。RxDB 通过 [SQLite 存储适配器](https://rxdb.info/rx-storage-sqlite.html#usage-with-expo-sqlite)与 Expo 配合，该适配器封装了 [`expo-sqlite`](/versions/latest/sdk/sqlite)。它还提供多种复制插件，以便与现有后端同步，无论是 HTTP、GraphQL、Supabase 还是自定义后端。

### 其他工具

下面这份远非全面的列表，提供了引起我们注意、你可能会觉得值得探索的其他工具。更完整的工具列表见 [“Local-first software”社区网站](https://localfirstweb.dev/)。

- [Automerge](https://automerge.org/)
- [ElectricSQL](https://electric-sql.com/)
- [PowerSync](https://www.powersync.com/)

## 更多资源

- Martin Kleppmann 的 [《The past, present, and future of local-first》](https://www.youtube.com/watch?v=NMq0vncHJvU)
- Ink & Switch 的 [《Local-first software》](https://www.inkandswitch.com/local-first/)
- [“Local-first software”社区网站](https://localfirstweb.dev/)以及 [YouTube 上的聚会播放列表](https://www.youtube.com/playlist?list=PLTbD2QA-VMnXFsLbuPGz1H-Najv9MD2-H)
- Johannes Schickling 的 [localfirst.fm 播客](https://localfirst.fm/)
