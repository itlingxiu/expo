---
title: expo-video 包参考
description: 提供在应用中实现视频播放的 API 的库。
---

# expo-video 包参考

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

`expo-video` 是面向 React Native 和 Expo、并支持 Web 的跨平台高性能视频组件。

## 已知问题（Android）

当两个 [`VideoView`](#videoview) 组件重叠，且 [`contentFit`](#contentfit) 属性设为 [`cover`](#videocontentfit) 时，其中一个视频可能显示到边界之外。这是一个[已知的上游问题](https://github.com/androidx/media/issues/1107)。要绕过此问题，使用 [`surfaceType`](#surfacetype) 属性并把它设为 [`textureView`](#surfacetype-1)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-video
```
:::
:::tab yarn
```sh
yarn expo install expo-video
```
:::
:::tab pnpm
```sh
pnpm expo install expo-video
```
:::
:::tab bun
```sh
bun expo install expo-video
```
:::
:::

## 在应用配置中配置

若项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-video`。该插件可以配置多种无法在运行时设置、必须构建新的应用二进制才能生效的属性。若应用**不**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ]
    ],
  }
}
```

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `supportsBackgroundPlayback` | `undefined` | 用于启用后台播放支持的布尔值。若为 `true`，在 iOS 上会把 `audio` 键加入 **Info.plist** 的 `UIBackgroundModes` 数组。若为 `false`，则移除该键。为 `undefined` 时不修改该键。在 Android 上，为 `true` 时会添加前台服务权限，并在 AndroidManifest.xml 中创建 expo-video 前台服务。 |
| `supportsPictureInPicture` | `undefined` | 用于在 Android 和 iOS 上启用画中画的布尔值。若为 `true`，会在 Android 上启用 `android:supportsPictureInPicture` 属性，并在 iOS 的 **Info.plist** 里把 `audio` 键加入 `UIBackgroundModes` 数组。若为 `false`，则移除该键。为 `undefined` 时不修改配置。 |

## 用法

下面是带播放和暂停按钮的简单视频示例。

```jsx
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
```

### 接收事件

[`VideoPlayer`](#videoplayer) 属性的变化不会更新 React 状态。因此，要显示 `VideoPlayer` 当前状态的信息，必须监听它发出的[事件](#videoplayerevents)。
事件系统基于 [`expo`](/versions/latest/sdk/expo) 包中的 [`EventEmitter`](/versions/latest/sdk/expo#eventemittertype) 类和 [hooks](/versions/latest/sdk/expo#hooks)。监听事件有几种方式：

#### `useEvent` hook

创建一个监听器，返回可在组件中使用的有状态值。组件卸载时也会自动清理。

```tsx useEvent
import { useEvent } from 'expo';
// ... 其他导入、组件定义、创建播放器等。

const { status, error } = useEvent(player, 'statusChange', { status: player.status });
// 组件的其余部分...
```

#### `useEventListener` hook

基于 `Player.addListener` 和 `Player.removeListener` 方法，创建会自动清理的事件监听器。

```tsx useEventListener
import { useEventListener } from 'expo';
// ... 其他导入、组件定义、创建播放器等。

useEventListener(player, 'statusChange', ({ status, error }) => {
  setPlayerStatus(status);
  setPlayerError(error);
  console.log('Player status changed: ', status);
});
// 组件的其余部分...
```

#### `Player.addListener` 方法

监听事件最灵活的方式，但需要手动清理，样板代码也更多。

```tsx Player.addListener
// ... 导入、组件定义、创建播放器等。

useEffect(() => {
  const subscription = player.addListener('statusChange', ({ status, error }) => {
    setPlayerStatus(status);
    setPlayerError(error);
    console.log('Player status changed: ', status);
  });

  return () => {
    subscription.remove();
  };
}, []);
// 组件的其余部分...
```

### 播放 assets 目录中的本地媒体

`expo-video` 支持播放用 `require` 函数加载的本地媒体。可以直接把结果当作视频源，若还想配置其他属性，也可以把它赋给 [`VideoSource`](#videosource) 的 `assetId` 参数。

```tsx 播放本地媒体
import { VideoSource } from 'expo-video';

