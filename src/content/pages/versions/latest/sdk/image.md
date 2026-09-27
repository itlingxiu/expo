---
title: Image 包参考
description: 跨平台、高性能的 React 组件，用于加载和渲染图片。
---

# Image 包参考

`expo-image` 是一个跨平台的 React 组件，用于加载和渲染图片。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

**主要特性：**

- 为速度而设计
- 支持多种图片格式（包括动画格式）
- 磁盘与内存缓存
- 支持 [BlurHash](https://blurha.sh) 和 [ThumbHash](https://evanw.github.io/thumbhash/)——图片占位符的紧凑表示
- 源发生变化时在图片之间过渡（不再闪烁！）
- 实现了 CSS 的 [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) 和 [`object-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) 属性（见 [`contentFit`](#contentfit) 和 [`contentPosition`](#contentposition) 属性）
- 底层使用高性能的 [`SDWebImage`](https://github.com/SDWebImage/SDWebImage) 和 [`Glide`](https://github.com/bumptech/glide)

**支持的图片格式**

| 格式 | Android | iOS | Web |
| --- | --- | --- | --- |
| WebP | 支持 | 支持 | 支持 |
| PNG / APNG | 支持 | 支持 | 支持 |
| AVIF | 支持 | 支持 | 支持 |
| HEIC | 支持 | 支持 | 不支持 [尚未普及](https://caniuse.com/heif) |
| JPEG | 支持 | 支持 | 支持 |
| GIF | 支持 | 支持 | 支持 |
| SVG | 支持 | 支持 † | 支持 |
| ICO | 支持 | 支持 | 支持 |
| ICNS | 不支持 | 支持 | 不支持 |
| PSD（合成预览） | 不支持 | 支持 | 不支持 |

> † 在 iOS 上，系统 SVG 解码器并不能处理每一条有效路径。带有多组参数、并且把 `large-arc-flag` 与 `sweep-flag` 挤在一起的椭圆弧命令（`A` 或 `a`）可能渲染变形，或完全不渲染。大多数 SVG 压缩工具会输出这种紧凑形式，例如 `a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303`。要修复该文件，用空格把两个标志分开（`a6 6 0 0 1 11.573 -2.226 3.75 3.75 0 0 1 4.133 4.303`），或让每段弧使用自己的命令。若需要更广泛的 SVG 覆盖，请使用 [`react-native-svg`](/versions/latest/sdk/svg)，它可以正确渲染这些路径。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-image
```
:::
:::tab yarn
```sh
yarn expo install expo-image
```
:::
:::tab pnpm
```sh
pnpm expo install expo-image
```
:::
:::tab bun
```sh
bun expo install expo-image
```
:::
:::

## 在应用配置中配置

你可以使用其[配置插件](/config-plugins/introduction)配置 `expo-image` 的构建时设置。把该插件加入 **app.json** 或 **app.config.js** 的 `plugins` 数组，并重新构建原生项目。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-image",
        {
          "disableLibdav1d": true
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `disableLibdav1d` | iOS | `false` | 为 `true` 时，跳过添加捆绑的 `libavif/libdav1d` Pod。当另一个依赖（例如 `FFmpegKit`）已经链接了 `libdav1d` 时使用。禁用该 Pod 会移除 iOS 上的 AVIF 图片支持，除非另有解码器可用。 |

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **ios** 项目，则在运行 `pod install` 之前设置 shell 环境变量 `EXPO_IMAGE_DISABLE_LIBDAV1D=1`，即可达到同样效果。也可以在 `Podfile` 顶部添加 `ENV['EXPO_IMAGE_DISABLE_LIBDAV1D'] ||= '0'`。

## 用法

```jsx
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source="https://picsum.photos/seed/696/3000/2000"
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
});
```

### 使用来自原生资源的图片

打包在 Xcode 资源目录或 Android drawable 资源中的图片，可以按名称用 `source={{ uri: 'app_icon' }}` 加载。省略文件扩展名，并手动提供图片尺寸：

```tsx
import { Image } from 'expo-image';

export default function AppIcon() {
  return <Image source={{ uri: 'app_icon' }} style={{ width: 40, height: 40 }} />;
}
```

## API

```js
import { Image } from 'expo-image';
```

## 在服务器上生成 blurhash

图片可以显著改善视觉体验，但由于文件较大，也可能拖慢应用或页面的加载时间。为解决这个问题，你可以用 blurhash 算法创建占位图片，在稍后才加载实际图片的同时提供沉浸式体验。

本指南演示如何使用 JavaScript 和 Express.js 在后端为上传的图片创建 blurhash。同样的技术与原则也适用于其他语言和服务器技术。

先安装几个依赖：用于处理 multipart 请求的 [`multer`](https://github.com/expressjs/multer)、用于把文件转换为数据缓冲区的 [`sharp`](https://github.com/lovell/sharp)，以及官方的 [`blurhash` JavaScript 包](https://github.com/woltapp/blurhash/tree/master/TypeScript)。

:::tabs
:::tab npm
```sh
npm install multer sharp blurhash
```
:::
:::tab yarn
```sh
yarn add multer sharp blurhash
```
:::
:::tab pnpm
```sh
pnpm add multer sharp blurhash
```
:::
:::tab bun
```sh
bun add multer sharp blurhash
```
:::
:::

接下来，从已安装的包中导入所有需要的函数，并初始化 `multer`：

```js
// Multer 是处理 `multipart/form-data` 的中间件。
const multer = require('multer');
// Sharp 让你可以从上传的图片得到数据缓冲区。
const sharp = require('sharp');
// 从 blurhash 包导入 encode 函数。
const { encode } = require('blurhash');

// 初始化 `multer`。
const upload = multer();
```

假设 `app` 是持有 Express 服务器引用的变量，可以创建一个接受图片并返回包含所生成 blurhash 的 JSON 响应的端点。

```js
app.post('/blurhash', upload.single('image'), async (req, res) => {
  const { file } = req;
  // 如果文件不可用，则返回错误。
  if (file === null) {
    res.status(400).json({ message: 'Image is missing' });
    return;
  }

  // 用户可以指定每个轴上的分量数量。
  const componentX = req.body.componentX ?? 4;
  const componentY = req.body.componentY ?? 3;

  // 把提供的图片转换为字节缓冲区。
  // Sharp 目前支持多种常见格式，例如 JPEG、PNG、WebP、GIF 和 AVIF。
  const { data, info } = await sharp(file.buffer).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    componentX,
    componentY
  );
  res.json({ blurhash });
});
```

此外，请求可以包含两个参数：`componentX` 和 `componentY`，它们会传给算法。这些值可以在服务器上计算或硬编码，也可以由用户指定。不过，它们必须在 1 到 9 的范围内，并且宽高比应与上传的图片相近。值为 9 时效果最好，但生成哈希可能需要更长时间。

生成 blurhash 的过程可以用各种语言和服务器技术完成，与使用 JavaScript 的方式类似。关键步骤是为你选择的语言找到编码器，通常可以在 [`woltapp/blurhash`](https://github.com/woltapp/blurhash#implementations) 仓库中找到。有了编码器之后，你需要获取图片的一种表示。有些库使用默认的图片类（例如 Swift 实现使用 `UIImage`）。在其他情况下，你必须提供原始字节数据。请查看编码器的文档，确认期望的数据格式。

> 处理原始字节数据时，请确保存在 alpha 层（每个像素由红、绿、蓝和 alpha 值表示）。否则会导致诸如 “width and height must match the pixels array” 之类的错误。
