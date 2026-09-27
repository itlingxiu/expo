---
title: 模态
description: 了解如何在 Expo Router 中使用模态。
---

# 模态

> 视频：[在 Expo Router 中使用模态](https://www.youtube.com/watch?v=gNzuJVRmyDk)。了解在应用其余内容之上显示内容的不同方式。

模态是移动应用中常见的用户界面模式。它们用于在现有屏幕之上呈现内容，并用于不同目的，例如显示确认提示或独立表单。可以用以下方法在应用中创建模态：

- 使用 React Native 的 [`Modal`](https://reactnative.dev/docs/modal) 组件。
- 使用 Expo Router 特殊的基于文件的语法，在应用导航系统内创建模态屏幕。

每种方法都有其特定用例。理解何时使用每种方法，对于创造良好的用户体验很重要。

## React Native 的 Modal 组件

`Modal` 组件是 React Native 核心 API 的一部分。常见用例包括：

- 独立交互，例如不需要成为导航系统一部分的自包含任务。
- 临时提示或确认对话框，适合快速交互。

下面是一个自定义 `Modal` 组件在不同平台上覆盖当前屏幕的示例。

> 此处有一段示例动画，展示 React Native `Modal` 组件在不同平台上覆盖当前屏幕的效果。

对大多数用例，可以使用 `Modal` 组件，并按应用的用户界面要求进行自定义。如何使用 `Modal` 组件及其属性的细节，见 [React Native 文档](https://reactnative.dev/docs/modal)。

## 使用 Expo Router 的模态屏幕

模态屏幕是在 **src/app** 目录内创建的文件，并用作现有栈中的一条路由。它用于需要成为导航系统一部分的复杂交互，例如多步表单，流程完成后可以链接到特定屏幕。

下面是模态屏幕在不同平台上如何工作的示例。

> 此处有一段示例动画，展示模态屏幕在不同平台上的呈现方式。

### 用法

要实现模态路由，在 **src/app** 目录内创建一个名为 **modal.tsx** 的屏幕。示例文件结构如下：

```text
src/app/_layout.tsx
src/app/index.tsx
src/app/modal.tsx
```

上面的文件结构会生成一个布局，其中 `index` 是栈中的第一条路由。在根布局文件（**src/app/\_layout.tsx**）中，可以把 `modal` 路由添加到栈中。要把它呈现为模态，请将该路由的 `presentation` 选项设为 `modal`。

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          // 将模态路由的 presentation 模式设为 modal。
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
```

可以从 **index.tsx** 文件用 `Link` 组件导航到模态屏幕。

```tsx src/app/index.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home screen</Text>
      {/* 使用 Link 组件导航到模态屏幕。href 属性是模态屏幕的路由名称。 */}
      <Link href="/modal" style={styles.link}>
        Open modal
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    paddingTop: 20,
    fontSize: 20,
  },
});
```

**modal.tsx** 呈现模态的内容。

```tsx src/app/modal.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### 模态的呈现与关闭行为

当模态是导航器中的当前屏幕并作为独立屏幕呈现时，它会失去先前的上下文。它的呈现和关闭行为在每个平台上不同：

- 在 Android 上，模态滑到当前屏幕之上。要关闭它，使用返回按钮导航回上一屏幕。
- 在 iOS 上，模态从当前屏幕底部滑入。要关闭它，从顶部向下滑动。
- 在 Web 上，模态作为单独的路由呈现，关闭行为必须使用 [`router.canGoBack()`](/router/basics/navigation) 手动提供。下面是如何关闭模态的示例：

```tsx src/app/modal.tsx
// 导入用于命令式导航的 router 对象。
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  // 使用 router.canGoBack() 检查模态是否作为独立屏幕呈现。如果屏幕被重新加载或被直接导航到，则模态应作为全屏呈现。你可能需要据此更改 UI。
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      {/* 在 Web 上，使用 ../ 作为导航到根的简单方式。这并不等同于 goBack。 */}
      {isPresented && <Link href="../">Dismiss modal</Link>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### 在 iOS 上更改状态栏外观

在 iOS 上，模态默认有深色背景，会隐藏状态栏。要更改状态栏外观，可以使用 `Platform` API 检查当前平台是否为 iOS，然后在 **modal.tsx** 文件内使用 [`StatusBar`](/versions/latest/sdk/status-bar) 组件更改外观。

```tsx src/app/modal.tsx
import { StyleSheet, Text, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      {/* 使用 Platform.OS 检查当前平台是否为 iOS，然后使用 StatusBar 组件更改外观。 */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### 处理深层链接的模态

在使用栈或嵌套栈导航器时，模态需要锚定，以确保正确的导航行为。当深层链接到模态路由时，这一点至关重要。如果没有锚定，模态后面的屏幕会被清掉，从而没有导航上下文。

_锚点_ 作为模态的基底。在复杂应用中，当有嵌套栈时，必须为嵌套栈定义锚点，其值成为该栈的初始路由。

可以从栈的布局文件导出 `unstable_settings` 来配置锚点：

```tsx
export const unstable_settings = {
  anchor: 'index', // 锚定到 index 路由
};
```

在上面的示例中，`anchor: 'index'` 告诉 Expo Router，在呈现模态时应在后台保持指定的锚点路由。

## 表单工作表呈现

表单工作表把模态呈现为底部工作表，应用用户可以在不同高度（称为 detent）之间拖动。这对于需要部分屏幕覆盖并支持交互式调整大小的内容很有用。

### 基本用法

要使用表单工作表，把模态屏幕的 `presentation` 选项设为 `formSheet`：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          // 将 presentation 模式设为 formSheet。
          presentation: 'formSheet',
        }}
      />
    </Stack>
  );
}
```

### 配置工作表 detent

Detent 定义工作表可以停留的高度。使用 `sheetAllowedDetents` 配置它们：

- **数字数组**（`number[]`）：把吸附位置指定为屏幕高度的分数，范围在 0 到 1 之间。例如，`[0.25, 0.5, 1]` 创建三个吸附点，分别在 25%、50% 和全屏高度。值必须按升序排列。

- **适应内容**（`'fitToContents'`）：工作表根据其内容自动调整大小。使用此选项时，必须提供明确的内容尺寸，因为不支持 `flex: 1`——工作表需要知道内容的实际大小才能确定高度。

:::note
Android 最多支持 3 个 detent。iOS 接受任意数量的 detent。
:::

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          // 把 detent 位置指定为屏幕高度的分数。
          sheetAllowedDetents: [0.25, 0.5, 1],
          // 打开时所处 detent 的索引（0 = 最小）。
          sheetInitialDetentIndex: 1,
        }}
      />
    </Stack>
  );
}
```

