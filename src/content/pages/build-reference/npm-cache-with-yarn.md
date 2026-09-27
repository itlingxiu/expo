---
title: 在 Yarn 1（Classic）中使用 npm 缓存
description: 了解如何在 Yarn 1（Classic）中通过覆盖 registry 来使用 npm 缓存。
---

# 在 Yarn 1（Classic）中使用 npm 缓存

默认情况下，EAS 的 npm 缓存无法与 Yarn 1（Classic）配合使用，因为 **yarn.lock** 文件里每个库都包含指向 registry 的 URL。Yarn 1 没有提供覆盖这些 URL 的方法，Yarn 团队也不计划在 Yarn 1 中支持这一能力。该问题已在 Yarn 2+ 中修复。

如果要在 Yarn 1 中使用 npm 缓存，请在 **package.json** 中添加 [`eas-build-pre-install` npm 钩子](/build-reference/npm-hooks)，在 **yarn.lock** 里覆盖 registry：

```json package.json
{
  "scripts": {
    "eas-build-pre-install": "bash -c \"[ ! -z \\\"$EAS_BUILD_NPM_CACHE_URL\\\" ] && sed -i -e \\\"s#https://registry.yarnpkg.com#$EAS_BUILD_NPM_CACHE_URL#g\\\" yarn.lock\" || true"
  }
}
```
