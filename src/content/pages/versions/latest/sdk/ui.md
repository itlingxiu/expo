---
title: Expo UI 包参考
description: 一组组件，让你能从 React 直接用 Jetpack Compose 和 SwiftUI 构建界面。
---

# Expo UI 包参考

> 支持平台：Android、iOS、tvOS、Expo Go。

`@expo/ui` 是一组原生输入组件，让你能用 Jetpack Compose 和 SwiftUI 构建完全原生的界面。它旨在提供典型应用所需的常用功能和组件。

## 特性

- **原生原语**：Expo UI 不是又一个 UI 库。它把 Jetpack Compose 和 SwiftUI 原语带到 React Native。
- **一对一映射**：组件与其原生对应物一一对应。要浏览 Jetpack Compose 和 SwiftUI 组件目录，见下方的[可用组件](#可用组件)。
- **完整应用支持**：Expo UI 在组件级别集成。你可以用它编写整个应用，也可以一次采用一个界面。你还可以混用 [React Native 组件](https://reactnative.dev/docs/components-and-apis)、[DOM 组件](/guides/dom-components)，以及用 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 绘制的 2D 组件。

## 可用平台

组件可用于以下平台：

- **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)**：用 Jetpack Compose 组件构建原生 Android 界面
- **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**：用 SwiftUI 组件构建原生 iOS 界面
- **[Universal](/versions/latest/sdk/ui/universal)**：从单一源码在 Android、iOS 和 Web 上运行的跨平台组件

当你希望同一组件树在 Android、iOS 和 Web 上无需修改即可运行时，从 **[Universal](/versions/latest/sdk/ui/universal)** 开始。当你需要通用 API 未覆盖的平台特定控件、修饰符或行为时，直接使用 **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)** 或 **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**。

## 直接替换组件

热门 React Native 社区库的 API 兼容替换，见 **[直接替换组件](/versions/latest/sdk/ui/drop-in-replacements)**。

## 面向 AI 代理的 Expo Skills

如果你使用 AI 代理，请安装 [Expo Skills](/skills)，教它如何构建具有原生感觉的界面：

- [expo-ui](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-ui/SKILL.md)：用 @expo/ui 包构建原生界面：iOS 上是真正的 SwiftUI，Android 上是 Jetpack Compose。
- [expo-native-ui](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md)：构建美观、具有原生感觉的 Expo 界面。

## 可用组件

### Jetpack Compose

![AlertDialog](/static/images/expo-ui/alertdialog/android-light.webp)

- [AlertDialog](/versions/latest/sdk/ui/jetpack-compose/alertdialog)：用于显示原生警告对话框的 AlertDialog 组件。

![Badge](/static/images/expo-ui/badge/android-light.webp)

- [Badge](/versions/latest/sdk/ui/jetpack-compose/badge)：用于显示状态指示和计数的 Badge 组件。

![BadgedBox](/static/images/expo-ui/badgedbox/android-light.webp)

- [BadgedBox](/versions/latest/sdk/ui/jetpack-compose/badgedbox)：用于在内容上叠加徽章的 BadgedBox 组件。

![BasicAlertDialog](/static/images/expo-ui/basicalertdialog/android-light.webp)

- [BasicAlertDialog](/versions/latest/sdk/ui/jetpack-compose/basicalertdialog)：用于显示自定义内容对话框的 BasicAlertDialog 组件。

![Box](/static/images/expo-ui/box/android-light.webp)

- [Box](/versions/latest/sdk/ui/jetpack-compose/box)：用于堆叠子元素的 Box 组件。

![Button](/static/images/expo-ui/button/android-light.webp)

- [Button](/versions/latest/sdk/ui/jetpack-compose/button)：用于显示原生 Material3 按钮的 Button 组件。

![Card](/static/images/expo-ui/card/android-light.webp)

- [Card](/versions/latest/sdk/ui/jetpack-compose/card)：用于在带样式的容器中显示内容的 Card 组件。

