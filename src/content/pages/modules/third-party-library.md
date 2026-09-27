---
title: 封装第三方原生库
description: 了解如何使用 Expo Modules API 为两个独立的原生库创建简单封装。
---

# 封装第三方原生库

Expo 模块让你可以在 React Native 项目中轻松使用为 Android 和 iOS 构建的原生外部库。本教程聚焦于利用 Expo Modules API，使用两个在两个原生平台上都可用、且彼此相似的库来创建径向图表。

- [PhilJay 的 MPAndroidChart](https://github.com/PhilJay/MPAndroidChart)
- [Daniel Cohen Gindi 的 Charts](https://github.com/danielgindi/Charts)

iOS 库的灵感来自 Android 库，因此两者具有相似的 API 和功能。这使它们成为本教程的好例子。

> 视频：[How to wrap native libraries](https://www.youtube.com/watch?v=M8eNfH1o0eE)
>
> 在本视频中，你将学习如何使用 Expo Modules API 封装原生库。

1. **创建新模块**

下列步骤假设新模块创建在一个新的 Expo 项目中。不过，你也可以按照另一套说明，在现有项目中创建新模块。

### 在现有 Expo 项目中

你也可以把新模块作为视图，用在现有 Expo 项目目录内部。在项目目录中运行以下命令：

:::tabs
:::tab npm
```sh
$ npx create-expo-module --local expo-radial-chart
```
:::
:::tab yarn
```sh
$ yarn create expo-module --local expo-radial-chart
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module --local expo-radial-chart
```
:::
:::tab bun
```sh
$ bun create expo-module --local expo-radial-chart
```
:::
:::

现在，打开新创建的 `modules/expo-radial-chart` 目录，开始编辑原生代码。

### 从新模块开始

运行以下命令，创建一个可以发布到 npm、并在任何 Expo 应用中使用的空 Expo 模块：

:::tabs
:::tab npm
```sh
$ npx create-expo-module expo-radial-chart
```
:::
:::tab yarn
```sh
$ yarn create expo-module expo-radial-chart
```
:::
:::tab pnpm
```sh
$ pnpm create expo-module expo-radial-chart
```
:::
:::tab bun
```sh
$ bun create expo-module expo-radial-chart
```
:::
:::

:::tip
如果你不打算发布这个库，可以在终端窗口中对所有提示按 **Return**，以接受默认值。
:::

现在，打开新创建的 `expo-radial-chart` 目录，开始编辑原生代码。

2. **运行示例项目**

为了确认一切正常，我们来运行示例项目。

### 在现有 Expo 项目中

如果你是从现有 Expo 项目开始的，请在 Expo 项目的根目录运行以下命令：

:::tabs
:::tab npm
```sh
# 在 Android 上运行 example-expo-app
$ npx expo run:android

# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
# 在 Android 上运行 example-expo-app
$ yarn expo run:android

# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
# 在 Android 上运行 example-expo-app
$ pnpm expo run:android

# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
# 在 Android 上运行 example-expo-app
$ bun expo run:android

# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

### 在新模块中

如果你是从一个新模块项目开始的，请打开一个终端窗口，启动 TypeScript 编译器以监视更改，并重新构建模块的 JavaScript：

:::tabs
:::tab npm
```sh
# 运行下面的命令之前，请确认你位于 expo-radial-chart 目录内
$ npm run build
```
:::
:::tab yarn
```sh
# 运行下面的命令之前，请确认你位于 expo-radial-chart 目录内
$ yarn run build
```
:::
:::tab pnpm
```sh
# 运行下面的命令之前，请确认你位于 expo-radial-chart 目录内
$ pnpm run build
```
:::
:::tab bun
```sh
# 运行下面的命令之前，请确认你位于 expo-radial-chart 目录内
$ bun run build
```
:::
:::

在另一个终端窗口中，编译并运行示例应用：

:::tabs
:::tab npm
```sh
$ cd example-expo-app

# 在 Android 上运行 example-expo-app
$ npx expo run:android

# 在 iOS 上运行示例应用
$ npx expo run:ios
```
:::
:::tab yarn
```sh
$ cd example-expo-app

# 在 Android 上运行 example-expo-app
$ yarn expo run:android

# 在 iOS 上运行示例应用
$ yarn expo run:ios
```
:::
:::tab pnpm
```sh
$ cd example-expo-app

# 在 Android 上运行 example-expo-app
$ pnpm expo run:android

# 在 iOS 上运行示例应用
$ pnpm expo run:ios
```
:::
:::tab bun
```sh
$ cd example-expo-app

# 在 Android 上运行 example-expo-app
$ bun expo run:android

# 在 iOS 上运行示例应用
$ bun expo run:ios
```
:::
:::

3. **添加原生依赖**

通过编辑 **expo-radial-chart/android/build.gradle** 和 **expo-radial-chart/ios/ExpoRadialChart.podspec** 文件，把原生依赖添加到模块中：

```diff
diff --git a/android/build.gradle b/android/build.gradle
index 0000000..1111111 100644
--- a/android/build.gradle
+++ b/android/build.gradle
@@ -1,5 +1,6 @@
  dependencies {
   implementation project(':expo-modules-core')
   implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:${getKotlinVersion()}"
+  implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
  }
```

```diff
diff --git a/ios/ExpoRadialChart.podspec b/ios/ExpoRadialChart.podspec
index 0000000..1111111 100644
--- a/ios/ExpoRadialChart.podspec
+++ b/ios/ExpoRadialChart.podspec
@@ -1,5 +1,6 @@
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
+ s.dependency 'DGCharts', '~> 5.1.0'

   # Swift/Objective-C 兼容性
```

<details>
<summary>你是否要使用 .aar 依赖？</summary>

:::tabs
:::tab SDK 52 及更高版本

在 **android** 目录内再创建一个名为 **libs** 的目录，并把 **.aar** 文件放进去。然后，通过自动链接把它添加为 Gradle 项目：

```diff
diff --git a/expo-module.config.json b/expo-module.config.json
index 0000000..1111111 100644
--- a/expo-module.config.json
+++ b/expo-module.config.json
@@ -1,3 +1,9 @@
    "android": {
+     "gradleAarProjects": [
+       {
+         "name": "test-aar",
+         "aarFilePath": "android/libs/test.aar"
+       }
+     ],
     "modules": [
```

最后，把该依赖添加到 **android/build.gradle** 文件的 `dependencies` 列表中，使用依赖指定的名称，并加上 `${project.name}$` 前缀：

```diff
diff --git a/android/build.gradle b/android/build.gradle
index 0000000..1111111 100644
--- a/android/build.gradle
+++ b/android/build.gradle
@@ -1,4 +1,5 @@
  dependencies {
   implementation project(':expo-modules-core')
   implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:${getKotlinVersion()}"
+  implementation project(":${project.name}$test-aar")
  }
```

:::
:::tab SDK 51 及更早版本

在 **android** 目录内再创建一个名为 **libs** 的目录，并把 **.aar** 文件放进去。然后，把该目录添加为仓库：

```diff
diff --git a/android/build.gradle b/android/build.gradle
index 0000000..1111111 100644
--- a/android/build.gradle
+++ b/android/build.gradle
@@ -1,3 +1,6 @@
  repositories {
    mavenCentral()
+   flatDir {
+      dirs 'libs'
+   }
  }
```

最后，把该依赖添加到 `dependencies` 列表中。不要使用文件名，而要使用包路径，并在末尾加上 `@aar`：

```diff
diff --git a/android/build.gradle b/android/build.gradle
index 0000000..1111111 100644
--- a/android/build.gradle
+++ b/android/build.gradle
@@ -1,5 +1,6 @@
  dependencies {
   implementation project(':expo-modules-core')
   implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:${getKotlinVersion()}"
+  implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0@aar'
  }
```

:::
:::

</details>

<details>
<summary>你是否要使用 .xcframework 或 .framework 依赖？</summary>

在 iOS 上，你也可以通过 `vendored_frameworks` 配置选项使用以 framework 形式打包的依赖。

```diff
diff --git a/ios/ExpoRadialChart.podspec b/ios/ExpoRadialChart.podspec
index 0000000..1111111 100644
--- a/ios/ExpoRadialChart.podspec
+++ b/ios/ExpoRadialChart.podspec
@@ -1,3 +1,4 @@
   s.static_framework = true
   s.dependency 'ExpoModulesCore'
+  s.vendored_frameworks = 'Frameworks/MyFramework.framework'
   # Swift/Objective-C 兼容性
```

:::note
用于指定 framework 路径的文件模式是相对于 podspec 文件的，并且不支持遍历父目录（`..`）。这意味着你需要把 framework 放在 **ios** 目录内（或 **ios** 的子目录中）。
:::

添加 framework 之后，请确保 `source_files` 选项的文件模式不会匹配 framework 内部的任何文件。一种做法是把 iOS 源 Swift 文件（即 `ExpoRadialChartView.swift` 和 `ExpoRadialChartModule.swift`）移动到与 framework 所在位置分开的 **src** 目录，并把 `source_files` 选项更新为只匹配 **src** 目录：

```diff
diff --git a/ios/ExpoRadialChart.podspec b/ios/ExpoRadialChart.podspec
index 0000000..1111111 100644
--- a/ios/ExpoRadialChart.podspec
+++ b/ios/ExpoRadialChart.podspec
@@ -1,1 +1,1 @@
- s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
+ s.source_files = 'src/**/*.{h,m,mm,swift,hpp,cpp}'
```

你的 **ios** 目录最终应具有类似下面的文件结构：

```text
Frameworks/MyFramework.framework
src/ExpoRadialChartView.swift
src/ExpoRadialChartModule.swift
ExpoRadialChart.podspec
```

</details>

4. **定义 API**

要在应用中使用该模块，请为 props 定义类型。它接受一个 series 列表，每一项都有颜色和百分比值。

```ts src/ExpoRadialChart.types.ts
import { ViewStyle } from 'react-native/types';

export type ChangeEventPayload = {
  value: string;
};

type Series = {
  color: string;
  percentage: number;
};

export type ExpoRadialChartViewProps = {
  style?: ViewStyle;
  data: Series[];
};
```

由于本示例没有为 Web 实现该模块，我们来替换 **src/ExpoRadialChartView.web.tsx** 文件：

```tsx src/ExpoRadialChartView.web.tsx
import * as React from 'react';

export default function ExpoRadialChartView() {
  return <div>Not implemented</div>;
}
```

5. **在 Android 上实现模块**

现在你可以通过编辑占位文件并做以下更改来实现原生功能：

1. 创建一个 `PieChart` 实例，把它的 `layoutParams` 设置为匹配父视图。然后使用 `addView` 函数把它添加到视图层次中。
2. 定义一个接受 `Series` 对象列表的 `setChartData` 函数。你可以遍历该列表，为每个 series 创建一个 `PieEntry`，并把颜色存储在一个单独的列表中。
3. 创建一个 `PieDataSet`，用它创建一个 `PieData` 对象，并把它设置为 `PieChart` 实例上的数据。

```kotlin android/src/main/java/expo/modules/radialchart/ExpoRadialChartView.kt
package expo.modules.radialchart

import android.content.Context
import android.graphics.Color
import androidx.annotation.ColorInt
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.views.ExpoView


class Series : Record {
  @Field
  val color: String = "#ff0000"

  @Field
  val percentage: Float = 0.0f
}

class ExpoRadialChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  internal val chartView = PieChart(context).also {
    it.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    addView(it)
  }

  fun setChartData(data: ArrayList<Series>) {
    val entries: ArrayList<PieEntry> = ArrayList()
    val colors: ArrayList<Int> = ArrayList()
    for (series in data) {
      entries.add(PieEntry(series.percentage))
      colors.add(Color.parseColor(series.color))
    }
    val dataSet = PieDataSet(entries, "DataSet");
    dataSet.colors = colors;
    val pieData = PieData(dataSet);
    chartView.data = pieData;
    chartView.invalidate();

  }
}
```

你还需要使用 [`Prop`](/modules/module-api#prop) 函数来定义 `data` prop，并在该 prop 变化时调用原生的 `setChartData` 函数：

```kotlin android/src/main/java/expo/modules/radialchart/ExpoRadialChartModule.kt
package expo.modules.radialchart

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoRadialChartModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView::class) {
      Prop("data") { view: ExpoRadialChartView, prop: ArrayList<Series> ->
        view.setChartData(prop);
      }
    }
  }
}
```

6. **在 iOS 上实现模块**

现在你可以通过编辑占位文件并做以下更改来实现原生功能：

1. 创建一个新的 `PieChartView` 实例，并使用 `addSubview` 函数把它添加到视图层次中。
2. 设置 `clipsToBounds` 属性，并重写 `layoutSubviews` 函数，以确保图表视图始终与父视图大小相同。
3. 创建一个 `setChartData` 函数，它接受 series 列表，用这些数据创建一个 `PieChartDataSet` 实例，并把它赋给 `PieChartView` 实例的 `data` 属性。

```swift ios/ExpoRadialChartView.swift
import ExpoModulesCore
import DGCharts

struct Series: Record {
  @Field
  var color: UIColor = UIColor.black

  @Field
  var percentage: Double = 0
}

class ExpoRadialChartView: ExpoView {
  let chartView = PieChartView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = true
    addSubview(chartView)
  }

  override func layoutSubviews() {
    chartView.frame = bounds
  }

  func setChartData(data: [Series]) {
    let set1 = PieChartDataSet(entries: data.map({ (series: Series) -> PieChartDataEntry in
      return PieChartDataEntry(value: series.percentage)
    }))
    set1.colors = data.map({ (series: Series) -> UIColor in
      return series.color
    })
    let chartData: PieChartData = [set1]
    chartView.data = chartData
  }
}
```

你还需要使用 [`Prop`](/modules/module-api#prop) 函数来定义 `data` prop，并在该 prop 变化时调用原生的 `setChartData` 函数：

```swift ios/ExpoRadialChartModule.swift
import ExpoModulesCore

