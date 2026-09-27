---
title: SQLite 包参考
description: 用于访问可通过 SQLite API 查询的数据库的库。
---

# SQLite 包参考

> 支持平台：Android、iOS、macOS、tvOS、Web、Expo Go。

`expo-sqlite` 让应用可以访问可通过 SQLite API 查询的数据库。数据库会在应用重启后保留。

:::warning
在 Apple TV 上，底层数据库文件位于缓存目录，而不是应用文档目录，这符合 [Apple 平台指南](https://github.com/react-native-tvos/react-native-tvos/issues/68#issuecomment-628327676)。
:::

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-sqlite
```
:::
:::tab yarn
```sh
yarn expo install expo-sqlite
```
:::
:::tab pnpm
```sh
pnpm expo install expo-sqlite
```
:::
:::tab bun
```sh
bun expo install expo-sqlite
```
:::
:::

## 在应用配置中配置

如果项目使用配置插件（[连续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)对 `expo-sqlite` 做高级配置。该插件可以配置若干无法在运行时设置、必须构建新的应用二进制才会生效的属性。如果应用**不**使用 CNG，则需要手动配置这个库。

### 带配置插件的 app.json 示例

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sqlite",
        {
          "enableFTS": true,
          "useSQLCipher": true,
          "android": {
            // 覆盖 Android 的共享配置
            "enableFTS": false,
            "useSQLCipher": false
          },
          "ios": {
            // 也可以覆盖 iOS 的共享配置
            "customBuildFlags": "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"
          }
        }
      ]
    ]
  }
}
```

### 可配置属性

| 名称 | 默认值 | 说明 |
| --- | --- | --- |
| `customBuildFlags` | - | 传给 SQLite 构建过程的自定义构建标志。 |
| `enableFTS` | `true` | 是否启用 [FTS3、FTS4](https://www.sqlite.org/fts3.html) 和 [FTS5](https://www.sqlite.org/fts5.html) 扩展。 |
| `useSQLCipher` | `false` | 使用 [SQLCipher](https://www.zetetic.net/sqlcipher/) 实现，而不是默认的 SQLite。 |
| `withSQLiteVecExtension` | `false` | 把 [sqlite-vec](https://github.com/asg017/sqlite-vec) 扩展包含进 [`bundledExtensions`](#sqlitebundledextensions)。 |

## Web 设置

要在 Web 上使用 `expo-sqlite`，需要配置 Metro 打包器以支持 **wasm** 文件，并添加 HTTP 响应头以允许使用 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)。

把以下配置添加到 **metro.config.js**。如果还没有 **metro.config.js**，可以运行 `npx expo customize metro.config.js`。[了解更多关于自定义 Metro 的信息](/guides/customizing-metro)。

```diff
diff --git a/metro.config.js b/metro.config.js
index 07c9fce..c3a9b0e 100644
--- a/metro.config.js
+++ b/metro.config.js
@@ -4,4 +4,16 @@ const { getDefaultConfig } = require('expo/metro-config');
 /** @type {import('expo/metro-config').MetroConfig} */
 const config = getDefaultConfig(__dirname);

+// 添加 wasm 资源支持
+config.resolver.assetExts.push('wasm');
+
+// 添加 COEP 与 COOP 响应头以支持 SharedArrayBuffer
+config.server.enhanceMiddleware = (middleware) => {
+  return (req, res, next) => {
+    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
+    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
+    middleware(req, res, next);
+  };
+};
+
 module.exports = config;
```

如果把应用部署到 Web 托管服务，还需要向 Web 服务器添加 `Cross-Origin-Embedder-Policy` 和 `Cross-Origin-Opener-Policy` 响应头。[了解更多关于 `COEP`、`COOP` 响应头和 `SharedArrayBuffer` 的信息](https://developer.chrome.com/blog/enabling-shared-array-buffer/)。

如果把应用部署在 [EAS Hosting](/eas/hosting/introduction) 上，可以在应用配置中配置这些响应头：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "headers": {
            "Cross-Origin-Embedder-Policy": "credentialless",
            "Cross-Origin-Opener-Policy": "same-origin"
          }
        }
      ]
    ]
  }
}
```

## 用法

从 `expo-sqlite` 导入该模块。

```js
import * as SQLite from 'expo-sqlite';
```

### 基本 CRUD 操作

```js
const db = await SQLite.openDatabaseAsync('databaseName');

