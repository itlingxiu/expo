---
title: 模块 API 参考
description: Expo Modules API 的 API 参考。
---

# 模块 API 参考

原生模块 API 是建立在 [JSI](https://reactnative.dev/architecture/glossary#javascript-interfaces-jsi) 以及 React Native 所基于的其他底层原语之上的抽象层。它使用现代语言（Swift 和 Kotlin）构建，并提供易于使用、方便的 API，在可能的情况下跨平台保持一致。

## 定义组件

正如你在[入门](/modules/get-started)页面的代码片段中可能已经注意到的，每个模块类都必须实现 `definition` 函数。模块定义由描述模块功能与行为的 DSL 组件组成。

### Name

设置 JavaScript 代码用来引用该模块的名称。接受一个字符串作为参数。这可以从模块的类名推断出来，但建议显式设置以便更清晰。

```swift Swift / Kotlin
Name("MyModuleName")
```

### Constant

在 JavaScript 对象上定义一个常量属性。该属性仅在首次访问时计算一次，后续访问返回缓存的值。

**Swift**

```swift
Constant("PI") {
  Double.pi
}
```

**Kotlin**

```kotlin
Constant("PI") {
  Math.PI
}
```

### Constants

:::warning
**[已弃用](/more/release-statuses#deprecated)：** 请改用 [`Constant`](#constant)。
:::

在模块上设置常量属性。可以接受一个字典，或一个返回字典的闭包。

**Swift**

```swift
// 由字典创建
Constants([
  "PI": Double.pi
])

// 或由闭包返回
Constants {
  return [
    "PI": Double.pi
  ]
}
```

**Kotlin**

```kotlin
// 作为参数传入
Constants(
  "PI" to kotlin.math.PI
)

// 或由闭包返回
Constants {
  return@Constants mapOf(
    "PI" to kotlin.math.PI
  )
}
```

### Function

定义一个将导出到 JavaScript 的原生同步函数。同步意味着当该函数在 JavaScript 中执行时，其原生代码在同一线程上运行，并阻塞脚本的进一步执行，直到原生函数返回。

#### 参数

- **name**：`String` — 你将从 JavaScript 调用的函数名称。
- **body**：`(args...) -> ReturnType` — 函数被调用时运行的闭包。

该函数最多可以接收 8 个参数。这是因为 Swift 和 Kotlin 中泛型的限制，此组件必须为每种元数分别实现。

有关函数体中可以使用哪些类型的更多细节，请参阅[参数类型](#参数类型)一节。

**Swift**

```swift
Function("mySyncFunction") { (message: String) in
  return message
}
```

**Kotlin**

```kotlin
Function("mySyncFunction") { message: String ->
  return@Function message
}
```

```js JavaScript
import { requireNativeModule } from 'expo-modules-core';

// 假设我们已经把模块命名为 "MyModule"
const MyModule = requireNativeModule('MyModule');

function getMessage() {
  return MyModule.mySyncFunction('bar');
}
```

### AsyncFunction

定义一个始终返回 `Promise` 的 JavaScript 函数，其原生代码默认被分派到与 JavaScript 运行时所在线程不同的线程上。

#### 参数

- **name**：`String` — 你将从 JavaScript 调用的函数名称。
- **body**：`(args...) -> ReturnType` — 函数被调用时运行的闭包。

如果最后一个参数的类型是 `Promise`，该函数会等待 promise 被解决或拒绝，然后再把响应传回 JavaScript。否则，函数会立即以返回值解决，或在抛出异常时被拒绝。该函数最多可以接收 8 个参数（包括 promise）。

有关函数体中可以使用哪些类型的更多细节，请参阅[参数类型](#参数类型)一节。

当它满足以下情况时，建议使用 `AsyncFunction` 而不是 `Function`：

- 执行 I/O 密集型任务，例如发送网络请求或与文件系统交互
- 需要在不同线程上运行，例如用于 UI 相关任务的主 UI 线程
- 是一项大量或长时间运行的操作，会阻塞 JavaScript 线程，从而降低应用的响应性

**Swift**

```swift
AsyncFunction("myAsyncFunction") { (message: String) in
  return message
}

// 或者

AsyncFunction("myAsyncFunction") { (message: String, promise: Promise) in
  promise.resolve(message)
}
```

**Kotlin**

```kotlin
AsyncFunction("myAsyncFunction") { message: String ->
  return@AsyncFunction message
}

// 或者

// 请确保从 `expo.modules.kotlin` 导入 `Promise` 类，而不是从 `expo.modules.core` 导入。
AsyncFunction("myAsyncFunction") { message: String, promise: Promise ->
  promise.resolve(message)
}
```

```js JavaScript
import { requireNativeModule } from 'expo-modules-core';

// 假设我们已经把模块命名为 "MyModule"
const MyModule = requireNativeModule('MyModule');

async function getMessageAsync() {
  return await MyModule.myAsyncFunction('bar');
}
```

可以通过在该组件的结果上调用 `.runOnQueue` 函数来更改 `AsyncFunction` 的原生队列。

**Swift**

```swift
AsyncFunction("myAsyncFunction") { (message: String) in
  return message
}.runOnQueue(.main)
```

**Kotlin**

```kotlin
AsyncFunction("myAsyncFunction") { message: String ->
  return@AsyncFunction message
}.runOnQueue(Queues.MAIN)
```

---

#### Kotlin 协程

> 支持平台：Android。

`AsyncFunction` 在 Android 上可以接收一个可挂起的函数体。不过，它必须在 `Coroutine` 块之后以中缀表示法传入。你可以在[协程概述](https://kotlinlang.org/docs/coroutines-overview.html)中阅读更多关于可挂起函数和协程的内容。

带有可挂起函数体的 `AsyncFunction` 不能接收 `Promise` 作为参数。它使用挂起机制来执行异步调用。函数会立即以所提供的可挂起块的返回值解决，或在抛出异常时被拒绝。该函数最多可以接收 8 个参数。

默认情况下，挂起函数被分派到模块的协程作用域上。此外，从函数体块中调用的每一个其他可挂起函数都在同一作用域内运行。此作用域的生命周期与模块的生命周期绑定——当模块被释放时，所有未完成的挂起函数都会被取消。

```kotlin Kotlin
AsyncFunction("suspendFunction") Coroutine { message: String ->
  // 你可以在这里执行其他可挂起函数。
  // 例如，可以使用 `kotlinx.coroutines.delay` 延迟解决底层 promise。
  delay(5000)
  return@Coroutine message
}
```

### Property

直接在表示原生模块的 JavaScript 对象上定义一个新属性。这与在模块对象上调用 [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 相同。

要声明只读属性，可以使用需要两个参数的简写语法：

- **name**：`String` — 你将从 JavaScript 使用的属性名称。
- **getter**：`() -> PropertyType` — 属性的 getter 被调用时运行的闭包。

**Swift**

```swift
Property("foo") {
  return "bar"
}
```

**Kotlin**

```kotlin
Property("foo") {
  return@Property "bar"
}
```

对于可变属性，需要同时提供 getter 和 setter 闭包（使用下面的语法也可以声明只有 setter 的属性）：

- **name**：`String` — 你将从 JavaScript 使用的属性名称。
- **getter**：`() -> PropertyType` — 属性的 getter 被调用时运行的闭包。
- **setter**：`(newValue: PropertyType) -> void` — 属性的 setter 被调用时运行的闭包。

**Swift**

```swift
Property("foo")
  .get { return "bar" }
  .set { (newValue: String) in
    // 对新值做一些处理
  }
```

**Kotlin**

```kotlin
Property("foo")
  .get { return@get "bar" }
  .set { newValue: String ->
    // 对新值做一些处理
  }
```

```js JavaScript
import { requireNativeModule } from 'expo-modules-core';

// 假设我们已经把模块命名为 "MyModule"
const MyModule = requireNativeModule('MyModule');

// 获取属性值
MyModule.foo;

// 设置新值
MyModule.foo = 'foobar';
```

### View

使模块可以作为原生视图使用。视图定义中接受的定义组件有：[`Prop`](#prop)、[`Events`](#events)、[`GroupView`](#groupview) 和 [`AsyncFunction`](#asyncfunction)。

视图定义中的 [`AsyncFunction`](#asyncfunction) 会被添加到表示该原生视图的 React 组件的 React ref 上。此类异步函数会自动把原生视图实例作为第一个参数接收，并且默认在 UI 线程上运行。

#### 参数

- **viewType** — 将被渲染的原生视图的类。注意：在 Android 上，提供的类必须继承自 [`ExpoView`](#expoview)；在 iOS 上这是可选的。请参阅[扩展 `ExpoView`](#扩展-expoview)。
- **definition**：`() -> ViewDefinition` — 视图定义的构建器。

**Swift**

```swift
View(UITextView.self) {
  Prop("text") { }

  AsyncFunction("focus") { (view: UITextView) in
    view.becomeFirstResponder()
  }
}
```

**Kotlin**

```kotlin
View(TextView::class) {
  Prop("text") { }

  AsyncFunction("focus") { view: TextView ->
    view.requestFocus()
  }
}
```

:::note
计划支持渲染 SwiftUI 视图。目前，你可以使用 [`UIHostingController`](https://developer.apple.com/documentation/swiftui/uihostingcontroller)，并把它的 content view 添加到你的 UIKit 视图中。
:::

### 事件观察

#### Events

定义模块可以发送到 JavaScript 的事件名称。

:::note
此组件可以在 [`View`](#view) 块内部使用，以定义回调名称。请参阅[视图回调](#视图回调)。
:::

**Swift**

```swift
Events("onCameraReady", "onPictureSaved", "onBarCodeScanned")
```

**Kotlin**

```kotlin
Events("onCameraReady", "onPictureSaved", "onBarCodeScanned")
```

请参阅[发送事件](#发送事件)，了解如何从原生代码向 JavaScript/TypeScript 发送事件。

#### OnStartObserving

定义在添加第一个事件监听器时调用的函数。

你需要传入一个事件名称，以便把监听器限定到特定事件。当你需要按事件而不是全局地建立或拆除资源时，这很有用。

**Swift**

```swift
// 当添加 "onURLReceived" 的监听器时调用
OnStartObserving("onURLReceived") {
}
```

**Kotlin**

```kotlin
// 当添加 "onURLReceived" 的监听器时调用
OnStartObserving("onURLReceived") {
}
```

#### OnStopObserving

定义在某个给定事件的所有事件监听器都被移除时调用的函数。

与 `OnStartObserving` 一样，你需要传入一个事件名称，以便把监听器限定到特定事件。

**Swift**

```swift
// 当 "onURLReceived" 的监听器被移除时调用
OnStopObserving("onURLReceived") {
}
```

**Kotlin**

```kotlin
// 当 "onURLReceived" 的监听器被移除时调用
OnStopObserving("onURLReceived") {
}
```

### 生命周期监听器

#### OnCreate

定义模块的生命周期监听器，它在模块初始化之后立即被调用。如果你需要在模块初始化时进行设置，请使用它，而不是模块类的初始化器。

#### OnDestroy

定义模块的生命周期监听器，它在模块即将被释放时被调用。请使用它，而不是模块类的析构器。

#### OnAppContextDestroys

定义模块的生命周期监听器，它在拥有该模块的应用上下文即将被释放时被调用。

#### OnAppEntersForeground

> 支持平台：iOS。

定义在应用即将进入前台模式时调用的监听器。

:::note
此函数在 Android 上不可用——你可能想改用 [`OnActivityEntersForeground`](#onactivityentersforeground)。
:::

#### OnAppEntersBackground

> 支持平台：iOS。

定义在应用进入后台模式时调用的监听器。

:::note
此函数在 Android 上不可用——你可能想改用 [`OnActivityEntersBackground`](#onactivityentersbackground)。
:::

#### OnAppBecomesActive

> 支持平台：iOS。

定义在应用再次变为活动状态时调用的监听器（在 `OnAppEntersForeground` 之后）。

:::note
此函数在 Android 上不可用——你可能想改用 [`OnActivityEntersForeground`](#onactivityentersforeground)。
:::

#### OnActivityEntersForeground

> 支持平台：Android。

定义活动生命周期监听器，它在活动恢复之后立即被调用。

:::note
此函数在 iOS 上不可用——你可能想改用 [`OnAppEntersForeground`](#onappentersforeground)。
:::

#### OnActivityEntersBackground

> 支持平台：Android。

定义活动生命周期监听器，它在活动暂停之后立即被调用。

:::note
此函数在 iOS 上不可用——你可能想改用 [`OnAppEntersBackground`](#onappentersbackground)。
:::

#### OnActivityDestroys

> 支持平台：Android。

定义活动生命周期监听器，它在拥有 JavaScript 上下文的活动即将被销毁时被调用。

:::note
此函数在 iOS 上不可用——你可能想改用 [`OnAppEntersBackground`](#onappentersbackground)。
:::

#### OnActivityResult

> 支持平台：Android。

定义活动生命周期监听器，它在通过 `startActivityForResult` 启动的活动返回结果时被调用。

#### 参数

- **activity** — 接收结果的 Android activity。
- **payload** — 包含活动结果数据的对象。
  - **requestCode**：`Int` — 最初提供给 `startActivityForResult` 的请求码，用于标识结果的来源。
  - **resultCode**：`Int` — 子 activity 返回的结果码（例如 `Activity.RESULT_OK` 或 `Activity.RESULT_CANCELED`）。
  - **data** — 携带从所启动 activity 返回的结果数据的可选 intent。可以为 `null`。

```kotlin Kotlin
AsyncFunction('someFunc') {
  activity.startActivityForResult(someIntent, SOME_REQUEST_CODE)
}

OnActivityResult { activity, payload ->
}
```

#### OnNewIntent

> 支持平台：Android。

定义活动生命周期监听器，它在活动收到新 intent 时被调用（例如来自深层链接）。

#### 参数

- **intent**：`Intent` — 传递给该 activity 的新 intent。有关 `Intent` 类型的更多信息，请访问：[https://developer.android.com/reference/android/content/Intent](https://developer.android.com/reference/android/content/Intent)。

```kotlin Kotlin
OnNewIntent { intent ->
  val data = intent.data
  // 处理传入的 intent
}
```

#### OnUserLeavesActivity

> 支持平台：Android。

定义活动生命周期监听器，它在活动生命周期中、活动因用户选择而即将进入后台时被调用。例如，当用户按下 Home 键时，会调用 `OnUserLeavesActivity`；但当来电导致通话中 Activity 被自动带到前台时，不会在被中断的 activity 上调用 `OnUserLeavesActivity`。

```kotlin Kotlin
OnUserLeavesActivity {
  // 你的实现
}
```

#### RegisterActivityContracts

> 支持平台：Android。

注册 Android [activity result contracts](https://developer.android.com/training/basics/intents/result)，让你能够以类型安全的方式启动 activity 并处理其结果。这是 `startActivityForResult` 的现代替代方案。

在 `RegisterActivityContracts` 块内部，使用 `registerForActivityResult` 注册每个 contract。随后可以在异步函数中使用已注册的 launcher 来启动 activity。

```kotlin Kotlin
class ImagePickerModule : Module() {
  private lateinit var cameraLauncher: ActivityResultLauncher<CameraContractOptions>
  private lateinit var imageLibraryLauncher: ActivityResultLauncher<ImageLibraryContractOptions>

  override fun definition() = ModuleDefinition {
    Name("ImagePicker")

    RegisterActivityContracts {
      cameraLauncher = registerForActivityResult(
        CameraContract(this@ImagePickerModule)
      ) { input, result ->
        handleResult(result, input.options)
      }

      imageLibraryLauncher = registerForActivityResult(
        ImageLibraryContract(this@ImagePickerModule)
      ) { input, result ->
        handleResult(result, input.options)
      }
    }

    AsyncFunction("launchCameraAsync") { options: PickerOptions ->
      cameraLauncher.launch(CameraContractOptions(options))
    }
  }
}
```

## 视图定义组件

视图定义由描述视图功能与行为的 DSL 组件组成。这些组件只能在 [`View`](#view) 闭包内使用。

### Name

设置 JavaScript 代码用来引用该视图的名称。接受一个字符串作为参数。这可以从视图的类名推断出来，但建议显式设置以便更清晰。

```swift Swift / Kotlin
Name("MyViewName")
```

### Prop

为给定名称的视图 prop 定义一个 setter。

#### 参数

- **name**：`String` — 你想为其定义 setter 的视图 prop 名称。
- **defaultValue**：`ValueType` — 当 setter 以 `null` 被调用时使用的可选默认值。
- **setter**：`(view: ViewType, value: ValueType) -> ()` — 视图重新渲染时调用的闭包。

此属性只能在 [`View`](#view) 闭包内使用。

**Swift**

```swift
Prop("background") { (view: UIView, color: UIColor) in
  view.backgroundColor = color
}
```

**Kotlin**

```kotlin
Prop("background") { view: View, @ColorInt color: Int ->
  view.setBackgroundColor(color)
}
```

带默认值的 Prop 定义。

**Swift**

```swift
Prop("background", UIColor.black) { (view: UIView, color: UIColor) in
  view.backgroundColor = color
}
```

**Kotlin**

```kotlin
Prop("background", Color.BLACK) { view: View, @ColorInt color: Int ->
  view.setBackgroundColor(color)
}
```

:::note
函数类型的 props（回调）尚不支持。
:::

### PropGroup

> 支持平台：Android。

批量注册共享同一 setter 模式的多个 prop。你可以一次性注册它们并使用单个处理程序，而不是逐个定义每个 prop。

有两种重载可用：

- **基于 Pair**：每个 prop 是一个 `Pair<String, CustomValueType>`。处理程序接收视图、映射后的自定义值以及 prop 值。
- **基于字符串**：每个 prop 是一个名称字符串。处理程序接收视图、位置索引以及 prop 值。

```kotlin Kotlin
// 基于 Pair：把每个 prop 名称映射到一个自定义值
PropGroup(
  "borderTopColor" to LogicalEdge.TOP,
  "borderBottomColor" to LogicalEdge.BOTTOM,
  "borderLeftColor" to LogicalEdge.LEFT,
  "borderRightColor" to LogicalEdge.RIGHT
) { view: View, edge: LogicalEdge, color: Int? ->
  BackgroundStyleApplicator.setBorderColor(view, edge, color)
}

// 基于字符串：使用位置索引
PropGroup(
  "borderWidth", "borderLeftWidth", "borderRightWidth",
  "borderTopWidth", "borderBottomWidth"
) { view: View, index: Int, width: Float? ->
  val edge = LogicalEdge.entries[index]
  BackgroundStyleApplicator.setBorderWidth(view, edge, width ?: Float.NaN)
}
```

:::note
`PropGroup` 由 CSS prop 装饰器在内部使用。除非模块有许多共享同一 setter 模式的 prop，否则大多数模块应使用单独的 `Prop` 定义。
:::

### 生命周期

#### OnViewDidUpdateProps

定义视图生命周期方法，它在视图完成更新所有 prop 时被调用。

```swift
OnViewDidUpdateProps { view: MyView in
}
```

```kotlin
OnViewDidUpdateProps { view: MyView ->
}
```

#### OnViewDestroys

> 支持平台：Android。

创建视图的生命周期监听器，它在视图不再被 React Native 使用之后立即被调用。

```kotlin
View(MyView::class) {
  OnViewDestroys { view: MyView ->
  }
}
```

:::note
此函数在 iOS 上不可用。你可能想使用原生视图的析构器来达到类似效果。
:::

### AsyncFunction

与模块定义中的 [`AsyncFunction`](#asyncfunction) 类似，你可以定义附加到视图 ref 上的函数，以便直接修改原生视图。

视图异步函数始终会被分派到主队列，并且可以把视图实例作为第一个参数接收。

**Swift**

```swift
View(MyView.self) {
  AsyncFunction("myAsyncFunction") { (view: MyView, message: String) in
    view.displayMessage(message)
  }
}
```

**Kotlin**

```kotlin
View(MyView::class) {
  AsyncFunction("myAsyncFunction") { view: MyView, message: String ->
    view.displayMessage(message);
  }
}
```

```js JavaScript
const MyNativeView = requireNativeViewManager('MyView');

function MyComponent() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current?.myAsyncFunction();
  }, [ref]);

  return <MyNativeView ref={ref} />;
}
```

### 视图组

#### GroupView

> 支持平台：Android。

使视图可以作为视图组使用。视图组定义中接受的定义组件有：[`AddChildView`](#addchildview)、[`GetChildCount`](#getchildcount)、[`GetChildViewAt`](#getchildviewat)、[`RemoveChildView`](#removechildview)、[`RemoveChildViewAt`](#removechildviewat)。

#### 参数

- **viewType** — 原生视图的类。注意，提供的类必须继承自 Android 的 `ViewGroup`。
- **definition**：`() -> ViewGroupDefinition` — 视图组定义的构建器。

此属性只能在 [`View`](#view) 闭包内使用。

```kotlin Kotlin
GroupView<ViewGroup> {
  AddChildView { parent, child, index -> }
}
```

#### AddChildView

> 支持平台：Android。

定义把子视图添加到视图组的操作。

#### 参数

- **action**：`(parent: ParentType, child: ChildType, index: Int) -> ()` — 把子视图添加到视图组的操作。

此属性只能在 [`GroupView`](#groupview) 闭包内使用。

```kotlin Kotlin
AddChildView { parent, child: View, index ->
  parent.addView(child, index)
}
```

#### GetChildCount

> 支持平台：Android。

定义用于获取视图组中子视图数量的操作。

#### 参数

- **action**：`(parent: ParentType) -> Int` — 返回子视图数量的函数。

此属性只能在 [`GroupView`](#groupview) 闭包内使用。

```kotlin Kotlin
GetChildCount { parent ->
  return@GetChildCount parent.childCount
}
```

#### GetChildViewAt

> 支持平台：Android。

定义从视图组中按特定索引获取子视图的操作。

#### 参数

- **action**：`(parent: ParentType, index: Int) -> ChildType` — 从视图组中按特定索引获取子视图的函数。

此属性只能在 [`GroupView`](#groupview) 闭包内使用。

```kotlin Kotlin
GetChildViewAt { parent, index ->
  parent.getChildAt(index)
}
```

#### RemoveChildView

> 支持平台：Android。

定义从视图组中移除特定子视图的操作。

#### 参数

- **action**：`(parent: ParentType, child: ChildType) -> ()` — 从视图组中移除特定子视图的函数。

此属性只能在 [`GroupView`](#groupview) 闭包内使用。

```kotlin Kotlin
RemoveChildView { parent, child: View ->
  parent.removeView(child)
}
```

#### RemoveChildViewAt

> 支持平台：Android。

定义从视图组中按特定索引移除子视图的操作。

#### 参数

- **action**：`(parent: ParentType, child: ChildType) -> ()` — 从视图组中按特定索引移除子视图的函数。

此属性只能在 [`GroupView`](#groupview) 闭包内使用。

```kotlin Kotlin
RemoveChildViewAt { parent, index ->
  parent.removeViewAt(child)
}
```

## 参数类型

从根本上说，只有原始类型和可序列化的数据可以在运行时之间来回传递。然而，原生模块通常需要接收自定义数据结构——比值类型未知（`Any`）、因而每个值都必须自行校验和转换的字典/映射更为复杂。Expo Modules API 提供了一些协议，使处理数据对象更加方便，提供自动校验，并最终确保每个对象成员都具备原生类型安全。

### Primitives

所有函数和视图 prop setter 都接受 Swift 和 Kotlin 中所有常见的原始类型作为参数。这包括这些原始类型的数组、字典/映射以及可选类型。

| 语言 | 支持的原始类型 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Swift | `Bool`、`Int`、`Int8`、`Int16`、`Int32`、`Int64`、`UInt`、`UInt8`、`UInt16`、`UInt32`、`UInt64`、`Float32`、`Double`、`String` |
| Kotlin | `Boolean`、`Int`、`Long`、`Float`、`Double`、`String`、`Pair` |

### Convertibles

_Convertibles_ 是可以从 JavaScript 收到的某些特定种类数据初始化的原生类型。此类类型允许用作 `Function` 函数体中的参数类型。例如，当 `CGPoint` 类型用作函数参数类型时，其实例可以从两个数字的数组 `(x, y)` 或带有数值 `x` 和 `y` 属性的 JavaScript 对象创建。

内置 Convertibles 在[下文](#内置-convertibles)中说明。

你可以通过让原生 Swift 类型遵循 `Convertible` 协议来定义额外的 Convertibles：

#### Convertible

> 支持平台：iOS。

`Convertible` 是一个带有一个静态方法的 Swift 协议：

#### `convert(value, appContext)`

把来自 JavaScript 的动态类型值转换为遵循 `Convertible` 的 Swift 类型实例的静态方法。当给定值无效或类型不受支持时，实现者应抛出异常。

返回 `Self`。

参数：

- `value`：`Any?` — 要转换的来自 JavaScript 的值。
- `appContext`：`AppContext` — 当前正在运行的 Expo 应用实例的上下文对象。

#### 代码示例

```swift Swift
import ExpoModulesCore

extension CMTime: @retroactive Convertible {
  public static func convert(from value: Any?, appContext: AppContext) throws -> CMTime {
    if let seconds = value as? Double {
      return CMTime(seconds: seconds, preferredTimescale: .max)
    }
    throw Conversions.ConvertingException<CMTime>(value)
  }
}
```

在 Kotlin 中，无法用协议扩展现有类型。要扩展可用类型，可以使用 `ModuleConverters` 构建器：

#### ModuleConverters

> 支持平台：Android。

在 Android 上，模块可以定义自定义类型转换器，允许把非标准类型用作函数参数。在你的 `Module` 类中重写 `converters()` 方法，并使用 `ModuleConverters` 构建器通过 `.from<SourceType> { }` 链注册转换器。

```kotlin Kotlin
class MyModule : Module() {
  override fun converters() = ModuleConverters {
    TypeConverter(CustomType::class)
      .from { number: Int ->
        CustomType.fromInt(number)
      }
      .from { string: String ->
        CustomType.parse(string)
      }
  }

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    // 现在可以把 CustomType 用作参数类型
    Function("process") { value: CustomType ->
      value.doSomething()
    }
  }
}
```

每次 `.from<T> { }` 调用都会注册一个从类型 `T` 到你的自定义类型的转换器。在运行时，框架会依次尝试每个已注册的转换器，直到有一个与传入的 JavaScript 值匹配。

:::note
在 iOS 上，请改用上面说明的 `Convertible` 协议。
:::

### 内置 Convertibles

`CoreGraphics` 和 `UIKit` 系统框架中的一些常见 iOS 类型已经被做成可转换的。

| 原生 iOS 类型 | TypeScript |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `URL` | 带有 URL 的 `string`。未提供 scheme 时，假定为文件 URL。 |
| `CGFloat` | `number` |
| `CGPoint` | `{ x: number, y: number }`，或带有 _x_ 和 _y_ 坐标的 `number[]` |
| `CGSize` | `{ width: number, height: number }`，或带有 _width_ 和 _height_ 的 `number[]` |
| `CGVector` | `{ dx: number, dy: number }`，或带有 _dx_ 和 _dy_ 向量差分的 `number[]` |
| `CGRect` | `{ x: number, y: number, width: number, height: number }`，或带有 _x_、_y_、_width_ 和 _height_ 值的 `number[]` |
| `CGColor`<br/>`UIColor` | 颜色十六进制字符串（`#RRGGBB`、`#RRGGBBAA`、`#RGB`、`#RGBA`）、遵循 [CSS3/SVG 规范](https://www.w3.org/TR/css-color-3/#svg-color)的命名颜色，或 `"transparent"` |
| `Data` | `Uint8Array`（SDK 50+） |

---

类似地，`java.io`、`java.net` 或 `android.graphics` 等包中的一些常见 Android 类型也被做成可转换的。

:::note
在 Android 上，应尽可能使用原始数组。
:::

| 原生 Android 类型 | TypeScript |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `java.net.URL` | 带有 URL 的 `string`。注意必须提供 scheme（URL 不应包含任何未编码的 `%` 字符） |
| `android.net.Uri`<br/>`java.net.URI` | 带有 URI 的 `string`。注意必须提供 scheme（URI 不应包含任何未编码的 `%` 字符） |
| `java.io.File`<br/>`java.nio.file.Path`（仅在 Android API 26 上可用） | 带有文件路径的 `string` |
| `android.graphics.Color` | 颜色十六进制字符串（`#RRGGBB`、`#RRGGBBAA`、`#RGB`、`#RGBA`）、遵循 [CSS3/SVG 规范](https://www.w3.org/TR/css-color-3/#svg-color)的命名颜色，或 `"transparent"` |
| `kotlin.Pair<A, B>` | 包含两个值的数组，第一个值的类型为 _A_，第二个值的类型为 _B_ |
| `kotlin.ByteArray` | `Uint8Array`（SDK 50+） |
| `kotlin.BooleanArray` | `boolean[]` |
| `kotlin.IntArray`<br/>`kotlin.FloatArray`<br/>`kotlin.LongArray`<br/>`kotlin.DoubleArray` | `number[]` |
| `kotlin.time.Duration` | `number`，表示以秒为单位的时长（SDK 52+） |

### Records

_Record_ 是一种可转换类型，相当于字典（Swift）或映射（Kotlin），但表示为结构体，其中每个字段都可以有自己的类型并提供默认值。这是用原生类型安全表示 JavaScript 对象的更好方式。

**Swift**

```swift
struct FileReadOptions: Record {
  @Field
  var encoding: String = "utf8"

  @Field
  var position: Int = 0

  @Field
  var length: Int?
}

// 现在可以把此 record 用作函数或视图 prop setter 的参数。
Function("readFile") { (path: String, options: FileReadOptions) -> String in
  // 使用给定的 `options` 读取文件
}
```

**Kotlin**

```kotlin
class FileReadOptions : Record {
  @Field
  val encoding: String = "utf8"

  @Field
  val position: Int = 0

  @Field
  val length: Int? = null
}

// 现在可以把此 record 用作函数或视图 prop setter 的参数。
Function("readFile") { path: String, options: FileReadOptions ->
  // 使用给定的 `options` 读取文件
}
```

### Formatter

:::warning
**此功能是[实验性](/more/release-statuses#experimental)的。**
:::

Formatter API 允许你自定义从原生函数返回时 Record 的序列化方式。当你需要在把属性值发送到 JavaScript 之前对其进行转换，或有条件地从输出中排除某些属性时，这很有用。

#### 操作

- **map**：在序列化之前转换属性的值。
- **skip**：把属性从输出中完全排除。

#### 基本用法

**Swift**

```swift
struct UserInfo: Record {
  @Field var id: Int = 0
  @Field var email: String = ""
  @Field var password: String = ""
}

Function("getUser") {
  let user = UserInfo(id: 1, email: "user@example.com", password: "secret123")

  // 返回用户信息，但不暴露密码
  return user.format { formatter in
    formatter.property("password", keyPath: \.password).skip()
  }
}
```

**Kotlin**

```kotlin
class UserInfo(
  @Field val id: Int = 0,
  @Field val email: String = "",
  @Field val password: String = ""
) : Record

Function("getUser") {
  val user = UserInfo(id = 1, email = "user@example.com", password = "secret123")

  // 返回用户信息，但不暴露密码
  formatter {
    property(UserInfo::password).skip()
  }.format(user)
}
```

```js JavaScript
const user = MyModule.getUser();
console.log(user);
// 输出：{ id: 1, email: "user@example.com" }
// 注意：对象中不存在 password
```

#### 使用 `map` 转换值

使用 `map` 在属性值发送到 JavaScript 之前对其进行转换：

**Swift**

```swift
struct Product: Record {
  @Field var name: String = ""
  @Field var price: Double = 0.0
}

Function("getProduct") {
  let product = Product(name: "Widget", price: 19.99)

  return product.format { formatter in
    // 转换价格以包含货币符号
    formatter.property("price", keyPath: \.price).map { value in
      "$\(String(format: "%.2f", value))"
    }
  }
}
```

**Kotlin**

```kotlin
class Product(
  @Field val name: String = "",
  @Field val price: Double = 0.0
) : Record

Function("getProduct") {
  val product = Product(name = "Widget", price = 19.99)

  formatter {
    // 转换价格以包含货币符号
    property(Product::price).map { value ->
      "${"$"}${String.format("%.2f", value)}"
    }
  }.format(product)
}
```

#### 有条件地跳过

你可以根据属性的值或 record 的状态有条件地跳过属性：

**Swift**

```swift
struct Settings: Record {
  @Field var theme: String = "light"
  @Field var debugMode: Bool = false
  @Field var apiKey: String? = nil
}

Function("getSettings") {
  let settings = Settings(theme: "dark", debugMode: true, apiKey: "secret")

  return settings.format { formatter in
    // 如果为 nil 则跳过 apiKey
    formatter.property("apiKey", keyPath: \.apiKey).skip { value in
      value == nil
    }
  }
}
```

**Kotlin**

```kotlin
class Settings(
  @Field val theme: String = "light",
  @Field val debugMode: Boolean = false,
  @Field val apiKey: String? = null
) : Record

Function("getSettings") {
  val settings = Settings(theme = "dark", debugMode: true, apiKey = "secret")

  formatter {
    // 如果为 null 则跳过 apiKey
    property(Settings::apiKey).skip { value ->
      value == null
    }
  }.format(settings)
}
```

#### 链式操作

你可以对同一属性链式调用多个操作：

**Swift**

```swift
struct Data: Record {
  @Field var value: Int? = nil
}

Function("getData") {
  let data = Data(value: nil)

  return data.format { formatter in
    formatter.property("value", keyPath: \.value)
      .map { $0 ?? 0 }  // 如果为 nil 则默认为 0
      .map { $0 * 2 }   // 将值加倍
  }
}
```

**Kotlin**

```kotlin
class Data(
  @Field val value: Int? = null
) : Record

Function("getData") {
  val data = Data(value = null)

  formatter {
    property(Data::value)
      .map { it ?: 0 }  // 如果为 null 则默认为 0
      .map { it * 2 }   // 将值加倍
  }.format(data)
}
```

### Enums

借助枚举，我们可以把上面的示例（`FileReadOptions` record）再推进一步，把支持的编码限制为 `"utf8"` 和 `"base64"`。要把枚举用作参数或 record 字段，它必须表示一个原始值（例如 `String`、`Int`）并遵循 `Enumerable`。

**Swift**

```swift
enum FileEncoding: String, Enumerable {
  case utf8
  case base64
}

struct FileReadOptions: Record {
  @Field
  var encoding: FileEncoding = .utf8
}
```

**Kotlin**

```kotlin
// 注意：构造函数必须有一个名为 value 的参数。
enum class FileEncoding(val value: String) : Enumerable {
  utf8("utf8"),
  base64("base64")
}

class FileReadOptions : Record {
  @Field
  val encoding: FileEncoding = FileEncoding.utf8
}
```

### Eithers

在某些用例中，你希望为单个函数参数传入多种类型。这时 Either 类型可能会派上用场。它们充当几种类型之一的值的容器。

**Swift**

```swift
Function("foo") { (bar: Either<String, Int>) in
  if let bar: String = bar.get() {
    // `bar` 是 String
  }
  if let bar: Int = bar.get() {
    // `bar` 是 Int
  }
}
```

**Kotlin**

```kotlin
Function("foo") { bar: Either<String, Int> ->
  bar.get(String::class).let {
    // `it` 是 String
  }
  bar.get(Int::class).let {
    // `it` 是 Int
  }
}
```

目前开箱提供了三种 Either 类型的实现，允许你使用最多四种不同的子类型。

- `Either<FirstType, SecondType>` — 两种类型之一的容器。
- `EitherOfThree<FirstType, SecondType, ThirdType>` — 三种类型之一的容器。
- `EitherOfFour<FirstType, SecondType, ThirdType, FourthType>` — 四种类型之一的容器。

### ValueOrUndefined

:::warning
**此功能是[实验性](/more/release-statuses#experimental)的。**
:::

`ValueOrUndefined` 是一种包装类型，允许你区分 JavaScript 的 `undefined` 值和实际值。

使用常规可选类型时，来自 JavaScript 的 `undefined` 和 `null` 都会在原生侧转换为 `null`，从而无法区分它们。`ValueOrUndefined` 通过保留这一区别来解决该问题。

#### 属性

#### `isUndefined`

如果 JavaScript 值为 `undefined` 则返回 `true`，否则返回 `false`。

返回 `Bool`。

#### `optional`

如果存在则返回解包后的值；如果值为 `undefined` 则返回 `null`。

返回 `InnerType?`。

**Swift**

```swift
Function("configure") { (timeout: ValueOrUndefined<Int>) in
  if timeout.isUndefined {
    // 未提供参数，使用默认行为
  } else if let value = timeout.optional {
    // 提供了带值的参数
  }
}
```

**Kotlin**

```kotlin
Function("configure") { timeout: ValueOrUndefined<Int> ->
  if (timeout.isUndefined) {
    // 未提供参数，使用默认行为
  } else {
    timeout.optional?.let { value ->
      // 提供了带值的参数
    }
  }
}
```

#### 区分 `undefined` 与 `null`

当 `ValueOrUndefined` 与可选的内部类型一起使用时，你可以区分三种状态：

**Swift**

```swift
Function("setName") { (name: ValueOrUndefined<String?>) in
  switch name {
  case .undefined:
    // 未提供 name 参数
    break
  case .value(let unwrapped) where unwrapped == nil:
    // name 被显式设为 null
    break
  case .value(let unwrapped):
    // name 被设为一个字符串值
    print("Name: \(unwrapped!)")
  }
}
```

**Kotlin**

```kotlin
Function("setName") { name: ValueOrUndefined<String?> ->
  when {
    name.isUndefined -> {
      // 未提供 name 参数
    }
    name.optional == null -> {
      // name 被显式设为 null
    }
    else -> {
      // name 被设为一个字符串值
      println("Name: ${name.optional}")
    }
  }
}
```

```js JavaScript
import { requireNativeModule } from 'expo-modules-core';

const MyModule = requireNativeModule('MyModule');

MyModule.setName('Alice'); // name 是一个值
MyModule.setName(null); // name 是 null（但不是 undefined）
MyModule.setName(undefined); // name 是 undefined
```

### JavaScript 值

也可以使用 `JavaScriptValue` 类型，它是任何可以在 JavaScript 中表示的值的持有者。当你想改变给定参数，或想省略类型校验和转换时，此类型很有用。请注意，使用 JavaScript 特定类型仅限于同步函数，因为 JavaScript 运行时中的所有读写都必须发生在 JavaScript 线程上。从不同线程访问这些值会导致崩溃。

除了原始值之外，还可以使用 `JavaScriptObject` 类型以仅允许对象类型，以及使用 `JavaScriptFunction<ReturnType>` 表示回调。

**Swift**

```swift
Function("mutateMe") { (value: JavaScriptValue) in
  if value.isObject() {
    let jsObject = value.getObject()
    jsObject.setProperty("expo", value: "modules")
  }
}

// 或者

Function("mutateMe") { (jsObject: JavaScriptObject) in
  jsObject.setProperty("expo", value: "modules")
}
```

**Kotlin**

```kotlin
Function("mutateMe") { value: JavaScriptValue ->
  if (value.isObject()) {
    val jsObject = value.getObject()
    jsObject.setProperty("expo", "modules")
  }
}

// 或者

Function("mutateMe") { jsObject: JavaScriptObject ->
  jsObject.setProperty("expo", "modules")
}
```

## 原生类

### Module

原生模块的基类。

#### 属性

#### `appContext`

提供对 [`AppContext`](#appcontext) 的访问。

返回 `AppContext`。

#### 方法

#### `sendEvent(eventName, payload)`

向 JavaScript 发送具有给定名称和载荷的事件。请参阅[发送事件](#发送事件)。

返回 `void`。

参数：

- `eventName`：`string` — JavaScript 事件的名称。
- `payload` — 事件载荷。Android：`Map<String, Any?> | Bundle`。iOS：`[String: Any?]`。

### AppContext

应用上下文是单个 Expo 应用的接口。

#### 属性

#### `constants`

提供对来自旧版模块注册表的应用常量的访问。

返回 `Android: ConstantsInterface? iOS: EXConstantsInterface?`。

#### `permissions`

提供对来自旧版模块注册表的权限管理器的访问。

返回 `Android: Permissions? iOS: EXPermissionsInterface?`。

#### `activityProvider`

> 支持平台：Android。

提供对来自旧版模块注册表的 activity provider 的访问。

返回 `ActivityProvider?`。

#### `reactContext`

> 支持平台：Android。

提供对 React 应用上下文的访问。

返回 `Context?`。

#### `hasActiveReactInstance`

> 支持平台：Android。

检查是否存在非空且存活的 React Native 实例。

返回 `Boolean`。

#### `utilities`

> 支持平台：iOS。

提供对来自旧版模块注册表的实用工具的访问。

返回 `EXUtilitiesInterface?`。

### ExpoView

所有导出视图都应使用的基类。

在 iOS 上，`ExpoView` 扩展了 `RCTView`，后者处理一些样式（例如边框）和无障碍功能。

#### 属性

#### `appContext`

提供对 [`AppContext`](#appcontext) 的访问。

返回 `AppContext`。

#### 扩展 `ExpoView`

要使用 [`View`](#view) 组件导出你的视图，自定义类必须继承自 `ExpoView`。这样做你将获得对 [`AppContext`](#appcontext) 对象的访问。这是与其他模块和 JavaScript 运行时通信的唯一方式。此外，你不能更改构造函数参数，因为提供的视图将由 `expo-modules-core` 初始化。

**Swift**

```swift
class LinearGradientView: ExpoView {}

public class LinearGradientModule: Module {
  public func definition() -> ModuleDefinition {
    View(LinearGradientView.self) {
    }
  }
}
```

**Kotlin**

```kotlin
class LinearGradientView(
  context: Context,
  appContext: AppContext,
) : ExpoView(context, appContext)

class LinearGradientModule : Module() {
  override fun definition() = ModuleDefinition {
    View(LinearGradientView::class) {
    }
  }
}
```

## 指南

### 发送事件

虽然 JavaScript/TypeScript 到 Native 的通信主要由原生函数覆盖，你可能还希望让 JavaScript/TypeScript 代码了解某些系统事件，例如剪贴板内容发生变化时。

为此，在模块定义中，你需要使用 [Events](#events) 定义组件提供模块可以发送的事件名称。之后，你可以在模块实例上使用 `sendEvent(eventName, payload)` 函数来发送带有某些载荷的实际事件。例如，一个发送原生事件的最小剪贴板实现可能如下所示：

**Swift**

```swift
let CLIPBOARD_CHANGED_EVENT_NAME = "onClipboardChanged"

public class ClipboardModule: Module {
  public func definition() -> ModuleDefinition {
    Events(CLIPBOARD_CHANGED_EVENT_NAME)

    OnStartObserving {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.clipboardChangedListener),
        name: UIPasteboard.changedNotification,
        object: nil
      )
    }

    OnStopObserving {
      NotificationCenter.default.removeObserver(
        self,
        name: UIPasteboard.changedNotification,
        object: nil
      )
    }
  }

  @objc
  private func clipboardChangedListener() {
    sendEvent(CLIPBOARD_CHANGED_EVENT_NAME, [
      "contentTypes": availableContentTypes()
    ])
  }
}
```

**Kotlin**

```kotlin
const val CLIPBOARD_CHANGED_EVENT_NAME = "onClipboardChanged"

class ClipboardModule : Module() {
  override fun definition() = ModuleDefinition {
    Events(CLIPBOARD_CHANGED_EVENT_NAME)

    OnStartObserving {
      clipboardManager?.addPrimaryClipChangedListener(listener)
    }

    OnStopObserving {
      clipboardManager?.removePrimaryClipChangedListener(listener)
    }
  }

  private val clipboardManager: ClipboardManager?
    get() = appContext.reactContext?.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager

  private val listener = ClipboardManager.OnPrimaryClipChangedListener {
    clipboardManager?.primaryClipDescription?.let { clip ->
      this@ClipboardModule.sendEvent(
        CLIPBOARD_CHANGED_EVENT_NAME,
        bundleOf(
          "contentTypes" to availableContentTypes(clip)
        )
      )
    }
  }
}
```

要在 JavaScript/TypeScript 中订阅这些事件，请在 `requireNativeModule` 返回的模块对象上使用 [`addListener`](/versions/latest/sdk/expo#eventemittertype)。模块扩展了内置的 [`EventEmitter`](/versions/latest/sdk/expo#eventemittertype) 类。你也可以使用 [`useEvent`](/versions/latest/sdk/expo#useeventeventemitter-eventname-initialvalue) 或 [`useEventListener`](/versions/latest/sdk/expo#useeventlistenereventemitter-eventname-listener) 钩子。

```ts TypeScript
import { requireNativeModule, NativeModule } from 'expo';

type ClipboardChangeEvent = {
  contentTypes: string[];
};

type ClipboardModuleEvents = {
  onClipboardChanged(event: ClipboardChangeEvent): void;
};

declare class ClipboardModule extends NativeModule<ClipboardModuleEvents> {}

const Clipboard = requireNativeModule<ClipboardModule>('Clipboard');

Clipboard.addListener('onClipboardChanged', (event: ClipboardChangeEvent) => {
  alert('Clipboard has changed');
});
```

### 视图回调

有些事件与某个特定视图相关联。例如，触摸事件应只发送到底层被按下的 JavaScript 视图。在这种情况下，你不能使用[发送事件](#发送事件)中描述的 `sendEvent`。`expo-modules-core` 引入了视图回调机制来处理与视图绑定的事件。

要使用它，在视图定义中，你需要使用 [Events](#events) 定义组件提供视图可以发送的事件名称。之后，你需要在视图类中声明一个类型为 `EventDispatcher` 的属性。所声明属性的名称必须与 `Events` 组件中导出的名称相同。随后，你可以把它作为函数调用，并传入类型为 iOS 上 `[String: Any?]`、Android 上 `Map<String, Any?>` 的载荷。

:::note
在 Android 上，可以指定载荷类型。对于不能转换为对象的类型，载荷会被封装并存储在 `payload` 键下：`{payload: <provided value>}`。
:::

**Swift**

```swift
class CameraViewModule: Module {
  public func definition() -> ModuleDefinition {
    View(CameraView.self) {
      Events(
        "onCameraReady"
      )
    }
  }
}

class CameraView: ExpoView {
  let onCameraReady = EventDispatcher()

  func callOnCameraReady() {
    onCameraReady([
      "message": "Camera was mounted"
    ]);
  }
}
```

**Kotlin**

```kotlin
class CameraViewModule : Module() {
  override fun definition() = ModuleDefinition {
    View(ExpoCameraView::class) {
      Events(
        "onCameraReady"
      )
    }
  }
}

class CameraView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {
  val onCameraReady by EventDispatcher()

  fun callOnCameraReady() {
    onCameraReady(mapOf(
      "message" to "Camera was mounted"
    ));
  }
}
```

要在 JavaScript/TypeScript 中订阅这些事件，你需要按如下所示把一个函数传给原生视图：

```tsx TypeScript
import { requireNativeViewManager } from 'expo-modules-core';

const CameraView = requireNativeViewManager('CameraView');

export default function MainView() {
  const onCameraReady = event => {
    console.log(event.nativeEvent);
  };

  return <CameraView onCameraReady={onCameraReady} />;
}
```

提供的载荷可在 `nativeEvent` 键下获得。

## 示例

**Swift**

```swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyFirstExpoModule")

    Function("hello") { (name: String) in
      return "Hello \(name)!"
    }
  }
}
```

**Kotlin**

```kotlin
class MyModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyFirstExpoModule")

    Function("hello") { name: String ->
      return "Hello $name!"
    }
  }
}
```

更多来自真实模块的示例，可以参考 GitHub 上已经使用此 API 的 Expo 模块：

- [expo-battery（Swift）](https://github.com/expo/expo/tree/main/packages/expo-battery/ios)
- expo-cellular：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-cellular/android/src/main/java/expo/modules/cellular)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-cellular/ios)
- expo-clipboard：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-clipboard/android/src/main/java/expo/modules/clipboard)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-clipboard/ios)
- expo-crypto：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-crypto/android/src/main/java/expo/modules/crypto)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-crypto/ios)
- [expo-device（Swift）](https://github.com/expo/expo/tree/main/packages/expo-device/ios)
- [expo-haptics（Swift）](https://github.com/expo/expo/tree/main/packages/expo-haptics/ios)
- [expo-image-manipulator（Swift）](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/ios)
- expo-image-picker：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-image-picker/android/src/main/java/expo/modules/imagepicker)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-image-picker/ios)
- expo-linear-gradient：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-linear-gradient/android/src/main/java/expo/modules/lineargradient)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-linear-gradient/ios)
- expo-localization：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-localization/android/src/main/java/expo/modules/localization)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-localization/ios)
- [expo-store-review（Swift）](https://github.com/expo/expo/tree/main/packages/expo-store-review/ios)
- [expo-system-ui（Swift）](https://github.com/expo/expo/tree/main/packages/expo-system-ui/ios/ExpoSystemUI)
- [expo-video-thumbnails（Swift）](https://github.com/expo/expo/tree/main/packages/expo-video-thumbnails/ios)
- expo-web-browser：[Kotlin](https://github.com/expo/expo/tree/main/packages/expo-web-browser/android/src/main/java/expo/modules/webbrowser)、[Swift](https://github.com/expo/expo/tree/main/packages/expo-web-browser/ios)
