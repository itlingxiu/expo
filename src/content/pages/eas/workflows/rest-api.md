---
title: Workflows REST API
description: 用 EAS REST API 从你自己的系统触发工作流并检查其状态。
---

# Workflows REST API

EAS REST API 提供用于触发工作流和读取运行详情的端点。所有端点都位于 `https://api.expo.dev` 之下。请求和响应都是 JSON。

## 认证

两个端点都需要 EAS 访问令牌，作为 bearer 令牌放在 `Authorization` 头中。

对于生产集成，在拥有该项目的账户上创建一个[机器人用户](/accounts/programmatic-access#机器人用户与访问令牌)，并给它一个限定范围的角色。然后该令牌代表机器人用户，而不是一个人。你可以撤销它而不影响任何用户。[个人访问令牌](/accounts/programmatic-access#个人访问令牌)也适用于一次性脚本。

```text
Authorization: Bearer <EXPO_TOKEN>
Content-Type: application/json
```

## 触发工作流

```text
POST /v2/workflows/dispatch
```

在给定的 Git ref 上解析工作流文件，根据工作流中声明的 `workflow_dispatch` schema 校验 `inputs`，并把一次新运行加入队列。

### 请求体

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `appId` | string (UUID) | 是 | EAS 项目 ID。在项目页面或[应用配置](/workflow/configuration)的 `extra.eas.projectId` 下可以找到它。 |
| `gitRef` | string | 是 | 分支名（`main`）、标签（`v1.0.0`）、提交 SHA，或完全限定的 ref（`refs/heads/main`、`refs/tags/v1.0.0`）。 |
| `fileName` | string | 是 | 仅工作流文件名，例如 **deploy.yml**。不要包含 **.eas/workflows/** 前缀或任何其他路径段。 |
| `inputs` | object | 否 | 工作流文件中 `on.workflow_dispatch.inputs` 下声明的输入值。会根据所声明的 schema 校验。 |

### 响应

返回 `200 OK`，以及新的工作流运行 ID 和仪表盘中该次运行的链接：

```json
{
  "data": {
    "id": "019d9d17-013a-7e05-89aa-4aa83ff68c32",
    "url": "https://expo.dev/accounts/acme/projects/example/workflows/019d9d17-013a-7e05-89aa-4aa83ff68c32"
  }
}
```

### 示例

```sh
curl -X POST "https://api.expo.dev/v2/workflows/dispatch" \
    -H "Authorization: Bearer $EXPO_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "appId": "a415eac6-231a-4b38-b481-3255a59f13b8",
      "gitRef": "main",
      "fileName": "deploy.yml",
      "inputs": { "environment": "production" }
    }'
```

### 错误

| 状态 | 原因 |
| --- | --- |
| 400 | 请求体未通过 schema 校验，或 `inputs` 与工作流所声明的 schema 不匹配。 |
| 403 | 该令牌无权访问给定的 `appId`。 |
| 404 | 关联仓库中不存在该 Git ref，或在该 ref 上找不到工作流文件。 |

## 获取工作流运行

```text
GET /v2/workflows/runs/:workflowRunId
```

返回工作流运行及其包含的作业。在触发运行后用此端点轮询完成情况，或在你自己的 UI 中渲染运行详情。

### 响应

```json
{
  "data": {
    "id": "019d9d17-013a-7e05-89aa-4aa83ff68c32",
    "status": "in-progress",
    "url": "https://expo.dev/accounts/acme/projects/example/workflows/019d9d17-013a-7e05-89aa-4aa83ff68c32",
    "gitCommitHash": "564b61ebdd403d28b5dc616a12ce160b91585b5b",
    "gitCommitMessage": "Add home screen",
    "requestedGitRef": "refs/heads/main",
    "triggerEventType": "MANUAL",
    "createdAt": "2026-05-22T15:04:11.000Z",
    "updatedAt": "2026-05-22T15:05:42.000Z",
    "jobs": [
      {
        "id": "019d9d17-1a3f-7c10-bdee-5f2811a9d6ad",
        "key": "build_ios",
        "name": "Build iOS",
        "type": "build",
        "status": "in-progress",
        "requiredJobKeys": [],
        "environment": "production",
        "outputs": {},
        "errors": [],
        "buildId": "f9609423-5072-4ea2-a0a5-c345eedf2c2a",
        "submissionId": null,
        "createdAt": "2026-05-22T15:04:11.000Z",
        "updatedAt": "2026-05-22T15:04:42.000Z"
      }
    ]
  }
}
```

运行的 `status` 是以下之一：

| 值 | 含义 |
| --- | --- |
| `new` | 运行已排队，尚未开始。 |
| `in-progress` | 至少有一个作业正在运行。 |
| `action-required` | 运行已暂停，正在等待手动操作，例如批准。 |
| `success` | 运行已结束，并且每个作业都成功。终态。 |
| `failure` | 运行已结束，并且至少有一个作业失败。终态。 |
| `canceled` | 运行在结束前被取消。终态。 |

`jobs` 中的每一项都包含自己的 `status`，取值为：

| 值 | 含义 |
| --- | --- |
| `new` | 作业已排队。 |
| `in-progress` | 作业正在运行。 |
| `action-required` | 作业已暂停，正在等待手动操作，例如批准。 |
| `pending-cancel` | 已请求取消，但作业尚未停止。 |
| `success` | 作业成功。终态。 |
| `failure` | 作业失败。终态。 |
| `canceled` | 作业被取消。终态。 |
| `skipped` | 因为必需的上游作业没有成功，作业被跳过。 |

`outputs` 包含作业在工作流文件中用 `outputs:` 设置的任何值。任何被引用的密钥在响应中都显示为占位符。`type: build` 的作业包含 `buildId`，`type: submission` 的作业包含 `submissionId`。每个 ID 都链接到底层的 EAS Build 或 EAS Submit 记录。

### 示例

把下面的内容保存为 shell 脚本（或粘贴到终端中），以触发一次运行并轮询直到它到达终态：

```bash
RUN_ID=$(curl -s -X POST "https://api.expo.dev/v2/workflows/dispatch" \
  -H "Authorization: Bearer $EXPO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"appId":"...","gitRef":"main","fileName":"deploy.yml"}' \
  | jq -r '.data.id')

while true; do
  STATUS=$(curl -s "https://api.expo.dev/v2/workflows/runs/$RUN_ID" \
    -H "Authorization: Bearer $EXPO_TOKEN" \
    | jq -r '.data.status')
  echo "status: $STATUS"
  case "$STATUS" in
    success|failure|canceled) break ;;
  esac
  sleep 10
done
```

### 错误

| 状态 | 原因 |
| --- | --- |
| 400 | `workflowRunId` 不是有效的 UUID。 |
| 403 | 该令牌无权访问该运行的项目。 |
| 404 | 不存在具有该 ID 的工作流运行。 |

## 下一步

- [工作流语法](/eas/workflows/syntax)：工作流 YAML 文件的参考，包括 `workflow_dispatch` 触发器和输入 schema。
