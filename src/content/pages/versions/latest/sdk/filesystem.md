---
title: FileSystem 包参考
description: 提供设备本地文件系统访问能力的库。
---

# FileSystem 包参考

`expo-file-system` 提供对存储在设备上、或作为资源打包进原生项目的文件和目录的访问。它也允许从网络下载文件。

> 支持平台：Android、iOS、tvOS、Expo Go。

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

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-file-system`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-file-system",
        {
          "supportsOpeningDocumentsInPlace": true,
          "enableFileSharing": true
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `supportsOpeningDocumentsInPlace` | iOS | `false` | 用于在 **Info.plist** 中启用 `LSSupportsOpeningDocumentsInPlace` 的布尔值。这允许应用就地打开文档。 |
| `enableFileSharing` | iOS | `false` | 用于在 **Info.plist** 中启用 `UIFileSharingEnabled` 的布尔值。这会在 iOS 文件 App 中启用文件共享，使用户可以通过文件 App、iTunes 文件共享和其他文件管理工具访问应用的 Documents 目录。 |

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)），或者手动使用原生 **ios** 项目，则需要在项目的 **ios/[app]/Info.plist** 中添加 `LSSupportsOpeningDocumentsInPlace` 和 `UIFileSharingEnabled` 键：

```xml
<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
<key>UIFileSharingEnabled</key>
<true/>
```

## 用法

```js
import { File, Directory, Paths } from 'expo-file-system';
```

`File` 和 `Directory` 实例持有对文件、内容或资源 URI 的引用。

文件或目录不必已经存在——只有在用错误的类表示已有路径时，构造函数才会抛出错误（例如你试图创建 `File` 实例，却传入了一个已经存在的目录路径）。

## 功能

- 对文件内容的同步与异步读写访问
- 创建、修改和删除
- 可用属性，例如 `type`、`size`、`creationDate` 等
- 能够以流的方式读写文件，或使用 `FileHandle` 类
- 使用 `downloadFileAsync` 或 `expo/fetch` 轻松下载和上传文件
- 使用平台原生流程预览文件

## 示例

<details>
<summary>写入和读取文本文件</summary>

```ts example.ts
import { File, Paths } from 'expo-file-system';

try {
  const file = new File(Paths.cache, 'example.txt');
  file.create(); // 如果文件已存在或没有创建权限，可能抛出错误
  await file.write('Hello, world!'); // 同步调用可用 `file.writeSync('Hello, world!');`
  console.log(file.textSync()); // Hello, world!
} catch (error) {
  console.error(error);
}
```

</details>

<details>
<summary>使用系统选择器选取文件</summary>

与 `expo-document-picker` 一起使用：

```ts example.ts
import { File } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

try {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
  if (!result.canceled) {
    const { uri } = result.assets[0];
    const file = new File(uri);
    console.log(file.textSync());
  }
} catch (error) {
  console.error(error);
}
```

在 Android 上使用内置的 `pickFileAsync` 或 `pickDirectoryAsync` 方法：

```ts example.ts
import { File } from 'expo-file-system';

try {
  const file = new File.pickFileAsync();
  console.log(file.textSync());
} catch (error) {
  console.error(error);
}
```

</details>

<details>
<summary>下载文件</summary>

使用 `downloadFileAsync`：

```ts example.ts
import { Directory, File, Paths } from 'expo-file-system';

const url = 'https://pdfobject.com/pdf/sample.pdf';
const destination = new Directory(Paths.cache, 'pdfs');
try {
  destination.create();
  const output = await File.downloadFileAsync(url, destination);
  console.log(output.exists); // true
  console.log(output.uri); // 已下载文件的路径，例如 '${cacheDirectory}/pdfs/sample.pdf'
} catch (error) {
  console.error(error);
}
```

或使用 `expo/fetch`：

```ts example.ts
import { fetch } from 'expo/fetch';
import { File, Paths } from 'expo-file-system';

const url = 'https://pdfobject.com/pdf/sample.pdf';
const response = await fetch(url);
const src = new File(Paths.cache, 'file.pdf');
await src.write(await response.bytes());
```

</details>

<details>
<summary>预览文件</summary>

使用 `File.preview()` 通过平台的文件预览流程打开本地文件。文件预览目前在 Android 和 iOS 上受支持。在 iOS 上，这会呈现 Quick Look，它支持许多常见文件类型，例如 PDF、图片、文本文件、CSV 文件和 Office 文档。在 Android 上，这会打开一个 `ACTION_VIEW` Intent，因此支持情况取决于设备上已安装、能够处理该文件 MIME 类型的应用。

```ts example.ts
import { File, Paths } from 'expo-file-system';

const file = await File.downloadFileAsync(
  'https://pdfobject.com/pdf/sample.pdf',
  new File(Paths.cache, 'sample.pdf')
);

