---
title: Stack 工具栏
description: 了解如何在 Expo Router 的 Stack 导航中使用原生工具栏。
---

# Stack 工具栏

:::warning
`Stack.Toolbar` 是 [alpha](/more/release-statuses#alpha) API，在 **Expo SDK 56** 及更高版本的 Android 上可用，在 **Expo SDK 55** 及更高版本的 iOS 上可用。该 API 可能会发生破坏性变更。
:::

[`Stack.Toolbar`](/versions/latest/sdk/router/stack#stacktoolbar) 让你在 Android 和 iOS 上为 Stack 屏幕添加原生工具栏项。可以把按钮、菜单和自定义视图放在标题栏（左侧或右侧）或底部工具栏中。

## 添加标题按钮

在 `Stack.Toolbar` 中使用 [`Stack.Toolbar.Button`](/versions/latest/sdk/router/stack#stacktoolbarbutton)，并设置 `placement="right"` 或 `placement="left"`，即可向导航标题栏添加按钮。这对于收藏、分享或编辑内容等操作很有用。

:::tabs
:::tab Android

```tsx src/app/notes/[id].tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, Alert } from 'react-native';

export default function NoteScreen() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          // 替换为你自己的图标
          icon={isFavorite ? require('./assets/star-filled.png') : require('./assets/star.png')}
          onPress={() => setIsFavorite(!isFavorite)}
        />
        <Stack.Toolbar.Button
          icon={require('./assets/share.png')}
          onPress={() => Alert.alert('Share')}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={require('./assets/sidebar.png')}
          onPress={() => Alert.alert('Sidebar')}
        />
      </Stack.Toolbar>

      <View style={{ flex: 1, padding: 16 }}>
        <Text>Note content...</Text>
      </View>
    </>
  );
}
```

:::
:::tab iOS

```tsx src/app/notes/[id].tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, Alert } from 'react-native';

export default function NoteScreen() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={isFavorite ? 'star.fill' : 'star'}
          onPress={() => setIsFavorite(!isFavorite)}
        />
        <Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => Alert.alert('Share')} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="sidebar.left" onPress={() => Alert.alert('Sidebar')} />
      </Stack.Toolbar>

      <View style={{ flex: 1, padding: 16 }}>
        <Text>Note content...</Text>
      </View>
    </>
  );
}
```

:::
:::

## 图标

工具栏按钮接受 SF Symbols（仅 iOS）和自定义图片（Android 和 iOS）。

### SF Symbols（仅 iOS）

在 iOS 上添加图标最简单的方式是使用 [SF Symbols](https://developer.apple.com/sf-symbols/)，即 Apple 的内置图标库。把符号名称直接传给 `icon` 属性：

```tsx
<Stack.Toolbar.Button icon="star.fill" onPress={() => {}} />
<Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => {}} />
<Stack.Toolbar.Menu icon="ellipsis.circle">{/* ... */}</Stack.Toolbar.Menu>
```

可以在 Apple 的 SF Symbols 应用中浏览可用符号。

:::note
SF Symbols 是仅 iOS 的功能。
:::

### Material Symbols（仅 Android）

Android 推荐的图标来源是 [`@expo/material-symbols`](https://www.npmjs.com/package/@expo/material-symbols) 库。它把 Google 的 [Material Symbols](https://fonts.google.com/icons) 作为单独的资源子路径发布，因此 Metro 只会打包你实际导入的图标。

:::tabs
:::tab npm
```sh
npx expo install @expo/material-symbols
```
:::
:::tab yarn
```sh
yarn expo install @expo/material-symbols
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/material-symbols
```
:::
:::tab bun
```sh
bun expo install @expo/material-symbols
```
:::
:::

从各自的子路径直接导入任意图标，并传给 `icon` 属性：

```tsx
import Star from '@expo/material-symbols/star.xml';
import Share from '@expo/material-symbols/share.xml';
import MoreVert from '@expo/material-symbols/more_vert.xml';

<Stack.Toolbar.Button icon={Star} onPress={() => {}} />
<Stack.Toolbar.Button icon={Share} onPress={() => {}} />
<Stack.Toolbar.Menu icon={MoreVert}>{/* ... */}</Stack.Toolbar.Menu>
```

矢量 drawable 默认使用工具栏的着色颜色。传入 `iconRenderingMode="original"` 以保留源颜色。

:::note
Material Symbols XML drawable 是仅 Android 的功能。在 iOS 上请改用 SF Symbols。
:::

#### 在 Android 和 iOS 上使用同一图标

`Stack.Toolbar.Button` 的 `icon` 属性同时接受 `ImageSourcePropType`（Android）和 SF Symbol 名称（iOS）。要为两个平台使用单个组件，请根据 `process.env.EXPO_OS` 分支，并传入适合该平台的值。Metro 会在构建时把 `process.env.EXPO_OS` 替换为字符串字面量，然后对与当前平台不匹配的分支做 tree-shaking，因此 Material Symbols XML drawable 不会进入 iOS bundle，SF Symbol 名称也不会进入 Android bundle：

```tsx
import Star from '@expo/material-symbols/star.xml';

<Stack.Toolbar.Button
  icon={process.env.EXPO_OS === 'ios' ? 'star.fill' : Star}
  onPress={() => {}}
/>;
```

### 自定义图片

也可以使用自定义图片。传入方式因平台而异：

:::tabs
:::tab Android

把图片传给 `icon` 属性：

```tsx
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button icon={require('./assets/expo.png')} onPress={() => {}} />
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

图片源图标默认使用工具栏的着色颜色（`iconRenderingMode` 默认为 `'template'`）。传入 `iconRenderingMode="original"` 以保留源的原始颜色，这对多色图标很有用：

```tsx
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button
          icon={require('./assets/expo.png')}
          iconRenderingMode="original"
          onPress={() => {}}
        />
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

:::
:::tab iOS

iOS 根据放置位置使用两种不同的 API：标题栏工具栏把图片源直接传给 `icon`，底部工具栏则使用 `useImage` 和 `image` 属性。

:::note
在标题栏放置位置的子菜单（`Stack.Toolbar.Menu`）中使用自定义图片需要 `react-native-screens` 4.24.0 或更高版本。SDK 55 捆绑的是 `~4.23.0`，因此需要手动安装 `react-native-screens@~4.24.0` 才能使用此功能。SDK 56 默认捆绑兼容版本。
:::

```tsx
import { Stack } from 'expo-router';

export default function Page() {
  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon={require('./assets/expo.png')} onPress={() => {}} />
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

在底部工具栏中，使用 `expo-image` 的 `useImage` hook，并把结果传给 `image` 属性：

```tsx
import { Stack } from 'expo-router';
import { useImage } from 'expo-image';

export default function Page() {
  const customIcon = useImage('https://simpleicons.org/icons/expo.svg', {
    maxWidth: 24,
    maxHeight: 24,
  });

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button image={customIcon} onPress={() => {}} />
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

:::note
底部工具栏自定义图片的 `useImage` 和 `image` 属性模式仅适用于 iOS，并且是临时 API，未来版本中可能会更改。
:::

:::
:::

## 构建操作菜单

对于有多个操作的屏幕，使用 [`Stack.Toolbar.Menu`](/versions/latest/sdk/router/stack#stacktoolbarmenu) 把它们分组到下拉菜单中：

:::note
部分 [`Stack.Toolbar.Menu`](/versions/latest/sdk/router/stack#stacktoolbarmenu) 和 [`Stack.Toolbar.MenuAction`](/versions/latest/sdk/router/stack#stacktoolbarmenuaction) 属性仅适用于 iOS。每个属性的平台可用性见 API 参考。
:::

:::tabs
:::tab Android

```tsx src/app/mail/[id].tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function EmailScreen() {
  const [isArchived, setIsArchived] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={require('./assets/menu.png')}>
          <Stack.Toolbar.MenuAction
            icon={require('./assets/reply.png')}
            onPress={() => Alert.alert('Reply')}>
            Reply
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon={require('./assets/forward.png')}
            onPress={() => Alert.alert('Forward')}>
            Forward
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon={isArchived ? require('./assets/unarchive.png') : require('./assets/archive.png')}
            isOn={isArchived}
            onPress={() => setIsArchived(!isArchived)}>
            {isArchived ? 'Unarchive' : 'Archive'}
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon={require('./assets/trash.png')}
            destructive
            onPress={() => Alert.alert('Delete')}>
            Delete
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* 邮件内容 */}
    </>
  );
}
```

:::
:::tab iOS

```tsx src/app/mail/[id].tsx
import { useState } from 'react';
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function EmailScreen() {
  const [isArchived, setIsArchived] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          <Stack.Toolbar.MenuAction
            icon="arrowshape.turn.up.left"
            onPress={() => Alert.alert('Reply')}>
            Reply
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon="arrowshape.turn.up.right"
            onPress={() => Alert.alert('Forward')}>
            Forward
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction
            icon={isArchived ? 'tray.full' : 'archivebox'}
            isOn={isArchived}
            onPress={() => setIsArchived(!isArchived)}>
            {isArchived ? 'Unarchive' : 'Archive'}
          </Stack.Toolbar.MenuAction>

          <Stack.Toolbar.MenuAction icon="trash" destructive onPress={() => Alert.alert('Delete')}>
            Delete
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* 邮件内容 */}
    </>
  );
}
```

:::
:::

### 嵌套子菜单

对于更复杂的菜单，把 `Stack.Toolbar.Menu` 嵌套在另一个菜单中。使用 `inline` 属性可以直接显示子菜单项，而不折叠：

:::tabs
:::tab Android

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function EmailScreen() {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Menu icon={require('./assets/menu.png')}>
          {/* 内联子菜单：选项直接出现在菜单中 */}
          <Stack.Toolbar.Menu inline title="Sort By">
            <Stack.Toolbar.MenuAction isOn={sortBy === 'name'} onPress={() => setSortBy('name')}>
              Name
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'date'} onPress={() => setSortBy('date')}>
              Date
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'size'} onPress={() => setSortBy('size')}>
              Size
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>

          {/* 嵌套子菜单：作为单独菜单打开 */}
          <Stack.Toolbar.Menu title="Preferences">
            <Stack.Toolbar.MenuAction
              isOn={showHiddenFiles}
              onPress={() => setShowHiddenFiles(!showHiddenFiles)}>
              Show Hidden Files
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* 邮件内容 */}
    </>
  );
}
```

:::
:::tab iOS

```tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function EmailScreen() {
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          {/* 内联子菜单：选项直接出现在菜单中 */}
          <Stack.Toolbar.Menu inline title="Sort By">
            <Stack.Toolbar.MenuAction isOn={sortBy === 'name'} onPress={() => setSortBy('name')}>
              Name
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'date'} onPress={() => setSortBy('date')}>
              Date
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction isOn={sortBy === 'size'} onPress={() => setSortBy('size')}>
              Size
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>

          {/* 嵌套子菜单：作为单独菜单打开 */}
          <Stack.Toolbar.Menu title="Preferences">
            <Stack.Toolbar.MenuAction
              isOn={showHiddenFiles}
              onPress={() => setShowHiddenFiles(!showHiddenFiles)}>
              Show Hidden Files
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      {/* 邮件内容 */}
    </>
  );
}
```

:::
:::

## 使用底部工具栏

底部工具栏常用于 iOS 上的主要屏幕操作，例如照片和邮件应用中的工具栏。要添加一个，使用不带 placement 属性的 `Stack.Toolbar`，它默认为 `"bottom"`：

:::tabs
:::tab Android

```tsx src/app/photos/index.tsx
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function PhotosScreen() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button
          icon={require('./assets/select.png')}
          onPress={() => Alert.alert('Select')}
        />
        <Stack.Toolbar.Spacer width={24} />
        <Stack.Toolbar.Button
          icon={require('./assets/plus.png')}
          onPress={() => Alert.alert('Add')}
        />
      </Stack.Toolbar>
    </>
  );
}
```

:::
:::tab iOS

```tsx src/app/photos/index.tsx
import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function PhotosScreen() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button icon="photo.on.rectangle" onPress={() => Alert.alert('Select')}>
          Select
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon="plus" onPress={() => Alert.alert('Add')}>
          Add
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
}
```

:::
:::

:::note
底部工具栏只能在页面组件中使用，不能在布局文件中使用。
:::

## 间隔

使用 [`Stack.Toolbar.Spacer`](/versions/latest/sdk/router/stack#stacktoolbarspacer) 在工具栏项之间添加间距。行为因平台而异：

- **Android**：`Stack.Toolbar.Spacer` 始终需要显式的 `width`。目前没有弹性填充间隔。
- **iOS**：没有 `width` 的 `Stack.Toolbar.Spacer` 会在项之间创建弹性空间，把它们推到两侧。这对于工具栏两端都有按钮的布局很有用。传入 `width` 可获得固定大小的间距。

## 为按钮添加徽章

在标题栏工具栏中，可以添加徽章来表示数量或状态。使用 [`Stack.Toolbar.Icon`](/versions/latest/sdk/router/stack#stacktoolbaricon)、[`Stack.Toolbar.Label`](/versions/latest/sdk/router/stack#stacktoolbarlabel) 和 [`Stack.Toolbar.Badge`](/versions/latest/sdk/router/stack#stacktoolbarbadge) 来组合按钮内容：

```tsx src/app/inbox.tsx
import { Stack } from 'expo-router';
import bellIcon from '@/assets/bell.png';