// `execAsync()` 适合想要一次性执行的批量查询。
// 注意 `execAsync()` 不会转义参数，可能导致 SQL 注入。
await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
INSERT INTO test (value, intValue) VALUES ('test1', 123);
INSERT INTO test (value, intValue) VALUES ('test2', 456);
INSERT INTO test (value, intValue) VALUES ('test3', 789);
`);

// `runAsync()` 适合执行一些写入操作。
const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
console.log(result.lastInsertRowId, result.changes);
await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // 从可变参数绑定未命名参数
await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // 从数组绑定未命名参数
await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // 从对象绑定命名参数

// `getFirstAsync()` 适合从数据库获取单行。
const firstRow = await db.getFirstAsync('SELECT * FROM test');
console.log(firstRow.id, firstRow.value, firstRow.intValue);

// `getAllAsync()` 适合把全部结果作为对象数组获取。
const allRows = await db.getAllAsync('SELECT * FROM test');
for (const row of allRows) {
  console.log(row.id, row.value, row.intValue);
}

// `getEachAsync()` 适合迭代 SQLite 查询游标。
for await (const row of db.getEachAsync('SELECT * FROM test')) {
  console.log(row.id, row.value, row.intValue);
}
```

### 预处理语句

预处理语句让你编译一次 SQL 查询，再用不同参数多次执行。它们会自动转义输入参数以防御 SQL 注入攻击，建议用于包含用户输入的查询。可以在数据库实例上调用 [`prepareAsync()`](#prepareasyncsource) 或 [`prepareSync()`](#preparesyncsource) 获取预处理语句。预处理语句可以通过调用 [`executeAsync()`](#executeasyncparams) 或 [`executeSync()`](#executesyncparams) 完成 CRUD 操作。

:::note
记得在用完预处理语句后调用 [`finalizeAsync()`](#finalizeasync) 或 [`finalizeSync()`](#finalizesync) 来释放它。建议使用 `try-finally` 块，确保预处理语句被终结。
:::

```ts
const statement = await db.prepareAsync(
  'INSERT INTO test (value, intValue) VALUES ($value, $intValue)'
);
try {
  let result = await statement.executeAsync({ $value: 'bbb', $intValue: 101 });
  console.log('bbb and 101:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ccc', $intValue: 102 });
  console.log('ccc and 102:', result.lastInsertRowId, result.changes);

  result = await statement.executeAsync({ $value: 'ddd', $intValue: 103 });
  console.log('ddd and 103:', result.lastInsertRowId, result.changes);
} finally {
  await statement.finalizeAsync();
}

const statement2 = await db.prepareAsync('SELECT * FROM test WHERE intValue >= $intValue');
try {
  const result = await statement2.executeAsync<{ value: string; intValue: number }>({
    $intValue: 100,
  });

  // `getFirstAsync()` 适合从数据库获取单行。
  const firstRow = await result.getFirstAsync();
  console.log(firstRow.id, firstRow.value, firstRow.intValue);

  // 把 SQLite 查询游标重置到开头，以便下一次 `getAllAsync()` 调用。
  await result.resetAsync();

  // `getAllAsync()` 适合把全部结果作为对象数组获取。
  const allRows = await result.getAllAsync();
  for (const row of allRows) {
    console.log(row.value, row.intValue);
  }

  // 把 SQLite 查询游标重置到开头，以便下一次 `for-await-of` 循环。
  await result.resetAsync();

  // 结果对象也是异步可迭代对象。可以在 `for-await-of` 循环中用它迭代 SQLite 查询游标。
  for await (const row of result) {
    console.log(row.value, row.intValue);
  }
} finally {
  await statement2.finalizeAsync();
}
```

### 标签模板字面量 API

为了方便并改善开发体验，`expo-sqlite` 通过 `db.sql` 属性提供受 Bun 启发的标签模板字面量 API。此 API 会自动转义参数以防止 SQL 注入攻击，并根据查询类型提供自动类型推断。

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

const db = await SQLite.openDatabaseAsync('mydb.db');
const sql = db.sql;

const age = 21;
const users = await sql<User>`SELECT * FROM users WHERE age > ${age}`;
// 类型：User[]
console.log(users[0].name);

// INSERT/UPDATE/DELETE 等变更查询返回 SQLiteRunResult 元数据
const result =
  (await sql`INSERT INTO users (name, age) VALUES (${'Alice'}, ${30})`) as SQLite.SQLiteRunResult;
console.log(result.lastInsertRowId, result.changes);

// 只获取第一行
const user = await sql<User>`SELECT * FROM users WHERE id = ${1}`.first();
if (user) {
  console.log(user.name);
}

// 遍历结果
for await (const user of sql<User>`SELECT * FROM users`.each()) {
  console.log(user.name);
}

// 同步 API
const syncUsers = sql<User>`SELECT * FROM users WHERE age > ${21}`.allSync();
const syncUser = sql<User>`SELECT * FROM users WHERE id = ${1}`.firstSync();
```

### `useSQLiteContext()` Hook

```tsx
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}

export function Header() {
  const db = useSQLiteContext();
  const [version, setVersion] = useState('');
  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
        'SELECT sqlite_version()'
      );
      setVersion(result?.['sqlite_version()'] ?? '');
    }
    setup();
  }, []);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>SQLite version: {version}</Text>
    </View>
  );
}

