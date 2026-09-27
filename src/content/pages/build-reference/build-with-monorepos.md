---
title: 在 Monorepo 中设置 EAS Build
description: 了解如何在 Monorepo 中设置 EAS Build。
---

# 在 Monorepo 中设置 EAS Build

要在 Monorepo 中设置 EAS Build，请按下面的标准流程操作：

- 在应用目录的根目录运行所有 EAS CLI 命令。例如，如果项目在 Git 仓库中的路径是 **apps/my-app**，就在该目录下运行 `eas build`。
- 与 EAS Build 相关的所有文件（例如 **eas.json** 和 **credentials.json**）都应放在应用目录的根目录。如果 Monorepo 里有多个应用使用 EAS Build，每个应用目录都有自己的一份这些文件。
- **如果你要在 Monorepo 中构建使用[持续原生生成（CNG）](/workflow/continuous-native-generation)的项目**，请参见[使用 Monorepo](/guides/monorepos)指南。
- 如果项目需要额外的设置，请在项目的 **package.json** 中添加 `postinstall` 步骤，构建其他工作区中所有必要的依赖。例如：

```json package.json
{
  "scripts": {
    "postinstall": "cd ../.. && yarn build"
  }
}
```
