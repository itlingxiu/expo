---
title: 使用危险 mod
description: 了解危险 mod 以及如何在配置插件中应用它们。
---

# 使用危险 mod

## 概览

危险 mod（dangerous mods）使用字符串操作与正则表达式直接访问原生项目文件。现有的 mod 插件仍是推荐路线；危险 mod 被描述为标准 mod 插件无法处理的改动的"逃生舱"。

#### 为什么它们被认为是危险的？

直接自动编辑源代码通常难以组合。如果一个危险 mod 替换了文本，而后面的 mod 依赖原始文本 —— 例如作为正则表达式的锚点 —— 结果很可能不是预期的，并且取决于它的写法，可能抛出错误或只是记录日志。其他 mod 类别不太容易出现此问题，但直接触及源文件的 mod（如 `withAndroidManifest` 与 `withPodfile`）仍可能发生。

标准 mod 可以安全地重复运行；危险 mod "很少保证幂等"。重复执行同一个危险 mod 可能产生不同的输出、重复修改或损坏目标文件。

## 何时使用危险 mod

- **标准 mod 无法完成修改**：所需的改动不在现有 mod 插件（如 [`withAndroidManifest`](/develop/config-plugins/mods#android)、[`withPodfile`](/develop/config-plugins/mods#ios) 等）的覆盖范围内，或某个库要求标准插件不处理的特定原生编辑。
- **旧版 Expo SDK 兼容性**：面向缺少所需 mod 插件的旧 Expo SDK。
- **需要用正则表达式或替换函数修改文本**：现有 mod 插件不支持的复杂文本编辑。Expo 本身在内部使用危险 mod 进行大型文件系统重构，例如库重命名时。

## 如何使用危险 mod

下面示例的插件可以通过[创建配置插件一节](/develop/config-plugins/plugins#creating-a-config-plugin)的标准配置插件用法直接在项目中使用。不过，因为现有的 [`withPodfile`](/develop/config-plugins/mods#ios) mod 插件已经存在，它并非必需 —— 示例仅作演示。

场景：一个配置插件，编辑原生 **ios** 目录中的文件。这对持续原生生成很有用：原生 **ios/Podfile** 每次运行 `npx expo prebuild`（手动或通过 EAS Build）时都会更新。当没有现有 mod 插件可以编辑并更新原生目录中的文件时，这是理想场景。

假设插件位于项目的 **plugins** 目录中，按照[创建配置插件一节](/develop/config-plugins/plugins#creating-a-config-plugin)的第 3、4、5 步：

```tsx withCustomPodfile.ts
import { ConfigPlugin, IOSConfig, withDangerousMod } from 'expo/config-plugins';
import fs from 'fs/promises';
import path from 'path';

const withCustomPodfile: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      try {
        let contents = await fs.readFile(podfilePath, 'utf8');
        const projectName = IOSConfig.XcodeUtils.getProjectName(config.modRequest.projectRoot);

        contents = addCustomPod(contents, projectName);
        await fs.writeFile(podfilePath, contents);

        console.log('✅ Successfully added custom pod to Podfile');
      } catch (error) {
        console.warn('⚠️ Podfile not found, skipping modification');
      }

      return config;
    },
  ]);
};

function addCustomPod(contents: string, projectName: string): string {
  if (contents.includes("pod 'Alamofire'")) {
    console.log('Alamofire pod already exists, skipping');
    return contents;
  }

  const targetRegex = new RegExp(
    `(target ['"]${projectName}['"] do[\\s\\S]*?use_expo_modules!)`,
    'm'
  );

  return contents.replace(targetRegex, `$1\n  pod 'Alamofire', '~> 5.6'`);
}

export default withCustomPodfile;
```

这个插件在 prebuild 期间向项目的原生 **ios/Podfile** 添加一个 CocoaPod 依赖。`withDangerousMod` 授予直接的原生文件系统访问权，并在原生项目生成之后、CocoaPod 依赖安装之前运行。**Podfile** 需要直接文本操作，由 `addCustomMod` 函数内的正则表达式处理；依赖必须落在特定位置，即 `use_expo_modules!` 语句之后。

## `withDangerousMod` 语法与要求

要求列表：

1. 一个原生平台（**android** 或 **ios**）
2. 一个异步函数，接收带有文件系统访问权的 `config` 对象
3. 原生目录内的相对文件名/路径
4. 读取现有文件，修改内容，写回
5. （可选）prebuild 运行期间自定义成功/失败日志消息

骨架：

```tsx
import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import fs from 'fs/promises';
import path from 'path';

const myPlugin: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'platform', // 1. "ios" | "android"
    async config => {
      // 2. Async modification function
      // 3. Build file paths
      const filePath = path.join(
        config.modRequest.platformProjectRoot, // Native project root
        'path/to/file' // Relative path to target file
      );

      try {
        // 4. Read existing file, modify its contents, and write back to the file
        let contents = await fs.readFile(filePath, 'utf8');
        contents = modifyContents(contents);
        await fs.writeFile(filePath, contents);

        // 5. Log success and failure states
        console.log('✅ Successfully modified file');
      } catch (error) {
        console.warn('⚠️ File modification failed:', error);
      }

      return config;
    },
  ]);
};

// Helper functions to use regex to modify the contents of the file
```

### 配置插件中可用的路径

| 路径 | 类型 | 描述 |
| --- | --- | --- |
| `config.modRequest.projectRoot` | `string` | 应用范围的项目根目录，包含 **package.json**；用于解析资源、读取 **package.json** 与跨平台操作。确认该目录存在并包含 **package.json**。 |
| `config.modRequest.platformProjectRoot` | `string` | 平台专属根目录（**projectRoot/android** 或 **projectRoot/ios**），用于原生文件编辑；确认平台目录位于主根目录之下。 |
| `config.modRequest.projectName` | `string` | 仅 iOS。用于构建 iOS 路径的项目名组件（例如 **projectRoot/ios/[projectName]/**）；应与实际 Xcode 项目结构匹配。 |
| `config.modRequest.introspect` | `boolean` | 是否处于内省（introspection）模式，此时不应修改文件系统；mod 只应读取/分析。用于配置分析与校验。 |
| `config.modRequest.ignoreExistingNativeFiles` | `boolean` | 是否忽略现有原生文件。适用于基于模板的操作，特别是 entitlements 与其他原生配置，以符合 prebuild 的预期。 |

## 使用危险 mod 时的注意事项

- **幂等性保证有限。** 标准 mod 通常是幂等的，无需 clean 标志也能工作；危险 mod "很少保证幂等"，因此重复运行可能表现不同或引发问题。
- **实验性且易损坏。** 谨慎对待 `withDangerousMod`，因为它可能改变；每个 SDK 版本都要彻底测试，因为原生模板的更改经常破坏这些 mod。
- **使用标准 mod 插件。** Android 与 iOS 提供 `withAndroidManifest`、`withPodfile`、`withPodfileProperties` 等插件处理常见原生文件更改。只有在没有[现有 mod 插件](/develop/config-plugins/mods#available-mod-plugins)适用时才使用危险 mod。
- **不要假设文件存在。** 读/写之前检查原生目录与相对路径。使用 CNG 时你随时可以运行 `npx expo prebuild` 生成 **android**/**ios** 并手动验证。
- **危险 mod 先运行。** 它们的执行顺序可能不可靠，因为它们在其他修改器之前运行，这可能损害构建的可预测性并导致冲突。