const assetId = require('./assets/bigbuckbunny.mp4');

const videoSource: VideoSource = {
  assetId,
  metadata: {
    title: 'Big Buck Bunny',
    artist: 'The Open Movie Project',
  },
};

const player1 = useVideoPlayer(assetId); // 可以直接把 `asset` 当作视频源使用
const player2 = useVideoPlayer(videoSource);
```

### 播放媒体库中的媒体

`expo-video` 支持播放用 [`expo-media-library/legacy`](/versions/latest/sdk/media-library-legacy) 从用户媒体库挑选的视频，或任何具有相应权限的有效 `PHAsset` URI。

要从媒体库播放视频，应使用 [`MediaLibrary.getAssetsAsync()`](/versions/latest/sdk/media-library-legacy#medialibrarygetassetsasyncassetsoptions) 取得 [`Asset`](/versions/latest/sdk/asset#asset) 对象，并用它的 [`uri`](/versions/latest/sdk/asset#uri) 属性作为视频源的 [`uri`](#videosource)。
播放前，请用 [`MediaLibrary.requestPermissionsAsync()`](/versions/latest/sdk/media-library-legacy#medialibraryrequestpermissionsasyncwriteonly-granularpermissions) 请求必要权限。

在 iOS 上请**不要**使用资源信息的 `localUri` 属性，因为它不包含读取该资源所需的权限。

```tsx 播放媒体库中的媒体
import * as MediaLibrary from 'expo-media-library/legacy';
import { VideoSource, useVideoPlayer, VideoView } from 'expo-video';

// ... 组件定义、创建播放器等。

const loadAssetAndReplace = async () => {
  const { granted } = await MediaLibrary.requestPermissionsAsync(false, ['video']);
  if (!granted) {
    return;
  }

  const pagedAssets = await MediaLibrary.getAssetsAsync({
    mediaType: 'video',
  });

  if (pagedAssets.assets.length > 0) {
    const [asset] = pagedAssets.assets;
    const videoSource: VideoSource = {
      uri: asset.uri,
      metadata: {
        title: asset.filename,
      },
    };

    await player.replaceAsync(videoSource);
    await player.replaceAsync(asset.uri); // 也可以直接使用资源 URI
    player.play();
  }
};

