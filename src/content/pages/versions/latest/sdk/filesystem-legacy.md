---
title: FileSystem (legacy) 包参考
description: 提供设备本地文件系统访问能力的库。
---

# FileSystem (legacy) 包参考

:::note
FileSystem API 的 `legacy` 版本包含在 `expo-file-system` 库中。出于向后兼容，它可以与现代 API 一起使用。
:::

`expo-file-system` 提供对存储在设备本地的文件系统的访问。它也能够从网络 URL 上传和下载文件。

> 支持平台：Android、iOS、tvOS、Expo Go。

<details>
<summary>说明 expo-file-system 如何与不同资源交互的示意图</summary>

![expo-file-system 各部分以及它们如何与不同资源交互的示意图](/static/images/sdk/file-system/file-system-diagram.png)

</details>

<details>
<summary>expo-file-system 在 Expo Go 应用中的不同工作方式</summary>

在 Expo Go 中，每个项目都有独立的文件系统范围，无法访问其他项目的文件系统。

</details>

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-file-system
```
:::
:::tab yarn
```sh
yarn expo install expo-file-system
```
:::
:::tab pnpm
```sh
pnpm expo install expo-file-system
```
:::
:::tab bun
```sh
bun expo install expo-file-system
```
:::
:::

## 用法

### 下载文件

```js Component.js
const callback = downloadProgress => {
  const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
  this.setState({
    downloadProgress: progress,
  });
};

const downloadResumable = FileSystem.createDownloadResumable(
  'https://example.com/videos/small.mp4',
  FileSystem.documentDirectory + 'small.mp4',
  {},
  callback
);

try {
  const { uri } = await downloadResumable.downloadAsync();
  console.log('Finished downloading to ', uri);
} catch (e) {
  console.error(e);
}

try {
  await downloadResumable.pauseAsync();
  console.log('Paused download operation, saving for future retrieval');
  AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumable.savable()));
} catch (e) {
  console.error(e);
}

try {
  const { uri } = await downloadResumable.resumeAsync();
  console.log('Finished downloading to ', uri);
} catch (e) {
  console.error(e);
}

// 要在应用重启后恢复下载，假设已存储 DownloadResumable.savable() 对象：
const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
const downloadSnapshot = JSON.parse(downloadSnapshotJson);
const downloadResumable = new FileSystem.DownloadResumable(
  downloadSnapshot.url,
  downloadSnapshot.fileUri,
  downloadSnapshot.options,
  callback,
  downloadSnapshot.resumeData
);

try {
  const { uri } = await downloadResumable.resumeAsync();
  console.log('Finished downloading to ', uri);
} catch (e) {
  console.error(e);
}
```

### 管理 Giphy

```js
import * as FileSystem from 'expo-file-system/legacy';

const gifDir = FileSystem.cacheDirectory + 'giphy/';
const gifFileUri = (gifId: string) => gifDir + `gif_${gifId}_200.gif`;
const gifUrl = (gifId: string) => `https://media1.giphy.com/media/${gifId}/200.gif`;

// 检查 gif 目录是否存在。如果不存在，则创建它
async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(gifDir);
  if (!dirInfo.exists) {
    console.log("Gif directory doesn't exist, creating…");
    await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
  }
}

// 下载指定为 ID 数组的所有 gif
export async function addMultipleGifs(gifIds: string[]) {
  try {
    await ensureDirExists();

    console.log('Downloading', gifIds.length, 'gif files…');
    await Promise.all(gifIds.map(id => FileSystem.downloadAsync(gifUrl(id), gifFileUri(id))));
  } catch (e) {
    console.error("Couldn't download gif files:", e);
  }
}

// 返回本地 gif 文件的 URI
// 如果 gif 在本地不存在，则下载它
export async function getSingleGif(gifId: string) {
  await ensureDirExists();

  const fileUri = gifFileUri(gifId);
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    console.log("Gif isn't cached locally. Downloading…");
    await FileSystem.downloadAsync(gifUrl(gifId), fileUri);
  }

  return fileUri;
}

// 导出可分享的 URI——它可以在应用之外分享
export async function getGifContentUri(gifId: string) {
  return FileSystem.getContentUriAsync(await getSingleGif(gifId));
}

