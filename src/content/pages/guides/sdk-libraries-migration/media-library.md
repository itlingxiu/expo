---
title: 迁移到新的 expo-media-library API
description: 从旧版 expo-media-library API 迁移到基于类的新 expo-media-library API，使用 Asset、Album 和 Query。
---

# 迁移到新的 expo-media-library API

基于类的新 `expo-media-library` API 现已稳定。旧版 API 可从 `expo-media-library/legacy` 获取。迁移到根导入 `expo-media-library`，以使用新 API 和后续修复。

新 API 用 `Asset`、`Album` 和 `Query` 类取代了基于函数的 `MediaLibrary.getAssetsAsync({ ... })` 风格。相册和资源现在表示为只持有原生资源 ID 的类实例。资源属性是异步 getter，而不是预先获取的字段。`Query` 用可链式调用的构建器模式取代 `getAssetsAsync` 函数。

## 安装

安装与 SDK 兼容的包：

```sh
npx expo install expo-media-library
```

## 导入新 API

从 `expo-media-library` 导入：

```ts
import { Asset, Album, Query } from 'expo-media-library';
```

## 资源

### 从文件创建资源

```ts
// 之前
await MediaLibrary.saveToLibraryAsync(localUri);
// 或者，要拿回一个引用：
const asset = await MediaLibrary.createAssetAsync(localUri);

// 之后
const asset = await Asset.create(localUri);
```

新 API 中没有 `saveToLibraryAsync`。使用 `Asset.create`，它会把文件保存到媒体库并返回一个 `Asset` 实例。

### 查询资源

```ts
// 之前
const { assets } = await MediaLibrary.getAssetsAsync({
  mediaType: MediaLibrary.MediaType.photo,
  first: 20,
  sortBy: [['creationTime', false]],
});

// 之后
const assets = await new Query()
  .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
  .limit(20)
  .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
  .exe();
```

`Query` 直接返回 `Asset` 实例数组。没有 `assets` 包装对象，也没有 `endCursor`。分页通过链式调用 `.limit()` 和 `.offset()` 处理。

### 读取资源属性

```ts
// 之前
const info = await MediaLibrary.getAssetInfoAsync(asset);
console.log(info.filename, info.width, info.height);

// 之后，单独的 getter
const filename = await asset.getFilename();
const width = await asset.getWidth();
const height = await asset.getHeight();
const mediaType = await asset.getMediaType();

// 之后，一次获取全部属性
const info = await asset.getInfo();
```

属性通过异步 getter 访问，而不是预先获取的字段。使用 `getInfo()` 一次取回全部属性，得到一个 `AssetInfo` 对象。

### 读取 EXIF 数据

```ts
// 之前
const info = await MediaLibrary.getAssetInfoAsync(asset);
const exif = info.exif;

// 之后
const exif = await asset.getExif();
```

### 删除资源

```ts
// 之前
await MediaLibrary.deleteAssetsAsync([asset]);

// 之后，单个资源
await asset.delete();

// 之后，多个资源
await Asset.delete([asset1, asset2]);
```

### 在新 API 旁边使用旧版资源

> 如果可能，请把应用端到端迁移到新 API。下面的辅助函数用于新旧 API 同时使用的渐进迁移。

如果你在内存中有一个旧版 `Asset` 对象，并需要新的 `Asset` 实例，在 iOS 上使用 `asset.uri`（它已经是新 API 接受的 `ph://` URI），在 Android 上使用 `getAssetContentUriAsync` 把数字形式的 MediaStore ID 转换为 `content://` URI。

```ts
import { Asset } from 'expo-media-library';
import * as LegacyMediaLibrary from 'expo-media-library/legacy';
import { Platform } from 'react-native';

async function toNewAsset(legacyAsset: LegacyMediaLibrary.Asset): Promise<Asset> {
  switch (Platform.OS) {
    case 'ios':
      return new Asset(legacyAsset.uri);
    case 'android': {
      const contentUri = await LegacyMediaLibrary.getAssetContentUriAsync(legacyAsset);
      return new Asset(contentUri);
    }
    default:
      throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
}
```