![Carousel](/static/images/expo-ui/carousel/android-light.webp)

- [Carousel](/versions/latest/sdk/ui/jetpack-compose/carousel)：用于显示可滚动项目集合的 Carousel 组件。

![Checkbox](/static/images/expo-ui/checkbox/android-light.webp)

- [Checkbox](/versions/latest/sdk/ui/jetpack-compose/checkbox)：用于选择控件的 Checkbox 组件。

![Chip](/static/images/expo-ui/chip/android-light.webp)

- [Chip](/versions/latest/sdk/ui/jetpack-compose/chip)：用于显示紧凑元素的 Chip 组件。

![Column](/static/images/expo-ui/column/android-light.webp)

- [Column](/versions/latest/sdk/ui/jetpack-compose/column)：用于垂直放置子组件的 Column 组件。

![DateTimePicker](/static/images/expo-ui/datetimepicker/android-light.webp)

- [DateTimePicker](/versions/latest/sdk/ui/jetpack-compose/datetimepicker)：用于选择日期和时间的 DateTimePicker 组件。

![Divider](/static/images/expo-ui/divider/android-light.webp)

- [Divider](/versions/latest/sdk/ui/jetpack-compose/divider)：用于创建视觉分隔的 Divider 组件。

![DockedSearchBar](/static/images/expo-ui/dockedsearchbar/android-light.webp)

- [DockedSearchBar](/versions/latest/sdk/ui/jetpack-compose/dockedsearchbar)：用于显示内联搜索输入的 DockedSearchBar 组件。

![DropdownMenu](/static/images/expo-ui/dropdownmenu/android-light.webp)

- [DropdownMenu](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu)：用于显示下拉菜单的 DropdownMenu 组件。

![ExposedDropdownMenuBox](/static/images/expo-ui/exposeddropdownmenubox/android-light.webp)

- [ExposedDropdownMenuBox](/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox)：用于显示带可自定义锚点的下拉菜单的 ExposedDropdownMenuBox 组件。

![FloatingActionButton](/static/images/expo-ui/floatingactionbutton/android-light.webp)

- [FloatingActionButton](/versions/latest/sdk/ui/jetpack-compose/floatingactionbutton)：遵循 Material Design 3 的 FloatingActionButton 组件。

![FlowRow](/static/images/expo-ui/flowrow/android-light.webp)

- [FlowRow](/versions/latest/sdk/ui/jetpack-compose/flowrow)：用于水平换行排列子组件的 FlowRow 组件。

![HorizontalFloatingToolbar](/static/images/expo-ui/horizontalfloatingtoolbar/android-light.webp)

- [HorizontalFloatingToolbar](/versions/latest/sdk/ui/jetpack-compose/horizontalfloatingtoolbar)：用于显示浮动操作栏的 HorizontalFloatingToolbar 组件。

![HorizontalPager](/static/images/expo-ui/horizontalpager/android-light.webp)

- [HorizontalPager](/versions/latest/sdk/ui/jetpack-compose/horizontalpager)：用于可滑动页面的 HorizontalPager 组件。

- [Host](/versions/latest/sdk/ui/jetpack-compose/host)：用于桥接 React Native 与 Jetpack Compose 的 Host 组件。

![Icon](/static/images/expo-ui/icon/android-light.webp)

- [Icon](/versions/latest/sdk/ui/jetpack-compose/icon)：用于显示图标的 Icon 组件。

![IconButton](/static/images/expo-ui/iconbutton/android-light.webp)

- [IconButton](/versions/latest/sdk/ui/jetpack-compose/iconbutton)：用于显示原生 Material3 图标按钮的 IconButton 组件。

![Image](/static/images/expo-ui/image/android-light.webp)

- [Image](/versions/latest/sdk/ui/jetpack-compose/image)：用于显示图片的 Image 组件。

![LazyColumn](/static/images/expo-ui/lazycolumn/android-light.webp)

