---
title: 管理套餐与账单
description: 了解如何升级、降级或取消 Expo 账户的套餐，并管理账单详情。
---

# 管理套餐与账单

EAS 仪表板中的 **Billing** 提供账户当前订阅套餐和每月用量的信息。它也允许你管理套餐和账单详情。

本指南说明如何管理账户的套餐和账单信息。

## 管理套餐

### 查看当前套餐

- 在 **Subscription** 下的导航菜单中点击 [Billing](https://expo.dev/settings/billing)。
- 在 **Current Plan** 下，可以看到账户的当前套餐。

例如，下面的账户订阅了 Free 套餐：

![EAS 仪表板的账单页面显示组织账户的当前套餐。](/static/images/billing/management/billing-02.png)

### 升级到新套餐

要升级到不同的套餐：

- 在 EAS 仪表板的导航菜单中点击 [Billing](https://expo.dev/settings/billing)。
- 在 **Current Plan** 下，如果你已经在付费套餐上，点击 **Change Plan**。如果你在 Free 套餐上，点击 **See plans** > **Select your account**。这会打开 **Upgrade plan** 弹窗。
- 在 **Upgrade plan** 下，可以看到所有可用套餐的列表。选择要升级到的套餐，并点击该套餐下的 **Upgrade** 按钮。

![EAS 仪表板的账单页面显示可升级的套餐列表。](/static/images/billing/management/billing-03.png)

- 在 **Checkout** 上，系统会要求你输入电子邮件、卡信息和账单地址。添加这些信息后，点击 **Pay Now** 订阅新套餐。

### 降级套餐

如果你使用的是 Production、Enterprise 或 Legacy 套餐，可以降级到 Starter 套餐。

降级到 Starter 套餐会在当前计费周期结束后生效。

要降级，前往 [Billing](https://expo.dev/settings/billing) 并按下面的步骤操作：

- 在 **Current Plan** 下，点击 **Change Plan**。

![EAS 仪表板的账单页面显示用于降级套餐的 Change Plan 按钮。](/static/images/billing/management/billing-05.png)

- 在 **Select account** 下，从下拉菜单中选择要降级的账户。

- 在 **Upgrade plan** > **Starter plan** 下，点击 **Change**。

![EAS 仪表板的账单页面显示用于降级套餐的 Change Plan 按钮。](/static/images/billing/management/billing-06.png)

- 会显示确认对话框。点击 **Done**。

![EAS 仪表板的账单页面显示降级套餐的确认对话框。](/static/images/billing/management/billing-08.png)

- 确认账户将套餐降级到 Starter 之后，同样的信息也会反映在 **Billing** > **Upcoming Plan** 下。

![EAS 仪表板的账单页面显示所选降级套餐的复核页面。](/static/images/billing/management/billing-09.png)

### 取消套餐

:::tabs
:::tab 从 Production 或 Enterprise 套餐
从 Production 或 Enterprise 套餐取消会在当前计费周期结束后生效。

要取消套餐，在 [Billing](https://expo.dev/settings/billing) 上，于 **Cancel all subscriptions** 下点击 **Continue to Stripe**，按照当前套餐的取消流程操作。

![EAS 仪表板的账单页面显示用于取消套餐的 Cancel Plan 按钮。](/static/images/billing/management/billing-12.png)
:::
:::tab 从 Starter 到 Free 套餐
Starter 套餐的取消会在当前计费周期结束后生效。

要取消套餐，在 [Billing](https://expo.dev/settings/billing) 上，于 **Cancel all subscriptions** 下按照提示取消订阅。

![EAS 仪表板的账单页面显示用于取消套餐的 Cancel Plan 按钮。](/static/images/billing/management/billing-11.png)

:::note
如果取消订阅 **Starter 套餐**，当前计费周期内产生的任何用量都会向你收费。
:::
:::
:::

## 管理账单信息

你可以管理与账单相关的详情，例如名称、电子邮件、地址和付款信息，或添加税号。所有这些信息都会出现在你为所订阅套餐收到的[月度发票](/billing/invoices-and-receipts)上。

### 更新账单名称、电子邮件或地址

要更新账单名称、电子邮件或地址：

- 在 [Billing](https://expo.dev/settings/billing) 上，于 **Manage billing information** 下点击 **Manage billing**。这会打开 Stripe 门户，你可以在其中查看付款方式、账单信息、发票历史，并更新账单信息。然后点击 **Update information**。

![EAS 仪表板的账单页面显示用于更新账单详情的 Update billing information 按钮。](/static/images/billing/management/billing-13.png)

- 输入新的名称、电子邮件或地址来更新账单详情，然后点击 **Save**。

![在 Billing information 上输入新的名称、电子邮件或地址，并点击 Save 以更新账单详情。](/static/images/billing/management/billing-14.png)

### 税号

要添加或更新账单税号：

- 在 [Billing](https://expo.dev/settings/billing) 上，于 **Manage billing information** 下点击 **Manage billing**。这会打开 Stripe 门户，你可以在其中查看并更新账单信息。然后点击 **Update information**。

![EAS 仪表板的账单页面显示用于更新账单详情的 Update billing information 按钮。](/static/images/billing/management/billing-13.png)

- 在 **Tax ID** 下选择 ID 类型，输入有效的税号，然后点击 **Save**。

![在 Billing information 上输入新的税号，并点击 Save 以更新账单详情。](/static/images/billing/management/billing-15.png)

### 付款方式

要添加新的付款方式信息：

- 在 [Billing](https://expo.dev/settings/billing) 上，于 **Manage billing information** 下点击 **Manage billing**。这会打开 Stripe 门户，你可以在其中查看并更新账单信息。
- 在 **Payment method** 下，点击 **Add payment method** 添加新的付款方式。

![在 Billing information 上可以添加新的付款方式。](/static/images/billing/management/payment-01.png)

- 输入新的付款方式详情并点击 **Add**。

![在添加新付款方式时，输入新的付款方式详情。](/static/images/billing/management/payment-02.png)
