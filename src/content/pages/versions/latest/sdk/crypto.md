---
title: Crypto 包参考
description: 用于加密操作的通用库。
---

# Crypto 包参考

`expo-crypto` 让你能够以与 Node.js 核心 `crypto` API 等价的方式对数据做哈希，并执行 AES 加密与解密等加密操作。

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-crypto
```
:::
:::tab yarn
```sh
yarn expo install expo-crypto
```
:::
:::tab pnpm
```sh
pnpm expo install expo-crypto
```
:::
:::tab bun
```sh
bun expo install expo-crypto
```
:::
:::

## 用法

```jsx
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Crypto from 'expo-crypto';

export default function App() {
  useEffect(() => {
    (async () => {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        'GitHub stars are neat 🌟'
      );
      console.log('Digest: ', digest);
      /* 某项加密操作…… */
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Crypto Module Example</Text>
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
});
```

### AES 加密与解密

```tsx
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AESEncryptionKey, aesEncryptAsync, aesDecryptAsync } from 'expo-crypto';

export default function App() {
  useEffect(() => {
    (async () => {
      const plaintext = 'Hello, world!';
      const plaintextBase64 = btoa(plaintext);

      const encryptionKey = await AESEncryptionKey.generate();
      const sealedData = await aesEncryptAsync(plaintextBase64, encryptionKey);
      const decryptedBase64 = await aesDecryptAsync(sealedData, encryptionKey, {
        output: 'base64',
      });

      const decrypted = atob(decryptedBase64);
      console.log('Decrypted: ', decrypted);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Crypto Module Example</Text>
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
});
```

<details>
<summary>加密数据并保存到文件</summary>

```ts example.ts
import { AESEncryptionKey, aesEncryptAsync } from 'expo-crypto';
import { File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

async function encryptAndSaveData(plaintextData: Uint8Array) {
  // 生成加密密钥
  const encryptionKey = await AESEncryptionKey.generate();

  // 加密数据
  const sealedData = await aesEncryptAsync(plaintextData, encryptionKey);
  const encryptedBytes = await sealedData.combined();

  // 存储加密密钥
  const keyHex = await encryptionKey.encoded('hex');
  await SecureStore.setItemAsync('aes-encryption-key', keyHex);

  // 保存加密文件
  const file = new File(Paths.cache, 'encrypted.dat');
  file.create({ overwrite: true });
  await file.write(encryptedBytes);
}
```

</details>

<details>
<summary>加载文件并解密数据</summary>

```ts example.ts
import { AESEncryptionKey, AESSealedData, aesDecryptAsync } from 'expo-crypto';
import { File, Paths } from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

async function loadAndDecryptData(): Promise<Uint8Array | null> {
  // 加载加密密钥
  const keyHex = await SecureStore.getItemAsync('aes-encryption-key');
  if (!keyHex) {
    return null;
  }
  const encryptionKey = await AESEncryptionKey.import(keyHex, 'hex');

  // 加载加密文件
  const file = new File(Paths.cache, 'encrypted.dat');
  if (!file.exists) {
    return null;
  }
  const encryptedBytes = await file.bytes();
  const sealedData = AESSealedData.fromCombined(encryptedBytes);

  // 解密数据
  const plaintextBytes = await aesDecryptAsync(data, encryptionKey);
  return plaintextBytes;
}
```

</details>

## API

```js
import * as Crypto from 'expo-crypto';
```

## 错误码

| 代码 | 说明 |
| --- | --- |
| `ERR_CRYPTO_UNAVAILABLE` | **仅 Web。** 对 WebCrypto API 的访问仅限安全来源（localhost/https）。 |
| `ERR_CRYPTO_DIGEST` | 提供了无效的编码类型。 |
