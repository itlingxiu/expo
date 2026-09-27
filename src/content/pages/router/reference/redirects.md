---
title: 重定向
description: 了解如何在 Expo Router 中重定向 URL。
---

# 重定向

可以根据应用内的某些条件，把请求重定向到另一个 URL。Expo Router 支持多种重定向方式。

## 使用 `Redirect` 组件

使用 `Redirect` 组件可以从某个页面立即重定向：

```tsx
import { View, Text } from 'react-native';
/* @info */
import { Redirect } from 'expo-router';
/* @end */

export default function Page() {
  /* @info 判断用户是否已登录的逻辑。 */
  const { user } = useAuth();
  /* @end */

  if (!user) {
    /* @info 若用户未认证，则重定向到登录页。 */
    return <Redirect href="/login" />;
    /* @end */
  }

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
```

## 使用 `useRouter` hook

也可以用 `useRouter` hook 以命令式方式重定向：

```tsx
import { Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    // 调用 replace，重定向到新路由且不写入历史记录。
    // 放在 useFocusEffect 中，确保每次屏幕获得焦点时都会重定向。
    router.replace('/profile/settings');
  });

  return <Text>My Screen</Text>;
}
```
