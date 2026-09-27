---
title: 使用重定向在 Expo Router 中进行认证
description: 如何使用 Expo Router 实现认证并保护路由。
---

# 使用重定向在 Expo Router 中进行认证

:::note
SDK 53 引入了[受保护路由](/router/advanced/protected)，这是一种更强大的认证处理方式。如果你使用的是 SDK 52 及更早版本，请遵循本指南。
:::

> 视频：[使用 Expo Router 构建认证流程](https://www.youtube.com/watch?v=yNaOaR2kIa0)。了解如何在 Expo Router 项目中实现认证流程。

使用 Expo Router 时，所有路由始终被定义且可访问。可以根据用户是否已认证，用运行时逻辑把用户从特定屏幕重定向走。在路由内认证用户有两种不同技术。本指南提供一个示例，演示标准原生应用的功能。

## 使用 React Context 与路由组

把特定路由限制给未认证用户是常见需求。可以通过 React Context 和路由组以有组织的方式实现。考虑以下项目结构：`/sign-in` 路由始终可访问，`(app)` 分组需要认证：

```text
app/_layout.tsx
app/sign-in.tsx           始终可访问
app/(app)/_layout.tsx     保护子路由
app/(app)/index.tsx       需要授权
```

1. 要遵循上面的示例，设置一个可以向整个应用暴露认证会话的 [React Context provider](https://react.dev/reference/react/createContext)。你可以实现自己的认证会话 provider，或使用下面**示例认证上下文**中的实现。

   <details>
   <summary>示例认证上下文</summary>

   此 provider 使用 mock 实现。可以把它替换为你自己的[认证提供方](/guides/authentication)。

   ```tsx ctx.tsx
   import { useContext, createContext, type PropsWithChildren } from 'react';
   import { useStorageState } from './useStorageState';

   const AuthContext = createContext<{
     signIn: () => void;
     signOut: () => void;
     session?: string | null;
     isLoading: boolean;
   }>({
     signIn: () => null,
     signOut: () => null,
     session: null,
     isLoading: false,
   });

   // 此 hook 可用于访问用户信息。
   export function useSession() {
     const value = useContext(AuthContext);
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

   ```tsx useStorageState.ts
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
     if (process.env.EXPO_OS === 'web') {
       if (value === null) {
         localStorage.removeItem(key);
       } else {
         localStorage.setItem(key, value);
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

2. 在根布局中使用 `SessionProvider`，向整个应用提供认证上下文。必须在触发任何导航事件之前挂载 `<Slot />`。否则会抛出运行时错误。

   ```tsx app/_layout.tsx
   import { Slot } from 'expo-router';
   import { SessionProvider } from '../ctx';

   export default function Root() {
     // 设置认证上下文，并在其中渲染布局。
     return (
       <SessionProvider>
         <Slot />
       </SessionProvider>
     );
   }
   ```

3. 创建一个嵌套的[布局路由](/router/basics/navigation-layouts)，在渲染子路由组件之前检查用户是否已认证。如果用户未认证，此布局路由会把他们重定向到登录屏幕。

   ```tsx app/(app)/_layout.tsx
   import { Text } from 'react-native';
   import { Redirect, Stack } from 'expo-router';

   import { useSession } from '../../ctx';

   export default function AppLayout() {
     const { session, isLoading } = useSession();

     // 可以保持启动屏打开，或者像这里一样渲染一个加载屏幕。
     if (isLoading) {
       return <Text>Loading...</Text>;
     }

     // 只在 (app) 分组的布局内要求认证，因为用户
     // 需要能够访问 (auth) 分组并再次登录。
     if (!session) {
       // 在 Web 上，静态渲染会在这里停止，因为用户在渲染页面的
       // 无界面 Node 进程中未认证。
       return <Redirect href="/sign-in" />;
     }

     // 此布局可以延迟，因为它不是根布局。
     return <Stack />;
   }
   ```

4. 创建 `/sign-in` 屏幕。它可以用 `signIn()` 切换认证。由于此屏幕位于 `(app)` 分组之外，渲染此屏幕时不会运行该分组的布局和认证检查。这让已登出的用户可以看到此屏幕。

   ```tsx app/sign-in.tsx
   import { router } from 'expo-router';
   import { Text, View } from 'react-native';

   import { useSession } from '../ctx';

   export default function SignIn() {
     const { signIn } = useSession();
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text
           onPress={() => {
             signIn();
             // 登录后导航。你可能希望调整这一点，以确保登录
             // 成功后再导航。
             router.replace('/');
           }}>
           Sign In
         </Text>
       </View>
     );
   }
   ```

5. 实现一个已认证屏幕，让用户可以登出。

   ```tsx app/(app)/index.tsx
   import { Text, View } from 'react-native';

   import { useSession } from '../../ctx';

   export default function Index() {
     const { signOut } = useSession();
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <Text
           onPress={() => {
             // app/(app)/_layout.tsx 会重定向到登录屏幕。
             signOut();
           }}>
           Sign Out
         </Text>
       </View>
     );
   }
   ```

现在你有了一个应用：它可以在检查初始认证状态时呈现加载状态，并在用户未认证时重定向到登录屏幕。如果用户通过深层链接访问任何带有认证检查的路由，他们会被重定向到登录屏幕。

## 替代加载状态

使用 Expo Router 时，在加载初始认证状态期间必须向屏幕渲染一些内容。在上面的示例中，应用布局渲染一条加载消息。也可以让 `index` 路由成为加载状态，并把初始路由移到类似 `/home` 的地方，这与 X 的做法类似。

## 模态与按路由认证

另一种常见模式是在应用上方渲染登录模态。这样可以在认证完成后关闭模态，并部分保留深层链接。不过，此模式要求路由在后台渲染，因为这些路由需要在没有认证的情况下处理数据加载。

```text
app/_layout.tsx                 声明全局会话上下文
app/(app)/_layout.tsx
app/(app)/sign-in.tsx           在根之上呈现的模态
app/(app)/(root)/_layout.tsx    保护子路由
app/(app)/(root)/index.tsx      需要授权
```

```tsx app/(app)/_layout.tsx
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

## 在没有导航器的情况下导航

当应用试图在[根布局](/router/basics/navigation-layouts#根布局)中尚未挂载导航器时执行导航，你可能会遇到以下错误。

```text
Error: Attempted to navigate before mounting the Root Layout component. Ensure the Root Layout component is rendering a Slot, or other navigator on the first render.
```

要修复此问题，添加一个分组，并把条件逻辑下移一层。

### 之前

```text
app/_layout.tsx
app/about.tsx
```

```tsx app/_layout.tsx
export default function RootLayout() {
  React.useEffect(() => {
    // 此导航事件会触发上面的错误。
    router.push('/about');
  }, []);

  // 此条件语句会造成问题，因为根布局的
  // 内容（Slot）必须在任何导航事件发生之前挂载。
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}
```

### 之后

```text
app/_layout.tsx
app/(app)/_layout.tsx    把条件逻辑下移一层
app/(app)/about.tsx
```

```tsx app/_layout.tsx
export default function RootLayout() {
  return <Slot />;
}
```

```tsx app/(app)/_layout.tsx
export default function RootLayout() {
  React.useEffect(() => {
    router.push('/about');
  }, []);

  // 延迟渲染此嵌套布局的内容是可以的。我们不能
  // 延迟渲染根布局的内容，因为导航事件（重定向）
  // 会在根布局内容挂载之前被触发。
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return <Slot />;
}
```

## 中间件

传统上，网站可能会利用某种形式的服务端重定向来保护路由。Web 上的 Expo Router 目前只支持构建时静态生成，不支持自定义中间件或服务。将来可以添加这一点，以提供更理想的 Web 体验。在此期间，可以通过客户端重定向和加载状态来实现认证。