- [LazyColumn](/versions/latest/sdk/ui/jetpack-compose/lazycolumn)：用于显示可滚动列表的 LazyColumn 组件。

![LazyRow](/static/images/expo-ui/lazyrow/android-light.webp)

- [LazyRow](/versions/latest/sdk/ui/jetpack-compose/lazyrow)：用于显示水平滚动列表的 LazyRow 组件。

![ListItem](/static/images/expo-ui/listitem/android-light.webp)

- [ListItem](/versions/latest/sdk/ui/jetpack-compose/listitem)：用于显示结构化列表项的 ListItem 组件。

![LoadingIndicator](/static/images/expo-ui/loadingindicator/android-light.webp)

- [LoadingIndicator](/versions/latest/sdk/ui/jetpack-compose/loadingindicator)：用于显示加载状态的加载指示器组件。

![Material Colors](/static/images/expo-ui/colors/android-light.webp)

- [Material Colors](/versions/latest/sdk/ui/jetpack-compose/colors)：从 JavaScript 读取 Material 3 调色板（包括 Material 3 动态颜色）。

![ModalBottomSheet](/static/images/expo-ui/bottomsheet/android-light.webp)

- [ModalBottomSheet](/versions/latest/sdk/ui/jetpack-compose/bottomsheet)：从屏幕底部呈现内容的 ModalBottomSheet 组件。

- [Modifiers](/versions/latest/sdk/ui/jetpack-compose/modifiers)：用于 @expo/ui 组件的布局修饰符。

![NavigationBar](/static/images/expo-ui/navigationbar/android-light.webp)

- [NavigationBar](/versions/latest/sdk/ui/jetpack-compose/navigationbar)：用于 Material 3 底部导航的 NavigationBar 组件。

![Progress indicators](/static/images/expo-ui/progress/android-light.webp)

- [Progress indicators](/versions/latest/sdk/ui/jetpack-compose/progress)：用于显示操作状态的进度指示器组件。

![PullToRefreshBox](/static/images/expo-ui/pulltorefreshbox/android-light.webp)

- [PullToRefreshBox](/versions/latest/sdk/ui/jetpack-compose/pulltorefreshbox)：用于下拉刷新交互的 PullToRefreshBox 组件。

![RadioButton](/static/images/expo-ui/radiobutton/android-light.webp)

- [RadioButton](/versions/latest/sdk/ui/jetpack-compose/radiobutton)：用于单选控件的 RadioButton 组件。

- [RNHostView](/versions/latest/sdk/ui/jetpack-compose/rnhostview)：让 Jetpack Compose 内部可以使用 React Native 视图的组件。

![Row](/static/images/expo-ui/row/android-light.webp)

- [Row](/versions/latest/sdk/ui/jetpack-compose/row)：用于水平放置子组件的 Row 组件。

![SearchBar](/static/images/expo-ui/searchbar/android-light.webp)

- [SearchBar](/versions/latest/sdk/ui/jetpack-compose/searchbar)：用于搜索输入的 SearchBar 组件。

![SegmentedButton](/static/images/expo-ui/segmentedbutton/android-light.webp)

- [SegmentedButton](/versions/latest/sdk/ui/jetpack-compose/segmentedbutton)：用于单选或多选的 Segmented Button 组件。

![Shape](/static/images/expo-ui/shape/android-light.webp)

- [Shape](/versions/latest/sdk/ui/jetpack-compose/shape)：用于绘制几何形状的 Shape 组件。

![Slider](/static/images/expo-ui/slider/android-light.webp)

- [Slider](/versions/latest/sdk/ui/jetpack-compose/slider)：用于从范围中选择值的 Slider 组件。

![Snackbar](/static/images/expo-ui/snackbar/android-light.webp)

- [Snackbar](/versions/latest/sdk/ui/jetpack-compose/snackbar)：出现在屏幕底部、在不打断用户的情况下提供反馈的简短通知。

![Spacer](/static/images/expo-ui/spacer/android-light.webp)

