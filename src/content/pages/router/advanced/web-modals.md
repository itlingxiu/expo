---
title: 构建自定义 Web 模态
description: 了解如何使用 Expo Router 为 Web 构建模态遮罩。
---

# 构建自定义 Web 模态

Expo Router 不再提供实验性的 Web 模态实现。在 Web 上，`presentation: 'modal'` 或 `presentation: 'formSheet'` 的屏幕会作为普通栈路由渲染。

:::warning
如果之前启用了 `EXPO_UNSTABLE_WEB_MODAL`，请从环境中移除它。`webModalStyle` 屏幕选项和 `--expo-router-modal-*` CSS 变量已不再可用。
:::

## 使用透明遮罩路由

对大多数应用，使用内置 `Stack`，并在 Web 上将模态路由设为 `transparentModal`。Expo Router 会让上一条路由在透明模态后面保持可见，因此路由组件只需渲染背景和对话框。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export const unstable_settings = { anchor: 'index' };

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: Platform.select({ web: 'transparentModal', default: 'modal' }),
          headerShown: false,
          animation: Platform.select({ web: 'none', default: undefined }),
        }}
      />
    </Stack>
  );
}
```

视觉效果请使用[平台特定组件](/router/advanced/platform-specific-modules)。Web 实现负责背景、Escape 键和关闭。原生实现原样返回 `children`，因此 **modal.tsx** 可以在每个平台上都用 `WebModal` 包裹内容。

```tsx src/components/WebModal.web.tsx
import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export function WebModal({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && router.canGoBack()) router.back();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const dismiss = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityLabel="Dismiss modal"
        onPress={dismiss}
        style={StyleSheet.absoluteFill}
      />
      <View role="dialog" style={styles.dialog}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
  },
  dialog: { width: '100%', maxWidth: 640, borderRadius: 16, backgroundColor: 'white', padding: 24 },
});
```

```tsx src/components/WebModal.native.tsx
import type { ReactNode } from 'react';

export function WebModal({ children }: { children: ReactNode }) {
  return children;
}
```

## 构建自定义导航器

如果应用有多个 Web 模态，请用 `StackRouter` 创建[自定义导航器](/router/advanced/custom-navigators)。该导航器增加一个 `modal` 屏幕选项，先渲染栈直到最后一条非模态路由，再把每条模态路由层叠在上面。按应用的风格设置遮罩样式。

:::warning
`NativeStackView` 自 SDK 58 起可用。
:::

```tsx src/components/ModalStack.web.tsx
import {
  NativeStackView,
  type NativeStackDescriptorMap,
  type NativeStackNavigationOptions,
  type NativeStackViewState,
  StackRouter,
  createStandardRouterNavigator,
  type NavigatorContentProps,
} from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Options = NativeStackNavigationOptions & { modal?: boolean };

function YourModal({ children, onDismiss }: { children: ReactNode; onDismiss: () => void }) {
  return (
    <View style={styles.overlay}>
      <Pressable onPress={onDismiss} style={StyleSheet.absoluteFill} />
      <View style={styles.dialog}>{children}</View>
    </View>
  );
}

function ModalStackContent({ state, descriptors, actions }: NavigatorContentProps<Options>) {
  // 过滤预加载的路由。
  const activeRoutes = state.routes.slice(0, state.index + 1);
  const lastNonModalRouteIndex = activeRoutes.findLastIndex(
    route => !descriptors[route.key].options.modal
  );
  const hasModals = lastNonModalRouteIndex < state.index;

  // 标准导航描述符与 NativeStackView 描述符使用相同的运行时形状。
  const nativeStackDescriptors = descriptors as unknown as NativeStackDescriptorMap;

  if (!hasModals) {
    return (
      <NativeStackView state={state as NativeStackViewState} descriptors={nativeStackDescriptors} />
    );
  }

  const baseStackRoutes = activeRoutes.slice(0, lastNonModalRouteIndex + 1);
  const baseStackPreloadedRoutes = state.routes.slice(state.index + 1);
  const baseStackState = {
    ...state,
    index: lastNonModalRouteIndex,
    routes: [...baseStackRoutes, ...baseStackPreloadedRoutes],
  } as NativeStackViewState;
  const modalRoutes = activeRoutes.slice(lastNonModalRouteIndex + 1);

  return (
    <View style={{ flex: 1 }}>
      <NativeStackView state={baseStackState} descriptors={nativeStackDescriptors} />
      {modalRoutes.map(route => (
        <YourModal key={route.key} onDismiss={actions.back}>
          {descriptors[route.key].render()}
        </YourModal>
      ))}
    </View>
  );
}

export const ModalStack = createStandardRouterNavigator(ModalStackContent, StackRouter);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 24,
  },
  dialog: { width: '100%', maxWidth: 640, backgroundColor: 'white', padding: 24 },
});
```

```tsx src/app/_layout.web.tsx
import { ModalStack } from '../components/ModalStack.web';

export const unstable_settings = { anchor: 'index' };

export default function Layout() {
  return (
    <ModalStack>
      <ModalStack.Screen name="index" />
      <ModalStack.Screen name="modal" options={{ modal: true }} />
    </ModalStack>
  );
}
```
