---
title: Expo UI
description: A set of components that allow you to build UIs directly with Jetpack Compose and SwiftUI from React.
packageName: @expo/ui
---

# Expo UI

> 支持平台：Android、iOS、tvOS、Expo Go。

`@expo/ui` is a set of native input components that allows you to build fully native interfaces with Jetpack Compose and SwiftUI. It aims to provide the commonly used features and components that a typical app will need.

## Features

- **Native primitives**: Expo UI is not another UI library. It brings Jetpack Compose and SwiftUI primitives to React Native.
- **1-to-1 mapping**: Components map one to one to their native counterparts. To browse a catalog of Jetpack Compose and SwiftUI components, see [Available components](#available-components) below.
- **Full-app support**: Expo UI integrates at the component level. You can write an entire app with it, or adopt it one screen at a time. You can also mix [React Native components](https://reactnative.dev/docs/components-and-apis), [DOM components](/guides/dom-components), and 2D components drawn with [`react-native-skia`](https://shopify.github.io/react-native-skia/).

## Available platforms

Components are available for the following platforms:

- **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)**: Build native Android interfaces with Jetpack Compose components
- **[SwiftUI](/versions/latest/sdk/ui/swift-ui)**: Build native iOS interfaces with SwiftUI components
- **[Universal](/versions/latest/sdk/ui/universal)**: Cross-platform components that run on Android, iOS, and web from a single source

Start with **[Universal](/versions/latest/sdk/ui/universal)** when you want one component tree that runs unmodified on Android, iOS, and web. Reach for **[Jetpack Compose](/versions/latest/sdk/ui/jetpack-compose)** or **[SwiftUI](/versions/latest/sdk/ui/swift-ui)** directly when you need platform-specific controls, modifiers, or behavior that the universal API doesn't cover.

## Drop-in replacements

See **[Drop-in replacements](/versions/latest/sdk/ui/drop-in-replacements)** for API-compatible replacements for popular React Native community libraries.

## Expo Skills for AI agents

If you use an AI agent, install [Expo Skills](/skills) to teach it how to build native-feeling screens:

- [expo-ui](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-ui/SKILL.md)：Build native UI with the @expo/ui package: real SwiftUI on iOS and Jetpack Compose on Android.
- [expo-native-ui](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md)：Build beautiful, native-feeling Expo screens.

## Available components

### Jetpack Compose

![AlertDialog](/static/images/expo-ui/alertdialog/android-light.webp)

- [AlertDialog](/versions/latest/sdk/ui/jetpack-compose/alertdialog)：AlertDialog component for displaying native alert dialogs.

![Badge](/static/images/expo-ui/badge/android-light.webp)

- [Badge](/versions/latest/sdk/ui/jetpack-compose/badge)：Badge component for displaying status indicators and counts.

![BadgedBox](/static/images/expo-ui/badgedbox/android-light.webp)

- [BadgedBox](/versions/latest/sdk/ui/jetpack-compose/badgedbox)：BadgedBox component for overlaying badges on content.

![BasicAlertDialog](/static/images/expo-ui/basicalertdialog/android-light.webp)

- [BasicAlertDialog](/versions/latest/sdk/ui/jetpack-compose/basicalertdialog)：BasicAlertDialog component for displaying dialogs with custom content.

![Box](/static/images/expo-ui/box/android-light.webp)

- [Box](/versions/latest/sdk/ui/jetpack-compose/box)：Box component for stacking child elements.

![Button](/static/images/expo-ui/button/android-light.webp)

- [Button](/versions/latest/sdk/ui/jetpack-compose/button)：Button components for displaying native Material3 buttons.

![Card](/static/images/expo-ui/card/android-light.webp)

- [Card](/versions/latest/sdk/ui/jetpack-compose/card)：Card component for displaying content in a styled container.

![Carousel](/static/images/expo-ui/carousel/android-light.webp)

- [Carousel](/versions/latest/sdk/ui/jetpack-compose/carousel)：Carousel components for displaying scrollable collections of items.

![Checkbox](/static/images/expo-ui/checkbox/android-light.webp)

- [Checkbox](/versions/latest/sdk/ui/jetpack-compose/checkbox)：Checkbox component for selection controls.

![Chip](/static/images/expo-ui/chip/android-light.webp)

- [Chip](/versions/latest/sdk/ui/jetpack-compose/chip)：Chip components for displaying compact elements.

![Column](/static/images/expo-ui/column/android-light.webp)

- [Column](/versions/latest/sdk/ui/jetpack-compose/column)：Column component for placing children vertically.

![DateTimePicker](/static/images/expo-ui/datetimepicker/android-light.webp)

- [DateTimePicker](/versions/latest/sdk/ui/jetpack-compose/datetimepicker)：DateTimePicker component for selecting dates and times.

![Divider](/static/images/expo-ui/divider/android-light.webp)

- [Divider](/versions/latest/sdk/ui/jetpack-compose/divider)：Divider components for creating visual separators.

![DockedSearchBar](/static/images/expo-ui/dockedsearchbar/android-light.webp)

- [DockedSearchBar](/versions/latest/sdk/ui/jetpack-compose/dockedsearchbar)：DockedSearchBar component for displaying an inline search input.

![DropdownMenu](/static/images/expo-ui/dropdownmenu/android-light.webp)

- [DropdownMenu](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu)：DropdownMenu component for displaying dropdown menus.

![ExposedDropdownMenuBox](/static/images/expo-ui/exposeddropdownmenubox/android-light.webp)

- [ExposedDropdownMenuBox](/versions/latest/sdk/ui/jetpack-compose/exposeddropdownmenubox)：ExposedDropdownMenuBox component for displaying a dropdown menu with a customizable anchor.

![FloatingActionButton](/static/images/expo-ui/floatingactionbutton/android-light.webp)

- [FloatingActionButton](/versions/latest/sdk/ui/jetpack-compose/floatingactionbutton)：FloatingActionButton components following Material Design 3.

![FlowRow](/static/images/expo-ui/flowrow/android-light.webp)

- [FlowRow](/versions/latest/sdk/ui/jetpack-compose/flowrow)：FlowRow component for wrapping children horizontally.

![HorizontalFloatingToolbar](/static/images/expo-ui/horizontalfloatingtoolbar/android-light.webp)

- [HorizontalFloatingToolbar](/versions/latest/sdk/ui/jetpack-compose/horizontalfloatingtoolbar)：HorizontalFloatingToolbar component for displaying a floating action bar.

![HorizontalPager](/static/images/expo-ui/horizontalpager/android-light.webp)

- [HorizontalPager](/versions/latest/sdk/ui/jetpack-compose/horizontalpager)：HorizontalPager component for swipeable pages.

- [Host](/versions/latest/sdk/ui/jetpack-compose/host)：Host component for bridging React Native and Jetpack Compose.

![Icon](/static/images/expo-ui/icon/android-light.webp)

- [Icon](/versions/latest/sdk/ui/jetpack-compose/icon)：Icon component for displaying icons.

![IconButton](/static/images/expo-ui/iconbutton/android-light.webp)

- [IconButton](/versions/latest/sdk/ui/jetpack-compose/iconbutton)：IconButton components for displaying native Material3 icon buttons.

![Image](/static/images/expo-ui/image/android-light.webp)

- [Image](/versions/latest/sdk/ui/jetpack-compose/image)：Image component for displaying images.

![LazyColumn](/static/images/expo-ui/lazycolumn/android-light.webp)

- [LazyColumn](/versions/latest/sdk/ui/jetpack-compose/lazycolumn)：LazyColumn component for displaying scrollable lists.

![LazyRow](/static/images/expo-ui/lazyrow/android-light.webp)

- [LazyRow](/versions/latest/sdk/ui/jetpack-compose/lazyrow)：LazyRow component for displaying horizontally scrolling lists.

![ListItem](/static/images/expo-ui/listitem/android-light.webp)

- [ListItem](/versions/latest/sdk/ui/jetpack-compose/listitem)：ListItem component for displaying structured list entries.

![LoadingIndicator](/static/images/expo-ui/loadingindicator/android-light.webp)

- [LoadingIndicator](/versions/latest/sdk/ui/jetpack-compose/loadingindicator)：Loading indicator components for displaying loading state.

![Material Colors](/static/images/expo-ui/colors/android-light.webp)

- [Material Colors](/versions/latest/sdk/ui/jetpack-compose/colors)：Read the Material 3 color palette (including Material 3 Dynamic Colors) from JavaScript.

![ModalBottomSheet](/static/images/expo-ui/bottomsheet/android-light.webp)

- [ModalBottomSheet](/versions/latest/sdk/ui/jetpack-compose/bottomsheet)：ModalBottomSheet component that presents content from the bottom of the screen.

- [Modifiers](/versions/latest/sdk/ui/jetpack-compose/modifiers)：Layout modifiers for @expo/ui components.

![NavigationBar](/static/images/expo-ui/navigationbar/android-light.webp)

- [NavigationBar](/versions/latest/sdk/ui/jetpack-compose/navigationbar)：NavigationBar component for Material 3 bottom navigation.

![Progress indicators](/static/images/expo-ui/progress/android-light.webp)

- [Progress indicators](/versions/latest/sdk/ui/jetpack-compose/progress)：Progress indicator components for displaying operation status.

![PullToRefreshBox](/static/images/expo-ui/pulltorefreshbox/android-light.webp)

- [PullToRefreshBox](/versions/latest/sdk/ui/jetpack-compose/pulltorefreshbox)：PullToRefreshBox component for pull-to-refresh interactions.

![RadioButton](/static/images/expo-ui/radiobutton/android-light.webp)

- [RadioButton](/versions/latest/sdk/ui/jetpack-compose/radiobutton)：RadioButton component for single-selection controls.

- [RNHostView](/versions/latest/sdk/ui/jetpack-compose/rnhostview)：A component that enables React Native views inside Jetpack Compose.

![Row](/static/images/expo-ui/row/android-light.webp)

- [Row](/versions/latest/sdk/ui/jetpack-compose/row)：Row component for placing children horizontally.

![SearchBar](/static/images/expo-ui/searchbar/android-light.webp)

- [SearchBar](/versions/latest/sdk/ui/jetpack-compose/searchbar)：SearchBar component for search input functionality.

![SegmentedButton](/static/images/expo-ui/segmentedbutton/android-light.webp)

- [SegmentedButton](/versions/latest/sdk/ui/jetpack-compose/segmentedbutton)：Segmented Button components for single or multi-choice selection.

![Shape](/static/images/expo-ui/shape/android-light.webp)

- [Shape](/versions/latest/sdk/ui/jetpack-compose/shape)：Shape component for drawing geometric shapes.

![Slider](/static/images/expo-ui/slider/android-light.webp)

- [Slider](/versions/latest/sdk/ui/jetpack-compose/slider)：Slider component for selecting values from a range.

![Snackbar](/static/images/expo-ui/snackbar/android-light.webp)

- [Snackbar](/versions/latest/sdk/ui/jetpack-compose/snackbar)：A brief notification that appears at the bottom of the screen to provide feedback without interrupting the user.

![Spacer](/static/images/expo-ui/spacer/android-light.webp)

- [Spacer](/versions/latest/sdk/ui/jetpack-compose/spacer)：Spacer component for adding flexible space between elements.

![Surface](/static/images/expo-ui/surface/android-light.webp)

- [Surface](/versions/latest/sdk/ui/jetpack-compose/surface)：Surface component for styled content containers.

![Switch](/static/images/expo-ui/switch/android-light.webp)

- [Switch](/versions/latest/sdk/ui/jetpack-compose/switch)：Switch component for toggle controls.

![Text](/static/images/expo-ui/text/android-light.webp)

- [Text](/versions/latest/sdk/ui/jetpack-compose/text)：Text component for displaying styled text.

![TextField](/static/images/expo-ui/textfield/android-light.webp)

- [TextField](/versions/latest/sdk/ui/jetpack-compose/textfield)：TextField components for native Material3 text input.

![ToggleButton](/static/images/expo-ui/togglebutton/android-light.webp)

- [ToggleButton](/versions/latest/sdk/ui/jetpack-compose/togglebutton)：ToggleButton components for displaying native Material3 toggle buttons.

![Tooltip](/static/images/expo-ui/tooltip/android-light.webp)

- [Tooltip](/versions/latest/sdk/ui/jetpack-compose/tooltip)：Tooltip components for displaying contextual information on long-press.

- [useNativeState](/versions/latest/sdk/ui/jetpack-compose/usenativestate)：A React hook that creates observable state shared between JavaScript and native Jetpack Compose views.

### SwiftUI

- [AccessoryWidgetBackground](/versions/latest/sdk/ui/swift-ui/accessorywidgetbackground)：Adaptive background view that provides a standard appearance based on the widget's environment.

![Alert](/static/images/expo-ui/alert/ios-light.webp)

- [Alert](/versions/latest/sdk/ui/swift-ui/alert)：Alert component for presenting native iOS alert dialogs.

![BottomSheet](/static/images/expo-ui/bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/swift-ui/bottomsheet)：BottomSheet component that presents content from the bottom of the screen.

![Button](/static/images/expo-ui/button/ios-light.webp)

- [Button](/versions/latest/sdk/ui/swift-ui/button)：Button component for displaying native buttons.

![ColorPicker](/static/images/expo-ui/colorpicker/ios-light.webp)

- [ColorPicker](/versions/latest/sdk/ui/swift-ui/colorpicker)：ColorPicker component for selecting colors.

![ConfirmationDialog](/static/images/expo-ui/confirmationdialog/ios-light.webp)

- [ConfirmationDialog](/versions/latest/sdk/ui/swift-ui/confirmationdialog)：ConfirmationDialog component for presenting confirmation prompts.

![ContextMenu](/static/images/expo-ui/contextmenu/ios-light.webp)

- [ContextMenu](/versions/latest/sdk/ui/swift-ui/contextmenu)：ContextMenu component for displaying context menus.

![ControlGroup](/static/images/expo-ui/controlgroup/ios-light.webp)

- [ControlGroup](/versions/latest/sdk/ui/swift-ui/controlgroup)：ControlGroup component for grouping interactive controls.

![DatePicker](/static/images/expo-ui/datepicker/ios-light.webp)

- [DatePicker](/versions/latest/sdk/ui/swift-ui/datepicker)：DatePicker component for selecting dates and times.

![DisclosureGroup](/static/images/expo-ui/disclosuregroup/ios-light.webp)

- [DisclosureGroup](/versions/latest/sdk/ui/swift-ui/disclosuregroup)：DisclosureGroup component for displaying expandable content.

![Divider](/static/images/expo-ui/divider/ios-light.webp)

- [Divider](/versions/latest/sdk/ui/swift-ui/divider)：Divider component for creating visual separators.

![Form](/static/images/expo-ui/form/ios-light.webp)

- [Form](/versions/latest/sdk/ui/swift-ui/form)：Form component for collecting user input in a structured layout.

![Gauge](/static/images/expo-ui/gauge/ios-light.webp)

- [Gauge](/versions/latest/sdk/ui/swift-ui/gauge)：Gauge component for displaying progress with visual indicators.

- [Group](/versions/latest/sdk/ui/swift-ui/group)：Group component for grouping views without affecting layout.

- [Host](/versions/latest/sdk/ui/swift-ui/host)：Host component that enables SwiftUI components in React Native.

![HStack](/static/images/expo-ui/hstack/ios-light.webp)

- [HStack](/versions/latest/sdk/ui/swift-ui/hstack)：HStack component for horizontal layouts.

![Image](/static/images/expo-ui/image/ios-light.webp)

- [Image](/versions/latest/sdk/ui/swift-ui/image)：Image component for displaying SF Symbols.

![Label](/static/images/expo-ui/label/ios-light.webp)

- [Label](/versions/latest/sdk/ui/swift-ui/label)：Label component for displaying text with an icon.

- [LazyHStack](/versions/latest/sdk/ui/swift-ui/lazyhstack)：LazyHStack component for lazy horizontal layouts.

- [LazyVStack](/versions/latest/sdk/ui/swift-ui/lazyvstack)：LazyVStack component for lazy vertical layouts.

![Link](/static/images/expo-ui/link/ios-light.webp)

- [Link](/versions/latest/sdk/ui/swift-ui/link)：Link component for displaying clickable links.

![List](/static/images/expo-ui/list/ios-light.webp)

- [List](/versions/latest/sdk/ui/swift-ui/list)：List component for displaying scrollable lists of items.

![Menu](/static/images/expo-ui/menu/ios-light.webp)

- [Menu](/versions/latest/sdk/ui/swift-ui/menu)：Menu component for displaying dropdown menus.

- [Modifiers](/versions/latest/sdk/ui/swift-ui/modifiers)：View modifiers for customizing component appearance and behavior.

- [Namespace](/versions/latest/sdk/ui/swift-ui/namespace)：A Namespace component that allows you create Namespaces in SwiftUI

![Overlay](/static/images/expo-ui/overlay/ios-light.webp)

- [Overlay](/versions/latest/sdk/ui/swift-ui/overlay)：Overlay component for layering content on top of another view.

![Picker](/static/images/expo-ui/picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/swift-ui/picker)：Picker component for selecting options from a list.

![Popover](/static/images/expo-ui/popover/ios-light.webp)

- [Popover](/versions/latest/sdk/ui/swift-ui/popover)：Popover component for displaying content in a floating overlay.

![ProgressView](/static/images/expo-ui/progressview/ios-light.webp)

- [ProgressView](/versions/latest/sdk/ui/swift-ui/progressview)：ProgressView component for displaying progress indicators.

- [RNHostView](/versions/latest/sdk/ui/swift-ui/rnhostview)：A component that enables React Native views inside SwiftUI.

![ScrollView](/static/images/expo-ui/scrollview/ios-light.webp)

- [ScrollView](/versions/latest/sdk/ui/swift-ui/scrollview)：ScrollView component for scrollable content.

![Section](/static/images/expo-ui/section/ios-light.webp)

- [Section](/versions/latest/sdk/ui/swift-ui/section)：Section component for grouping content within lists and forms.

![SecureField](/static/images/expo-ui/securefield/ios-light.webp)

- [SecureField](/versions/latest/sdk/ui/swift-ui/securefield)：SecureField component for password input.

![Slider](/static/images/expo-ui/slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/swift-ui/slider)：Slider component for selecting values from a range.

![Spacer](/static/images/expo-ui/spacer/ios-light.webp)

- [Spacer](/versions/latest/sdk/ui/swift-ui/spacer)：Spacer component for flexible spacing.

- [SwipeActions](/versions/latest/sdk/ui/swift-ui/swipeactions)：SwipeActions component for adding leading and trailing swipe actions to row content.

![TabView](/static/images/expo-ui/tabview/ios-light.webp)

- [TabView](/versions/latest/sdk/ui/swift-ui/tabview)：TabView component for paged or tabbed content.

![Text](/static/images/expo-ui/text/ios-light.webp)

- [Text](/versions/latest/sdk/ui/swift-ui/text)：Text component for displaying styled text with support for nested texts.

![TextField](/static/images/expo-ui/textfield/ios-light.webp)

- [TextField](/versions/latest/sdk/ui/swift-ui/textfield)：TextField component for text input.

![Toggle](/static/images/expo-ui/toggle/ios-light.webp)

- [Toggle](/versions/latest/sdk/ui/swift-ui/toggle)：Toggle component for displaying native toggles.

- [useNativeState](/versions/latest/sdk/ui/swift-ui/usenativestate)：A React hook that creates observable state shared between JavaScript and native SwiftUI views.

![VStack](/static/images/expo-ui/vstack/ios-light.webp)

- [VStack](/versions/latest/sdk/ui/swift-ui/vstack)：VStack component for vertical layouts.

![ZStack](/static/images/expo-ui/zstack/ios-light.webp)

- [ZStack](/versions/latest/sdk/ui/swift-ui/zstack)：ZStack component for overlapping layouts.

### Drop-in replacements

![Android（Android）](/static/images/expo-ui/community-bottomsheet/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/drop-in-replacements/bottomsheet)：A bottom sheet compatible with @gorhom/bottom-sheet.

![Android（Android）](/static/images/expo-ui/community-datetimepicker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-datetimepicker/ios-light.webp)

- [DateTimePicker](/versions/latest/sdk/ui/drop-in-replacements/datetimepicker)：A date and time picker compatible with @react-native-community/datetimepicker.

![Android（Android）](/static/images/expo-ui/community-maskedview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-maskedview/ios-light.webp)

- [MaskedView](/versions/latest/sdk/ui/drop-in-replacements/maskedview)：A masked view compatible with @react-native-masked-view/masked-view.

![Android（Android）](/static/images/expo-ui/community-menu/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-menu/ios-light.webp)

- [Menu](/versions/latest/sdk/ui/drop-in-replacements/menu)：A menu compatible with @react-native-menu/menu.

![Android（Android）](/static/images/expo-ui/community-pagerview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-pagerview/ios-light.webp)

- [PagerView](/versions/latest/sdk/ui/drop-in-replacements/pagerview)：A horizontally paged view compatible with react-native-pager-view.

![Android（Android）](/static/images/expo-ui/community-picker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/drop-in-replacements/picker)：A picker compatible with @react-native-picker/picker.

![Android（Android）](/static/images/expo-ui/community-segmentedcontrol/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-segmentedcontrol/ios-light.webp)

- [SegmentedControl](/versions/latest/sdk/ui/drop-in-replacements/segmentedcontrol)：A segmented control compatible with @react-native-segmented-control/segmented-control.

![Android（Android）](/static/images/expo-ui/community-slider/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/community-slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/drop-in-replacements/slider)：A slider compatible with @react-native-community/slider.

### Universal

![Android（Android）](/static/images/expo-ui/bottomsheet/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/bottomsheet/ios-light.webp)

- [BottomSheet](/versions/latest/sdk/ui/universal/bottomsheet)：A modal sheet that slides up from the bottom of the screen.

![Android（Android）](/static/images/expo-ui/button/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/button/ios-light.webp)

- [Button](/versions/latest/sdk/ui/universal/button)：A pressable button with multiple visual variants.

![Android（Android）](/static/images/expo-ui/checkbox/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/checkbox/ios-light.webp)

- [Checkbox](/versions/latest/sdk/ui/universal/checkbox)：A toggle control that represents a checked or unchecked state.

![Android（Android）](/static/images/expo-ui/collapsible/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/collapsible/ios-light.webp)

- [Collapsible](/versions/latest/sdk/ui/universal/collapsible)：A labelled tappable header that toggles visibility of its content.

![Android（Android）](/static/images/expo-ui/column/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/column/ios-light.webp)

- [Column](/versions/latest/sdk/ui/universal/column)：A vertical layout container for universal @expo/ui components.

![Android（Android）](/static/images/expo-ui/fieldgroup/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/fieldgroup/ios-light.webp)

- [FieldGroup](/versions/latest/sdk/ui/universal/fieldgroup)：A scrollable container of grouped settings-style rows.

![Android（Android）](/static/images/expo-ui/host/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/host/ios-light.webp)

- [Host](/versions/latest/sdk/ui/universal/host)：A cross-platform Host component that wraps universal @expo/ui content.

![Android（Android）](/static/images/expo-ui/icon/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/icon/ios-light.webp)

- [Icon](/versions/latest/sdk/ui/universal/icon)：A platform-native icon — SF Symbol on iOS, Material Symbol on Android.

![Android（Android）](/static/images/expo-ui/list/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/list/ios-light.webp)

- [List](/versions/latest/sdk/ui/universal/list)：A virtualized vertical container of rows, paired with a tappable ListItem primitive.

![Android（Android）](/static/images/expo-ui/picker/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/picker/ios-light.webp)

- [Picker](/versions/latest/sdk/ui/universal/picker)：A single-selection input with menu and wheel appearances.

![Android（Android）](/static/images/expo-ui/rnhostview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/rnhostview/ios-light.webp)

- [RNHostView](/versions/latest/sdk/ui/universal/rnhostview)：A cross-platform component for hosting React Native views inside @expo/ui views.

![Android（Android）](/static/images/expo-ui/row/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/row/ios-light.webp)

- [Row](/versions/latest/sdk/ui/universal/row)：A horizontal layout container for universal @expo/ui components.

![Android（Android）](/static/images/expo-ui/scrollview/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/scrollview/ios-light.webp)

- [ScrollView](/versions/latest/sdk/ui/universal/scrollview)：A scrollable container that supports vertical or horizontal scrolling.

![Android（Android）](/static/images/expo-ui/slider/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/slider/ios-light.webp)

- [Slider](/versions/latest/sdk/ui/universal/slider)：A control for selecting a value from a continuous or stepped range.

![Android（Android）](/static/images/expo-ui/spacer/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/spacer/ios-light.webp)

- [Spacer](/versions/latest/sdk/ui/universal/spacer)：A layout spacer that produces empty space between siblings.

![Android（Android）](/static/images/expo-ui/switch/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/switch/ios-light.webp)

- [Switch](/versions/latest/sdk/ui/universal/switch)：A toggle control that switches between on and off states.

![Android（Android）](/static/images/expo-ui/text/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/text/ios-light.webp)

- [Text](/versions/latest/sdk/ui/universal/text)：A component for displaying styled text content.

![Android（Android）](/static/images/expo-ui/textinput/android-light.webp)

![iOS（iOS）](/static/images/expo-ui/textinput/ios-light.webp)

- [TextInput](/versions/latest/sdk/ui/universal/textinput)：A text input backed by native SwiftUI and Jetpack Compose components, with a React Native-compatible API.

## Common questions

<details><summary>Can I use flexbox or other styles in Expo UI components?</summary>

Flexbox styles apply to the `Host` component itself. Once you are inside the native context, [`Yoga`](https://www.yogalayout.dev/) is not available. Define layouts with `Row` and `Column` on Android, or `HStack` and `VStack` on iOS.

</details>

<details><summary>What's the `Host` component?</summary>

`Host` is the bridge between React Native and the native UI toolkit. You must wrap every Expo UI component in one. You can think of it like [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/svg) in the DOM or [`<Canvas>`](https://shopify.github.io/react-native-skia/docs/canvas/overview/) in [`react-native-skia`](https://shopify.github.io/react-native-skia/). On iOS, it uses [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller) to render SwiftUI views in UIKit. See the universal [`Host`](/versions/latest/sdk/ui/universal/host) for cross-platform usage.

</details>

<details><summary>How is Expo UI different from libraries like `react-native-paper` or `react-native-elements`?</summary>

Expo UI is not "yet another" UI library and not an opinionated design kit. Instead, it's a primitives library. It exposes native Jetpack Compose and SwiftUI components directly to JavaScript, rather than re-implementing or simulating UI in JavaScript.

</details>

<details><summary>Can I use `@expo/ui/swift-ui` on Android or web?</summary>

No. `@expo/ui/swift-ui` renders SwiftUI views, which exist only on Apple platforms. Use [`@expo/ui/jetpack-compose`](/versions/latest/sdk/ui/jetpack-compose) for Android. Use the [universal components](/versions/latest/sdk/ui/universal) when you want one component tree for Android, iOS, and web.

</details>

<details><summary>Can I use React Native components inside SwiftUI components?</summary>

Yes, you can place React Native components as JSX children of Expo UI components. Expo UI automatically creates a [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) wrapper for you.
However, keep in mind that the SwiftUI layout system works differently from UIKit and has some limitations. According to Apple's documentation:

:::warning
SwiftUI fully controls the layout of the UIKit view's [`center`](https://developer.apple.com/documentation/UIKit/UIView/center), [`bounds`](https://developer.apple.com/documentation/UIKit/UIView/bounds), [`frame`](https://developer.apple.com/documentation/UIKit/UIView/frame), and [`transform`](https://developer.apple.com/documentation/UIKit/UIView/transform) properties. Don't directly set these layout-related properties on the view managed by a [`UIViewRepresentable`](https://developer.apple.com/documentation/swiftui/uiviewrepresentable) instance from your own code because that conflicts with SwiftUI and results in undefined behavior.
:::

Also note that once you render React Native components, you're leaving the SwiftUI context. To add Expo UI components again, reintroduce a `Host` wrapper.

Keep SwiftUI layouts self-contained. Interop is possible, but it works best when boundaries are clearly defined.

</details>

<details><summary>I'm a Jetpack Compose or SwiftUI developer. Why should I learn Expo UI?</summary>

React's promise of _"learn once, write anywhere"_ now extends to Jetpack Compose and SwiftUI. You can apply your existing knowledge to build apps that run in the React Native ecosystem. The same app can extend to the web through [DOM components](/guides/dom-components), and add 2D rendering with [`react-native-skia`](https://shopify.github.io/react-native-skia/) or 3D rendering with [`react-native-webgpu`](https://github.com/wcandillon/react-native-webgpu). Different parts of your app can use different approaches, because the integration works at the component level.

</details>

## Additional resources

- [Expo UI example](https://github.com/expo/expo/tree/main/apps/native-component-list/src/screens/UI)：The latest Expo UI examples.

- [Hot Chocolate app example](https://github.com/expo/hot-chocolate)：An example app replicating the YVR Hot Chocolate Fest app with Expo UI.

- [Expo UI multiplatform demo](https://github.com/react-native-tvos/ExpoUITV)：A project demonstrating the production-ready Expo UI package available in SDK 56 and later. The project works on both TV (Android TV, Apple TV) and mobile (Android, iOS). Demo screens include most of the available components for both Jetpack Compose and SwiftUI.

