---
title: Webhook
description: 了解如何配置 webhook，以便在 EAS Build 和 Submit 完成时收到提醒。
---

# Webhook

EAS 可以在构建或提交完成时立即通过 webhook 提醒你。Webhook 需要按项目配置。例如，如果你想同时为 `@johndoe/awesomeApp` 和 `@johndoe/coolApp` 收到提醒，请在每个目录中运行命令：

```sh
eas webhook:create
```

运行之后，系统会提示你选择 webhook 事件类型（除非你提供 `--event BUILD|SUBMIT` 参数）。接下来，提供处理 HTTP POST 请求的 webhook URL（或用 `--url` 标志指定它）。此外，如果你还没有用 `--secret` 标志提供 webhook 签名密钥，你必须输入一个。它必须至少 16 个字符，并将用于计算请求体的签名，我们把该签名作为 `expo-signature` HTTP 头的值发送。你可以使用[签名来验证 webhook 请求](#webhook-服务器)是真实的。

EAS 使用 HTTP POST 请求调用你的 webhook。所有数据都在请求体中传递。EAS 以 JSON 对象发送数据。如果 webhook 以 200–399 范围之外的 HTTP 状态码响应，投递会以指数退避再尝试几次。

此外，我们会发送一个 `expo-signature` HTTP 头，其中是载荷的哈希签名。你可以用此签名验证请求的真实性。该签名是请求体的十六进制编码 HMAC-SHA1 摘要，使用你的 webhook 密钥作为 HMAC 密钥。

> 如果你想在本地测试上面的 webhook，可以使用 [ngrok](https://ngrok.com/docs) 等服务通过隧道转发 `localhost:8080`，并用 `ngrok` 给你的 URL 使它可公开访问。

你可以随时运行以下命令更改 webhook URL 和/或 webhook 密钥：

```sh
eas webhook:update --id WEBHOOK_ID
```

你可以运行以下命令找到 webhook ID：

```sh
eas webhook:list
```

如果你希望我们停止向你的 webhook 发送请求，运行下面的命令并从列表中选择该 webhook：

```sh
eas webhook:delete
```

## Webhook 载荷

<details>
<summary>构建 webhook 载荷</summary>

构建 webhook 载荷可能如下例所示：

```json
{
  "id": "147a3212-49fd-446f-b4e3-a6519acf264a",
  "accountName": "dsokal",
  "projectName": "example",
  "buildDetailsPageUrl": "https://expo.dev/accounts/dsokal/projects/example/builds/147a3212-49fd-446f-b4e3-a6519acf264a",
  "parentBuildId": "75ac0be7-0d90-46d5-80ec-9423fa0aaa6b", // 构建重试时可用
  "appId": "bc0a82de-65a5-4497-ad86-54ff1f53edf7",
  "initiatingUserId": "d1041496-1a59-423a-8caf-479bb978203a",
  "cancelingUserId": null, // 已取消的构建可用
  "platform": "android", // 或 "ios"
  "status": "errored", // 或："finished"、"canceled"
  "artifacts": {
    "buildUrl": "https://expo.dev/artifacts/eas/wyodu9tua2ZuKKiaJ1Nbkn.aab", // 成功的构建可用
    "logsS3KeyPrefix": "production/f9609423-5072-4ea2-a0a5-c345eedf2c2a"
  },
  "metadata": {
    "appName": "example",
    "username": "dsokal",
    "workflow": "managed",
    "appVersion": "1.0.2",
    "appBuildVersion": "123",
    "cliVersion": "0.37.0",
    "sdkVersion": "41.0.0",
    "buildProfile": "production",
    "distribution": "store",
    "appIdentifier": "com.expo.example",
    "gitCommitHash": "564b61ebdd403d28b5dc616a12ce160b91585b5b",
    "gitCommitMessage": "Add home screen",
    "runtimeVersion": "1.0.2",
    "channel": "default", // EAS Update 可用
    "releaseChannel": "default", // 旧版更新可用
    "reactNativeVersion": "0.60.0",
    "trackingContext": {
      "platform": "android",
      "account_id": "7c34cbf1-efd4-4964-84a1-c13ed297aaf9",
      "dev_client": false,
      "project_id": "bc0a82de-65a5-4497-ad86-54ff1f53edf7",
      "tracking_id": "a3fdefa7-d129-42f2-9432-912050ab0f10",
      "project_type": "managed",
      "dev_client_version": "0.6.2"
    },
    "credentialsSource": "remote",
    "isGitWorkingTreeDirty": false,
    "message": "release build", // 附加到构建的消息
    "runFromCI": false
  },
  "metrics": {
    "memory": 895070208,
    "buildEndTimestamp": 1637747861168,
    "totalDiskReadBytes": 692224,
    "buildStartTimestamp": 1637747834445,
    "totalDiskWriteBytes": 14409728,
    "cpuActiveMilliseconds": 12117.540078,
    "buildEnqueuedTimestamp": 1637747792476,
    "totalNetworkEgressBytes": 355352,
    "totalNetworkIngressBytes": 78781667
  },
  // 失败的构建可用
  "error": {
    "message": "Unknown error. Please see logs.",
    "errorCode": "UNKNOWN_ERROR"
  },
  "createdAt": "2021-11-24T09:53:01.155Z",
  "enqueuedAt": "2021-11-24T09:53:01.155Z",
  "provisioningStartedAt": "2021-11-24T09:54:01.155Z",
  "workerStartedAt": "2021-11-24T09:54:11.155Z",
  "completedAt": "2021-11-24T09:57:42.715Z",
  "updatedAt": "2021-11-24T09:57:42.715Z",
  "expirationDate": "2021-12-24T09:53:01.155Z",
  "priority": "high", // 或："normal"、"low"
  "resourceClass": "android-n2-1.3-12",
  "actualResourceClass": "android-n2-1.3-12",
  "maxRetryTimeMinutes": 3600 // 失败/已取消构建的最大重试时间
}
```

</details>

<details>
<summary>提交 webhook 载荷</summary>

提交 webhook 载荷可能如下例所示：

```json
{
  "id": "0374430d-7776-44ad-be7d-8513629adc54",
  "accountName": "dsokal",
  "projectName": "example",
  "submissionDetailsPageUrl": "https://expo.dev/accounts/dsokal/projects/example/builds/0374430d-7776-44ad-be7d-8513629adc54",
  "parentSubmissionId": "75ac0be7-0d90-46d5-80ec-9423fa0aaa6b", // 提交重试时可用
  "appId": "23c0e405-d282-4399-b280-5689c3e1ea85",
  "archiveUrl": "http://archive.url/abc.apk",
  "initiatingUserId": "7bee4c21-3eaa-4011-a0fd-3678b6537f47",
  "cancelingUserId": null, // 已取消的提交可用
  "turtleBuildId": "8c84111e-6d39-449c-9895-071d85fd3e61", // 从 EAS 提交构建时可用
  "platform": "android", // 或 "ios"
  "status": "errored", // 或："finished"、"canceled"
  "submissionInfo": {
    // 失败的提交可用
    "error": {
      "message": "Android version code needs to be updated",
      "errorCode": "SUBMISSION_SERVICE_ANDROID_OLD_VERSION_CODE_ERROR"
    },
    "logsUrl": "https://submission-service-logs.s3-us-west-1.amazonaws.com/production/submission_728aa20b-f7a9-4da7-9b64-39911d427b19.txt"
  },
  "createdAt": "2021-11-24T10:15:32.822Z",
  "updatedAt": "2021-11-24T10:17:32.822Z",
  "completedAt": "2021-11-24T10:17:32.822Z",
  "maxRetryTimeMinutes": 3600 // 失败/已取消提交的最大重试时间
}
```

</details>

## Webhook 服务器

下面是如何实现你的服务器的示例：

```js server.js
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const safeCompare = require('safe-compare');

const app = express();
app.use(bodyParser.text({ type: '*/*' }));
app.post('/webhook', (req, res) => {
  const expoSignature = req.headers['expo-signature'];
  // process.env.SECRET_WEBHOOK_KEY 必须与用 eas webhook:create 命令设置的 SECRET 值匹配
  const hmac = crypto.createHmac('sha1', process.env.SECRET_WEBHOOK_KEY);
  hmac.update(req.body);
  const hash = `sha1=${hmac.digest('hex')}`;
  if (!safeCompare(expoSignature, hash)) {
    res.status(500).send("Signatures didn't match!");
  } else {
    // 在这里做些事情。例如，向 Slack 发送通知！
    // console.log(req.body);
    res.send('OK!');
  }
});
app.listen(8080, () => console.log('Listening on port 8080'));
```
