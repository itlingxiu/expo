---
title: 'expo-router Color 参考'
description: 用于访问平台特定原生颜色的 Expo Router API。
---

# expo-router Color 参考

> 支持平台：Android、iOS。

Color API 提供对平台特定原生颜色的访问。

> 有关安装和配置，请参阅 [Expo Router](/versions/latest/sdk/router) 参考。

## 用法

```tsx
import { Color } from 'expo-router';
import { Text, View, useColorScheme } from 'react-native';

export default function MyComponent() {
  useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: Color.android.dynamic.primary }}>
      <Text style={{ color: Color.ios.label }}>Hello</Text>
    </View>
  );
}
```

## API

```js
import { Color } from 'expo-router';
```