- [Spacer](/versions/latest/sdk/ui/jetpack-compose/spacer)：用于在元素之间添加弹性空间的 Spacer 组件。

![Surface](/static/images/expo-ui/surface/android-light.webp)

- [Surface](/versions/latest/sdk/ui/jetpack-compose/surface)：用于带样式内容容器的 Surface 组件。

![Switch](/static/images/expo-ui/switch/android-light.webp)

- [Switch](/versions/latest/sdk/ui/jetpack-compose/switch)：用于开关控件的 Switch 组件。

![Text](/static/images/expo-ui/text/android-light.webp)

- [Text](/versions/latest/sdk/ui/jetpack-compose/text)：用于显示带样式文本的 Text 组件。

![TextField](/static/images/expo-ui/textfield/android-light.webp)

- [TextField](/versions/latest/sdk/ui/jetpack-compose/textfield)：用于原生 Material3 文本输入的 TextField 组件。

![ToggleButton](/static/images/expo-ui/togglebutton/android-light.webp)

- [ToggleButton](/versions/latest/sdk/ui/jetpack-compose/togglebutton)：用于显示原生 Material3 切换按钮的 ToggleButton 组件。

![Tooltip](/static/images/expo-ui/tooltip/android-light.webp)

- [Tooltip](/versions/latest/sdk/ui/jetpack-compose/tooltip)：用于在长按时显示上下文信息的 Tooltip 组件。

- [useNativeState](/versions/latest/sdk/ui/jetpack-compose/usenativestate)：创建在 JavaScript 与原生 Jetpack Compose 视图之间共享的可观察状态的 React Hook。

### SwiftUI

- [AccessoryWidgetBackground](/versions/latest/sdk/ui/swift-ui/accessorywidgetbackground)：根据小组件环境提供标准外观的自适应背景视图。

![Alert](/static/images/expo-ui/alert/ios-light.webp)

- [Alert](/versions/latest/sdk/ui/swift-ui/alert)：用于呈现原生 iOS 警告对话框的 Alert 组件。

![BottomSheet](/static/images/expo-ui/bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/swift-ui/bottomsheet)：从屏幕底部呈现内容的 BottomSheet 组件。

![Button](/static/images/expo-ui/button/ios-light.webp)

- [Button](/versions/latest/sdk/ui/swift-ui/button)：用于显示原生按钮的 Button 组件。

![ColorPicker](/static/images/expo-ui/colorpicker/ios-light.webp)

- [ColorPicker](/versions/latest/sdk/ui/swift-ui/colorpicker)：用于选择颜色的 ColorPicker 组件。

![ConfirmationDialog](/static/images/expo-ui/confirmationdialog/ios-light.webp)

- [ConfirmationDialog](/versions/latest/sdk/ui/swift-ui/confirmationdialog)：用于呈现确认提示的 ConfirmationDialog 组件。

![ContextMenu](/static/images/expo-ui/contextmenu/ios-light.webp)

- [ContextMenu](/versions/latest/sdk/ui/swift-ui/contextmenu)：用于显示上下文菜单的 ContextMenu 组件。

![ControlGroup](/static/images/expo-ui/controlgroup/ios-light.webp)

- [ControlGroup](/versions/latest/sdk/ui/swift-ui/controlgroup)：用于分组交互控件的 ControlGroup 组件。

![DatePicker](/static/images/expo-ui/datepicker/ios-light.webp)

- [DatePicker](/versions/latest/sdk/ui/swift-ui/datepicker)：用于选择日期和时间的 DatePicker 组件。

![DisclosureGroup](/static/images/expo-ui/disclosuregroup/ios-light.webp)

- [DisclosureGroup](/versions/latest/sdk/ui/swift-ui/disclosuregroup)：用于显示可展开内容的 DisclosureGroup 组件。

![Divider](/static/images/expo-ui/divider/ios-light.webp)

- [Divider](/versions/latest/sdk/ui/swift-ui/divider)：用于创建视觉分隔的 Divider 组件。

