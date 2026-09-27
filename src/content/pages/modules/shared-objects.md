---
title: 使用共享对象
description: 了解如何使用 Expo Modules API 中的共享对象。
---

# 使用共享对象

共享对象让你把 Android 和 iOS 上长期存在的原生实例暴露给你的应用的 JavaScript/TypeScript，同时不把它们的生命周期控制权交出去。它们可以用来让重量级状态对象（例如已解码的位图）在 React 组件之间保持存活，而不是每次组件挂载时都创建一个新的原生实例。

在本指南中，我们来理解什么是共享对象，以及它们如何在原生平台上实现。

## 什么是共享对象？

共享对象是一个自定义类，它通过 Expo 模块把来自 Android 和/或 iOS 的原生实例桥接到应用的 JavaScript/TypeScript 代码。在 Kotlin 和 Swift 的原生侧，你通过继承 `SharedObject` 来声明该类，并在模块定义中使用 `Class()` 暴露它。一旦 JavaScript 和原生都不再持有引用，共享对象就会自动释放。

## 为什么使用共享对象？

大型媒体资源（例如图片）一旦解码到内存中，可能超过数兆字节。如果没有共享对象，在应用的不同部分之间传递这些资源会迫使每一部分每次都从磁盘重新加载，并多次解码同一个文件。这会增加内存压力、造成 I/O 瓶颈、掉帧或耗电。

共享对象通过让单个原生实例在内存中保持存活、同时有多个 JavaScript 引用指向它来解决这个问题。

## 示例：不经过磁盘 I/O 的图像处理

为了理解共享对象，考虑这样一个例子：你需要旋转并翻转应用用户挑选的图片，然后在处理后把该图片显示在应用中。

### 没有共享对象时

过去，原生模块常常以无状态的方式编写，每个函数独立运行，调用之间不保持状态。如果你想对同一个对象（例如一个图片文件）执行两个独立操作，你会在两处都从磁盘加载它，并每次重复 I/O 操作。

没有共享对象时，`ImagePicker` 会从诸如 `"file:///path/to/image.jpg"` 的文件 URI 读取并解码图片到内存。图像处理模块随后读取同一个 URI，并再次把图片解码到内存。当应用用户调用变换方法（例如 `rotate()`）来旋转图片时，模块会把旋转后的图片保存到一个新文件。最后，当新的 URI 传给 `Image` 组件时，它会再次从磁盘解码图片来渲染。此工作流会导致两次或更多次解码和磁盘读取。

### 有共享对象时

同样的场景在有共享对象时会高效得多。`ImagePicker` 读取 URI 并把图片解码一次到共享对象中。当应用用户调用变换方法（例如 `rotate()`）时，模块会在内存中操作位图，而不写入磁盘。如果你需要文件输出，请调用显式的保存函数（例如图像处理库中的 `saveAsync`），否则变换只留在内存中。

最后，共享对象被传给 `Image` 组件，这一次图片从内存渲染。整个工作流只需要一次磁盘读取和一次解码，所有变换都在内存中发生。

性能收益很显著。通过消除多余的磁盘 I/O 和解码操作，你在内存中只保留一张位图，而不是多份副本。这降低了 CPU 使用，有助于延长电池寿命，并降低因内存压力导致崩溃的风险。

共享对象还解锁了更方便的面向对象 API 形态。你可以在长期存在的实例上暴露方法（例如 `rotate()`、`flipX()`、`renderAsync()`），让调用者在这个有状态的对象上链式操作，而不是暴露一组扁平的无状态函数。

### 使用共享对象的实现

既然你已经理解共享对象为什么有用，让我们看一个最小实现，演示前面示例的核心概念。

该示例创建一个简单的图像处理模块，从文件路径加载图片，在内存中应用变换（旋转和翻转），并暴露一个其他模块可以消费的共享引用。

### Android 实现

在 Android 上，你从 `expo.modules.kotlin.sharedobjects.SharedObject` 提供的 `SharedObject` 类创建共享对象。该类管理已解码的位图，并暴露操作它的方法。实现只在内存中保留当前图片，并就地应用变换，因此只有当旋转或翻转这类变换产生新位图时，你才会分配一张新位图：

