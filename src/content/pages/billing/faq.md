---
title: 套餐、账单与付款常见问题
description: 关于 Expo Application Services (EAS) 套餐、账单和付款的常见问题参考。
---

# 套餐、账单与付款常见问题

本页涵盖关于 [Expo Application Services (EAS)](/eas) 套餐、账单和付款的常见问题。

## 套餐

### 如何更新我的套餐？

要更新组织账户的套餐，请确认你拥有 [Owner 或 Admin 角色权限](/accounts/account-types#管理访问权限)。对于个人账户，你始终拥有 **Owner** 角色。更多信息见[更改成员角色](/accounts/account-types#更改成员角色)。

确认角色之后，升级请见[升级到新套餐](/billing/manage#升级到新套餐)，降级现有套餐请见[降级套餐](/billing/manage#降级套餐)。

### 如何取消套餐？

更多信息见[取消套餐](/billing/manage#取消套餐)。

### 如果我从错误的账户订阅了怎么办？

如果你从错误的账户订阅了套餐：

- 在 EAS 仪表板侧边栏中，点击顶部的账户切换器，选择你打算订阅的账户。
- 前往 [Billing](https://expo.dev/settings/billing)，在 **Current Plan** 下[按照步骤订阅正确的套餐](/billing/manage#升级到新套餐)。
- 从错误的账户前往 **[Receipts](https://expo.dev/accounts/[account]/settings/receipts)**，并发起[退款申请](/billing/invoices-and-receipts#申请退款)。

### 我使用的是 Free 套餐，只需要少量额外构建或更新

如果你使用的是 Free 套餐，并且已经用完每月免费构建和更新配额，请升级到 [Starter 套餐](/billing/plans)。每月 19 美元，你获得 45 美元的构建额度，以及 3,000 个 EAS Update 月活跃用户（Free 套餐为 1,000 个）。需求满足之后，可以[从 Starter 套餐降回 Free 套餐](/billing/manage#取消套餐)。

从 Free 套餐升级到 Starter 套餐，见[升级到新套餐](/billing/manage#升级到新套餐)。

从 Starter 降到 Free 套餐，见[取消套餐](/billing/manage#取消套餐)。

### 用完 Free 套餐的每月配额后会发生什么？

Free 套餐账户不会产生超额费用。一旦用完每月免费构建配额，在配额于下一个日历月的第一天重置之前，无法进行新的构建。要不等待重置就继续构建，请升级到 [Starter 套餐](/billing/plans)，或[在本地运行构建](/build-reference/local-builds)。

### 我用完了付费套餐的 EAS Build 额度。可以降到 Free 套餐来使用免费构建额度吗？

不可以。如果你订阅了付费套餐并用完了所含的 EAS Build 额度，额外构建会按[按用量计费](/billing/usage-based-pricing)收费。

如果取消订阅，Free 套餐会在当前计费周期结束后生效。付费订阅结束且账户处于 Free 套餐后，你可以使用 Free 套餐的每月配额（受其限额和重置时间表约束）。更多细节见[取消套餐](/billing/manage#取消套餐)。

### 升级到付费订阅时，可以转移未使用的免费套餐额度吗？

不可以，免费套餐额度不能转移到其他订阅套餐。所有付费套餐都提供额度，以便为 EAS Build 启用优先构建，并通过更多月活跃用户和额外带宽扩大对 EAS Update 的访问。

## 账单

### 套餐的计费周期从何时开始？

对于 Free 套餐，计费周期从日历月的第一天开始。

对于[所有付费套餐](/billing/plans#套餐)，计费周期从该套餐的订阅日期开始。

### 如何更新账单信息或添加税号？

要更新组织账户的账单信息或添加税号，请确认你拥有 [Owner 或 Admin 角色](/accounts/account-types#管理访问权限)。对于个人账户，你始终拥有 **Owner** 角色。确认角色之后：

- 前往[账户的 Billing](https://expo.dev/settings/billing)，在右侧边栏点击 **Manage billing**。这会进入 Stripe 门户。
- 在 Stripe 门户的 **Billing information** 下，点击 **Update information**，更新账单名称、电子邮件、地址和税号等与账单相关的信息。

更多细节见[管理账单信息](/billing/manage#管理账单信息)。

### 可以更新上一张发票上的账单信息吗？

不可以。更新账单信息只会反映在下一张发票上。

### 可以把收据用电子邮件发给我吗？

不可以。账户的 Owner 或 Admin 可以下载它们。更多信息见[下载发票](/billing/invoices-and-receipts#下载并查看发票)。

### 如何通过使用 EAS Update 减少 EAS Build 用量？

使用 [EAS Update](/eas-update/introduction) 和[开发构建](/develop/development-builds/introduction) 来测试并部署新代码，而不必创建新构建。对大多数应用来说这是更好的选择，因为 JavaScript 代码的变化比底层原生代码更频繁。你可以用 EAS Update 创建多个测试渠道，减少团队需要创建的额外构建。

你也可以通过 [EAS Workflows 使用指纹](/eas/workflows/examples/deploy-to-production)，只在 Android 和 iOS 项目的原生代码发生变化时才创建构建。否则，对于仅 JavaScript 的变更，工作流会跳过创建新构建，并通过 EAS Update 发布更新。

更多信息见[如何优化构建用量](/billing/usage-based-pricing#如何优化构建用量)。

### 如何知道自己正在接近用量限额？

当账户达到套餐所含 EAS Build 额度的 80% 和 100% 时，Expo 会自动向账户的 [Owner 和 Admin](/accounts/account-types#管理访问权限) 发送电子邮件通知。更多细节见[用量通知](/billing/usage-based-pricing#用量通知)。

### 如何估算下一张账单？

要估算下一张账单，前往 [Billing](https://expo.dev/settings/billing) 并查看 **Usage** 部分。你会看到基于[资源类](/build/eas-json#选择资源类)的 EAS Build 用量摘要、基于月活跃用户和全球边缘带宽的 EAS Update 用量，以及两者的花费金额。

更多信息见[按用量计费如何工作](/billing/usage-based-pricing#按用量计费如何工作)。

### 什么是 EAS Update 月活跃用户（MAU）？

月活跃用户（MAU）是在单个每月计费周期内，通过 EAS Update 至少下载一次更新的应用的唯一用户。更多信息见[一个计费周期内如何计算每月活跃用户](/eas-update/introduction#每月活跃用户是如何计数的)。

## 付款

### 可以按年付款吗？

年度套餐面向 [Enterprise 套餐](/billing/plans#enterprise) 客户提供。[联系我们](https://expo.dev/contact)了解更多信息。

### 如何更新付款信息？

要更新组织账户的付款信息，请确认你拥有 [Owner 或 Admin 角色](/accounts/account-types#管理访问权限)。对于个人账户，你始终拥有 **Owner** 角色。确认角色之后：

- 前往[账户的 **Billing**](https://expo.dev/settings/billing)，在右侧边栏点击 **Manage billing**。这会进入 Stripe 门户。
- 在 Stripe 门户的 **Payment method** 下，点击 **Add payment method** 添加新的付款方式。

更多细节见[管理账单信息](/billing/manage#付款方式)。

### 可以用自动清算所（ACH）或银行/电汇付款吗？

采用年度套餐的 [Enterprise 套餐](/billing/plans#enterprise) 客户可以用 ACH 作为信用卡付款的替代。[联系我们](https://expo.dev/contact)了解更多信息。

### 我需要 W-9 或其他法律文件

要索取 W-9，请[联系我们](https://expo.dev/contact)。

法律条款见 [expo.dev/terms](https://expo.dev/terms)。

### Expo 会存储我的卡信息吗？

不会，Expo 不会。我们使用 Stripe 处理支付系统，由他们存储。更多信息见 [Stripe 如何处理安全](https://docs.stripe.com/security)。

### 这个月一次大型构建我付了多少钱？

要查看一次大型构建的费用，前往 [Billing](https://expo.dev/settings/billing) 并查看 **Usage** 部分。你会看到基于[资源类](/build/eas-json#选择资源类)的 EAS Build 用量摘要以及花费金额。

## 附加项

### 如何提高账户上的构建并发数？

如果你已经订阅了付费 EAS 套餐，可以在 **Billing** 下的 [**Add-ons**](https://expo.dev/settings/billing) 部分购买额外并发。

如果你使用的是 Free 套餐，需要设置付费订阅。[选择新套餐](https://expo.dev/accounts/[account]/settings/billing/cart)。然后在结账页面选择要添加到订阅中的额外并发数量。

每个套餐包含的并发数不同。如果需要超过 5 个额外并发，请[联系我们](https://expo.dev/contact)。
