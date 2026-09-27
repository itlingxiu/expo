---
title: 在 Expo 模块中模拟原生调用
description: 了解如何在 Expo 模块中模拟原生调用。
---

# 在 Expo 模块中模拟原生调用

为 Expo 项目编写单元测试的推荐方式是使用 [Jest](https://jestjs.io/) 和 `jest-expo` preset。

要为使用原生代码的应用编写单元测试，需要模拟原生调用。**模拟（mocking）** 是指用一个不执行任何操作的假实现替换函数的实际实现。这种方法适合在本地计算机上运行单元测试，因为它绕过了对原生代码的需求，而原生代码只能在真实的 Android 或 iOS 设备上运行。

Expo SDK 为我们的每个社区包都包含一组默认模拟。你也可以使用 Jest 内置 API（例如[模拟函数](https://jestjs.io/docs/mock-functions)）自行模拟任何 JS 代码。

不过，为了在你的 Expo 模块中提供默认模拟，我们提供了一种把它们打包进去的方法。这样，当模块用户运行单元测试时，会自动使用模拟实现。

## 为模块提供模拟

创建一个与要模拟的原生模块同名的文件，放在模块的 **mocks** 目录中。确保从这个文件导出模拟实现。
由于 `requireNativeModule` 调用，`jest-expo` preset 会在单元测试运行期间自动返回这些导出的函数。

例如，`expo-clipboard` 库有一个名为 `ExpoClipboard` 的原生模块。你可以在 **mocks** 目录中创建 **ExpoClipboard.ts** 来模拟它。

```ts ExpoClipboard.ts
export async function hasStringAsync(): Promise<boolean> {
  return false;
}
```

现在，在单元测试中调用 `ExpoClipboard.hasStringAsync()` 会返回 `false`。

## 自动生成模拟

如果原生模块有多个方法，维护原生模块的模拟可能工作量很大。为了简化这一点，我们提供了一个脚本，可以在模块的 **mocks** 目录中为所有原生函数自动生成模拟。它可以根据模块中的 Swift 实现生成 TypeScript 和 JavaScript 模拟。仅存在于 Android 上的方法（例如仅 Kotlin 的 API）不会自动生成。在这些情况下，请在 **mocks** 目录中手动添加或调整模拟。

要使用此脚本，需要安装 [SourceKitten](https://github.com/jpsim/SourceKitten) 框架。然后进入模块目录（模块的 **expo-module.config.json** 所在位置），运行 `generate-ts-mocks` 命令。

```sh
$ brew install sourcekitten
$ npx expo-modules-test-core generate-ts-mocks
```

上面的命令会在模块的 **mocks** 目录中生成 **ExpoModuleName.ts**。它包含模块中每个原生方法和视图的模拟实现。

:::tip
也可以运行 `generate-js-mocks` 来生成 JavaScript 模拟。
:::

## 使用模拟模块进行单元测试

为原生模块创建模拟之后，就可以编写全面的单元测试，验证 JavaScript 代码是否正确调用原生函数并妥善处理其响应。例如，运行 `npx expo-modules-test-core generate-ts-mocks` 命令后，会在 **example-module/mocks** 目录中生成类似下面示例的模拟：

```ts example-module/mocks/ExpoModuleName.ts
/**
 * 由 expo-modules-test-core 自动生成。
 *
 * 此自动生成的文件为原生 Expo 模块提供模拟，
 * 并且可以与 expo 的 jest preset 开箱即用。
 *
 */

export type URL = any;

export function hello(): any {}

export async function setValueAsync(value: string): Promise<any> {}

export type ViewProps = {
  url: URL;
  onLoad: (event: any) => void;
};

export function View(props: ViewProps) {}
```

以下各节中的示例使用来自 Expo SDK 模块的真实测试技术，演示了全面的单元测试模式，例如 [`expo-clipboard`](https://github.com/expo/expo/blob/main/packages/expo-clipboard/src/__tests__/Clipboard-test.native.ts)、[`expo-screen-capture`](https://github.com/expo/expo/blob/main/packages/expo-screen-capture/src/__tests__/ScreenCaptureHook-test.native.js) 和 [`expo-app-integrity`](https://github.com/expo/expo/blob/main/packages/expo-app-integrity/src/__tests__/ExpoAppIntegrity-test.native.ts)。

### 基本测试设置

在源文件旁边的 **\_\_tests\_\_** 目录中创建测试文件。导入你的模块和被模拟的原生模块来编写断言：

```js MyModule.test.js
import * as MyModule from '../MyModule';
import ExpoMyModule from '../ExpoMyModule';

describe('MyModule', () => {
  it('calls native module with correct parameters', async () => {
    await MyModule.doSomething('test-param');
    expect(ExpoMyModule.doSomething).toHaveBeenCalledWith('test-param');
  });
});
```

### 测试函数调用和返回值

使用 Jest 的模拟断言方法，验证 JavaScript 函数是否正确地委托给原生实现：

```js MyModule.test.js
describe('Module functionality', () => {
  it('delegates to native implementation', () => {
    MyModule.setData('test-data');
    expect(ExpoMyModule.setDataAsync).toHaveBeenCalledWith('test-data', {});
  });

  it('handles async operations', async () => {
    await expect(MyModule.getDataAsync()).resolves.not.toThrow();
  });

  it('verifies call count', () => {
    MyModule.performAction();
    MyModule.performAction();
    expect(ExpoMyModule.performAction).toHaveBeenCalledTimes(2);
  });
});
```

### 测试使用原生模块的 React hooks

测试使用原生模块的 React hooks 时，使用 React Testing Library 的 [`renderHook`](https://testing-library.com/docs/react-testing-library/api/#renderhook) 函数：

```js useMyHook.test.js
import { renderHook } from '@testing-library/react-native';
import { useMyHook } from '../useMyHook';
import ExpoMyModule from '../ExpoMyModule';

jest.mock('../ExpoMyModule', () => ({
  startOperation: jest.fn().mockResolvedValue(),
  stopOperation: jest.fn().mockResolvedValue(),
}));

describe('useMyHook', () => {
  it('calls native methods on mount and unmount', async () => {
    const hook = await renderHook(useMyHook);
    expect(ExpoMyModule.startOperation).toHaveBeenCalledTimes(1);

    await hook.unmount();
    expect(ExpoMyModule.stopOperation).toHaveBeenCalledTimes(1);
  });

  it('handles parameter changes', async () => {
    const hook = await renderHook(useMyHook, { initialProps: 'param1' });

    await hook.rerender('param2');

    expect(ExpoMyModule.startOperation).toHaveBeenCalledTimes(2);
    expect(ExpoMyModule.stopOperation).toHaveBeenCalledTimes(1);
  });
});
```

### 最佳实践

- **在测试之间清理**：使用 `beforeEach` 或 `afterEach` 重置模拟，避免测试互相污染。
- **测试边界情况**：验证原生函数抛出错误或返回意外值时的行为。
- **使用描述性的测试名称**：编写能说明所验证的具体行为的测试描述。
- **对相关测试分组**：使用 `describe` 块按功能或组件组织测试。

## 更多

- [使用 Jest 进行单元测试](/develop/unit-testing) — 了解如何设置和配置 `jest-expo` 包，为项目编写单元测试和快照测试。
