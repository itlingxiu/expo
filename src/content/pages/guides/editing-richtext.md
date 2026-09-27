---
title: 编辑富文本
description: 了解在 React Native 中预览与编辑富文本的现有方法。
---

# 编辑富文本

许多应用需要允许用户输入文字。例如，如果要做消息或社交媒体应用，很可能会大量依赖文本输入。React Native 内置了 `<TextInput>` 组件，在许多简单场景下不必费太多力气就能实现这一点。

不过，有时你需要更灵活。想想长篇社交媒体帖子、笔记应用或文档编辑器。理想情况下，你需要允许不同的文本样式、列表、标题、嵌入图片等。这称为富文本编辑器，在任何地方（包括 React Native）都是一个难解的问题。

React Native 生态目前没有默认方案。本指南探讨可用方法及其取舍。对大多数应用，请从 Software Mansion 的原生编辑器开始：输出 markdown 用 [`react-native-enriched-markdown`](https://github.com/software-mansion/enriched-markdown)，输出 HTML 用 [`react-native-enriched-html`](https://github.com/software-mansion/react-native-enriched-html)。

- [观看：如何用 DOM 组件实现富文本编辑器](https://www.youtube.com/watch?v=CxORa1tXMjw) —— 在 React Native 中用 Expo DOM 组件构建富文本编辑器，在原生应用内渲染基于 Web 的编辑器。

## 渲染富文本

显示富文本有很多不错的选择：

- 对于 markdown 内容，可以使用 [`react-native-enriched-markdown`](https://github.com/software-mansion/enriched-markdown) 等 markdown 渲染器。

- 对于 HTML 内容，可以使用 [`@expo/html-elements`](https://www.npmjs.com/package/@expo/html-elements) 或 webview（[`react-native-webview`](/versions/latest/sdk/webview)）。

- 若要自定义格式并获得更多控制，可以利用嵌套 `<Text>` 组件来渲染样式和布局。

  ```jsx
  <TextInput>
    <Text>
      <Text style={{ fontWeight: 900 }}>Some bold text</Text>Some regular text
    </Text>
  </TextInput>
  ```

- 也可以使用 [Expo Modules API](/modules/overview)，借助第三方库编写自定义渲染组件，使用原生平台原语，例如 Android 上的 [Markwon](https://github.com/noties/Markwon) 和 iOS 上的 `AttributedString`。

## 编辑富文本的方法

让富文本渲染工作起来有几种方法。不过，它们的限制各不相同。

### 原生编辑器

原生编辑器使用平台的文本 API 渲染和编辑文字，而不是 webview。它提供原生性能，以及与应用其余部分一致的文本行为。Software Mansion 维护两个采用这种方法的库：

- [`react-native-enriched-markdown`](https://github.com/software-mansion/enriched-markdown) 在 Android、iOS、macOS 和 Web 上以 markdown 输出编辑富文本。它还为 Android（Kotlin）和 iOS（Swift）提供独立的原生 SDK。
- [`react-native-enriched-html`](https://github.com/software-mansion/react-native-enriched-html) 在 Android、iOS 和 Web 上提供以 HTML 输出的原生输入与显示组件。它需要[新架构](/guides/new-architecture)。

[`react-native-live-markdown`](https://github.com/Expensify/react-native-live-markdown) 是另一个原生选项。它是 `<TextInput>` 的直接替代，会在每次按键时对 markdown 应用实时格式化。

也可以用 [Expo Modules API](/modules/overview) 封装任何原生富文本编辑器，但如果各平台使用不同的编辑器，就需要统一它们的 API 和输入格式。

> 富文本通常用[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)表示。例如，项目符号列表可以是类型为 `bulleted-list` 的节点，带有若干类型为 `list-item` 的子节点。你可以把 HTML 和 markdown 都转换成合适的 AST 格式。

还有一项工作是把 lexical 编辑器移植到 Android 和 iOS，并提供 React Native 封装。要跟踪进展，参见 [lexical 关于 React Native 支持的讨论](https://github.com/facebook/lexical/discussions/2410)。

### 基于 Webview 的编辑器

大多数 React Native UI 组件封装原生平台原语，因此快速、高性能，并且有**原生手感**。基于 webview 的富文本编辑器则采用不同方法。

它们在 [`react-native-webview`](/versions/latest/sdk/webview) 内封装一个用 JavaScript 为 Web 构建的现有富文本编辑器。它在所有平台（Android、iOS、Web）上都能工作，并能利用 Web 平台上流行的富文本编辑器，但会有性能和体验上的代价。

你无法在编辑器内部使用原生 UI 组件。提及或图片嵌入等功能的任何实现都会重复功能，并且需要大量工作才能实现。

### 现有的基于 Webview 的 React Native 库

若要现成的基于 webview 的编辑器，使用 [`@10play/tentap-editor`](https://github.com/10play/10tap-editor)。当你需要配置有限的基础富文本编辑器，并且没有严格的性能或体验要求时，它很合适。

### 自定义的基于 Webview 的编辑器

如果需要更多可配置性，可以用现有的仅 Web 编辑器构建类似的库。不过，你必须自己处理消息传递和 Web 实现。这让你获得底层编辑器提供的全部选项，并允许实现更多功能。

- [Quill](https://quilljs.com/)
- [lexical](https://github.com/facebook/lexical)
- [slate](https://github.com/ianstormtaylor/slate)

你需要用消息传递在 webview 与外部之间传递文本和 `onChange` 事件。由于富文本往往很长，最好把它建模为非受控组件，以避免每次按键都产生延迟。另外，如果能避免在每次按键时序列化并发送整个状态，也会改善性能。

## 在 React Native TextInput 之上构建

本节讨论：是否有可能做出功能完整、面向通用用途的富文本输入。

React Native 允许嵌套 `<Text>` 组件，并允许把它们用作 `<TextInput>` 的子元素来渲染和编辑带样式的文本。在新的 React Native 架构下它是同步的（`onChange` 事件在新字符输入文本框后立即触发）。

遗憾的是，`<TextInput>` 组件是为处理普通文本而构建的，它的 `onTextChange` 回调只返回字符串。这是一个重大限制。

下面是一个简短示例。先渲染带有以下粗体文本的文本输入：

```jsx
<TextInput>
  <Text>
    {/* 下面会按此格式渲染粗体文本：**aa**aa */}
    <Text style={{ fontWeight: 900 }}>aa</Text>aa
  </Text>
</TextInput>
```

然后，向文本输入追加第五个字母 `a`。光标位置应决定新字母是否属于粗体字符串。遗憾的是，回调只返回 `aaaaa`。

还有一个 `onSelectionChange` 属性可以用来获取该信息。不过，这会让任务困难得多。插入额外字符（例如列表或项目符号的换行）也会使选区不同步。

有一些尝试构建这种编辑器，例如 [`markdown-editor`](https://github.com/shakogegia/markdown-editor)（已不再积极维护）和 [`rn-text-editor`](https://github.com/amjadbouhouch/rn-text-editor)（处于 beta），但没有被广泛使用的包。

## 显示样式标记的 Markdown 编辑器

如果用 markdown 为文本设置样式就能满足需求，可以在编辑时把 markdown 渲染到一个单独的、不可编辑的视图中。用任何 markdown 渲染器自己构建并不复杂。

这种编辑体验适合高级用户或编程/技术类应用。你也可以探索在显示富文本的同时，只在选中的文本片段中显示 markdown，或其他混合方法。

## 小结

虽然显示富文本有很多选择，但 React Native 中的富文本编辑没有万能方案。对大多数应用，请从 Software Mansion 的[原生编辑器](#原生编辑器)之一开始。

当你需要只有 Web 编辑器才提供的功能时，选择基于 webview 的编辑器。只有在需求很小时才在 React Native 原语之上构建，因为你必须自己处理选区和格式化。