```kotlin
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.sharedobjects.SharedObject

class ImageRef : SharedRef<Bitmap>()

class SimpleImageContext(
  runtimeContext: RuntimeContext,
  bitmap: Bitmap
) : SharedObject(runtimeContext) {
  private var current: Bitmap = bitmap

  fun rotate(degrees: Float) = apply {
    val matrix = Matrix().apply { postRotate(degrees) }
    current = Bitmap.createBitmap(current, 0, 0, current.width, current.height, matrix, true)
  }

  fun flipX() = apply {
    val matrix = Matrix().apply { preScale(-1f, 1f) }
    current = Bitmap.createBitmap(current, 0, 0, current.width, current.height, matrix, true)
  }

  fun render(): ImageRef = ImageRef(current, runtimeContext)

  override fun sharedObjectDidRelease() {
    if (!current.isRecycled) current.recycle()
  }
}
```

上面的示例与 iOS 实现相当相似。不过 Android 上有一个区别：`sharedObjectDidRelease()` 方法。当 JavaScript 释放对共享对象的全部引用时，会调用此生命周期回调，从而有机会清理原生资源。

当此类的结果传给另一个模块时，`render` 方法返回一个 `ImageRef`，它是 `expo-image` 和其他能识别图片的模块已经理解的专用 `SharedRef<Bitmap>` 类型。

模块定义暴露一个用于创建上下文的异步函数，以及一个用于绑定方法的类定义。Expo Modules API 使用声明式语法，你在其中指定模块名、用于创建实例的函数，以及把方法映射到共享对象的类定义：

```kotlin
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SimpleImageModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SimpleImageModule")

    AsyncFunction("createContextAsync") { path: String ->
      val bitmap = BitmapFactory.decodeFile(path)
        ?: throw Exceptions.IllegalArgument("Unable to decode image at $path")
      SimpleImageContext(runtimeContext, bitmap)
    }

    Class<SimpleImageContext>("Context") {
      Function("rotate") { ctx: SimpleImageContext, degrees: Float -> ctx.rotate(degrees) }
      Function("flipX") { ctx: SimpleImageContext -> ctx.flipX() }
      AsyncFunction("renderAsync") Coroutine { ctx: SimpleImageContext -> ctx.render() }
    }
  }
}
```

在上面的示例中，`createContextAsync` 函数从文件路径解码位图，并返回一个新的 `SimpleImageContext` 实例。上下文存在之后，`rotate` 和 `flipX` 函数同步运行，因为它们只在内存中操作。`renderAsync` 函数被标记为异步，以表明它可能涉及复制或准备位图供其他模块使用。

### iOS 实现

在 iOS 上，你通过继承 `ExpoModulesCore` 提供的 `SharedObject` 类来创建共享对象。该类管理已解码的位图，并暴露操作它的方法。实现只在内存中保留当前图片，并就地应用变换：

```swift
import ExpoModulesCore
import UIKit

final class ImageRef: SharedRef<UIImage> {}

final class SimpleImageContext: SharedObject {
  private var current: UIImage

  init(path: String) throws {
    guard let data = try? Data(contentsOf: URL(fileURLWithPath: path)),
          let image = UIImage(data: data) else {
      throw Exceptions.InvalidArgument()
    }
    self.current = image
    super.init()
  }

  func rotate(by degrees: Double) {
    current = current.rotated(degrees: degrees)
  }

  func flipX() {
    current = current.withHorizontallyFlippedOrientation()
  }

  func render() -> ImageRef {
    return ImageRef(current)
  }
}
```

在上面的示例中，`SimpleImageContext` 读取图片文件，并在内存中保留单个 `UIImage`。`rotate` 和 `flipX` 方法在内存中变更当前图片，而不接触磁盘。

当此类的结果传给另一个模块时，`render` 方法返回一个 `ImageRef`，它是 `expo-image` 和其他能识别图片的模块已经理解的专用 `SharedRef<UIImage>` 类型。

现在，有了共享对象类定义，你可以通过模块定义暴露它。Expo Modules API 使用声明式语法，你在其中指定模块名、用于创建实例的函数，以及把方法映射到共享对象的类定义：

```swift
public final class SimpleImageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SimpleImageModule")

    AsyncFunction("createContextAsync") { (path: String) -> SimpleImageContext in
      return try SimpleImageContext(path: path)
    }

    Class("Context", SimpleImageContext.self) {
      Function("rotate") { (ctx, degrees: Double) -> SimpleImageContext in
        ctx.rotate(by: degrees)
        return ctx
      }

      Function("flipX") { (ctx: SimpleImageContext) -> SimpleImageContext in
        ctx.flipX()
        return ctx
      }

      AsyncFunction("renderAsync") { (ctx: SimpleImageContext) -> ImageRef in
        return ctx.render()
      }
    }
  }
}
```

