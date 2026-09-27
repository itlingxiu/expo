---
title: 用 Jetpack Compose 扩展
description: 了解如何创建与 Expo UI 集成的自定义 Jetpack Compose 组件和修饰符。
---

# 用 Jetpack Compose 扩展

> 支持平台：Android。

本指南说明如何使用 [Expo Modules API](/modules/overview) 创建与 Expo UI 集成的自定义 Jetpack Compose 组件和修饰符。

**已安装 `@expo/ui`**

更多信息请参阅 [Expo UI 中的 Jetpack Compose 组件](/versions/latest/sdk/ui/jetpack-compose)。

```sh
npx expo install @expo/ui
```

**应用的开发构建**

自定义 Expo 模块包含原生代码，Expo Go 无法加载。请为应用创建[开发构建](/develop/development-builds/introduction)。

**熟悉 Expo Modules API 和 Jetpack Compose 的基础知识**

本指南假定你已基本熟悉 [Expo Modules API](/modules/overview) 和 [Jetpack Compose](https://developer.android.com/jetpack/compose)。

## 创建自定义组件

### 项目设置

1. 在项目中创建本地 Expo 模块：

   ```sh
   npx create-expo-module@latest --local my-ui
   ```

2. 更新模块的 **android/build.gradle**，启用 Jetpack Compose 并依赖 `expo-ui`。下面片段中的注释标出了你在默认脚手架上需要添加的行：

   ```groovy modules/my-ui/android/build.gradle
   // 引入 Kotlin Compose 编译器插件的 classpath。
   buildscript {
     repositories {
       mavenCentral()
     }
     dependencies {
       classpath("org.jetbrains.kotlin.plugin.compose:org.jetbrains.kotlin.plugin.compose.gradle.plugin:${kotlinVersion}")
     }
   }

   apply plugin: 'com.android.library'
   apply plugin: 'expo-module-gradle-plugin'
   apply plugin: 'org.jetbrains.kotlin.plugin.compose' // 应用 Compose 编译器插件。

   // ... group / version

   android {
     // ... namespace、defaultConfig

     // 为本模块开启 Jetpack Compose。
     buildFeatures {
       compose true
     }
   }

   // 依赖 `expo-ui` 以及你使用的 Compose 库。
   dependencies {
     if (findProject(':expo-ui') != null) {
       implementation project(':expo-ui')
     } else {
       implementation 'expo.modules.ui:expo.modules.ui:+'
     }
     implementation 'androidx.compose.foundation:foundation-android:1.10.6'
     implementation 'androidx.compose.ui:ui-android:1.10.6'
     implementation 'androidx.compose.material3:material3:1.5.0-alpha17'
   }
   ```

### 创建 Compose 视图

3. 创建你的 Compose 视图。它有两部分：

   1. **Props 数据类**：带有 `@OptimizedComposeProps` 注解，实现 `ComposeProps`，并包含一个 `modifiers: ModifierList` 字段，对应 [`modifiers`](/versions/latest/sdk/ui/jetpack-compose/modifiers) 属性。
   2. **`@Composable` 内容函数**：作为 `FunctionalComposableScope` 的扩展，以便调用 `ModifierRegistry.applyModifiers(...)` 并渲染 `Children(...)`。

   ```kotlin modules/my-ui/android/src/main/java/expo/modules/myui/MyCustomView.kt
   package expo.modules.myui

   import androidx.compose.foundation.layout.Column
   import androidx.compose.material3.MaterialTheme
   import androidx.compose.material3.Text
   import androidx.compose.runtime.Composable
   import expo.modules.kotlin.views.ComposeProps
   import expo.modules.kotlin.views.FunctionalComposableScope
   import expo.modules.kotlin.views.OptimizedComposeProps
   import expo.modules.ui.ModifierList
   import expo.modules.ui.ModifierRegistry
   import expo.modules.ui.UIComposableScope

   @OptimizedComposeProps
   data class MyCustomViewProps(
     val title: String = "",
     val modifiers: ModifierList = emptyList()
   ) : ComposeProps

   @Composable
   fun FunctionalComposableScope.MyCustomViewContent(props: MyCustomViewProps) {
     Column(
       modifier = ModifierRegistry.applyModifiers(
         props.modifiers,
         appContext,
         composableScope,
         globalEventDispatcher
       )
     ) {
       Text(text = props.title, style = MaterialTheme.typography.titleMedium)
       Children(UIComposableScope()) // 渲染 React 子元素
     }
   }
   ```

4. 使用 `ExpoUIView` 在模块中注册该视图。这会把你的 `@Composable` 内容接入 Expo modules 视图系统，并使其对 JavaScript 可用：

   ```kotlin modules/my-ui/android/src/main/java/expo/modules/myui/MyUiModule.kt
   package expo.modules.myui

   import expo.modules.kotlin.modules.Module
   import expo.modules.kotlin.modules.ModuleDefinition
   import expo.modules.ui.ExpoUIView

   class MyUiModule : Module() {
     override fun definition() = ModuleDefinition {
       Name("MyUi")

       ExpoUIView<MyCustomViewProps>("MyCustomView") {
         Content { props ->
           MyCustomViewContent(props)
         }
       }
     }
   }
   ```

5. 创建一个包装组件，把修饰符与事件处理连接起来。`createViewModifierEventListener` 工具让 `clickable` 和 `onVisibilityChanged` 这类基于事件的修饰符能够与你的自定义视图配合：

   ```tsx modules/my-ui/src/MyCustomView.tsx
   import { type PrimitiveBaseProps } from '@expo/ui/jetpack-compose';
   import { createViewModifierEventListener } from '@expo/ui/jetpack-compose/modifiers';
   import { requireNativeView } from 'expo';

   export interface MyCustomViewProps extends PrimitiveBaseProps {
     title: string;
     children?: React.ReactNode;
   }

   const NativeMyCustomView = requireNativeView<MyCustomViewProps>(
     'MyUi',
     'MyCustomView'
   );

   export function MyCustomView({
     modifiers,
     ...restProps
   }: MyCustomViewProps) {
     return (
       <NativeMyCustomView
         modifiers={modifiers}
         {...(modifiers
           ? createViewModifierEventListener(modifiers)
           : undefined)}
         {...restProps}
       />
     );
   }
   ```

6. 从模块入口导出该组件：

   ```ts modules/my-ui/index.ts
   export {
     MyCustomView,
     type MyCustomViewProps,
   } from './src/MyCustomView';
   ```

### 使用自定义组件

你的自定义组件现在可以配合所有内置 Expo UI 修饰符使用：

```tsx src/app/index.tsx
import { Host, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  paddingAll,
} from '@expo/ui/jetpack-compose/modifiers';
import { MyCustomView } from '../../modules/my-ui';

export default function Index() {
  return (
    <Host style={{ flex: 1 }}>
      <MyCustomView
        title="Hello World"
        modifiers={[
          paddingAll(16),
          background('#f0f0f0'),
          clip({ type: 'roundedCorner', radius: 12 }),
        ]}>
        <Text>Child content</Text>
      </MyCustomView>
    </Host>
  );
}
```

## 创建自定义修饰符

你也可以创建适用于任何 Expo UI 组件的自定义修饰符。

:::note
修饰符是 Compose 配置布局的方式，用于样式、尺寸、行为等。更多内容见 Android 的 [Compose 修饰符文档](https://developer.android.com/jetpack/compose/modifiers)。
:::

### 原生修饰符实现

1. 把修饰符参数定义为带 `@OptimizedRecord` 的数据类。然后编写一个从这些参数返回 `Modifier` 的函数：

   ```kotlin modules/my-ui/android/src/main/java/expo/modules/myui/CustomBorderModifier.kt
   package expo.modules.myui

   import android.graphics.Color
   import androidx.compose.foundation.BorderStroke
   import androidx.compose.foundation.border
   import androidx.compose.foundation.shape.RoundedCornerShape
   import androidx.compose.ui.Modifier
   import androidx.compose.ui.unit.dp
   import expo.modules.kotlin.records.Field
   import expo.modules.kotlin.records.Record
   import expo.modules.kotlin.types.OptimizedRecord
   import expo.modules.ui.compose

   @OptimizedRecord
   data class CustomBorderParams(
     @Field val color: Color? = null,
     @Field val width: Int = 2,
     @Field val cornerRadius: Int = 0
   ) : Record

   fun customBorderModifier(params: CustomBorderParams): Modifier {
     return Modifier.border(
       border = BorderStroke(params.width.dp, params.color.compose),
       shape = RoundedCornerShape(params.cornerRadius.dp)
     )
   }
   ```

   `compose` 是 `expo.modules.ui` 包中定义在 `android.graphics.Color?` 上的 Kotlin 扩展属性。用 `import expo.modules.ui.compose` 导入后，可以调用 `params.color.compose`，把从 JS 解析出的 Android `Color` 转换为 Compose API（如 `BorderStroke`）所期望的 `androidx.compose.ui.graphics.Color`。Expo UI 内置修饰符使用的是同一个辅助属性。

2. 在模块定义中用 `ModifierRegistry` 注册修饰符。用 `OnCreate` 注册、用 `OnDestroy` 注销，以免工厂在模块重新加载后泄漏：

   ```kotlin modules/my-ui/android/src/main/java/expo/modules/myui/MyUiModule.kt
   package expo.modules.myui

   import expo.modules.kotlin.modules.Module
   import expo.modules.kotlin.modules.ModuleDefinition
   import expo.modules.kotlin.records.recordFromMap
   import expo.modules.ui.ExpoUIView
   import expo.modules.ui.ModifierRegistry

   class MyUiModule : Module() {
     override fun definition() = ModuleDefinition {
       Name("MyUi")

       OnCreate {
         ModifierRegistry.register("customBorder") { map, _, _, _ ->
           customBorderModifier(recordFromMap<CustomBorderParams>(map))
         }
       }

       OnDestroy {
         ModifierRegistry.unregister("customBorder")
       }

       ExpoUIView<MyCustomViewProps>("MyCustomView") {
         Content { props ->
           MyCustomViewContent(props)
         }
       }
     }
   }
   ```

   `register` lambda 接收来自 JavaScript 的原始 map、当前 `ComposableScope`（依赖作用域的修饰符如 `weight` 或 `align` 会用到它）、`AppContext` 以及事件分发器。大多数修饰符只需要 `map`，并通过 `recordFromMap<T>(map)` 转换它。

### JavaScript 修饰符函数

3. 创建一个构建修饰符配置的 TypeScript 函数：

   ```ts modules/my-ui/src/modifiers.ts
   import { createModifier } from '@expo/ui/jetpack-compose/modifiers';
   import { type ColorValue } from 'react-native';

   export const customBorder = (params: {
     color?: ColorValue;
     width?: number;
     cornerRadius?: number;
   }) => createModifier('customBorder', params);
   ```

4. 从模块导出该修饰符：

   ```ts modules/my-ui/index.ts
   export {
     MyCustomView,
     type MyCustomViewProps,
   } from './src/MyCustomView';
   export { customBorder } from './src/modifiers';
   ```

### 使用自定义修饰符

你的自定义修饰符可以配合任何 Expo UI 组件使用：

```tsx src/app/index.tsx
import { Column, Host, Text } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { customBorder } from '../../modules/my-ui';

export default function Index() {
  return (
    <Host style={{ flex: 1 }}>
      <Column
        modifiers={[
          paddingAll(20),
          customBorder({
            color: '#FF6B35',
            width: 3,
            cornerRadius: 8,
          }),
        ]}>
        <Text>This has a custom border!</Text>
      </Column>
    </Host>
  );
}
```

## 后续步骤

你的自定义组件现在可以配合内置修饰符系统使用。

接下来可以考虑：

- 使用 Expo UI 自带的[内置 Jetpack Compose 组件](/versions/latest/sdk/ui/jetpack-compose)。
- 为应用特定的样式模式构建自定义修饰符。
- 包装第三方 Compose 库，以便在 React Native 中使用。
- 把组件作为 npm 包分享给他人使用。
