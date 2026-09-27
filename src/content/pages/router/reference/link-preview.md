---
title: 链接预览
description: 了解如何在使用 Expo Router 时为 iOS 上的链接添加预览。
---

# 链接预览

:::warning
链接预览是仅 iOS 的功能，自 SDK 54 起可用。
:::

> 演示视频：Expo Router 中的链接预览功能。

链接预览（也称为 “Peek and Pop”）是 iOS 上常用的功能，用于向用户显示链接所指向屏幕的预览弹层。本指南说明如何在 iOS 上为应用添加并自定义链接预览。

如果应用中有一个链接，可以把链接内容替换为 [`Link.Trigger`](/versions/latest/sdk/router/link#linktrigger)，并添加 [`Link.Preview`](/versions/latest/sdk/router/link#linkpreview) 组件，从而为它添加链接预览。这会创建该链接所指向页面的预览。

```tsx
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
```

## 自定义链接预览

默认情况下，链接预览渲染为全尺寸的页面快照。有多种方式可以自定义此行为。

### 自定义尺寸

可以用 `width` 和 `height` 建议首选的预览尺寸。系统会考虑这些偏好，但可能根据可用空间或平台行为覆盖它们。

```tsx
<Link href="...">
  <Link.Trigger>Content</Link.Trigger>
  <Link.Preview style={{ width: 300, height: 200 }} />
</Link>
```

下面的示例展示了 iOS 上的自定义链接预览尺寸：

![自定义链接预览尺寸的截图](/static/images/expo-router/link-preview-custom-size.webp)

### 自定义预览

如果不想显示默认预览，可以通过 children 向 `Link.Preview` 组件传入自定义内容。该自定义内容会替换链接目标的默认预览。

```tsx
export default function Page() {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const { width } = useWindowDimensions();
  const previewHeight = (width / imageSize.width) * imageSize.height;

  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview style={{ width, height: previewHeight }}>
        <Image
          onLoad={e => setImageSize(e.nativeEvent.source)}
          source={source}
          style={{ width: '100%', height: '100%' }}
        />
      </Link.Preview>
    </Link>
  );
}
```

下面的示例展示了 iOS 上的自定义链接预览：

![自定义链接预览的截图](/static/images/expo-router/link-preview-custom-content.webp)

## 菜单

要在预览旁边渲染上下文菜单，添加带有 [`Link.MenuAction`](/versions/latest/sdk/router/link#linkmenuaction) 子项的 [`Link.Menu`](/versions/latest/sdk/router/link#linkmenu)。

```tsx
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={handleSharePress} />
    <Link.MenuAction title="Block" icon="nosign" destructive onPress={handleBlockPress} />
  </Link.Menu>
</Link>
```

下面的示例展示了 iOS 上的自定义链接预览：

![iOS 上下文菜单的截图](/static/images/expo-router/link-preview-menu.webp)

### 图标

可以使用 [SF Symbols](https://developer.apple.com/sf-symbols/) 为每个菜单操作指定图标。

```tsx
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={handleSharePress} />
    <Link.MenuAction title="Block" icon="nosign" onPress={handleBlockPress} />
    <Link.MenuAction
      title="Follow"
      icon="person.crop.circle.badge.plus"
      onPress={handleFollowPress}
    />
    <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={handleCopyPress} />
  </Link.Menu>
</Link>
```

下面的示例展示了 iOS 上带有四个元素、每个使用不同图标的上下文菜单：

![带有四个元素的上下文菜单截图](/static/images/expo-router/link-preview-icons.webp)

### 嵌套菜单

可以把一个 [`Link.Menu`](/versions/latest/sdk/router/link#linkmenu) 放在另一个菜单内，从而嵌套菜单：

```jsx
<Link href="...">
  <Link.Trigger>About</Link.Trigger>
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => {}} />
    <Link.Menu title="More" icon="ellipsis">
      <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />
      <Link.MenuAction title="Delete" icon="trash" destructive onPress={() => {}} />
    </Link.Menu>
  </Link.Menu>
</Link>
```

下面的示例展示了 iOS 上的嵌套上下文菜单：

![嵌套上下文菜单的截图](/static/images/expo-router/link-preview-nested-menu.webp)

### 更多自定义选项

要探索所有可用的自定义选项，请参阅 [`Link.MenuAction`](/versions/latest/sdk/router/link#linkmenuaction) 的 API 文档。

## 检测组件是否位于预览中

如果正在构建一个可能在预览内渲染的组件，可以使用 [`useIsPreview()`](/versions/latest/sdk/router/link#useispreview) hook 相应调整其行为：

```jsx
function MyComponent() {
  // 如果组件/屏幕正在预览内渲染，此值为 true
  const isInsidePreview = useIsPreview();

  return isInsidePreview ? <Text>From within preview</Text> : <Text>I am outside of preview</Text>;
}
```

## 已知限制

### 不支持 `replace`

目前**不支持**将链接预览与 [`replace`](/versions/latest/sdk/router/link#replace) 模式一起使用。预览只能与默认的 [`push`](/versions/latest/sdk/router/link#push) 导航模式一起使用。

### JavaScript 标签页与 Slot

在 JavaScript 标签页（而不是原生标签页）或 [`Slot`](/versions/latest/sdk/router#slot) 内导航时，预览过渡动画可能显得不流畅。这是因为 React 的渲染有延迟，而原生预览动画会立即开始。要避免此问题，请使用原生标签页和栈导航器。

### 缺少 `Link.Trigger`

如果渲染了带有预览或上下文菜单、但没有 `Link.Trigger` 的 `Link`，会抛出异常。在预览模式下，如果把任何非 `Link.*` 组件直接放在 `Link` 内部，同样会抛出异常。

### 带 `asChild` 属性的多个 `Link.Trigger` 子项

使用带 `asChild` 的 `Link` 时，`Link.Trigger` 只能指定**一个**子项。`onPress` 事件只会转发给该子项。

### 预览打开时更改 href

预览打开时动态更改 `href` 属性的路径**不受支持**。只能动态修改查询参数。
