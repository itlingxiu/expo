---
title: Router Split View 包参考
description: 提供原生分栏视图布局的 Expo Router 子模块。
---

# Router Split View 包参考

> 支持平台：iOS。

:::warning
SplitView 是仅在 **iOS** 上、**Expo SDK 55** 及更高版本中可用的 [alpha](/more/release-statuses#alpha) API。该 API 可能发生破坏性变更，尚不适合生产使用。
:::

`expo-router/unstable-split-view` 是 `expo-router` 的子模块，导出用于使用[平台原生系统分栏视图](https://developer.apple.com/design/human-interface-guidelines/split-views)构建分栏布局的组件。

> 更多关于面向原生和 Web 应用的基于文件的路由库的信息，见 [Expo Router](/versions/latest/sdk/router) 参考。

## 平台支持

分栏视图仅在 iOS 上可用。在其他平台上，`SplitView` 组件会自动回退为标准 `Slot` 导航器渲染，确保应用无需条件代码即可在所有平台上工作。

## iPhone 支持

在 iPhone 上，`SplitView` 会自动把所有列折叠成单个视图。同一时间只显示一列。

### 选择初始列

用 `topColumnForCollapsing` 属性控制分栏视图折叠时显示哪一列：

```tsx
<SplitView topColumnForCollapsing="primary"></SplitView>
```

接受的值为 `primary`、`supplementary` 和 `secondary`。未设置时，系统使用其默认行为。

### 在列之间导航

:::note
`.show()` 方法需要 `react-native-screens` 4.24.0 或更高版本。SDK 55 捆绑的是 `~4.23.0`，因此需要手动安装 `react-native-screens@~4.24.0` 才能使用此功能。
:::

用 `ref` 通过 `show` 方法以编程方式显示特定列：

```tsx
import { useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { SplitView } from 'expo-router/unstable-split-view';
import type { SplitHostCommands } from 'react-native-screens/experimental';

export default function Layout() {
  const ref = useRef<SplitHostCommands>(null);

  return (
    <SplitView ref={ref} topColumnForCollapsing="primary">
      <SplitView.Column>
        <Pressable onPress={() => ref.current?.show('secondary')}>
          <Text>Show main content</Text>
        </Pressable>
      </SplitView.Column>
    </SplitView>
  );
}
```

## 已知限制

<details><summary>不能嵌套</summary>

导航层级中只能有一个 `SplitView`。尝试嵌套分栏视图会导致错误。

</details>

<details><summary>不能用在其他导航器内部</summary>

`SplitView` 不能用在另一个导航器内部（`Slot` 除外）。它必须用在根布局层级。

</details>

<details><summary>只允许特定子组件</summary>

`SplitView` 只接受 `SplitView.Column` 和 `SplitView.Inspector` 作为直接子组件。其他组件会被忽略并给出警告。

</details>

<details><summary>尚不能自定义标题栏</summary>

分栏视图各列中的标题栏（导航栏）尚不能自定义。目前不支持自定义标题栏配置。

</details>

<details><summary>API 有限</summary>

当前 API 面很小，可能无法覆盖所有用例。未来版本会增加更多属性和配置选项。

</details>

<details><summary>在 iPhone 上返回上一列</summary>

要返回上一列，请点按导航栏中的系统返回按钮。未来版本会增加对返回导航更细粒度的编程控制。

</details>

:::note
我们正在积极开发 `SplitView` 并收集反馈。你可以在 [Discord](https://chat.expo.dev) 上分享想法，[在 GitHub 上提交 issue](https://github.com/expo/expo/issues)，或使用本页底部的 **Feedback** 按钮。
:::

## 安装

要在项目中使用 `expo-router/unstable-split-view`，需要在项目中安装 `expo-router`。请遵循 Expo Router 安装指南中的说明：

- [安装 Expo Router](/router/installation)：了解如何在项目中安装 Expo Router。

## 使用 `SplitView.Column`

`SplitView.Column` 在分栏视图布局中定义额外的列。你可以在主内容区域之前添加最多两列。

### 两列布局

带主内容的简单侧边栏：

![使用两列分栏视图的 iPad 应用截图。](/static/images/expo-router/split-view-two-column-layout.webp)

```tsx
import { Link } from 'expo-router';
import { SplitView } from 'expo-router/unstable-split-view';
import { Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function Layout() {
  return (
    <SplitView>
      <SplitView.Column>
        <SafeAreaView edges={{ left: true, top: true }} style={{ flex: 1 }}>
          <Link href="/inbox">
            <Pressable style={{ padding: 16 }}>
              <Text>Inbox</Text>
            </Pressable>
          </Link>
          <Link href="/sent">
            <Pressable style={{ padding: 16 }}>
              <Text>Sent</Text>
            </Pressable>
          </Link>
        </SafeAreaView>
      </SplitView.Column>
    </SplitView>
  );
}
```

### 三列布局

带辅助列和主内容的侧边栏：

![使用三列分栏视图的 iPad 应用截图。](/static/images/expo-router/split-view-three-column-layout.webp)

```tsx
import { Link, useGlobalSearchParams } from 'expo-router';
import { SplitView } from 'expo-router/unstable-split-view';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function Layout() {
  const params = useGlobalSearchParams();

  return (
    <SplitView>
      <SplitView.Column>
        <SafeAreaView
          edges={{ left: true, top: true }}
          style={{
            flex: 1,
            gap: 16,
            padding: 16,
          }}>
          <Link href="/?col1=1" style={{ fontWeight: params.col1 === '1' ? 'bold' : 'normal' }}>
            Option 1
          </Link>
          <Link href="/?col1=2" style={{ fontWeight: params.col1 === '2' ? 'bold' : 'normal' }}>
            Option 2
          </Link>
          <Link href="/?col1=3" style={{ fontWeight: params.col1 === '3' ? 'bold' : 'normal' }}>
            Option 3
          </Link>
        </SafeAreaView>
      </SplitView.Column>
      <SplitView.Column>
        <SafeAreaView
          edges={{ left: true, top: true }}
          style={{
            flex: 1,
            gap: 16,
            padding: 16,
          }}>
          <Link href={`/?col1=${params.col1}&col2=1`}>Sub-Option 1</Link>
          <Link href={`/?col1=${params.col1}&col2=2`}>Sub-Option 2</Link>
          <Link href={`/?col1=${params.col1}&col2=3`}>Sub-Option 3</Link>
        </SafeAreaView>
      </SplitView.Column>
    </SplitView>
  );
}
```

## 使用 `SplitView.Inspector`

`SplitView.Inspector` 添加一列从尾部边缘滑入的补充列，适合显示额外细节或元数据：

![使用检查器的分栏视图 iPad 应用截图。](/static/images/expo-router/split-view-inspector.png)

```tsx
<SplitView>
  <SplitView.Column></SplitView.Column>
  <SplitView.Inspector>
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Inspector Panel</Text>
    </View>
  </SplitView.Inspector>
</SplitView>
```

## 完整示例

下面是一个密码管理器风格的三列应用：

```text
app/_layout.tsx
app/index.tsx
app/[type]/[id].tsx
app/[type]/index.tsx
```

```tsx app/_layout.tsx
import { Link, Color, useGlobalSearchParams } from 'expo-router';
import { SplitView } from 'expo-router/unstable-split-view';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

export default function Layout() {
  return (
    <SplitView showInspector>
      <SplitView.Column>
        <PasscodeList />
      </SplitView.Column>
      <SplitView.Column>
        <PasswordElementList />
      </SplitView.Column>
      <SplitView.Inspector>
        <InspectorContent />
      </SplitView.Inspector>
    </SplitView>
  );
}

function PasscodeList() {
  return (
    <SafeAreaView edges={{ top: true, left: true }} style={style.passcodeList}>
      <PasscodeCard title="All" param="all" />
      <PasscodeCard title="Passkeys" param="passkeys" />
      <PasscodeCard title="Codes" param="codes" />
      <PasscodeCard title="Security" param="security" />
      <PasscodeCard title="Deleted" param="deleted" />
    </SafeAreaView>
  );
}

const passkeys = ['Github', 'Google', 'Facebook', 'Twitter', 'Apple', 'Microsoft', 'Amazon'];
const security = ['Admin1234', 'Root'];

const all = [...passkeys, ...security];

function PasswordElementList() {
  const params = useGlobalSearchParams();
  const data = (() => {
    switch (params.type) {
      case 'all':
      case undefined:
        return all;
      case 'passkeys':
        return passkeys;
      case 'security':
        return security;
      default:
        return [];
    }
  })();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ backgroundColor: undefined }}>
      {data.map(item => (
        <PasswordElement key={item} title={item} />
      ))}
    </ScrollView>
  );
}

function PasscodeCard({ param, title }: { param: string; title: string }) {
  const params = useGlobalSearchParams();
  const isActive = params.type === param;
  return (
    <Link
      href={`/${param}/`}
      disabled={isActive}
      style={[
        style.passcodeCard,
        {
          backgroundColor: isActive ? Color.ios.systemBlue : Color.ios.systemGray6,
        },
      ]}
      asChild>
      <Pressable>
        <Text style={{ color: isActive ? 'white' : 'black', fontSize: 16 }}>{title}</Text>
      </Pressable>
    </Link>
  );
}

function PasswordElement({ title }: { title: string }) {
  const params = useGlobalSearchParams();
  const isActive = params.id === title;
  return (
    <Link href={`/${params.type}/${title}/`} asChild>
      <Pressable
        style={{
          backgroundColor: isActive ? Color.ios.systemBlue : undefined,
          padding: 12,
        }}>
        <SafeAreaView edges={{ left: true }}>
          <Text style={{ color: isActive ? 'white' : 'black', fontSize: 16 }}>{title}</Text>
        </SafeAreaView>
      </Pressable>
    </Link>
  );
}

function InspectorContent() {
  return (
    <View style={style.inspectorContent}>
      <Text>Inspector</Text>
    </View>
  );
}

const style = StyleSheet.create({
  passcodeList: {
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
    flexDirection: 'row',
    padding: 8,
  },
  passcodeCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  inspectorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

```tsx app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/all/" />;
}
```

```tsx app/[type]/index.tsx
import { Color } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: Color.ios.label, fontSize: 24, fontWeight: 'bold' }}>
        Nothing is selected
      </Text>
    </View>
  );
}
```

```tsx app/[type]/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function Id() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ID: {id}</Text>
    </View>
  );
}
```

## API

```js
import { SplitView } from 'expo-router/unstable-split-view';
```