// 现在可以用 loadAssetAndReplace 加载并播放媒体库中的第一个视频
```

### 预加载视频

另一个视频正在播放时，可以在把它显示到视图之前先加载。这样后续视频之间的切换更快，体验也更好。

要预加载视频，必须用视频源创建一个 `VideoPlayer`。即使播放器尚未连接到 `VideoView`，它也会填充缓冲区。一旦连接到 `VideoView`，就可以不缓冲直接开始播放。

有时更适合在屏幕生命周期的后期再预加载视频。这时应创建一个源为 `null` 的 `VideoPlayer`。要开始预加载，用 `replace()` 函数把播放器的源替换为视频源。

下面是预加载视频的示例：

```tsx
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const bigBuckBunnySource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const elephantsDreamSource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export default function PreloadingVideoPlayerScreen() {
  const player1 = useVideoPlayer(bigBuckBunnySource, player => {
    player.play();
  });

  const player2 = useVideoPlayer(elephantsDreamSource, player => {
    player.currentTime = 20;
  });

  const [currentPlayer, setCurrentPlayer] = useState(player1);

  const replacePlayer = useCallback(async () => {
    currentPlayer.pause();
    if (currentPlayer === player1) {
      setCurrentPlayer(player2);
      player1.pause();
      player2.play();
    } else {
      setCurrentPlayer(player1);
      player2.pause();
      player1.play();
    }
  }, [player1, currentPlayer]);

  return (
    <View style={styles.contentContainer}>
      <VideoView player={currentPlayer} style={styles.video} nativeControls={false} />
      <TouchableOpacity style={styles.button} onPress={replacePlayer}>
        <Text style={styles.buttonText}>Replace player</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4630ec',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#eeeeee',
    textAlign: 'center',
  },
  video: {
    width: 300,
    height: 168.75,
    marginVertical: 20,
  },
});
```

### 直接使用 VideoPlayer

多数情况下应使用 [`useVideoPlayer`](#usevideoplayersource-setup-playerbuilderoptions) hook 创建 `VideoPlayer` 实例。它管理播放器的生命周期，并确保组件卸载时正确释放。但在某些高级用法中，可能需要创建一个不会在组件卸载时自动销毁的 `VideoPlayer`。
这时可以用 [`createVideoPlayer`](#videocreatevideoplayersource-playerbuilderoptions) 函数创建 `VideoPlayer`。需要了解这种方式的风险：播放器不再需要时，由你负责调用 [`release()`](/versions/latest/sdk/expo#release) 方法。处理不当可能导致内存泄漏。

```tsx 创建播放器实例
import { createVideoPlayer } from 'expo-video';
const player = createVideoPlayer(videoSource);
```

:::warning
在 Android 上，由于[平台限制](https://github.com/expo/expo/issues/35012)，不能同时挂载多个使用同一个 `VideoPlayer` 实例的 `VideoView` 组件。
:::

### 缓存视频

若应用经常重播同一段视频，可以用缓存减少网络用量并改善体验，代价是设备存储占用增加。`expo-video` 在 `Android` 和 `iOS` 上支持视频缓存。把 [`VideoSource`](#videosource) 对象的 [`useCaching`](#videosource) 属性设为 `true` 即可启用。

缓存是持久的，超过首选大小后会按最近最少使用的原则清理。此外，存储空间不足时系统也可能清理缓存，因此不建议依赖缓存存放关键数据。

缓存在离线时仍然有效。若视频的一部分或全部已缓存，即使设备离线，也可以从缓存播放，直到缓存数据用尽。

> 由于平台限制，iOS 上不能对 HLS 视频源使用缓存。Android 和 iOS 都不支持缓存受 DRM 保护的视频。

### 管理缓存

- 可以用 [`setVideoCacheSizeAsync`](#videosetvideocachesizeasyncsizebytes) 函数以字节定义首选缓存大小。默认缓存大小为 1GB。
- 可以用 [`getCurrentVideoCacheSize`](#videogetcurrentvideocachesize) 获取缓存当前占用的存储字节数。
- 可以用 [`clearVideoCacheAsync`](#videoclearvideocacheasync) 函数清除全部已缓存视频。

### 拦截原生资源加载

<details>
<summary>这是面向高级用户的原生 `expo-video` 功能。展开以了解更多。</summary>

#### 简介

`expo-video` 在 iOS 上包含名为 `VideoAssetTransportProvider` 的原生扩展点。它让你可以拦截特定视频源、自定义底层 `AVURLAsset` 的创建方式，并覆盖它加载数据的方式。

当某个源无法由 `AVKit` 直接处理、需要原生预处理时，这很有用。例如，提供者可以重写 URL、附加自定义 `AVAssetResourceLoaderDelegate`、启动本地代理服务器，或在播放开始前把一种流格式转换成另一种。

提供者在模块启动时注册到 `VideoAssetTransportRegistry`。当 `expo-video` 加载某个源时，它会创建 `VideoAssetSourceDescriptor`，并按优先级询问已注册的提供者是否要处理它。第一个返回 `VideoAssetLoadPlan` 的提供者会被使用。

此 API 面向高级原生集成。它需要自定义原生模块，因此在 Expo Go 中不可用。请改用开发构建。

#### 可自定义的属性

主要自定义点是 `VideoAssetTransportProvider` 上的字段，以及它返回的 `VideoAssetLoadPlan` 上的字段。

`VideoAssetTransportProvider` 可以控制以下属性：

| 属性             | 说明                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `identifier`         | 提供者的稳定名称。替换或注销提供者时会用到。                                      |
| `priority`           | 多个提供者匹配同一源时由谁胜出。数值越大优先级越高。                             |
| `makeLoadPlan(for:)` | 匹配与配置的入口。返回 `nil` 表示忽略该源，返回 `VideoAssetLoadPlan` 表示处理它。 |

`VideoAssetLoadPlan` 可以通过以下属性控制 `expo-video` 如何构造和管理资源：

| 属性                  | 说明                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assetURL`                | 用于初始化底层 `AVURLAsset` 的 URL。可以是原始源 URL，也可以是传输层专用的替换值，例如重写后的 scheme、本地代理 URL 或生成的播放列表 URL。 |
| `assetOptions`            | 可选的 `AVURLAsset` 初始化选项。用于覆盖 `expo-video` 通常会从源派生的默认选项。                                                         |
| `reportedContentTypeHint` | 可选的内容类型，描述 `assetURL` 的实际播放格式。当传输层改变源类型时设置它，例如把 DASH 转成 HLS。                            |
| `resourceLoaderDelegate`  | 可选的 `AVAssetResourceLoaderDelegate`，应附加到资源的 resource loader 上。                                                                                                     |
| `resourceLoaderQueue`     | 可选的派发队列，`resourceLoaderDelegate` 在该队列上接收回调。                                                                                                                     |
| `prepareAsset`            | 在 `expo-video` 急切加载资源属性之前运行的可选异步工作。用于传输层启动，例如获取清单或启动本地服务器。                                  |
| `retainedObjects`         | 必须在资源生命周期内保持存活的可选辅助对象数组，例如本地 HTTP 服务器、解析器或传输状态所有者。                                                    |
| `attachErrorHandler`      | 可选钩子，让传输层在加载计划应用之后把异步错误转发回 `expo-video`。                                                                       |
| `onAssetDeinit`           | `VideoAsset` 被释放时运行的可选清理。                                                                                                                                           |

