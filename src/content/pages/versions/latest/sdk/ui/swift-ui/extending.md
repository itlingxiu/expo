---
title: 用 SwiftUI 扩展
description: 了解如何创建与 Expo UI 集成的自定义 SwiftUI 组件和修饰符。
---

# 用 SwiftUI 扩展

> 支持平台：iOS、tvOS。

本指南说明如何使用 [Expo Modules API](/modules/overview) 创建与 Expo UI 集成的自定义 SwiftUI 组件和修饰符。

**已安装 `@expo/ui`**

在项目中安装 `@expo/ui`。更多信息请参阅 [Expo UI 中的 SwiftUI 组件](/versions/latest/sdk/ui/swift-ui)。

```sh
npx expo install @expo/ui
```

**应用的开发构建**

自定义 Expo 模块包含原生代码，Expo Go 无法加载。请为应用创建[开发构建](/develop/development-builds/introduction)。

**熟悉 Expo Modules API 和 SwiftUI**

本指南假定你已基本熟悉 [Expo Modules API](/modules/overview) 和 [SwiftUI](https://developer.apple.com/swiftui)。

## 创建自定义组件

### 项目设置

1. 在项目中创建本地 Expo 模块：

   ```sh
   npx create-expo-module@latest --local my-ui
   ```

2. 在模块的 podspec 文件中把 `ExpoUI` 加为依赖：

   ```ruby modules/my-ui/ios/MyUi.podspec
   Pod::Spec.new do |s|
     s.name           = 'MyUi'
     s.version        = '1.0.0'
     s.summary        = 'Custom UI components extending Expo UI'
     # ... 其他配置
     # 添加 ExpoUI 依赖
     s.dependency 'ExpoUI'
     # ... 其他配置
   end
   ```

### 创建 SwiftUI 视图

3. 用两部分创建 SwiftUI 视图：

   1. **Props 类**：继承 `ExpoUI` 的 `UIBaseViewProps`，从而自动支持 [`modifiers`](/versions/latest/sdk/ui/swift-ui/modifiers) 属性
   2. **View 结构体**：遵循 `ExpoSwiftUI.View` 协议，该协议要求一个 `@ObservedObject` 的 `props` 属性和一个 `body`

   ```swift modules/my-ui/ios/MyCustomView.swift
   import SwiftUI
   import ExpoModulesCore
   import ExpoUI

   final class MyCustomViewProps: UIBaseViewProps {
     @Field var title: String = ""
   }

   struct MyCustomView: ExpoSwiftUI.View {
     @ObservedObject public var props: MyCustomViewProps

     var body: some View {
       VStack {
         Text(props.title)
           .font(.headline)
         Children() // 渲染 React 子元素
       }
     }
   }
   ```

4. 用 `ExpoUIView` 在模块中注册该视图。这会为 SwiftUI 视图包上修饰符支持，并让 JavaScript 可以使用它：

   ```swift modules/my-ui/ios/MyUiModule.swift
   import ExpoModulesCore
   import ExpoUI

   public class MyUiModule: Module {
     public func definition() -> ModuleDefinition {
       Name("MyUi")

       ExpoUIView(MyCustomView.self)
     }
   }
   ```

5. 创建一个包装组件，把修饰符与事件处理连起来。`createViewModifierEventListener` 工具让 `onTapGesture`、`onAppear` 这类基于事件的修饰符能作用于自定义视图：

   ```tsx modules/my-ui/src/MyCustomView.tsx
   import { requireNativeView } from 'expo';
   import { type CommonViewModifierProps } from '@expo/ui/swift-ui';
   import { createViewModifierEventListener } from '@expo/ui/swift-ui/modifiers';

   export interface MyCustomViewProps extends CommonViewModifierProps {
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

:::note
向本地模块添加原生源文件并不会把它加入 iOS 工程。重新构建前请运行 `npx expo prebuild`。否则构建会失败，并报 `cannot find 'MyCustomView' in scope`。
:::

自定义组件现在可以使用 Expo UI 的全部内置修饰符：

```tsx src/app/index.tsx
import { Host, Text } from '@expo/ui/swift-ui';
import {
  padding,
  cornerRadius,
  background,
} from '@expo/ui/swift-ui/modifiers';
import { MyCustomView } from '../../modules/my-ui';

export default function Index() {
  return (
    <Host style={{ flex: 1 }}>
      <MyCustomView
        title="Hello World"
        modifiers={[
          padding({ all: 16 }),
          background('#f0f0f0'),
          cornerRadius(12),
        ]}>
        <Text>Child content</Text>
      </MyCustomView>
    </Host>
  );
}
```

## 创建自定义修饰符

你也可以创建能作用于任意 Expo UI 组件的自定义修饰符。

:::note
修饰符是 SwiftUI 配置视图样式、布局、行为等的方式。更多内容见 Apple 的 [ViewModifier 文档](https://developer.apple.com/documentation/swiftui/viewmodifier)。
:::

### 原生修饰符实现

1. 创建一个遵循 `ViewModifier` 和 `Record` 的修饰符结构体：

   ```swift modules/my-ui/ios/CustomBorderModifier.swift
   import SwiftUI
   import ExpoModulesCore
   import ExpoUI

   struct CustomBorderModifier: ViewModifier, Record {
     @Field var color: Color = .red
     @Field var width: CGFloat = 2
     @Field var cornerRadius: CGFloat = 0

     func body(content: Content) -> some View {
       content
         .overlay(
           RoundedRectangle(cornerRadius: cornerRadius)
             .stroke(color, lineWidth: width)
         )
     }
   }
   ```

   :::note
   这会再增加一个原生源文件，因此重新构建前请再次运行 `npx expo prebuild`。
   :::

2. 在模块定义中用 `ViewModifierRegistry` 注册修饰符。为避免与 SwiftUI 渲染线程发生竞态，在 `OnCreate` 中调用 `register`，在 `OnDestroy` 中调用 `unregister`：

   ```swift modules/my-ui/ios/MyUiModule.swift
   import ExpoModulesCore
   import ExpoUI

   public class MyUiModule: Module {
     public func definition() -> ModuleDefinition {
       Name("MyUi")

       OnCreate {
         ViewModifierRegistry.register("customBorder") { params, appContext, _ in
           return try CustomBorderModifier(from: params, appContext: appContext)
         }
       }

       OnDestroy {
         ViewModifierRegistry.unregister("customBorder")
       }

       ExpoUIView(MyCustomView.self)
     }
   }
   ```

### JavaScript 修饰符函数

3. 创建一个生成修饰符配置的 TypeScript 函数：

   ```ts modules/my-ui/src/modifiers.ts
   import { createModifier } from '@expo/ui/swift-ui/modifiers';

   export const customBorder = (params: {
     color?: string;
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

自定义修饰符可以作用于任意 Expo UI 组件：

```tsx src/app/index.tsx
import { Host, Text, VStack } from '@expo/ui/swift-ui';
import { padding } from '@expo/ui/swift-ui/modifiers';
import { customBorder } from '../../modules/my-ui';

export default function Index() {
  return (
    <Host style={{ flex: 1 }}>
      <VStack
        modifiers={[
          padding({ all: 20 }),
          customBorder({
            color: '#FF6B35',
            width: 3,
            cornerRadius: 8,
          }),
        ]}>
        <Text>This has a custom border!</Text>
      </VStack>
    </Host>
  );
}
```

## 后续步骤

自定义组件现在可以配合内置修饰符系统工作。接下来你可以：

- 使用 Expo UI 自带的[内置 SwiftUI 组件](/versions/latest/sdk/ui/swift-ui)
- 为应用特有的样式模式编写自定义修饰符
- 包装第三方 SwiftUI 库，供 React Native 使用
- 把组件作为 npm 包分享给他人使用