interface Todo {
  value: string;
  intValue: number;
}

export function Content() {
  const db = useSQLiteContext();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllAsync<Todo>('SELECT * FROM todos');
      setTodos(result);
    }
    setup();
  }, []);

  return (
    <View style={styles.contentContainer}>
      {todos.map((todo, index) => (
        <View style={styles.todoItemContainer} key={index}>
          <Text>{`${todo.intValue} - ${todo.value}`}</Text>
        </View>
      ))}
    </View>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'hello', 1);
    await db.runAsync('INSERT INTO todos (value, intValue) VALUES (?, ?)', 'world', 2);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   添加更多迁移
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

const styles = StyleSheet.create({
  // 你的样式...
});
```

### 配合 `React.Suspense` 的 `useSQLiteContext()` Hook

与 [`useSQLiteContext()`](#usesqlitecontext-hook) Hook 一样，你也可以把 [`SQLiteProvider`](#sqlitesqliteprovider) 与 [`React.Suspense`](https://react.dev/reference/react/Suspense) 集成，在数据库就绪前显示回退组件。要启用该集成，把 `useSuspense` 属性传给 `SQLiteProvider` 组件。

```tsx
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { Suspense } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>
          <Header />
          <Content />
        </SQLiteProvider>
      </Suspense>
    </View>
  );
}
```

### 在异步事务中执行查询

```js
const db = await SQLite.openDatabaseAsync('databaseName');

await db.withTransactionAsync(async () => {
  const result = await db.getFirstAsync('SELECT COUNT(*) FROM USERS');
  console.log('Count:', result['COUNT(*)']);
});
```

由于 async/await 的特性，事务处于活动状态时运行的任何查询都会被包含进该事务。这包括传给 `withTransactionAsync()` 的作用域函数之外的查询语句，这种行为可能出人意料。例如，下面的测试用例在传给 `withTransactionAsync()` 的作用域函数内外都运行查询。不过，所有查询都会在实际的 SQL 事务中运行，因为第二条 `UPDATE` 查询在事务结束之前运行。

```ts
Promise.all([
  // 1. 新事务开始
  db.withTransactionAsync(async () => {
    // 2. 值 "first" 被插入 test 表，然后我们等待 2
    //    秒
    await db.execAsync('INSERT INTO test (data) VALUES ("first")');
    await sleep(2000);

    // 4. 两秒后，我们从表中读取最新数据
    const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM test');

    // ❌ 表中的数据将是 "second"，此断言会失败。
    //    此外，此断言会抛出错误并回滚
    //    事务，包括下面的 `UPDATE` 查询，因为它是在
    //    事务内运行的。
    expect(row.data).toBe('first');
  }),
  // 3. 一秒后，test 表中的数据被更新为 "second"。
  //    这条 `UPDATE` 查询会在事务中运行，即使它的代码
  //    在事务之外，因为此查询运行时事务恰好
  //    处于活动状态。
  sleep(1000).then(async () => db.execAsync('UPDATE test SET data = "second"')),
]);
```

[`withExclusiveTransactionAsync()`](#withexclusivetransactionasynctask) 函数解决了这个问题。只有在传给 `withExclusiveTransactionAsync()` 的作用域函数内运行的查询，才会在实际的 SQL 事务中运行。

### 执行 PRAGMA 查询

```js
const db = await SQLite.openDatabaseAsync('databaseName');
await db.execAsync('PRAGMA journal_mode = WAL');
await db.execAsync('PRAGMA foreign_keys = ON');
```

:::tip
创建新数据库时启用 [WAL 日志模式](https://www.sqlite.org/wal.html)，通常可以提升性能。
:::

### 导入已有数据库

要用已有的 **.db** 文件打开新的 SQLite 数据库，可以把 [`SQLiteProvider`](#sqlitesqliteprovider) 与 [`assetSource`](#assetsource) 一起使用。

```tsx
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" assetSource={{ assetId: require('./assets/test.db') }}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}
```

### 在应用/扩展之间共享数据库（iOS）

要与同一 App Group 中的其他应用/扩展共享数据库，可以按以下步骤使用共享容器：

1. 在应用配置中配置 App Group：

   ```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.myapp",
      "entitlements": {
        "com.apple.security.application-groups": ["group.com.myapp"]
      }
    }
  }
}
```

2. 使用 [`expo-file-system`](/versions/latest/sdk/filesystem) 库中的 [`Paths.appleSharedContainers`](/versions/latest/sdk/filesystem#applesharedcontainers) 获取共享容器的路径：

   ```tsx
