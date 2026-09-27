---
title: Audio (expo-audio) 包参考
description: 提供在应用中实现音频播放和录制的 API 的库。
---

# Audio (expo-audio) 包参考

`expo-audio` 是一个跨平台音频库，用于访问设备的原生音频能力。

> 支持平台：Android、iOS、Web、tvOS、Expo Go。

[Android 媒体格式支持文档](https://developer.android.com/media/media3/exoplayer/supported-formats)介绍了在 Android 上使用 Expo Player 时支持的格式。[iOS 音频和视频格式文档](https://developer.apple.com/documentation/coreaudiotypes/audio-format-identifiers)列出了 Apple 设备支持的媒体格式。

请注意，如果耳机或蓝牙音频设备断开连接，音频会自动停止。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-audio
```
:::
:::tab yarn
```sh
yarn expo install expo-audio
```
:::
:::tab pnpm
```sh
pnpm expo install expo-audio
```
:::
:::tab bun
```sh
bun expo install expo-audio
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-audio`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone.",
          "enableBackgroundPlayback": true,
          "enableBackgroundRecording": false
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `microphonePermission` | iOS | `"Allow $(PRODUCT_NAME) to access your microphone"` | 用于设置 `NSMicrophoneUsageDescription` 权限说明的字符串。设为 `false` 会禁用该权限，此时无法录音，`getRecordingPermissionsAsync()` 会以 `denied` 状态解析。 |
| `recordAudioAndroid` | Android | `true` | 决定是否在 Android 上启用 `RECORD_AUDIO` 权限的布尔值。 |
| `enableBackgroundRecording` |  | `false` | 决定是否启用后台音频录制的布尔值。在 Android 上，这会添加录制前台服务和权限，并在录制期间显示持久通知。在 iOS 上，这会添加 `audio` 后台模式。**注意：** 后台录制可能显著影响电池续航。 |
| `enableBackgroundPlayback` |  | `true` | 决定是否启用后台音频播放的布尔值。在 Android 上，这会添加媒体播放前台服务，允许你显示锁屏控件，并且持续后台播放需要它。在 iOS 上，这会添加 `audio` 后台模式。 |

## 用法

### 播放声音

```jsx
import { View, StyleSheet, Button } from 'react-native';
import { useAudioPlayer } from 'expo-audio';

const audioSource = require('./assets/Hello.mp3');

export default function App() {
  const player = useAudioPlayer(audioSource);

  return (
    <View style={styles.container}>
      <Button title="Play sound" onPress={() => player.play()} />
      <Button
        title="Replay sound"
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

### 录制声音

```jsx
import { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';

export default function App() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // 录音将可通过 `audioRecorder.uri` 获取。
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={recorderState.isRecording ? 'Stop recording' : 'Start recording'}
        onPress={recorderState.isRecording ? stopRecording : record}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

在 Android 和 iOS 上，`expo-audio` 默认把录音保存在应用的缓存目录中。当设备存储空间不足时，系统可能会删除缓存文件。要把新录音保存在更持久的位置，请向 `useAudioRecorder` 或 `prepareToRecordAsync()` 传入 `{ ...RecordingPresets.HIGH_QUALITY, directory: 'document' }`。这会把它们存储在应用的文档目录下。对于已经保存在缓存中的现有录音，使用返回的录音 URI，用 [`expo-file-system`](/versions/latest/sdk/filesystem) 移动它们。

### 在后台播放音频

后台音频播放允许应用在进入后台或设备屏幕锁定时继续播放音频。

#### 配置

要启用后台音频播放，请在[应用配置](/workflow/configuration)中使用配置插件：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "enableBackgroundPlayback": true
        }
      ]
    ]
  }
}
```

上述配置会自动配置所需的原生设置：

- **Android：** 添加 `FOREGROUND_SERVICE` 和 `FOREGROUND_SERVICE_MEDIA_PLAYBACK` 权限。还会在应用的 **AndroidManifest.xml** 中声明媒体播放前台服务（`AudioControlsService`）。
- **iOS：** 添加 `audio` `UIBackgroundMode` 功能

#### 用法

用配置插件配置应用之后，你需要：

1. **配置音频会话**，以允许后台播放
2. **启用锁屏控件**（在 Android 上，持续后台播放需要此项）

```jsx
import { View, Button } from 'react-native';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect } from 'react';

export default function AudioPlayerScreen() {
  const audioSource = require('./assets/audio.mp3');
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    // 为后台播放配置音频会话
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
  }, []);

  const handlePlay = () => {
    // 启用带元数据的锁屏控件
    player.setActiveForLockScreen(true, {
      title: 'My Audio Title',
      artist: 'Artist Name',
      albumTitle: 'Album Name',
      artworkUrl: 'https://example.com/artwork.jpg', // 可选
    });

    // 开始播放——这将在后台继续
    player.play();
  };

  const handleStop = () => {
    player.pause();
    // 完成后可选择禁用锁屏控件
    player.setActiveForLockScreen(false);
  };

  return (
    <View>
      <Button title="Play" onPress={handlePlay} />
      <Button title="Stop" onPress={handleStop} />
    </View>
  );
}
```

**Android**

:::note
在 Android 上，你必须用 [`setActiveForLockScreen`](#setactiveforlockscreenactive-metadata-options) 启用锁屏控件，才能持续后台播放。否则，音频会在后台播放大约 3 分钟后停止（操作系统限制）。请确保正确[配置配置插件](#在应用配置中配置)。
:::

- 通知抽屉中会出现带播放控件的媒体通知
- 音频会在后台无限期继续播放
- 用户可以从锁屏和通知控制播放
- 前台服务会在播放期间保持播放存活

**iOS**

在 iOS 上，一旦音频会话配置了 `shouldPlayInBackground: true`，音频播放就会在后台无缝继续。锁屏控件是可选的，但可以通过在锁屏和控制中心提供播放控件来改善用户体验。

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **android** 和 **ios** 项目），则需要为后台播放配置以下内容：

- 对于 Android，添加到 **android/app/src/main/AndroidManifest.xml**：

  ```xml android/app/src/main/AndroidManifest.xml
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />

  <application>
    <!-- 其他应用组件 -->
    <service
      android:name="expo.modules.audio.service.AudioControlsService"
      android:exported="false"
      android:foregroundServiceType="mediaPlayback">
      <intent-filter>
        <action android:name="androidx.media3.session.MediaSessionService" />
      </intent-filter>
    </service>
  </application>
  ```

- 对于 iOS，添加到 **ios/YourApp/Info.plist**：

  ```xml ios/YourApp/Info.plist
  <key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
  </array>
  ```

### 在后台录制音频

:::warning
后台录制可能显著影响电池续航。仅在应用功能确实需要时才启用。
:::

后台音频录制允许应用在进入后台或设备屏幕锁定时继续录制。

要启用后台录制，请在[应用配置](/workflow/configuration)中使用配置插件：

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-audio",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to record audio.",
          "enableBackgroundRecording": true
        }
      ]
    ]
  }
}
```

上述配置会自动配置所需的原生设置：

- **Android：** 添加 `FOREGROUND_SERVICE`、`FOREGROUND_SERVICE_MICROPHONE` 和 `POST_NOTIFICATIONS` 权限。还会在应用的 **AndroidManifest.xml** 中声明音频录制前台服务。
- **iOS：** 添加 `audio` `UIBackgroundMode` 功能

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **android** 和 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 Android，添加到 **android/app/src/main/AndroidManifest.xml**：

  ```xml android/app/src/main/AndroidManifest.xml
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
  <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
  ```

- 对于 iOS，添加到 **ios/YourApp/Info.plist**：

  ```xml ios/YourApp/Info.plist
  <key>UIBackgroundModes</key>
  <array>
    <string>audio</string>
  </array>
  ```

#### 用法

配置应用之后，使用 [`setAudioModeAsync`](#audiosetaudiomodeasyncmode) 在运行时启用后台录制：

```jsx
import { setAudioModeAsync, useAudioRecorder, RecordingPresets } from 'expo-audio';

