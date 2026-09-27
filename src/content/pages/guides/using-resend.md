---
title: 使用 Resend
description: 了解如何在 Expo 与 React Native 应用中集成 Resend，通过 Expo Router 的 API 路由以编程方式发送邮件。
---

# 使用 Resend

[Resend](https://resend.com/) 是面向开发者的邮件 API 平台。它允许你通过 API 以编程方式发送、接收和管理邮件。你可以把它用于新闻通讯、营销邮件等场景的事务性邮件。该 API 还允许为邮件事件设置 webhook、管理域名以提高送达率，以及通过 webhook 接收邮件。

本指南演示**把 Resend 集成到 Expo 与 React Native 项目的必要步骤**。

- [如何从 Expo 应用用 Resend 发送邮件](https://www.youtube.com/watch?v=8sPD8SNcUFA) —— 把 Resend 与 Expo Router API 路由集成，以编程方式发送邮件并部署到 EAS Hosting。

## 前置条件

- **使用 Expo Router 的项目** —— 如果还没有，参见 [Expo Router 安装](/router/installation)。
- **Expo 账户** —— 使用 EAS Hosting 部署 API 路由需要 [Expo 账户](https://expo.dev/signup)。
- **全局安装 EAS CLI** —— 用 `npm install -g eas-cli` 安装 [EAS CLI](/eas/cli)。
- **Resend 账户** —— 在 [resend.com](https://resend.com/) 注册。

1. ## 创建 Resend API 密钥

前往 [Resend 仪表盘](https://resend.com/api-keys) > **API Keys**，点击 **Create API Key** 生成 API 密钥。

生成 API 密钥后，把它保存到 Expo 项目的 **.env.local** 文件：

```shell .env.local
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

:::note
不要把 **.env.local** 文件提交到 Git 等版本控制系统（VCS）。API 密钥是敏感信息，不应公开。必须把该文件加入 **.gitignore** 以忽略它。
:::

2. ## 安装 Resend SDK

在 Expo 项目中，用以下命令安装 Resend SDK：

:::tabs
:::tab npm
```sh
npx expo install resend
```
:::
:::tab yarn
```sh
yarn expo install resend
```
:::
:::tab pnpm
```sh
pnpm expo install resend
```
:::
:::tab bun
```sh
bun expo install resend
```
:::
:::

resend SDK 库是仅服务器库。它允许从应用的服务端代码发送邮件。由于本指南使用 [API 路由](/router/web/api-routes)处理邮件提交，需要把 resend 作为 Expo 项目的一部分安装。

3. ## 启用并创建 API 路由

要在 Expo 项目中启用 API 路由，需要在[应用配置](/workflow/configuration)文件中把 web.output 设为 server：

```json app.json
{
  "web": {
    "output": "server"
  }
}
```

然后[创建 API 路由](/router/web/api-routes#create-an-api-route)来处理邮件提交。在 **src/app** 目录中新建名为 **api/audience+api.ts** 的文件。`+api.ts` 扩展名被 Expo Router 用来把该文件识别为 API 路由。要测试集成，可以添加下面的最少代码，用 Resend SDK 向收件人发送邮件：

```tsx src/app/api/audience+api.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return Response.json({ success: false });
  }

  await resend.contacts.create({
    email: email,
    // 自行提供动态值
    firstName: 'Steve',
    lastName: 'Wozniak',
    unsubscribed: false,
  });

  return Response.json({ success: true });
}
```

在上面的代码片段中，当匹配到 `/api/audience` 路由时会执行 `POST` [请求函数](/router/web/api-routes#request-body)。该函数接收一个 `Request` 对象作为参数，其中包含 HTTP 请求体。然后函数从请求体中提取 `email`，并把它发送到 Resend API，以添加到受众中。

4. ## 添加基础 URL

要让 Expo 应用能访问 API 路由，需要在 Expo 项目中把基础 URL 添加为环境变量。把以下内容添加到 **.env.local** 文件：

```shell .env.local
EXPO_PUBLIC_BASE_URL=https://example-resend.expo.app # 通过 EAS Hosting 部署后的 URL
EXPO_PUBLIC_BASE_URL_LOCAL=http://localhost:8081 # 仅本地测试需要
```

要在本地测试 Resend 集成，可以使用 `EXPO_PUBLIC_BASE_URL_LOCAL` 指向本地开发服务器，其 URL 在运行 `npx expo start` 时提供。本指南后面把应用部署到 EAS Hosting 时，请务必将 `EXPO_PUBLIC_BASE_URL` 更新为部署后的 URL。

请注意，只有以 `EXPO_PUBLIC_` 为前缀的变量才能在前端代码中使用，因此可以在同一个 **.env** 文件中同时放上面的变量和 Resend API 密钥，但 `RESEND_API_KEY` 只能从服务端代码访问（即以 **+api** 结尾的文件）。

5. ## 向 Expo 项目添加表单

下面的示例代码展示一个简单表单，用于收集应用用户的电子邮件地址。在真实场景中，你会希望为表单添加校验和错误处理。例如，把以下代码添加到 **src/app/index.tsx** 文件：

```tsx src/app/index.tsx
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!email) {
      alert('Email is required.');
      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL_LOCAL}/api/audience`, // 部署到 EAS Hosting 后切换为 `EXPO_PUBLIC_BASE_URL`
        {
          method: 'POST',
          body: JSON.stringify({ email }),
        }
      );

      // 可以在这里处理其他响应校验。

      await response.json();

      Alert.alert('Success', 'Email sent successfully.', [
        {
          text: 'Continue',
        },
      ]);
    } catch (error) {
      alert('Something went wrong.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        ref={inputRef}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send email</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '60%',
    height: '6%',
    borderRadius: 10,
    marginBottom: 10,
    margin: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#000000',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
```

6. ## 把 API 路由部署到 EAS Hosting

要让 API 路由（`/api/audience`）能通过 URL 访问，可以把它部署到 [EAS Hosting](/eas/hosting/get-started)。

1. 运行以下命令导出 Web 和 API 资源。导出的文件保存在 **dist** 目录中，API 路由文件是该目录的一部分：

:::tabs
:::tab npm
```sh
npx expo export --platform web
```
:::
:::tab yarn
```sh
yarn expo export --platform web
```
:::
:::tab pnpm
```sh
pnpm expo export --platform web
```
:::
:::tab bun
```sh
bun expo export --platform web
```
:::
:::

2. 运行以下命令，通过 EAS Hosting 创建生产部署：

```sh
eas deploy --prod
```

`eas deploy --prod` 命令会：

- 如果你还没有 EAS 项目，会自动创建一个
- 提示你选择项目的预览 URL。请确保该 URL 与 **.env.local** 文件中 `EXPO_PUBLIC_BASE_URL` 的值相同。这样在生产环境部署后，Expo 应用就能访问 API 路由

:::note
部署之前，需要在表单页面（**src/app/index.tsx**）中把 `EXPO_PUBLIC_BASE_URL` 用作托管域名。
:::

## 进一步了解 Resend

有关 Resend API 与用法的更多信息，参见 [Resend 官方文档](https://resend.com/docs/introduction)。