import { SQLiteProvider, defaultDatabaseDirectory } from 'expo-sqlite';
import { Paths } from 'expo-file-system';
import { useMemo } from 'react';
import { Platform, View } from 'react-native';

export default function App() {
  const dbDirectory = useMemo(() => {
    if (Platform.OS === 'ios') {
      return Object.values(Paths.appleSharedContainers)?.[0]?.uri;
      // 或者用 `Paths.appleSharedContainers['group.com.myapp']?.uri` 选择特定容器
    }
    return defaultDatabaseDirectory;
  }, []);

  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" directory={dbDirectory}>
        <Header />
        <Content />
      </SQLiteProvider>
    </View>
  );
}
```

### 传递二进制数据

使用 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 向数据库传递二进制数据：

```ts
await db.execAsync(`
DROP TABLE IF EXISTS blobs;
CREATE TABLE IF NOT EXISTS blobs (id INTEGER PRIMARY KEY NOT NULL, data BLOB);
`);

const blob = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
await db.runAsync('INSERT INTO blobs (data) VALUES (?)', blob);

const row = await db.getFirstAsync<{ data: Uint8Array }>('SELECT * FROM blobs');
expect(row.data).toEqual(blob);
```

### 浏览设备上的数据库

`expo-sqlite` 库包含内置的 DevTools 检查器插件，在开发环境中自动启用，无需额外设置。它让你可以直接在浏览器中浏览表、查看和编辑行、运行 SQL 查询并导出数据库。要打开它，在 Expo CLI 终端中按 <kbd>Shift</kbd> + <kbd>M</kbd> 打开开发工具菜单，然后选择 **Open expo-sqlite** 启动检查器。

![SQLite 检查器，显示带表格行、编辑/删除操作以及列出各表的侧边栏的数据浏览器](/static/images/sdk/sqlite/inspector.webp)

你也可以使用 [`drizzle-studio-expo` 开发工具插件](https://github.com/drizzle-team/drizzle-studio-expo)，直接从 Expo CLI 启动连接到应用中数据库的 [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)。此插件可用于任何 `expo-sqlite` 配置，不需要 [Drizzle ORM](#drizzle-orm)。[了解如何安装和使用该插件](https://github.com/drizzle-team/drizzle-studio-expo)。

### 键值存储

`expo-sqlite` 库提供 [`Storage`](#sqlitestorage)，作为 [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage) 库的直接替换。此键值存储由 SQLite 支持。如果项目已经使用 `expo-sqlite`，可以利用 `expo-sqlite/kv-store`，无需再添加依赖。

[`Storage`](#sqlitestorage) 提供与 `@react-native-async-storage/async-storage` 相同的 API：

```ts
// 存储 API 是默认导出，你可以把它叫做 Storage、AsyncStorage，或任何你喜欢的名字。
import Storage from 'expo-sqlite/kv-store';

await Storage.setItem('key', JSON.stringify({ entity: 'value' }));
const value = await Storage.getItem('key');
const entity = JSON.parse(value);
console.log(entity); // { entity: 'value' }
```

使用 `expo-sqlite/kv-store` 的一个关键好处是增加了同步 API，使用更方便：

```ts
// 存储 API 是默认导出，你可以把它叫做 Storage、AsyncStorage，或任何你喜欢的名字。
import Storage from 'expo-sqlite/kv-store';

