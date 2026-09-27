---
title: 使用 Clerk
description: 为 Expo/React Native 项目添加 Clerk 身份验证与用户管理的指南。
---

# 使用 Clerk

[Clerk](https://clerk.com/expo-authentication) 是一个身份验证与用户管理平台，提供注册、登录、多因素认证、社交登录、组织与托管用户数据库。[`@clerk/expo`](https://www.npmjs.com/package/@clerk/expo) SDK 提供 React hooks、控制组件、托管身份验证，以及在 Android 上以 Jetpack Compose、iOS 上以 SwiftUI 渲染的预构建原生 UI 组件。

本指南涵盖安装 `@clerk/expo`、用 `<ClerkProvider>` 包裹应用，以及选择集成方式。它针对 `@clerk/expo` 4.x，支持 Expo SDK 54 及以后。

## 选择你的集成方式

有三种受支持的方式；之后可以切换，无需重写应用。

| 方式 | 你构建什么 | 能在 Expo Go 中运行 | 最适合 |
| --- | --- | --- | --- |
| 托管身份验证 | 一个按钮，在浏览器认证会话中打开 Clerk 的 Account Portal | ✓ | 最快上手，仪表盘中启用的每种方法都可用 |
| 原生 UI 组件 | 直接使用 `@clerk/expo/native` 的 `<AuthView />`、`<UserButton />` 与 `<UserProfileView />` | ✗ | 完整的原生登录与账户管理 UI |
| 自定义流程 | 你自己的 React Native 屏幕，调用 `useSignUp()`、`useSignIn()` 等 hooks | ✓ | 最大限度的 UI 控制 |

:::note
`@clerk/expo/native` 中的原生 UI 组件目前处于 beta。它们在 Android 上以 Jetpack Compose、iOS 上以 SwiftUI 渲染，并把已登录会话同步回 JavaScript SDK，因此 `useAuth()`、`useUser()` 等所有 `@clerk/expo` hooks 保持同步。
:::

## 前置条件

#### 创建 Clerk 账户与应用

在 [Clerk Dashboard](https://dashboard.clerk.com/) 注册并创建一个应用。

#### 启用 Native API

打开 Clerk Dashboard 中的 [Native applications](https://dashboard.clerk.com/last-active?path=native-applications) 页面，确认 **Native API** 已开启 —— 任何使用 `@clerk/expo` 的 Expo 集成都需要它。

#### 使用 Expo SDK 53 或以后

`@clerk/expo` Core 3 的 peer dependency 是 `expo: >=53 <56`。

#### 原生功能使用开发构建

原生 UI 组件与原生登录 hooks 需要开发构建。托管身份验证与自定义流程也可以在 Expo Go 中工作。

## 安装并配置 Clerk

### 安装 `@clerk/expo` 与 `expo-secure-store`

使用 `npx expo install` 让版本匹配你的 Expo SDK：

```sh
# npm
npx expo install @clerk/expo expo-secure-store

# yarn
yarn expo install @clerk/expo expo-secure-store

# pnpm
pnpm expo install @clerk/expo expo-secure-store

# bun
bun expo install @clerk/expo expo-secure-store
```

`expo-secure-store` 是 peer dependency。Clerk 通过 `@clerk/expo/token-cache` 使用它，用 iOS Keychain 与 Android Keystore 加密会话令牌。

对于托管身份验证，还要安装 Clerk 用来打开浏览器认证会话的包：

```sh
# npm
npx expo install expo-auth-session expo-crypto expo-web-browser

# yarn
yarn expo install expo-auth-session expo-crypto expo-web-browser

# pnpm
pnpm expo install expo-auth-session expo-crypto expo-web-browser

# bun
bun expo install expo-auth-session expo-crypto expo-web-browser
```

如果你打算在自定义流程中添加原生 Sign in with Google 按钮，安装 `@clerk/expo-google-signin` 与 `expo-crypto`：

```sh
# npm
npx expo install @clerk/expo-google-signin expo-crypto

# yarn
yarn expo install @clerk/expo-google-signin expo-crypto

# pnpm
pnpm expo install @clerk/expo-google-signin expo-crypto

# bun
bun expo install @clerk/expo-google-signin expo-crypto
```

对于原生 Sign in with Apple 按钮，安装 `expo-apple-authentication` 与 `expo-crypto`：

```sh
# npm
npx expo install expo-apple-authentication expo-crypto

# yarn
yarn expo install expo-apple-authentication expo-crypto

# pnpm
pnpm expo install expo-apple-authentication expo-crypto

# bun
bun expo install expo-apple-authentication expo-crypto
```

如果只使用 `@clerk/expo/native` 的 `<AuthView />`，这些额外包都不需要，因为该组件内部处理社交登录流程。

### 校验配置插件

把 `@clerk/expo` 与 `expo-secure-store` 添加到[应用配置](/workflow/configuration)的 `plugins` 数组。如果项目使用静态 **app.json** 且包是用 `npx expo install` 安装的，Expo 已经添加了它们：

```json app.json
{
  "expo": {
    "plugins": ["expo-secure-store", "@clerk/expo"]
  }
}
```

`@clerk/expo` 插件添加 Apple Sign In entitlement（不使用它时可用 `appleSignIn: false` 插件选项禁用）、为托管身份验证回调注册 Android intent filter，并应用底层 `clerk-android` SDK 所需的 Android 打包修复。如果你使用原生 Sign in with Google 按钮，还要在其旁边添加 `@clerk/expo-google-signin` 插件。

托管身份验证根据应用配置中的 `android.package` 与 `ios.bundleIdentifier` 值派生默认回调。创建生产构建前，在 Clerk Dashboard 的 [Native applications](https://dashboard.clerk.com/last-active?path=native-applications) 页面添加应用，使用相同的 Android 包名与 iOS bundle identifier，因为生产实例会按注册值校验回调。

### 添加你的 Clerk Publishable Key

从 Clerk Dashboard 的 [API keys](https://dashboard.clerk.com/last-active?path=api-keys) 页面复制 Publishable Key，然后把它加入项目根目录的 **.env** 文件：

```text .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
```

`EXPO_PUBLIC_` 前缀是必需的，因为 [Expo 会在构建时内联这些值](/guides/environment-variables#reading-environment-variables-from-env-files)，使它们在 JavaScript bundle 中可用。Clerk 的 Publishable Key 可以安全暴露。**不要**把 Secret Key 放在 `EXPO_PUBLIC_` 前缀之后。

### 用 `<ClerkProvider>` 包裹应用

在你的根布局文件（Expo Router 中是 **src/app/_layout.tsx**）中，用 `<ClerkProvider>` 包裹应用并传入 Publishable Key。推荐显式传入 `tokenCache`：

```tsx src/app/_layout.tsx
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
```

在 Core 3 中，Expo 应用的 `<ClerkProvider>` 必须提供 `publishableKey`。**node_modules** 中的环境变量不会在生产 React Native 构建中被内联，所以必须显式传入该 prop。

来自 `@clerk/expo/token-cache` 的 `tokenCache` 使用 `expo-secure-store` 在应用重启之间持久化用户会话。显式传入它让依赖关系清晰，也便于以后替换为自定义缓存实现。

## 添加身份验证

下一步取决于你选择的方式。

#### 托管身份验证

托管身份验证在应用上方的浏览器认证会话中打开 Clerk 的 [Account Portal](https://clerk.com/docs/guides/account-portal/overview)。用户可以使用为你的 Clerk 应用启用的任何登录/注册方式，SDK 会把产生的会话激活到你的应用中。调用 `useHostedAuth()` hook 的 `startHostedAuth()`：

```tsx src/app/index.tsx
import { useAuth } from '@clerk/expo';
import { useHostedAuth } from '@clerk/expo/hosted-auth';
import { ActivityIndicator, Button, Text, View } from 'react-native';

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { startHostedAuth } = useHostedAuth();

  const handleSignUp = async () => {
    try {
      await startHostedAuth({ mode: 'sign-up' });
    } catch (error) {
      // Handle the error in your app
    }
  };

  if (!isLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      {isSignedIn ? (
        <Text>You're signed in</Text>
      ) : (
        <Button title="Sign up" onPress={handleSignUp} />
      )}
    </View>
  );
}
```

认证完成后，SDK 关闭浏览器会话、激活新会话，并把已登录状态更新到 `useAuth()`。浏览器不会保留一个独立的活跃会话。

`startHostedAuth()` 默认打开登录页，接受 `mode: 'sign-in' | 'sign-up'`。当用户未完成就关闭浏览器时，它以 `null` 的 `createdSessionId` resolve；认证失败时抛出异常。

这种方式可以在 Expo Go 中工作，Expo 会提供开发回调。在开发或生产构建中，回调根据你的 iOS bundle identifier 或 Android 包名派生，所以要在应用配置中保留 `@clerk/expo` 配置插件，并在更改任一标识符后重建原生项目。

Account Portal 在浏览器中运行，因此社交登录使用各提供商的 Web OAuth 流程而非原生流程。生产凭据要求与故障排查参见[托管身份验证指南](https://clerk.com/docs/expo/guides/account-portal/hosted-auth)。

#### 原生 UI 组件

`<AuthView />` 渲染一个完整的原生登录与注册界面，处理邮箱、手机号、passkey、多因素认证，以及 Clerk Dashboard 中启用的任何社交连接。它内联渲染在你的 React Native 视图层级中，因此可以放在模态框、路由或全屏视图中。下面的例子在模态框中打开它：

```tsx src/app/index.tsx
import { useAuth } from '@clerk/expo';
import { AuthView, UserButton } from '@clerk/expo/native';
import { useState } from 'react';
import { ActivityIndicator, Button, Modal, View } from 'react-native';

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (!isLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isSignedIn ? <UserButton /> : <Button title="Sign up" onPress={() => setIsAuthOpen(true)} />}
      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAuthOpen(false)}>
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>
    </View>
  );
}
```

用户登录后，原生会话同步回 JavaScript SDK，因此 `useAuth()` 与 `useUser()` 反映已登录状态。给 `useAuth()` 传入 `treatPendingAsSignedOut: false`，让待处理的 [session tasks](https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks) 不被视为已登出。

:::note
把包含 `<AuthView />` 的 `<Modal>` 保持挂载在与已登录、未登录内容相同的层级。如果你只在未登录内容中渲染它，认证状态可能在 session task 仍待处理时改变，你的条件渲染会过早卸载模态框。
:::

`<AuthView />` 接受 `mode="signIn" | "signUp" | "signInOrUp"`（默认值）、一个控制原生关闭按钮的 `isDismissible` 布尔值，以及 `onDismiss` 回调。当用户必须先认证才能继续时，以全屏视图渲染它并设置 `isDismissible={false}`，而不是放在模态框中。

`<UserButton />` 不接受 props。它显示已登录用户的头像图片或姓名首字母，点击时打开原生 `<UserProfileView />`，用户可以在其中管理个人信息、安全设置与登出。

`<AuthView />` 会自动为 Clerk Dashboard 中启用的任何社交连接显示登录按钮并在内部处理流程，因此你不需要 `expo-crypto` 或原生登录 hooks。原生 OAuth 仍然需要在 Clerk Dashboard 与各提供商控制台设置凭据。否则按钮会出现，但点击时会失败。

这种方式需要开发构建，因为组件由原生模块支撑：

```sh
# npm
# Run a development build locally
npx expo run:android

npx expo run:ios

# Or build with EAS
eas build --platform ios --profile development

# yarn
# Run a development build locally
yarn expo run:android

yarn expo run:ios

# Or build with EAS
eas build --platform ios --profile development

# pnpm
# Run a development build locally
pnpm expo run:android

pnpm expo run:ios

# Or build with EAS
eas build --platform ios --profile development

# bun
# Run a development build locally
bun expo run:android

bun expo run:ios

# Or build with EAS
eas build --platform ios --profile development
```

#### 自定义流程

用 Core 3 的 hooks 构建你自己的屏幕。这可以在 Expo Go 中工作。下面的例子使用 `useSignUp()` 构建一个带邮箱验证码验证的邮箱密码注册表单：

```tsx src/app/index.tsx
import { useAuth, useSignUp } from '@clerk/expo';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      console.error(JSON.stringify(sendError, null, 2));
      return;
    }

    setIsVerifying(true);
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.finalize();
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Text>You're signed in</Text>;
  }

  if (isVerifying) {
    return (
      <View>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Sign up" onPress={handleSignUp} />
      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on Android and iOS */}
      <View nativeID="clerk-captcha" />
    </View>
  );
}
```

在 Core 3 中，`signUp.password()` 与 `signUp.verifications.verifyEmailCode()` 等方法对校验错误返回 `{ error }` 而不是抛出异常。验证完成注册后，`signUp.finalize()` 把它转换为活跃会话并把已登录状态更新到 `useAuth()`。

对应的登录流程使用 `useSignIn()`，其中 `finalize()` 接受一个 `navigate` 回调，让你在重定向前处理 [session tasks](https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks)：

```tsx
import { useSignIn } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();

  const handleSignIn = async (emailAddress: string, password: string) => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return; // let the session task layer handle it
          router.replace(decorateUrl('/') as Href);
        },
      });
    }
  };

  // ... render your email and password fields
}
```

要在自定义屏幕中添加原生 Sign in with Google 与 Sign in with Apple 按钮，使用 `@clerk/expo/google` 的 `useSignInWithGoogle()` hook 与 `@clerk/expo/apple` 的 `useSignInWithApple()` hook。两者都返回一个 start 方法（`startGoogleAuthenticationFlow()` 与 `startAppleAuthenticationFlow()`），resolve 为 `{ createdSessionId, setActive }`。

两个 hook 都使用原生模块，因此需要开发构建以及安装步骤中的包。`useSignInWithGoogle()` 还需要 `@clerk/expo-google-signin` 配置插件。在 iOS 上，App Store Guideline 4.8 要求任何提供第三方社交登录的应用也必须提供 Sign in with Apple。

## 读取已登录用户

在应用任何地方使用 `useUser()` 与 `useAuth()` 读取用户数据，使用 `<Show>` 与 `useClerk()` 保护内容并登出：

```tsx
import { Show, useClerk, useUser } from '@clerk/expo';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View>
      <Show when="signed-in">
        <Text>Hello, {user?.firstName ?? 'friend'}</Text>
        <Pressable onPress={() => signOut()}>
          <Text>Sign out</Text>
        </Pressable>
      </Show>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
      </Show>
    </View>
  );
}
```

`<Show>` 取代了 SDK 早期版本中遗留的 `<SignedIn>`、`<SignedOut>` 与 `<Protect>` 组件。它也接受 `when={{ role: '...' }}`、`when={{ permission: '...' }}` 等授权谓词。

## 运行应用

#### Expo Go

对于托管身份验证与自定义流程，运行以下命令并在 Expo Go 中打开项目：

```sh
# npm
npx expo start

# yarn
yarn expo start

# pnpm
pnpm expo start

# bun
bun expo start
```

#### Android

```sh
# npm
npx expo run:android

# yarn
yarn expo run:android

# pnpm
pnpm expo run:android

# bun
bun expo run:android
```

#### iOS

```sh
# npm
npx expo run:ios

# yarn
yarn expo run:ios

# pnpm
pnpm expo run:ios

# bun
bun expo run:ios
```

## 后续步骤

- [Clerk Expo 快速入门](https://clerk.com/docs/expo/getting-started/quickstart) —— 三种集成方式各自的设置步骤，附配套 GitHub 仓库。
- [托管身份验证](https://clerk.com/docs/expo/guides/account-portal/hosted-auth) —— 通过 Account Portal 从 Expo 应用登录/注册，涵盖回调、取消与生产设置。
- [原生组件参考](https://clerk.com/docs/reference/expo/native-components/overview) —— AuthView、UserButton 与 UserProfileView 的 API 参考，包括配置、主题与平台要求。
- [Sign in with Google](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-google) —— 通过 Clerk Dashboard 与 Google Cloud Console 为 Android/iOS 设置原生 Google 登录。
- [Sign in with Apple](https://clerk.com/docs/expo/guides/configure/auth-strategies/sign-in-with-apple) —— 设置原生 Apple 登录以满足 App Store Guideline 4.8。
- [保护内容并读取用户数据](https://clerk.com/docs/expo/guides/users/reading) —— 使用 hooks 与 Show 组件保护路由、访问用户数据。
- [使用 Clerk 将 Expo 应用部署到生产](https://clerk.com/docs/guides/development/deployment/expo) —— 生产凭据、移动端 SSO 重定向白名单，以及使用 EAS Build 发布。
