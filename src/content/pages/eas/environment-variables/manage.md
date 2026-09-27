---
title: 在 EAS 中创建和管理环境变量
description: 了解如何使用 EAS 仪表盘和 EAS CLI 创建环境变量、设置作用域并使用它们。
---

# 在 EAS 中创建和管理环境变量

以下各节介绍如何使用 EAS 仪表盘和 EAS CLI 创建环境变量、设置作用域并使用它们。

## 创建环境变量

- [**选择一个或多个环境**](/eas/environment-variables#可用环境)：默认可用 `development`、`preview` 和 `production`。同一个变量可以在这些环境中复用，也可以按环境分别定制。
- [**选择作用域**](/eas/environment-variables#作用域)：项目级变量只作用于一个项目。账户级变量可以在多个项目中复用，并在构建时与项目变量合并。
- [**选择可见性**](/eas/environment-variables#环境变量的可见性设置)：绝不离开 EAS 服务器的值用 **密钥**；可能在本地被查看的值用 **敏感**；非敏感值用 **明文**。

### 在仪表盘中创建变量

要在 EAS 服务器上创建新的环境变量，可以在项目仪表盘中进入 **Project settings** > [**Environment variables**](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)，然后点击 **Add Variables** 按钮。

![EAS 项目仪表盘中的环境变量表单](/static/images/env-vars/creation-form.png)

使用[环境变量创建表单](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)页面设置名称、值、环境、可见性，以及可选的描述。

![创建环境变量的表单](/static/images/env-vars/add.png)

创建后的变量会显示在列表中，并带有作用域、可见性和环境标签。根据本例中的环境变量，列表可能如下所示：

![已成功创建的环境变量列表](/static/images/env-vars/list.png)

在上面的示例列表中：

- `SENTRY_AUTH_TOKEN` 是敏感环境变量。它用于在构建和更新之后向 Sentry 认证以上传 source map，并且必须能在 EAS 服务器之外访问。
- `GOOGLE_SERVICES_JSON` 是密钥环境变量，并使用上传的文件。它用于向 Google 认证以访问 Google Services JSON 文件，并且必须安全地存放在 EAS 服务器上。这个上传的 JSON 文件通常会加入项目的 **.gitignore**。
- 其余变量，例如 `APP_VARIANT` 和 `EXPO_PUBLIC_API_URL`，都是明文环境变量。

### 使用 EAS CLI 创建变量

使用 `eas env:set` 添加变量，使用 `eas env:list` 核对已设置的内容。

```sh
# 示例：为 preview 环境创建新的明文环境变量
eas env:set --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment preview --visibility plaintext

# 示例：列出 preview 环境的全部环境变量
eas env:list --environment preview
```

## 在代码中使用环境变量

### 客户端值

带有 [`EXPO_PUBLIC_`](/guides/environment-variables) 前缀的环境变量，在应用代码中可以作为 `process.env` 变量使用。你可以按它们的值动态配置应用行为：

```tsx
import { Button } from 'react-native';

function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, {
      // ...
    });
  }

  return <Button onPress={onPress} title="Post" />;
}
```

在上面的例子中，`EXPO_PUBLIC_API_URL` 用于动态设置 fetch 请求的 API URL。

:::warning
不要把密钥放进 `EXPO_PUBLIC_` 变量。客户端包中的一切都可以被最终用户读取。
:::

### 构建时与应用配置

没有 `EXPO_PUBLIC_` 前缀的其他变量，可以在解析[应用配置](/workflow/configuration)时用来配置应用行为。例如，`APP_VARIANT` 变量用于决定所选[应用变体](/build-reference/variants)的应用名称、包名和 bundle identifier：

在动态应用配置中使用不带此前缀的变量。如果需要在本地解析配置，可见性至少设为 **敏感**（明文和敏感变量可在 EAS CLI 中读取；密钥留在服务器上）。

```js app.config.js
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.yourname.stickersmash.dev';
  }

  if (IS_PREVIEW) {
    return 'com.yourname.stickersmash.preview';
  }

  return 'com.yourname.stickersmash';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'StickerSmash (Dev)';
  }

  if (IS_PREVIEW) {
    return 'StickerSmash (Preview)';
  }

  return 'StickerSmash: Emoji Stickers';
};

export default {
  // 将 name 属性设为 getAppName()
  name: getAppName(),
  // ...
  ios: {
    // 将 bundleIdentifier 属性设为 getUniqueIdentifier()
    bundleIdentifier: getUniqueIdentifier(),
    // ...
  },
  android: {
    // 将 package 属性设为 getUniqueIdentifier()
    package: getUniqueIdentifier(),
    // ...
  },
};
```

### 密钥与文件变量

例如 `GOOGLE_SERVICES_JSON` 这类环境变量是密钥文件变量，在 EAS 服务器之外不可读，用于把被 git 忽略的 **google-services.json** 文件提供给 EAS Build 作业。要在应用配置中使用它，可以使用 `process.env` 变量，并在变量未设置时提供回退值（本地开发时，这个文件通常就在项目仓库里）：

```js app.config.js
export default {
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? '/local/path/to/google-services.json',
  },
};
```

## 管理环境变量

你可以在项目或账户中使用 [EAS 仪表盘](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)创建、更新和删除环境变量。

也可以使用 EAS CLI 管理它们。下面的命令以 `production` 环境为例。使用这些命令时，把 `production` 换成你要管理的环境。

```sh
# 创建或更新环境变量
eas env:set --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment production --visibility plaintext

# 删除已有的环境变量
eas env:delete

# 列出全部环境变量
eas env:list --environment production

# 把环境变量拉取到 .env 文件
eas env:pull --environment production
```

:::tip
关于上述命令的更多信息，请参阅 [EAS CLI 命令参考](https://github.com/expo/eas-cli/blob/main/packages/eas-cli/README.md)。
:::

### 拉取变量用于本地开发

在本地开发中使用 EAS 环境变量的高效方式，是用 `eas env:pull --environment environment-name` 命令把它们拉取到 **.env** 文件：

例如，要把 `production` 环境的环境变量拉取到 **.env** 文件，可以运行：

```sh
eas env:pull --environment production
```

生成的文件可能如下所示：

```bash .env.local
# 环境：production

APP_VARIANT=development
EXPO_PUBLIC_API_URL=https://staging.my-api-url.mycompany.com
# GOOGLE_SERVICES_JSON=*****（密钥变量不可读取）
SENTRY_AUTH_TOKEN=token
```

:::tip
把生成的 **.env** 文件加入 **.gitignore**，以免泄露，也避免本地作业与云端作业之间的优先级冲突。
:::

你也可以使用 EAS 仪表盘中的 **Export** 选项下载该文件，并把它放进项目。

![从 EAS 仪表盘把环境变量导出为 .env 文件](/static/images/env-vars/export.png)

## 自定义环境

:::warning
创建自定义环境适用于 [Enterprise 和 Production](/billing/plans#方案) 方案。
:::

三种默认环境对大多数场景已经足够。如果你的项目依赖复杂工作流，并且需要更灵活地创建更多环境，自定义环境会很有用。

### 在 EAS 仪表盘中创建自定义环境

在 EAS 仪表盘中创建自定义环境：

- 在项目中进入 **Project settings** > [**Environment variables**](https://expo.dev/accounts/[account]/projects/[project]/environment-variables)，然后点击 **Add Variables** 按钮。
- 在 **Environments** 下，点击 **加号（+）图标**，输入自定义环境的名称。

![在 EAS 项目仪表盘中创建自定义环境](/static/images/env-vars/custom-environment.png)

- 创建该环境后，它会在 **Custom environments** 部分被预先选中。
- 只要至少有一个环境变量关联到这个环境，它就会作为该账户或项目中所有环境变量的可选项出现。

### 使用 EAS CLI 创建自定义环境

要把环境变量分配给自定义环境，用你的自定义环境名称代替环境参数。例如，下面的命令创建新变量 `EXPO_PUBLIC_API_URL`，并把它分配给自定义的 `staging` 环境：

```sh
eas env:set --name EXPO_PUBLIC_API_URL --value https://example.app/staging --environment staging --visibility plaintext
```