Storage.setItemSync('key', 'value');
const value = Storage.getItemSync('key');
```

如果你的项目目前使用 `@react-native-async-storage/async-storage`，切换到 `expo-sqlite/kv-store` 只需更改导入语句：

```diff
- import AsyncStorage from '@react-native-async-storage/async-storage';
+ import AsyncStorage from 'expo-sqlite/kv-store';
```

### `localStorage` API

`expo-sqlite/localStorage/install` 模块为 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) API 提供直接替换实现。如果你已经熟悉 Web 上的这个 API，或者希望在 Web 和其他平台之间共享存储代码，它会很有用。要使用它，只需导入 `expo-sqlite/localStorage/install` 模块：

:::note
`import 'expo-sqlite/localStorage/install';` 在 Web 上不会产生效果，并且会从生产 JS 包中排除。
:::

```ts
import 'expo-sqlite/localStorage/install';

globalThis.localStorage.setItem('key', 'value');
console.log(globalThis.localStorage.getItem('key')); // 'value'
```

## 安全

SQL 注入是一类漏洞，攻击者诱使应用把用户输入当作 SQL 代码执行。必须转义传给 SQLite 的所有用户输入以防御 SQL 注入。[预处理语句](#预处理语句)是针对此问题的有效防御。它们明确把 SQL 查询的逻辑与输入参数分开，SQLite 在执行预处理语句时会自动转义输入。

## 第三方库集成

`expo-sqlite` 库旨在成为坚实的 SQLite 基础。它能与第三方库更广泛地集成，以获得更高级的高层功能。下面是一些可以与 `expo-sqlite` 一起使用的库。

### Drizzle ORM

[Drizzle](https://orm.drizzle.team/) 是一个[“有头的无头 TypeScript ORM”](https://orm.drizzle.team/docs/overview)。它运行在 Node.js、Bun、Deno 和 React Native 上。它还有一个名为 [`drizzle-kit`](https://orm.drizzle.team/kit-docs/overview) 的 CLI 配套工具，用于生成 SQL 迁移。

更多细节见 [Drizzle ORM 文档](https://orm.drizzle.team/)和 [`expo-sqlite` 集成指南](https://orm.drizzle.team/docs/get-started/expo-new)。

### Knex.js

[Knex.js](https://knexjs.org/) 是一个[“灵活、可移植、用起来有趣”](https://github.com/knex/knex)的 SQL 查询构建器。

更多细节见 [`expo-sqlite` 集成指南](https://github.com/expo/knex-expo-sqlite-dialect)。

## SQLCipher

:::note
[Expo Go](https://expo.dev/go) 不支持 SQLCipher。
:::

[SQLCipher](https://www.zetetic.net/sqlcipher/) 是 SQLite 的一个分支，为数据库增加加密和身份验证。`expo-sqlite` 库在 Android、iOS 和 macOS 上支持 SQLCipher。要使用 SQLCipher，需要按[在应用配置中配置](#在应用配置中配置)一节所示，把 `useSQLCipher` 配置添加到 **app.json**，并运行 `npx expo prebuild`。

打开数据库后，需要立即用 `PRAGMA key = 'password'` 语句为数据库设置密码。

```ts
const db = await SQLite.openDatabaseAsync('databaseName');
await db.execAsync(`PRAGMA key = 'password'`);
```

## API

### 常用 API 速查

下表总结了 [`SQLiteDatabase`](#sqlitedatabase) 和 [`SQLiteStatement`](#sqlitestatement) 类的常用 API：

| [`SQLiteDatabase`](#sqlitedatabase) 方法 | [`SQLiteStatement`](#sqlitestatement) 方法 | 说明 | 使用场景 |
| ------------------------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`runAsync()`](#runasyncsource-params) | [`executeAsync()`](#executeasyncparams) | 执行 SQL 查询，并返回所做更改的信息。 | 适合 `INSERT`、`UPDATE`、`DELETE` 等 SQL 写入操作。 |
| [`getFirstAsync()`](#getfirstasyncsource-params) | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getfirstasync) | 获取查询结果的第一行。 | 适合从数据库获取单行。例如：`getFirstAsync('SELECT * FROM Users WHERE id = ?', userId)`。 |
| [`getAllAsync()`](#getallasyncsource-params) | [`executeAsync()`](#executeasyncparams) + [`getFirstAsync()`](#getallasync) | 一次获取全部查询结果。 | 最适合结果集较小的场景，例如带 LIMIT 子句的查询，如 `SELECT * FROM Table LIMIT 100`，你打算一次性取回全部结果。 |
| [`getEachAsync()`](#geteachasyncsource-params) | [`executeAsync()`](#executeasyncparams) + `for-await-of` 异步迭代器 | 提供用于遍历结果集的迭代器。此方法每次从数据库取一行，与 `getAllAsync()` 相比可能降低内存占用。 | 建议用于增量处理大型结果集，例如无限滚动实现。 |