![Form](/static/images/expo-ui/form/ios-light.webp)

- [Form](/versions/latest/sdk/ui/swift-ui/form)：用于以结构化布局收集用户输入的 Form 组件。

![Gauge](/static/images/expo-ui/gauge/ios-light.webp)

- [Gauge](/versions/latest/sdk/ui/swift-ui/gauge)：用于以视觉指示器显示进度的 Gauge 组件。

- [Group](/versions/latest/sdk/ui/swift-ui/group)：用于在不影响布局的情况下分组视图的 Group 组件。

- [Host](/versions/latest/sdk/ui/swift-ui/host)：让 React Native 中可以使用 SwiftUI 组件的 Host 组件。

![HStack](/static/images/expo-ui/hstack/ios-light.webp)

- [HStack](/versions/latest/sdk/ui/swift-ui/hstack)：用于水平布局的 HStack 组件。

![Image](/static/images/expo-ui/image/ios-light.webp)

- [Image](/versions/latest/sdk/ui/swift-ui/image)：用于显示 SF Symbols 的 Image 组件。

![Label](/static/images/expo-ui/label/ios-light.webp)

- [Label](/versions/latest/sdk/ui/swift-ui/label)：用于显示带图标文本的 Label 组件。

- [LazyHStack](/versions/latest/sdk/ui/swift-ui/lazyhstack)：用于惰性水平布局的 LazyHStack 组件。

- [LazyVStack](/versions/latest/sdk/ui/swift-ui/lazyvstack)：用于惰性垂直布局的 LazyVStack 组件。

![Link](/static/images/expo-ui/link/ios-light.webp)

- [Link](/versions/latest/sdk/ui/swift-ui/link)：用于显示可点击链接的 Link 组件。

![List](/static/images/expo-ui/list/ios-light.webp)

- [List](/versions/latest/sdk/ui/swift-ui/list)：用于显示可滚动项目列表的 List 组件。

![Menu](/static/images/expo-ui/menu/ios-light.webp)

- [Menu](/versions/latest/sdk/ui/swift-ui/menu)：用于显示下拉菜单的 Menu 组件。

- [Modifiers](/versions/latest/sdk/ui/swift-ui/modifiers)：用于自定义组件外观和行为的视图修饰符。

- [Namespace](/versions/latest/sdk/ui/swift-ui/namespace)：允许你在 SwiftUI 中创建 Namespace 的 Namespace 组件。

![Overlay](/static/images/expo-ui/overlay/ios-light.webp)

- [Overlay](/versions/latest/sdk/ui/swift-ui/overlay)：用于在另一个视图之上分层内容的 Overlay 组件。

![Picker](/static/images/expo-ui/picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/swift-ui/picker)：用于从列表中选择选项的 Picker 组件。

![Popover](/static/images/expo-ui/popover/ios-light.webp)

- [Popover](/versions/latest/sdk/ui/swift-ui/popover)：用于在浮动浮层中显示内容的 Popover 组件。

![ProgressView](/static/images/expo-ui/progressview/ios-light.webp)

- [ProgressView](/versions/latest/sdk/ui/swift-ui/progressview)：用于显示进度指示器的 ProgressView 组件。

- [RNHostView](/versions/latest/sdk/ui/swift-ui/rnhostview)：让 SwiftUI 内部可以使用 React Native 视图的组件。

![ScrollView](/static/images/expo-ui/scrollview/ios-light.webp)

- [ScrollView](/versions/latest/sdk/ui/swift-ui/scrollview)：用于可滚动内容的 ScrollView 组件。

![Section](/static/images/expo-ui/section/ios-light.webp)

- [Section](/versions/latest/sdk/ui/swift-ui/section)：用于在列表和表单中分组内容的 Section 组件。

![SecureField](/static/images/expo-ui/securefield/ios-light.webp)

- [SecureField](/versions/latest/sdk/ui/swift-ui/securefield)：用于密码输入的 SecureField 组件。

