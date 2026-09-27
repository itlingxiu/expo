---
title: 使用 Jest 进行单元测试
description: 了解如何安装和配置 jest-expo，在 Expo 项目中用 Jest 编写单元测试与快照测试。
---

# 使用 Jest 进行单元测试

[Jest](https://jestjs.io/) 是使用最广泛的 JavaScript 单元测试与快照测试框架。本指南介绍如何在 Expo 项目中设置 Jest、编写单元测试、编写快照测试，以及结合 React Native 组织测试的最佳实践。

本指南依赖 [`jest-expo`](https://github.com/expo/expo/tree/main/packages/jest-expo)，它是一个 Jest 预设（preset），会模拟（mock）Expo SDK 的原生部分，并提供 Expo 项目所需的大部分配置。

## 安装与配置

创建 Expo 项目后，在项目根目录安装 `jest-expo` 及必需的开发依赖。

**macOS/Linux**

```sh
# npm
npx expo install jest-expo jest @types/jest --dev

# yarn
yarn expo install jest-expo jest @types/jest --dev

# pnpm
pnpm expo install jest-expo jest @types/jest --dev

# bun
bun expo install jest-expo jest @types/jest --dev
```

**Windows**

```sh
# npm
npx expo install jest-expo jest @types/jest "--" --dev

# yarn
yarn expo install jest-expo jest @types/jest "--" --dev

# pnpm
pnpm expo install jest-expo jest @types/jest "--" --dev

# bun
bun expo install jest-expo jest @types/jest "--" --dev
```

:::note
如果你的项目不使用 TypeScript，可以跳过安装 `@types/jest`。
:::

对于 TypeScript 项目，在 **tsconfig.json** 的 `types` 数组中加上 `"jest"`，以启用 Jest 的类型定义：

```json tsconfig.json
{
  "compilerOptions": {
    "types": ["jest"]
  }
}
```

在 **package.json** 中添加测试脚本：

```json package.json
{
  "scripts": {
    "test": "jest --watchAll"
    ...
```

并把 `jest-expo` 设为预设（preset），以建立 Jest 的基础配置：

```json package.json
{
  "jest": {
    "preset": "jest-expo"
  }
}
```

### 使用 transformIgnorePatterns 的额外配置

通过在 **package.json** 中配置 [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)，可以对项目使用的 node_modules 进行转译；该属性接收一个正则表达式。

:::tabs
:::tab npm/Yarn
```json package.json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ]
}
```
:::
:::tab pnpm
```json package.json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!(.pnpm|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))"
  ]
}
```
:::
:::tab Bun
```json package.json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!(.bun|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))"
  ]
}
```
:::
:::

Jest 提供了许多配置选项，但以上设置应能覆盖大多数情况；需要时也可以随时扩展该模式列表。参见 [Configuring Jest](https://jestjs.io/docs/configuration)。

## 安装 React Native Testing Library

[`@testing-library/react-native`](https://callstack.github.io/react-native-testing-library/) 是测试 React Native 组件的轻量方案，提供工具函数，并与 Jest 协同工作。

**macOS/Linux**

```sh
# npm
npx expo install @testing-library/react-native --dev

# yarn
yarn expo install @testing-library/react-native --dev

# pnpm
pnpm expo install @testing-library/react-native --dev

# bun
bun expo install @testing-library/react-native --dev
```

**Windows**

```sh
# npm
npx expo install @testing-library/react-native "--" --dev

# yarn
yarn expo install @testing-library/react-native "--" --dev

# pnpm
pnpm expo install @testing-library/react-native "--" --dev

# bun
bun expo install @testing-library/react-native "--" --dev
```

:::warning 已弃用（Deprecated）
`@testing-library/react-native` 取代了已弃用的 `react-test-renderer`，因为 `react-test-renderer` 不支持 React 19 及以上版本。如果项目正在使用它，请移除该库。详见 [React 官方文档](https://react.dev/warnings/react-test-renderer)。
:::

## 单元测试

单元测试验证最小的代码单元，通常是函数。

在 **src/app** 下创建 **index.tsx**，写入渲染一个简单组件的代码：

```tsx index.tsx
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CustomText>Welcome!</CustomText>
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

接着，在项目根目录创建 **\_\_tests\_\_** 目录（若已存在则复用），并添加 **home-screen-test.tsx**。`jest-expo` 预设同样把 **-test.ts|tsx** 扩展名的文件视为测试。

```tsx home-screen-test.tsx
import { render } from '@testing-library/react-native';

import HomeScreen, { CustomText } from '@/app/index';

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', async () => {
    const { getByText } = await render(<HomeScreen />);

    getByText('Welcome!');
  });
});
```

`getByText` 查询用于定位应用 UI 中的元素，让测试断言该元素是否存在。它来自 React Native Testing Library，每种[查询变体](https://callstack.github.io/react-native-testing-library/docs/api/queries#query-variant)返回不同的类型。更多示例见该库的 [Queries API 参考](https://callstack.github.io/react-native-testing-library/docs/api/queries)。

运行测试：

```sh
# npm
npm run test

# yarn
yarn run test

# pnpm
pnpm run test

# bun
bun run test
```

应该有一个测试通过。

## 组织你的测试

可维护性取决于测试文件的组织方式。常见做法是用一个 **\_\_tests\_\_** 目录集中存放所有测试，例如与 **components** 目录同级：

```text
__tests__
  themed-text-test.tsx
src
  components
    themed-text.tsx
    themed-view.tsx
```

也可以按项目区域分别使用 **\_\_tests\_\_** 子目录：

```text
src
  components
    themed-text.tsx
    __tests__
      themed-text-test.tsx
  utils
    index.tsx
    __tests__
      index-test.tsx
```

选择哪种方式取决于个人偏好；项目目录如何组织由开发者决定。

## 快照测试

:::note
对于 UI 测试，我们推荐端到端（E2E）测试而不是快照单元测试。参见 [使用 Maestro 进行 E2E 测试](/eas/workflows/examples/e2e-tests)指南。
:::

[快照测试](https://jestjs.io/docs/en/snapshot-testing)有助于确认 UI 保持一致，尤其是在多个组件共享全局样式时。

把以下片段添加到 **home-screen-test.tsx** 的 `describe()` 块中：

```tsx home-screen-test.tsx
describe('<HomeScreen />', () => {
  ...

  test('CustomText renders correctly', async () => {
    const tree = (await render(<CustomText>Some text</CustomText>)).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
```

运行 `npm run test` 后，会在 **\_\_tests\_\_\\\_\_snapshots\_\_** 目录中创建快照，此时应有两个测试通过。

## 代码覆盖率报告

覆盖率报告展示测试覆盖了多少代码。要查看 HTML 报告，在 **package.json** 的 `jest` 下把 `collectCoverage` 设为 `true`，并用 `collectCoverageFrom` 列出要排除的文件：

```json package.json
"jest": {
  ...
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/expo-env.d.ts",
    "!**/.expo/**"
  ]
}
```

运行 `npm run test` 后，项目中会出现 **coverage** 目录。在浏览器中打开 **lcov-report/index.html** 即可查看报告。

:::note
通常不建议把 **index.html** 提交到 git。在 **.gitignore** 中加入 `coverage/**/*`，防止它被纳入版本控制。
:::

## Jest 流程（可选）

可以用不同的流程来运行测试。示例脚本：

```json package.json
"scripts": {
  "test": "jest --watch --coverage=false --changedSince=origin/main",
  "testDebug": "jest -o --watch --coverage=false",
  "testFinal": "jest",
  "updateSnapshots": "jest -u --coverage=false"
  ...
}
```

详见 Jest 文档中的 [CLI Options](https://jestjs.io/docs/en/cli)。

## 更多信息

- [React Native Testing Library 文档](https://callstack.github.io/react-native-testing-library/docs/start/quick-start) —— 测试工具、推荐的测试实践以及与 Jest 的配合。
- [Expo Router 测试配置](/router/reference/testing) —— 为使用 Expo Router 的应用创建集成测试。
- [使用 EAS Workflows 进行 E2E 测试](/eas/workflows/examples/e2e-tests) —— 在 EAS Workflows 上用 Maestro 设置并运行 E2E 测试。
