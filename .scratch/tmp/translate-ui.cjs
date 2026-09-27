const fs = require('fs');
const src = 'E:/个人/个人项目/expo/.scratch/tmp/sdk-en/versions__latest__sdk__ui.md';
const dest = 'E:/个人/个人项目/expo/src/content/pages/versions/latest/sdk/ui.md';
let text = fs.readFileSync(src, 'utf8');

const desc = {
  'Build native UI with the @expo/ui package: real SwiftUI on iOS and Jetpack Compose on Android.':
    '用 @expo/ui 包构建原生界面：iOS 上是真正的 SwiftUI，Android 上是 Jetpack Compose。',
  'Build beautiful, native-feeling Expo screens.': '构建美观、具有原生感觉的 Expo 界面。',
  'AlertDialog component for displaying native alert dialogs.': '用于显示原生警告对话框的 AlertDialog 组件。',
  'Badge component for displaying status indicators and counts.': '用于显示状态指示和计数的 Badge 组件。',
  'BadgedBox component for overlaying badges on content.': '用于在内容上叠加徽章的 BadgedBox 组件。',
  'BasicAlertDialog component for displaying dialogs with custom content.': '用于显示自定义内容对话框的 BasicAlertDialog 组件。',
  'Box component for stacking child elements.': '用于堆叠子元素的 Box 组件。',
  'Button components for displaying native Material3 buttons.': '用于显示原生 Material3 按钮的 Button 组件。',
  'Card component for displaying content in a styled container.': '用于在带样式的容器中显示内容的 Card 组件。',
  'Carousel components for displaying scrollable collections of items.': '用于显示可滚动项目集合的 Carousel 组件。',
  'Checkbox component for selection controls.': '用于选择控件的 Checkbox 组件。',
  'Chip components for displaying compact elements.': '用于显示紧凑元素的 Chip 组件。',
  'Column component for placing children vertically.': '用于垂直放置子组件的 Column 组件。',
  'DateTimePicker component for selecting dates and times.': '用于选择日期和时间的 DateTimePicker 组件。',
  'Divider components for creating visual separators.': '用于创建视觉分隔的 Divider 组件。',
  'DockedSearchBar component for displaying an inline search input.': '用于显示内联搜索输入的 DockedSearchBar 组件。',
  'DropdownMenu component for displaying dropdown menus.': '用于显示下拉菜单的 DropdownMenu 组件。',
  'ExposedDropdownMenuBox component for displaying a dropdown menu with a customizable anchor.':
    '用于显示带可自定义锚点的下拉菜单的 ExposedDropdownMenuBox 组件。',
  'FloatingActionButton components following Material Design 3.': '遵循 Material Design 3 的 FloatingActionButton 组件。',
  'FlowRow component for wrapping children horizontally.': '用于水平换行排列子组件的 FlowRow 组件。',
  'HorizontalFloatingToolbar component for displaying a floating action bar.': '用于显示浮动操作栏的 HorizontalFloatingToolbar 组件。',
  'HorizontalPager component for swipeable pages.': '用于可滑动页面的 HorizontalPager 组件。',
  'Host component for bridging React Native and Jetpack Compose.': '用于桥接 React Native 与 Jetpack Compose 的 Host 组件。',
  'Icon component for displaying icons.': '用于显示图标的 Icon 组件。',
  'IconButton components for displaying native Material3 icon buttons.': '用于显示原生 Material3 图标按钮的 IconButton 组件。',
  'Image component for displaying images.': '用于显示图片的 Image 组件。',
  'LazyColumn component for displaying scrollable lists.': '用于显示可滚动列表的 LazyColumn 组件。',
  'LazyRow component for displaying horizontally scrolling lists.': '用于显示水平滚动列表的 LazyRow 组件。',
  'ListItem component for displaying structured list entries.': '用于显示结构化列表项的 ListItem 组件。',
  'Loading indicator components for displaying loading state.': '用于显示加载状态的加载指示器组件。',
  'Read the Material 3 color palette (including Material 3 Dynamic Colors) from JavaScript.':
    '从 JavaScript 读取 Material 3 调色板（包括 Material 3 动态颜色）。',
  'ModalBottomSheet component that presents content from the bottom of the screen.':
    '从屏幕底部呈现内容的 ModalBottomSheet 组件。',
  'Layout modifiers for @expo/ui components.': '用于 @expo/ui 组件的布局修饰符。',
  'NavigationBar component for Material 3 bottom navigation.': '用于 Material 3 底部导航的 NavigationBar 组件。',
  'Progress indicator components for displaying operation status.': '用于显示操作状态的进度指示器组件。',
  'PullToRefreshBox component for pull-to-refresh interactions.': '用于下拉刷新交互的 PullToRefreshBox 组件。',
  'RadioButton component for single-selection controls.': '用于单选控件的 RadioButton 组件。',
  'A component that enables React Native views inside Jetpack Compose.':
    '让 Jetpack Compose 内部可以使用 React Native 视图的组件。',
  'Row component for placing children horizontally.': '用于水平放置子组件的 Row 组件。',
  'SearchBar component for search input functionality.': '用于搜索输入的 SearchBar 组件。',
  'Segmented Button components for single or multi-choice selection.': '用于单选或多选的 Segmented Button 组件。',
  'Shape component for drawing geometric shapes.': '用于绘制几何形状的 Shape 组件。',
  'Slider component for selecting values from a range.': '用于从范围中选择值的 Slider 组件。',
  'A brief notification that appears at the bottom of the screen to provide feedback without interrupting the user.':
    '出现在屏幕底部、在不打断用户的情况下提供反馈的简短通知。',
  'Spacer component for adding flexible space between elements.': '用于在元素之间添加弹性空间的 Spacer 组件。',
  'Surface component for styled content containers.': '用于带样式内容容器的 Surface 组件。',
  'Switch component for toggle controls.': '用于开关控件的 Switch 组件。',
  'Text component for displaying styled text.': '用于显示带样式文本的 Text 组件。',
  'TextField components for native Material3 text input.': '用于原生 Material3 文本输入的 TextField 组件。',
  'ToggleButton components for displaying native Material3 toggle buttons.':
    '用于显示原生 Material3 切换按钮的 ToggleButton 组件。',
  'Tooltip components for displaying contextual information on long-press.':
    '用于在长按时显示上下文信息的 Tooltip 组件。',
  'A React hook that creates observable state shared between JavaScript and native Jetpack Compose views.':
    '创建在 JavaScript 与原生 Jetpack Compose 视图之间共享的可观察状态的 React Hook。',
  "Adaptive background view that provides a standard appearance based on the widget's environment.":
    '根据小组件环境提供标准外观的自适应背景视图。',
  'Alert component for presenting native iOS alert dialogs.': '用于呈现原生 iOS 警告对话框的 Alert 组件。',
  'BottomSheet component that presents content from the bottom of the screen.':
    '从屏幕底部呈现内容的 BottomSheet 组件。',
  'Button component for displaying native buttons.': '用于显示原生按钮的 Button 组件。',
  'ColorPicker component for selecting colors.': '用于选择颜色的 ColorPicker 组件。',
  'ConfirmationDialog component for presenting confirmation prompts.': '用于呈现确认提示的 ConfirmationDialog 组件。',
  'ContextMenu component for displaying context menus.': '用于显示上下文菜单的 ContextMenu 组件。',
  'ControlGroup component for grouping interactive controls.': '用于分组交互控件的 ControlGroup 组件。',
  'DatePicker component for selecting dates and times.': '用于选择日期和时间的 DatePicker 组件。',
  'DisclosureGroup component for displaying expandable content.': '用于显示可展开内容的 DisclosureGroup 组件。',
  'Divider component for creating visual separators.': '用于创建视觉分隔的 Divider 组件。',
  'Form component for collecting user input in a structured layout.': '用于以结构化布局收集用户输入的 Form 组件。',
  'Gauge component for displaying progress with visual indicators.': '用于以视觉指示器显示进度的 Gauge 组件。',
  'Group component for grouping views without affecting layout.': '用于在不影响布局的情况下分组视图的 Group 组件。',
  'Host component that enables SwiftUI components in React Native.': '让 React Native 中可以使用 SwiftUI 组件的 Host 组件。',
  'HStack component for horizontal layouts.': '用于水平布局的 HStack 组件。',
  'Image component for displaying SF Symbols.': '用于显示 SF Symbols 的 Image 组件。',
  'Label component for displaying text with an icon.': '用于显示带图标文本的 Label 组件。',
  'LazyHStack component for lazy horizontal layouts.': '用于惰性水平布局的 LazyHStack 组件。',
  'LazyVStack component for lazy vertical layouts.': '用于惰性垂直布局的 LazyVStack 组件。',
  'Link component for displaying clickable links.': '用于显示可点击链接的 Link 组件。',
  'List component for displaying scrollable lists of items.': '用于显示可滚动项目列表的 List 组件。',
  'Menu component for displaying dropdown menus.': '用于显示下拉菜单的 Menu 组件。',
  'View modifiers for customizing component appearance and behavior.': '用于自定义组件外观和行为的视图修饰符。',
  'A Namespace component that allows you create Namespaces in SwiftUI':
    '允许你在 SwiftUI 中创建 Namespace 的 Namespace 组件。',
  'Overlay component for layering content on top of another view.': '用于在另一个视图之上分层内容的 Overlay 组件。',
  'Picker component for selecting options from a list.': '用于从列表中选择选项的 Picker 组件。',
  'Popover component for displaying content in a floating overlay.': '用于在浮动浮层中显示内容的 Popover 组件。',
  'ProgressView component for displaying progress indicators.': '用于显示进度指示器的 ProgressView 组件。',
  'A component that enables React Native views inside SwiftUI.': '让 SwiftUI 内部可以使用 React Native 视图的组件。',
  'ScrollView component for scrollable content.': '用于可滚动内容的 ScrollView 组件。',
  'Section component for grouping content within lists and forms.': '用于在列表和表单中分组内容的 Section 组件。',
  'SecureField component for password input.': '用于密码输入的 SecureField 组件。',
  'Spacer component for flexible spacing.': '用于弹性间距的 Spacer 组件。',
  'SwipeActions component for adding leading and trailing swipe actions to row content.':
    '用于为行内容添加前导和尾随滑动操作的 SwipeActions 组件。',
  'TabView component for paged or tabbed content.': '用于分页或标签内容的 TabView 组件。',
  'Text component for displaying styled text with support for nested texts.':
    '用于显示带样式文本并支持嵌套文本的 Text 组件。',
  'TextField component for text input.': '用于文本输入的 TextField 组件。',
  'Toggle component for displaying native toggles.': '用于显示原生开关的 Toggle 组件。',
  'A React hook that creates observable state shared between JavaScript and native SwiftUI views.':
    '创建在 JavaScript 与原生 SwiftUI 视图之间共享的可观察状态的 React Hook。',
  'VStack component for vertical layouts.': '用于垂直布局的 VStack 组件。',
  'ZStack component for overlapping layouts.': '用于重叠布局的 ZStack 组件。',
  'A bottom sheet compatible with @gorhom/bottom-sheet.': '与 @gorhom/bottom-sheet 兼容的底部面板。',
  'A date and time picker compatible with @react-native-community/datetimepicker.':
    '与 @react-native-community/datetimepicker 兼容的日期时间选择器。',
  'A masked view compatible with @react-native-masked-view/masked-view.':
    '与 @react-native-masked-view/masked-view 兼容的遮罩视图。',
  'A menu compatible with @react-native-menu/menu.': '与 @react-native-menu/menu 兼容的菜单。',
  'A horizontally paged view compatible with react-native-pager-view.':
    '与 react-native-pager-view 兼容的水平分页视图。',
  'A picker compatible with @react-native-picker/picker.': '与 @react-native-picker/picker 兼容的选择器。',
  'A segmented control compatible with @react-native-segmented-control/segmented-control.':
    '与 @react-native-segmented-control/segmented-control 兼容的分段控件。',
  'A slider compatible with @react-native-community/slider.': '与 @react-native-community/slider 兼容的滑块。',
  'A modal sheet that slides up from the bottom of the screen.': '从屏幕底部向上滑出的模态面板。',
  'A pressable button with multiple visual variants.': '具有多种视觉变体的可按按钮。',
  'A toggle control that represents a checked or unchecked state.': '表示选中或未选中状态的开关控件。',
  'A labelled tappable header that toggles visibility of its content.':
    '带标签的可点按标题，用于切换其内容的可见性。',
  'A vertical layout container for universal @expo/ui components.': '用于通用 @expo/ui 组件的垂直布局容器。',
  'A scrollable container of grouped settings-style rows.': '分组设置样式行的可滚动容器。',
  'A cross-platform Host component that wraps universal @expo/ui content.':
    '包装通用 @expo/ui 内容的跨平台 Host 组件。',
  'A platform-native icon — SF Symbol on iOS, Material Symbol on Android.':
    '平台原生图标：iOS 上为 SF Symbol，Android 上为 Material Symbol。',
  'A virtualized vertical container of rows, paired with a tappable ListItem primitive.':
    '行的虚拟化垂直容器，搭配可点按的 ListItem 原语。',
  'A single-selection input with menu and wheel appearances.': '具有菜单和滚轮外观的单选输入。',
  'A cross-platform component for hosting React Native views inside @expo/ui views.':
    '用于在 @expo/ui 视图内部承载 React Native 视图的跨平台组件。',
  'A horizontal layout container for universal @expo/ui components.': '用于通用 @expo/ui 组件的水平布局容器。',
  'A scrollable container that supports vertical or horizontal scrolling.':
    '支持垂直或水平滚动的可滚动容器。',
  'A control for selecting a value from a continuous or stepped range.':
    '用于从连续或步进范围中选择值的控件。',
  'A layout spacer that produces empty space between siblings.': '在相邻元素之间产生空白的布局间隔。',
  'A toggle control that switches between on and off states.': '在开与关状态之间切换的开关控件。',
  'A component for displaying styled text content.': '用于显示带样式文本内容的组件。',
  'A text input backed by native SwiftUI and Jetpack Compose components, with a React Native-compatible API.':
    '由原生 SwiftUI 和 Jetpack Compose 组件支持、API 与 React Native 兼容的文本输入。',
  'The latest Expo UI examples.': '最新的 Expo UI 示例。',
  'An example app replicating the YVR Hot Chocolate Fest app with Expo UI.':
    '用 Expo UI 复刻 YVR Hot Chocolate Fest 应用的示例应用。',
  'A project demonstrating the production-ready Expo UI package available in SDK 56 and later. The project works on both TV (Android TV, Apple TV) and mobile (Android, iOS). Demo screens include most of the available components for both Jetpack Compose and SwiftUI.':
    '演示 SDK 56 及更高版本中可用于生产的 Expo UI 包的项目。该项目同时支持电视（Android TV、Apple TV）和移动设备（Android、iOS）。演示界面包含 Jetpack Compose 和 SwiftUI 的大部分可用组件。',
};