#### 实现与用法

典型设置如下：

1. 用 [`create-expo-module`](/modules/get-started) 创建 Expo 模块。
2. 添加一个遵循 `VideoAssetTransportProvider` 的类。
3. 在模块的 `OnCreate` 块中注册该提供者。
4. 构建应用，使原生模块编译进项目。

若只在单个应用中需要该提供者，使用[本地 Expo 模块](/modules/get-started#add-a-new-module-to-an-existing-application)流程。

若希望在多个应用中复用该提供者，改用[独立 Expo 模块](/modules/get-started#create-a-new-module-with-an-example-project)流程。

#### 基本用法示例

1. 定义提供者和加载计划。创建模块后，添加一个遵循 `VideoAssetTransportProvider` 的类。在 `makeLoadPlan(for:)` 中检查 `VideoAssetSourceDescriptor`，对不想处理的源返回 `nil`。

```swift
import ExpoVideo

final class ExampleVideoTransportProvider: VideoAssetTransportProvider {
  static let providerIdentifier = "com.example.video-transport"

  let identifier = Self.providerIdentifier
  let priority = 500

  func makeLoadPlan(for source: VideoAssetSourceDescriptor) -> VideoAssetLoadPlan? {
    guard source.contentTypeHint == .dash, source.url.pathExtension == "mpd" else {
      return nil
    }

    let transformedURL = URL(string: "http://127.0.0.1:8080/master.m3u8")!

    return VideoAssetLoadPlan(
      assetURL: transformedURL,
      reportedContentTypeHint: .hls
    )
  }
}
```

2. 要注册提供者，推荐位置是 Expo 模块的 `OnCreate` 块。这样可以确保视频开始加载之前提供者已经可用。

```swift
import ExpoModulesCore
import ExpoVideo

public final class CustomVideoTransportModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CustomVideoTransport")

    OnCreate {
      VideoAssetTransportRegistry.registerProvider(ExampleVideoTransportProvider())
    }

    OnDestroy {
      VideoAssetTransportRegistry.unregisterProvider(
        withId: ExampleVideoTransportProvider.providerIdentifier
      )
    }
  }
}
```

#### 完整示例

可以用下面这些完整示例更好地掌握此 API 的用法。

- [基本 DASH 支持提供者](https://github.com/expo/expo/tree/main/apps/bare-expo/modules/expo-video-dash-support-module)：Bare Expo 中的本地模块，为 iOS 上的 `expo-video` 提供有限的 DASH 支持。
- [`expo-video` iOS 缓存](https://github.com/expo/expo/blob/main/packages/expo-video/ios/Cache/CacheVideoAssetTransportProvider.swift)：内置缓存提供者的实现。

</details>

## API

```js
import { VideoView, useVideoPlayer } from 'expo-video';
```