在上面的示例中，`createContextAsync` 是异步函数，因为从磁盘加载并解码图片是 I/O 操作。上下文存在之后，`rotate` 和 `flipX` 函数同步运行，因为它们只在内存中操作。`renderAsync` 函数被标记为异步，以表明它可能涉及复制或准备位图供其他模块使用，尽管在这个简单示例中它会立即返回。

### 在应用中使用共享对象

现在你可以在应用的 JavaScript/TypeScript 代码中使用共享对象：从路径加载图片、为已加载的图片创建上下文、链式进行内存中的变换、渲染以获得共享引用，然后把该引用传给 `Image` 组件：

```tsx
import { useState } from 'react';
import { Button } from 'react-native';
import { Image } from 'expo-image';
import type { SharedRef } from 'expo';
import SimpleImageModule from 'simple-image-module'; // 自定义原生模块

import { pickImageAsync } from './pickImage'; // 自定义 TypeScript 函数

export function SharedImageExample() {
  const [context, setContext] = useState(null);
  const [result, setResult] = useState<SharedRef<'image'> | null>(null);

  const load = async () => {
    const uri = await pickImageAsync();
    if (!uri) {
      return;
    }

    const ctx = await SimpleImageModule.createContextAsync(uri);

    setContext(ctx);
    setResult(await ctx.renderAsync());
  };

  const rotateAndFlip = async () => {
    if (!context) {
      return;
    }

    setResult(await context.rotate(90).flipX().renderAsync());
  };

  return (
    <>
      <Button title="Pick image" onPress={load} />
      <Button title="Rotate 90° + flip X" onPress={rotateAndFlip} disabled={!context} />
      {result && <Image source={result} style={{ width: 200, height: 200 }} />}
    </>
  );
}
```

在上面的示例中，React 组件只消费已经在内存中、并由共享对象（`ImageRef`）引用的、经图像处理上下文变换后的原生图片。因此，图片视图可以在下一帧立即显示图片，链式变换也从不接触文件系统。

JavaScript API 使用 `ImagePicker` 挑选图片，它返回一个标准文件 URI。此 URI 被交给自定义原生模块，以便在 `SharedImageExample()` 中创建共享对象：

```tsx
import * as ImagePicker from 'expo-image-picker';

export async function pickImageAsync() {
  const result = await ImagePicker.launchImageLibraryAsync({
    quality: 1,
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  // 此时我们仍然只有一个磁盘 URI。
  // 原生模块会把它提升为共享对象。
  return result.assets[0].uri;
}
```

在上面的示例中，`ImagePicker` 不需要了解共享对象。它返回它应该返回的东西，也就是文件路径。你的原生模块负责把该路径转换成其他 Expo 模块可以配合使用的共享对象，例如来自 `expo-image` 的 `Image`。

## 使用共享对象的 Expo 库

一些使用共享对象的 [Expo SDK 库](/versions/latest)示例及其用途：

