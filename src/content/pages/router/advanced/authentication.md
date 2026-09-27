---
title: Expo Router 中的认证
description: 如何使用 Expo Router 实现认证并保护路由。
---

# Expo Router 中的认证

:::note
本指南的先前版本（SDK 52 及更早）见[认证（重定向）](/router/advanced/authentication-rewrites)。
:::

使用 Expo Router 时，所有路由始终被定义且可访问。可以根据用户是否已认证，用运行时逻辑把用户从特定屏幕重定向走。在路由内认证用户有两种不同技术。本指南提供一个示例，演示标准原生应用的功能。

## 使用受保护路由

[受保护路由](/router/advanced/protected)允许你阻止用户通过客户端导航访问某些路由。如果用户尝试导航到受保护屏幕，或者某个屏幕在处于活动状态时变为受保护，他们会被重定向到锚点路由（通常是 index 屏幕）或栈中第一个可用屏幕。考虑以下项目结构：`/sign-in` 路由始终可访问，`(app)` 分组需要认证：

```text
src/app/_layout.tsx           控制哪些内容受保护
src/app/sign-in.tsx           始终可访问
src/app/(app)/_layout.tsx     需要授权
src/app/(app)/index.tsx       应由 (app)/_layout 保护
```

1. 要遵循上面的示例，设置一个可以向整个应用暴露认证会话的 [React Context provider](https://react.dev/reference/react/createContext)。你可以实现自己的认证会话 provider，或使用下面**示例认证上下文**中的实现。

   <details>
   <summary>示例认证上下文</summary>

   此 provider 使用 mock 实现。可以把它替换为你自己的[认证提供方](/guides/authentication)。

   ```tsx src/ctx.tsx
   import { use, createContext, type PropsWithChildren } from 'react';

   import { useStorageState } from './useStorageState';

   const AuthContext = createContext<{
     signIn: () => void;
     signOut: () => void;
     session?: string | null;
     isLoading: boolean;
   } | null>(null);

   // 使用此 hook 访问用户信息。
   export function useSession() {
     const value = use(AuthContext);
     if (!value) {
       throw new Error('useSession must be wrapped in a <SessionProvider />');
     }

     return value;
   }

   export function SessionProvider({ children }: PropsWithChildren) {
     const [[isLoading, session], setSession] = useStorageState('session');

     return (
       <AuthContext.Provider
         value={{
           signIn: () => {
             // 在这里执行登录逻辑
             setSession('xxx');
           },
           signOut: () => {
             setSession(null);
           },
           session,
           isLoading,
         }}>
         {children}
       </AuthContext.Provider>
     );
   }
   ```

   下面的代码片段是一个基本 hook，在原生平台上用 [`expo-secure-store`](/versions/latest/sdk/securestore) 安全地持久化令牌，在 Web 上则使用本地存储。

   ```tsx src/useStorageState.ts
   import  { useEffect, useCallback, useReducer } from 'react';
   import * as SecureStore from 'expo-secure-store';
   import { Platform } from 'react-native';

   type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

   function useAsyncState<T>(
     initialValue: [boolean, T | null] = [true, null],
   ): UseStateHook<T> {
     return useReducer(
       (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
       initialValue
     ) as UseStateHook<T>;
   }

   export async function setStorageItemAsync(key: string, value: string | null) {
     if (Platform.OS === 'web') {
       try {
         if (value === null) {
           localStorage.removeItem(key);
         } else {
           localStorage.setItem(key, value);
         }
       } catch (e) {
         console.error('Local storage is unavailable:', e);
       }
     } else {
       if (value == null) {
         await SecureStore.deleteItemAsync(key);
       } else {
         await SecureStore.setItemAsync(key, value);
       }
     }
   }

   export function useStorageState(key: string): UseStateHook<string> {
     // 公开
     const [state, setState] = useAsyncState<string>();

     // 读取
     useEffect(() => {
       if (Platform.OS === 'web') {
         try {
           if (typeof localStorage !== 'undefined') {
             setState(localStorage.getItem(key));
           }
         } catch (e) {
           console.error('Local storage is unavailable:', e);
         }
       } else {
         SecureStore.getItemAsync(key).then((value: string | null) => {
           setState(value);
         });
       }
     }, [key]);

     // 写入
     const setValue = useCallback(
       (value: string | null) => {
         setState(value);
         setStorageItemAsync(key, value);
       },
       [key]
     );

     return [state, setValue];
   }
   ```

   </details>

2. 创建 **SplashScreenController** 来管理启动屏。认证加载是异步的，因此在认证加载完成之前保持启动屏可见。

   ```tsx src/splash.tsx
   import { SplashScreen } from 'expo-router';
   import { useSession } from './ctx';

   SplashScreen.preventAutoHideAsync();

   export function SplashScreenController() {
     const { isLoading } = useSession();

     if (!isLoading) {
       SplashScreen.hide();
     }

     return null;
   }
   ```

3. 把 `SessionProvider` 添加到根布局。这让整个应用都能访问认证上下文。确保 `SplashScreenController` 位于 `SessionProvider` 内部。

   ```tsx src/app/_layout.tsx
   import { Stack } from 'expo-router';

   import { SessionProvider } from '@/ctx';
   import { SplashScreenController } from '@/splash';

   export default function Root() {
     // 设置认证上下文，并在其中渲染布局。
     return (
       <SessionProvider>
         <SplashScreenController />
         <RootNavigator />
       </SessionProvider>
     );
   }

   // 创建一个稍后可以访问 SessionProvider 上下文的新组件。
   function RootNavigator() {
     return <Stack />;
   }
   ```

4. 创建 `/sign-in` 屏幕。此屏幕使用 `signIn()` 切换认证。由于此屏幕位于 `(app)` 分组之外，渲染此屏幕时不会运行该分组的布局和认证检查。这让已登出的用户可以访问此屏幕。

   ```tsx src/app/sign-in.tsx
   import { router } from 'expo-router';
   import { Text, View } from 'react-native';

   import { useSession } from '@/ctx';

   export default function SignIn() {
     const { signIn } = useSession();
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text
           onPress={() => {
             signIn();
             // 登录后导航。你可能希望调整这一点，以确保登录成功后再导航。
             router.replace('/');
           }}>
           Sign In
         </Text>
       </View>
     );
   }
   ```

5. 现在修改 `RootNavigator`，根据 `SessionProvider` 保护路由。

   ```tsx src/app/_layout.tsx
   // 所有 import 语句保持不变，但需要从 ctx.tsx 文件导入 useSession。
   import { SessionProvider, useSession } from '@/ctx';

   // 上面的代码保持不变。在下面根据 SessionProvider 更新 RootNavigator 以保护路由。

   function RootNavigator() {
     const { session } = useSession();

     return (
       <Stack>
         <Stack.Protected guard={!!session}>
           <Stack.Screen name="(app)" />
         </Stack.Protected>

         <Stack.Protected guard={!session}>
           <Stack.Screen name="sign-in" />
         </Stack.Protected>
       </Stack>
     );
   }
   ```

6. 实现一个已认证屏幕，让用户可以登出。

   ```tsx src/app/(app)/index.tsx
   import { Text, View } from 'react-native';

   import { useSession } from '@/ctx';

   export default function Index() {
     const { signOut } = useSession();
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text
           onPress={() => {
             // RootNavigator 中的 guard 会重定向回登录屏幕。
             signOut();
           }}>
           Sign Out
         </Text>
       </View>
     );
   }
   ```

7. 创建 **src/app/(app)/\_layout.tsx**：

   ```tsx src/app/(app)/_layout.tsx
   import { Stack } from 'expo-router';

   export default function AppLayout() {
     // 这会为所有已认证的应用路由渲染导航栈。
     return <Stack />;
   }
   ```

现在你有了一个应用：它会在初始认证状态加载完成之前显示启动屏，并在用户未认证时重定向到登录屏幕。如果用户通过深层链接访问任何带有认证检查的路由，他们会被重定向到登录屏幕。

## 模态与按路由认证

另一种常见模式是在应用上方渲染登录模态。这样可以在认证完成后关闭模态，并部分保留深层链接。不过，此模式要求路由在后台渲染，因为这些路由需要在没有认证的情况下处理数据加载。

```text
src/app/_layout.tsx                 声明全局会话上下文
src/app/(app)/_layout.tsx
src/app/(app)/sign-in.tsx           在根之上呈现的模态
src/app/(app)/(root)/_layout.tsx    保护子路由
src/app/(app)/(root)/index.tsx      需要授权
```

```tsx src/app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  anchor: '(root)',
};

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(root)" />
      <Stack.Screen
        name="sign-in"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
```

## 更多信息

更多信息请阅读[受保护路由文档](/router/advanced/protected)，了解更多模式。

> 视频：[如何在 Expo Router 第 5 版及更高版本中使用受保护路由以实现顺畅认证](https://www.youtube.com/watch?v=XCTaMu0qnFY)。了解如何在 Expo Router 第 5 版及更高版本中使用受保护路由创建认证流程。

## 中间件

传统上，网站可能会利用某种形式的服务端重定向来保护路由。Web 上的 Expo Router 目前只支持构建时静态生成，不支持自定义中间件或服务。将来可以添加这一点，以提供更理想的 Web 体验。在此期间，可以通过客户端重定向和加载状态来实现认证。