export default function InboxScreen() {
  const unreadCount = 5;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={process.env.EXPO_OS === 'ios' ? 'bell' : bellIcon}
          onPress={() => {}}>
          <Stack.Toolbar.Label>Notifications</Stack.Toolbar.Label>
          {unreadCount > 0 && <Stack.Toolbar.Badge>{String(unreadCount)}</Stack.Toolbar.Badge>}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

:::note
徽章只在标题栏放置位置（`left` 或 `right`）中有效，在底部工具栏中无效。
:::

## 嵌入自定义视图

当需要按钮和菜单之外的内容时，使用 [`Stack.Toolbar.View`](/versions/latest/sdk/router/stack#stacktoolbarview) 嵌入任意 React Native 组件：

```tsx src/app/search.tsx
import { Stack } from 'expo-router';
import { Pressable, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';

export default function SearchScreen() {
  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.View>
          <Pressable
            style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              Alert.alert('Filter pressed');
            }}>
            <SymbolView
              name={{
                ios: 'line.3.horizontal.decrease.circle',
                android: 'filter_list',
              }}
              size={24}
            />
          </Pressable>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      {/* 屏幕内容 */}
    </>
  );
}
```

## 动态显示和隐藏项

使用 `hidden` 属性根据状态切换工具栏项：

:::tabs
:::tab Android

```tsx src/app/document.tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function DocumentScreen() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={isEditing}
          icon={require('./assets/pencil.png')}
          onPress={() => setIsEditing(true)}
        />
        <Stack.Toolbar.Button
          hidden={!isEditing}
          icon={require('./assets/check.png')}
          onPress={() => setIsEditing(false)}
        />
      </Stack.Toolbar>
      {/* 文档内容 */}
    </>
  );
}
```

:::
:::tab iOS

```tsx src/app/document.tsx
import { useState } from 'react';
import { Stack } from 'expo-router';

export default function DocumentScreen() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button hidden={isEditing} icon="pencil" onPress={() => setIsEditing(true)} />
        <Stack.Toolbar.Button hidden={!isEditing} onPress={() => setIsEditing(false)}>
          Done
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      {/* 文档内容 */}
    </>
  );
}
```

:::
:::

## 常见问题

<details>
<summary>iOS 26 深色模式下 Liquid Glass 工具栏按钮闪烁</summary>

在 iOS 26 的深色模式下，带有 Liquid Glass 样式的工具栏按钮在屏幕之间导航时可能会闪烁或闪现背景。这是因为默认主题与系统深色模式不匹配，导致 Liquid Glass 渲染出现视觉伪影。

要修复，用 `expo-router` 的 `<ThemeProvider>` 包裹根布局，并使用合适的主题：

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 用 ThemeProvider 包裹布局，以修复 Liquid Glass 闪烁
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

</details>

<details>
<summary>在屏幕之间导航时闪现白色背景</summary>

屏幕过渡之间出现白色闪烁，通常意味着导航栈使用浅色背景，而应用使用深色主题。当屏幕包含工具栏项时尤其明显，因为闪烁会与工具栏样式形成对比。

要修复，用 Expo Router 的 `<ThemeProvider>` 包裹根布局，并传入合适的主题：

```tsx src/app/_layout.tsx
import { ThemeProvider, DarkTheme, DefaultTheme, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 用 ThemeProvider 包裹布局，为所有屏幕设置背景
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}
```

</details>

<details>
<summary>滚动时大标题不折叠</summary>

当 `headerLargeTitle: true`（或 `<Stack.Title large>`）与 `Stack.Toolbar` 一起使用时，大标题在滚动时可能不会折叠。当可滚动视图不是屏幕组件的直接第一个子项时，就会发生这种情况。

要修复，请确保 `ScrollView` 或 `FlatList` 是屏幕组件渲染的第一个子项。如果需要包装器，请在其上设置 `collapsable={false}`：

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

// 正确：ScrollView 是直接的第一个子项
export default function Home() {
  return (
    <ScrollView>
      <Stack.Title large>Home</Stack.Title>
      <Text>Content here</Text>
    </ScrollView>
  );
}
```

如果需要包裹 `ScrollView`，请在包装器上设置 `collapsable={false}`：

```tsx src/app/index.tsx
import { Stack } from 'expo-router';
import { ScrollView, View, Text } from 'react-native';

export default function Home() {
  return (
    // 在 ScrollView 周围的任何包装器上设置 collapsable={false}
    <View collapsable={false}>
      <ScrollView>
        <Stack.Title large>Home</Stack.Title>
        <Text>Content here</Text>
      </ScrollView>
    </View>
  );
}
```

</details>

## 已知限制

<details>
<summary>仅原生</summary>

`Stack.Toolbar` 只在 Android 和 iOS 上渲染。Web 没有标准工具栏，因此如果需要那里的工具栏行为，必须自行实现。

</details>

<details>
<summary>Android 图标必须是图片源</summary>

在 Android 上，`icon` 必须是 `ImageSourcePropType`。例如 `require('./icon.png')` 或 `{ uri: '...' }`。

也可以使用带 `src` 属性的 [`Stack.Toolbar.Icon`](/versions/latest/sdk/router/stack#stacktoolbaricon) 来提供跨平台图标。

</details>

<details>
<summary>Android 上的 Spacer 需要显式宽度</summary>

弹性间隔（没有 `width` 的 `<Stack.Toolbar.Spacer />`）仅适用于 iOS。在 Android 上，没有 `width` 的 `Stack.Toolbar.Spacer` 不会渲染任何内容。请在每个放置位置传入固定 `width`，例如 `<Stack.Toolbar.Spacer width={24} />`。

</details>

<details>
<summary>底部工具栏只能在页面组件中使用</summary>

底部工具栏只能在页面组件中使用，不能在布局文件中使用。这是因为底部工具栏需要与特定屏幕的内容关联。

</details>

<details>
<summary>不能嵌套工具栏</summary>

不能把 `Stack.Toolbar` 组件彼此嵌套。

</details>

<details>
<summary>徽章只能在标题栏放置位置使用</summary>

`Stack.Toolbar.Badge` 仅在使用 `placement="left"` 或 `placement="right"` 时受支持。徽章不会显示在底部工具栏中。

</details>

<details>
<summary>Android 不支持 Label 原语</summary>

在 Android 上，`Stack.Toolbar.Button` 只渲染其图标和徽章，`Stack.Toolbar.Label` 子项会被丢弃。如果需要在 Android 上使用类似标签的 UI，请使用 [`Stack.Toolbar.View`](/versions/latest/sdk/router/stack#stacktoolbarview) 嵌入自定义组件。

</details>

<details>
<summary>Android 不支持 SearchBarSlot</summary>

`Stack.Toolbar.SearchBarSlot` 在 Android 上不会渲染任何内容。跨平台搜索栏支持请使用 [`Stack.SearchBar`](/versions/latest/sdk/router/stack#stacksearchbar)。

</details>

## 了解更多

完整的 API 文档（包括所有可用属性）见 [`Stack.Toolbar` API 参考](/versions/latest/sdk/router/stack#stacktoolbar)。