await setAudioModeAsync({
  playsInSilentMode: true,
  allowsRecording: true,
  allowsBackgroundRecording: true,
});

const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
await recorder.prepareToRecordAsync();
await recorder.record();

// 录音会在后台继续
```

**Android**

在 Android 上，后台录制需要前台服务，它会显示一条持久通知，文字为 “Recording audio”，并带有停止按钮。录制进行时无法关闭此通知，录制停止后它会自动消失。

**iOS**

在 iOS 上，当应用处于后台或屏幕锁定时，后台录制会无缝继续。除了系统状态栏之外，不会向应用用户显示额外的通知或指示。

### 直接使用 AudioPlayer

在大多数情况下，使用 [`useAudioPlayer`](#useaudioplayersource-options) hook 来创建 `AudioPlayer` 实例。它管理播放器的生命周期，并确保组件卸载时正确释放。不过，在某些高级用例中，你可能需要创建一个超出组件生命周期而持续存在的 `AudioPlayer`。在这些情况下，使用 [`createAudioPlayer`](#audiocreateaudioplayersource-options) 函数。你需要了解这种方式带来的风险，因为当不再需要播放器时，由你负责调用 [`release()`](/versions/latest/sdk/expo#release) 方法。如果处理不当，这种方式可能导致内存泄漏。

```tsx
import { createAudioPlayer } from 'expo-audio';
const player = createAudioPlayer(audioSource);
```

### Web 用法说明

- Chrome 上的一个 MediaRecorder 问题会生成缺少时长元数据的 WebM 文件。[查看尚未解决的 Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=642012)。
- MediaRecorder 的编码选项和其他配置在不同浏览器之间并不一致。在应用中使用 [kbumsik/opus-media-recorder](https://github.com/kbumsik/opus-media-recorder) 或 [ai/audio-recorder-polyfill](https://github.com/ai/audio-recorder-polyfill) 等 polyfill 可以改善体验。传给 `prepareToRecordAsync` 的任何选项都会直接传给 MediaRecorder API，因此也会传给该 polyfill。
- Web 浏览器要求网站通过安全方式提供，才能监听麦克风。更多细节见 [MediaDevices `getUserMedia()` 安全性](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#security)。

## API

```js
import { useAudioPlayer, useAudioRecorder } from 'expo-audio';
```