// 删除整个 giphy 目录及其全部内容
export async function deleteAllGifs() {
  console.log('Deleting all GIF files…');
  await FileSystem.deleteAsync(gifDir);
}
```

### 服务器：处理 multipart 请求

可以在 Node.js 中用一个简单服务器把上传的图片保存到磁盘：

```js index.js
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 此方法会把请求的二进制内容保存为文件。
app.patch('/binary-upload', (req, res) => {
  req.pipe(fs.createWriteStream('./uploads/image' + Date.now() + '.png'));
  res.end('OK');
});

// 此方法会把请求中的 "photo" 字段保存为文件。
app.patch('/multipart-upload', upload.single('photo'), (req, res) => {
  // 你可以访问其他 HTTP 参数。它们位于 body 对象中。
  console.log(req.body);
  res.end('OK');
});

app.listen(3000, () => {
  console.log('Working on port 3000');
});
```

## API

```js
import * as FileSystem from 'expo-file-system/legacy';
```

### 目录

此 API 使用指向设备上本地文件的 `file://` URI 来标识文件。每个应用只能读写以下目录下的位置：

- [`FileSystem.documentDirectory`](#filesystem-legacydocumentdirectory)
- [`FileSystem.cacheDirectory`](#filesystem-legacycachedirectory)

因此，例如，应用用户文档目录中 `'myDirectory'` 下名为 `'myFile'` 的文件，其 URI 为 `FileSystem.documentDirectory + 'myDirectory/myFile'`。

创建文件的 Expo API 通常在这些目录内操作。这包括 `Audio` 录音、`Camera` 照片、`ImagePicker` 结果、`SQLite` 数据库以及 `takeSnapShotAsync()` 的结果。因此它们可以与 `FileSystem` API 一起使用。

某些 `FileSystem` 函数能够从其他位置读取（但不能写入）。

### SAF URI

SAF URI 是与存储访问框架（Storage Access Framework）兼容的 URI。它应类似于 `content://com.android.externalstorage.*`。获取此类 URI 最简单的方式是 [`requestDirectoryPermissionsAsync`](#requestdirectorypermissionsasyncinitialfileurl) 方法。

## 支持的 URI scheme

在下表中，你可以看到每种方法可以处理哪类 URI。例如，如果你有一个以 `content://` 开头的 URI，不能使用 `FileSystem.readAsStringAsync()`，但可以使用支持该 scheme 的 `FileSystem.copyAsync()`。

| 方法名 | Android | iOS |
| --- | --- | --- |
| `getInfoAsync` | `file:///`、`content://`、`asset://`、无 scheme | `file://`、`ph://`、`assets-library://` |
| `readAsStringAsync` | `file:///`、`asset://`、[SAF URI](#saf-uri) | `file://` |
| `writeAsStringAsync` | `file:///`、[SAF URI](#saf-uri) | `file://` |
| `deleteAsync` | `file:///`、[SAF URI](#saf-uri) | `file://` |
| `moveAsync` | 来源：`file:///`、[SAF URI](#saf-uri)。目标：`file://` | 来源：`file://`。目标：`file://` |
| `copyAsync` | 来源：`file:///`、`content://`、`asset://`、[SAF URI](#saf-uri)、无 scheme。目标：`file://` | 来源：`file://`、`ph://`、`assets-library://`。目标：`file://` |
| `makeDirectoryAsync` | `file:///` | `file://` |
| `readDirectoryAsync` | `file:///` | `file://` |
| `downloadAsync` | 来源：`http://`、`https://`。目标：`file:///` | 来源：`http://`、`https://`。目标：`file://` |
| `uploadAsync` | 来源：`file:///`。目标：`http://`、`https://` | 来源：`file://`。目标：`http://`、`https://` |
| `createDownloadResumable` | 来源：`http://`、`https://`。目标：`file:///` | 来源：`http://`、`https://`。目标：`file://` |

> 在 Android 上，**无 scheme** 默认指向捆绑资源。

## 权限

### Android

以下权限通过此库的 **AndroidManifest.xml** 自动添加。

- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `INTERNET`

### iOS

*无需权限。*