public class ExpoRadialChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView.self) {
      Prop("data") { (view: ExpoRadialChartView, prop: [Series]) in
        view.setChartData(data: prop)
      }
    }
  }
}
```

7. **编写示例应用来使用该模块**

你可以更新 **src/app** 目录中的应用来测试该模块。使用 `ExpoRadialChartView` 组件渲染一个有三块扇区的饼图：

```tsx src/app/index.tsx
import { ExpoRadialChartView } from '@/modules/expo-radial-chart';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <ExpoRadialChartView
      style={styles.container}
      data={[
        {
          color: '#ff0000',
          percentage: 0.5,
        },
        {
          color: '#00ff00',
          percentage: 0.2,
        },
        {
          color: '#0000ff',
          percentage: 0.3,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

:::tip
如果你创建的是新模块，请把 import 语句更新为：`import { ExpoRadialChartView } from 'expo-radial-chart';`
:::

8. **重新构建并启动应用**

为了确保应用在两个平台上都能成功构建，请重新运行第 2 步中的构建命令。应用在任一平台上成功构建后，你会看到一个有三块扇区的饼图：

![Android 和 iOS 上的饼图模块](/static/images/modules/third-party-library/result.webp)

恭喜！你已经使用 Expo Modules API，为两个独立的第三方原生库创建了第一个简单封装。

## 下一步

- [Expo Modules API 参考](/modules/module-api) — 使用 Kotlin 和 Swift 创建原生模块的参考。