![Slider](/static/images/expo-ui/slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/swift-ui/slider)：用于从范围中选择值的 Slider 组件。

![Spacer](/static/images/expo-ui/spacer/ios-light.webp)

- [Spacer](/versions/latest/sdk/ui/swift-ui/spacer)：用于弹性间距的 Spacer 组件。

- [SwipeActions](/versions/latest/sdk/ui/swift-ui/swipeactions)：用于为行内容添加前导和尾随滑动操作的 SwipeActions 组件。

![TabView](/static/images/expo-ui/tabview/ios-light.webp)

- [TabView](/versions/latest/sdk/ui/swift-ui/tabview)：用于分页或标签内容的 TabView 组件。

![Text](/static/images/expo-ui/text/ios-light.webp)

- [Text](/versions/latest/sdk/ui/swift-ui/text)：用于显示带样式文本并支持嵌套文本的 Text 组件。

![TextField](/static/images/expo-ui/textfield/ios-light.webp)

- [TextField](/versions/latest/sdk/ui/swift-ui/textfield)：用于文本输入的 TextField 组件。

![Toggle](/static/images/expo-ui/toggle/ios-light.webp)

- [Toggle](/versions/latest/sdk/ui/swift-ui/toggle)：用于显示原生开关的 Toggle 组件。

- [useNativeState](/versions/latest/sdk/ui/swift-ui/usenativestate)：创建在 JavaScript 与原生 SwiftUI 视图之间共享的可观察状态的 React Hook。

![VStack](/static/images/expo-ui/vstack/ios-light.webp)

- [VStack](/versions/latest/sdk/ui/swift-ui/vstack)：用于垂直布局的 VStack 组件。

![ZStack](/static/images/expo-ui/zstack/ios-light.webp)

- [ZStack](/versions/latest/sdk/ui/swift-ui/zstack)：用于重叠布局的 ZStack 组件。

### 直接替换组件

![Android（Android）](/static/images/expo-ui/community-bottomsheet/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/drop-in-replacements/bottomsheet)：与 @gorhom/bottom-sheet 兼容的底部面板。

![Android（Android）](/static/images/expo-ui/community-datetimepicker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-datetimepicker/ios-light.webp)

- [DateTimePicker](/versions/latest/sdk/ui/drop-in-replacements/datetimepicker)：与 @react-native-community/datetimepicker 兼容的日期时间选择器。

![Android（Android）](/static/images/expo-ui/community-maskedview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-maskedview/ios-light.webp)

- [MaskedView](/versions/latest/sdk/ui/drop-in-replacements/maskedview)：与 @react-native-masked-view/masked-view 兼容的遮罩视图。

![Android（Android）](/static/images/expo-ui/community-menu/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-menu/ios-light.webp)

- [Menu](/versions/latest/sdk/ui/drop-in-replacements/menu)：与 @react-native-menu/menu 兼容的菜单。

![Android（Android）](/static/images/expo-ui/community-pagerview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-pagerview/ios-light.webp)

- [PagerView](/versions/latest/sdk/ui/drop-in-replacements/pagerview)：与 react-native-pager-view 兼容的水平分页视图。

![Android（Android）](/static/images/expo-ui/community-picker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/drop-in-replacements/picker)：与 @react-native-picker/picker 兼容的选择器。

![Android（Android）](/static/images/expo-ui/community-segmentedcontrol/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-segmentedcontrol/ios-light.webp)

- [SegmentedControl](/versions/latest/sdk/ui/drop-in-replacements/segmentedcontrol)：与 @react-native-segmented-control/segmented-control 兼容的分段控件。

![Android（Android）](/static/images/expo-ui/community-slider/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/drop-in-replacements/slider)：与 @react-native-community/slider 兼容的滑块。

### 通用

![Android（Android）](/static/images/expo-ui/bottomsheet/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/universal/bottomsheet)：从屏幕底部向上滑出的模态面板。

