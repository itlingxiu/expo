---
title: 查看付款历史、发票与收据
description: 了解如何查看账户的付款历史、下载发票和收据，以及为某笔收费申请退款。
---

# 查看付款历史、发票与收据

EAS 仪表板中的 **Receipts** 提供账户付款历史的信息，以及发票和收据的访问入口。它也提供付款日期、付款状态和该笔付款总额的信息。如果你认为某笔收费有误，也可以申请退款。

:::note
只有拥有账户的 [Owner 或 Admin 访问权限](/accounts/account-types#管理访问权限)时，才能访问 **Receipts**。
:::

## 收据

要查看账户的付款历史，在 **Subscription** 下的导航菜单中点击 [Receipts](https://expo.dev/settings/receipts)。

例如，下面显示的是一个[组织账户](/accounts/account-types#组织)的收据：

![EAS 仪表板中的收据页面。](/static/images/billing/receipts-01.png)

### 下载并查看发票

要下载并查看某个计费周期的发票，前往 [Receipts](https://expo.dev/settings/receipts) 并：

- 点击与该发票对应的计费周期的 **Date**。你会被带到 Stripe 托管的页面。例如，下面 2024 年 3 月 22 日的发票会链接到该页面：

![Stripe 仪表板中显示的下载发票。](/static/images/billing/receipts-02.png)

- 点击 **Download invoice**。你会收到该发票的 PDF 副本。

### 下载并查看收据

要下载并查看某个计费周期的收据，前往 [Receipts](https://expo.dev/settings/receipts) 并：

- 点击与该收据对应的计费周期的 **Date**。你会被带到 Stripe 托管的相应收据。例如，下面 2024 年 3 月 22 日的收据会链接到该页面：

![Stripe 仪表板中显示的下载收据。](/static/images/billing/receipts-02.png)

- 点击 **Download receipt**。你会收到该收据的 PDF 副本。

### 申请退款

你可以直接从 [Receipts](https://expo.dev/settings/receipts) 页面申请退款。审批过程是人工的，我们的团队会在退款前调查任何错误。

要申请退款：

- 在某张收据旁边，点击三点菜单，然后点击 **Request Refund**：

![EAS 仪表板中的收据页面。](/static/images/billing/receipts-04.png)

- 在 **Request a refund** 表单中填写退款详情，然后点击 **Continue**：

![Stripe 仪表板中显示的下载发票。](/static/images/billing/receipts-05.png)

- 我们的账单团队会收到并审核退款申请。退款获批后，金额会记入你的付款方式。退款通常需要 5 到 10 个工作日才能完全处理。

## 阅读发票

发票包含你依法登记的企业名称、地址、税号、发票号、到期日等。它也包括任何收费的说明和应付总额。在典型发票中，收费分为：

- 当前套餐的订阅金额（如果订阅了套餐）
- 任何超额费用（如适用）
- 应用的任何套餐额度

我们用三个不同的例子来理解发票可能是什么样子。如果你订阅了 [Production](/billing/plans#production)、[Enterprise](/billing/plans#enterprise) 或 [Starter](/billing/plans#starter) 套餐，其中一种情况可能适用于你。

### 订阅费用

第一个例子中，发票表格显示 Production 套餐的订阅费用：

| 说明 | 数量 | 单价 | 金额 |
| --- | ---: | ---: | ---: |
| _2025 年 2 月 1 日 - 3 月 1 日_ | | | |
| EAS Build - 构建（Android：25 次 large 和 20 次 medium 构建；iOS：25 次 large 和 20 次 medium 构建） | 1 | $210.00 | $210.00 |
| EAS Build - 套餐额度 | 1 | -$210.00 | -$210.00 |
| _2025 年 3 月 1 日 - 4 月 1 日_ | | | |
| Expo Application Services - Production | 1 | $199.00 | $199.00 |
| **合计（USD）** | | | **$199.00** |

在上面的例子中：

- 第一行描述 2025 年 2 月 1 日至 3 月 1 日计费周期的 EAS Build 用量。它包含该计费周期内创建了多少 Android 和 iOS 构建及其费用的全部细节。
- 第二行描述 2025 年 2 月 1 日至 3 月 1 日计费周期应用的套餐额度（$210）。
- 第三行描述下一个计费周期（2025 年 3 月 1 日至 4 月 1 日）Production 套餐的订阅费用。

由于 EAS Build 用量（$210）没有超过套餐的 $225 额度，订阅者只需支付 Production 套餐的 $199 订阅金额。

### 超额费用

第二个例子中，发票表格显示带超额费用的 Production 套餐订阅费用：

| 说明 | 数量 | 单价 | 金额 |
| --- | ---: | ---: | ---: |
| _2025 年 2 月 1 日 - 3 月 1 日_ | | | |
| EAS Build - 构建（Android：35 次 large；iOS：40 次 large 和 35 次 medium 构建） | 1 | $300.00 | $300.00 |
| EAS Build - 套餐额度 | 1 | -$225.00 | -$225.00 |
| _2025 年 3 月 1 日 - 4 月 1 日_ | | | |
| Expo Application Services - Production | 1 | $199.00 | $199.00 |
| **合计（USD）** | | | **$274.00** |

在上面的例子中：

- 第一行描述 2025 年 2 月 1 日至 3 月 1 日计费周期的 EAS Build 用量。它包含该计费周期内创建了多少 Android 和 iOS 构建及其费用的全部细节。
- 第二行描述 2025 年 2 月 1 日至 3 月 1 日计费周期应用的套餐额度（$225），即 Production 套餐的全部额度。
- 第三行描述下一个计费周期（2025 年 3 月 1 日至 4 月 1 日）Production 套餐的订阅费用。

由于 2025 年 2 月 1 日至 3 月 1 日计费周期的 EAS Build 用量超过了套餐额度，订阅者必须支付超额费用，以及下一个计费周期 Production 套餐的订阅金额。

### Starter 费用

第三个例子中，订阅者使用的是 Starter 套餐。计费周期内产生的任何费用都会列在发票上：

| 说明 | 数量 | 单价 | 金额 |
| --- | ---: | ---: | ---: |
| _2025 年 2 月 1 日 - 3 月 1 日_ | | | |
| EAS Build - 构建（Android：10 次 medium 构建；iOS：10 次 medium 构建） | 1 | $30.00 | $30.00 |
| EAS Build - 套餐额度 | 1 | -$30.00 | -$30.00 |
| _2025 年 3 月 1 日 - 4 月 1 日_ | | | |
| Expo Application Services - Starter | 1 | $19.00 | $19.00 |
| **合计（USD）** | | | **$19.00** |

在上面的例子中：

- 第一行描述 2025 年 2 月 1 日至 3 月 1 日计费周期的 EAS Build 用量。它包含该计费周期内创建的 Android 和 iOS 构建数量及其费用的全部细节。
- 第二行描述 2025 年 2 月 1 日至 3 月 1 日计费周期应用的套餐额度（$30）。
- 第三行描述下一个计费周期（2025 年 3 月 1 日至 4 月 1 日）Starter 套餐的订阅费用。

由于 EAS Build 用量（$30）没有超过套餐的 $45 额度，订阅者只需支付 Starter 套餐的 $19 订阅金额。
