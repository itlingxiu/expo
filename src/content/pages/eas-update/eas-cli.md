---
title: 用 EAS CLI 管理分支和 channel
description: 了解如何把分支链接到 channel，并用 EAS CLI 发布更新。
---

# 用 EAS CLI 管理分支和 channel

EAS Update 通过把 _branch_ 链接到 _channel_ 来工作。channel 在构建时指定，并存在于构建的原生代码中。branch 是有序的更新列表，类似于 Git 分支是有序的提交列表。使用 EAS Update，我们可以把任何 channel 链接到任何 branch，从而使不同的更新对不同的构建可用。

![channel "production" 链接到 branch "version-1.0"](/static/images/eas-update/channel-branch-link.png)

上图可视化了这种链接。这里，channel 为 "production" 的构建链接到名为 "version-1.0" 的 branch。准备好之后，我们可以调整 channel 与 branch 的指针。想象我们在名为 "version-2.0" 的 branch 上有更多已测试并准备好的修复。我们可以更新此链接，使 "version-2.0" branch 对所有 channel 为 "production" 的构建可用。

![channel "production" 链接到 branch "version-2.0"](/static/images/eas-update/channel-branch-link-2.png)

## 检查项目更新的状态

### 检查 channel

查看所有 channel：

```sh
$ eas channel:list
```

查看特定 channel：

```sh
$ eas channel:view [channel-name]

# 示例
$ eas channel:view production
```

创建 channel：

```sh
$ eas channel:create [channel-name]

# 示例
$ eas channel:create production
```

### 检查分支

查看所有分支：

```sh
$ eas branch:list
```

查看特定分支及其更新列表：

```sh
$ eas branch:view [branch-name]


# 示例
$ eas branch:view version-1.0
```

### 检查更新

查看特定更新：

```sh
$ eas update:view [update-group-id]

# 示例
$ eas update:view dbfd479f-d981-44ce-8774-f2fbcc386aa
```

## 更改项目更新的状态

### 创建新更新并发布它

```sh
$ eas update --branch [branch-name] --message "..."

# 示例
$ eas update --branch version-1.0 --message "Fixes typo"
```

如果你使用 Git，可以用 `--auto` 标志自动填充分支名称和消息。此标志会把当前 Git 分支用作分支名称，并把最新的 Git 提交消息用作消息。

```sh
$ eas update --auto
```

### 删除分支

```sh
$ eas branch:delete [branch-name]

# 示例
$ eas branch:delete version-1.0
```

### 重命名分支

重命名分支不会断开任何 channel 与 branch 的链接。如果你有一个名为 "production" 的 channel 链接到名为 "version-1.0" 的分支，然后把名为 "version-1.0" 的分支重命名为 "version-1.0-new"，则 "production" channel 会链接到现在改名后的分支 "version-1.0-new"。

```sh
$ eas branch:rename --from [branch-name] --to [branch-name]

# 示例
$ eas branch:rename --from version-1.0 --to version-1.0-new
```

### 在分支内重新发布先前的更新

我们可以让先前的更新立即对所有用户可用。此命令取先前的更新并再次发布它，使它成为该分支上最新的更新。当用户重新打开应用时，应用会看到新重新发布的更新并下载它。

> 重新发布类似于 Git revert，把正确的提交放在 Git 历史的顶部。

```sh
$ eas update:republish --group [update-group-id]
$ eas update:republish --branch [branch-name]

# 示例
$ eas update:republish --group dbfd479f-d981-44ce-8774-f2fbcc386aa
$ eas update:republish --branch version-1.0
```

> 如果你不知道确切的更新组 ID，可以使用 `--branch` 标志。这会显示该分支上最近的更新列表，并允许你选择要重新发布的更新组。

### 暂停 channel 上的更新

暂停 channel 会阻止 EAS Update 向在该 channel 上检查更新的构建提供更新。

暂停是可逆的。取消暂停 channel 时，该 channel 的更新以及任何正在进行的[灰度](/eas-update/rollouts)都会恢复。

```sh
$ eas channel:pause [channel-name]

# 示例
$ eas channel:pause production
```

不带 channel 名称运行该命令，可以从列表中选择一个。在 CI 中，用 `--non-interactive` 传入 channel 名称，或用 `--json` 把 channel 打印为 JSON。`--json` 标志隐含 `--non-interactive`。

<details>
<summary>channel 暂停期间会发生什么？</summary>

- 暂停 channel 上的每个客户端仍会检查更新，但它们不会收到新更新。对于暂停的 channel，EAS 通常以无正文的 HTTP 204 响应，因此这些检查使用的带宽很少。
- 每个客户端继续运行它已经拥有的最新更新。如果客户端从未收到更新的更新，这可能是随构建一起发布的代码。用户看到应用正在运行的内容没有变化。
- 因为没有客户端下载更新，channel 暂停期间[每月活跃用户](/eas-update/introduction#每月活跃用户是如何计数的)的数量不会增加。这使[计费用户](/billing/usage-based-pricing)不会增长。
- `eas channel:view [channel-name]` 和 `eas channel:list` 把 channel 的状态显示为 **Paused**。
- 你可以继续向分支发布更新。它们会照常存储，并在你取消暂停 channel 时变为可用。

暂停作用于单个 channel，因此暂停 `production` 对 `preview` 或 `development` channel 没有影响。生产暂停期间，你可以继续在开发和预览 channel 上发布并测试更新。

</details>

<details>
<summary>暂停 channel 与回滚有何不同？</summary>

暂停让客户端留在当前更新上，并阻止它们接收新更新，而回滚指示客户端运行较旧的更新。

- `eas update:rollback` 和 `eas update:republish` 再次发布先前的更新，使它成为分支上最新的更新。客户端下载该更新并运行它。参见[回滚](/eas-update/rollbacks)。
- 带嵌入式选项的 `eas update:rollback`，也可作为 `eas update:roll-back-to-embedded` 使用，会发布一条指令，告诉客户端停止使用已下载的更新，改为运行构建中嵌入的更新。
- `eas channel:pause` 不发布任何内容，并指示 EAS 不要为指定 channel 发送更新。该 channel 上的客户端继续运行它们当前拥有的最新更新，并且在 channel 取消暂停之前不会收到新更新。

</details>

### 恢复 channel 上的更新

```sh
$ eas channel:resume [channel-name]

# 示例
$ eas channel:resume production
```

通过恢复来取消暂停 channel。该 channel 会开始从与它关联的分支提供更新。该 channel 上的任何灰度都会恢复。当用户打开应用并检查更新时，他们会照常收到最新的兼容更新。
