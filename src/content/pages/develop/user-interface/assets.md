---
title: 资源
description: 了解如何在项目中使用静态资源，包括图片、视频、声音、数据库文件与字体。
---

# 资源

静态资源（static asset）是随应用原生二进制一起打包的文件 —— 与承载应用代码的 JavaScript bundle 不同。典型示例：图片、视频、声音、SQLite 数据库文件与字体。这些资源可以是项目本地的，也可以通过网络获取。本指南介绍如何加载与使用它们，以及优化与压缩。

## 本地提供资源

项目文件系统中的资源可以在构建时嵌入，也可以在运行时加载，通过 `require` 或 `import` 作为 JS 模块导入。

示例 —— 在 App.js 中用 `require` 渲染 `assets/images` 中的 `example.png`：

```tsx src/app/index.tsx
<Image source={require('./assets/images/example.png')} />
```

bundler 会读取导入图片的元数据并自动提供宽高；参见 React Native 的 [Static Image Resources](https://reactnative.dev/docs/images#static-image-resources)。`expo-image` 与 `expo-file-system` 等库对本地资源的处理方式类似。

### 本地资源是如何提供的

开发环境中，本地资源通过 HTTP 提供。生产应用中，它们在构建时打包进二进制，在设备上从磁盘提供。

### 使用 expo-asset 配置插件在构建时加载

用 `expo-asset` 配置插件把资源文件嵌入原生项目。

```sh
# npm
npx expo install expo-asset

# yarn
yarn expo install expo-asset

# pnpm
pnpm expo install expo-asset

# bun
bun expo install expo-asset
```

把插件添加到应用配置；配置通过 `assets` 属性提供资源路径，它是链接进原生项目的一个或多个文件/目录组成的数组。路径必须相对于项目根目录（应用配置所在位置）。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-asset",
        {
          "assets": ["./assets/images/example.png"]
        }
      ]
    ]
  }
}
```

嵌入后，创建新的开发构建。之后可以不用 `require`/`import` 导入资源 —— 直接以资源名作为 URI。不用 `require` 渲染时，必须显式给出宽高。

```tsx src/app/index.tsx
import { Image } from 'expo-image';
...

export default function HomeScreen() {
  return <Image source={{ uri: 'example' }} style={{ width: 100, height: 100 }} />;
}
```

:::note
`expo-asset` 配置插件支持多种文件格式。格式详情见 Assets API 参考的可配置属性。如果插件不支持某种格式，请用 `useAssets` Hook 在运行时加载。
:::

### 使用 useAssets Hook 在运行时加载

`useAssets`（来自 `expo-asset`）异步加载资源：下载资源并存到本地，然后返回该资源的实例列表。

```sh
# npm
npx expo install expo-asset

# yarn
yarn expo install expo-asset

# pnpm
pnpm expo install expo-asset

# bun
bun expo install expo-asset
```

在页面组件中导入 Hook：

```tsx src/app/index.tsx
import { useAssets } from 'expo-asset';

export default function HomeScreen() {
  const [assets, error] = useAssets([
    require('path/to/example-1.jpg'),
    require('path/to/example-2.png'),
  ]);

  return assets ? <Image source={assets[0]} /> : null;
}
```

## 远程提供资源

远程提供的资源不打包进二进制；可以直接使用托管的 URL，例如传给 `<Image>`：

```jsx App.js
import { Image } from 'expo-image';
...

function App() {
  return (
    <Image source={{ uri: 'https://example.com/logo.png' }} style={{ width: 50, height: 50 }} />
  );
}
```

这些图片不保证一直可用 —— 可能没有网络连接，或资源被移除。远程加载还需要提供元数据：bundler 无法确定宽高，必须显式传入，否则图片默认为 0px × 0px。

## 更多信息

### 手动优化方法

#### 图片

压缩工具：[guetzli](https://github.com/google/guetzli)、[pngcrush](https://pmt.sourceforge.io/pngcrush/)、[optipng](https://optipng.sourceforge.net/)。

有些优化器是无损的：重新编码得更小，但显示像素不变 —— 在像素保真度重要时配合 PNG 等无损格式使用是很好的选择。另一些是有损的，产出看起来不同的图片；它们通常更高效，丢弃视觉信息来缩小体积，对人眼来说几乎一样。imagemagick 可以用 [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) 等算法比较图片。常见情况是：一张与原图 95% 以上相似的优化图，文件体积远小于原来的 95%。

#### 其他资源

对于 GIF、视频以及非代码/非图片资源，优化与压缩由你自己处理。

:::note
GIF 是一种非常低效的格式 —— 现代视频编解码器能以更小的文件提供更好的画质。
:::

#### 字体

参见[字体](/develop/user-interface/fonts)页的"添加自定义字体"。