如果应用存储了旧版 API 返回的资源 ID（例如存在数据库中），请在创建 `Asset` 实例之前转换它们。在 iOS 上，给旧版 ID 加上 `ph://` 前缀。在 Android 上，使用 `getAssetContentUriAsync` 把数字形式的 MediaStore ID 解析为 `content://` URI。

```ts
async function convertStoredId(legacyId: string): Promise<Asset> {
  switch (Platform.OS) {
    case 'ios':
      return new Asset(`ph://${legacyId}`);
    case 'android': {
      const contentUri = await LegacyMediaLibrary.getAssetContentUriAsync(legacyId);
      return new Asset(contentUri);
    }
    default:
      throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
}
```

## 相册

### 按名称获取相册

```ts
// 之前
const album = await MediaLibrary.getAlbumAsync('MyAlbum');

// 之后
const album = await Album.get('MyAlbum');
if (album) {
  // 找到了相册
}
```

### 获取全部相册

```ts
// 之前
const albums = await MediaLibrary.getAlbumsAsync();

// 之后
const albums = await Album.getAll();
```

### 创建相册

```ts
// 之前
const album = await MediaLibrary.createAlbumAsync('MyNewAlbum', asset, false);

// 之后
const album = await Album.create('MyNewAlbum', [asset]);
```

### 获取相册中的全部资源

```ts
// 之前
const { assets } = await MediaLibrary.getAssetsAsync({ album: album.id });

// 之后
const assets = await album.getAssets();
```

### 获取相册标题

```ts
// 之前，title 是同步属性，但需要先获取完整的相册对象
const album = await MediaLibrary.getAlbumAsync('MyAlbum');
console.log(album.title);

// 之后
const title = await album.getTitle();
```

### 向相册添加资源

```ts
// 之前
await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);

// 之后
await album.add([asset]);
```

### 从相册移除资源（仅 iOS）

```ts
// 之前
await MediaLibrary.removeAssetsFromAlbumAsync(assets, album);

// 之后
await album.removeAssets(assets);
```

### 删除相册

```ts
// 之前
await MediaLibrary.deleteAlbumsAsync([album], false);

// 之后，单个相册
await album.delete();

// 之后，多个相册
await Album.delete([album1, album2]);
```

## 权限

权限 hook 和函数仍使用相同的名称。唯一的变化是 `presentPermissionsPickerAsync` 重命名为 `presentPermissionsPicker`。

```ts
// 之前
await MediaLibrary.presentPermissionsPickerAsync(mediaTypes);

// 之后
await presentPermissionsPicker(mediaTypes);
```

`requestPermissionsAsync`、`getPermissionsAsync` 和 `usePermissions` 没有变化。

## 监听变化

```ts
// 之前
const subscription = MediaLibrary.addListener(event => { ... });
subscription.remove();

// 之后
const subscription = addListener(event => { ... });
subscription.remove();

// 一次移除全部监听器
removeAllListeners();
```

监听器事件的结构没有变化。

## 破坏性的语义变化

- 资源属性现在是异步 getter（`getFilename()`、`getWidth()` 等），而不是结果对象上的同步字段。使用 `asset.getInfo()` 一次取回全部属性。
- 去掉了 `Async` 后缀。整个库都是异步的。
- `Query` 取代了 `getAssetsAsync` 的选项对象。没有 `endCursor`/`hasNextPage`。使用 `.limit()` 和 `.offset()` 进行分页。
- 对相册和资源的操作现在是 `Album` 和 `Asset` 实例上的方法，而不是接受 ID 或引用的自由函数。
- `saveToLibraryAsync` 由 `Asset.create` 取代，后者返回一个 `Asset` 实例。
- `getMomentsAsync`、`albumNeedsMigrationAsync` 和 `migrateAlbumIfNeededAsync` 已移除，没有替代。可以安全删除对这些函数的任何调用。

## 参考

- [MediaLibrary](/versions/latest/sdk/media-library) —— 查看 expo-media-library 的完整 API 参考。
