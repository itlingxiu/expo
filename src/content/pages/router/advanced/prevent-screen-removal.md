---
title: 阻止屏幕被移除
description: 了解如何在 Expo Router 移除屏幕之前确认导航。
---

# 阻止屏幕被移除

:::warning
`usePreventRemove()` 自 **Expo SDK 58** 起可用。
:::

使用 `usePreventRemove()` 可以在屏幕包含未保存更改时保持其打开。当导航试图移除该屏幕时，hook 会运行你的回调。

```tsx src/app/edit-profile.tsx
import { usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, TextInput } from 'react-native';

export default function EditProfile() {
  const [name, setName] = useState('');
  const hasUnsavedChanges = name.length > 0;

  usePreventRemove(hasUnsavedChanges, ({ repeat }) => {
    const discardChanges = () => {
      setName('');
      repeat();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Discard your unsaved changes?')) {
        discardChanges();
      }
      return;
    }

    Alert.alert('Discard changes?', 'You have unsaved changes.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: discardChanges,
      },
    ]);
  });

  return <TextInput value={name} onChangeText={setName} placeholder="Name" />;
}
```

在调用 `repeat()` 之前，把传给 `usePreventRemove()` 的值设为 `false`。这样状态会与“阻止移除”保持同步。

## 关闭阻止移除

该 hook 还会返回一个用于关闭阻止的函数。当你想取消被拦截的操作并导航到别处时使用它。

```tsx src/app/edit-profile.tsx
import { router, usePreventRemove } from 'expo-router';
import { useState } from 'react';
import { Button } from 'react-native';

export default function EditProfile() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
  const disablePrevention = usePreventRemove(hasUnsavedChanges);

  function leaveForm() {
    setHasUnsavedChanges(false);
    disablePrevention();
    router.replace('/profile');
  }

  return <Button title="Leave without saving" onPress={leaveForm} />;
}
```

:::note
在 Web 上，`usePreventRemove()` 还会在刷新、关闭标签页或外部导航之前请求浏览器确认。是否弹出对话框及其文案由浏览器控制。
:::

全部阻止移除选项见 [Expo Router API 参考](/versions/latest/sdk/router)。