const lines = text.split(/\n/);
const missing = [];
const out = lines.map(line => {
  const idx = line.indexOf('：');
  if (idx === -1) return line;
  const suffix = line.slice(idx + 1);
  if (!desc[suffix]) {
    missing.push(suffix);
    return line;
  }
  return line.slice(0, idx + 1) + desc[suffix];
});
text = out.join('\n');

const blocks = [
  [
    `---
title: Expo UI
description: A set of components that allow you to build UIs directly with Jetpack Compose and SwiftUI from React.
packageName: @expo/ui
---

# Expo UI`,
    `---
title: Expo UI 包参考
description: 一组组件，让你能从 React 直接用 Jetpack Compose 和 SwiftUI 构建界面。
---

# Expo UI 包参考`,
  ],
  [
    '`@expo/ui` is a set of native input components that allows you to build fully native interfaces with Jetpack Compose and SwiftUI. It aims to provide the commonly used features and components that a typical app will need.',
    '`@expo/ui` 是一组原生输入组件，让你能用 Jetpack Compose 和 SwiftUI 构建完全原生的界面。它旨在提供典型应用所需的常用功能和组件。',
  ],
  ['## Features', '## 特性'],
  [
    '- **Native primitives**: Expo UI is not another UI library. It brings Jetpack Compose and SwiftUI primitives to React Native.',
    '- **原生原语**：Expo UI 不是又一个 UI 库。它把 Jetpack Compose 和 SwiftUI 原语带到 React Native。',
  ],
  [
    '- **1-to-1 mapping**: Components map one to one to their native counterparts. To browse a catalog of Jetpack Compose and SwiftUI components, see [Available components](#available-components) below.',
    '- **一对一映射**：组件与其原生对应物一一对应。要浏览 Jetpack Compose 和 SwiftUI 组件目录，见下方的[可用组件](#可用组件)。',
  ],
  [
    '- **Full-app support**: Expo UI integrates at the component level. You can write an entire app with it, or adopt it one screen at a time. You can also mix [React Native components](https://reactnative.dev/docs/components-and-apis), [DOM components](/guides/dom-components), and 2D components drawn with [`react-native-skia`](https://shopify.github.io/react-native-skia/).',
    '- **完整应用支持**：Expo UI 在组件级别集成。你可以用它编写整个应用，也可以一次采用一个界面。你还可以混用 [React Native 组件](https://reactnative.dev/docs/components-and-apis)、[DOM 组件](/guides/dom-components)，以及用 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 绘制的 2D 组件。',
  ],
  ['## Available platforms', '## 可用平台'],
  ['Components are available for the following platforms:', '组件可用于以下平台：'],
  [
    '- **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)**: Build native Android interfaces with Jetpack Compose components',
    '- **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)**：用 Jetpack Compose 组件构建原生 Android 界面',
  ],
  [
    '- **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**: Build native iOS interfaces with SwiftUI components',
    '- **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**：用 SwiftUI 组件构建原生 iOS 界面',
  ],
  [
    '- **[Universal](/versions/latest/sdk/ui/universal)**: Cross-platform components that run on Android, iOS, and web from a single source',
    '- **[Universal](/versions/latest/sdk/ui/universal)**：从单一源码在 Android、iOS 和 Web 上运行的跨平台组件',
  ],
  [
    "Start with **[Universal](/versions/latest/sdk/ui/universal)** when you want one component tree that runs unmodified on Android, iOS, and web. Reach for **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)** or **[SwiftUI](/versions/latest/sdk/ui/swift-ui)** directly when you need platform-specific controls, modifiers, or behavior that the universal API doesn't cover.",
    '当你希望同一组件树在 Android、iOS 和 Web 上无需修改即可运行时，从 **[Universal](/versions/latest/sdk/ui/universal)** 开始。当你需要通用 API 未覆盖的平台特定控件、修饰符或行为时，直接使用 **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)** 或 **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**。',
  ],
  ['## Drop-in replacements', '## 直接替换组件'],
  [
    'See **[Drop-in replacements](/versions/latest/sdk/ui/drop-in-replacements)** for API-compatible replacements for popular React Native community libraries.',
    '热门 React Native 社区库的 API 兼容替换，见 **[直接替换组件](/versions/latest/sdk/ui/drop-in-replacements)**。',
  ],
  ['## Expo Skills for AI agents', '## 面向 AI 代理的 Expo Skills'],
  [
    'If you use an AI agent, install [Expo Skills](/skills) to teach it how to build native-feeling screens:',
    '如果你使用 AI 代理，请安装 [Expo Skills](/skills)，教它如何构建具有原生感觉的界面：',
  ],
  ['## Available components', '## 可用组件'],
  ['### Drop-in replacements', '### 直接替换组件'],
  ['### Universal', '### 通用'],
  ['## Common questions', '## 常见问题'],
  [
    '<details><summary>Can I use flexbox or other styles in Expo UI components?</summary>',
    '<details><summary>可以在 Expo UI 组件中使用 flexbox 或其他样式吗？</summary>',
  ],
  [
    'Flexbox styles apply to the `Host` component itself. Once you are inside the native context, [`Yoga`](https://www.yogalayout.dev/) is not available. Define layouts with `Row` and `Column` on Android, or `HStack` and `VStack` on iOS.',
    'Flexbox 样式作用于 `Host` 组件本身。一旦进入原生上下文，[`Yoga`](https://www.yogalayout.dev/) 就不可用。在 Android 上用 `Row` 和 `Column` 定义布局，在 iOS 上用 `HStack` 和 `VStack`。',
  ],
  [
    "<details><summary>What's the `Host` component?</summary>",
    '<details><summary>`Host` 组件是什么？</summary>',
  ],
  [
    '`Host` is the bridge between React Native and the native UI toolkit. You must wrap every Expo UI component in one. You can think of it like [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg) in the DOM or [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/) in [`react-native-skia`](https://shopify.github.io/react-native-skia/). On iOS, it uses [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) to render SwiftUI views in UIKit. See the universal [`Host`](/versions/latest/sdk/ui/universal/host) for cross-platform usage.',
    '`Host` 是 React Native 与原生 UI 工具包之间的桥梁。每个 Expo UI 组件都必须包在一个 `Host` 里。你可以把它想象成 DOM 中的 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg)，或 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 中的 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/)。在 iOS 上，它使用 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) 在 UIKit 中渲染 SwiftUI 视图。跨平台用法见通用 [`Host`](/versions/latest/sdk/ui/universal/host)。',
  ],
  [
    '<details><summary>How is Expo UI different from libraries like `react-native-paper` or `react-native-elements`?</summary>',
    '<details><summary>Expo UI 与 `react-native-paper` 或 `react-native-elements` 这类库有何不同？</summary>',
  ],
  [
    'Expo UI is not "yet another" UI library and not an opinionated design kit. Instead, it\'s a primitives library. It exposes native Jetpack Compose and SwiftUI components directly to JavaScript, rather than re-implementing or simulating UI in JavaScript.',
    'Expo UI 不是“又一个”UI 库，也不是一套带主观风格的设计套件。它是一个原语库。它把原生 Jetpack Compose 和 SwiftUI 组件直接暴露给 JavaScript，而不是在 JavaScript 中重新实现或模拟 UI。',
  ],
  [
    '<details><summary>Can I use `@expo/ui/swift-ui` on Android or web?</summary>',
    '<details><summary>可以在 Android 或 Web 上使用 `@expo/ui/swift-ui` 吗？</summary>',
  ],
  [
    'No. `@expo/ui/swift-ui` renders SwiftUI views, which exist only on Apple platforms. Use [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose) for Android. Use the [universal components](/versions/latest/sdk/ui/universal) when you want one component tree for Android, iOS, and web.',
    '不可以。`@expo/ui/swift-ui` 渲染的是 SwiftUI 视图，它们只存在于 Apple 平台。Android 请使用 [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose)。当你希望 Android、iOS 和 Web 共用同一组件树时，使用[通用组件](/versions/latest/sdk/ui/universal)。',
  ],
  [
    '<details><summary>Can I use React Native components inside SwiftUI components?</summary>',
    '<details><summary>可以在 SwiftUI 组件内部使用 React Native 组件吗？</summary>',
  ],
  [
    'Yes, you can place React Native components as JSX children of Expo UI components. Expo UI automatically creates a [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) wrapper for you.',
    '可以。你可以把 React Native 组件作为 Expo UI 组件的 JSX 子组件。Expo UI 会自动为你创建 [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) 包装。',
  ],
  [
    "However, keep in mind that the SwiftUI layout system works differently from UIKit and has some limitations. According to Apple's documentation:",
    '不过请记住，SwiftUI 布局系统的工作方式与 UIKit 不同，并有一些限制。根据 Apple 的文档：',
  ],
  [
    "SwiftUI fully controls the layout of the UIKit view's [`center`](https://developer.apple.com/documentation/UIKit/UIView/center), [`bounds`](https://developer.apple.com/documentation/UIKit/UIView/bounds), [`frame`](https://developer.apple.com/documentation/UIKit/UIView/frame), and [`transform`](https://developer.apple.com/documentation/UIKit/UIView/transform) properties. Don't directly set these layout-related properties on the view managed by a [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) instance from your own code because that conflicts with SwiftUI and results in undefined behavior.",
    'SwiftUI 完全控制 UIKit 视图的 [`center`](https://developer.apple.com/documentation/UIKit/UIView/center)、[`bounds`](https://developer.apple.com/documentation/UIKit/UIView/bounds)、[`frame`](https://developer.apple.com/documentation/UIKit/UIView/frame) 和 [`transform`](https://developer.apple.com/documentation/UIKit/UIView/transform) 属性。不要在自己的代码中直接设置由 [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) 实例管理的视图上的这些布局相关属性，因为这会与 SwiftUI 冲突并导致未定义行为。',
  ],
  [
    "Also note that once you render React Native components, you're leaving the SwiftUI context. To add Expo UI components again, reintroduce a `Host` wrapper.",
    '另外请注意，一旦渲染 React Native 组件，你就离开了 SwiftUI 上下文。要再次添加 Expo UI 组件，需要重新引入 `Host` 包装。',
  ],
  [
    'Keep SwiftUI layouts self-contained. Interop is possible, but it works best when boundaries are clearly defined.',
    '让 SwiftUI 布局保持自包含。互操作是可行的，但在边界清晰时效果最好。',
  ],
  [
    "<details><summary>I'm a Jetpack Compose or SwiftUI developer. Why should I learn Expo UI?</summary>",
    '<details><summary>我是 Jetpack Compose 或 SwiftUI 开发者。为什么要学习 Expo UI？</summary>',
  ],
  [
    'React\'s promise of _"learn once, write anywhere"_ now extends to Jetpack Compose and SwiftUI. You can apply your existing knowledge to build apps that run in the React Native ecosystem. The same app can extend to the web through [DOM components](/guides/dom-components), and add 2D rendering with [`react-native-skia`](https://shopify.github.io/react-native-skia/) or 3D rendering with [`react-native-webgpu`](https://github.com/wcandillon/react-native-webgpu). Different parts of your app can use different approaches, because the integration works at the component level.',
    'React“学习一次，随处编写”的承诺现在延伸到了 Jetpack Compose 和 SwiftUI。你可以把已有知识用来构建运行在 React Native 生态中的应用。同一个应用可以通过 [DOM 组件](/guides/dom-components)扩展到 Web，并用 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 添加 2D 渲染，或用 [`react-native-webgpu`](https://github.com/wcandillon/react-native-webgpu) 添加 3D 渲染。应用的不同部分可以使用不同方法，因为集成发生在组件级别。',
  ],
  ['## Additional resources', '## 更多资源'],
];

for (const [from, to] of blocks) {
  if (!text.includes(from)) {
    console.error('MISSING BLOCK:\n' + from.slice(0, 120));
  } else {
    text = text.replace(from, to);
  }
}

if (missing.length) {
  console.error('MISSING DESC ' + missing.length);
  console.error(missing.join('\n'));
}

fs.writeFileSync(dest, text.replace(/\r\n/g, '\n'));
const zh = (text.match(/[\u4e00-\u9fff]/g) || []).length;
console.log('wrote', dest, 'zh', zh, 'missing', missing.length);