![Android（Android）](/static/images/expo-ui/button/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/button/ios-light.webp)

- [Button](/versions/latest/sdk/ui/universal/button)：具有多种视觉变体的可按按钮。

![Android（Android）](/static/images/expo-ui/checkbox/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/checkbox/ios-light.webp)

- [Checkbox](/versions/latest/sdk/ui/universal/checkbox)：表示选中或未选中状态的开关控件。

![Android（Android）](/static/images/expo-ui/collapsible/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/collapsible/ios-light.webp)

- [Collapsible](/versions/latest/sdk/ui/universal/collapsible)：带标签的可点按标题，用于切换其内容的可见性。

![Android（Android）](/static/images/expo-ui/column/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/column/ios-light.webp)

- [Column](/versions/latest/sdk/ui/universal/column)：用于通用 @expo/ui 组件的垂直布局容器。

![Android（Android）](/static/images/expo-ui/fieldgroup/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/fieldgroup/ios-light.webp)

- [FieldGroup](/versions/latest/sdk/ui/universal/fieldgroup)：分组设置样式行的可滚动容器。

![Android（Android）](/static/images/expo-ui/host/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/host/ios-light.webp)

- [Host](/versions/latest/sdk/ui/universal/host)：包装通用 @expo/ui 内容的跨平台 Host 组件。

![Android（Android）](/static/images/expo-ui/icon/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/icon/ios-light.webp)

- [Icon](/versions/latest/sdk/ui/universal/icon)：平台原生图标：iOS 上为 SF Symbol，Android 上为 Material Symbol。

![Android（Android）](/static/images/expo-ui/list/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/list/ios-light.webp)

- [List](/versions/latest/sdk/ui/universal/list)：行的虚拟化垂直容器，搭配可点按的 ListItem 原语。

![Android（Android）](/static/images/expo-ui/picker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/universal/picker)：具有菜单和滚轮外观的单选输入。

![Android（Android）](/static/images/expo-ui/rnhostview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/rnhostview/ios-light.webp)

- [RNHostView](/versions/latest/sdk/ui/universal/rnhostview)：用于在 @expo/ui 视图内部承载 React Native 视图的跨平台组件。

![Android（Android）](/static/images/expo-ui/row/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/row/ios-light.webp)

- [Row](/versions/latest/sdk/ui/universal/row)：用于通用 @expo/ui 组件的水平布局容器。

![Android（Android）](/static/images/expo-ui/scrollview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/scrollview/ios-light.webp)

- [ScrollView](/versions/latest/sdk/ui/universal/scrollview)：支持垂直或水平滚动的可滚动容器。

![Android（Android）](/static/images/expo-ui/slider/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/universal/slider)：用于从连续或步进范围中选择值的控件。

![Android（Android）](/static/images/expo-ui/spacer/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/spacer/ios-light.webp)

- [Spacer](/versions/latest/sdk/ui/universal/spacer)：在相邻元素之间产生空白的布局间隔。

![Android（Android）](/static/images/expo-ui/switch/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/switch/ios-light.webp)

- [Switch](/versions/latest/sdk/ui/universal/switch)：在开与关状态之间切换的开关控件。

![Android（Android）](/static/images/expo-ui/text/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/text/ios-light.webp)

- [Text](/versions/latest/sdk/ui/universal/text)：用于显示带样式文本内容的组件。

![Android（Android）](/static/images/expo-ui/textinput/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/textinput/ios-light.webp)

- [TextInput](/versions/latest/sdk/ui/universal/textinput)：由原生 SwiftUI 和 Jetpack Compose 组件支持、API 与 React Native 兼容的文本输入。

## 常见问题

<details><summary>可以在 Expo UI 组件中使用 flexbox 或其他样式吗？</summary>

