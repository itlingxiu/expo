---
title: 顶层 src 目录
description: 了解如何在 Expo Router 项目中使用顶层 src 目录。
---

# 顶层 src 目录

使用 SDK 55 及更高版本的[默认模板](/get-started/create-a-project)创建的项目，已经包含顶层 **src** 目录，其中有 **app**、**components**、**constants** 和 **hooks** 目录。无需额外配置。

如果使用的是[自定义模板](/more/create-expo#--template)，或现有项目没有 **src** 目录，请按以下步骤设置。

## 使用顶层 src 目录

1. 将 **app** 目录移动到 **src/app**。

   ```text
   src/app/_layout.tsx
   src/app/index.tsx
   src/components/button.tsx
   package.json
   ```

2. 更新 **tsconfig.json** 中的 [TypeScript 路径别名](/guides/typescript#路径别名可选)，使其指向 **src** 目录而不是根目录。如果使用默认的 `@/*` 别名，将其设为 **./src/\***：

   ```json tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

   这样把应用目录移入 **src** 之后，`@/` 导入仍然可用。

3. 重启开发服务器。

   :::tabs
   :::tab npm
   ```sh
   npx expo start

   # 或导出用于生产环境
   npx expo export
   ```
   :::
   :::tab yarn
   ```sh
   yarn expo start

   # 或导出用于生产环境
   yarn expo export
   ```
   :::
   :::tab pnpm
   ```sh
   pnpm expo start

   # 或导出用于生产环境
   pnpm expo export
   ```
   :::
   :::tab bun
   ```sh
   bun expo start

   # 或导出用于生产环境
   bun expo export
   ```
   :::
   :::

### 说明

- 配置文件（**app.config.ts**、**app.json**、**package.json**、**metro.config.js**、**tsconfig.json**）应留在根目录。
- **src/app** 目录的优先级高于根目录下的 **app**。如果两者都存在，只会使用 **src/app**。
- **public** 目录应留在根目录。
- 如果存在 **src/app** 目录，静态渲染会自动使用它。
- 可以考虑把所有[类型别名](/guides/typescript#路径别名可选)改为指向 **src** 目录，而不是根目录。

## 自定义目录

:::warning
强烈不建议更改默认根目录。我们不会受理使用自定义根目录的项目的 bug 报告。
:::

可以使用 Expo Router 配置插件危险地自定义根目录。下面的配置会把根目录改为相对于项目根目录的 **src/routes**。

```json app.json
{
  "plugins": [
    [
      "expo-router",
      {
        "root": "./src/routes"
      }
    ]
  ]
}
```

这可能导致意外行为。许多工具假定根目录是 **app** 或 **src/app**。只有与当前 Expo CLI 版本完全一致的工具才会尊重该配置插件。