if (await file.canPreview()) {
  await file.preview({ title: 'Sample PDF' });
}
```

`mimeType` 选项默认使用文件的 `type` 属性。如果文件扩展名不能正确标识类型，请显式传入 `mimeType`，尤其是在 Android 上，MIME 类型用于查找兼容的应用。当 Android 无法解析 MIME 类型时，`canPreview()` 会解析为 `false`，`preview()` 会被拒绝。

如果文件无效或无法读取，`canPreview()` 会被拒绝。当文件不存在或平台无法预览它时，它会解析为 `false`。

`preview()` 在原生预览已呈现、或已交给另一个应用后解析。如果文件不存在、无法读取或没有可用预览，它会被拒绝。它不会等待用户关闭查看器。

如果应用中适合使用分享表，可以在预览失败时把它与 [`expo-sharing`](/versions/latest/sdk/sharing) 组合使用：

```ts example.ts
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// 这可以是先前创建、选取或下载的文件。
const file = new File(Paths.cache, 'report.pdf');

try {
  await file.preview({ title: 'Report' });
} catch {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      dialogTitle: 'Share report',
      mimeType: file.type || 'application/pdf',
    });
  }
}
```

</details>

<details>
<summary>使用 expo/fetch 上传文件</summary>

你可以用 Expo 包内置的 `fetch` 直接把文件作为 blob 上传：

```ts example.ts
import { fetch } from 'expo/fetch';
import { File, Paths } from 'expo-file-system';

const file = new File(Paths.cache, 'file.txt');
await file.write('Hello, world!');

const response = await fetch('https://example.com', {
  method: 'POST',
  body: file,
});
```

或使用 `FormData` 构造函数：

```ts example.ts
import { fetch } from 'expo/fetch';
import { File, Paths } from 'expo-file-system';

const file = new File(Paths.cache, 'file.txt');
await file.write('Hello, world!');
const formData = new FormData();
formData.append('data', file);
const response = await fetch('https://example.com', {
  method: 'POST',
  body: formData,
});
```

</details>

<details>
<summary>移动和复制文件</summary>

```ts example.ts
import { Directory, File, Paths } from 'expo-file-system';
try {
  const file = new File(Paths.document, 'example.txt');
  file.create();
  console.log(file.uri); // '${documentDirectory}/example.txt'
  const copiedFile = new File(Paths.cache, 'example-copy.txt');
  file.copy(copiedFile);
  console.log(copiedFile.uri); // '${cacheDirectory}/example-copy.txt'
  file.move(Paths.cache);
  console.log(file.uri); // '${cacheDirectory}/example.txt'
  file.move(new Directory(Paths.cache, 'newFolder'));
  console.log(file.uri); // '${cacheDirectory}/newFolder/example.txt'
} catch (error) {
  console.error(error);
}
```

</details>

<details>
<summary>使用 FileHandle 进行随机访问读取</summary>

使用 [`FileHandle`](#filehandle) 对大文件进行高效的随机访问读取，而无需把整个文件加载到内存中。通过调用 `file.open()` 获取句柄，使用 `offset` 属性在任意位置读写，并在完成后始终关闭句柄。

```ts example.ts
import { File, Paths, FileMode } from 'expo-file-system';

const file = new File(Paths.document, 'recording.wav');
const handle = file.open(FileMode.ReadOnly);

// 读取 WAV 头（前 44 字节）
const header = handle.readBytesSync(44);
const sampleRate = new DataView(header.buffer).getUint32(24, true);
console.log(`Sample rate: ${sampleRate} Hz`);

// 定位到指定偏移并读取一块数据
handle.offset = 1024;
const chunk = await handle.readBytes(4096);
console.log(`Read ${chunk.length} bytes from offset 1024`);

// 以 64 KB 的块读取整个文件
handle.offset = 0;
const CHUNK_SIZE = 64 * 1024;
while (handle.offset! < handle.size!) {
  const data = await handle.readBytes(CHUNK_SIZE);
  // 处理数据……
}

handle.close();
```

</details>

<details>
<summary>使用旧版 FileSystem API</summary>

```ts example.ts
import * as FileSystem from 'expo-file-system/legacy';
import { File, Paths } from 'expo-file-system';

try {
  const file = new File(Paths.cache, 'example.txt');
  const content = await FileSystem.readAsStringAsync(file.uri);
  console.log(content);
} catch (error) {
  console.error(error);
}
```

</details>

<details>
<summary>递归列出目录内容</summary>

```ts example.ts
import { Directory, Paths } from 'expo-file-system';

function printDirectory(directory: Directory, indent: number = 0) {
  console.log(`${' '.repeat(indent)} + ${directory.name}`);
  const contents = directory.list();
  for (const item of contents) {
    if (item instanceof Directory) {
      printDirectory(item, indent + 2);
    } else {
      console.log(`${' '.repeat(indent + 2)} - ${item.name} (${item.size} bytes)`);
    }
  }
}

try {
  printDirectory(new Directory(Paths.cache));
} catch (error) {
  console.error(error);
}
```

</details>

## API
