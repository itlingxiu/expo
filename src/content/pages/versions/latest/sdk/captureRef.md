---
title: react-native-view-shot 包参考
description: 用于捕获 React Native 视图并将其保存为图片的库。
---

# react-native-view-shot 包参考

给定一个视图，`captureRef` 实质上会对该视图截图，并返回一张图片。这在签名板等场景中非常有用：用户绘制内容后，你希望从中保存一张图片。

> 支持平台：Android、iOS、Expo Go。

如果想从 GLView 获取快照，建议改用 [GLView 的 takeSnapshotAsync](/versions/latest/sdk/gl-view#takesnapshotasyncoptions)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install react-native-view-shot
```
:::
:::tab yarn
```sh
yarn expo install react-native-view-shot
```
:::
:::tab pnpm
```sh
pnpm expo install react-native-view-shot
```
:::
:::tab bun
```sh
bun expo install react-native-view-shot
```
:::
:::

也可参考[官方安装说明](https://github.com/gre/react-native-view-shot)。

## 关于像素值的说明

请记得把设备的 `PixelRatio` 考虑在内。在界面中使用像素值时，这些单位大多数时候是“逻辑像素”或“设备无关像素”。对于 PNG 等图片，你通常处理的是“物理像素”。可以通过 React Native API `PixelRatio.get()` 获取设备的 `PixelRatio`。

例如，要保存一张 `1080x1080` 的 Full HD 图片，可以这样做：

```js
const targetPixelCount = 1080; // 如果需要 Full HD 图片
const pixelRatio = PixelRatio.get(); // 设备的像素比
// pixels * pixelRatio = targetPixelCount，因此 pixels = targetPixelCount / pixelRatio
const pixels = targetPixelCount / pixelRatio;

const result = await captureRef(this.imageContainer, {
  result: 'tmpfile',
  height: pixels,
  width: pixels,
  quality: 1,
  format: 'png',
});
```

## 了解更多

**访问官方文档**

获取 API 及其用法的完整信息。

[访问官方文档](https://github.com/gre/react-native-view-shot)
