---
title: Extending with SwiftUI
description: Learn how to create custom SwiftUI components and modifiers that integrate with Expo UI.
---

# Extending with SwiftUI

> 支持平台：iOS、tvOS。

This guide explains how to use the [Expo Modules API](/modules/overview) to create custom SwiftUI components and modifiers that integrate with Expo UI.

**`@expo/ui` installed**

Install `@expo/ui` in your project. See [SwiftUI components in Expo UI](/versions/latest/sdk/ui/swift-ui) for more information.

```sh
npx expo install @expo/ui
```

**A development build**

A custom Expo module contains native code, which Expo Go cannot load. Create a [development build](/develop/development-builds/introduction) of your app.

**Familiarity with the Expo Modules API and SwiftUI**

This guide assumes basic familiarity with the [Expo Modules API](/modules/overview) and [SwiftUI](https://developer.apple.com/swiftui).

## Creating a custom component

### Project setup

1. Create a local Expo module in your project:

   ```sh
   npx create-expo-module@latest --local my-ui
   ```

2. Add `ExpoUI` as a dependency in your module's podspec file:

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

### Creating a SwiftUI view

3. Create your SwiftUI view with two parts:

   1. **Props class**: Extends `UIBaseViewProps` from `ExpoUI` to get automatic support for the [`modifiers`](modifiers) prop
   2. **View struct**: Conforms to the `ExpoSwiftUI.View` protocol, which requires an `@ObservedObject` `props` property and a `body`

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

4. Register the view in your module using `ExpoUIView`. This wraps your SwiftUI view with modifier support and makes it available to JavaScript:

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

5. Create a wrapper component that connects modifiers with event handling. The `createViewModifierEventListener` utility enables event-based modifiers like `onTapGesture` and `onAppear` to work with your custom view:

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

6. Export the component from your module's entry point:

   ```ts modules/my-ui/index.ts
   export {
     MyCustomView,
     type MyCustomViewProps,
   } from './src/MyCustomView';
   ```

### Using your custom component

> **info** Adding a native source file to a local module does not add it to the iOS project. Run `npx expo prebuild` before you rebuild. Otherwise, the build fails with `cannot find 'MyCustomView' in scope`.

Your custom component now works with all built-in Expo UI modifiers:

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

## Creating custom modifiers

You can also create custom modifiers that work with any Expo UI component.

> **info** Modifiers are SwiftUI's way to configure views for styling, layout, behavior, and more. Learn more in Apple's [ViewModifier documentation](https://developer.apple.com/documentation/swiftui/viewmodifier).

### Native modifier implementation

1. Create a modifier struct that conforms to `ViewModifier` and `Record`:

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

   > **info** This adds a second native source file, so run `npx expo prebuild` again before you rebuild.

2. Register your modifier with `ViewModifierRegistry` in your module definition. To avoid race conditions with the SwiftUI render thread, call `register` in `OnCreate` and `unregister` in `OnDestroy`:

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

### JavaScript modifier function

3. Create a TypeScript function that generates the modifier config:

   ```ts modules/my-ui/src/modifiers.ts
   import { createModifier } from '@expo/ui/swift-ui/modifiers';

   export const customBorder = (params: {
     color?: string;
     width?: number;
     cornerRadius?: number;
   }) => createModifier('customBorder', params);
   ```

4. Export the modifier from your module:

   ```ts modules/my-ui/index.ts
   export {
     MyCustomView,
     type MyCustomViewProps,
   } from './src/MyCustomView';
   export { customBorder } from './src/modifiers';
   ```

### Using custom modifiers

Your custom modifier works with any Expo UI component:

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

## Next steps

Your custom components now work with the built-in modifier system. From here you can:

- Use the [built-in SwiftUI components](/versions/latest/sdk/ui/swift-ui) that come with Expo UI
- Build custom modifiers for app-specific styling patterns
- Wrap third-party SwiftUI libraries for use in React Native
- Share your components as an npm package for others to use