### 其他工作表选项

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `sheetInitialDetentIndex` | `number \| 'last'` | 工作表打开时所处 detent 的索引（默认：`0`）。 |
| `sheetGrabberVisible` | `boolean` | 在工作表顶部显示抓手（仅 iOS）。 |
| `sheetCornerRadius` | `number` | 工作表的圆角半径，单位为像素。 |
| `sheetLargestUndimmedDetentIndex` | `number \| 'none' \| 'last'` | 保持背景不变暗的最大 detent 索引。 |

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.25, 0.5, 1],
          sheetInitialDetentIndex: 0,
          // 在工作表顶部显示抓手（仅 iOS）。
          sheetGrabberVisible: true,
          // 设置工作表的圆角半径。
          sheetCornerRadius: 24,
          // 在工作表超过索引 1 处的 detent 之前，背景保持不变暗。
          sheetLargestUndimmedDetentIndex: 1,
        }}
      />
    </Stack>
  );
}
```

### Android 限制

在 Android 上，表单工作表使用平台的底部工作表行为。表单工作表屏幕内不支持原生栈标题栏和嵌套栈导航器，因此 `headerShown`、`title` 和标题按钮等选项不会在工作表内渲染。如果表单工作表需要标题或操作，请把它们作为工作表内容的一部分渲染。

### 工作表页脚（Android）

:::warning
`unstable_sheetFooter` 是仅 Android 的[实验性](/more/release-statuses#experimental)功能，未来版本可能会更改。
:::

可以使用 React 组件为工作表添加页脚，它在所有 detent 位置都保持可见：

```tsx src/app/_layout.tsx
import { Stack } from 'expo-router';
import { View, Button } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          // 返回一个 React 组件，在工作表底部渲染为页脚。
          unstable_sheetFooter: () => (
            <View style={{ padding: 16, backgroundColor: 'white' }}>
              <Button title="Confirm" onPress={() => {}} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
```

### 在自定义 detent 中使用 `flex: 1`

:::note
在 SDK 55 及更高版本中，使用自定义数字 detent 时，`flex: 1` 在 iOS 上可以正确工作。这不适用于 `fitToContents`，后者必须提供明确的内容尺寸。
:::

使用数字 detent 时，模态内容可以用 `flex: 1` 填满工作表中的可用空间：

```tsx src/app/modal.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function Modal() {
  return (
    // 使用 flex: 1 填满工作表中的可用空间。
    <View style={styles.container}>
      <Text>Modal content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
```

## 更多信息

### 呈现选项

在 Android 和 iOS 上，使用 `presentation` 选项呈现模态屏幕有多种选项。

| 选项 | 说明 |
| --- | --- |
| `card` | 新屏幕会被压入栈。Android 上的默认动画会因操作系统版本和主题而异。在 iOS 上，它会从侧面滑入。 |
| `modal` | 新屏幕会以模态呈现，允许在屏幕内渲染嵌套栈。 |
| `transparentModal` | 新屏幕会以模态呈现，上一屏幕保持可见。如果屏幕有半透明背景，仍可以看到下方内容。 |
| `containedModal` | 在 Android 上回退为 `modal`。在 iOS 上使用 [`UIModalPresentationCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationcurrentcontext) 模态样式。 |
| `containedTransparentModal` | 在 Android 上回退为 `transparentModal`。在 iOS 上使用 [`UIModalPresentationOverCurrentContext`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationovercurrentcontext) 模态样式。 |
| `fullScreenModal` | 在 Android 上回退为 `modal`。在 iOS 上使用 [`UIModalPresentationFullScreen`](https://developer.apple.com/documentation/uikit/uimodalpresentationstyle/uimodalpresentationfullscreen) 模态样式。 |
| `formSheet` | 呈现带有可配置 detent 的底部工作表。细节见[表单工作表呈现](#表单工作表呈现)。 |
