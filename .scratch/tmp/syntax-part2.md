
#### `after`

当前作业的 `after` 列表中指定的所有上游作业的记录。每个作业提供：

```json
{
  "status": "success" | "failure" | "skipped",
  /* 每个作业产生不同的一组输出。细节见特定作业的文档。 */
  "outputs": {}
}
```

示例：

```yaml
jobs:
  build:
    type: build
    params:
      platform: ios
  notify:
    after: [build]
    steps:
      - run: echo "Build status: ${{ after.build.status }}"
```

#### `needs`

当前作业的 `needs` 列表中指定的所有上游作业的记录。每个作业提供：

```json
{
  "status": "success" | "failure" | "skipped",
  /* 每个作业产生不同的一组输出。细节见特定作业的文档。 */
  "outputs": {}
}
```

大多数预置作业会暴露特定输出。你可以[在自定义作业中使用 `set-output` 函数设置输出](#jobsjob_idoutputs)。

示例：

```yaml
jobs:
  setup:
    outputs:
      date: ${{ steps.current_date.outputs.date }}
    steps:
      - id: current_date
        run: |
          DATE=$(date +"%Y.%-m.%-d")
          set-output date "$DATE"

  build_ios:
    needs: [setup]
    type: build
    env:
      # 你可以使用 process.env.VERSION_SUFFIX 在动态应用配置中自定义应用版本。
      VERSION_SUFFIX: ${{ needs.setup.outputs.date }}
    params:
      platform: ios
      profile: development
```

#### `steps`

当前作业中所有步骤的记录。每个步骤使用 [`set-output`](#set-output) 函数提供其输出。

:::note
`steps` 上下文只在作业的步骤内可用，而不是在工作流级别。要把步骤的输出暴露给其他作业，使用 [`set-output`](#set-output) 函数和[作业的 `outputs` 配置](#jobsjob_idoutputs)。
:::

示例：

```yaml
jobs:
  my_job:
    outputs:
      value: ${{ steps.step_1.outputs.value }}
    steps:
      - id: step_1
        run: set-output value "hello"
      - run: echo ${{ steps.step_1.outputs.value }}

  another_job:
    needs: [my_job]
    steps:
      - run: echo "Value: ${{ needs.my_job.outputs.value }}"
```

#### `inputs`

使用 [`workflow_dispatch`](#onworkflow_dispatchinputs) 手动触发工作流时提供的输入记录。当工作流通过带输入参数的 `eas workflow:run` 命令触发时可用。

示例：

```yaml
on:
  workflow_dispatch:
    inputs:
      name:
        type: string
        required: true

jobs:
  greet:
    steps:
      - run: echo "Hello, ${{ inputs.name }}!"
```

#### `github`

为了便于从 GitHub Actions 迁移到 EAS Workflows，我们暴露了一些你可能会觉得有用的上下文字段。

```ts
type GitHubContext = {
  triggering_actor?: string;
  event_name: 'pull_request' | 'push' | 'schedule' | 'workflow_dispatch';
  sha: string;
  ref: string; // 例如 refs/heads/main
  ref_name: string; // 例如 main
  ref_type: 'branch' | 'tag' | 'other';
  commit_message?: string; // 仅用于 push 和 schedule 事件
  label?: string;
  repository?: string;
  repository_owner?: string;
  event?: {
    action?: string;
    label?: {
      name: string;
    };
    // 仅用于 push 和 schedule 事件
    head_commit?: {
      message: string;
      id: string;
    };
    pull_request?: {
      number: number;
      title: string;
      body: string | null;
      state: 'open' | 'closed';
      draft: boolean;
      merged: boolean | null;
      // ... GitHub Pull Request webhook 载荷中的其他字段
    };
    comment?: {
      body: string;
      // ... GitHub issue_comment webhook 载荷中的其他字段
    };
    changes?: {
      base?: {
        ref?: {
          from: string;
        };
      };
    };
    number?: number;
    schedule?: string;
    inputs?: Record<string, string | number | boolean>;
  };
};
```

:::note
`event` 对象包含完整的 [GitHub webhook 载荷](https://docs.github.com/en/webhooks/webhook-events-and-payloads)。对于 `pull_request` 事件，`event.pull_request` 包含 GitHub Pull Request webhook 载荷中的字段，例如 `github.event.pull_request.title` 和 `github.event.pull_request.body`。对于已编辑的拉取请求事件，`github.event.changes` 包含发生变化的字段，例如基分支变化时的 `github.event.changes.base.ref.from`。对于 `pull_request_comment` 事件，`event.comment.body` 包含评论文本，`event.pull_request.number` 和 `event.number` 包含拉取请求编号。上面的类型列出了一些有用字段，但 `user`、`labels`、`milestone` 等其他字段也同样可用。
:::

如果工作流运行是从 `eas workflow:run` 启动的，其 `event_name` 将是 `workflow_dispatch`，其余所有属性都为空。

示例：

```yaml
jobs:
  build_ios:
    type: build
    if: ${{ github.ref_name == 'main' }}
    params:
      platform: ios
      profile: production
```

- [${{ github }} 上下文](https://github.com/expo/eas-cli/blob/main/packages/eas-build-job/src/common.ts)：查看 `${{ github }}` 定义的源代码。

#### `workflow`

关于当前工作流的信息。

```ts
type WorkflowContext = {
  id: string;
  name: string;
  filename: string;
  url: string;
};
```

示例：

```yaml
jobs:
  notify_slack:
    after: [...]
    type: slack
    params:
      message: |
        Workflow run completed: ${{ workflow.name }}
        View details: ${{ workflow.url }}
```

#### `app`

工作流所针对的 EAS 项目的信息。此上下文在每次工作流运行中都可用。

```ts
type AppContext = {
  id: string;
  slug: string;
};
```

示例：

```yaml
jobs:
  print_context:
    steps:
      - run: echo "Project ${{ app.slug }} (${{ app.id }})"
```

#### `account`

拥有该项目的账户的信息。此上下文在每次工作流运行中都可用。

```ts
type AccountContext = {
  id: string;
  name: string;
};
```

示例：

```yaml
jobs:
  print_context:
    steps:
      - run: echo "Account ${{ account.name }} (${{ account.id }})"
```

#### `app_store_connect`

与工作流运行关联的 App Store Connect 实体的信息。此上下文只对由 App Store Connect 事件触发的工作流可用。见 [`on.app_store_connect`](#onapp_store_connect)。

```ts
type AppStoreConnectContext = {
  app: {
    id: string;
  };
  build_upload?: {
    id: string;
    state: 'awaiting_upload' | 'processing' | 'failed' | 'complete';
    cf_bundle_version?: string;
    cf_bundle_short_version_string?: string;
    platform?: string;
    uploaded_date?: string;
    created_date?: string;
    build?: {
      id: string;
    };
  };
  app_version?: {
    id: string;
    state: string;
  };
  external_beta?: {
    id: string;
    state: string;
  };
  beta_feedback?: {
    id: string;
    type: 'crash' | 'screenshot';
    url: string;
  };
};
```

只有当工作流由 `build_upload` 事件域触发时，`app_store_connect.build_upload` 对象才会存在。

示例：

```yaml
on:
  app_store_connect:
    build_upload:
      states:
        - complete

jobs:
  notify:
    type: slack
    params:
      webhook_url: ${{ env.SLACK_WEBHOOK_URL }}
      message: |
        Upload complete for App Store Connect app: ${{ app_store_connect.app.id }}
        Upload ID: ${{ app_store_connect.build_upload.id }}
        Upload state: ${{ app_store_connect.build_upload.state }}
        Version: ${{ app_store_connect.build_upload.cf_bundle_short_version_string }} (${{ app_store_connect.build_upload.cf_bundle_version }})
```

把 `build_upload.build.id` 用作 `testflight` 作业的 `asc_build_id`：

```yaml .eas/workflows/testflight-after-asc-upload.yml
name: Distribute to TestFlight after ASC upload

on:
  app_store_connect:
    build_upload:
      states:
        - complete

jobs:
  distribute_to_testflight:
    name: Distribute to TestFlight
    type: testflight
    params:
      asc_build_id: ${{ app_store_connect.build_upload.build.id }}
      internal_groups:
        - QA Team
      external_groups:
        - Public Beta
      changelog: |
        Build ${{ app_store_connect.build_upload.cf_bundle_version }} is ready for testing.
      submit_beta_review: true
```

#### `env`

当前作业上下文中可用的环境变量记录。

:::note
`env` 上下文只在作业的上下文中可用，而不是在工作流级别。
:::

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "API URL: ${{ env.API_URL }}"
```

<a id="context-functions"></a>

### 上下文函数

以下函数在插值上下文中可用：

#### `success()`

返回之前的所有作业是否都已成功。

```yaml
jobs:
  notify:
    if: ${{ success() }}
    steps:
      - run: echo "All jobs succeeded"
```

#### `failure()`

返回之前是否有任何作业失败。

```yaml
jobs:
  notify:
    if: ${{ failure() }}
    steps:
      - run: echo "A job failed"
```

#### `fromJSON(value)`

解析 JSON 字符串。等价于 `JSON.parse()`。

示例：

```yaml
jobs:
  publish_update:
    type: update

  print_debug_info:
    needs: [publish_update]
    steps:
      - run: |
          echo "First update group: ${{ needs.publish_update.outputs.first_update_group_id }}"
          echo "Second update group: ${{ fromJSON(needs.publish_update.outputs.updates_json || '[]')[1].group }}"
```

#### `toJSON(value)`

把值转换为 JSON 字符串。等价于 `JSON.stringify()`。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo '${{ toJSON(github.event) }}'
```

#### `contains(value, substring)`

检查 `value` 是否包含 `substring`。

示例：

```yaml
jobs:
  my_job:
    if: ${{ contains(github.ref_name, 'feature') }}
    steps:
      - run: echo "Feature branch"
```

#### `startsWith(value, prefix)`

检查 `value` 是否以 `prefix` 开头。

示例：

```yaml
jobs:
  my_job:
    if: ${{ startsWith(github.ref_name, 'release') }}
    steps:
      - run: echo "Release branch"
```

#### `endsWith(value, suffix)`

检查 `value` 是否以 `suffix` 结尾。

示例：

```yaml
jobs:
  my_job:
    if: ${{ endsWith(github.ref_name, '-production') }}
    steps:
      - run: echo "Production branch"
```

#### `hashFiles(...globs)`

返回匹配所提供 glob 模式的文件的哈希。对缓存键很有用。

:::note
`hashFiles` 函数只在作业的步骤内可用，而不是在工作流级别。
:::

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "Dependencies hash: ${{ hashFiles('package-lock.json', 'yarn.lock') }}"
```

#### `replaceAll(input, stringToReplace, replacementString)`

把 `input` 中所有出现的 `stringToReplace` 替换为 `replacementString`。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ replaceAll(github.ref_name, '/', '-') }}"
```

#### `substring(input, start, end)`

从 `input` 中提取从 `start` 开始、到 `end` 结束的子字符串。如果未提供 `end`，则从 `start` 提取到 `input` 的末尾。底层使用 [`String#substring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)。

示例：

```yaml
jobs:
  my_job:
    steps:
      - run: echo "${{ substring(github.ref_name, 0, 50) }}"
```

## 预置作业

### `jobs.<job_id>.type`

指定要运行的预置作业类型。预置作业会根据作业类型，在工作流详情页上生成专门的 UI。

```yaml
jobs:
  my_job:
    type: build
```

下面介绍不同的预置作业。
