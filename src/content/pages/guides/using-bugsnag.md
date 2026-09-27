---
title: 使用 BugSnag
description: 安装与配置 BugSnag 以进行端到端错误报告与分析的指南。
---

# 使用 BugSnag

[BugSnag](https://www.bugsnag.com) 是稳定性监控方案，提供丰富的端到端错误报告与分析，帮助你快速、精确地复现并修复错误。BugSnag 通过开源库支持全栈，覆盖超过 [50 个平台](https://www.bugsnag.com/platforms)，其中包括 [React Native](https://docs.bugsnag.com/platforms/react-native/react-native/)。

借助 BugSnag，开发者与工程组织可以：

- **稳定：** 知道何时该做新功能、何时该修缺陷，从而更快创新。使用发布健康仪表盘、稳定性分数与目标，以及通过邮件、Slack、PagerDuty 等内置告警。
- **排序：** 找出并对稳定性影响最大的缺陷排优先级，从而改善客户体验。按根因分组问题，并按业务影响、客户分群、A/B 测试与实验结果排序。
- **修复：** 减少复现和修复缺陷的时间，从而提高效率。利用强大的诊断数据、完整堆栈跟踪和自动面包屑。

## 集成

下面的集成指南说明如何把 BugSnag 添加到 Expo 应用以报告 JavaScript 错误。其中也包括为使用 [EAS Update](/eas-update/introduction) 发布的更新上传 source map 的说明。

如果你是 BugSnag 新用户，可以[创建账户](https://app.bugsnag.com/user/new/)或[申请演示](https://www.bugsnag.com/demo-request)。

- [Expo BugSnag 集成](https://docs.bugsnag.com/platforms/react-native/expo/) —— 查看把 BugSnag 集成到 Expo 应用的官方指南。
