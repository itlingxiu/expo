---
title: Blob 包参考
description: 适用于 React Native、符合 Web 标准的 Blob 实现。
---

# Blob 包参考

`expo-blob` 为 React Native 提供符合 Web 标准的 Blob 实现，性能更好，并且在所有平台上行为一致。与从 `react-native` 导出的实现相比，它更可靠。`react-native` 的 Blob 在 `slice()` 方法和其他 Web API 功能上存在限制。

> 支持平台：Android、iOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-blob
```
:::
:::tab yarn
```sh
yarn expo install expo-blob
```
:::
:::tab pnpm
```sh
pnpm expo install expo-blob
```
:::
:::tab bun
```sh
bun expo install expo-blob
```
:::
:::

## 用法

### 创建基本 Blob

```typescript
import { Blob } from 'expo-blob';

// 创建一个空 blob
const emptyBlob = new Blob();

// 从文本创建 blob
const textBlob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 从二进制数据创建 blob
const binaryBlob = new Blob([new Uint8Array([1, 2, 3, 4])], {
  type: 'application/octet-stream',
});

// 从混合内容创建 blob
const mixedBlob = new Blob(
  [
    'Text content',
    new Uint8Array([65, 66, 67]), // ASCII 中的 ABC
    'More text',
  ],
  { type: 'text/plain' }
);
```

### Blob 属性

```typescript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

console.log(blob.size); // 13（字节）
console.log(blob.type); // "text/plain"
```

### 读取 Blob 内容

```typescript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 以文本读取
const text = await blob.text();
console.log(text); // "Hello, World!"

// 以字节读取
const bytes = await blob.bytes();
console.log(bytes); // Uint8Array(13) [72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]

// 以 ArrayBuffer 读取
const arrayBuffer = await blob.arrayBuffer();
console.log(arrayBuffer); // ArrayBuffer(13)
```

### 切分 Blob

```typescript
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });

// 从位置 0 切到 5
const slice1 = blob.slice(0, 5);
console.log(await slice1.text()); // "Hello"

// 从位置 7 切到末尾
const slice2 = blob.slice(7);
console.log(await slice2.text()); // "World!"

// 使用自定义类型切片
const slice3 = blob.slice(0, 5, 'text/html');
console.log(slice3.type); // "text/html"
```

### 流式读取

```typescript
const blob = new Blob(['Large content...'], { type: 'text/plain' });

// 创建可读流
const stream = blob.stream();
const reader = stream.getReader();

// 读取数据块
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log('Chunk:', value);
}
```

## API