Flexbox 样式作用于 `Host` 组件本身。一旦进入原生上下文，[`Yoga`](https://www.yogalayout.dev/) 就不可用。在 Android 上用 `Row` 和 `Column` 定义布局，在 iOS 上用 `HStack` 和 `VStack`。

</details>

<details><summary>`Host` 组件是什么？</summary>

`Host` 是 React Native 与原生 UI 工具包之间的桥梁。每个 Expo UI 组件都必须包在一个 `Host` 里。你可以把它想象成 DOM 中的 [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg)，或 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 中的 [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/)。在 iOS 上，它使用 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) 在 UIKit 中渲染 SwiftUI 视图。跨平台用法见通用 [`Host`](/versions/latest/sdk/ui/universal/host)。

</details>

<details><summary>Expo UI 与 `react-native-paper` 或 `react-native-elements` 这类库有何不同？</summary>

Expo UI 不是“又一个”UI 库，也不是一套带主观风格的设计套件。它是一个原语库。它把原生 Jetpack Compose 和 SwiftUI 组件直接暴露给 JavaScript，而不是在 JavaScript 中重新实现或模拟 UI。

</details>

<details><summary>可以在 Android 或 Web 上使用 `@expo/ui/swift-ui` 吗？</summary>

不可以。`@expo/ui/swift-ui` 渲染的是 SwiftUI 视图，它们只存在于 Apple 平台。Android 请使用 [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose)。当你希望 Android、iOS 和 Web 共用同一组件树时，使用[通用组件](/versions/latest/sdk/ui/universal)。

</details>

<details><summary>可以在 SwiftUI 组件内部使用 React Native 组件吗？</summary>

可以。你可以把 React Native 组件作为 Expo UI 组件的 JSX 子组件。Expo UI 会自动为你创建 [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) 包装。
不过请记住，SwiftUI 布局系统的工作方式与 UIKit 不同，并有一些限制。根据 Apple 的文档：

:::warning
SwiftUI 完全控制 UIKit 视图的 [`center`](https://developer.apple.com/documentation/UIKit/UIView/center)、[`bounds`](https://developer.apple.com/documentation/UIKit/UIView/bounds)、[`frame`](https://developer.apple.com/documentation/UIKit/UIView/frame) 和 [`transform`](https://developer.apple.com/documentation/UIKit/UIView/transform) 属性。不要在自己的代码中直接设置由 [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) 实例管理的视图上的这些布局相关属性，因为这会与 SwiftUI 冲突并导致未定义行为。
:::

另外请注意，一旦渲染 React Native 组件，你就离开了 SwiftUI 上下文。要再次添加 Expo UI 组件，需要重新引入 `Host` 包装。

让 SwiftUI 布局保持自包含。互操作是可行的，但在边界清晰时效果最好。

</details>

<details><summary>我是 Jetpack Compose 或 SwiftUI 开发者。为什么要学习 Expo UI？</summary>

React“学习一次，随处编写”的承诺现在延伸到了 Jetpack Compose 和 SwiftUI。你可以把已有知识用来构建运行在 React Native 生态中的应用。同一个应用可以通过 [DOM 组件](/guides/dom-components)扩展到 Web，并用 [`react-native-skia`](https://shopify.github.io/react-native-skia/) 添加 2D 渲染，或用 [`react-native-webgpu`](https://github.com/wcandillon/react-native-webgpu) 添加 3D 渲染。应用的不同部分可以使用不同方法，因为集成发生在组件级别。

</details>

## 更多资源

- [Expo UI example](https://github.com/expo/expo/tree/main/apps/native-component-list/src/screens/UI)：最新的 Expo UI 示例。

- [Hot Chocolate app example](https://github.com/expo/hot-chocolate)：用 Expo UI 复刻 YVR Hot Chocolate Fest 应用的示例应用。

- [Expo UI multiplatform demo](https://github.com/react-native-tvos/ExpoUITV)：演示 SDK 56 及更高版本中可用于生产的 Expo UI 包的项目。该项目同时支持电视（Android TV、Apple TV）和移动设备（Android、iOS）。演示界面包含 Jetpack Compose 和 SwiftUI 的大部分可用组件。

