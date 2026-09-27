---
title: expo-camera（相机）
description: 使用设备的前置或后置相机渲染预览画面，支持拍照、录制视频与条码扫描。
---

# expo-camera（相机）

`expo-camera` 是一个 React 组件，用于渲染设备前置或后置相机的预览画面。它支持调整缩放、手电筒（Torch）和闪光灯（Flash），可以使用 `CameraView` 拍照、将视频录制到应用缓存中，并且能够检测条码。

> 支持平台：Android（仅真机）、iOS（仅真机）、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-camera
```
:::
:::tab yarn
```sh
yarn expo install expo-camera
```
:::
:::tab pnpm
```sh
pnpm expo install expo-camera
```
:::
:::tab bun
```sh
bun expo install expo-camera
```
:::
:::

从示例开始：

```sh
npx create-expo-app --example with-camera
```

该示例已配置好 `expo-camera`，可以直接参考。

## 在应用配置中配置

你可以使用 `expo-camera` 的配置插件（Config Plugin）在应用配置中设置 `expo-camera`。它适用于[使用连续原生生成（CNG）](/workflow/continuous-native-generation)的项目；配置插件中的设置无法在运行时修改，需要构建新的应用二进制才能生效。如果你不使用 CNG，则需要手动配置原生项目。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true,
          "barcodeScannerEnabled": true
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `cameraPermission` | `"Allow $(PRODUCT_NAME) to access your camera"` | 仅 iOS；设置 `NSCameraUsageDescription`。 |
| `microphonePermission` | `"Allow $(PRODUCT_NAME) to access your microphone"` | 仅 iOS；设置 `NSMicrophoneUsageDescription`。 |
| `recordAudioAndroid` | `true` | 仅 Android；控制 `RECORD_AUDIO` 权限。 |
| `barcodeScannerEnabled` | `true` | 控制条码扫描支持；不需要条码扫描时关闭它可以减小应用体积。在 Android 上仅当包从源码构建时生效，因为预构建模块已捆绑这些库；要使它生效，需将 `expo-camera` 添加到 package.json 中的 `buildFromSource`。 |

如果需要本地化的 iOS 权限提示文案，可将对应键添加到各语言文件的 `ios` 对象中，同时保持插件字符串为默认值 —— Expo 会在 prebuild 时把本地化的值写入 `InfoPlist.strings`。

### 手动配置原生项目（不使用 CNG）

- **Android**：包会自动添加 `android.permission.CAMERA`；如需录制带声音的视频，还要添加 `RECORD_AUDIO`。另外，必须在 `android/build.gradle` 的仓库列表末尾添加一个自定义 maven 仓库块，指向 `node_modules/expo-camera/android/maven`。
- **iOS**：需要在 `ios/[app]/Info.plist` 中添加 `NSCameraUsageDescription` 和 `NSMicrophoneUsageDescription`。

## 用法

:::warning
同一时间只能有一个相机预览处于活动状态。如果你的应用有多个屏幕，请在屏幕失去焦点时卸载 `Camera` 组件。
:::

### 基本用法

```tsx 基本相机用法
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // 相机权限仍在加载中。
    return <View />;
  }

  if (!permission.granted) {
    // 相机权限尚未被授予。
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

### 高级用法

如需完整的 TypeScript 示例（展示如何拍摄并展示照片），请参阅 [with-camera](https://github.com/expo/examples/tree/master/with-camera) 示例项目。

## API

### CameraView

一个用于预览相机画面的组件。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `active`（iOS） | `boolean`，默认 `true` | 相机是否处于活动状态；当相机未卸载但希望停止会话时很有用。 |
| `animateShutter` | `boolean`，默认 `true` | 是否显示快门动画。 |
| `autofocus`（iOS） | `FocusMode`，默认 `'off'` | 要应用的对焦模式。 |
| `barcodeScannerSettings` | `BarcodeSettings` | 配置条码扫描，例如 `{ barcodeTypes: ["qr"] }`。 |
| `enableTorch` | `boolean`，默认 `false` | 打开或关闭手电筒。 |
| `facing` | `CameraType`，默认 `'back'` | 选择 `front`（前置）或 `back`（后置）相机。 |
| `flash` | `FlashMode`，默认 `'off'` | 闪光灯行为：`on` 每次拍摄都闪光，`off` 从不闪光，`auto` 在需要时闪光。 |
| `mirror` | `boolean`，默认 `false` | 使用前置相机时是否镜像画面。 |
| `mode` | `CameraMode`，默认 `'picture'` | 选择图片或视频输出。 |
| `mute` | `boolean`，默认 `false` | 如果设置，录制的视频将没有声音。 |
| `onAvailableLensesChanged`（iOS） | `(event: AvailableLenses) => void` | 当设备的可用镜头发生变化时触发；事件携带一个 `lenses` 数组。 |
| `onBarcodeScanned` | `(scanningResult: BarcodeScanningResult) => void` | 成功扫描到条码时触发；`type` 是条码类型，`data` 是编码内容（QR 码通常是 URL）。 |
| `onCameraReady` | `() => void` | 相机预览设置完成后触发。 |
| `onMountError` | `(event: CameraMountError) => void` | 预览启动失败时触发；错误对象带有 `message`。 |
| `onResponsiveOrientationChanged`（iOS） | `(event: ResponsiveOrientationChanged) => void` | 响应式方向变化时触发；仅在 `responsiveOrientationWhenOrientationLocked` 为 `true` 时适用。事件包含相机更新后的方向。 |
| `pictureSize` | `string` | `takePictureAsync` 拍摄照片的尺寸；可用尺寸来自 `getAvailablePictureSizesAsync`。设置后 `ratio` 会被忽略，因为尺寸固定了宽高比。 |
| `poster`（Web） | `string` | 相机加载期间显示的图片 URL。 |
| `ratio`（Android） | `CameraRatio` | 预览宽高比，如 `4:3` 或 `16:9`。将 scaleType 从 `FILL` 改为 `FIT`；不支持的 1:1 尺寸会回退到最接近的受支持比例。 |
| `responsiveOrientationWhenOrientationLocked`（iOS） | `boolean` | 为 `true` 时，即使应用/设备方向锁定为竖屏，也能拍摄横屏照片。 |
| `selectedLens`（iOS） | `string`，默认 `'builtInWideAngleCamera'` | 可用镜头通过 `onAvailableLensesChanged` 或 `getAvailableLensesAsync` 提供；镜头说明请参阅 Apple 文档。 |
| `videoBitrate` | `number` | 视频录制码率，单位比特每秒（例如 `10_000_000`）。在 iOS 上使用时需向 `recordAsync` 传入编解码器。 |
| `videoQuality` | `VideoQuality` | 录制质量：`2160p`、`1080p`、`720p`、`480p`（仅 Android）或 `4:3`（640×480）。回退到最高可用质量。 |
| `videoStabilizationMode` | `VideoStabilization`，默认 `'auto'` | 视频录制时的防抖模式；各模式的说明请参阅 Apple 文档。 |
| `zoom` | `number`，默认 `0` | 设备最大变焦的 `0`–`1` 比例，`0` 表示未变焦，`1` 表示最大变焦。 |
| 继承 | `ViewProps` | 标准 React Native View 属性。 |

## 方法

### 静态方法

| 方法 | 平台 | 签名 / 返回值 | 说明 |
| --- | --- | --- | --- |
| `CameraView.dismissScanner()` | iOS | `Promise<void>` | 关闭由 `launchScanner` 展示的扫描器。在 Android 上，读取到条码后扫描器会自动关闭。 |
| `CameraView.getAvailableVideoCodecsAsync()` | iOS | `Promise<VideoCodec[]>` | 查询设备上可用于录制的视频编解码器；解析为字符串列表。 |
| `CameraView.isAvailableAsync()` | Web | `Promise<boolean>` | 检测设备是否有相机；不受权限 API 或浏览器 HTTP 使用方式的影响，仍需检查原生权限。 |
| `CameraView.launchScanner(options?)` | Android、iOS | `Promise<void>`；`options?`：`ScanningOptions` | Android 依赖 Google 条码扫描器；iOS 使用 `DataScannerViewController` 展示模态控制器，需要 iOS 16+。 |
| `CameraView.onModernBarcodeScanned(listener)` | Android、iOS | `EventSubscription`；`listener`：`(event: ScanningResult) => void` | 成功读取条码时触发监听器；结果携带条码的 `type` 和编码后的 `data`。 |
| `Camera.scanFromURLAsync(url, barcodeTypes?)` | Android、iOS、Web | `Promise<BarcodeScanningResult[]>` | 从图片 URL 扫描条码。iOS 上仅支持二维码；在 Android 上，条码应占据图像的大部分以获得最佳结果。 |

### CameraView 组件方法

| 方法 | 平台 | 签名 / 返回值 | 说明 |
| --- | --- | --- | --- |
| `getAvailableLensesAsync()` | iOS | `Promise<string[]>` | 解析为 `selectedLens` 属性可接受的镜头类型字符串列表。 |
| `getAvailablePictureSizesAsync()` | Android、iOS、Web | `Promise<string[]>` | 尺寸可传给 `pictureSize` 属性。不同 Android 设备上的列表不同，iOS 上则一致。 |
| `getSupportedFeatures()` | Android、iOS、Web | 返回 `{ isModernBarcodeScannerAvailable: boolean, toggleRecordingAsyncAvailable: boolean }` | 返回设备支持的特性。 |
| `pausePreview()` | Android、iOS、Web | `Promise<void>` | 暂停预览；暂停时使用 `takePictureAsync` 不受推荐。 |
| `recordAsync(options?)` | Android、iOS | `Promise<{ uri: string } \| undefined>` | 录制到缓存目录，并旋转视频以匹配方向；录制中切换相机会终止录制。当调用 `stopRecording`、达到 `maxDuration`/`maxFileSize` 或预览停止时 resolve（iOS 上还带有 `codec` 属性）。 |
| `resumePreview()` | Android、iOS、Web | `Promise<void>` | 恢复暂停的预览。 |
| `stopRecording()` | Android、iOS | `void` | 停止视频录制。 |
| `takePictureAsync(optionsWithRef)` | Android、iOS、Web | `CameraPictureOptions & { pictureRef: true }`；返回 `Promise<PictureRef>` | 返回包装了基本图片数据和原生图片实例引用的对象，可供其他 Expo 包使用。请先等待 `onCameraReady`；暂停时避免调用 —— Android 会抛错，iOS 会捕获屏幕上的最后一帧。 |
| `takePictureAsync(options?)` | Android、iOS、Web | `Promise<CameraCapturedPicture>` | 拍照并保存到缓存目录，返回 `uri`、`width`、`height`（仅当对应选项为真时才包含 `base64` 和 `exif`）。如需永久保存文件，请使用 `FileSystem.copy`。 |
| `toggleRecordingAsync()` | Android、iOS、Web | `Promise<void \| undefined>` | 暂停/恢复进行中的录制；在 iOS 上仅支持 iOS 18。 |

### PictureRef 方法

| 方法 | 平台 | 签名 / 返回值 | 说明 |
| --- | --- | --- | --- |
| `savePictureAsync(options?)` | Android、iOS、Web | `Promise<PhotoResult>` | 将图片写入缓存目录。 |

`PictureRef` 还有 `width`、`height`、`nativeRefType` 属性。

### Web 说明

在 Web 上，图片 URI 以 base64 字符串返回，因为浏览器中不存在本地文件路径。对于 Chrome 64+ 上的跨域 iframe，除非 iframe 元素包含 `allow="microphone; camera;"`，否则不会渲染任何内容。

## Hooks

### useCameraPermissions(options?)

- 平台：Android、iOS、Web
- 参数：`options?` — `PermissionHookOptions<object>`
- 用于检查或请求相机访问权限。内部使用 `requestCameraPermissionsAsync` 和 `getCameraPermissionsAsync` 与权限交互。

返回一个元组：

```ts
[PermissionResponse | null, RequestPermissionMethod<PermissionResponse>, GetPermissionMethod<PermissionResponse>]
```

示例：`const [status, requestPermission] = useCameraPermissions();`

### useMicrophonePermissions(options?)

- 平台：Android、iOS、Web
- 参数：`options?` — `PermissionHookOptions<object>`
- 与 `useCameraPermissions` 模式相同，但用于麦克风访问；内部依赖 `requestMicrophonePermissionsAsync` 和 `getMicrophonePermissionsAsync`。

返回同样的元组：`[PermissionResponse | null, RequestPermissionMethod<PermissionResponse>, GetPermissionMethod<PermissionResponse>]`

示例：`const [status, requestPermission] = Camera.useMicrophonePermissions();`

### PermissionResponse 字段

获取/请求权限函数返回的对象：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `canAskAgain` | `boolean` | 能否再次向用户弹出提示；如果不能，请引导用户前往设置。 |
| `expires` | `PermissionExpiration` | 权限何时失效（`'never'` 或数字）。 |
| `granted` | `boolean` | 是否已授予的便捷标志。 |
| `status` | `PermissionStatus` | 当前权限状态。 |

## 类型

### AvailableLenses

`lenses: string[]`

### BarcodeBounds

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `origin` | `BarcodePoint` | 边界框的原点。 |
| `size` | `BarcodeSize` | 边界框的尺寸。 |

### BarcodePoint

`Point` 的别名；坐标位于相机源的坐标空间中（使用相机视图时会调整为视图尺寸）。

### BarcodeScanningResult

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `bounds` | `BarcodeBounds` | 边界对象；可能表示一个空矩形，不一定要包围整个条码。 |
| `cornerPoints` | `BarcodePoint[]` | 不一定始终可用；iOS 对 `code39`/`pdf417` 不提供；各平台的顺序不同（Android 为 `topLeft, topRight, bottomRight, bottomLeft`；iOS 为 `bottomLeft, bottomRight, topLeft, topRight`；Web 与 Android 相同）。 |
| `data` | `string` | 条码中编码的解析信息。 |
| `extra?` | `AndroidBarcode` | 仅 Android，特定条码类型的额外信息。 |
| `type` | `string` | 条码类型。 |

### BarcodeSettings

`barcodeTypes: BarcodeType[]`

### BarcodeSize

`height: number`、`width: number`

### BarcodeType

字面量字符串；取值：`'aztec' | 'ean13' | 'ean8' | 'qr' | 'pdf417' | 'upc_e' | 'datamatrix' | 'code39' | 'code93' | 'itf14' | 'codabar' | 'code128' | 'upc_a'`

### CameraCapturedPicture

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `base64?` | `string` | 图片的 Base64 形式。 |
| `exif?` | `Partial<MediaTrackSettings> \| any` | 在 Android 和 iOS 上因设备/系统而异；在 Web 上是部分 `MediaTrackSettings`。 |
| `format` | `'jpg' \| 'png'` | 拍摄图片的格式。 |
| `height` | `number` | 拍摄图片的高度。 |
| `uri` | `string` | 在 Web 上等于 `base64`，因为浏览器中不存在文件路径。 |
| `width` | `number` | 拍摄图片的宽度。 |

### CameraEvents

`onModernBarcodeScanned: (event: ScanningResult) => void`

### CameraMode

`'picture' | 'video'`

### CameraMountError

`message: string`

### CameraOrientation

`'portrait' | 'portraitUpsideDown' | 'landscapeLeft' | 'landscapeRight'`

### CameraPictureOptions

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `additionalExif?` | `Record<string, any>` | Android、iOS；额外的 EXIF 信息，仅在 `exif: true` 时有用。 |
| `base64?` | `boolean` | 是否同时返回 Base64 图片数据。 |
| `exif?` | `boolean` | 是否同时返回 EXIF 数据。 |
| `imageType?` | `ImageType` | 仅 Web。 |
| `isImageMirror?` | `boolean` | 仅 Web。 |
| `mirror?` | `boolean` | 已弃用（请使用 `mirror` 属性）；Android、iOS；前置相机垂直翻转输出；默认 `false`。 |
| `onPictureSaved?` | `(picture: CameraCapturedPicture) => void` | 如果设置，Promise 会立即 resolve 且不带数据，结果通过此回调返回。 |
| `pictureRef?` | `boolean` | 返回可直接在 `Image` 中使用的图片引用。 |
| `quality?` | `number` | 压缩质量，`0` 到 `1`；默认 `1`。 |
| `scale?` | `number` | 仅 Web。 |
| `shutterSound?` | `boolean` | 默认 `true`。 |
| `skipProcessing?` | `boolean` | 直接返回来自相机的原始图片，跳过方向调整；同时会忽略 `quality`；可能导致图片旋转或方向错误。 |

### CameraRatio

`'4:3' | '16:9' | '1:1'`

### CameraRecordingOptions

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `codec?` | `VideoCodec` | 仅 iOS；录制使用的编解码器。 |
| `maxDuration?` | `number` | 最大录制时长，单位秒。 |
| `maxFileSize?` | `number` | 最大文件大小，单位字节。 |
| `mirror?` | `boolean` | 已弃用（请使用 `mirror` 属性）；垂直翻转录制的视频；iOS 默认已翻转前置相机视频，Android 遵循设备设置。 |

### CameraType

`'front' | 'back'`

### FlashMode

`'off' | 'on' | 'auto' | 'screen'`；`off` 禁用闪光灯，`on` 每次拍摄都闪光，`auto` 在需要时闪光，`screen` 使用屏幕作为自拍闪光灯（Android 上为 CameraX 屏幕闪光；在 iOS 上映射为 `'on'`/Retina 闪光）。

### FocusMode

`'on' | 'off'`，默认 `'off'`；`on` 表示自动对焦一次后锁定，`off` 表示按需自动对焦。

### ImageType

`'png' | 'jpg'`

### PermissionExpiration

`'never' | number`；目前所有权限都是永久的。

### PermissionHookOptions

`PermissionHookBehavior | Options`

### PermissionResponse

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `canAskAgain` | `boolean` | 如果为 `false`，请引导用户前往设置。 |
| `expires` | `PermissionExpiration` | 权限失效时间。 |
| `granted` | `boolean` | 是否已授予的便捷标志。 |
| `status` | `PermissionStatus` | 权限的状态。 |

### PhotoResult

`base64?: string`、`height: number`、`uri: string`（可作为 `Image`/`Video` 源）、`width: number`

### Point

`x: number`、`y: number`

### ResponsiveOrientationChanged

`orientation: CameraOrientation`

### SavePictureOptions

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `base64?` | `boolean` | 是否同时包含 Base64 数据。 |
| `metadata?` | `Record<string, any>` | 额外的图片元数据。 |
| `quality?` | `number` | 压缩质量，`0` 到 `1`。 |

### ScanningOptions

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| `barcodeTypes` | `BarcodeType[]` | 要扫描的条码类型。 |
| `isGuidanceEnabled?` | `boolean` | 仅 iOS；显示如 "Slow Down" 之类的引导文字；默认 `true`。 |
| `isHighlightingEnabled?` | `boolean` | 仅 iOS；高亮识别到的条目；默认 `false`。 |
| `isPinchToZoomEnabled?` | `boolean` | 仅 iOS；双指捏合缩放；默认 `true`。 |

### ScanningResult

`Omit<BarcodeScanningResult, 'bounds' | 'cornerPoints'>`

### VideoCodec

仅 iOS：`'avc1' | 'hvc1' | 'jpeg' | 'apcn' | 'ap4h'`

### VideoQuality

`'2160p' | '1080p' | '720p' | '480p' | '4:3'`

### VideoStabilization

`'off' | 'standard' | 'cinematic' | 'auto'`；在 Android 上，除 `off` 外都启用防抖，具体方法由设备决定。

### PictureRef（类）

继承 `SharedRef<'image'>` —— 一个原生图片引用。属性：`height: number`、`nativeRefType: string`、`width: number`；方法 `savePictureAsync(options?)` 返回 `Promise<PhotoResult>`，保存到缓存目录。

### PermissionStatus（枚举）

| 值 | 描述 |
| --- | --- |
| `DENIED = "denied"` | 用户已拒绝权限。 |
| `GRANTED = "granted"` | 用户已授予权限。 |
| `UNDETERMINED = "undetermined"` | 尚未授予或拒绝。 |

## 权限

### Android

该包会自动添加 `CAMERA` 权限。如需录制带声音的视频，还需在 **app.json** 的 `expo.android.permissions` 数组中添加 `RECORD_AUDIO`。

| Android 权限 | 描述 |
| --- | --- |
| `CAMERA` | 访问相机设备所必需。 |
| `RECORD_AUDIO` | 允许应用录制音频。 |

### iOS

该库使用以下用途说明键：

| Info.plist 键 | 描述 |
| --- | --- |
| `NSCameraUsageDescription` | 告知用户应用为何请求访问设备相机的消息。 |
| `NSMicrophoneUsageDescription` | 告知用户应用为何请求访问设备麦克风的消息。 |
