---
title: 通过 .easignore 忽略文件
description: 了解如何配置 EAS，在构建过程中忽略不必要的文件。
---

# 通过 .easignore 忽略文件

**.easignore** 文件定义了把项目上传到 [EAS Build](/build/introduction) 服务器时，[EAS](https://expo.dev/services) 应忽略哪些文件。

:::note
忽略不必要的文件有助于减小应用归档体积并缩短上传时间。
:::

默认情况下，[EAS CLI](/build/setup#安装最新的-eas-cli) 会参考 [**.gitignore**](https://git-scm.com/docs/gitignore) 文件（如果存在）来决定忽略哪些文件。如果你创建了 **.easignore** 文件，EAS CLI 会优先使用它，而不是 **.gitignore**。创建 **.easignore** 时，应包含 **.gitignore** 中的全部文件和目录，再追加你想额外忽略的文件。

1. 在项目根目录创建 **.easignore** 文件。

2. 把 **.gitignore** 的内容复制到 **.easignore** 中，然后加入构建过程不需要的文件。

   ```bash .easignore
   # 把 .gitignore 里的内容全部复制到这里

   # 忽略 EAS Build 构建应用时不需要的文件和目录
   /docs

   # 忽略原生目录（如果使用 EAS Build）
   /android
   /ios

   # 忽略测试覆盖率报告
   /coverage
   ```

   如果项目中没有 **android** 和 **ios** 目录，[EAS Build 会运行预构建](/workflow/continuous-native-generation#usage-with-eas-build) 来生成这些原生目录，然后再编译。

3. 保存文件并触发一次新构建。

   ```sh
   $ eas build --platform ios --profile development
   ```

你已成功配置 **.easignore** 文件。

## 用 .easignore 把文件加入项目上传

除了忽略 **.gitignore** 之外的更多文件，你也可以用 **.easignore** 把未提交到版本控制的文件随 EAS Build 上传一起带上。如果你有自定义脚本，会在构建开始前生成构建过程所需的临时文件，这一做法就很有用。要把未纳入版本控制的文件上传到 EAS Build，在 **.easignore** 中用 `!` 前缀加入该文件，并保留 **.gitignore** 的其余内容。带 `!` 前缀的那一行应放在最后，这样它会优先于之前会忽略该文件的规则。

```bash .easignore
# 把 .gitignore 里的内容全部复制到这里

/android
/ios

# 包含一个未纳入版本控制的文件
!temp_file.json
```