- `expo-image` 库使用 `SharedObject` 来保持已解码的操作存活，视图组件在 Android 上接受 `SharedRef<Bitmap>`，在 iOS 上接受 `SharedRef<UIImage>`。这种设计允许在模块之间传递图片而无需再次解码。要进一步探索，请参阅 `expo-image` 库的 [Android](https://github.com/expo/expo/tree/main/packages/expo-image/android/src/main/java/expo/modules/image) 和 [iOS](https://github.com/expo/expo/tree/main/packages/expo-image/ios) 源码。
- `expo-image-manipulator` 库演示了如何处理异步操作、把多个操作排队，以及暴露干净的 JavaScript API。要进一步探索，请参阅 `expo-image-manipulator` 库的 [Android](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/android/src/main/java/expo/modules/imagemanipulator) 和 [iOS](https://github.com/expo/expo/tree/main/packages/expo-image-manipulator/ios) 源码。
- `expo-sqlite` 库使用共享对象，在多次调用之间保持数据库、会话和语句句柄，同时协调对底层数据库的访问。要进一步探索，请参阅 `expo-sqlite` 库的 [Android](https://github.com/expo/expo/tree/main/packages/expo-sqlite/android/src/main/java/expo/modules/sqlite) 和 [iOS](https://github.com/expo/expo/tree/main/packages/expo-sqlite/ios) 源码。
- `expo/fetch` 库使用共享对象，为流式传输、取消和重定向处理保持请求与响应的生命周期，同时呈现与 JavaScript fetch 兼容的 API。要进一步探索，请参阅 `expo/fetch` 库的 [Android](https://github.com/expo/expo/tree/main/packages/expo/android/src/main/java/expo/modules/fetch) 和 [iOS](https://github.com/expo/expo/tree/main/packages/expo/ios/Fetch) 源码。

## 共享对象的性能收益

使用共享对象可以带来若干性能改进，例如：

- **减少磁盘 I/O：** 一次读取操作，而不是在不同模块或函数调用之间多次读取
- **更少的解码操作：** 昂贵的解码（例如 JPEG/PNG 到位图）只发生一次，而不是反复发生
- **更低的内存压力：** 内存中只有一份解码实例，而不是多份副本
- **更快的操作：** 内存中的变换比基于磁盘的变换快得多
- **避免掉帧：** 更少的 I/O 阻塞意味着更流畅的 UI 交互

## 类定义 DSL

使用 `Class()` 暴露共享对象时，类定义块除了 `Function` 和 `AsyncFunction` 之外，还接受若干 DSL 组件。这些组件让你可以直接在类上定义构造函数、静态方法和属性。

### `Constructor`

定义一个构造函数，JavaScript 代码可以用 `new ClassName(args)` 创建共享对象的新实例。如果没有 `Constructor`，实例只能由返回该共享对象的原生函数创建。

构造函数从 JavaScript 接收参数，并且必须返回共享对象类的一个实例。

:::tabs
:::tab Swift
```swift
Class(MySharedObject.self) {
  Constructor { (date: Date) in
    /* @hide 省略 ... */ /* @end */
  }
}
```
:::
:::tab Kotlin
```kotlin
Class(MySharedObject::class) {
  Constructor { date: Date ->
    /* @hide 省略 ... */ /* @end */
  }
}
```
:::
:::

### `StaticFunction`

在类原型上定义一个同步函数，可以从 JavaScript 以 `ClassName.functionName()` 调用。与 `Function` 不同，`StaticFunction` 不接收实例作为参数。

:::tabs
:::tab Swift
```swift
StaticFunction("myStaticFunction") { in
  /* @hide 省略 ... */ /* @end */
}
```
:::
:::tab Kotlin
```kotlin
StaticFunction("myStaticFunction") { ->
  /* @hide 省略 ... */ /* @end */
}
```
:::
:::

### `StaticAsyncFunction`

在类本身上定义一个异步函数，可以从 JavaScript 以 `await ClassName.functionName()` 调用。返回一个 `Promise`。在 Kotlin 上，可以对可挂起的函数体使用 `Coroutine` 修饰符。

:::tabs
:::tab Swift
```swift
StaticAsyncFunction("myStaticAsyncFunction") { in
  /* @hide 省略 ... */ /* @end */
}
```
:::
:::tab Kotlin
```kotlin
StaticAsyncFunction("myStaticAsyncFunction") { ->
  /* @hide 省略 ... */ /* @end */
}
```
:::
:::

### `Property`

在 `Class()` 块内部，`Property` 与 `Function` 类似，接收类实例作为参数。这让你可以在共享对象实例上暴露计算属性。

:::tabs
:::tab Swift
```swift
Class(VideoPlayer.self) {
  Property("isPlaying") { (player: VideoPlayer) -> Bool in
    return player.isPlaying
  }

  Property("volume")
    .get { (player: VideoPlayer) -> Float in
      return player.volume
    }
    .set { (player: VideoPlayer, volume: Float) in
      player.volume = volume
    }
}
```
:::
:::tab Kotlin
```kotlin
Class(VideoPlayer::class) {
  Property("isPlaying") { player: VideoPlayer ->
    return@Property player.isPlaying
  }

  Property("volume")
    .get { player: VideoPlayer ->
      return@get player.volume
    }
    .set { player: VideoPlayer, volume: Float ->
      player.volume = volume
    }
}
```
:::
:::

```js JavaScript
const player = new VideoPlayer(source);

// 只读属性
console.log(player.isPlaying); // false

// 可读写属性
player.volume = 0.5;
console.log(player.volume); // 0.5
```

## 更多资源

- [Expo Modules 中共享对象的实际影响](https://expo.dev/blog/the-real-world-impact-of-shared-objects) — 共享对象解决了 Expo API 的许多根本问题，也解锁了一种全新的面向对象 API 设计方式。
