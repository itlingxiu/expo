---
title: 配置 EAS Metadata
description: 了解配置 EAS Metadata 的不同方式。
---

# 配置 EAS Metadata

:::warning
**EAS Metadata** 处于 [beta](/more/release-statuses#beta)，可能会有破坏性变更。
:::

EAS Metadata 由项目**根目录**的 **store.config.json** 文件配置。

你可以用 **eas.json** 的 [`metadataPath`](/eas/json#metadatapath) 属性配置商店配置文件的路径或名称。除默认的 JSON 格式外，EAS Metadata 也支持使用 JavaScript 文件的更动态配置。

## 静态商店配置

EAS Metadata 的默认商店配置类型是一个简单的 JSON 文件。下面的代码片段展示了一份用英语（美国）编写的、包含基本 App Store 信息的商店配置示例。

全部配置选项见[商店配置 schema](/eas/metadata/schema)。

> 如果你安装了 [VS Code Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，就可以获得 **store.config.json** 文件的自动补全、建议和警告。

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome App",
        "subtitle": "Your self-made awesome app",
        "description": "The most awesome app you have ever seen",
        "keywords": ["awesome", "app"],
        "marketingUrl": "https://example.com/en/promo",
        "supportUrl": "https://example.com/en/support",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

## 动态商店配置

有时，Metadata 属性可以从动态值中受益。例如，Metadata 的**版权声明**应当包含当前年份。这可以用 EAS Metadata 自动化。

要动态生成内容，先创建 JavaScript 配置文件 **store.config.js**。然后在 **eas.json** 文件中使用 [`metadataPath`](/eas/json#metadatapath) 属性来选择该 JS 配置文件。

> `eas metadata:pull` 无法更新动态商店配置文件。它会创建一个与所配置文件同名的 JSON 文件。你可以导入该 JSON 文件，以复用 `eas metadata:pull` 的数据。

:::tabs
:::tab store.config.js
```js store.config.js
// 使用来自 eas metadata:pull 的数据
const config = require('./store.config.json');

const year = new Date().getFullYear();
config.apple.copyright = `${year} Acme, Inc.`;

module.exports = config;
```
:::
:::tab eas.json
```json eas.json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```
:::
:::

## 带有外部内容的商店配置

使用外部服务做本地化时，你必须获取外部内容。EAS Metadata 支持从动态商店配置文件导出的同步和异步函数。函数结果会在校验并与商店同步之前被 await。

> **store.config.js** 函数在 Node.js 中求值。如果你需要密钥等特殊值，请使用环境变量。

:::tabs
:::tab store.config.js
```js store.config.js
// 使用来自 eas metadata:pull 的数据
const config = require('./store.config.json');

module.exports = async () => {
  const year = new Date().getFullYear();
  const info = await fetchLocalizations('...').then(response => response.json());

  config.apple.copyright = `${year} Acme, Inc.`;
  config.apple.info = info;

  return config;
};
```
:::
:::tab eas.json
```json eas.json
{
  "submit": {
    "production": {
      "ios": {
        "metadataPath": "./store.config.js"
      }
    }
  }
}
```
:::
:::
